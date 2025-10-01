const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

async function createIndexes() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const ordersCollection = db.collection('orders');
    
    // Create indexes for faster queries
    console.log('Creating indexes for orders collection...');
    
    // Index for sorting by createdAt (most common sort)
    await ordersCollection.createIndex({ createdAt: -1 });
    console.log('✅ Created index on createdAt');
    
    // Index for filtering by status
    await ordersCollection.createIndex({ status: 1 });
    console.log('✅ Created index on status');
    
    // Compound index for status + createdAt (for active orders query)
    await ordersCollection.createIndex({ status: 1, createdAt: -1 });
    console.log('✅ Created compound index on status + createdAt');
    
    // Index for orderId (for single order lookup)
    await ordersCollection.createIndex({ orderId: 1 }, { unique: true });
    console.log('✅ Created unique index on orderId');
    
    // Index for customer email (for customer lookups)
    await ordersCollection.createIndex({ customerEmail: 1 });
    console.log('✅ Created index on customerEmail');
    
    // List all indexes
    const indexes = await ordersCollection.listIndexes().toArray();
    console.log('\n📊 All indexes on orders collection:');
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n✅ All indexes created successfully!');
    console.log('The operations dashboard should now load much faster.');
    
  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

createIndexes();