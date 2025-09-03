import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

async function checkStatus() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap')
  await client.connect()

  const db = client.db(process.env.DATABASE_NAME || 'printwrap')
  const collection = db.collection('products')

  const total = await collection.countDocuments()
  const withRealImages = await collection.countDocuments({
    image: { 
      $exists: true,
      $ne: '/placeholder.jpg',
      $ne: '',
      $ne: null,
      $regex: '^http'
    }
  })
  
  const withPlaceholder = await collection.countDocuments({
    image: '/placeholder.jpg'
  })

  console.log('=== IMPORT STATUS ===')
  console.log('Total products in database:', total)
  console.log('Products with real images:', withRealImages)
  console.log('Products with placeholder:', withPlaceholder)
  console.log('Percentage with real images:', ((withRealImages / total) * 100).toFixed(1) + '%')

  // Show some examples
  const noImageSample = await collection.find({ image: '/placeholder.jpg' }).limit(5).toArray()
  if (noImageSample.length > 0) {
    console.log('\nSample products without images:')
    noImageSample.forEach(p => {
      console.log(`- ${p.name} (SKU: ${p.sku})`)
    })
  }

  await client.close()
}

checkStatus().catch(console.error)