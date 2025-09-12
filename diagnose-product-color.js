// Diagnostic script to check product data and color issues
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap-pro';

async function diagnoseProductColors() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Find product "Lilio 310 ml keramikmugg" 
    console.log('\n🔍 Looking for "Lilio 310 ml keramikmugg"...');
    const product = await productsCollection.findOne({ 
      name: { $regex: /Lilio.*keramikmugg/i } 
    });

    if (product) {
      console.log('\n📦 Product found:');
      console.log('  ID:', product._id);
      console.log('  Name:', product.name);
      console.log('  Has Variations:', product.hasVariations);
      console.log('  Base Color:', product.baseColor);
      console.log('  Angles:', product.angles);
      
      if (product.variations) {
        console.log('\n🎨 Variations (' + product.variations.length + ' total):');
        product.variations.forEach((v, i) => {
          console.log(`\n  Variation ${i + 1}:`);
          console.log('    ID:', v.id || v._id);
          console.log('    SKU:', v.sku);
          console.log('    Color:', v.color);
          console.log('    Images:', v.images?.length || 0, 'images');
          if (v.images && v.images.length > 0) {
            v.images.forEach(img => {
              console.log(`      - ${img.angle}: ${img.url ? '✓' : '✗'}`);
            });
          }
        });
      }

      // Check for color issues
      console.log('\n⚠️  Potential Issues:');
      let issuesFound = false;

      if (product.hasVariations && !product.variations) {
        console.log('  ❌ Product marked as hasVariations but no variations array!');
        issuesFound = true;
      }

      if (product.variations) {
        product.variations.forEach((v, i) => {
          if (!v.color || !v.color.hex_code) {
            console.log(`  ❌ Variation ${i + 1} has no color or hex_code!`);
            issuesFound = true;
          }
          if (v.color?.hex_code === '#000000') {
            console.log(`  ⚠️  Variation ${i + 1} has black (#000000) color - might be default`);
            issuesFound = true;
          }
        });
      }

      if (!issuesFound) {
        console.log('  ✅ No obvious issues found');
      }

      // Check all products with variations
      console.log('\n📊 Checking all products with variations...');
      const variationProducts = await productsCollection.find({ 
        hasVariations: true 
      }).toArray();

      let noColorCount = 0;
      let blackColorCount = 0;
      let goodColorCount = 0;

      variationProducts.forEach(p => {
        if (p.variations) {
          p.variations.forEach(v => {
            if (!v.color || !v.color.hex_code) {
              noColorCount++;
            } else if (v.color.hex_code === '#000000') {
              blackColorCount++;
            } else {
              goodColorCount++;
            }
          });
        }
      });

      console.log(`\n📈 Statistics for ${variationProducts.length} products with variations:`);
      console.log(`  ✅ Good colors: ${goodColorCount}`);
      console.log(`  ⚠️  Black colors (#000000): ${blackColorCount}`);
      console.log(`  ❌ Missing colors: ${noColorCount}`);

    } else {
      console.log('❌ Product not found');
    }

    // Find products with baseColor but no variations
    const baseColorProducts = await productsCollection.find({
      baseColor: { $exists: true, $ne: null },
      hasVariations: { $ne: true }
    }).limit(5).toArray();

    console.log(`\n📦 Sample products with baseColor (no variations):`);
    baseColorProducts.forEach(p => {
      console.log(`  - ${p.name}: ${p.baseColor}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

diagnoseProductColors();