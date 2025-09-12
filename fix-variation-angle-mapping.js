// Script to ensure variation images have proper angle mappings for design tool
const { MongoClient } = require('mongodb');

async function fixVariationAngleMappings() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://abdurrahman:rahmankhan11@merch-cluster.kxm38.mongodb.net/printwrap';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap');
    const collection = db.collection('products');
    
    // Find products with variations that have multiple images
    const products = await collection.find({
      'variations.images.1': { $exists: true } // Has at least 2 images
    }).toArray();
    
    console.log(`Found ${products.length} products with variation images to process`);
    
    let updatedCount = 0;
    let processedCount = 0;
    
    for (const product of products) {
      if (!product.variations || product.variations.length === 0) continue;
      
      let needsUpdate = false;
      const updatedVariations = product.variations.map(variation => {
        if (!variation.images || variation.images.length === 0) return variation;
        
        // Check if images already have angle mappings
        const hasAngles = variation.images.some(img => img.angle);
        
        if (!hasAngles && variation.images.length > 0) {
          // Assign default angles based on image position
          const angleOrder = ['front', 'back', 'left', 'right', 'material'];
          
          variation.images = variation.images.map((img, index) => {
            if (!img.angle && index < angleOrder.length) {
              needsUpdate = true;
              return {
                ...img,
                angle: angleOrder[index],
                is_primary: index === 0
              };
            }
            return img;
          });
        } else if (hasAngles) {
          // Ensure all images have angles (fill in missing ones)
          const usedAngles = new Set(variation.images.filter(img => img.angle).map(img => img.angle));
          const availableAngles = ['front', 'back', 'left', 'right', 'material'].filter(a => !usedAngles.has(a));
          
          variation.images = variation.images.map((img, index) => {
            if (!img.angle && availableAngles.length > 0) {
              needsUpdate = true;
              const angle = availableAngles.shift();
              return {
                ...img,
                angle: angle,
                is_primary: index === 0
              };
            }
            return img;
          });
        }
        
        return variation;
      });
      
      if (needsUpdate) {
        await collection.updateOne(
          { _id: product._id },
          { $set: { variations: updatedVariations } }
        );
        updatedCount++;
        
        console.log(`✅ Updated ${product.name} - Added angle mappings to variations`);
        
        // Show what was updated
        updatedVariations.forEach((v, idx) => {
          if (v.images && v.images.length > 0) {
            const angles = v.images.map(img => img.angle).filter(Boolean);
            if (angles.length > 0) {
              console.log(`   Variation ${idx + 1} (${v.color?.name || 'Unknown'}): ${angles.join(', ')}`);
            }
          }
        });
      }
      
      processedCount++;
      if (processedCount % 100 === 0) {
        console.log(`Processed ${processedCount}/${products.length} products...`);
      }
    }
    
    console.log(`\n✅ Completed! Updated ${updatedCount} products with angle mappings`);
    
    // Verify the updates
    const verifyProducts = await collection.find({
      'variations.images.angle': { $exists: true }
    }).limit(5).toArray();
    
    console.log(`\n📊 Verification - Products with angle mappings: ${verifyProducts.length}`);
    verifyProducts.forEach(p => {
      console.log(`  - ${p.name}`);
      if (p.variations && p.variations[0] && p.variations[0].images) {
        const angles = p.variations[0].images.map(img => img.angle).filter(Boolean);
        console.log(`    Angles: ${angles.join(', ')}`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
fixVariationAngleMappings().catch(console.error);