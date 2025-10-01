require('dotenv').config()
const { MongoClient } = require('mongodb')

async function test() {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  const db = client.db('printwrap-pro')
  const collection = db.collection('products')

  // Get all IDs first (this might work since it's projection only)
  console.log('Getting all product IDs...')
  const count = await collection.countDocuments({})
  console.log('Total documents:', count)

  // Try to get each one individually
  console.log('\nTesting each document individually...')

  let foundIds = []
  let failedAt = null

  for (let i = 0; i < count; i++) {
    console.log(`\nTrying document at position ${i}...`)
    try {
      const result = await Promise.race([
        collection.findOne({}, { skip: i, projection: { _id: 1, name: 1 } }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 3000))
      ])
      if (result) {
        console.log(`  ✅ Position ${i}: ${result.name} (ID: ${result._id})`)
        foundIds.push(result._id)
      }
    } catch (e) {
      console.log(`  ❌ Position ${i}: FAILED - ${e.message}`)
      failedAt = i
      break
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('SUMMARY:')
  console.log('Found', foundIds.length, 'working documents')
  if (failedAt !== null) {
    console.log('CORRUPTED document at position:', failedAt)
    if (foundIds.length > 0) {
      console.log('\nWorking IDs:', foundIds.map(id => id.toString()))
      console.log('\nTo find corrupted document, delete all working ones temporarily')
    }
  }

  await client.close()
}

test().catch(console.error)
