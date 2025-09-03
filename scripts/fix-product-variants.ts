import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap'
const DATABASE_NAME = 'printwrap-pro'

interface PrendoProduct {
  Url: string
  Title: string
  description: string
  image_urls: string[]
  Sizes: string[]
  Article_no: string
  price_before_tax: string
  price_after_tax: string
  brand_info: string
  product_info: Record<string, string>
  variants_dict: Array<{
    variant_url: string
    variant_name: string
    variant_image: string
  }>
}

async function fixProductVariants() {
  console.log('Starting to fix product variants...')
  
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Read the JSON file
    const filePath = path.join(process.cwd(), 'prendo_unique_combine_output.json')
    console.log('Reading file from:', filePath)
    
    const fileContent = fs.readFileSync(filePath, 'utf8')
    let products: PrendoProduct[]
    
    try {
      products = JSON.parse(fileContent)
      console.log(`Loaded ${products.length} products from JSON`)
    } catch (error) {
      console.error('Error parsing JSON:', error)
      return
    }
    
    let updatedCount = 0
    let variantsAddedCount = 0
    
    // Process each product
    for (const prendoProduct of products) {
      if (!prendoProduct.Article_no) continue
      
      // Find the product in database by SKU
      const dbProduct = await productsCollection.findOne({ 
        sku: prendoProduct.Article_no 
      })
      
      if (!dbProduct) {
        continue
      }
      
      // Check if product has variants in the JSON
      if (prendoProduct.variants_dict && prendoProduct.variants_dict.length > 0) {
        // Transform variants to our format
        const variants = prendoProduct.variants_dict.map(v => ({
          variant_name: v.variant_name,
          variant_image: v.variant_image,
          image: v.variant_image,
          variant_url: v.variant_url
        }))
        
        // Update the product with variants
        const updateResult = await productsCollection.updateOne(
          { _id: dbProduct._id },
          { 
            $set: { 
              variants: variants,
              hasVariants: true,
              // If main image is placeholder or empty, use first variant image
              ...((!dbProduct.image || 
                   dbProduct.image === '' || 
                   dbProduct.image === 'https://via.placeholder.com/500') && 
                  variants[0]?.variant_image ? 
                { image: variants[0].variant_image } : {})
            }
          }
        )
        
        if (updateResult.modifiedCount > 0) {
          updatedCount++
          variantsAddedCount += variants.length
          console.log(`Updated ${dbProduct.name} with ${variants.length} variants`)
          
          // Log if we also updated the main image
          if (!dbProduct.image || dbProduct.image === '' || dbProduct.image === 'https://via.placeholder.com/500') {
            console.log(`  Also updated main image from variant`)
          }
        }
      }
      
      // Also check if product has empty image but has image_urls in JSON
      if ((!dbProduct.image || dbProduct.image === '' || dbProduct.image === 'https://via.placeholder.com/500') 
          && prendoProduct.image_urls && prendoProduct.image_urls.length > 0) {
        const updateResult = await productsCollection.updateOne(
          { _id: dbProduct._id },
          { 
            $set: { 
              image: prendoProduct.image_urls[0],
              images: prendoProduct.image_urls
            }
          }
        )
        
        if (updateResult.modifiedCount > 0) {
          console.log(`Updated ${dbProduct.name} main image from image_urls`)
        }
      }
    }
    
    console.log(`\nUpdate complete!`)
    console.log(`Products updated: ${updatedCount}`)
    console.log(`Total variants added: ${variantsAddedCount}`)
    
    // Check how many products still have empty images
    const emptyImageCount = await productsCollection.countDocuments({
      $or: [
        { image: '' },
        { image: null },
        { image: 'https://via.placeholder.com/500' }
      ]
    })
    
    console.log(`\nProducts still with empty/placeholder images: ${emptyImageCount}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

fixProductVariants()