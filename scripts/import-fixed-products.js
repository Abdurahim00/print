const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function importFixedProducts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    // Read the fixed products file
    const jsonPath = path.join(__dirname, '..', 'products-fixed.json');
    console.log('📖 Reading products-fixed.json file...');
    const rawData = await fs.readFile(jsonPath, 'utf8');
    const fixedProducts = JSON.parse(rawData);
    console.log(`✅ Found ${fixedProducts.length} products to update\n`);

    // Get current statistics
    const beforeStats = {
      total: await products.countDocuments(),
      withImages: await products.countDocuments({
        images: { $exists: true, $ne: null, $ne: [] }
      }),
      withImageUrl: await products.countDocuments({
        imageUrl: { $exists: true, $ne: null, $ne: '' }
      })
    };
    
    console.log('=== Before Update ===');
    console.log(`Total products: ${beforeStats.total}`);
    console.log(`Products with images: ${beforeStats.withImages}`);
    console.log(`Products with imageUrl: ${beforeStats.withImageUrl}\n`);

    // Update products in batches
    console.log('🔧 Updating products with fixed images...');
    const batchSize = 500;
    let updated = 0;
    let failed = 0;
    
    for (let i = 0; i < fixedProducts.length; i += batchSize) {
      const batch = fixedProducts.slice(i, i + batchSize);
      const bulkOps = [];
      
      for (const product of batch) {
        if (product._id) {
          // Update existing product
          bulkOps.push({
            updateOne: {
              filter: { _id: product._id },
              update: {
                $set: {
                  images: product.images,
                  imageUrl: product.imageUrl || (product.images && product.images[0]) || null
                }
              }
            }
          });
        } else if (product.sku) {
          // Update by SKU if no _id
          bulkOps.push({
            updateOne: {
              filter: { sku: product.sku },
              update: {
                $set: {
                  images: product.images,
                  imageUrl: product.imageUrl || (product.images && product.images[0]) || null
                }
              }
            }
          });
        }
      }
      
      if (bulkOps.length > 0) {
        try {
          const result = await products.bulkWrite(bulkOps, { ordered: false });
          updated += result.modifiedCount;
          process.stdout.write(`\rProgress: ${Math.min(i + batchSize, fixedProducts.length)}/${fixedProducts.length} products processed...`);
        } catch (err) {
          failed += bulkOps.length;
          console.error(`\nBatch error: ${err.message}`);
        }
      }
    }
    
    console.log('\n');
    
    // Get final statistics
    const afterStats = {
      total: await products.countDocuments(),
      withImages: await products.countDocuments({
        images: { $exists: true, $ne: null, $ne: [] }
      }),
      withImageUrl: await products.countDocuments({
        imageUrl: { $exists: true, $ne: null, $ne: '' }
      })
    };
    
    console.log('=== After Update ===');
    console.log(`Total products: ${afterStats.total}`);
    console.log(`Products with images: ${afterStats.withImages} (${(afterStats.withImages/afterStats.total*100).toFixed(1)}%)`);
    console.log(`Products with imageUrl: ${afterStats.withImageUrl} (${(afterStats.withImageUrl/afterStats.total*100).toFixed(1)}%)\n`);
    
    console.log('=== Update Summary ===');
    console.log(`✅ Successfully updated: ${updated} products`);
    console.log(`❌ Failed to update: ${failed} products`);
    console.log(`📈 Images increased by: ${afterStats.withImages - beforeStats.withImages} products`);
    
    // Check if any products still missing images
    const stillMissing = await products.find({
      $or: [
        { images: { $exists: false } },
        { images: null },
        { images: [] }
      ]
    }).limit(5).toArray();
    
    if (stillMissing.length > 0) {
      console.log(`\n⚠️  ${stillMissing.length} products still missing images (showing max 5):`);
      stillMissing.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name || 'Unnamed'} (SKU: ${product.sku})`);
      });
    } else {
      console.log('\n✅ All products now have images!');
    }

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error.stack);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('=== Import Fixed Products ===');
console.log('This will update all products in MongoDB with fixed images\n');
importFixedProducts();