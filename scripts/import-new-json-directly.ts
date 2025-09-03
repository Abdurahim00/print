import { MongoClient, ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''

interface JsonProduct {
  Url?: string
  Title?: string
  description?: string
  price?: string | number
  'Pris/st'?: string
  image_urls?: string[]
  variants_dict?: Array<{
    variant_url?: string
    variant_name?: string
    variant_image?: string
  }>
  product_info?: any
  [key: string]: any
}

async function parseNewJson(): Promise<JsonProduct[]> {
  console.log('📖 Reading new.json file...')
  
  // Read with latin1 encoding (detected earlier)
  const content = fs.readFileSync('new.json', 'latin1')
  console.log(`File size: ${(content.length / 1024 / 1024).toFixed(2)} MB`)
  
  // Try parsing with error recovery
  try {
    const data = JSON.parse(content)
    console.log(`✅ Parsed ${data.length} products`)
    return data
  } catch (error: any) {
    console.log('❌ JSON parsing failed, attempting to fix...')
    
    // Fix common issues
    let fixed = content
    
    // Fix the Detaljer field issues (quotes within quotes)
    fixed = fixed.replace(/"Detaljer":\s*"[^"]*(?:\\.[^"]*)*"/g, '"Detaljer": ""')
    
    // Remove trailing commas
    fixed = fixed.replace(/,\s*}/g, '}')
    fixed = fixed.replace(/,\s*]/g, ']')
    
    try {
      const data = JSON.parse(fixed)
      console.log(`✅ Fixed and parsed ${data.length} products`)
      return data
    } catch (error2) {
      console.log('❌ Still failed to parse. Using fallback parser...')
      
      // Fallback: try to extract products one by one
      const products: JsonProduct[] = []
      const productMatches = content.matchAll(/\{[^{}]*"Title":\s*"[^"]+[^{}]*\}/g)
      
      for (const match of productMatches) {
        try {
          const product = JSON.parse(match[0])
          products.push(product)
        } catch {}
      }
      
      console.log(`⚠️ Extracted ${products.length} products using fallback parser`)
      return products
    }
  }
}

function prepareProductForDB(product: JsonProduct): any {
  const now = new Date()
  
  // Parse price
  let price = 0
  if (product['Pris/st']) {
    price = parseFloat(product['Pris/st'].replace(/[^0-9.]/g, ''))
  } else if (product.price) {
    price = typeof product.price === 'string' 
      ? parseFloat(product.price.replace(/[^0-9.]/g, '')) 
      : product.price
  }
  
  // Get main image - use variant image if no main image
  let mainImage = 'https://via.placeholder.com/500'
  
  if (product.image_urls && product.image_urls.length > 0) {
    mainImage = product.image_urls[0]
  } else if (product.variants_dict && product.variants_dict.length > 0) {
    // Use first variant image as main image if no image_urls
    const firstVariantWithImage = product.variants_dict.find(v => v.variant_image)
    if (firstVariantWithImage && firstVariantWithImage.variant_image) {
      mainImage = firstVariantWithImage.variant_image
    }
  }
  
  // Collect all images (main + variant images)
  const allImages: string[] = []
  
  if (product.image_urls) {
    allImages.push(...product.image_urls)
  }
  
  if (product.variants_dict) {
    product.variants_dict.forEach(v => {
      if (v.variant_image && !allImages.includes(v.variant_image)) {
        allImages.push(v.variant_image)
      }
    })
  }
  
  const dbProduct: any = {
    name: product.Title || 'Unnamed Product',
    description: product.description || '',
    price: price || 0,
    basePrice: price || 0,
    image: mainImage,
    images: allImages.length > 0 ? allImages : [mainImage],
    inStock: true,
    featured: false,
    createdAt: now,
    updatedAt: now,
    isActive: true,
    eligibleForCoupons: true,
    source: 'new.json'
  }
  
  // Add SKU if available
  if (product.Artikelnummer) {
    dbProduct.sku = product.Artikelnummer
  }
  
  // Add variants
  if (product.variants_dict && product.variants_dict.length > 0) {
    dbProduct.variants = product.variants_dict.map(v => ({
      name: v.variant_name || '',
      image: v.variant_image || '',
      url: v.variant_url || ''
    }))
    dbProduct.hasVariations = true
  }
  
  // Add specifications from product_info
  if (product.product_info) {
    dbProduct.specifications = product.product_info
  }
  
  // Store original URL
  if (product.Url) {
    dbProduct.originalUrl = product.Url
  }
  
  return dbProduct
}

async function importNewJson() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found')
    process.exit(1)
  }
  
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    const collection = db.collection('products')
    
    // Parse the JSON file
    const products = await parseNewJson()
    
    if (products.length === 0) {
      console.error('❌ No products found!')
      return
    }
    
    console.log(`\n📊 Product Statistics:`)
    const withImages = products.filter(p => p.image_urls && p.image_urls.length > 0)
    const withVariants = products.filter(p => p.variants_dict && p.variants_dict.length > 0)
    const withoutImagesButVariants = products.filter(p => 
      (!p.image_urls || p.image_urls.length === 0) && 
      p.variants_dict && 
      p.variants_dict.some(v => v.variant_image)
    )
    
    console.log(`- Total products: ${products.length}`)
    console.log(`- With image_urls: ${withImages.length}`)
    console.log(`- With variants: ${withVariants.length}`)
    console.log(`- Without images but with variant images: ${withoutImagesButVariants.length}`)
    
    // Clear existing products
    console.log('\n🗑️ Clearing existing products...')
    const deleteResult = await collection.deleteMany({})
    console.log(`Removed ${deleteResult.deletedCount} products`)
    
    // Prepare products for insertion
    console.log('\n📥 Preparing products for import...')
    const dbProducts = products.map(prepareProductForDB)
    
    // Insert in batches
    const batchSize = 500
    let inserted = 0
    
    for (let i = 0; i < dbProducts.length; i += batchSize) {
      const batch = dbProducts.slice(i, Math.min(i + batchSize, dbProducts.length))
      const result = await collection.insertMany(batch)
      inserted += result.insertedCount
      console.log(`Progress: ${inserted}/${dbProducts.length} products inserted`)
    }
    
    console.log(`\n✅ Successfully imported ${inserted} products!`)
    
    // Verify
    const finalCount = await collection.countDocuments()
    const withImagesCount = await collection.countDocuments({
      image: { $ne: 'https://via.placeholder.com/500' }
    })
    
    console.log('\n📊 Final verification:')
    console.log(`- Total in database: ${finalCount}`)
    console.log(`- Products with images: ${withImagesCount}`)
    
    // Show samples
    console.log('\n📋 Sample products:')
    const samples = await collection.find({}).limit(5).toArray()
    samples.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`)
      console.log(`   Price: ${p.price || 'No price'}`)
      console.log(`   Image: ${p.image !== 'https://via.placeholder.com/500' ? '✓' : '✗'}`)
      console.log(`   Variants: ${p.variants ? p.variants.length : 0}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
    console.log('\n✅ Done!')
  }
}

// Run
importNewJson().catch(console.error)