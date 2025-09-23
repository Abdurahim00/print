const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

async function clearAllData() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('printwrappro');

    // Clear products collection
    const productsResult = await db.collection('products').deleteMany({});
    console.log(`✅ Deleted ${productsResult.deletedCount} products`);

    // Clear categories collection
    const categoriesResult = await db.collection('categories').deleteMany({});
    console.log(`✅ Deleted ${categoriesResult.deletedCount} categories`);

    // Clear subcategories collection
    const subcategoriesResult = await db.collection('subcategories').deleteMany({});
    console.log(`✅ Deleted ${subcategoriesResult.deletedCount} subcategories`);

    console.log('\n🎉 All product and category data has been cleared successfully!');
    console.log('You can now start fresh with new products and categories.');

  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

clearAllData();