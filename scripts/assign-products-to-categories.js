const { MongoClient, ObjectId } = require('mongodb')

// MongoDB URI
const uri = 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/printwrap-pro?retryWrites=true&w=majority'

async function assignProductsToCategories() {
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
    
    // Create a mapping based on product names and types
    const productCategoryMapping = [
      // Work Clothes
      { keywords: ['shirt', 'hoodie', 'jacket', 'uniform', 'vest'], categorySlug: 'arbetsklader' },
      // Profile Clothes
      { keywords: ['t-shirt', 'tshirt', 'tee', 'polo', 'cap', 'hat'], categorySlug: 'profilklader' },
      // Printed Materials
      { keywords: ['poster', 'print', 'card', 'business card', 'flyer', 'brochure', 'sticker', 'decal'], categorySlug: 'trycksaker' },
      // Profile Products
      { keywords: ['mug', 'cup', 'bottle', 'bag', 'pen', 'keychain', 'lanyard'], categorySlug: 'profilprodukter' },
      // Giveaways
      { keywords: ['gift', 'giveaway', 'promotional', 'promo'], categorySlug: 'giveaways' },
      // Corporate Gifts
      { keywords: ['corporate', 'executive', 'premium', 'luxury'], categorySlug: 'foretagsgavor' },
      // Fair Materials
      { keywords: ['banner', 'stand', 'display', 'sign', 'flag', 'wrap', 'car'], categorySlug: 'massmaterial' },
      // Office Supplies
      { keywords: ['office', 'desk', 'notebook', 'folder', 'calendar'], categorySlug: 'kontor-forbrukning' },
    ]
    
    // Get category IDs
    const categoryIdMap = {}
    for (const cat of categories) {
      categoryIdMap[cat.slug] = cat._id
    }
    
    // Get all products
    const products = await productsCollection.find({}).toArray()
    let updateCount = 0
    
    for (const product of products) {
      const productNameLower = product.name.toLowerCase()
      let assignedCategorySlug = null
      
      // Find matching category based on keywords
      for (const mapping of productCategoryMapping) {
        if (mapping.keywords.some(keyword => productNameLower.includes(keyword))) {
          assignedCategorySlug = mapping.categorySlug
          break
        }
      }
      
      // If no match found, check current categoryId for remapping
      if (!assignedCategorySlug) {
        if (typeof product.categoryId === 'string' && !product.categoryId.match(/^[0-9a-fA-F]{24}$/)) {
          // Map old category strings
          const oldCategoryMap = {
            'decals': 'trycksaker',
            'car-wraps': 'massmaterial',
            'apparel': 'profilklader',
            'business-cards': 'trycksaker',
            'posters': 'trycksaker',
            'stickers': 'trycksaker',
            'banners': 'massmaterial',
            'signage': 'massmaterial',
          }
          assignedCategorySlug = oldCategoryMap[product.categoryId] || 'profilprodukter'
        }
      }
      
      // If still no category, default to profile products
      if (!assignedCategorySlug) {
        assignedCategorySlug = 'profilprodukter'
      }
      
      const newCategoryId = categoryIdMap[assignedCategorySlug]
      
      if (newCategoryId && (!product.categoryId || typeof product.categoryId === 'string')) {
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: { categoryId: newCategoryId } }
        )
        updateCount++
        const category = categories.find(c => c._id.equals(newCategoryId))
        console.log(`Assigned "${product.name}" to category "${category.name}" (${assignedCategorySlug})`)
      }
    }
    
    console.log(`\nUpdated ${updateCount} products with category assignments`)
    
    // Show distribution
    console.log('\nCategory distribution:')
    for (const cat of categories) {
      const count = await productsCollection.countDocuments({ categoryId: cat._id })
      if (count > 0) {
        console.log(`- ${cat.name}: ${count} products`)
      }
    }
    
  } catch (error) {
    console.error('Error assigning product categories:', error)
  } finally {
    await client.close()
    console.log('\nDatabase connection closed')
  }
}

assignProductsToCategories()