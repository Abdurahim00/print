import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap'
const DATABASE_NAME = process.env.DATABASE_NAME || 'printwrap'

interface PrendoProduct {
  Title?: string
  title?: string
  description?: string
  image_urls?: string[]
  Sizes?: string[]
  Article_no?: string
  article_no?: string
  price_before_tax?: string
  price_after_tax?: string
  brand_info?: string
  product_info?: Record<string, string>
  variants_dict?: Array<{
    variant_url: string
    variant_name: string
    variant_image: string
  }>
  // Additional fields that might exist
  Url?: string
  url?: string
  [key: string]: any
}

async function importAllPrendoProducts() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // First, let's see what we currently have
    const existingCount = await productsCollection.countDocuments()
    console.log(`Current products in database: ${existingCount}`)
    
    // Load the original Prendo JSON file with proper encoding
    console.log('\nReading prendo_unique_combine_output.json...')
    let allProducts: PrendoProduct[] = []
    
    try {
      // Read the file in chunks to handle encoding issues
      const content = fs.readFileSync('prendo_unique_combine_output.json', 'utf-8')
      
      // Try to parse the entire file
      try {
        const parsed = JSON.parse(content)
        if (Array.isArray(parsed)) {
          allProducts = parsed
          console.log(`Successfully parsed ${allProducts.length} products from original JSON`)
        }
      } catch (parseError) {
        console.log('Full parse failed, attempting to extract products manually...')
        
        // Extract products using regex pattern matching
        const productMatches = content.match(/\{[^{}]*"Title"[^{}]*"variants_dict"[^{}]*\}/gs)
        if (productMatches) {
          console.log(`Found ${productMatches.length} product patterns`)
          
          for (const match of productMatches) {
            try {
              // Clean the match and parse
              const cleaned = match
                .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
                .replace(/\\n/g, ' ') // Replace newlines
                .replace(/\s+/g, ' ') // Normalize whitespace
              
              const product = JSON.parse(cleaned)
              if (product.Title || product.title) {
                allProducts.push(product)
              }
            } catch (e) {
              // Skip invalid products
            }
          }
        }
      }
    } catch (readError) {
      console.error('Could not read original file:', readError)
    }
    
    // If we couldn't get the original, use the cleaned version
    if (allProducts.length === 0) {
      console.log('Using prendo_cleaned.json instead...')
      try {
        const cleanedData = JSON.parse(fs.readFileSync('prendo_cleaned.json', 'utf-8'))
        allProducts = cleanedData
        console.log(`Loaded ${allProducts.length} products from cleaned JSON`)
      } catch (e) {
        console.error('Could not load cleaned JSON either:', e)
      }
    }
    
    // Also load the properly formatted file
    try {
      const properData = JSON.parse(fs.readFileSync('prendo_output_clean.json', 'utf-8'))
      console.log(`Also loaded ${properData.length} properly formatted products`)
      
      // Create a map of these products by article number for image reference
      const imageMap = new Map<string, PrendoProduct>()
      properData.forEach((p: PrendoProduct) => {
        if (p.Article_no) {
          imageMap.set(p.Article_no, p)
        }
      })
      
      // Enhance products with missing image data
      allProducts = allProducts.map(product => {
        const articleNo = product.Article_no || product.article_no
        if (articleNo && imageMap.has(articleNo)) {
          const withImages = imageMap.get(articleNo)!
          return {
            ...product,
            image_urls: product.image_urls || withImages.image_urls,
            variants_dict: product.variants_dict || withImages.variants_dict
          }
        }
        return product
      })
    } catch (e) {
      console.log('Could not enhance with proper data')
    }
    
    console.log(`\nTotal products to import: ${allProducts.length}`)
    
    if (allProducts.length === 0) {
      console.log('No products to import!')
      return
    }
    
    // Clear existing products if requested
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const answer = await new Promise<string>(resolve => {
      readline.question(`Do you want to clear existing ${existingCount} products first? (yes/no): `, resolve)
    })
    readline.close()
    
    if (answer.toLowerCase() === 'yes') {
      await productsCollection.deleteMany({})
      console.log('Cleared existing products')
    }
    
    // Import products in batches
    const batchSize = 100
    let imported = 0
    let skipped = 0
    let withImages = 0
    let withoutImages = 0
    
    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, Math.min(i + batchSize, allProducts.length))
      const productsToInsert = []
      
      for (const product of batch) {
        // Get product title
        const title = product.Title || product.title || 'Unnamed Product'
        
        // Extract price
        let price = 0
        if (product.price_before_tax) {
          price = parseFloat(product.price_before_tax.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
        }
        
        // Find the best available image
        let mainImage = null
        const allImages: string[] = []
        
        // Check image_urls
        if (product.image_urls && Array.isArray(product.image_urls)) {
          product.image_urls.forEach(url => {
            if (url && url.startsWith('http')) {
              allImages.push(url)
              if (!mainImage) mainImage = url
            }
          })
        }
        
        // Check variants_dict for images
        const variants: any[] = []
        if (product.variants_dict && Array.isArray(product.variants_dict)) {
          product.variants_dict.forEach((v, idx) => {
            if (v.variant_image && v.variant_image.startsWith('http')) {
              allImages.push(v.variant_image)
              if (!mainImage) mainImage = v.variant_image
              
              variants.push({
                id: `variant-${idx}`,
                variant_name: v.variant_name,
                variant_image: v.variant_image,
                image: v.variant_image,
                variant_url: v.variant_url
              })
            }
          })
        }
        
        // Use placeholder if no image found
        if (!mainImage) {
          mainImage = '/placeholder.jpg'
          withoutImages++
        } else {
          withImages++
        }
        
        const productDoc = {
          name: title,
          description: product.description || '',
          price: price,
          basePrice: price,
          image: mainImage,
          images: [...new Set(allImages)], // Remove duplicates
          image_urls: product.image_urls || [],
          categoryId: 'uncategorized',
          subcategoryId: null,
          inStock: true,
          featured: false,
          isActive: true,
          sku: product.Article_no || product.article_no || `prendo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          brand: extractBrand(product.brand_info || ''),
          type: 'product',
          sizes: product.Sizes || [],
          variants: variants,
          variants_dict: product.variants_dict || [],
          hasVariants: variants.length > 0,
          specifications: product.product_info || {},
          source: 'prendo_import',
          originalData: {
            url: product.Url || product.url,
            articleNo: product.Article_no || product.article_no,
            priceBeforeTax: product.price_before_tax,
            priceAfterTax: product.price_after_tax
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        productsToInsert.push(productDoc)
      }
      
      if (productsToInsert.length > 0) {
        try {
          const result = await productsCollection.insertMany(productsToInsert, { ordered: false })
          imported += result.insertedCount
          console.log(`Batch ${Math.floor(i / batchSize) + 1}: Imported ${result.insertedCount} products (Total: ${imported})`)
        } catch (error: any) {
          if (error.code === 11000) {
            // Duplicate key error
            const inserted = error.result?.insertedCount || 0
            imported += inserted
            skipped += productsToInsert.length - inserted
            console.log(`Batch ${Math.floor(i / batchSize) + 1}: Imported ${inserted}, skipped ${productsToInsert.length - inserted} duplicates`)
          } else {
            console.error('Batch insert error:', error)
          }
        }
      }
    }
    
    console.log('\n=== IMPORT COMPLETE ===')
    console.log(`Total products imported: ${imported}`)
    console.log(`Products with images: ${withImages}`)
    console.log(`Products without images: ${withoutImages}`)
    console.log(`Skipped (duplicates): ${skipped}`)
    
    const finalCount = await productsCollection.countDocuments()
    console.log(`\nFinal product count in database: ${finalCount}`)
    
  } catch (error) {
    console.error('Import error:', error)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

function extractBrand(brandInfo: string): string {
  if (!brandInfo) return ''
  // Extract brand name from the brand_info field
  const lines = brandInfo.split('\n')
  if (lines.length > 0) {
    return lines[0].trim()
  }
  return ''
}

importAllPrendoProducts().catch(console.error)