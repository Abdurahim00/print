require('dotenv').config()
const { MongoClient } = require('mongodb')

async function check() {
  const client = await MongoClient.connect(process.env.MONGODB_URI)
  const db = client.db('printwrap-pro')

  const products = await db.collection('products').find({}).limit(10).toArray()

  console.log('\n=== Product Image Fields ===\n')
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name}`)
    console.log(`   imageUrl: ${p.imageUrl ? p.imageUrl.substring(0, 50) + '...' : 'NONE'}`)
    console.log(`   image: ${p.image ? 'EXISTS' : 'NONE'}`)
    console.log(`   frontImage: ${p.frontImage ? 'EXISTS' : 'NONE'}`)
    console.log(`   images array: ${p.images ? p.images.length : 0} items`)
    console.log('')
  })

  await client.close()
}

check().catch(console.error)
