const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkProductStructure() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');
    const categories = db.collection('categories');

    // Get sample products
    const sampleProducts = await products.find({}).limit(5).toArray();
    
    console.log('=== Product Structure ===');
    sampleProducts.forEach(product => {
      console.log(`\nProduct: ${product.name}`);
      console.log(`  _id: ${product._id}`);
      console.log(`  id: ${product.id || 'NOT SET'}`);
      console.log(`  categoryId: ${product.categoryId || 'NOT SET'}`);
      console.log(`  subcategoryIds: ${JSON.stringify(product.subcategoryIds) || 'NOT SET'}`);
      console.log(`  price: ${product.price}`);
      console.log(`  basePrice: ${product.basePrice || 'NOT SET'}`);
      console.log(`  imageUrl: ${product.imageUrl ? 'SET' : 'NOT SET'}`);
    });

    // Check categories
    const allCategories = await categories.find({}).toArray();
    console.log('\n=== Categories in Database ===');
    allCategories.forEach(cat => {
      console.log(`  ${cat.name} (ID: ${cat.id || cat._id})`);
    });

    // Count products by category
    console.log('\n=== Products by Category ===');
    const categoryCounts = await products.aggregate([
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    categoryCounts.forEach(item => {
      console.log(`  Category "${item._id || 'null'}": ${item.count} products`);
    });

  } catch (error) {
    console.error('Check failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Checking product structure...');
checkProductStructure();