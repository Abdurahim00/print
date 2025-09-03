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

// Category mapping based on URL patterns and product titles
const categoryMapping: Record<string, { categoryName: string, subcategories: string[] }> = {
  'sweatshirt': { categoryName: 'Apparel', subcategories: ['Sweatshirts'] },
  'hoodjacka': { categoryName: 'Apparel', subcategories: ['Hoodies'] },
  't-shirt': { categoryName: 'Apparel', subcategories: ['T-Shirts'] },
  'piké': { categoryName: 'Apparel', subcategories: ['Polos'] },
  'pike': { categoryName: 'Apparel', subcategories: ['Polos'] },
  'skjorta': { categoryName: 'Apparel', subcategories: ['Shirts'] },
  'jacka': { categoryName: 'Apparel', subcategories: ['Jackets'] },
  'byxor': { categoryName: 'Apparel', subcategories: ['Pants'] },
  'shorts': { categoryName: 'Apparel', subcategories: ['Shorts'] },
  'keps': { categoryName: 'Accessories', subcategories: ['Caps'] },
  'mössa': { categoryName: 'Accessories', subcategories: ['Beanies'] },
  'nyckelring': { categoryName: 'Promotional Items', subcategories: ['Keychains'] },
  'penna': { categoryName: 'Promotional Items', subcategories: ['Pens'] },
  'mugg': { categoryName: 'Drinkware', subcategories: ['Mugs'] },
  'flaska': { categoryName: 'Drinkware', subcategories: ['Bottles'] },
  'väska': { categoryName: 'Bags', subcategories: ['Bags'] },
  'kasse': { categoryName: 'Bags', subcategories: ['Tote Bags'] },
  'ryggsäck': { categoryName: 'Bags', subcategories: ['Backpacks'] },
  'usb': { categoryName: 'Tech Accessories', subcategories: ['USB Drives'] },
  'powerbank': { categoryName: 'Tech Accessories', subcategories: ['Power Banks'] },
  'paraply': { categoryName: 'Accessories', subcategories: ['Umbrellas'] },
  'handduk': { categoryName: 'Textiles', subcategories: ['Towels'] },
  'filt': { categoryName: 'Textiles', subcategories: ['Blankets'] },
  'reflex': { categoryName: 'Safety', subcategories: ['Reflectors'] },
  'leksak': { categoryName: 'Toys & Games', subcategories: ['Toys'] },
  'godis': { categoryName: 'Food & Beverage', subcategories: ['Candy'] }
}

function detectCategoryFromProduct(product: PrendoProduct): { categoryName: string, subcategoryName: string } {
  const searchText = `${product.Title} ${product.Url} ${product.description}`.toLowerCase()
  
  for (const [pattern, mapping] of Object.entries(categoryMapping)) {
    if (searchText.includes(pattern)) {
      return {
        categoryName: mapping.categoryName,
        subcategoryName: mapping.subcategories[0]
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
  // Remove everything except numbers and decimal separators
  const cleanPrice = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.')
  const price = parseFloat(cleanPrice)
  return isNaN(price) ? 0 : price
}

function cleanText(text: string): string {
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
  
  // Read file as buffer
  const buffer = fs.readFileSync(filePath)
  let content = buffer.toString('latin1')
  
  // Clean encoding issues
  content = cleanText(content)
  
  // Try to extract valid JSON objects using regex
  const products: PrendoProduct[] = []
  
  // Match each product object pattern
  const productPattern = /\{[^{}]*"Url"\s*:\s*"[^"]+",[\s\S]*?"variants_dict"\s*:\s*\[[^\]]*\][^}]*\}/g
  const matches = content.match(productPattern)
  
  if (matches) {
    console.log(`Found ${matches.length} potential product objects`)
    
    for (let i = 0; i < matches.length; i++) {
      try {
        let productStr = matches[i]
        
        // Fix common JSON issues
        productStr = productStr
          .replace(/,\s*}/g, '}')  // Remove trailing commas
          .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
          .replace(/\n/g, ' ')     // Replace newlines with spaces
          .replace(/\r/g, '')      // Remove carriage returns
          .replace(/\t/g, ' ')     // Replace tabs with spaces
          .replace(/:\s*,/g, ': null,') // Fix empty values
          .replace(/\s+/g, ' ')    // Normalize whitespace
        
        // Parse the individual product
        const product = JSON.parse(productStr)
        
        // Validate required fields
        if (product.Url && product.Title) {
          products.push(product)
        }
      } catch (e) {
        // Skip invalid products
        if (i < 5) {
          console.log(`Skipping invalid product ${i + 1}:`, e)
        }
      }
    }
  }
  
  console.log(`Successfully parsed ${products.length} products`)
  return products
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
    
    // Parse the JSON file
    const filePath = path.join(process.cwd(), 'prendo_unique_combine_output.json')
    const products = await parseJsonFile(filePath)
    
    if (products.length === 0) {
      console.log('No valid products found to import')
      return
    }
    
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
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      const transformedProducts = []
      
      for (const product of batch) {
        try {
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
            sku: product.Article_no || '',
            brand: brand,
            type: 'product',
            sizes: product.Sizes || [],
            hasVariations: variations.length > 0,
            variations: variations,
            tags: [brand, categoryName, subcategoryName].filter(Boolean),
            source: 'prendo',
            originalData: {
              url: product.Url,
              articleNo: product.Article_no
            },
            createdAt: new Date(),
            updatedAt: new Date()
          })
        } catch (error) {
          console.log(`Error transforming product: ${product.Title}`)
          totalSkipped++
        }
      }
      
      if (transformedProducts.length > 0) {
        try {
          const result = await productsCollection.insertMany(transformedProducts, { ordered: false })
          totalImported += result.insertedCount
          console.log(`Batch ${Math.floor(i / batchSize) + 1}: Imported ${result.insertedCount} products`)
        } catch (error: any) {
          if (error.writeErrors) {
            const imported = transformedProducts.length - error.writeErrors.length
            totalImported += imported
            console.log(`Batch ${Math.floor(i / batchSize) + 1}: ${imported} imported, ${error.writeErrors.length} duplicates`)
          } else {
            console.error('Batch insert error:', error)
          }
        }
      }
    }
    
    console.log('\n=== Import Complete ===')
    console.log(`Total products processed: ${products.length}`)
    console.log(`Successfully imported: ${totalImported}`)
    console.log(`Skipped (invalid/duplicate): ${totalSkipped}`)
    
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