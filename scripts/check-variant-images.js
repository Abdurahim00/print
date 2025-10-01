const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkVariantImages() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    // Find products without imageUrl
    const withoutImageUrl = await products.find({
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: null },
        { imageUrl: '' }
      ]
    }).limit(30).toArray();

    console.log(`Checking ${withoutImageUrl.length} products for variant images:\n`);
    
    let hasVariantImages = 0;
    let hasColorsWithImages = 0;
    let hasVariantsDict = 0;
    let totallyEmpty = 0;
    
    withoutImageUrl.forEach(product => {
      console.log(`\nProduct: ${product.name}`);
      let foundImage = null;
      
      // Check variants array
      if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
        console.log(`  Has ${product.variants.length} variants`);
        product.variants.forEach((v, i) => {
          if (v.variant_image) {
            console.log(`    Variant ${i}: has variant_image: ${v.variant_image.substring(0, 50)}...`);
            foundImage = v.variant_image;
            hasVariantImages++;
          } else if (v.image) {
            console.log(`    Variant ${i}: has image: ${v.image.substring(0, 50)}...`);
            foundImage = v.image;
            hasVariantImages++;
          } else if (v.images && v.images.length > 0) {
            console.log(`    Variant ${i}: has images array (${v.images.length} images)`);
            foundImage = v.images[0];
            hasVariantImages++;
          } else {
            console.log(`    Variant ${i}: NO images (color: ${v.color}, size: ${v.size})`);
          }
        });
      }
      
      // Check variants_dict (from original import)
      if (product.variants_dict && Array.isArray(product.variants_dict) && product.variants_dict.length > 0) {
        console.log(`  Has ${product.variants_dict.length} variants_dict entries`);
        product.variants_dict.forEach((v, i) => {
          if (v.variant_image) {
            console.log(`    Variant_dict ${i}: has image: ${v.variant_image.substring(0, 50)}...`);
            foundImage = v.variant_image;
            hasVariantsDict++;
          }
        });
      }
      
      // Check colors array
      if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
        console.log(`  Has ${product.colors.length} colors`);
        product.colors.forEach((c, i) => {
          if (c.images && c.images.length > 0) {
            console.log(`    Color ${i}: has ${c.images.length} images`);
            foundImage = c.images[0];
            hasColorsWithImages++;
          }
        });
      }
      
      // Check individual image fields
      if (product.image) {
        console.log(`  Has image field: ${product.image.substring(0, 50)}...`);
        foundImage = product.image;
      }
      if (product.frontImage) {
        console.log(`  Has frontImage: ${product.frontImage.substring(0, 50)}...`);
        foundImage = product.frontImage;
      }
      if (product.backImage) {
        console.log(`  Has backImage: ${product.backImage.substring(0, 50)}...`);
        foundImage = product.backImage;
      }
      
      if (!foundImage) {
        console.log(`  ❌ NO IMAGES FOUND ANYWHERE`);
        totallyEmpty++;
      } else {
        console.log(`  ✅ FOUND IMAGE: ${foundImage.substring(0, 60)}...`);
      }
    });

    console.log('\n=== Summary ===');
    console.log(`Products checked: ${withoutImageUrl.length}`);
    console.log(`With variant images: ${hasVariantImages}`);
    console.log(`With color images: ${hasColorsWithImages}`);
    console.log(`With variants_dict images: ${hasVariantsDict}`);
    console.log(`TOTALLY EMPTY (no images): ${totallyEmpty}`);

  } catch (error) {
    console.error('Check failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Checking for variant images in products without imageUrl...');
checkVariantImages();