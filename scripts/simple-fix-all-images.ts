import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap'
const DATABASE_NAME = process.env.DATABASE_NAME || 'printwrap'

async function simpleFixAllImages() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Get all products
    const products = await productsCollection.find({}).toArray()
    console.log(`Found ${products.length} products`)
    
    let fixedCount = 0
    let alreadyHasImage = 0
    
    for (const product of products) {
      const updates: any = {}
      
      // Check if product needs image fix
      const needsImage = !product.image || 
                        product.image === '' || 
                        product.image === 'https://via.placeholder.com/500' ||
                        product.image === '/placeholder.jpg'
      
      if (needsImage) {
        // Try to get image from various sources
        let newImage = null
        
        // 1. Try variants array (most common)
        if (!newImage && product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
          for (const variant of product.variants) {
            if (variant.variant_image && variant.variant_image !== '') {
              newImage = variant.variant_image
              break
            }
            if (variant.image && variant.image !== '') {
              newImage = variant.image
              break
            }
          }
        }
        
        // 2. Try variants_dict (from Prendo)
        if (!newImage && product.variants_dict && Array.isArray(product.variants_dict) && product.variants_dict.length > 0) {
          for (const variant of product.variants_dict) {
            if (variant.variant_image && variant.variant_image !== '') {
              newImage = variant.variant_image
              break
            }
          }
        }
        
        // 3. Try variations array
        if (!newImage && product.variations && Array.isArray(product.variations) && product.variations.length > 0) {
          for (const variation of product.variations) {
            if (variation.image && variation.image !== '') {
              newImage = variation.image
              break
            }
            if (variation.images && Array.isArray(variation.images) && variation.images.length > 0) {
              newImage = variation.images[0]
              break
            }
          }
        }
        
        // 4. Try images array
        if (!newImage && product.images && Array.isArray(product.images) && product.images.length > 0) {
          for (const img of product.images) {
            if (img && img !== '' && img !== 'https://via.placeholder.com/500') {
              newImage = img
              break
            }
          }
        }
        
        // 5. Try image_urls (from Prendo)
        if (!newImage && product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
          for (const url of product.image_urls) {
            if (url && url !== '') {
              newImage = url
              break
            }
          }
        }
        
        // If we found an image, update it
        if (newImage) {
          updates.image = newImage
          console.log(`✅ Fixed image for: ${product.name}`)
          console.log(`   New image: ${newImage.substring(0, 50)}...`)
        } else {
          console.log(`❌ No image found for: ${product.name}`)
        }
      } else {
        alreadyHasImage++
      }
      
      // Also ensure variants_dict is mapped to variants if missing
      if (product.variants_dict && (!product.variants || product.variants.length === 0)) {
        updates.variants = product.variants_dict.map((v: any, idx: number) => ({
          id: `variant-${idx}`,
          variant_name: v.variant_name,
          variant_image: v.variant_image,
          image: v.variant_image,
          variant_url: v.variant_url
        }))
        updates.hasVariants = true
        console.log(`   Added ${updates.variants.length} variants`)
      }
      
      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: updates }
        )
        fixedCount++
      }
    }
    
    console.log('\n=== FIX COMPLETE ===')
    console.log(`Products already with images: ${alreadyHasImage}`)
    console.log(`Products fixed: ${fixedCount}`)
    console.log(`Total products: ${products.length}`)
    
    // Final check
    const stillNoImage = await productsCollection.countDocuments({
      $or: [
        { image: { $in: ['', null, 'https://via.placeholder.com/500', '/placeholder.jpg'] } },
        { image: { $exists: false } }
      ]
    })
    
    console.log(`\nProducts still without images: ${stillNoImage}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

simpleFixAllImages().catch(console.error)