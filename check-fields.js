require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb')

async function test() {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  const db = client.db('printwrap-pro')
  const collection = db.collection('products')

  const id = new ObjectId('68d292c36548c7f06b91b1e6') // First product

  console.log('Testing field by field...')

  const fields = ['_id', 'name', 'price', 'description', 'image', 'images', 'category', 'inStock', 'designable', 'frontImage', 'backImage', 'leftImage', 'rightImage']

  for (const field of fields) {
    try {
      const projection = { [field]: 1 }
      const result = await Promise.race([
        collection.findOne({ _id: id }, { projection }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 2000))
      ])
      const value = result ? result[field] : 'null'
      const size = JSON.stringify(value).length
      console.log(`  ✅ ${field}: ${size} bytes`)
    } catch (e) {
      console.log(`  ❌ ${field}: ${e.message}`)
    }
  }

  console.log('\nTrying to fetch ALL fields...')
  try {
    const result = await Promise.race([
      collection.findOne({ _id: id }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 3000))
    ])
    console.log('✅ Got full document, size:', JSON.stringify(result).length, 'bytes')
  } catch (e) {
    console.log('❌ Full document failed:', e.message)
  }

  await client.close()
}

test().catch(console.error)
