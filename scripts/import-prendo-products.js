const { MongoClient, ObjectId } = require('mongodb')
const fs = require('fs')
const path = require('path')

const uri = process.env.MONGODB_URI || 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/'

// Function to extract category from product URL
function extractCategoryFromUrl(url) {
  if (!url) return null
  
  // Extract path from URL
  const match = url.match(/prendo\.se\/med-tryck\/([^\/]+)(?:\/([^\/]+))?/)
  if (!match) return null
  
  return {
    mainCategory: match[1],
    subCategory: match[2] || null
  }
}

// Function to parse price string to number
function parsePrice(priceStr) {
  if (!priceStr) return 0
  // Remove 'kr/st', 'kr' and convert to number
  const cleanPrice = priceStr.replace(/[^\d.,]/g, '').replace(',', '.')
  return parseFloat(cleanPrice) || 0
}

// Function to generate size-price structure
function generateSizePrices(sizes, basePrice) {
  const sizePrices = {}
  sizes.forEach(size => {
    sizePrices[size] = {
      price: basePrice,
      isAvailable: true
    }
  })
  return sizePrices
}

async function importPrendoProducts() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const database = client.db('printwrap-pro')
    const productsCollection = database.collection('products')
    const categoriesCollection = database.collection('categories')
    const subcategoriesCollection = database.collection('subcategories')

    // Load the Prendo products JSON
    const jsonPath = path.join(__dirname, '..', 'prendo_output_22_08_2025 (1).json')
    const prendoProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    console.log(`Loaded ${prendoProducts.length} products from JSON`)

    // Get all categories and subcategories for mapping
    const categories = await categoriesCollection.find({}).toArray()
    const subcategories = await subcategoriesCollection.find({}).toArray()
    
    // Create mapping objects
    const categoryMap = {}
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id
    })
    
    const subcategoryMap = {}
    subcategories.forEach(subcat => {
      subcategoryMap[subcat.slug] = subcat._id
    })

    console.log(`Found ${categories.length} categories and ${subcategories.length} subcategories`)

    // Process and import products
    const productsToInsert = []
    const skippedProducts = []
    
    for (const prendoProduct of prendoProducts) {
      try {
        // Extract category from variant URL (they all have the same category)
        let categoryInfo = null
        if (prendoProduct.variants_dict && prendoProduct.variants_dict.length > 0) {
          categoryInfo = extractCategoryFromUrl(prendoProduct.variants_dict[0].variant_url)
        }
        
        // Determine category and subcategory IDs
        let categoryId = null
        let subcategoryId = null
        
        if (categoryInfo) {
          // Try to find exact match
          categoryId = categoryMap[categoryInfo.mainCategory]
          
          if (categoryInfo.subCategory) {
            // Look for subcategory with matching slug
            const subcatSlug = `${categoryInfo.mainCategory}/${categoryInfo.subCategory}`
            subcategoryId = subcategoryMap[subcatSlug]
          }
        }
        
        // Fallback to default category if not found
        if (!categoryId) {
          // Check product title for hints
          const title = prendoProduct.Title?.toLowerCase() || ''
          
          if (title.includes('t-shirt') || title.includes('tshirt')) {
            categoryId = categoryMap['profilklader'] // Profile Clothing
            const tshirtSubcat = subcategories.find(s => s.slug === 'profilklader/t-shirt')
            if (tshirtSubcat) subcategoryId = tshirtSubcat._id
          } else if (title.includes('polo') || title.includes('pike')) {
            categoryId = categoryMap['profilklader']
            const poloSubcat = subcategories.find(s => s.slug === 'profilklader/piketrojor')
            if (poloSubcat) subcategoryId = poloSubcat._id
          } else if (title.includes('hoodie') || title.includes('huv')) {
            categoryId = categoryMap['profilklader']
            const hoodieSubcat = subcategories.find(s => s.slug === 'profilklader/trojor')
            if (hoodieSubcat) subcategoryId = hoodieSubcat._id
          } else if (title.includes('keps') || title.includes('cap')) {
            categoryId = categoryMap['profilklader']
            const capSubcat = subcategories.find(s => s.slug === 'profilklader/kepsar')
            if (capSubcat) subcategoryId = capSubcat._id
          } else if (title.includes('mugg') || title.includes('mug')) {
            categoryId = categoryMap['profilprodukter']
            const mugSubcat = subcategories.find(s => s.slug === 'profilprodukter/muggar')
            if (mugSubcat) subcategoryId = mugSubcat._id
          } else if (title.includes('penna') || title.includes('pen')) {
            categoryId = categoryMap['profilprodukter']
            const penSubcat = subcategories.find(s => s.slug === 'profilprodukter/pennor')
            if (penSubcat) subcategoryId = penSubcat._id
          } else if (title.includes('väska') || title.includes('bag')) {
            categoryId = categoryMap['presentreklam']
            const bagSubcat = subcategories.find(s => s.slug === 'presentreklam/vaskor')
            if (bagSubcat) subcategoryId = bagSubcat._id
          } else {
            // Default to profile products
            categoryId = categoryMap['profilprodukter'] || categoryMap['giveaways']
          }
        }
        
        if (!categoryId) {
          skippedProducts.push({
            title: prendoProduct.Title,
            reason: 'No matching category found'
          })
          continue
        }

        // Parse base price
        const basePrice = parsePrice(prendoProduct.price_before_tax) || 100
        
        // Prepare product variants
        const variants = (prendoProduct.variants_dict || []).map(variant => ({
          color: variant.variant_name,
          image: variant.variant_image,
          inStock: true
        }))
        
        // Get primary image (from first variant or placeholder)
        const primaryImage = variants.length > 0 ? variants[0].image : '/placeholder.jpg'
        
        // Prepare all images array
        const images = variants.map(v => v.image).filter(img => img)
        
        // Generate size-price structure
        const sizePrices = generateSizePrices(
          prendoProduct.Sizes || ['One Size'],
          basePrice
        )

        const product = {
          name: prendoProduct.Title || 'Untitled Product',
          description: prendoProduct.description || 'No description available',
          basePrice: basePrice,
          categoryId: categoryId,
          subcategoryId: subcategoryId,
          image: primaryImage,
          images: images,
          colors: variants.map(v => v.color),
          variants: variants,
          sizes: prendoProduct.Sizes || ['One Size'],
          sizePrices: sizePrices,
          sku: prendoProduct.Article_no || `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          brand: prendoProduct.brand_info?.split('\n')[0] || 'Prendo',
          inStock: true,
          featured: false,
          isActive: true,
          tags: [],
          specifications: prendoProduct.product_info || {},
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'prendo_import',
          originalData: {
            articleNo: prendoProduct.Article_no,
            priceBeforeTax: prendoProduct.price_before_tax,
            priceAfterTax: prendoProduct.price_after_tax
          }
        }
        
        productsToInsert.push(product)
        
      } catch (error) {
        console.error(`Error processing product "${prendoProduct.Title}":`, error.message)
        skippedProducts.push({
          title: prendoProduct.Title,
          reason: error.message
        })
      }
    }

    // Insert products in batches
    if (productsToInsert.length > 0) {
      const batchSize = 100
      let insertedCount = 0
      
      for (let i = 0; i < productsToInsert.length; i += batchSize) {
        const batch = productsToInsert.slice(i, i + batchSize)
        const result = await productsCollection.insertMany(batch)
        insertedCount += result.insertedCount
        console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}: ${result.insertedCount} products`)
      }
      
      console.log(`\n✅ Successfully imported ${insertedCount} products`)
    }
    
    // Report skipped products
    if (skippedProducts.length > 0) {
      console.log(`\n⚠️  Skipped ${skippedProducts.length} products:`)
      skippedProducts.slice(0, 10).forEach(p => {
        console.log(`  - ${p.title}: ${p.reason}`)
      })
      if (skippedProducts.length > 10) {
        console.log(`  ... and ${skippedProducts.length - 10} more`)
      }
    }
    
    // Show summary by category
    console.log('\n📊 Import Summary by Category:')
    const categoryCount = {}
    
    for (const product of productsToInsert) {
      const category = categories.find(c => c._id.toString() === product.categoryId.toString())
      const categoryName = category ? category.name : 'Unknown'
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1
    }
    
    Object.entries(categoryCount).forEach(([name, count]) => {
      console.log(`  - ${name}: ${count} products`)
    })
    
    console.log('\n✅ Import completed successfully!')
    
  } catch (error) {
    console.error('Error importing products:', error)
  } finally {
    await client.close()
    console.log('Database connection closed')
  }
}

// Run the import
importPrendoProducts()