const { MongoClient } = require('mongodb');
require('dotenv').config();

async function compactCollection() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    
    // Try to run compact command
    console.log('Attempting to compact products collection...');
    
    try {
      const result = await db.command({
        compact: 'products',
        force: true
      });
      console.log('Compact successful:', result);
    } catch (error) {
      console.error('Compact failed:', error.message);
      console.log('\nCompacting requires admin privileges.');
      console.log('Please compact the collection manually via MongoDB Atlas web interface.');
    }
    
    // Get database stats
    const stats = await db.stats();
    console.log('\n=== Current Database Stats ===');
    console.log(`Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Get collection stats
    const collection = db.collection('products');
    const count = await collection.countDocuments();
    console.log(`\nProducts in database: ${count}`);

  } catch (error) {
    console.error('Operation failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('=== MongoDB Collection Compact Tool ===\n');
console.log('Note: This operation requires admin privileges.');
console.log('If it fails, please use MongoDB Atlas web interface.\n');
compactCollection();