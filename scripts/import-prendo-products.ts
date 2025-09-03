import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap'
const DATABASE_NAME = 'printwrap-pro' // Match the database name from the connection string

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

// Category mapping based on URL patterns
const categoryMapping: Record<string, { categoryName: string, subcategories: string[] }> = {
  'varumarken': { categoryName: 'Branded Products', subcategories: ['ProJob', 'Clique', 'Craft'] },
  'trojor-skjortor-pikeer': { categoryName: 'Apparel', subcategories: ['T-Shirts', 'Shirts', 'Polos', 'Sweatshirts', 'Hoodies'] },
  'jackor': { categoryName: 'Apparel', subcategories: ['Jackets', 'Outerwear'] },
  'byxor': { categoryName: 'Apparel', subcategories: ['Pants', 'Shorts'] },
  'kepsar-mossor': { categoryName: 'Accessories', subcategories: ['Caps', 'Hats', 'Beanies'] },
  'giveaways': { categoryName: 'Promotional Items', subcategories: ['Keychains', 'Pens', 'USB Drives', 'Bags'] },
  'nyckelringar': { categoryName: 'Promotional Items', subcategories: ['Keychains'] },
  'pennor': { categoryName: 'Promotional Items', subcategories: ['Pens', 'Writing Instruments'] },
  'muggar': { categoryName: 'Drinkware', subcategories: ['Mugs', 'Cups', 'Bottles'] },
  'kassar-vaska': { categoryName: 'Bags', subcategories: ['Tote Bags', 'Backpacks', 'Shopping Bags'] },
  'teknik': { categoryName: 'Tech Accessories', subcategories: ['USB Drives', 'Power Banks', 'Phone Accessories'] },
  'sport-fritid': { categoryName: 'Sports & Leisure', subcategories: ['Sports Equipment', 'Outdoor Gear'] },
  'hem-kontor': { categoryName: 'Home & Office', subcategories: ['Office Supplies', 'Home Decor'] },
  'paraply': { categoryName: 'Accessories', subcategories: ['Umbrellas'] },
  'handdukar': { categoryName: 'Textiles', subcategories: ['Towels'] },
  'filtar': { categoryName: 'Textiles', subcategories: ['Blankets'] },
  'reflexer': { categoryName: 'Safety', subcategories: ['Reflectors', 'Safety Gear'] },
  'leksaker': { categoryName: 'Toys & Games', subcategories: ['Toys', 'Games'] },
  'godis': { categoryName: 'Food & Beverage', subcategories: ['Candy', 'Snacks'] },
  'drycker': { categoryName: 'Food & Beverage', subcategories: ['Beverages'] }
}

// Map of subcategory names to determine product type
const subcategoryTypeMapping: Record<string, string> = {
  'Sweatshirts': 'apparel',
  'T-Shirts': 'apparel',
  'Shirts': 'apparel',
  'Polos': 'apparel',
  'Hoodies': 'apparel',
  'Jackets': 'apparel',
  'Pants': 'apparel',
  'Shorts': 'apparel',
  'Caps': 'accessories',
  'Hats': 'accessories',
  'Beanies': 'accessories',
  'Keychains': 'promotional',
  'Pens': 'promotional',
  'USB Drives': 'tech',
  'Power Banks': 'tech',
  'Mugs': 'drinkware',
  'Cups': 'drinkware',
  'Bottles': 'drinkware',
  'Tote Bags': 'bags',
  'Backpacks': 'bags',
  'Umbrellas': 'accessories',
  'Towels': 'textiles',
  'Blankets': 'textiles',
  'Reflectors': 'safety',
  'Toys': 'toys',
  'Candy': 'food',
  'Beverages': 'food'
}

function detectCategoryFromUrl(url: string): { categoryId?: ObjectId, subcategoryId?: ObjectId, categoryName: string, subcategoryName: string } {
  let categoryName = 'Other'
  let subcategoryName = 'Miscellaneous'
  
  // Try to detect from URL patterns
  for (const [pattern, mapping] of Object.entries(categoryMapping)) {
    if (url.toLowerCase().includes(pattern)) {
      categoryName = mapping.categoryName
      
      // Try to match specific subcategory from URL or product name
      for (const sub of mapping.subcategories) {
        if (url.toLowerCase().includes(sub.toLowerCase().replace(' ', '-'))) {
          subcategoryName = sub
          break
        }
      }
      
      // If no specific subcategory found, use the first one as default
      if (subcategoryName === 'Miscellaneous' && mapping.subcategories.length > 0) {
        subcategoryName = mapping.subcategories[0]
      }
      break
    }
  }
  
  return { categoryName, subcategoryName, categoryId: undefined, subcategoryId: undefined }
}

function parsePrice(priceStr: string): number {
  // Remove currency symbols and text, keep only numbers
  const cleanPrice = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.')
  const price = parseFloat(cleanPrice)
  return isNaN(price) ? 0 : price
}

