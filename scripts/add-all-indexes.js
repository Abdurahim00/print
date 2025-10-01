const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env' })

const MONGODB_URI = process.env.MONGODB_URI

async function addAllIndexes() {
  const client = await MongoClient.connect(MONGODB_URI)

  try {
    const db = client.db('printwrap-pro')

    console.log('📊 Adding indexes to improve performance...\n')

    // Products collection indexes
    console.log('1️⃣ Products collection...')
    const productsCollection = db.collection('products')
    await productsCollection.createIndex({ id: 1 })
    await productsCollection.createIndex({ slug: 1 })
    await productsCollection.createIndex({ categoryId: 1 })
    await productsCollection.createIndex({ subcategoryId: 1 })
    await productsCollection.createIndex({ featured: 1 })
    await productsCollection.createIndex({ isActive: 1 })
    console.log('✅ Products indexes created')

    // Cart collection indexes
    console.log('2️⃣ Carts collection...')
    const cartsCollection = db.collection('carts')
    await cartsCollection.createIndex({ userId: 1 }, { unique: true })
    console.log('✅ Carts indexes created')

    // Categories collection indexes
    console.log('3️⃣ Categories collection...')
    const categoriesCollection = db.collection('categories')
    await categoriesCollection.createIndex({ slug: 1 })
    await categoriesCollection.createIndex({ isActive: 1 })
    console.log('✅ Categories indexes created')

    // Subcategories collection indexes
    console.log('4️⃣ Subcategories collection...')
    const subcategoriesCollection = db.collection('subcategories')
    await subcategoriesCollection.createIndex({ slug: 1 })
    await subcategoriesCollection.createIndex({ categoryId: 1 })
    console.log('✅ Subcategories indexes created')

    // Orders collection indexes
    console.log('5️⃣ Orders collection...')
    const ordersCollection = db.collection('orders')
    await ordersCollection.createIndex({ userId: 1 })
    await ordersCollection.createIndex({ orderNumber: 1 }, { unique: true })
    await ordersCollection.createIndex({ createdAt: -1 })
    console.log('✅ Orders indexes created')

    console.log('\n✅ All indexes created successfully!')
    console.log('🚀 Database queries should be much faster now!')

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

addAllIndexes()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })