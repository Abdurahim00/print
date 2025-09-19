const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'printwrap';

async function verifyVariants() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');
    
    // Get statistics
    console.log('\n📊 Product Statistics:');
    const totalProducts = await collection.countDocuments();
    const withVariants = await collection.countDocuments({
      variants: { $exists: true, $ne: [] }
    });
    const withImages = await collection.countDocuments({
      image: { $exists: true, $ne: [] }
    });
    
    console.log(`  Total products: ${totalProducts}`);
    console.log(`  Products with variants: ${withVariants}`);
    console.log(`  Products with images: ${withImages}`);
    
    // Check for PDF thumbnails in variants
    console.log('\n🔍 Checking for PDF thumbnails in variants...');
    
    const productsWithVariants = await collection.find({
      variants: { $exists: true, $ne: [] }
    }).limit(100).toArray();
    
    let pdfVariantsFound = 0;
    let problemProducts = [];
    
    for (const product of productsWithVariants) {
      if (product.variants && Array.isArray(product.variants)) {
        for (const variant of product.variants) {
          const image = variant.variant_image || variant.image || '';
          const name = variant.variant_name || variant.name || '';
          
          if (image.includes('THUMBNAIL-FILE-') || 
              image.includes('FILE-') && image.includes('.png') ||
              (name === '' && image.includes('media/full/'))) {
            pdfVariantsFound++;
            problemProducts.push({
              name: product.name,
              variantName: name,
              variantImage: image
            });
            break;
          }
        }
      }
    }
    
    if (pdfVariantsFound > 0) {
      console.log(`  ⚠️ Found ${pdfVariantsFound} products with PDF thumbnails as variants`);
      console.log('\n  Problem products:');
      problemProducts.slice(0, 5).forEach(p => {
        console.log(`    - ${p.name}: "${p.variantName}" - ${p.variantImage.substring(0, 50)}...`);
      });
    } else {
      console.log(`  ✅ No PDF thumbnails found in variants`);
    }
    
    // Show sample products with variants
    console.log('\n📋 Sample products with variants:');
    
    const samples = await collection.find({
      variants: { $exists: true, $ne: [] }
    }).limit(5).toArray();
    
    samples.forEach(product => {
      console.log(`\n  ${product.name || 'Unnamed'}:`);
      console.log(`    Images: ${Array.isArray(product.image) ? product.image.length : 0}`);
      console.log(`    Variants: ${product.variants.length}`);
      if (product.variants.length > 0) {
        product.variants.slice(0, 3).forEach((v, i) => {
          console.log(`      ${i + 1}. ${v.variant_name || 'Unnamed'}`);
        });
        if (product.variants.length > 3) {
          console.log(`      ... and ${product.variants.length - 3} more`);
        }
      }
    });
    
    // Look for MASCOT Linz specifically
    console.log('\n🔍 Looking for MASCOT Linz product...');
    const mascotProduct = await collection.findOne({
      $or: [
        { name: { $regex: /MASCOT.*Linz/i } },
        { 'originalData.Title': { $regex: /MASCOT.*Linz/i } }
      ]
    });
    
    if (mascotProduct) {
      console.log('✅ Found MASCOT Linz:');
      console.log(`  Name: ${mascotProduct.name}`);
      console.log(`  Images: ${Array.isArray(mascotProduct.image) ? mascotProduct.image.length : 0}`);
      console.log(`  Variants: ${mascotProduct.variants ? mascotProduct.variants.length : 0}`);
      if (mascotProduct.variants && mascotProduct.variants.length > 0) {
        mascotProduct.variants.forEach((v, i) => {
          console.log(`    ${i + 1}. ${v.variant_name || 'Unnamed'} - ${v.variant_image ? '✓ has image' : '✗ no image'}`);
        });
      }
    } else {
      console.log('  Product not found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
verifyVariants().catch(console.error);