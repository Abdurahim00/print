// Fix specific product colors
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap-pro';

async function fixLilioProduct() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Find the Lilio product
    const product = await productsCollection.findOne({ 
      name: { $regex: /Lilio.*keramikmugg/i } 
    });

    if (product) {
      console.log('📦 Found product:', product.name);
      console.log('Current variations:');
      product.variations.forEach(v => {
        console.log(`  - ${v.color?.name}: ${v.color?.hex_code}`);
      });

      // Fix the colors
      const updates = {
        'Röd': '#FF0000',      // Red
        'Orange': '#FF851B',   // Orange (already correct)
        'Kungsblå': '#0074D9', // Royal Blue
        'Grå': '#808080',      // Gray (can stay)
        'Svart': '#000000',    // Black
      };

      product.variations.forEach(v => {
        if (v.color && updates[v.color.name]) {
          console.log(`  🎨 Updating ${v.color.name}: ${v.color.hex_code} → ${updates[v.color.name]}`);
          v.color.hex_code = updates[v.color.name];
        }
      });

      // Update in database
      await productsCollection.updateOne(
        { _id: product._id },
        { $set: { variations: product.variations } }
      );

      console.log('\n✅ Product updated successfully!');
      
      // Verify the update
      const updated = await productsCollection.findOne({ _id: product._id });
      console.log('\nUpdated variations:');
      updated.variations.forEach(v => {
        console.log(`  - ${v.color?.name}: ${v.color?.hex_code}`);
      });
    } else {
      console.log('❌ Product not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

fixLilioProduct();