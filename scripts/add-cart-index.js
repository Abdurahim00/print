const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env' })

const MONGODB_URI = process.env.MONGODB_URI

async function addCartIndex() {
  const client = await MongoClient.connect(MONGODB_URI)

  try {
    const db = client.db('merchy')
    const cartsCollection = db.collection('carts')

    console.log('🔍 Checking existing indexes on carts collection...')
    const existingIndexes = await cartsCollection.indexes()
    console.log('Existing indexes:', existingIndexes)

    // Create index on userId for fast lookups
    console.log('\n📊 Creating index on userId...')
    await cartsCollection.createIndex({ userId: 1 }, { unique: true })

    console.log('✅ Index created successfully!')

    // Verify
    const newIndexes = await cartsCollection.indexes()
    console.log('\nFinal indexes:', newIndexes)

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

addCartIndex()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })