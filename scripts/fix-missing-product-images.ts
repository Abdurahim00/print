import { MongoClient, ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''

async function fixMissingProductImages() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables')
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    const productsCollection = db.collection('products')
    
    // Find all products with missing or empty image URLs
    const productsWithMissingImages = await productsCollection.find({
      $or: [
        { image: { $exists: false } },
        { image: null },
        { image: '' },
        { image: 'https://placehold.co/600x600' },
        { image: /placehold/ }
      ]
    }).toArray()
    
    console.log(`📊 Found ${productsWithMissingImages.length} products with missing images`)
    
    let fixedCount = 0
    let skippedCount = 0
    
    for (const product of productsWithMissingImages) {
      // Check if product has variant images
      const variantImages: string[] = []
      
      // Collect all variant images
      if (product.variants && Array.isArray(product.variants)) {
        for (const variant of product.variants) {
          // Check different possible image fields in variants
          if (variant.image && variant.image !== '' && !variant.image.includes('placehold')) {
            variantImages.push(variant.image)
          }
          if (variant.images && Array.isArray(variant.images)) {
            for (const img of variant.images) {
              if (img && img !== '' && !img.includes('placehold')) {
                variantImages.push(img)
              }
            }
          }
          if (variant.imageUrl && variant.imageUrl !== '' && !variant.imageUrl.includes('placehold')) {
            variantImages.push(variant.imageUrl)
          }
        }
      }
      
      // Also check for individualAngleImages
      if (product.individualAngleImages && Array.isArray(product.individualAngleImages)) {
        for (const angleImage of product.individualAngleImages) {
          if (angleImage && angleImage !== '' && !angleImage.includes('placehold')) {
            variantImages.push(angleImage)
          }
        }
      }
      
      // Also check if there's an images array at product level
      if (product.images && Array.isArray(product.images)) {
        for (const img of product.images) {
          if (img && img !== '' && !img.includes('placehold')) {
            variantImages.push(img)
          }
        }
      }
      
      // Remove duplicates
      const uniqueImages = [...new Set(variantImages)]
      
      if (uniqueImages.length > 0) {
        // Use the first variant image as the main image
        const mainImage = uniqueImages[0]
        
        // Update the product
        const updateData: any = {
          image: mainImage,
          updatedAt: new Date()
        }
        
        // If we have multiple images, store them as additional images
        if (uniqueImages.length > 1) {
          updateData.additionalImages = uniqueImages.slice(1)
        }
        
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: updateData }
        )
        
        console.log(`✅ Fixed ${product.name || product._id}: ${mainImage}`)
        fixedCount++
      } else {
        console.log(`⚠️ Skipped ${product.name || product._id}: No variant images found`)
        skippedCount++
      }
    }
    
    console.log(`
📊 Summary:
- Total products with missing images: ${productsWithMissingImages.length}
- Fixed: ${fixedCount}
- Skipped (no variant images): ${skippedCount}
`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('✅ Connection closed')
  }
}

// Run the script
fixMissingProductImages().catch(console.error)