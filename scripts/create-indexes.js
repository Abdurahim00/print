const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createIndexes() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db(process.env.MONGODB_DB || 'printwrap');
    
    // Products collection indexes
    console.log('Creating indexes for products collection...');
    const products = db.collection('products');
    
    await products.createIndex({ categoryId: 1 });
    await products.createIndex({ subcategoryIds: 1 });
    await products.createIndex({ name: 'text', description: 'text' });
    await products.createIndex({ price: 1 });
    await products.createIndex({ inStock: 1 });
    await products.createIndex({ featured: -1, inStock: -1, createdAt: -1 }); // For default sorting
    await products.createIndex({ createdAt: -1 });
    await products.createIndex({ categoryId: 1, price: 1 }); // Compound index for filtered queries
    
    console.log('✓ Products indexes created');
    
    // Categories collection indexes
    console.log('\nCreating indexes for categories collection...');
    const categories = db.collection('categories');
    
    await categories.createIndex({ slug: 1 });
    await categories.createIndex({ isActive: 1 });
    await categories.createIndex({ name: 1 });
    
    console.log('✓ Categories indexes created');
    
    // Orders collection indexes
    console.log('\nCreating indexes for orders collection...');
    const orders = db.collection('orders');
    
    await orders.createIndex({ userId: 1 });
    await orders.createIndex({ createdAt: -1 });
    await orders.createIndex({ status: 1 });
    await orders.createIndex({ orderNumber: 1 }, { unique: true, sparse: true });
    
    console.log('✓ Orders indexes created');
    
    // Users collection indexes
    console.log('\nCreating indexes for users collection...');
    const users = db.collection('users');
    
    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ role: 1 });
    
    console.log('✓ Users indexes created');
    
    // List all indexes
    console.log('\n=== All Indexes ===');
    
    const collections = ['products', 'categories', 'orders', 'users'];
    for (const collName of collections) {
      const coll = db.collection(collName);
      const indexes = await coll.indexes();
      console.log(`\n${collName}:`);
      indexes.forEach(index => {
        if (index.name !== '_id_') {
          console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        }
      });
    }
    
  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Creating database indexes for performance optimization...');
createIndexes();