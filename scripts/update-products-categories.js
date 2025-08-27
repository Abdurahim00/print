const { MongoClient } = require('mongodb')

// MongoDB URI
const uri = 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/printwrap-pro?retryWrites=true&w=majority'

async function updateProductCategories() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const database = client.db('printwrap-pro')
    const productsCollection = database.collection('products')
    const categoriesCollection = database.collection('categories')
    
    // Get all categories
    const categories = await categoriesCollection.find({}).toArray()
    console.log('Found', categories.length, 'categories')
    
    // Create a mapping of common product types to Prendo categories
    const categoryMapping = {
      'decals': 'trycksaker', // Print materials
      'car-wraps': 'profilprodukter', // Profile products
      'apparel': 'profilklader', // Profile clothing
      'business-cards': 'trycksaker', // Print materials
      'posters': 'trycksaker', // Print materials
      'stickers': 'trycksaker', // Print materials
      'banners': 'massmaterial', // Fair materials
      'signage': 'massmaterial', // Fair materials
    }
    
    // Get the category IDs for mapping
    const categoryIds = {}
    for (const cat of categories) {
      categoryIds[cat.slug] = cat._id
    }
    
    // Update products that have old string category IDs
    const products = await productsCollection.find({}).toArray()
    let updateCount = 0
    
    for (const product of products) {
      let newCategoryId = null
      
      // Check if categoryId is a string (old format)
      if (typeof product.categoryId === 'string' && !product.categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        const mappedSlug = categoryMapping[product.categoryId]
        if (mappedSlug && categoryIds[mappedSlug]) {
          newCategoryId = categoryIds[mappedSlug]
        } else {
          // Default to a general category
          newCategoryId = categoryIds['profilprodukter'] || categoryIds['trycksaker']
        }
        
        if (newCategoryId) {
          await productsCollection.updateOne(
            { _id: product._id },
            { $set: { categoryId: newCategoryId } }
          )
          updateCount++
          console.log(`Updated product "${product.name}" category from "${product.categoryId}" to category with slug "${mappedSlug || 'default'}"`)
        }
      }
    }
    
    console.log(`\nUpdated ${updateCount} products with new category IDs`)
    
    // Show sample of updated products
    const updatedProducts = await productsCollection.find({}).limit(5).toArray()
    console.log('\nSample of updated products:')
    for (const p of updatedProducts) {
      const cat = categories.find(c => c._id.toString() === p.categoryId.toString())
      console.log(`- ${p.name}: ${cat ? cat.name : 'Unknown category'}`)
    }
    
  } catch (error) {
    console.error('Error updating product categories:', error)
  } finally {
    await client.close()
    console.log('\nDatabase connection closed')
  }
}

updateProductCategories()