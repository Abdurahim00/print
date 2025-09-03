import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap'
const DATABASE_NAME = process.env.DATABASE_NAME || 'printwrap'

async function ultimateFixAllProducts() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Clear the broken products
    console.log('Clearing existing broken products...')
    await productsCollection.deleteMany({})
    
    // Load the ORIGINAL Prendo JSON properly
    console.log('Loading Prendo data...')
    
    // Try to read the original JSON line by line and extract valid products
    const fileContent = fs.readFileSync('prendo_unique_combine_output.json', 'utf-8')
    
    // Extract product objects more carefully
    const products: any[] = []
    
    // Split by opening braces and try to parse each product
    const chunks = fileContent.split(/(?=\{[\s\n]*"(?:Title|Url)")/g)
    
    for (const chunk of chunks) {
      if (chunk.trim().length < 100) continue // Skip too small chunks
      
      try {
        // Find the complete object by balancing braces
        let braceCount = 0
        let endIndex = 0
        let inString = false
        let escaped = false
        
        for (let i = 0; i < chunk.length; i++) {
          const char = chunk[i]
          
          if (!escaped) {
            if (char === '"' && !inString) inString = true
            else if (char === '"' && inString) inString = false
            else if (!inString) {
              if (char === '{') braceCount++
              else if (char === '}') {
                braceCount--
                if (braceCount === 0) {
                  endIndex = i + 1
                  break
                }
              }
            }
            
            if (char === '\\') escaped = true
            else escaped = false
          } else {
            escaped = false
          }
        }
        
        if (endIndex > 0) {
          const productJson = chunk.substring(0, endIndex)
          const product = JSON.parse(productJson)
          
          // Validate it's a real product
          if (product.Title || product.title) {
            products.push(product)
          }
        }
      } catch (e) {
        // Skip invalid JSON chunks
      }
    }
    
    console.log(`Extracted ${products.length} valid products`)
    
    if (products.length === 0) {
      // Fallback: try loading from prendo_output_clean.json
      console.log('Fallback: loading from prendo_output_clean.json...')
      const cleanData = JSON.parse(fs.readFileSync('prendo_output_clean.json', 'utf-8'))
      products.push(...cleanData)
    }
    
    // Now import all products WITH PROPER IMAGE HANDLING
    console.log(`Importing ${products.length} products with proper images...`)
    
    const batchSize = 100
    let imported = 0
    let withImages = 0
    let withoutImages = 0
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, Math.min(i + batchSize, products.length))
      const documentsToInsert: any[] = []
      
      for (const product of batch) {
        // CRITICAL: Get title properly
        const title = product.Title || product.title || 'Unnamed Product'
        
        // CRITICAL: Get SKU properly
        const sku = product.Article_no || product.article_no || 
                   `prendo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        // Extract price
        let price = 0
        if (product.price_before_tax) {
          const priceStr = product.price_before_tax.replace(/[^\d.,]/g, '').replace(',', '.')
          price = parseFloat(priceStr) || 0
        }
        
        // CRITICAL FIX: Get images from variants FIRST, then fallback to image_urls
        let mainImage = null
        const allImages: string[] = []
        const variants: any[] = []
        
        // Process variants_dict - THIS IS WHERE THE IMAGES ARE!
        if (product.variants_dict && Array.isArray(product.variants_dict) && product.variants_dict.length > 0) {
          product.variants_dict.forEach((variant: any, idx: number) => {
            if (variant.variant_image && variant.variant_image.startsWith('http')) {
              // Use FIRST variant image as main image if we don't have one yet
              if (!mainImage) {
                mainImage = variant.variant_image
              }
              
              allImages.push(variant.variant_image)
              
              // Store the variant properly
              variants.push({
                id: `variant-${idx}`,
                variant_name: variant.variant_name,
                variant_image: variant.variant_image,
                image: variant.variant_image,
                variant_url: variant.variant_url,
                // For designable products, store multiple angles (placeholder for now)
                frontImage: variant.variant_image,
                backImage: null, // Would be filled with actual back image
                leftImage: null,
                rightImage: null,
                color: {
                  name: variant.variant_name,
                  hex: null,
                  swatch_image: variant.variant_image
                }
              })
            }
          })
        }
        
        // Fallback to image_urls if no variant images
        if (!mainImage && product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
          for (const url of product.image_urls) {
            if (url && url.startsWith('http')) {
              if (!mainImage) mainImage = url
              allImages.push(url)
            }
          }
        }
        
        // Track statistics
        if (mainImage && mainImage !== '/placeholder.jpg') {
          withImages++
        } else {
          withoutImages++
          mainImage = '/placeholder.jpg' // Fallback
        }
        
        // Create the product document with ALL the data
        const productDoc = {
          name: title,
          description: product.description || '',
          price: price,
          basePrice: price,
          image: mainImage, // Main display image
          images: [...new Set(allImages)], // All unique images
          image_urls: product.image_urls || [],
          categoryId: determineCategoryFromProduct(product),
          subcategoryId: null,
          inStock: true,
          featured: false,
          isActive: true,
          sku: sku,
          brand: extractBrand(product.brand_info || ''),
          type: 'product',
          sizes: product.Sizes || [],
          variants: variants, // Properly structured variants
          variants_dict: product.variants_dict || [], // Keep original too
          hasVariants: variants.length > 0,
          variations: variants.map(v => ({ // Also add as variations for compatibility
            name: v.variant_name,
            image: v.variant_image,
            images: [v.variant_image],
            price: price,
            inStock: true
          })),
          hasVariations: variants.length > 0,
          specifications: product.product_info || {},
          tags: generateTags(product),
          source: 'prendo_ultimate',
          originalData: {
            url: product.Url || product.url,
            articleNo: sku,
            priceBeforeTax: product.price_before_tax,
            priceAfterTax: product.price_after_tax,
            title: title
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        documentsToInsert.push(productDoc)
      }
      
      // Insert batch
      if (documentsToInsert.length > 0) {
        try {
          const result = await productsCollection.insertMany(documentsToInsert, { ordered: false })
          imported += result.insertedCount
          console.log(`Batch ${Math.floor(i / batchSize) + 1}: Imported ${result.insertedCount} products (Total: ${imported})`)
        } catch (error: any) {
          if (error.code === 11000) {
            // Handle duplicates
            const inserted = error.result?.insertedCount || 0
            imported += inserted
            console.log(`Batch ${Math.floor(i / batchSize) + 1}: Imported ${inserted}, skipped duplicates`)
          } else {
            console.error('Batch error:', error.message)
          }
        }
      }
    }
    
    console.log('\n=== ULTIMATE FIX COMPLETE ===')
    console.log(`Total products imported: ${imported}`)
    console.log(`Products WITH images: ${withImages}`)
    console.log(`Products WITHOUT images: ${withoutImages}`)
    console.log(`Success rate: ${((withImages / (withImages + withoutImages)) * 100).toFixed(1)}%`)
    
    // Final verification
    const finalStats = await productsCollection.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          withImages: [
            { $match: { 
              image: { 
                $exists: true, 
                $ne: '/placeholder.jpg',
                $ne: '',
                $ne: null,
                $regex: '^http'
              } 
            }},
            { $count: 'count' }
          ],
          sample: [
            { $limit: 5 },
            { $project: { 
              name: 1, 
              image: 1, 
              variantCount: { $size: { $ifNull: ['$variants', []] } }
            }}
          ]
        }
      }
    ]).toArray()
    
    const stats = finalStats[0]
    console.log('\n=== DATABASE VERIFICATION ===')
    console.log(`Total in DB: ${stats.total[0]?.count || 0}`)
    console.log(`With real images: ${stats.withImages[0]?.count || 0}`)
    console.log('\nSample products:')
    stats.sample.forEach((p: any) => {
      console.log(`- ${p.name}`)
      console.log(`  Image: ${p.image ? p.image.substring(0, 50) + '...' : 'NO IMAGE'}`)
      console.log(`  Variants: ${p.variantCount}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('\nDisconnected from MongoDB')
  }
}

