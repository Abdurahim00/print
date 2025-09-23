const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

async function checkAllData() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db('printwrappro');

    // Check products
    const productsCount = await db.collection('products').countDocuments();
    console.log(`📦 Products: ${productsCount}`);
    if (productsCount > 0) {
      const products = await db.collection('products').find({}).limit(5).toArray();
      console.log('Sample products:');
      products.forEach(p => console.log(`  - ${p.name} (${p.id || p._id})`));
    }

    // Check categories
    const categoriesCount = await db.collection('categories').countDocuments();
    console.log(`\n📁 Categories: ${categoriesCount}`);
    if (categoriesCount > 0) {
      const categories = await db.collection('categories').find({}).toArray();
      console.log('All categories:');
      categories.forEach(c => console.log(`  - ${c.name} (${c.id || c._id})`));
    }

    // Check subcategories
    const subcategoriesCount = await db.collection('subcategories').countDocuments();
    console.log(`\n📂 Subcategories: ${subcategoriesCount}`);
    if (subcategoriesCount > 0) {
      const subcategories = await db.collection('subcategories').find({}).toArray();
      console.log('All subcategories:');
      subcategories.forEach(s => console.log(`  - ${s.name} (${s.id || s._id})`));
    }

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 All collections in database:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} documents`);
    }

  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

checkAllData();