function transformPrendoProduct(product: PrendoProduct, categoryInfo: any): any {
  const price = parsePrice(product.price_before_tax || product.price_after_tax)
  const productType = subcategoryTypeMapping[categoryInfo.subcategoryName] || 'other'
  
  // Extract brand from brand_info
  let brand = 'Unknown'
  if (product.brand_info) {
    const brandMatch = product.brand_info.match(/^([^\n]+)/)
    if (brandMatch) {
      brand = brandMatch[1].trim()
    }
  }
  
  // Transform variants to our format with proper image handling
  const variants = product.variants_dict?.map(v => ({
    variant_name: v.variant_name,
    variant_image: v.variant_image,
    image: v.variant_image,
    price: price,
    inStock: true,
    // Add images array for compatibility
    images: v.variant_image ? [v.variant_image] : []
  })) || []
  
  // Extract specifications from product_info
  const specifications: Record<string, string> = {}
  if (product.product_info) {
    for (const [key, value] of Object.entries(product.product_info)) {
      if (key && value && key !== 'Pris/st' && key !== 'Artikelnummer') {
        specifications[key] = value
      }
    }
  }
  
  // Get main image
  const mainImage = product.variants_dict?.[0]?.variant_image || 
                    product.image_urls?.[0] || 
                    'https://via.placeholder.com/500'
  
  // Get all variant images
  const images = product.variants_dict?.map(v => v.variant_image).filter(Boolean) || product.image_urls || []
  
  return {
    name: product.Title || 'Unnamed Product',
    description: product.description || '',
    price: price,
    basePrice: price,
    image: mainImage,
    images: images,
    categoryId: categoryInfo.categoryId,
    subcategoryId: categoryInfo.subcategoryId,
    categoryName: categoryInfo.categoryName,
    subcategoryName: categoryInfo.subcategoryName,
    inStock: true,
    featured: false,
    isActive: true,
    sku: product.Article_no || '',
    brand: brand,
    type: productType,
    sizes: product.Sizes || [],
    hasVariations: variants.length > 0,
    variants: variants,  // Use the new variants format
    variations: variants, // Keep for backwards compatibility
    specifications: specifications,
    tags: [brand, categoryInfo.categoryName, categoryInfo.subcategoryName].filter(Boolean),
    source: 'prendo',
    originalData: {
      url: product.Url,
      articleNo: product.Article_no,
      productInfo: product.product_info,
      priceBeforeTax: product.price_before_tax,
      priceAfterTax: product.price_after_tax
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

async function importProducts() {
  console.log('Starting Prendo products import...')
  
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    const categoriesCollection = db.collection('categories')
    const subcategoriesCollection = db.collection('subcategories')
    
    // Read and parse the JSON file with proper encoding
    const filePath = path.join(process.cwd(), 'prendo_unique_combine_output.json')
    console.log('Reading file from:', filePath)
    
    // Read file with latin-1 encoding to handle special characters
    const fileContent = fs.readFileSync(filePath, 'latin1')
    
    // Fix common encoding issues
    const fixedContent = fileContent
      .replace(/�/g, 'ä')
      .replace(/�/g, 'ö')
      .replace(/�/g, 'å')
      .replace(/�/g, 'Ä')
      .replace(/�/g, 'Ö')
      .replace(/�/g, 'Å')
      .replace(/�/g, 'é')
      .replace(/�/g, '°')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
    
    let products: PrendoProduct[]
    try {
      products = JSON.parse(fixedContent)
      console.log(`Loaded ${products.length} products from JSON`)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      
      // Try to fix JSON syntax errors
      const lines = fixedContent.split('\n')
      let fixedJson = '['
      let inProduct = false
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.includes('"Url":')) {
          if (inProduct) {
            fixedJson += '},\n'
          }
          inProduct = true
        }
        
        if (inProduct) {
          // Fix missing commas
          let fixedLine = line
          if (!line.trim().endsWith(',') && !line.trim().endsWith('{') && 
              !line.trim().endsWith('[') && !line.trim().endsWith('}') && 
              !line.trim().endsWith(']') && line.trim() !== '') {
            const nextLine = i < lines.length - 1 ? lines[i + 1] : ''
            if (nextLine.trim().startsWith('"')) {
              fixedLine = line + ','
            }
          }
          fixedJson += fixedLine + '\n'
        }
      }
      
      if (inProduct) {
        fixedJson += '}'
      }
      fixedJson += ']'
      
      try {
        products = JSON.parse(fixedJson)
        console.log(`Fixed and loaded ${products.length} products`)
      } catch (secondError) {
        console.error('Failed to parse even after fixes:', secondError)
        throw secondError
      }
    }
    
    // Get existing categories and subcategories
    const existingCategories = await categoriesCollection.find({}).toArray()
    const existingSubcategories = await subcategoriesCollection.find({}).toArray()
    
    const categoryMap = new Map(existingCategories.map(c => [c.name, c._id]))
    const subcategoryMap = new Map(existingSubcategories.map(s => [s.name, s._id]))
    
    // Create missing categories and subcategories
    const newCategories = new Set<string>()
    const newSubcategories = new Set<string>()
    
    for (const product of products) {
      const categoryInfo = detectCategoryFromUrl(product.Url)
      
      if (!categoryMap.has(categoryInfo.categoryName)) {
        newCategories.add(categoryInfo.categoryName)
      }
      
      if (!subcategoryMap.has(categoryInfo.subcategoryName)) {
        newSubcategories.add(categoryInfo.subcategoryName)
      }
    }
    
    // Insert new categories
    if (newCategories.size > 0) {
      const categoriesToInsert = Array.from(newCategories).map(name => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: `${name} category`,
        isActive: true,
        isDesignable: ['Apparel', 'Accessories', 'Bags'].includes(name),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      
      const result = await categoriesCollection.insertMany(categoriesToInsert)
      console.log(`Created ${result.insertedCount} new categories`)
      
      // Update category map
      const newCats = await categoriesCollection.find({ name: { $in: Array.from(newCategories) } }).toArray()
      newCats.forEach(c => categoryMap.set(c.name, c._id))
    }
    
    // Insert new subcategories
    if (newSubcategories.size > 0) {
      const subcategoriesToInsert: any[] = []
      
      for (const subName of newSubcategories) {
        // Find the parent category
        let parentCategoryId: ObjectId | undefined
        for (const [pattern, mapping] of Object.entries(categoryMapping)) {
          if (mapping.subcategories.includes(subName)) {
            parentCategoryId = categoryMap.get(mapping.categoryName)
            break
          }
        }
        
        if (!parentCategoryId) {
          parentCategoryId = categoryMap.get('Other')
        }
        
        if (parentCategoryId) {
          subcategoriesToInsert.push({
            name: subName,
            slug: subName.toLowerCase().replace(/\s+/g, '-'),
            categoryId: parentCategoryId,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
      
      if (subcategoriesToInsert.length > 0) {
        const result = await subcategoriesCollection.insertMany(subcategoriesToInsert)
        console.log(`Created ${result.insertedCount} new subcategories`)
        
        // Update subcategory map
        const newSubs = await subcategoriesCollection.find({ name: { $in: Array.from(newSubcategories) } }).toArray()
        newSubs.forEach(s => subcategoryMap.set(s.name, s._id))
      }
    }
    
    // Transform and insert products in batches
    const batchSize = 1000
    let totalInserted = 0
    let totalSkipped = 0
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      const transformedProducts = []
      
      for (const product of batch) {
        try {
          const categoryInfo = detectCategoryFromUrl(product.Url)
          categoryInfo.categoryId = categoryMap.get(categoryInfo.categoryName)
          categoryInfo.subcategoryId = subcategoryMap.get(categoryInfo.subcategoryName)
          
          const transformed = transformPrendoProduct(product, categoryInfo)
          
          // Skip products with no valid price
          if (transformed.price > 0) {
            transformedProducts.push(transformed)
          } else {
            totalSkipped++
          }
        } catch (error) {
          console.error(`Error transforming product: ${product.Title}`, error)
          totalSkipped++
        }
      }
      
      if (transformedProducts.length > 0) {
        try {
          const result = await productsCollection.insertMany(transformedProducts, { ordered: false })
          totalInserted += result.insertedCount
          console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${result.insertedCount} products`)
        } catch (error: any) {
          if (error.writeErrors) {
            totalInserted += transformedProducts.length - error.writeErrors.length
            console.log(`Batch ${Math.floor(i / batchSize) + 1}: Inserted ${transformedProducts.length - error.writeErrors.length} products, ${error.writeErrors.length} duplicates skipped`)
          } else {
            console.error('Batch insert error:', error)
          }
        }
      }
    }
    
    console.log('\n=== Import Complete ===')
    console.log(`Total products processed: ${products.length}`)
    console.log(`Successfully imported: ${totalInserted}`)
    console.log(`Skipped (invalid/duplicate): ${totalSkipped}`)
    
    // Create indexes for better query performance
    console.log('\nCreating indexes...')
    await productsCollection.createIndex({ categoryId: 1, inStock: -1, featured: -1 })
    await productsCollection.createIndex({ subcategoryId: 1, inStock: -1, featured: -1 })
    await productsCollection.createIndex({ name: 'text', description: 'text' })
    await productsCollection.createIndex({ brand: 1 })
    await productsCollection.createIndex({ source: 1 })
    await productsCollection.createIndex({ sku: 1 })
    console.log('Indexes created successfully')
    
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('MongoDB connection closed')
  }
}

// Run the import
importProducts().then(() => {
  console.log('Import process completed')
  process.exit(0)
}).catch(error => {
  console.error('Import process failed:', error)
  process.exit(1)
})