const { MongoClient } = require('mongodb')

const uri = process.env.MONGODB_URI || 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/'

async function clearPrendoProducts() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const database = client.db('printwrap-pro')
    const productsCollection = database.collection('products')

    // Delete all products that were imported from Prendo
    const result = await productsCollection.deleteMany({
      source: 'prendo_import'
    })

    console.log(`Deleted ${result.deletedCount} Prendo products from database`)

  } catch (error) {
    console.error('Error clearing Prendo products:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

clearPrendoProducts()