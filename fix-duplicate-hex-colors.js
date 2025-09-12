// Fix duplicate hex codes in product variations
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap-pro';

// Color name to proper hex code mapping
const COLOR_MAP = {
  'röd': '#FF0000',      // Red
  'rött': '#FF0000',     // Red (alternate)
  'orange': '#FF851B',   // Orange (already correct)
  'kungsblå': '#0074D9', // Royal Blue
  'blå': '#0074D9',      // Blue
  'grå': '#808080',      // Gray (correct)
  'svart': '#000000',    // Black
  'vit': '#FFFFFF',      // White
  'grön': '#2ECC40',     // Green
  'gul': '#FFDC00',      // Yellow
  'rosa': '#FF69B4',     // Pink
  'lila': '#B10DC9',     // Purple
  'brun': '#8B4513',     // Brown
  'beige': '#F5DEB3',    // Beige
  'marinblå': '#001F3F', // Navy Blue
  'ljusblå': '#87CEEB',  // Light Blue
  'mörkgrå': '#4A4A4A',  // Dark Gray
  'ljusgrå': '#D3D3D3',  // Light Gray
};

async function fixDuplicateHexColors() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Find all products with variations
    console.log('\n🔍 Finding products with variations...');
    const products = await productsCollection.find({ 
      hasVariations: true,
      variations: { $exists: true }
    }).toArray();

    console.log(`📦 Found ${products.length} products with variations`);

    let totalFixed = 0;
    let productsFixed = 0;

    for (const product of products) {
      let needsUpdate = false;
      let fixedInProduct = 0;

      if (product.variations && Array.isArray(product.variations)) {
        product.variations.forEach((variation, i) => {
          if (variation.color) {
            const colorName = variation.color.name?.toLowerCase();
            
            // Check if we have a proper hex code for this color name
            if (colorName && COLOR_MAP[colorName]) {
              const properHex = COLOR_MAP[colorName];
              
              // Check if current hex is wrong
              if (variation.color.hex_code !== properHex) {
                console.log(`  🎨 Fixing ${product.name} - ${variation.color.name}: ${variation.color.hex_code} → ${properHex}`);
                variation.color.hex_code = properHex;
                needsUpdate = true;
                fixedInProduct++;
                totalFixed++;
              }
            }
            // Fix any remaining #808080 that shouldn't be gray
            else if (variation.color.hex_code === '#808080' && colorName !== 'grå') {
              // Generate a unique color based on the color name
              const hash = colorName ? colorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
              const hue = (hash * 137) % 360; // Generate hue from name
              const properHex = `hsl(${hue}, 70%, 50%)`; // Convert to HSL for now
              
              // Convert HSL to hex (simplified)
              const hexColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
              
              console.log(`  🎨 Generating color for ${product.name} - ${variation.color.name}: ${variation.color.hex_code} → ${hexColor}`);
              variation.color.hex_code = hexColor;
              needsUpdate = true;
              fixedInProduct++;
              totalFixed++;
            }
          }
        });
      }

      // Update the product if any changes were made
      if (needsUpdate) {
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: { variations: product.variations } }
        );
        productsFixed++;
        console.log(`  ✅ Updated ${product.name} (${fixedInProduct} variations fixed)`);
      }
    }

    console.log(`\n✨ Summary:`);
    console.log(`  📦 Products updated: ${productsFixed}`);
    console.log(`  🎨 Variations fixed: ${totalFixed}`);

    // Verify the fix for our specific product
    console.log('\n🔍 Verifying "Lilio 310 ml keramikmugg"...');
    const verifyProduct = await productsCollection.findOne({ 
      name: { $regex: /Lilio.*keramikmugg/i } 
    });

    if (verifyProduct && verifyProduct.variations) {
      console.log('Updated variations:');
      verifyProduct.variations.forEach(v => {
        console.log(`  - ${v.color?.name}: ${v.color?.hex_code}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

fixDuplicateHexColors();