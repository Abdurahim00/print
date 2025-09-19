const { MongoClient } = require('mongodb');
require('dotenv').config();

async function optimizeProducts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    console.log('=== Optimization Plan ===');
    console.log('1. Remove duplicate/unnecessary fields');
    console.log('2. Consolidate image data');
    console.log('3. Remove empty arrays\n');

    // Count products to optimize
    const total = await products.countDocuments();
    console.log(`Total products: ${total}`);

    // Remove unnecessary fields from ALL products to free up space
    console.log('\nRemoving unnecessary fields to free up space...');
    
    const result = await products.updateMany(
      {},
      {
        $unset: {
          // Remove redundant Swedish description fields if they exist
          'beskrivning': '',
          'short_description': '',
          'long_description': '',
          // Remove duplicate variant storage
          'variants_dict': '',  // We already have variants
          // Remove old import metadata
          'import_date': '',
          'import_source': '',
          // Remove empty or redundant fields
          'tags': '',
          'keywords': '',
          'meta_description': '',
          'meta_keywords': '',
          // Remove old image fields we don't use
          'image_urls': '',
          'thumbnail': '',
          'thumbnail_url': ''
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} products`);

    // Now try to update products with missing imageUrl
    console.log('\nFixing missing imageUrl fields...');
    
    const productsWithoutImage = await products.find({
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' }
      ]
    }).limit(100).toArray();  // Process in batches to avoid quota

    let fixed = 0;
    for (const product of productsWithoutImage) {
      let imageUrl = null;

      // Try to get image from various sources
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        imageUrl = product.images[0];
      } else if (product.image) {
        imageUrl = product.image;
      } else if (product.variants && Array.isArray(product.variants)) {
        for (const variant of product.variants) {
          if (variant.variant_image) {
            imageUrl = variant.variant_image;
            break;
          } else if (variant.image) {
            imageUrl = variant.image;
            break;
          }
        }
      }

      if (imageUrl) {
        try {
          await products.updateOne(
            { _id: product._id },
            { $set: { imageUrl: imageUrl } }
          );
          fixed++;
          
          if (fixed % 10 === 0) {
            console.log(`Fixed ${fixed} products...`);
          }
        } catch (err) {
          console.log('Quota exceeded, stopping updates');
          break;
        }
      }
    }

    console.log(`\n=== Results ===`);
    console.log(`Freed up space by removing unnecessary fields`);
    console.log(`Fixed ${fixed} products with missing imageUrl`);

  } catch (error) {
    console.error('Optimization failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Starting product optimization...');
optimizeProducts();