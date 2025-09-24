const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
require('dotenv').config();

async function fixStringImageUrls() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    // Read the original 60k.json file to get the string image_urls
    console.log('📖 Reading 60k.json file to extract string image URLs...');
    const jsonContent = await fs.readFile('60k.json', 'utf8');
    const jsonProducts = JSON.parse(jsonContent);
    console.log(`✅ Found ${jsonProducts.length} products in 60k.json\n`);

    // Create a map of products by name to their image_urls
    const imageUrlMap = {};
    let stringImageCount = 0;
    
    jsonProducts.forEach(product => {
      if (product.image_urls && typeof product.image_urls === 'string') {
        imageUrlMap[product.Title] = product.image_urls;
        stringImageCount++;
      }
    });
    
    console.log(`Found ${stringImageCount} products with string image_urls in JSON\n`);

    // Get products without imageUrl from database
    const productsWithoutImage = await products.find({
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' }
      ]
    }).toArray();
    
    console.log(`Found ${productsWithoutImage.length} products without images in database\n`);

    // Prepare updates
    const updates = [];
    let matched = 0;
    let notMatched = [];

    for (const product of productsWithoutImage) {
      // Try to match by name (Title field in JSON matches name in DB)
      const imageUrl = imageUrlMap[product.name];
      
      if (imageUrl) {
        updates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { 
              $set: { 
                imageUrl: imageUrl,
                // Also update images array for consistency
                images: [imageUrl]
              }
            }
          }
        });
        matched++;
      } else {
        notMatched.push(product.name);
      }
    }

    console.log(`Matched ${matched} products with image URLs from 60k.json`);
    if (notMatched.length > 0 && notMatched.length <= 10) {
      console.log(`\nCouldn't match ${notMatched.length} products:`);
      notMatched.slice(0, 10).forEach(name => console.log(`  - ${name}`));
    } else if (notMatched.length > 10) {
      console.log(`\nCouldn't match ${notMatched.length} products (showing first 10):`);
      notMatched.slice(0, 10).forEach(name => console.log(`  - ${name}`));
    }

    // Execute batch update
    if (updates.length > 0) {
      console.log(`\n🔧 Updating ${updates.length} products with image URLs...`);
      const batchSize = 500;
      let processed = 0;
      
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        try {
          const result = await products.bulkWrite(batch);
          processed += batch.length;
          process.stdout.write(`\rProgress: ${processed}/${updates.length} products...`);
        } catch (err) {
          console.error('\nBatch update error:', err.message);
        }
      }
      console.log('\n✅ Image URLs updated!\n');
    }

    // Verify the fix
    const finalStats = {
      total: await products.countDocuments(),
      withImage: await products.countDocuments({ 
        imageUrl: { $exists: true, $ne: null, $ne: '' } 
      })
    };
    
    const withoutImage = finalStats.total - finalStats.withImage;
    
    console.log('=== Final Image Status ===');
    console.log(`Total products: ${finalStats.total}`);
    console.log(`Products with images: ${finalStats.withImage} (${(finalStats.withImage/finalStats.total*100).toFixed(1)}%)`);
    console.log(`Products without images: ${withoutImage} (${(withoutImage/finalStats.total*100).toFixed(1)}%)`);
    
    console.log('\n✅ Image URL fix complete!');

  } catch (error) {
    console.error('❌ Operation failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('=== Fix String Image URLs Tool ===');
console.log('This will fix products that have image_urls as strings in 60k.json\n');
fixStringImageUrls();