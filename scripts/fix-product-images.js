const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixProductImages() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    // Step 1: Find products with image issues
    console.log('🔍 Finding products with image issues...\n');
    
    // Find products where images field is empty or missing but imageUrl exists
    const productsWithImageUrl = await products.find({
      $and: [
        {
          $or: [
            { images: { $exists: false } },
            { images: null },
            { images: [] }
          ]
        },
        {
          imageUrl: { $exists: true, $ne: null, $ne: '' }
        }
      ]
    }).toArray();
    
    console.log(`Found ${productsWithImageUrl.length} products with imageUrl but no images array`);

    // Find products with no images at all
    const productsWithNoImages = await products.find({
      $and: [
        {
          $or: [
            { images: { $exists: false } },
            { images: null },
            { images: [] }
          ]
        },
        {
          $or: [
            { imageUrl: { $exists: false } },
            { imageUrl: null },
            { imageUrl: '' }
          ]
        }
      ]
    }).toArray();
    
    console.log(`Found ${productsWithNoImages.length} products with no images at all`);

    // Step 2: Fix products with imageUrl but no images array
    if (productsWithImageUrl.length > 0) {
      console.log('\n🔧 Fixing products with imageUrl but no images array...');
      
      const updates = productsWithImageUrl.map(product => ({
        updateOne: {
          filter: { _id: product._id },
          update: { 
            $set: { 
              images: [product.imageUrl]
            }
          }
        }
      }));
      
      const result = await products.bulkWrite(updates);
      console.log(`✅ Updated ${result.modifiedCount} products with imageUrl`);
    }

    // Step 3: Try to fix products with no images by checking variants
    if (productsWithNoImages.length > 0) {
      console.log('\n🔧 Attempting to fix products with no images using variants...');
      
      const variantUpdates = [];
      let fixedFromVariants = 0;
      
      for (const product of productsWithNoImages) {
        const images = [];
        
        // Check variants array
        if (product.variants && Array.isArray(product.variants)) {
          product.variants.forEach(variant => {
            if (variant.variant_image && !images.includes(variant.variant_image)) {
              images.push(variant.variant_image);
            }
          });
        }
        
        // Check colors array
        if (product.colors && Array.isArray(product.colors)) {
          product.colors.forEach(color => {
            if (color.images && Array.isArray(color.images)) {
              color.images.forEach(img => {
                if (img && !images.includes(img)) {
                  images.push(img);
                }
              });
            }
          });
        }
        
        if (images.length > 0) {
          variantUpdates.push({
            updateOne: {
              filter: { _id: product._id },
              update: { 
                $set: { 
                  images: images,
                  imageUrl: images[0]
                }
              }
            }
          });
          fixedFromVariants++;
        }
      }
      
      if (variantUpdates.length > 0) {
        const result = await products.bulkWrite(variantUpdates);
        console.log(`✅ Fixed ${result.modifiedCount} products using variant images`);
      } else {
        console.log('❌ No variant images found to fix remaining products');
      }
    }

    // Step 4: Final statistics
    console.log('\n📊 Generating final statistics...\n');
    
    const totalProducts = await products.countDocuments();
    const productsWithImages = await products.countDocuments({
      $and: [
        { images: { $exists: true, $ne: null, $ne: [] } }
      ]
    });
    const productsWithImageUrlCount = await products.countDocuments({
      imageUrl: { $exists: true, $ne: null, $ne: '' }
    });
    
    const stillMissingImages = totalProducts - productsWithImages;
    
    console.log('=== Final Image Status ===');
    console.log(`Total products: ${totalProducts}`);
    console.log(`Products with images array: ${productsWithImages} (${(productsWithImages/totalProducts*100).toFixed(1)}%)`);
    console.log(`Products with imageUrl: ${productsWithImageUrlCount} (${(productsWithImageUrlCount/totalProducts*100).toFixed(1)}%)`);
    console.log(`Products still missing images: ${stillMissingImages} (${(stillMissingImages/totalProducts*100).toFixed(1)}%)`);
    
    // Show sample of products still missing images
    if (stillMissingImages > 0) {
      const samplesWithoutImages = await products.find({
        $or: [
          { images: { $exists: false } },
          { images: null },
          { images: [] }
        ]
      }).limit(5).toArray();
      
      console.log('\n📋 Sample products still missing images:');
      samplesWithoutImages.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name || 'No name'} (SKU: ${product.sku || 'No SKU'})`);
        console.log(`   - Has imageUrl: ${!!product.imageUrl}`);
        console.log(`   - Has variants: ${!!(product.variants && product.variants.length > 0)}`);
        console.log(`   - Has colors: ${!!(product.colors && product.colors.length > 0)}`);
      });
    }
    
    console.log('\n✅ Image fix process complete!');

  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    console.error(error.stack);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('=== Product Image Fix Tool ===');
console.log('This tool will fix products with missing or incorrectly formatted images\n');
fixProductImages();