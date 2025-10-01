require('dotenv').config()
const { MongoClient } = require('mongodb')

async function addIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db('printwrap-pro')
    const products = db.collection('products')

    // Create indexes for faster queries
    console.log('Creating indexes...')

    // Index for featured products (most common query)
    await products.createIndex({ featured: -1, createdAt: -1 })
    console.log('✅ Created index: featured + createdAt')

    // Index for category queries
    await products.createIndex({ categoryId: 1 })
    console.log('✅ Created index: categoryId')

    // Index for price sorting
    await products.createIndex({ basePrice: 1 })
    console.log('✅ Created index: basePrice')

    // Index for search
    await products.createIndex({ name: 'text', description: 'text' })
    console.log('✅ Created text index: name + description')

    // Index for designable products
    await products.createIndex({ isDesignable: 1 })
    console.log('✅ Created index: isDesignable')

    console.log('\n✅ All indexes created successfully!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

addIndexes()
