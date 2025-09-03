import { MongoClient } from 'mongodb'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI!
const DATABASE_NAME = 'printwrap-pro'

function cleanText(text: string): string {
  if (!text) return ''
  
  return text
    .replace(/Ã¤/g, 'ä')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¥/g, 'å')
    .replace(/Ã„/g, 'Ä')
    .replace(/Ã–/g, 'Ö')
    .replace(/Ã…/g, 'Å')
    .replace(/Ã©/g, 'é')
    .replace(/Â°/g, '°')
    .trim()
}

async function reprocessImages() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Read original JSON file
    console.log('Reading original JSON file...')
    const filePath = path.join(process.cwd(), 'prendo_unique_combine_output.json')
    const content = fs.readFileSync(filePath, 'latin1')
    const cleanedContent = cleanText(content)
    
    // Extract products with proper image handling
    const productRegex = /\{[^{}]*"Url"\s*:\s*"([^"]+)"[\s\S]*?"Title"\s*:\s*"([^"]+)"[\s\S]*?"Article_no"\s*:\s*"([^"]*)"[\s\S]*?"image_urls"\s*:\s*(\[[^\]]*\])[\s\S]*?"variants_dict"\s*:\s*(\[[^\]]*\])[\s\S]*?\}/g
    
    const matches = cleanedContent.matchAll(productRegex)
    const skuToImages = new Map<string, { images: string[], mainImage: string }>()
    
    console.log('Processing products from JSON...')
    let processedCount = 0
    
    for (const match of matches) {
      const url = match[1]
      const title = match[2]
      const sku = match[3]
      const imageUrlsStr = match[4]
      const variantsStr = match[5]
      
      if (!sku) continue
      
      const images: string[] = []
      let mainImage = ''
      
      // Try to parse image_urls array
      try {
        const imageUrls = JSON.parse(imageUrlsStr)
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          images.push(...imageUrls)
          if (!mainImage) mainImage = imageUrls[0]
        }
      } catch (e) {
        // Extract images manually from image_urls
        const imgMatches = imageUrlsStr.matchAll(/"(https?:\/\/[^"]+)"/g)
        for (const imgMatch of imgMatches) {
          const imgUrl = imgMatch[1]
          if (imgUrl && !imgUrl.includes('placeholder')) {
            images.push(imgUrl)
            if (!mainImage) mainImage = imgUrl
          }
        }
      }
      
      // Try to parse variants_dict
      try {
        const variants = JSON.parse(variantsStr)
        if (Array.isArray(variants)) {
          for (const variant of variants) {
            if (variant.variant_image && !variant.variant_image.includes('placeholder')) {
              images.push(variant.variant_image)
              if (!mainImage) mainImage = variant.variant_image
            }
          }
        }
      } catch (e) {
        // Extract variant images manually
        const variantImgMatches = variantsStr.matchAll(/"variant_image"\s*:\s*"(https?:\/\/[^"]+)"/g)
        for (const vImgMatch of variantImgMatches) {
          const imgUrl = vImgMatch[1]
          if (imgUrl && !imgUrl.includes('placeholder')) {
            images.push(imgUrl)
            if (!mainImage) mainImage = imgUrl
          }
        }
      }
      
      if (mainImage && images.length > 0) {
        skuToImages.set(sku, { images: [...new Set(images)], mainImage })
      }
      
      processedCount++
      if (processedCount % 1000 === 0) {
        console.log(`Processed ${processedCount} products from JSON...`)
      }
    }
    
    console.log(`Found ${skuToImages.size} products with valid images in JSON`)
    
    // Update products in database
    console.log('Updating products in database...')
    const productsToUpdate = await productsCollection.find({
      source: 'prendo',
      image: 'https://via.placeholder.com/500',
      sku: { $ne: null, $ne: '' }
    }).toArray()
    
    console.log(`Found ${productsToUpdate.length} products to update`)
    
    let updated = 0
    const bulkOps = []
    
    for (const product of productsToUpdate) {
      const imageData = skuToImages.get(product.sku)
      
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
        
        // Execute batch every 500 operations
        if (bulkOps.length >= 500) {
          await productsCollection.bulkWrite(bulkOps)
          console.log(`Updated ${updated} products...`)
          bulkOps.length = 0
        }
      }
    }
    
    // Execute remaining operations
    if (bulkOps.length > 0) {
      await productsCollection.bulkWrite(bulkOps)
    }
    
    // Final statistics
    const totalPrendo = await productsCollection.countDocuments({ source: 'prendo' })
    const withPlaceholder = await productsCollection.countDocuments({
      source: 'prendo',
      image: 'https://via.placeholder.com/500'
    })
    
    console.log('\n=== Image Reprocessing Complete ===')
    console.log(`Updated ${updated} products with real images`)
    console.log(`Total Prendo products: ${totalPrendo}`)
    console.log(`Products with real images: ${totalPrendo - withPlaceholder}`)
    console.log(`Products still with placeholder: ${withPlaceholder}`)
    console.log('\nNote: Products still with placeholders don\'t have image data in the source JSON file.')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('MongoDB connection closed')
  }
}

// Run the reprocessing
reprocessImages().catch(console.error)