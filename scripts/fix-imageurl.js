require('dotenv').config()
const { MongoClient } = require('mongodb')

async function fixImages() {
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    const db = client.db('printwrap-pro')

    // Update all products with a proper placeholder URL
    const result = await db.collection('products').updateMany(
      {},
      {
        $set: {
          imageUrl: 'https://placehold.co/600x400/png?text=Product+Image'
        }
      }
    )

    console.log('✅ Updated', result.modifiedCount, 'products with placeholder image URL')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

fixImages()
