const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkDatabaseUsage() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    
    // Get database stats
    const stats = await db.stats();
    console.log('=== Database Stats ===');
    console.log(`Total Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log('');

    // Get collection sizes
    console.log('=== Collection Sizes ===');
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      const colStats = await db.collection(col.name).stats();
      const sizeMB = (colStats.size / 1024 / 1024).toFixed(2);
      const count = await db.collection(col.name).countDocuments();
      console.log(`${col.name}: ${sizeMB} MB (${count} documents)`);
    }

    // Check for duplicate products
    console.log('\n=== Checking for Duplicates ===');
    const products = db.collection('products');
    
    // Check products without images that could be deleted
    const noImageProducts = await products.countDocuments({
      $and: [
        { $or: [
          { imageUrl: { $exists: false } },
          { imageUrl: null },
          { imageUrl: '' }
        ]},
        { $or: [
          { images: { $exists: false } },
          { images: { $size: 0 } },
          { images: null }
        ]},
        { $or: [
          { variants: { $exists: false } },
          { variants: { $size: 0 } },
          { variants: null }
        ]},
        { $or: [
          { variants_dict: { $exists: false } },
          { variants_dict: { $size: 0 } },
          { variants_dict: null }
        ]}
      ]
    });
    
    console.log(`Products with NO images at all: ${noImageProducts}`);
    
    // Find products with same name (potential duplicates)
    const duplicates = await products.aggregate([
      { $group: { 
        _id: "$name", 
        count: { $sum: 1 },
        ids: { $push: "$_id" }
      }},
      { $match: { count: { $gt: 1 } } },
      { $limit: 10 }
    ]).toArray();
    
    console.log(`Products with duplicate names: ${duplicates.length}`);
    if (duplicates.length > 0) {
      console.log('Sample duplicates:');
      duplicates.slice(0, 3).forEach(d => {
        console.log(`  - "${d._id}": ${d.count} copies`);
      });
    }

  } catch (error) {
    console.error('Check failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Checking database usage...');
checkDatabaseUsage();