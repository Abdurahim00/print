import { MongoClient, ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''

interface JsonProduct {
  name?: string
  Title?: string
  description?: string
  price?: number | string
  basePrice?: number
  price_before_tax?: string
  price_after_tax?: string
  image?: string
  image_urls?: string[]
  images?: string[]
  categoryId?: string
  subcategoryIds?: string[]
  inStock?: boolean
  featured?: boolean
  brand?: string
  brand_info?: string
  sku?: string
  Article_no?: string
  variations?: any[]
  variants?: any[]
  variants_dict?: any[]
  sizes?: string[]
  Sizes?: string[]
  colors?: string[]
  tags?: string[]
  specifications?: any
  product_info?: any
  [key: string]: any
}

async function loadJsonProducts(): Promise<JsonProduct[]> {
  const allProducts: JsonProduct[] = []
  
  // List of JSON files to check
  const jsonFiles = [
    'prendo_output_22_08_2025 (1).json',
    'prendo_output_clean.json',
    'prendo_unique_combine_output_clean.json.raw',
    'sample_prendo.txt'
  ]
  
  for (const fileName of jsonFiles) {
    const filePath = path.join(process.cwd(), fileName)
    if (fs.existsSync(filePath)) {
      try {
        console.log(`📖 Reading ${fileName}...`)
        const content = fs.readFileSync(filePath, 'utf-8')
        const data = JSON.parse(content)
        
        if (Array.isArray(data)) {
          console.log(`  Found ${data.length} products in ${fileName}`)
          allProducts.push(...data)
        } else if (data.products && Array.isArray(data.products)) {
          console.log(`  Found ${data.products.length} products in ${fileName}`)
          allProducts.push(...data.products)
        }
      } catch (error) {
        console.error(`  ❌ Error reading ${fileName}:`, error)
      }
    }
  }
  
  // Remove duplicates based on name or Title
  const uniqueProducts = new Map<string, JsonProduct>()
  for (const product of allProducts) {
    const key = product.name || product.Title
    if (key) {
      uniqueProducts.set(key, product)
    }
  }
  
  return Array.from(uniqueProducts.values())
}

function prepareProductForDB(product: JsonProduct): any {
  // Prepare product for database insertion
  const now = new Date()
  
  // Parse price from string if needed
  let price = 0
  if (product.price) {
    price = typeof product.price === 'string' ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : product.price
  } else if (product.price_after_tax) {
    price = parseFloat(product.price_after_tax.replace(/[^0-9.]/g, ''))
  } else if (product.product_info?.['Pris/st']) {
    price = parseFloat(product.product_info['Pris/st'].replace(/[^0-9.]/g, ''))
  }
  
  const dbProduct: any = {
    name: product.name || product.Title || 'Unnamed Product',
    description: product.description || '',
    price: price || product.basePrice || 0,
    basePrice: product.basePrice || price || 0,
    inStock: product.inStock !== undefined ? product.inStock : true,
    featured: product.featured || false,
    createdAt: now,
    updatedAt: now,
    isActive: true,
    eligibleForCoupons: true,
    sku: product.sku || product.Article_no || '',
    brand: product.brand || product.brand_info || ''
  }
  
  // Handle image - prefer actual URL over placeholder
  if (product.image && !product.image.includes('placeholder')) {
    dbProduct.image = product.image
  } else if (product.image_urls && product.image_urls.length > 0) {
    // Use image_urls from Prendo data
    dbProduct.image = product.image_urls[0]
    dbProduct.images = product.image_urls
  } else if (product.images && product.images.length > 0) {
    // Use first non-placeholder image from images array
    const validImage = product.images.find(img => img && !img.includes('placeholder'))
    dbProduct.image = validImage || product.images[0]
    dbProduct.images = product.images
  } else {
    // Default placeholder if no image
    dbProduct.image = 'https://via.placeholder.com/500'
  }
  
  // Handle additional images
  if (product.images && Array.isArray(product.images)) {
    dbProduct.images = product.images
  } else if (product.image_urls && Array.isArray(product.image_urls)) {
    dbProduct.images = product.image_urls
  }
  
  // Handle category - ensure it's ObjectId if provided
  if (product.categoryId) {
    try {
      dbProduct.categoryId = new ObjectId(product.categoryId)
    } catch {
      dbProduct.categoryId = product.categoryId // Keep as string if not valid ObjectId
    }
  }
  
  // Handle subcategories
  if (product.subcategoryIds && Array.isArray(product.subcategoryIds)) {
    dbProduct.subcategoryIds = product.subcategoryIds.map(id => {
      try {
        return new ObjectId(id)
      } catch {
        return id
      }
    })
  }
  
  // Handle sizes
  if (product.Sizes && Array.isArray(product.Sizes)) {
    dbProduct.sizes = product.Sizes
  } else if (product.sizes && Array.isArray(product.sizes)) {
    dbProduct.sizes = product.sizes
  }
  
  // Handle variants from Prendo data
  if (product.variants_dict && Array.isArray(product.variants_dict)) {
    dbProduct.variants = product.variants_dict.map(v => ({
      name: v.variant_name,
      image: v.variant_image,
      url: v.variant_url,
      sku: v.sku || ''
    }))
    dbProduct.hasVariations = true
  } else if (product.variants && Array.isArray(product.variants)) {
    dbProduct.variants = product.variants
    dbProduct.hasVariations = true
  }
  
  // Copy over other fields
  const fieldsToPreserve = [
    'tags', 'specifications',
    'variations', 'hasVariations',
    'sizePrices', 'colors',
    'individualAngleImages', 'frontImage', 'backImage',
    'leftImage', 'rightImage', 'materialImage',
    'frontAltText', 'backAltText', 'leftAltText',
    'rightAltText', 'materialAltText'
  ]
  
  for (const field of fieldsToPreserve) {
    if (product[field] !== undefined) {
      dbProduct[field] = product[field]
    }
  }
  
  // Add product_info as specifications if available
  if (product.product_info && !dbProduct.specifications) {
    dbProduct.specifications = product.product_info
  }
  
  // Ensure hasVariations is set correctly
  if (dbProduct.variants && dbProduct.variants.length > 0) {
    dbProduct.hasVariations = true
  }
  if (dbProduct.variations && dbProduct.variations.length > 0) {
    dbProduct.hasVariations = true
  }
  
  return dbProduct
}

async function replaceWithJsonProducts() {
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
    
    // Step 1: Load all products from JSON files
    console.log('\n📂 Loading products from JSON files...')
    const jsonProducts = await loadJsonProducts()
    console.log(`✅ Loaded ${jsonProducts.length} unique products from JSON files`)
    
    if (jsonProducts.length === 0) {
      console.error('❌ No products found in JSON files!')
      return
    }
    
    // Step 2: Clear existing products
    console.log('\n🗑️ Removing existing products from database...')
    const deleteResult = await productsCollection.deleteMany({})
    console.log(`✅ Removed ${deleteResult.deletedCount} existing products`)
    
    // Step 3: Prepare and insert new products
    console.log('\n📥 Inserting products from JSON...')
    const productsToInsert = jsonProducts.map(prepareProductForDB)
    
    // Insert in batches to avoid memory issues
    const batchSize = 100
    let insertedCount = 0
    
    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize)
      const result = await productsCollection.insertMany(batch)
      insertedCount += result.insertedCount
      console.log(`  Inserted batch: ${insertedCount}/${productsToInsert.length}`)
    }
    
    console.log(`✅ Successfully inserted ${insertedCount} products`)
    
    // Step 4: Create indexes for better performance
    console.log('\n🔍 Creating indexes...')
    try {
      await productsCollection.createIndex({ name: 'text', description: 'text' })
      await productsCollection.createIndex({ categoryId: 1 })
      await productsCollection.createIndex({ featured: -1 })
      await productsCollection.createIndex({ inStock: -1 })
      await productsCollection.createIndex({ price: 1 })
      await productsCollection.createIndex({ createdAt: -1 })
      console.log('✅ Indexes created')
    } catch (error) {
      console.log('⚠️ Some indexes may already exist:', error)
    }
    
    // Step 5: Verify the import
    console.log('\n📊 Verification:')
    const totalProducts = await productsCollection.countDocuments()
    const withImages = await productsCollection.countDocuments({ 
      image: { $exists: true, $ne: null, $ne: '' }
    })
    const inStock = await productsCollection.countDocuments({ inStock: true })
    const featured = await productsCollection.countDocuments({ featured: true })
    
    console.log(`  Total products: ${totalProducts}`)
    console.log(`  Products with images: ${withImages}`)
    console.log(`  Products in stock: ${inStock}`)
    console.log(`  Featured products: ${featured}`)
    
    // Show sample of imported products
    console.log('\n📋 Sample of imported products:')
    const samples = await productsCollection.find({}).limit(5).toArray()
    samples.forEach(p => {
      console.log(`  - ${p.name} (${p.price || 'No price'}, ${p.image ? 'Has image' : 'No image'})`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('\n✅ Database connection closed')
    console.log('🎉 Product replacement complete!')
  }
}

// Run the script
replaceWithJsonProducts().catch(console.error)