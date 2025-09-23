const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const sampleProducts = [];

async function seedProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('printwrappro');
    const collection = db.collection('products');

    // Check if products already exist
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} products. Skipping seed.`);
      console.log('To reseed, clear the products collection first.');
      return;
    }

    if (sampleProducts.length === 0) {
      console.log('No sample products to seed. Add products to the sampleProducts array if needed.');
      return;
    }

    // Insert sample products
    const result = await collection.insertMany(sampleProducts);
    console.log(`\n✅ Successfully inserted ${result.insertedCount} sample products!`);

    // Display the inserted products with their IDs
    const insertedProducts = await collection.find({}).toArray();
    console.log('\n=== INSERTED PRODUCTS ===');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (ID: ${product._id.toString()})`);
    });

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

seedProducts();