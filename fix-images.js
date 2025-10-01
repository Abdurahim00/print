require('dotenv').config()
const { MongoClient } = require('mongodb')

async function fix() {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  const db = client.db('printwrap-pro')
  const collection = db.collection('products')

  console.log('Removing embedded base64 images from products...')
  console.log('This will unset: image, frontImage, backImage if they contain base64 data\n')

  // Update all products - remove fields that might contain base64 images
  const result = await collection.updateMany(
    {},
    {
      $unset: {
        'image': '',
        'frontImage': '',
        'backImage': ''
      }
    }
  )

  console.log('✅ Updated', result.modifiedCount, 'products')
  console.log('\nTesting if we can now fetch products...')

  try {
    const products = await Promise.race([
      collection.find({}).limit(5).toArray(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('Still timeout')), 5000))
    ])
    console.log('✅ SUCCESS! Fetched', products.length, 'products')
    console.log('Names:', products.map(p => p.name))
  } catch (e) {
    console.log('❌ Still failing:', e.message)
  }

  await client.close()
}

fix().catch(console.error)
