const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
require('dotenv').config();

async function recreateCollection() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    // Step 1: Check current status
    const count = await products.countDocuments();
    const stats = await db.stats();
    console.log('=== Current Status ===');
    console.log(`Products in collection: ${count}`);
    console.log(`Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Step 2: Backup current products
    console.log('\n📦 Creating backup of all products...');
    const allProducts = await products.find({}).toArray();
    const backupFile = `products-backup-${Date.now()}.json`;
    await fs.writeFile(backupFile, JSON.stringify(allProducts, null, 2));
    console.log(`✅ Backed up ${allProducts.length} products to ${backupFile}`);

    // Step 3: Drop the collection
    console.log('\n⚠️  Ready to drop and recreate the products collection');
    console.log('This will free up all space and reinsert products compactly.');
    console.log('\n🔴 Dropping collection in 10 seconds... (Press Ctrl+C to cancel)');
    
    for (let i = 10; i > 0; i--) {
      process.stdout.write(`\r${i}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('\n');
    
    await products.drop();
    console.log('✅ Collection dropped successfully - space reclaimed!');

    // Step 4: Recreate and restore
    console.log('\n📝 Recreating collection and restoring products...');
    const newProducts = db.collection('products');
    
    // Insert in batches to avoid memory issues
    const batchSize = 500;
    let inserted = 0;
    
    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      try {
        await newProducts.insertMany(batch, { ordered: false });
        inserted += batch.length;
        process.stdout.write(`\rRestoring: ${inserted}/${allProducts.length} products...`);
      } catch (err) {
        console.error('\nBatch error (continuing):', err.message);
      }
    }

    console.log(`\n✅ Restored ${inserted} products successfully!`);
    
    // Step 5: Verify final state
    const finalStats = await db.stats();
    const finalCount = await newProducts.countDocuments();
    
    console.log('\n=== Final Status ===');
    console.log(`Products in collection: ${finalCount}`);
    console.log(`Storage Size: ${(finalStats.storageSize / 1024 / 1024).toFixed(2)} MB (was ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`Data Size: ${(finalStats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\n🎉 Space reclaimed: ${((stats.storageSize - finalStats.storageSize) / 1024 / 1024).toFixed(2)} MB`);

    console.log(`\n✅ Success! You can now run:`);
    console.log('   node scripts/assign-categories-to-products.js');
    console.log('   node scripts/fix-string-image-urls.js');

  } catch (error) {
    console.error('\n❌ Operation failed:', error.message);
    console.log('Check for backup files (products-backup-*.json) to restore manually if needed.');
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('=== MongoDB Space Reclamation Tool ===');
console.log('This will drop and recreate the products collection.');
console.log('All products will be backed up and restored.\n');
recreateCollection();