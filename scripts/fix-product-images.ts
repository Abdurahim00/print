import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI!
const DATABASE_NAME = 'printwrap-pro'

async function fixProductImages() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Get products with placeholder images
    const productsToFix = await productsCollection.find({
      source: 'prendo',
      image: 'https://via.placeholder.com/500'
    }).toArray()
    
    console.log(`Found ${productsToFix.length} products with placeholder images`)
    
    let fixed = 0
    let batchUpdates = []
    
    for (const product of productsToFix) {
      let newImage = null
      let newImages = []
      
      // Check if originalData has useful info
      const originalData = product.originalData
      
      // Try to extract image from variations
      if (product.variations && product.variations.length > 0) {
        for (const variation of product.variations) {
          if (variation.image && variation.image !== '' && !variation.image.includes('placeholder')) {
            if (!newImage) {
              newImage = variation.image
            }
            newImages.push(variation.image)
          }
        }
      }
      
      // If we found new images, prepare update
      if (newImage) {
        batchUpdates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { 
              $set: { 
                image: newImage,
                images: newImages.length > 0 ? newImages : [newImage]
              }
            }
          }
        })
        fixed++
        
        // Execute batch updates every 100 items
        if (batchUpdates.length >= 100) {
          await productsCollection.bulkWrite(batchUpdates)
          console.log(`Updated ${fixed} products so far...`)
          batchUpdates = []
        }
      }
    }
    
    // Execute remaining updates
    if (batchUpdates.length > 0) {
      await productsCollection.bulkWrite(batchUpdates)
    }
    
    console.log(`\n=== Image Fix Complete ===`)
    console.log(`Fixed ${fixed} products out of ${productsToFix.length}`)
    
    // Get updated statistics
    const totalPrendo = await productsCollection.countDocuments({ source: 'prendo' })
    const stillPlaceholder = await productsCollection.countDocuments({
      source: 'prendo',
      image: 'https://via.placeholder.com/500'
    })
    
    console.log(`\n=== Updated Statistics ===`)
    console.log(`Total Prendo products: ${totalPrendo}`)
    console.log(`Products with real images: ${totalPrendo - stillPlaceholder}`)
    console.log(`Products still with placeholder: ${stillPlaceholder}`)
    
    // For products that still have placeholders, check why
    if (stillPlaceholder > 0) {
      const sampleNoImage = await productsCollection.findOne({
        source: 'prendo',
        image: 'https://via.placeholder.com/500'
      })
      
      console.log('\nSample product still without image:')
      console.log('Name:', sampleNoImage?.name)
      console.log('Has variations:', sampleNoImage?.hasVariations)
      console.log('Variations count:', sampleNoImage?.variations?.length || 0)
      if (sampleNoImage?.variations?.length > 0) {
        console.log('First variation:', sampleNoImage.variations[0])
      }
    }
    
  } catch (error) {
    console.error('Error fixing images:', error)
  } finally {
    await client.close()
    console.log('\nMongoDB connection closed')
  }
}

// Run the fix
fixProductImages().catch(console.error)