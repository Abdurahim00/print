require('dotenv').config()
const { MongoClient } = require('mongodb')

async function fix() {
  const client = await MongoClient.connect(process.env.MONGODB_URI)
  const db = client.db('printwrap-pro')

  console.log('Adding placeholder image URLs to products without images...\n')

  // Update all products that don't have imageUrl
  const result = await db.collection('products').updateMany(
    {
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' }
      ]
    },
    {
      $set: {
        imageUrl: '/placeholder.jpg',
        image: '/placeholder.jpg'
      }
    }
  )

  console.log('✅ Updated', result.modifiedCount, 'products')

  // Show all products
  const products = await db.collection('products').find({}, {
    projection: { name: 1, imageUrl: 1 }
  }).toArray()

  console.log('\nAll products:')
  products.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name}: ${p.imageUrl}`)
  })

  await client.close()
}

fix().catch(console.error)
