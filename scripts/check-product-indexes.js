const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env' })

const MONGODB_URI = process.env.MONGODB_URI

async function checkIndexes() {
  const client = await MongoClient.connect(MONGODB_URI)

  try {
    const db = client.db('merchy')
    const productsCollection = db.collection('products')

    console.log('🔍 Checking indexes on products collection...')
    const indexes = await productsCollection.indexes()
    console.log('\nExisting indexes:')
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}:`, idx.key)
    })

    // Check collection stats
    const stats = await productsCollection.stats()
    console.log('\n📊 Collection stats:')
    console.log(`  - Total documents: ${stats.count}`)
    console.log(`  - Average document size: ${Math.round(stats.avgObjSize)} bytes`)
    console.log(`  - Total size: ${Math.round(stats.size / 1024 / 1024)} MB`)
    console.log(`  - Index size: ${Math.round(stats.totalIndexSize / 1024 / 1024)} MB`)

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

checkIndexes()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })