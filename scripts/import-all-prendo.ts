import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI!
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

// Enhanced category mapping
const categoryPatterns = [
  // Apparel
  { patterns: ['sweatshirt', 'tröja', 'troja'], category: 'Apparel', subcategory: 'Sweatshirts' },
  { patterns: ['hoodie', 'hoodjacka', 'huvtröja'], category: 'Apparel', subcategory: 'Hoodies' },
  { patterns: ['t-shirt', 'tshirt', 't shirt'], category: 'Apparel', subcategory: 'T-Shirts' },
  { patterns: ['piké', 'pike', 'polo'], category: 'Apparel', subcategory: 'Polos' },
  { patterns: ['skjorta', 'shirt'], category: 'Apparel', subcategory: 'Shirts' },
  { patterns: ['jacka', 'jacket'], category: 'Apparel', subcategory: 'Jackets' },
  { patterns: ['byxor', 'byxa', 'pants'], category: 'Apparel', subcategory: 'Pants' },
  { patterns: ['shorts'], category: 'Apparel', subcategory: 'Shorts' },
  { patterns: ['väst', 'vest'], category: 'Apparel', subcategory: 'Vests' },
  { patterns: ['overall'], category: 'Apparel', subcategory: 'Overalls' },
  { patterns: ['fleece'], category: 'Apparel', subcategory: 'Fleece' },
  { patterns: ['softshell'], category: 'Apparel', subcategory: 'Softshell' },
  
  // Accessories
  { patterns: ['keps', 'cap'], category: 'Accessories', subcategory: 'Caps' },
  { patterns: ['mössa', 'beanie', 'mossa'], category: 'Accessories', subcategory: 'Beanies' },
  { patterns: ['hatt', 'hat'], category: 'Accessories', subcategory: 'Hats' },
  { patterns: ['halsduk', 'scarf'], category: 'Accessories', subcategory: 'Scarves' },
  { patterns: ['handskar', 'gloves'], category: 'Accessories', subcategory: 'Gloves' },
  { patterns: ['bälte', 'belt'], category: 'Accessories', subcategory: 'Belts' },
  { patterns: ['paraply', 'umbrella'], category: 'Accessories', subcategory: 'Umbrellas' },
  { patterns: ['solglasögon', 'sunglasses'], category: 'Accessories', subcategory: 'Sunglasses' },
  
  // Promotional Items
  { patterns: ['nyckelring', 'keychain', 'keyring'], category: 'Promotional Items', subcategory: 'Keychains' },
  { patterns: ['penna', 'pen', 'kulspetspenna'], category: 'Promotional Items', subcategory: 'Pens' },
  { patterns: ['anteckningsbok', 'notebook'], category: 'Promotional Items', subcategory: 'Notebooks' },
  { patterns: ['klistermärke', 'sticker'], category: 'Promotional Items', subcategory: 'Stickers' },
  { patterns: ['badge', 'pin'], category: 'Promotional Items', subcategory: 'Badges' },
  { patterns: ['lanyard', 'nyckelband'], category: 'Promotional Items', subcategory: 'Lanyards' },
  
  // Drinkware
  { patterns: ['mugg', 'mug', 'kopp'], category: 'Drinkware', subcategory: 'Mugs' },
  { patterns: ['flaska', 'bottle', 'vattenflaska'], category: 'Drinkware', subcategory: 'Bottles' },
  { patterns: ['termos', 'thermos'], category: 'Drinkware', subcategory: 'Thermos' },
  { patterns: ['glas', 'glass'], category: 'Drinkware', subcategory: 'Glasses' },
  
  // Bags
  { patterns: ['väska', 'bag', 'vaska'], category: 'Bags', subcategory: 'Bags' },
  { patterns: ['kasse', 'tote', 'shoppingväska'], category: 'Bags', subcategory: 'Tote Bags' },
  { patterns: ['ryggsäck', 'backpack', 'ryggsack'], category: 'Bags', subcategory: 'Backpacks' },
  { patterns: ['sportväska', 'sports bag', 'gymväska'], category: 'Bags', subcategory: 'Sports Bags' },
  { patterns: ['necessär', 'toiletry'], category: 'Bags', subcategory: 'Toiletry Bags' },
  { patterns: ['datorväska', 'laptop bag'], category: 'Bags', subcategory: 'Laptop Bags' },
  
  // Tech
  { patterns: ['usb', 'minnessticka', 'flash drive'], category: 'Tech Accessories', subcategory: 'USB Drives' },
  { patterns: ['powerbank', 'power bank', 'laddare'], category: 'Tech Accessories', subcategory: 'Power Banks' },
  { patterns: ['högtalare', 'speaker', 'bluetooth'], category: 'Tech Accessories', subcategory: 'Speakers' },
  { patterns: ['hörlurar', 'headphones', 'earphones'], category: 'Tech Accessories', subcategory: 'Headphones' },
  { patterns: ['mobilskal', 'phone case'], category: 'Tech Accessories', subcategory: 'Phone Cases' },
  { patterns: ['kabel', 'cable'], category: 'Tech Accessories', subcategory: 'Cables' },
  
  // Textiles
  { patterns: ['handduk', 'towel'], category: 'Textiles', subcategory: 'Towels' },
  { patterns: ['filt', 'blanket', 'pläd'], category: 'Textiles', subcategory: 'Blankets' },
  { patterns: ['kudde', 'pillow', 'cushion'], category: 'Textiles', subcategory: 'Pillows' },
  
  // Safety
  { patterns: ['reflex', 'reflector', 'reflexväst'], category: 'Safety', subcategory: 'Reflectors' },
  { patterns: ['varselväst', 'hi-vis', 'high visibility'], category: 'Safety', subcategory: 'Hi-Vis Clothing' },
  { patterns: ['hjälm', 'helmet'], category: 'Safety', subcategory: 'Helmets' },
  { patterns: ['skyddsglasögon', 'safety glasses'], category: 'Safety', subcategory: 'Safety Glasses' },
  
  // Sports & Leisure
  { patterns: ['boll', 'ball'], category: 'Sports & Leisure', subcategory: 'Balls' },
  { patterns: ['yogamatta', 'yoga mat'], category: 'Sports & Leisure', subcategory: 'Yoga' },
  { patterns: ['träningsband', 'resistance band'], category: 'Sports & Leisure', subcategory: 'Exercise Equipment' },
  { patterns: ['frisbee'], category: 'Sports & Leisure', subcategory: 'Outdoor Games' },
  
  // Food & Beverage
  { patterns: ['godis', 'candy', 'choklad'], category: 'Food & Beverage', subcategory: 'Candy' },
  { patterns: ['kaffe', 'coffee'], category: 'Food & Beverage', subcategory: 'Coffee' },
  { patterns: ['te', 'tea'], category: 'Food & Beverage', subcategory: 'Tea' },
  
  // Toys & Games
  { patterns: ['leksak', 'toy', 'gosedjur'], category: 'Toys & Games', subcategory: 'Toys' },
  { patterns: ['pussel', 'puzzle'], category: 'Toys & Games', subcategory: 'Puzzles' },
  { patterns: ['spel', 'game'], category: 'Toys & Games', subcategory: 'Games' },
  
  // Home & Office
  { patterns: ['ljus', 'candle'], category: 'Home & Office', subcategory: 'Candles' },
  { patterns: ['ram', 'frame'], category: 'Home & Office', subcategory: 'Frames' },
  { patterns: ['klocka', 'clock', 'watch'], category: 'Home & Office', subcategory: 'Clocks' },
  { patterns: ['kalender', 'calendar'], category: 'Home & Office', subcategory: 'Calendars' },
  { patterns: ['musmattor', 'mouse pad'], category: 'Home & Office', subcategory: 'Mouse Pads' }
]

function detectCategoryFromProduct(product: PrendoProduct): { categoryName: string, subcategoryName: string } {
  const searchText = `${product.Title} ${product.Url} ${product.description}`.toLowerCase()
  
  for (const mapping of categoryPatterns) {
    for (const pattern of mapping.patterns) {
      if (searchText.includes(pattern.toLowerCase())) {
        return {
          categoryName: mapping.category,
          subcategoryName: mapping.subcategory
        }
      }
    }
  }
  
  // Try to detect brand-specific categories
  if (searchText.includes('projob') || searchText.includes('clique') || searchText.includes('craft')) {
    // Try to find apparel type
    for (const mapping of categoryPatterns) {
      if (mapping.category === 'Apparel') {
        for (const pattern of mapping.patterns) {
          if (searchText.includes(pattern.toLowerCase())) {
            return {
              categoryName: mapping.category,
              subcategoryName: mapping.subcategory
            }
          }
        }
      }
    }
  }
  
  // Default category
  return {
    categoryName: 'Other',
    subcategoryName: 'Miscellaneous'
  }
}

function parsePrice(priceStr: string): number {
  if (!priceStr) return 0
  const cleanPrice = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.')
  const price = parseFloat(cleanPrice)
  return isNaN(price) || price <= 0 ? 0 : price
}

function cleanText(text: string): string {
  if (!text) return ''
  return text
    .replace(/�/g, 'ä')
    .replace(/�/g, 'ö')
    .replace(/�/g, 'å')
    .replace(/�/g, 'Ä')
    .replace(/�/g, 'Ö')
    .replace(/�/g, 'Å')
    .replace(/�/g, 'é')
    .replace(/�/g, '°')
    .replace(/\\/g, '')
    .trim()
}

async function parseJsonFile(filePath: string): Promise<PrendoProduct[]> {
  console.log('Parsing JSON file...')
  
  const buffer = fs.readFileSync(filePath)
  let content = buffer.toString('latin1')
  
  content = cleanText(content)
  
  const products: PrendoProduct[] = []
  
  // More robust parsing - split by product boundaries
  const lines = content.split('\n')
  let currentProduct = ''
  let braceCount = 0
  let inProduct = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.includes('"Url"') && line.includes(':')) {
      if (inProduct && currentProduct) {
        // Try to parse the previous product
        try {
          const product = JSON.parse(currentProduct)
          if (product.Url && product.Title) {
            products.push(product)
          }
        } catch (e) {
          // Skip invalid product
        }
      }
      inProduct = true
      currentProduct = '{'
      braceCount = 1
    } else if (inProduct) {
      currentProduct += '\n' + line
      
      // Count braces to find end of product
      for (const char of line) {
        if (char === '{') braceCount++
        else if (char === '}') {
          braceCount--
          if (braceCount === 0) {
            // End of product
            try {
              // Clean up JSON
              let cleanProduct = currentProduct
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']')
                .replace(/:\s*,/g, ': null,')
                .replace(/\n/g, ' ')
                .replace(/\r/g, '')
                .replace(/\t/g, ' ')
                .replace(/\s+/g, ' ')
              
              const product = JSON.parse(cleanProduct)
              if (product.Url && product.Title) {
                products.push(product)
              }
            } catch (e) {
              // Skip invalid product
            }
            inProduct = false
            currentProduct = ''
            break
          }
        }
      }
    }
  }
  
  // Try to parse the last product if exists
  if (inProduct && currentProduct) {
    try {
      const product = JSON.parse(currentProduct)
      if (product.Url && product.Title) {
        products.push(product)
      }
    } catch (e) {
      // Skip invalid product
    }
  }
  
  console.log(`Successfully parsed ${products.length} products`)
  return products
}

