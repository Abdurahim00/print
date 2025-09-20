const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixMissingImages() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const productsCollection = db.collection('products');

    // Find products without imageUrl
    const productsWithoutImage = await productsCollection.find({
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' }
      ]
    }).toArray();

    console.log(`Found ${productsWithoutImage.length} products without imageUrl`);

    let fixed = 0;
    let stillMissing = 0;

    for (const product of productsWithoutImage) {
      let imageUrl = null;

      // Try to get image from various sources
      // 1. Check images array
      if (!imageUrl && product.images && Array.isArray(product.images) && product.images.length > 0) {
        imageUrl = product.images[0];
      }

      // 2. Check image field
      if (!imageUrl && product.image) {
        imageUrl = product.image;
      }

      // 3. Check variants for variant_image
      if (!imageUrl && product.variants && Array.isArray(product.variants)) {
        for (const variant of product.variants) {
          if (variant.variant_image) {
            imageUrl = variant.variant_image;
            break;
          }
        }
      }

      // 4. Check colors array for images
      if (!imageUrl && product.colors && Array.isArray(product.colors)) {
        for (const color of product.colors) {
          if (color.images && Array.isArray(color.images) && color.images.length > 0) {
            imageUrl = color.images[0];
            break;
          }
        }
      }

      // 5. Check variants_dict (from original import)
      if (!imageUrl && product.variants_dict && Array.isArray(product.variants_dict)) {
        for (const variant of product.variants_dict) {
          if (variant.variant_image) {
            imageUrl = variant.variant_image;
            break;
          }
        }
      }

      // 6. Check image_urls (from original import)
      if (!imageUrl && product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
        imageUrl = product.image_urls[0];
      }

      if (imageUrl) {
        // Update the product with the found imageUrl
        await productsCollection.updateOne(
          { _id: product._id },
          { 
            $set: { 
              imageUrl: imageUrl,
              updatedAt: new Date()
            } 
          }
        );
        fixed++;
        console.log(`Fixed: ${product.name} - Added imageUrl: ${imageUrl.substring(0, 50)}...`);
      } else {
        stillMissing++;
        console.log(`Still missing image: ${product.name} (ID: ${product._id})`);
        
        // Set a placeholder for products with no images at all
        await productsCollection.updateOne(
          { _id: product._id },
          { 
            $set: { 
              imageUrl: '/placeholder.jpg',
              updatedAt: new Date()
            } 
          }
        );
      }
    }

    console.log('\n=== Fix Complete ===');
    console.log(`Fixed: ${fixed} products`);
    console.log(`Still missing (set to placeholder): ${stillMissing} products`);
    console.log(`Total processed: ${productsWithoutImage.length} products`);

    // Also ensure all products have at least an empty images array
    const result = await productsCollection.updateMany(
      { images: { $exists: false } },
      { $set: { images: [] } }
    );
    console.log(`Added empty images array to ${result.modifiedCount} products`);

  } catch (error) {
    console.error('Fix failed:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the fix
console.log('Starting image fix process...');
fixMissingImages();