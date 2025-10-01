const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'printwrap';

async function fixNestedArrays() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');
    
    console.log('🔍 Finding products with nested image arrays...');
    
    // Get all products
    const allProducts = await collection.find({}).toArray();
    console.log(`📊 Checking ${allProducts.length} products...`);
    
    const bulkOps = [];
    let nestedArrayCount = 0;
    let fixedCount = 0;
    
    for (const product of allProducts) {
      let needsFix = false;
      let fixedImage = product.image;
      
      // Check if image is a nested array
      if (Array.isArray(product.image)) {
        // Check if first element is also an array (nested)
        if (product.image.length > 0 && Array.isArray(product.image[0])) {
          // Flatten the nested array
          fixedImage = product.image.flat();
          needsFix = true;
          nestedArrayCount++;
        } else if (product.image.length === 1 && typeof product.image[0] === 'string') {
          // Single string in array - keep as is (this is correct)
          fixedImage = product.image;
        }
      } else if (typeof product.image === 'string') {
        // Convert string to array
        fixedImage = [product.image];
        needsFix = true;
      }
      
      // Remove any empty strings or invalid values
      if (Array.isArray(fixedImage)) {
        fixedImage = fixedImage.filter(img => img && typeof img === 'string' && img.trim() !== '');
        
        // If no valid images, use placeholder
        if (fixedImage.length === 0) {
          fixedImage = ['/placeholder.jpg'];
          needsFix = true;
        }
      }
      
      if (needsFix) {
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: { image: fixedImage } }
          }
        });
        fixedCount++;
      }
    }
    
    // Execute bulk updates
    if (bulkOps.length > 0) {
      console.log(`\n📝 Fixing ${bulkOps.length} products...`);
      const result = await collection.bulkWrite(bulkOps);
      console.log(`✅ Successfully updated ${result.modifiedCount} products`);
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  - Products with nested arrays: ${nestedArrayCount}`);
    console.log(`  - Total products fixed: ${fixedCount}`);
    
    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    
    const samples = await collection.find({}).limit(5).toArray();
    console.log('\n📋 Sample products after fix:');
    samples.forEach(product => {
      console.log(`  ${product.name || 'Unnamed'}: ${JSON.stringify(product.image)}`);
    });
    
    // Final check
    const finalCheck = await collection.find({}).toArray();
    let stillNested = 0;
    let properArrays = 0;
    let strings = 0;
    
    finalCheck.forEach(product => {
      if (Array.isArray(product.image)) {
        if (product.image.length > 0 && Array.isArray(product.image[0])) {
          stillNested++;
        } else {
          properArrays++;
        }
      } else if (typeof product.image === 'string') {
        strings++;
      }
    });
    
    console.log('\n📊 Final verification:');
    console.log(`  ✅ Proper arrays: ${properArrays}`);
    console.log(`  ${stillNested > 0 ? '❌' : '✅'} Still nested: ${stillNested}`);
    console.log(`  ${strings > 0 ? '❌' : '✅'} Still strings: ${strings}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixNestedArrays().catch(console.error);