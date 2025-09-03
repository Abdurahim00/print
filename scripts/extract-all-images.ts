import { MongoClient } from 'mongodb'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI!
const DATABASE_NAME = 'printwrap-pro'

interface ImageData {
  sku: string
  title: string
  images: string[]
  mainImage: string
}

function cleanText(text: string): string {
  if (!text) return ''
  return text
    .replace(/Ã¤/g, 'ä').replace(/Ã¶/g, 'ö').replace(/Ã¥/g, 'å')
    .replace(/Ã„/g, 'Ä').replace(/Ã–/g, 'Ö').replace(/Ã…/g, 'Å')
    .replace(/Ã©/g, 'é').replace(/Â°/g, '°')
    .replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    .replace(/\\n/g, ' ').replace(/\\r/g, '').replace(/\\t/g, ' ')
    .trim()
}

async function extractAllImages() {
  console.log('=== ULTRA DEEP IMAGE EXTRACTION ===')
  console.log('Reading JSON file...')
  
  const filePath = path.join(process.cwd(), 'prendo_unique_combine_output.json')
  const content = fs.readFileSync(filePath, 'latin1')
  const cleanedContent = cleanText(content)
  
  // Map to store all found images by SKU
  const imageMap = new Map<string, ImageData>()
  
  console.log('Extracting all products with EVERY possible image...')
  
  // More comprehensive regex to capture entire product objects
  const productPattern = /\{[^{}]*"Url"\s*:\s*"[^"]*"[^{}]*"Title"\s*:\s*"([^"]*)"[^{}]*"Article_no"\s*:\s*"([^"]*)"[^{}]*\}/gs
  
  let matches = cleanedContent.matchAll(productPattern)
  let count = 0
  
  for (const match of matches) {
    const productStr = match[0]
    const title = match[1] || ''
    const sku = match[2] || ''
    
    if (!sku) continue
    
    const images: string[] = []
    
    // Extract from image_urls array
    const imageUrlsMatch = productStr.match(/"image_urls"\s*:\s*\[([^\]]*)\]/s)
    if (imageUrlsMatch && imageUrlsMatch[1]) {
      const urlContent = imageUrlsMatch[1]
      const urlMatches = urlContent.matchAll(/"(https?:\/\/[^"]+)"/g)
      for (const urlMatch of urlMatches) {
        const url = urlMatch[1]
        if (url && !url.includes('placeholder')) {
          images.push(url)
        }
      }
    }
    
    // Extract from variants_dict
    const variantsMatch = productStr.match(/"variants_dict"\s*:\s*\[([^\]]*)\]/s)
    if (variantsMatch && variantsMatch[1]) {
      const variantsContent = variantsMatch[1]
      const variantImageMatches = variantsContent.matchAll(/"variant_image"\s*:\s*"(https?:\/\/[^"]+)"/g)
      for (const vMatch of variantImageMatches) {
        const url = vMatch[1]
        if (url && !url.includes('placeholder')) {
          images.push(url)
        }
      }
    }
    
    // Also look for any other image URLs in the product
    const anyImagePattern = /"(?:image|img|photo|picture)[^"]*"\s*:\s*"(https?:\/\/[^"]+(?:jpg|jpeg|png|gif|webp|svg))"/gi
    const anyImageMatches = productStr.matchAll(anyImagePattern)
    for (const imgMatch of anyImageMatches) {
      const url = imgMatch[1]
      if (url && !url.includes('placeholder')) {
        images.push(url)
      }
    }
    
    // Store if we found images
    if (images.length > 0) {
      const uniqueImages = [...new Set(images)]
      imageMap.set(sku, {
        sku,
        title: cleanText(title),
        images: uniqueImages,
        mainImage: uniqueImages[0]
      })
    }
    
    count++
    if (count % 1000 === 0) {
      console.log(`Processed ${count} products, found images for ${imageMap.size} products...`)
    }
  }
  
  console.log(`\nTotal products processed: ${count}`)
  console.log(`Products with images found: ${imageMap.size}`)
  
  // Now update MongoDB
  console.log('\nConnecting to MongoDB...')
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Get all products that need updating
    const productsToUpdate = await productsCollection.find({
      source: 'prendo',
      $or: [
        { image: 'https://via.placeholder.com/500' },
        { image: null },
        { image: '' }
      ]
    }).toArray()
    
    console.log(`Found ${productsToUpdate.length} products that need image updates`)
    
    let updated = 0
    let notFound = 0
    const bulkOps = []
    
    for (const product of productsToUpdate) {
      const imageData = imageMap.get(product.sku)
      
      if (imageData) {
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: {
              $set: {
                image: imageData.mainImage,
                images: imageData.images
              }
            }
          }
        })
        updated++
        
        if (bulkOps.length >= 500) {
          await productsCollection.bulkWrite(bulkOps)
          console.log(`Updated ${updated} products...`)
          bulkOps.length = 0
        }
      } else {
        notFound++
      }
    }
    
    // Execute remaining updates
    if (bulkOps.length > 0) {
      await productsCollection.bulkWrite(bulkOps)
    }
    
    // Also update products that might have placeholder but we have better images
    console.log('\nLooking for products with better images available...')
    
    const allPrendoProducts = await productsCollection.find({ source: 'prendo' }).toArray()
    let additionalUpdates = 0
    const additionalBulkOps = []
    
    for (const product of allPrendoProducts) {
      const imageData = imageMap.get(product.sku)
      
      if (imageData && product.image === 'https://via.placeholder.com/500') {
        additionalBulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: {
              $set: {
                image: imageData.mainImage,
                images: imageData.images
              }
            }
          }
        })
        additionalUpdates++
        
        if (additionalBulkOps.length >= 500) {
          await productsCollection.bulkWrite(additionalBulkOps)
          console.log(`Additional updates: ${additionalUpdates}...`)
          additionalBulkOps.length = 0
        }
      }
    }
    
    if (additionalBulkOps.length > 0) {
      await productsCollection.bulkWrite(additionalBulkOps)
    }
    
    // Final statistics
    const finalStats = {
      total: await productsCollection.countDocuments({ source: 'prendo' }),
      withImages: await productsCollection.countDocuments({
        source: 'prendo',
        image: { $ne: 'https://via.placeholder.com/500' }
      }),
      withoutImages: await productsCollection.countDocuments({
        source: 'prendo',
        image: 'https://via.placeholder.com/500'
      })
    }
    
    console.log('\n=== FINAL RESULTS ===')
    console.log(`Total Prendo products: ${finalStats.total}`)
    console.log(`Products WITH images: ${finalStats.withImages}`)
    console.log(`Products WITHOUT images: ${finalStats.withoutImages}`)
    console.log(`Success rate: ${((finalStats.withImages / finalStats.total) * 100).toFixed(1)}%`)
    console.log(`\nUpdated ${updated + additionalUpdates} products with images`)
    console.log(`${notFound} products had no image data in source JSON`)
    
  } finally {
    await client.close()
    console.log('\nDatabase connection closed')
  }
}

extractAllImages().catch(console.error)