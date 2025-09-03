import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI!
const DATABASE_NAME = 'printwrap-pro'

interface PrendoProduct {
  Url?: string
  Title?: string
  description?: string
  image_urls?: string[]
  Sizes?: string[]
  Article_no?: string
  price_before_tax?: string
  price_after_tax?: string
  brand_info?: string
  product_info?: Record<string, string>
  variants_dict?: Array<{
    variant_url?: string
    variant_name?: string
    variant_image?: string
  }>
}

// Enhanced category patterns
const categoryPatterns = [
  { patterns: ['sweatshirt', 'tröja', 'troja'], category: 'Apparel', subcategory: 'Sweatshirts' },
  { patterns: ['hoodie', 'hoodjacka', 'huvtröja', 'hood'], category: 'Apparel', subcategory: 'Hoodies' },
  { patterns: ['t-shirt', 'tshirt', 't shirt'], category: 'Apparel', subcategory: 'T-Shirts' },
  { patterns: ['piké', 'pike', 'polo'], category: 'Apparel', subcategory: 'Polos' },
  { patterns: ['skjorta', 'shirt'], category: 'Apparel', subcategory: 'Shirts' },
  { patterns: ['jacka', 'jacket'], category: 'Apparel', subcategory: 'Jackets' },
  { patterns: ['byxor', 'byxa', 'pants', 'trouser'], category: 'Apparel', subcategory: 'Pants' },
  { patterns: ['shorts'], category: 'Apparel', subcategory: 'Shorts' },
  { patterns: ['väst', 'vest'], category: 'Apparel', subcategory: 'Vests' },
  { patterns: ['overall'], category: 'Apparel', subcategory: 'Overalls' },
  { patterns: ['fleece'], category: 'Apparel', subcategory: 'Fleece' },
  { patterns: ['softshell'], category: 'Apparel', subcategory: 'Softshell' },
  { patterns: ['keps', 'cap'], category: 'Accessories', subcategory: 'Caps' },
  { patterns: ['mössa', 'beanie', 'mossa'], category: 'Accessories', subcategory: 'Beanies' },
  { patterns: ['hatt', 'hat'], category: 'Accessories', subcategory: 'Hats' },
  { patterns: ['halsduk', 'scarf'], category: 'Accessories', subcategory: 'Scarves' },
  { patterns: ['handskar', 'gloves'], category: 'Accessories', subcategory: 'Gloves' },
  { patterns: ['bälte', 'belt'], category: 'Accessories', subcategory: 'Belts' },
  { patterns: ['paraply', 'umbrella'], category: 'Accessories', subcategory: 'Umbrellas' },
  { patterns: ['nyckelring', 'keychain', 'keyring'], category: 'Promotional Items', subcategory: 'Keychains' },
  { patterns: ['penna', 'pen', 'kulspets'], category: 'Promotional Items', subcategory: 'Pens' },
  { patterns: ['anteckningsbok', 'notebook'], category: 'Promotional Items', subcategory: 'Notebooks' },
  { patterns: ['lanyard', 'nyckelband'], category: 'Promotional Items', subcategory: 'Lanyards' },
  { patterns: ['mugg', 'mug', 'kopp', 'cup'], category: 'Drinkware', subcategory: 'Mugs' },
  { patterns: ['flaska', 'bottle', 'vattenflaska'], category: 'Drinkware', subcategory: 'Bottles' },
  { patterns: ['termos', 'thermos'], category: 'Drinkware', subcategory: 'Thermos' },
  { patterns: ['väska', 'bag', 'vaska'], category: 'Bags', subcategory: 'Bags' },
  { patterns: ['kasse', 'tote'], category: 'Bags', subcategory: 'Tote Bags' },
  { patterns: ['ryggsäck', 'backpack', 'ryggsack'], category: 'Bags', subcategory: 'Backpacks' },
  { patterns: ['sportväska', 'sports bag', 'gymväska', 'duffel'], category: 'Bags', subcategory: 'Sports Bags' },
  { patterns: ['usb', 'minnessticka', 'flash'], category: 'Tech Accessories', subcategory: 'USB Drives' },
  { patterns: ['powerbank', 'power bank', 'laddare'], category: 'Tech Accessories', subcategory: 'Power Banks' },
  { patterns: ['högtalare', 'speaker', 'bluetooth'], category: 'Tech Accessories', subcategory: 'Speakers' },
  { patterns: ['hörlurar', 'headphones', 'earphones'], category: 'Tech Accessories', subcategory: 'Headphones' },
  { patterns: ['handduk', 'towel'], category: 'Textiles', subcategory: 'Towels' },
  { patterns: ['filt', 'blanket', 'pläd'], category: 'Textiles', subcategory: 'Blankets' },
  { patterns: ['reflex', 'reflector'], category: 'Safety', subcategory: 'Reflectors' },
  { patterns: ['varsel', 'hi-vis', 'high visibility'], category: 'Safety', subcategory: 'Hi-Vis Clothing' },
]

function cleanText(text: string): string {
  if (!text) return ''
  
  let cleaned = text
    .replace(/Ã¤/g, 'ä')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¥/g, 'å')
    .replace(/Ã„/g, 'Ä')
    .replace(/Ã–/g, 'Ö')
    .replace(/Ã…/g, 'Å')
    .replace(/Ã©/g, 'é')
    .replace(/Â°/g, '°')
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, '')
    .replace(/\\t/g, ' ')
    .replace(/\\/g, '')
  
  return cleaned.trim()
}

function detectCategory(product: PrendoProduct): { category: string, subcategory: string } {
  const searchText = `${product.Title || ''} ${product.Url || ''} ${product.description || ''}`.toLowerCase()
  
  for (const mapping of categoryPatterns) {
    for (const pattern of mapping.patterns) {
      if (searchText.includes(pattern.toLowerCase())) {
        return { category: mapping.category, subcategory: mapping.subcategory }
      }
    }
  }
  
  return { category: 'Other', subcategory: 'Miscellaneous' }
}

function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0
  
  const cleanPrice = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.')
  const price = parseFloat(cleanPrice)
  return isNaN(price) || price <= 0 ? 0 : price
}

async function extractProductsFromFile(filepath: string): Promise<PrendoProduct[]> {
  console.log('Reading and parsing file...')
  
  const content = fs.readFileSync(filepath, 'latin1')
  const cleanedContent = cleanText(content)
  
  const products: PrendoProduct[] = []
  
  // Use regex to extract product objects
  const productRegex = /\{[^{}]*"Url"\s*:\s*"[^"]+",[\s\S]*?"variants_dict"\s*:\s*\[[^\]]*\][^}]*\}/g
  const matches = cleanedContent.matchAll(productRegex)
  
  for (const match of matches) {
    let productStr = match[0]
    
    // Clean JSON
    productStr = productStr
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/:\s*,/g, ': null,')
    
    try {
      const product = JSON.parse(productStr)
      if (product.Url && product.Title) {
        products.push(product)
      }
    } catch {
      // Try manual extraction
      const product: PrendoProduct = {}
      
      const urlMatch = productStr.match(/"Url"\s*:\s*"([^"]+)"/)
      if (urlMatch) product.Url = urlMatch[1]
      
      const titleMatch = productStr.match(/"Title"\s*:\s*"([^"]+)"/)
      if (titleMatch) product.Title = titleMatch[1]
      
      const descMatch = productStr.match(/"description"\s*:\s*"([^"]+)"/)
      if (descMatch) product.description = descMatch[1]
      
      const articleMatch = productStr.match(/"Article_no"\s*:\s*"([^"]+)"/)
      if (articleMatch) product.Article_no = articleMatch[1]
      
      const priceBeforeMatch = productStr.match(/"price_before_tax"\s*:\s*"([^"]+)"/)
      if (priceBeforeMatch) product.price_before_tax = priceBeforeMatch[1]
      
      const priceAfterMatch = productStr.match(/"price_after_tax"\s*:\s*"([^"]+)"/)
      if (priceAfterMatch) product.price_after_tax = priceAfterMatch[1]
      
      const sizesMatch = productStr.match(/"Sizes"\s*:\s*\[([^\]]+)\]/)
      if (sizesMatch) {
        product.Sizes = sizesMatch[1].split(',').map(s => s.trim().replace(/"/g, ''))
      }
      
      const brandMatch = productStr.match(/"brand_info"\s*:\s*"([^"]+)"/)
      if (brandMatch) product.brand_info = brandMatch[1]
      
      // Extract variants
      const variantsMatch = productStr.match(/"variants_dict"\s*:\s*\[([^\]]*)\]/)
      if (variantsMatch) {
        const variantsStr = variantsMatch[1]
        const variants: any[] = []
        
        const variantRegex = /\{[^}]+\}/g
        const variantMatches = variantsStr.matchAll(variantRegex)
        
        for (const vMatch of variantMatches) {
          const vStr = vMatch[0]
          const variant: any = {}
          
          const vNameMatch = vStr.match(/"variant_name"\s*:\s*"([^"]+)"/)
          if (vNameMatch) variant.variant_name = vNameMatch[1]
          
          const vImageMatch = vStr.match(/"variant_image"\s*:\s*"([^"]+)"/)
          if (vImageMatch) variant.variant_image = vImageMatch[1]
          
          if (Object.keys(variant).length > 0) {
            variants.push(variant)
          }
        }
        
        product.variants_dict = variants
      }
      
      if (product.Url && product.Title) {
        products.push(product)
      }
    }
  }
  
  console.log(`Extracted ${products.length} products`)
  return products
}

async function importToMongoDB(products: PrendoProduct[]) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    const categoriesCollection = db.collection('categories')
    const subcategoriesCollection = db.collection('subcategories')
    
    // Check existing data
    const existingCount = await productsCollection.countDocuments({ source: 'prendo' })
    console.log(`Existing Prendo products: ${existingCount}`)
    
    // Get existing SKUs
    const existingSkus = new Set<string>()
    const existingProducts = await productsCollection.find(
      { source: 'prendo' },
      { projection: { sku: 1 } }
    ).toArray()
    
    for (const product of existingProducts) {
      if (product.sku) existingSkus.add(product.sku)
    }
    
    console.log(`Found ${existingSkus.size} existing SKUs`)
    
    // Get existing categories and subcategories
    const categoryMap = new Map<string, ObjectId>()
    const categories = await categoriesCollection.find({}).toArray()
    for (const cat of categories) {
      categoryMap.set(cat.name, cat._id)
    }
    
    const subcategoryMap = new Map<string, ObjectId>()
    const subcategories = await subcategoriesCollection.find({}).toArray()
    for (const sub of subcategories) {
      subcategoryMap.set(`${sub.categoryId}_${sub.name}`, sub._id)
    }
    
    // Process products in batches
    const batchSize = 500
    let totalImported = 0
    let totalSkipped = 0
    let duplicates = 0
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      const documents: any[] = []
      
      for (const product of batch) {
        try {
          // Skip duplicates
          const sku = product.Article_no || ''
          if (sku && existingSkus.has(sku)) {
            duplicates++
            continue
          }
          
          // Detect category
          const { category, subcategory } = detectCategory(product)
          
          // Create category if needed
          if (!categoryMap.has(category)) {
            const catDoc = {
              name: category,
              slug: category.toLowerCase().replace(/\s+/g, '-'),
              description: `${category} category`,
              isActive: true,
              isDesignable: ['Apparel', 'Accessories', 'Bags'].includes(category),
              createdAt: new Date(),
              updatedAt: new Date()
            }
            const result = await categoriesCollection.insertOne(catDoc)
            categoryMap.set(category, result.insertedId)
            console.log(`Created category: ${category}`)
          }
          
          const categoryId = categoryMap.get(category)!
          
          // Create subcategory if needed
          const subKey = `${categoryId}_${subcategory}`
          if (!subcategoryMap.has(subKey)) {
            const subDoc = {
              name: subcategory,
              slug: subcategory.toLowerCase().replace(/\s+/g, '-'),
              categoryId: categoryId,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
            const result = await subcategoriesCollection.insertOne(subDoc)
            subcategoryMap.set(subKey, result.insertedId)
            console.log(`Created subcategory: ${subcategory}`)
          }
          
          const subcategoryId = subcategoryMap.get(subKey)!
          
          // Parse price
          const price = parsePrice(product.price_before_tax || product.price_after_tax)
          if (price <= 0) {
            totalSkipped++
            continue
          }
          
          // Extract brand
          let brand = 'Unknown'
          if (product.brand_info) {
            const brandLines = product.brand_info.split('\n')
            if (brandLines.length > 0) {
              brand = cleanText(brandLines[0])
            }
          }
          
          // Get images
          const variants = product.variants_dict || []
          const mainImage = variants[0]?.variant_image || 'https://via.placeholder.com/500'
          const images = variants
            .map(v => v.variant_image)
            .filter(Boolean) as string[]
          
          // Transform variants
          const variations = variants
            .filter(v => v.variant_name)
            .map(v => ({
              name: cleanText(v.variant_name || ''),
              image: v.variant_image || '',
              price: price,
              inStock: true
            }))
          
          // Create document
          const doc = {
            name: cleanText(product.Title || 'Unnamed Product'),
            description: cleanText(product.description || ''),
            price: price,
            basePrice: price,
            image: mainImage,
            images: images.length > 0 ? images : [mainImage],
            categoryId: categoryId,
            subcategoryId: subcategoryId,
            inStock: true,
            featured: false,
            isActive: true,
            sku: sku || `prendo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            brand: brand,
            type: 'product',
            sizes: product.Sizes || [],
            hasVariations: variations.length > 0,
            variations: variations,
            tags: [brand, category, subcategory].filter(Boolean),
            source: 'prendo',
            originalData: {
              url: product.Url || '',
              articleNo: sku
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }
          
          documents.push(doc)
          
          // Add to existing SKUs
          if (sku) existingSkus.add(sku)
          
        } catch (error) {
          totalSkipped++
        }
      }
      
      // Insert batch
      if (documents.length > 0) {
        try {
          const result = await productsCollection.insertMany(documents, { ordered: false })
          totalImported += result.insertedCount
          console.log(`Batch ${Math.floor(i / batchSize) + 1}: Imported ${result.insertedCount} products (Total: ${totalImported})`)
        } catch (error: any) {
          if (error.writeErrors) {
            const imported = documents.length - error.writeErrors.length
            totalImported += imported
            duplicates += error.writeErrors.length
            console.log(`Batch ${Math.floor(i / batchSize) + 1}: ${imported} imported, ${error.writeErrors.length} duplicates`)
          } else {
            console.error('Batch insert error:', error)
          }
        }
      }
      
      // Progress update
      if ((i + batchSize) % 5000 === 0 || i + batchSize >= products.length) {
        console.log(`Progress: ${Math.min(i + batchSize, products.length)}/${products.length} products processed`)
      }
    }
    
    // Final count
    const finalCount = await productsCollection.countDocuments({ source: 'prendo' })
    
    console.log('\n=== Import Complete ===')
    console.log(`Total products processed: ${products.length}`)
    console.log(`Successfully imported: ${totalImported}`)
    console.log(`Skipped (invalid): ${totalSkipped}`)
    console.log(`Duplicates: ${duplicates}`)
    console.log(`Total Prendo products in database: ${finalCount}`)
    
  } finally {
    await client.close()
    console.log('MongoDB connection closed')
  }
}

async function main() {
  console.log('Starting complete Prendo products import...')
  
  // Extract products from file
  const filepath = path.join(process.cwd(), 'prendo_unique_combine_output.json')
  const products = await extractProductsFromFile(filepath)
  
  if (products.length === 0) {
    console.log('No products found to import')
    return
  }
  
  // Import to MongoDB
  await importToMongoDB(products)
  
  console.log('Import completed!')
}

main().catch(error => {
  console.error('Import failed:', error)
  process.exit(1)
})