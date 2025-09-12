// Diagnose products with hasVariations:true but empty variations array
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap-pro';

async function diagnoseEmptyVariations() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Find products with hasVariations:true
    const products = await productsCollection.find({ 
      hasVariations: true 
    }).toArray();

    console.log(`\n📊 Found ${products.length} products with hasVariations:true\n`);

    let issueCount = 0;
    const problematicProducts = [];

    for (const product of products) {
      const hasVariationsArray = product.variations && Array.isArray(product.variations);
      const hasVariantsArray = product.variants && Array.isArray(product.variants);
      const variationsLength = product.variations?.length || 0;
      const variantsLength = product.variants?.length || 0;

      if (!hasVariationsArray && !hasVariantsArray) {
        issueCount++;
        console.log(`\n❌ Product: ${product.name} (ID: ${product._id})`);
        console.log(`   - hasVariations: true`);
        console.log(`   - variations: ${product.variations}`);
        console.log(`   - variants: ${product.variants}`);
        console.log(`   - Missing both variations and variants arrays!`);
        problematicProducts.push({
          id: product._id,
          name: product.name,
          issue: 'No variations/variants array'
        });
      } else if (variationsLength === 0 && variantsLength === 0) {
        issueCount++;
        console.log(`\n⚠️ Product: ${product.name} (ID: ${product._id})`);
        console.log(`   - hasVariations: true`);
        console.log(`   - variations length: ${variationsLength}`);
        console.log(`   - variants length: ${variantsLength}`);
        console.log(`   - Both arrays are empty!`);
        problematicProducts.push({
          id: product._id,
          name: product.name,
          issue: 'Empty arrays'
        });
      } else if (hasVariantsArray && !hasVariationsArray) {
        console.log(`\n🔄 Product: ${product.name} (ID: ${product._id})`);
        console.log(`   - hasVariations: true`);
        console.log(`   - Has 'variants' array (${variantsLength} items) but no 'variations' array`);
        console.log(`   - Should be using 'variations' field name`);
        
        // Check the structure of variants
        if (variantsLength > 0) {
          const firstVariant = product.variants[0];
          console.log(`   - First variant structure:`, {
            hasColor: !!firstVariant.color,
            colorHex: firstVariant.color?.hex_code,
            colorName: firstVariant.color?.name,
            hasImages: !!firstVariant.images,
            imageCount: firstVariant.images?.length
          });
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Total products with hasVariations:true: ${products.length}`);
    console.log(`   - Products with issues: ${issueCount}`);
    console.log(`   - Issue rate: ${((issueCount / products.length) * 100).toFixed(2)}%`);

    if (problematicProducts.length > 0) {
      console.log(`\n🔧 Problematic products that need fixing:`);
      problematicProducts.forEach(p => {
        console.log(`   - ${p.name} (${p.id}): ${p.issue}`);
      });
    }

    // Sample check: Look at a specific product that's been problematic
    const lilioProduct = await productsCollection.findOne({ 
      name: { $regex: /Lilio.*keramikmugg/i } 
    });

    if (lilioProduct) {
      console.log(`\n🔍 Detailed check of Lilio product:`);
      console.log(`   - hasVariations: ${lilioProduct.hasVariations}`);
      console.log(`   - variations: ${JSON.stringify(lilioProduct.variations?.length)} items`);
      console.log(`   - variants: ${JSON.stringify(lilioProduct.variants?.length)} items`);
      
      if (lilioProduct.variations?.length > 0) {
        console.log(`   - Variations colors:`);
        lilioProduct.variations.forEach(v => {
          console.log(`     • ${v.color?.name}: ${v.color?.hex_code}`);
        });
      }
      
      if (lilioProduct.variants?.length > 0) {
        console.log(`   - Variants colors:`);
        lilioProduct.variants.forEach(v => {
          console.log(`     • ${v.color?.name}: ${v.color?.hex_code}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

diagnoseEmptyVariations();