async function importProducts() {
  console.log('Starting complete Prendo products import...')
  
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    const categoriesCollection = db.collection('categories')
    const subcategoriesCollection = db.collection('subcategories')
    
    // Check existing count
    const existingCount = await productsCollection.countDocuments({ source: 'prendo' })
    console.log(`Existing Prendo products in database: ${existingCount}`)
    
    // Parse the JSON file
    const filePath = path.join(process.cwd(), 'prendo_unique_combine_output.json')
    const products = await parseJsonFile(filePath)
    
    if (products.length === 0) {
      console.log('No valid products found to import')
      return
    }
    
    // Get existing products to avoid duplicates
    const existingSkus = new Set(
      (await productsCollection.find({ source: 'prendo' }, { projection: { sku: 1 } }).toArray())
        .map(p => p.sku)
        .filter(Boolean)
    )
    
    console.log(`Found ${existingSkus.size} existing SKUs`)
    
    // Get existing categories and subcategories
    const existingCategories = await categoriesCollection.find({}).toArray()
    const existingSubcategories = await subcategoriesCollection.find({}).toArray()
    
    const categoryMap = new Map(existingCategories.map(c => [c.name, c._id]))
    const subcategoryMap = new Map(existingSubcategories.map(s => [`${s.categoryId}_${s.name}`, s._id]))
    
    // Collect unique categories and subcategories
    const neededCategories = new Map<string, Set<string>>()
    
    for (const product of products) {
      const { categoryName, subcategoryName } = detectCategoryFromProduct(product)
      
      if (!neededCategories.has(categoryName)) {
        neededCategories.set(categoryName, new Set())
      }
      neededCategories.get(categoryName)!.add(subcategoryName)
    }
    
    // Create missing categories
    for (const [categoryName, subcategories] of neededCategories) {
      if (!categoryMap.has(categoryName)) {
        const result = await categoriesCollection.insertOne({
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
          description: `${categoryName} category`,
          isActive: true,
          isDesignable: ['Apparel', 'Accessories', 'Bags'].includes(categoryName),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        
        categoryMap.set(categoryName, result.insertedId)
        console.log(`Created category: ${categoryName}`)
      }
      
      // Create missing subcategories
      const categoryId = categoryMap.get(categoryName)!
      
      for (const subcategoryName of subcategories) {
        const key = `${categoryId}_${subcategoryName}`
        
        if (!subcategoryMap.has(key)) {
          const result = await subcategoriesCollection.insertOne({
            name: subcategoryName,
            slug: subcategoryName.toLowerCase().replace(/\s+/g, '-'),
            categoryId: categoryId,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          
          subcategoryMap.set(key, result.insertedId)
          console.log(`Created subcategory: ${subcategoryName} under ${categoryName}`)
        }
      }
    }
    
    // Import products in batches
    const batchSize = 500
    let totalImported = 0
    let totalSkipped = 0
    let duplicates = 0
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      const transformedProducts = []
      
      for (const product of batch) {
        try {
          // Skip if SKU already exists
          if (product.Article_no && existingSkus.has(product.Article_no)) {
            duplicates++
            continue
          }
          
          const { categoryName, subcategoryName } = detectCategoryFromProduct(product)
          const categoryId = categoryMap.get(categoryName)
          const subcategoryId = subcategoryMap.get(`${categoryId}_${subcategoryName}`)
          
          const price = parsePrice(product.price_before_tax || product.price_after_tax)
          
          if (price <= 0) {
            totalSkipped++
            continue
          }
          
          // Extract brand
          let brand = 'Unknown'
          if (product.brand_info) {
            const brandMatch = product.brand_info.match(/^([^\n]+)/)
            if (brandMatch) {
              brand = cleanText(brandMatch[1])
            }
          }
          
          // Get images
          const mainImage = product.variants_dict?.[0]?.variant_image || 
                           product.image_urls?.[0] || 
                           'https://via.placeholder.com/500'
          
          const images = product.variants_dict?.map(v => v.variant_image).filter(Boolean) || 
                        product.image_urls || 
                        []
          
          // Transform variants
          const variations = product.variants_dict?.map(v => ({
            name: cleanText(v.variant_name),
            image: v.variant_image,
            price: price,
            inStock: true
          })) || []
          
          // Extract specifications
          const specifications: Record<string, string> = {}
          if (product.product_info) {
            for (const [key, value] of Object.entries(product.product_info)) {
              if (key && value && !['Pris/st', 'Artikelnummer', 'Prisinformation'].includes(key)) {
                specifications[cleanText(key)] = cleanText(value)
              }
            }
          }
          
          transformedProducts.push({
            name: cleanText(product.Title || 'Unnamed Product'),
            description: cleanText(product.description || ''),
            price: price,
            basePrice: price,
            image: mainImage,
            images: images,
            categoryId: categoryId,
            subcategoryId: subcategoryId,
            inStock: true,
            featured: false,
            isActive: true,
            sku: product.Article_no || `prendo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            brand: brand,
            type: 'product',
            sizes: product.Sizes || [],
            hasVariations: variations.length > 0,
            variations: variations,
            specifications: specifications,
            tags: [brand, categoryName, subcategoryName].filter(Boolean),
            source: 'prendo',
            originalData: {
              url: product.Url,
              articleNo: product.Article_no
            },
            createdAt: new Date(),
            updatedAt: new Date()
          })
          
          // Add to existing SKUs to prevent duplicates in same run
          if (product.Article_no) {
            existingSkus.add(product.Article_no)
          }
        } catch (error) {
          totalSkipped++
        }
      }
      
      if (transformedProducts.length > 0) {
        try {
          const result = await productsCollection.insertMany(transformedProducts, { ordered: false })
          totalImported += result.insertedCount
          console.log(`Batch ${Math.floor(i / batchSize) + 1}: Imported ${result.insertedCount} products (${totalImported} total)`)
        } catch (error: any) {
          if (error.writeErrors) {
            const imported = transformedProducts.length - error.writeErrors.length
            totalImported += imported
            duplicates += error.writeErrors.length
            console.log(`Batch ${Math.floor(i / batchSize) + 1}: ${imported} imported, ${error.writeErrors.length} duplicates`)
          } else {
            console.error('Batch insert error:', error)
          }
        }
      }
      
      // Progress update
      if ((i + batchSize) % 5000 === 0) {
        console.log(`Progress: ${Math.min(i + batchSize, products.length)}/${products.length} products processed`)
      }
    }
    
    // Final count
    const finalCount = await productsCollection.countDocuments({ source: 'prendo' })
    
    console.log('\n=== Import Complete ===')
    console.log(`Total products in JSON: ${products.length}`)
    console.log(`Successfully imported: ${totalImported}`)
    console.log(`Skipped (invalid price): ${totalSkipped}`)
    console.log(`Duplicates skipped: ${duplicates}`)
    console.log(`Total Prendo products now in database: ${finalCount}`)
    
  } catch (error) {
    console.error('Import failed:', error)
    throw error
  } finally {
    await client.close()
    console.log('MongoDB connection closed')
  }
}

// Run the import
importProducts().then(() => {
  console.log('Import completed successfully!')
  process.exit(0)
}).catch(error => {
  console.error('Import failed:', error)
  process.exit(1)
})