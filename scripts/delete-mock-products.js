const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '.env' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

const mockProductNames = [
  'AHMET',
  'Tshirt',
  'shirt',
  'Laptop Decals',
  'Elena läppbalsam',
  'Denali GRS filt med huvtröja'
]

async function deleteMockProducts() {
  const client = await MongoClient.connect(MONGODB_URI)

  try {
    const db = client.db('merchy')
    const productsCollection = db.collection('products')

    console.log('🔍 Finding mock products...')

    // Find products with these exact names (case insensitive)
    const mockProducts = await productsCollection.find({
      name: { $in: mockProductNames.map(name => new RegExp(`^${name}$`, 'i')) }
    }).toArray()

    console.log(`Found ${mockProducts.length} mock products:`)
    mockProducts.forEach(p => console.log(`  - ${p.name} (${p._id})`))

    if (mockProducts.length === 0) {
      console.log('✅ No mock products found')
      return
    }

    // Delete them
    const result = await productsCollection.deleteMany({
      name: { $in: mockProductNames.map(name => new RegExp(`^${name}$`, 'i')) }
    })

    console.log(`\n✅ Deleted ${result.deletedCount} mock products`)

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

deleteMockProducts()
  .then(() => {
    console.log('✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Failed:', error)
    process.exit(1)
  })