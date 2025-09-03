import { MongoClient, ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''

// Function to check if a URL is valid and not a placeholder
function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || url === '') return false
  if (url.includes('placehold')) return false
  if (url === 'null' || url === 'undefined') return false
  if (!url.startsWith('http') && !url.startsWith('//')) return false
  return true
}

// Function to extract images from various product fields
function extractAllImages(product: any): string[] {
  const images: string[] = []
  
  // Check variants
  if (product.variants && Array.isArray(product.variants)) {
    for (const variant of product.variants) {
      // Check various image fields in variant
      if (isValidImageUrl(variant.image)) images.push(variant.image)
      if (isValidImageUrl(variant.imageUrl)) images.push(variant.imageUrl)
      if (isValidImageUrl(variant.imageURL)) images.push(variant.imageURL)
      if (isValidImageUrl(variant.img)) images.push(variant.img)
      if (isValidImageUrl(variant.photo)) images.push(variant.photo)
      if (isValidImageUrl(variant.picture)) images.push(variant.picture)
      
      // Check for images array in variant
      if (variant.images && Array.isArray(variant.images)) {
        for (const img of variant.images) {
          if (isValidImageUrl(img)) images.push(img)
        }
      }
      
      // Check for gallery in variant
      if (variant.gallery && Array.isArray(variant.gallery)) {
        for (const img of variant.gallery) {
          if (isValidImageUrl(img)) images.push(img)
        }
      }
    }
  }
  
  // Check individualAngleImages
  if (product.individualAngleImages && Array.isArray(product.individualAngleImages)) {
    for (const angleImage of product.individualAngleImages) {
      if (isValidImageUrl(angleImage)) images.push(angleImage)
    }
  }
  
  // Check images array at product level
  if (product.images && Array.isArray(product.images)) {
    for (const img of product.images) {
      if (isValidImageUrl(img)) images.push(img)
    }
  }
  
  // Check gallery at product level
  if (product.gallery && Array.isArray(product.gallery)) {
    for (const img of product.gallery) {
      if (isValidImageUrl(img)) images.push(img)
    }
  }
  
  // Check other possible image fields
  if (isValidImageUrl(product.imageUrl)) images.push(product.imageUrl)
  if (isValidImageUrl(product.imageURL)) images.push(product.imageURL)
  if (isValidImageUrl(product.mainImage)) images.push(product.mainImage)
  if (isValidImageUrl(product.primaryImage)) images.push(product.primaryImage)
  if (isValidImageUrl(product.thumbnail)) images.push(product.thumbnail)
  if (isValidImageUrl(product.thumb)) images.push(product.thumb)
  if (isValidImageUrl(product.photo)) images.push(product.photo)
  if (isValidImageUrl(product.picture)) images.push(product.picture)
  
  // Remove duplicates and return
  return [...new Set(images)]
}

// Function to load and check Prendo data
async function loadPrendoData(): Promise<Map<string, string[]>> {
  const prendoImages = new Map<string, string[]>()
  
  // List of Prendo files to check
  const prendoFiles = [
    'prendo_unique_combine_output.json',
    'prendo_output_clean.json',
    'prendo_cleaned.json'
  ]
  
  for (const fileName of prendoFiles) {
    const filePath = path.join(process.cwd(), fileName)
    if (fs.existsSync(filePath)) {
      try {
        console.log(`📖 Reading ${fileName}...`)
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        
        if (Array.isArray(data)) {
          for (const item of data) {
            const productName = item.name || item.Name || item.product_name || item.productName
            if (productName) {
              const images = extractAllImages(item)
              if (images.length > 0) {
                const existing = prendoImages.get(productName) || []
                prendoImages.set(productName, [...existing, ...images])
              }
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error reading ${fileName}:`, error)
      }
    }
  }
  
  // Remove duplicates for each product
  prendoImages.forEach((images, name) => {
    prendoImages.set(name, [...new Set(images)])
  })
  
  console.log(`📊 Found images for ${prendoImages.size} products in Prendo files`)
  return prendoImages
}

async function fixAllMissingImages() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables')
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    // Load Prendo data
    const prendoImages = await loadPrendoData()
    
    const db = client.db()
    const productsCollection = db.collection('products')
    
    // Find all products with missing or placeholder images
    const productsWithMissingImages = await productsCollection.find({
      $or: [
        { image: { $exists: false } },
        { image: null },
        { image: '' },
        { image: /placehold/ },
        { image: 'null' },
        { image: 'undefined' }
      ]
    }).toArray()
    
    console.log(`📊 Found ${productsWithMissingImages.length} products with missing images in database`)
    
    let fixedCount = 0
    let fixedFromPrendo = 0
    let fixedFromProduct = 0
    let skippedCount = 0
    
    for (const product of productsWithMissingImages) {
      // First try to extract images from the product itself
      let uniqueImages = extractAllImages(product)
      
      // If no images found in product, check Prendo data
      if (uniqueImages.length === 0 && prendoImages.has(product.name)) {
        uniqueImages = prendoImages.get(product.name) || []
        if (uniqueImages.length > 0) {
          fixedFromPrendo++
        }
      }
      
      // Also try with different name variations
      if (uniqueImages.length === 0) {
        const nameVariations = [
          product.name,
          product.name?.toLowerCase(),
          product.name?.toUpperCase(),
          product.name?.replace(/\s+/g, ' ').trim()
        ]
        
        for (const nameVar of nameVariations) {
          if (nameVar && prendoImages.has(nameVar)) {
            uniqueImages = prendoImages.get(nameVar) || []
            if (uniqueImages.length > 0) {
              fixedFromPrendo++
              break
            }
          }
        }
      }
      
      if (uniqueImages.length > 0) {
        // Use the first image as the main image
        const mainImage = uniqueImages[0]
        
        // Update the product
        const updateData: any = {
          image: mainImage,
          updatedAt: new Date()
        }
        
        // If we have multiple images, store them as additional images
        if (uniqueImages.length > 1) {
          updateData.additionalImages = uniqueImages.slice(1, 6) // Store up to 5 additional images
        }
        
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: updateData }
        )
        
        console.log(`✅ Fixed ${product.name || product._id}: ${mainImage.substring(0, 50)}...`)
        if (!fixedFromPrendo) fixedFromProduct++
        fixedCount++
      } else {
        console.log(`⚠️ Skipped ${product.name || product._id}: No images found anywhere`)
        skippedCount++
      }
    }
    
    console.log(`
📊 Summary:
- Total products with missing images: ${productsWithMissingImages.length}
- Fixed: ${fixedCount}
  - From product data: ${fixedFromProduct}
  - From Prendo files: ${fixedFromPrendo}
- Skipped (no images found): ${skippedCount}
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
fixAllMissingImages().catch(console.error)