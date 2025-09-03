import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap'
const DATABASE_NAME = process.env.DATABASE_NAME || 'printwrap'

async function forceFixAllImages() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Load ALL available Prendo data
    const jsonFiles = [
      'prendo_output_clean.json',
      'prendo_output_22_08_2025 (1).json',
      'prendo_unique_combine_output.json'
    ]
    
    const allPrendoData: any[] = []
    
    for (const file of jsonFiles) {
      try {
        console.log(`Loading ${file}...`)
        const content = fs.readFileSync(file, 'utf-8')
        const data = JSON.parse(content)
        allPrendoData.push(...(Array.isArray(data) ? data : []))
        console.log(`  Loaded ${Array.isArray(data) ? data.length : 0} products`)
      } catch (e) {
        console.log(`  Could not load ${file}`)
      }
    }
    
    console.log(`\nTotal Prendo products loaded: ${allPrendoData.length}`)
    
    // Create lookup maps by different identifiers
    const byArticleNo = new Map()
    const byTitle = new Map()
    
    allPrendoData.forEach(product => {
      if (product.Article_no) {
        byArticleNo.set(product.Article_no, product)
      }
      if (product.Title) {
        // Normalize title for matching
        const normalizedTitle = product.Title.toLowerCase().trim()
        byTitle.set(normalizedTitle, product)
      }
    })
    
    // Get all products from database
    const dbProducts = await productsCollection.find({}).toArray()
    console.log(`\nFound ${dbProducts.length} products in database`)
    
    let fixedCount = 0
    let noMatchCount = 0
    let alreadyHasImageCount = 0
    
    for (const dbProduct of dbProducts) {
      // Skip if already has a valid image
      if (dbProduct.image && 
          dbProduct.image !== '' && 
          dbProduct.image !== 'https://via.placeholder.com/500' &&
          dbProduct.image !== '/placeholder.jpg' &&
          dbProduct.image.startsWith('http')) {
        alreadyHasImageCount++
        continue
      }
      
      // Try to find matching Prendo product
      let prendoMatch = null
      
      // Try by SKU/Article number
      if (dbProduct.sku) {
        prendoMatch = byArticleNo.get(dbProduct.sku)
      }
      
      // Try by originalData.articleNo
      if (!prendoMatch && dbProduct.originalData?.articleNo) {
        prendoMatch = byArticleNo.get(dbProduct.originalData.articleNo)
      }
      
      // Try by name/title
      if (!prendoMatch && dbProduct.name) {
        const normalizedName = dbProduct.name.toLowerCase().trim()
        prendoMatch = byTitle.get(normalizedName)
      }
      
      if (prendoMatch) {
        const updates: any = {}
        
        // Get the FIRST available image from multiple sources
        let mainImage = null
        const allImages: string[] = []
        
        // 1. Check image_urls array (these are usually the main product images)
        if (prendoMatch.image_urls && Array.isArray(prendoMatch.image_urls)) {
          prendoMatch.image_urls.forEach((url: string) => {
            if (url && url.startsWith('http')) {
              allImages.push(url)
              if (!mainImage) mainImage = url
            }
          })
        }
        
        // 2. Check variants_dict for images
        if (prendoMatch.variants_dict && Array.isArray(prendoMatch.variants_dict)) {
          const variants = prendoMatch.variants_dict.map((v: any, idx: number) => ({
            id: `variant-${idx}`,
            variant_name: v.variant_name,
            variant_image: v.variant_image,
            image: v.variant_image,
            variant_url: v.variant_url
          }))
          
          updates.variants = variants
          updates.variants_dict = prendoMatch.variants_dict
          updates.hasVariants = true
          
          // Add variant images to collection
          prendoMatch.variants_dict.forEach((v: any) => {
            if (v.variant_image && v.variant_image.startsWith('http')) {
              allImages.push(v.variant_image)
              if (!mainImage) mainImage = v.variant_image
            }
          })
        }
        
        // Set the main image
        if (mainImage) {
          updates.image = mainImage
        }
        
        // Set all images
        if (allImages.length > 0) {
          updates.images = [...new Set(allImages)] // Remove duplicates
          updates.image_urls = prendoMatch.image_urls || []
        }
        
        // Update the product
        if (Object.keys(updates).length > 0) {
          await productsCollection.updateOne(
            { _id: dbProduct._id },
            { $set: updates }
          )
          fixedCount++
          console.log(`✅ Fixed: ${dbProduct.name}`)
          if (updates.image) {
            console.log(`   Main image: ${updates.image.substring(0, 60)}...`)
          }
          if (updates.images) {
            console.log(`   Total images: ${updates.images.length}`)
          }
          if (updates.variants) {
            console.log(`   Variants: ${updates.variants.length}`)
          }
        }
      } else {
        noMatchCount++
        console.log(`❌ No match found for: ${dbProduct.name} (SKU: ${dbProduct.sku})`)
      }
    }
    
    console.log('\n=== FORCE FIX COMPLETE ===')
    console.log(`Already had valid images: ${alreadyHasImageCount}`)
    console.log(`Fixed: ${fixedCount}`)
    console.log(`No match found: ${noMatchCount}`)
    console.log(`Total products: ${dbProducts.length}`)
    
    // Final verification
    const stillNoImage = await productsCollection.find({
      $or: [
        { image: { $in: ['', null, 'https://via.placeholder.com/500', '/placeholder.jpg'] } },
        { image: { $exists: false } },
        { image: { $not: { $regex: '^http' } } }
      ]
    }).toArray()
    
    console.log(`\n⚠️  Products still without valid images: ${stillNoImage.length}`)
    if (stillNoImage.length > 0) {
      console.log('Products without images:')
      stillNoImage.forEach(p => {
        console.log(`  - ${p.name} (SKU: ${p.sku}, ID: ${p._id})`)
      })
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('\nDisconnected from MongoDB')
  }
}

forceFixAllImages().catch(console.error)