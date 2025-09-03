import { MongoClient } from 'mongodb'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI!
const DATABASE_NAME = 'printwrap-pro'

function cleanText(text: string): string {
  if (!text) return ''
  return text
    .replace(/Ã¤/g, 'ä').replace(/Ã¶/g, 'ö').replace(/Ã¥/g, 'å')
    .replace(/Ã„/g, 'Ä').replace(/Ã–/g, 'Ö').replace(/Ã…/g, 'Å')
    .replace(/Ã©/g, 'é').replace(/Â°/g, '°')
    .trim()
}

async function finalImageFix() {
  console.log('=== FINAL COMPREHENSIVE IMAGE EXTRACTION ===')
  console.log('Reading JSON file...')
  
  const filePath = path.join(process.cwd(), 'prendo_unique_combine_output.json')
  const content = fs.readFileSync(filePath, 'latin1')
  const cleanedContent = cleanText(content)
  
  // Split content into chunks by looking for "Url" field
  const chunks = cleanedContent.split('"Url"')
  console.log(`Found ${chunks.length - 1} potential products`)
  
  const skuToImages = new Map<string, string[]>()
  let processedCount = 0
  let foundImageCount = 0
  
  for (let i = 1; i < chunks.length; i++) {
    const chunk = chunks[i]
    
    // Find Article_no (SKU)
    const skuMatch = chunk.match(/"Article_no"\s*:\s*"([^"]*)"/)
    if (!skuMatch || !skuMatch[1]) continue
    
    const sku = skuMatch[1]
    const images: string[] = []
    
    // Extract from image_urls - be very aggressive
    const imageUrlsStart = chunk.indexOf('"image_urls"')
    if (imageUrlsStart !== -1) {
      const imageUrlsEnd = chunk.indexOf(']', imageUrlsStart)
      if (imageUrlsEnd !== -1) {
        const imageUrlsSection = chunk.substring(imageUrlsStart, imageUrlsEnd + 1)
        
        // Find all URLs in this section
        const urlMatches = imageUrlsSection.matchAll(/"(https?:\/\/[^"]+)"/g)
        for (const match of urlMatches) {
          const url = match[1]
          if (url && !url.includes('placeholder')) {
            images.push(url)
          }
        }
      }
    }
    
    // Extract from variants_dict
    const variantsStart = chunk.indexOf('"variants_dict"')
    if (variantsStart !== -1) {
      const variantsEnd = chunk.indexOf(']', variantsStart)
      if (variantsEnd !== -1) {
        const variantsSection = chunk.substring(variantsStart, variantsEnd + 1)
        
        // Find all variant_image URLs
        const variantMatches = variantsSection.matchAll(/"variant_image"\s*:\s*"([^"]+)"/g)
        for (const match of variantMatches) {
          const url = match[1]
          if (url && url.startsWith('http') && !url.includes('placeholder')) {
            images.push(url)
          }
        }
      }
    }
    
    // Also find any URL that looks like an image from static.unpr.io
    const unprMatches = chunk.matchAll(/(https?:\/\/static\.unpr\.io\/[^"'\s]+)/g)
    for (const match of unprMatches) {
      const url = match[1]
      if (url && !url.includes('placeholder')) {
        images.push(url)
      }
    }
    
    // Store unique images
    if (images.length > 0) {
      const uniqueImages = [...new Set(images)]
      skuToImages.set(sku, uniqueImages)
      foundImageCount++
    }
    
    processedCount++
    if (processedCount % 1000 === 0) {
      console.log(`Processed ${processedCount} products, found images for ${foundImageCount}...`)
    }
  }
  
  console.log(`\nExtraction complete:`)
  console.log(`- Processed ${processedCount} products`)
  console.log(`- Found images for ${foundImageCount} products`)
  console.log(`- Total unique SKUs with images: ${skuToImages.size}`)
  
  // Show sample
  console.log('\nSample of found images:')
  let sampleCount = 0
  for (const [sku, images] of skuToImages) {
    if (sampleCount >= 3) break
    console.log(`  SKU ${sku}: ${images.length} images`)
    console.log(`    First: ${images[0]}`)
    sampleCount++
  }
  
  // Update MongoDB
  console.log('\n=== Updating MongoDB ===')
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Get all products with placeholder images
    const productsToUpdate = await productsCollection.find({
      source: 'prendo',
      image: 'https://via.placeholder.com/500'
    }).toArray()
    
    console.log(`Found ${productsToUpdate.length} products to update`)
    
    let updated = 0
    let matched = 0
    const bulkOps = []
    
    for (const product of productsToUpdate) {
      const images = skuToImages.get(product.sku)
      
      if (images && images.length > 0) {
        matched++
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: {
              $set: {
                image: images[0],
                images: images
              }
            }
          }
        })
        
        if (bulkOps.length >= 500) {
          const result = await productsCollection.bulkWrite(bulkOps)
          updated += result.modifiedCount
          console.log(`Updated ${updated} products...`)
          bulkOps.length = 0
        }
      }
    }
    
    // Execute remaining updates
    if (bulkOps.length > 0) {
      const result = await productsCollection.bulkWrite(bulkOps)
      updated += result.modifiedCount
    }
    
    // Final statistics
    const stats = {
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
    console.log(`Updated: ${updated} products`)
    console.log(`Matched: ${matched} products had images in JSON`)
    console.log(`\nDatabase Status:`)
    console.log(`- Total Prendo products: ${stats.total}`)
    console.log(`- WITH images: ${stats.withImages} (${((stats.withImages/stats.total)*100).toFixed(1)}%)`)
    console.log(`- WITHOUT images: ${stats.withoutImages} (${((stats.withoutImages/stats.total)*100).toFixed(1)}%)`)
    
    if (stats.withoutImages > 0) {
      // Check why some don't have images
      const sampleNoImage = await productsCollection.findOne({
        source: 'prendo',
        image: 'https://via.placeholder.com/500'
      })
      
      console.log('\nSample product without image:')
      console.log(`- Name: ${sampleNoImage?.name}`)
      console.log(`- SKU: ${sampleNoImage?.sku}`)
      console.log(`- In extracted map: ${skuToImages.has(sampleNoImage?.sku)}`)
    }
    
  } finally {
    await client.close()
    console.log('\nDatabase connection closed')
  }
}

finalImageFix().catch(console.error)