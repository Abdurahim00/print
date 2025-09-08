const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testProductImages() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const productsCollection = db.collection('products');

    // Get a sample of 10 products
    const products = await productsCollection.find({}).limit(10).toArray();

    console.log('\n=== Testing Product Images ===\n');
    
    for (const product of products) {
      console.log(`Product: ${product.name}`);
      console.log(`  - Has imageUrl: ${!!product.imageUrl} ${product.imageUrl ? `(${product.imageUrl.substring(0, 50)}...)` : ''}`);
      console.log(`  - Has images array: ${!!product.images} (${product.images?.length || 0} images)`);
      console.log(`  - Has image field: ${!!product.image}`);
      console.log(`  - Has image_urls: ${!!product.image_urls} (${product.image_urls?.length || 0} urls)`);
      console.log(`  - Has variants: ${!!product.variants} (${product.variants?.length || 0} variants)`);
      console.log(`  - Has variants_dict: ${!!product.variants_dict} (${product.variants_dict?.length || 0} variants)`);
      
      // Check if any variant has images
      if (product.variants_dict && Array.isArray(product.variants_dict)) {
        const variantsWithImages = product.variants_dict.filter(v => v.variant_image).length;
        if (variantsWithImages > 0) {
          console.log(`  - Variants with images: ${variantsWithImages}`);
        }
      }
      
      console.log('');
    }

    // Count products with and without images
    const withImageUrl = await productsCollection.countDocuments({ 
      imageUrl: { $exists: true, $ne: null, $ne: '' } 
    });
    
    const withoutImageUrl = await productsCollection.countDocuments({ 
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' }
      ]
    });

    console.log('=== Summary ===');
    console.log(`Total products: ${withImageUrl + withoutImageUrl}`);
    console.log(`Products with imageUrl: ${withImageUrl}`);
    console.log(`Products without imageUrl: ${withoutImageUrl}`);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the test
console.log('Starting product image test...');
testProductImages();