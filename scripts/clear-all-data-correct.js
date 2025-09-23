const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

async function clearAllData() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Use the correct database name from the connection string
    const db = client.db('printwrap-pro');
    console.log('Using database: printwrap-pro');

    // Check and clear products collection
    const productsCount = await db.collection('products').countDocuments();
    console.log(`Found ${productsCount} products`);
    if (productsCount > 0) {
      const productsResult = await db.collection('products').deleteMany({});
      console.log(`✅ Deleted ${productsResult.deletedCount} products`);
    }

    // Check and clear categories collection
    const categoriesCount = await db.collection('categories').countDocuments();
    console.log(`Found ${categoriesCount} categories`);
    if (categoriesCount > 0) {
      const categoriesResult = await db.collection('categories').deleteMany({});
      console.log(`✅ Deleted ${categoriesResult.deletedCount} categories`);
    }

    // Check and clear subcategories collection
    const subcategoriesCount = await db.collection('subcategories').countDocuments();
    console.log(`Found ${subcategoriesCount} subcategories`);
    if (subcategoriesCount > 0) {
      const subcategoriesResult = await db.collection('subcategories').deleteMany({});
      console.log(`✅ Deleted ${subcategoriesResult.deletedCount} subcategories`);
    }

    // Also check for any other product-related collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Checking all collections:');

    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} documents`);

      // Clear any product or category related collections
      if (col.name.includes('product') || col.name.includes('categor')) {
        if (count > 0) {
          const result = await db.collection(col.name).deleteMany({});
          console.log(`    ✅ Cleared ${result.deletedCount} documents from ${col.name}`);
        }
      }
    }

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