function extractBrand(brandInfo: string): string {
  if (!brandInfo) return ''
  const lines = brandInfo.split('\n')
  return lines[0]?.trim() || ''
}

function determineCategoryFromProduct(product: any): string {
  const title = (product.Title || product.title || '').toLowerCase()
  const desc = (product.description || '').toLowerCase()
  
  // Check for common categories
  if (title.includes('t-shirt') || title.includes('tshirt') || desc.includes('t-shirt')) return 't-shirts'
  if (title.includes('hoodie') || title.includes('hood')) return 'hoodies'
  if (title.includes('jacket') || title.includes('jacka')) return 'jackets'
  if (title.includes('pant') || title.includes('byxa')) return 'pants'
  if (title.includes('cap') || title.includes('keps')) return 'caps'
  if (title.includes('bag') || title.includes('väska')) return 'bags'
  if (title.includes('bottle') || title.includes('flaska')) return 'drinkware'
  if (title.includes('pen') || title.includes('penna')) return 'office'
  if (title.includes('usb') || title.includes('power')) return 'tech'
  
  return 'uncategorized'
}

function generateTags(product: any): string[] {
  const tags: string[] = []
  const title = (product.Title || product.title || '').toLowerCase()
  
  // Add relevant tags based on product
  if (title.includes('ladies') || title.includes('dam')) tags.push('womens')
  if (title.includes('mens') || title.includes('herr')) tags.push('mens')
  if (title.includes('organic') || title.includes('eko')) tags.push('organic')
  if (title.includes('premium')) tags.push('premium')
  if (product.brand_info) tags.push(extractBrand(product.brand_info))
  
  return tags.filter(Boolean)
}

ultimateFixAllProducts().catch(console.error)