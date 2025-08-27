const { MongoClient, ObjectId } = require('mongodb')

const uri = process.env.MONGODB_URI || 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/'

async function fixPrendoCategories() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const database = client.db('printwrap-pro')
    const productsCollection = database.collection('products')
    const categoriesCollection = database.collection('categories')
    const subcategoriesCollection = database.collection('subcategories')

    // Get the correct categories
    const categories = await categoriesCollection.find({}).toArray()
    const subcategories = await subcategoriesCollection.find({}).toArray()

    // Find the Profile Clothing category
    const profileClothingCategory = categories.find(c => c.slug === 'profilklader')
    if (!profileClothingCategory) {
      console.error('Profile Clothing category not found!')
      return
    }

    // Find the T-Shirts subcategory
    const tshirtSubcategory = subcategories.find(s => s.slug === 'profilklader/t-shirt')
    
    console.log('Found Profile Clothing category:', profileClothingCategory.name)
    if (tshirtSubcategory) {
      console.log('Found T-Shirts subcategory:', tshirtSubcategory.name)
    }

    // Get all products from the Prendo import
    const prendoProducts = await productsCollection.find({ 
      source: 'prendo_import' 
    }).toArray()

    console.log(`Found ${prendoProducts.length} products from Prendo import`)

    let updateCount = 0
    for (const product of prendoProducts) {
      const productName = product.name.toLowerCase()
      let newCategoryId = null
      let newSubcategoryId = null
      
      // Determine correct category based on product name
      if (productName.includes('t-shirt') || productName.includes('tshirt') || productName.includes('t shirt')) {
        newCategoryId = profileClothingCategory._id
        newSubcategoryId = tshirtSubcategory ? tshirtSubcategory._id : null
        
        // Check for specific subcategories
        if (productName.includes('barn') || productName.includes('kids') || productName.includes('child')) {
          const kidsSubcat = subcategories.find(s => s.slug === 'profilklader/t-shirt/barn-t-shirt')
          if (kidsSubcat) newSubcategoryId = kidsSubcat._id
        } else if (productName.includes('dam') || productName.includes('women') || productName.includes('lady')) {
          const womenSubcat = subcategories.find(s => s.slug === 'profilklader/t-shirt/dam-t-shirt')
          if (womenSubcat) newSubcategoryId = womenSubcat._id
        } else if (productName.includes('herr') || productName.includes('men')) {
          const menSubcat = subcategories.find(s => s.slug === 'profilklader/t-shirt/herr-t-shirt')
          if (menSubcat) newSubcategoryId = menSubcat._id
        }
      } else if (productName.includes('polo') || productName.includes('pike')) {
        newCategoryId = profileClothingCategory._id
        const poloSubcat = subcategories.find(s => s.slug === 'profilklader/piketrojor')
        newSubcategoryId = poloSubcat ? poloSubcat._id : null
      } else if (productName.includes('hoodie') || productName.includes('huv')) {
        newCategoryId = profileClothingCategory._id
        const hoodieSubcat = subcategories.find(s => s.slug === 'profilklader/trojor')
        newSubcategoryId = hoodieSubcat ? hoodieSubcat._id : null
      } else if (productName.includes('tröja') || productName.includes('sweater') || productName.includes('sweatshirt')) {
        newCategoryId = profileClothingCategory._id
        const sweaterSubcat = subcategories.find(s => s.slug === 'profilklader/trojor')
        newSubcategoryId = sweaterSubcat ? sweaterSubcat._id : null
      } else if (productName.includes('jacka') || productName.includes('jacket')) {
        newCategoryId = profileClothingCategory._id
        const jacketSubcat = subcategories.find(s => s.slug === 'profilklader/jackor')
        newSubcategoryId = jacketSubcat ? jacketSubcat._id : null
      } else if (productName.includes('keps') || productName.includes('cap')) {
        newCategoryId = profileClothingCategory._id
        const capSubcat = subcategories.find(s => s.slug === 'profilklader/kepsar')
        newSubcategoryId = capSubcat ? capSubcat._id : null
      } else {
        // Keep current category if no match
        continue
      }

      if (newCategoryId) {
        const updateObj = {
          categoryId: newCategoryId
        }
        
        if (newSubcategoryId) {
          updateObj.subcategoryId = newSubcategoryId
        }
        
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: updateObj }
        )
        
        const categoryName = categories.find(c => c._id.toString() === newCategoryId.toString())?.name
        const subcategoryName = newSubcategoryId ? 
          subcategories.find(s => s._id.toString() === newSubcategoryId.toString())?.name : 
          'None'
        
        console.log(`Updated "${product.name}" to category: ${categoryName}, subcategory: ${subcategoryName}`)
        updateCount++
      }
    }

    console.log(`\n✅ Updated ${updateCount} products with correct categories`)

    // Show updated category distribution
    console.log('\n📊 Category Distribution:')
    const updatedProducts = await productsCollection.find({ source: 'prendo_import' }).toArray()
    const categoryDistribution = {}
    
    for (const product of updatedProducts) {
      const category = categories.find(c => c._id.toString() === product.categoryId.toString())
      const categoryName = category ? category.name : 'Unknown'
      categoryDistribution[categoryName] = (categoryDistribution[categoryName] || 0) + 1
    }
    
    Object.entries(categoryDistribution).forEach(([name, count]) => {
      console.log(`  - ${name}: ${count} products`)
    })

  } catch (error) {
    console.error('Error fixing categories:', error)
  } finally {
    await client.close()
    console.log('\nDatabase connection closed')
  }
}

// Run the fix
fixPrendoCategories()