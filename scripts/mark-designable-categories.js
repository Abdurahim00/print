const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

// Categories that should be designable (typically apparel, accessories, promotional items)
const DESIGNABLE_CATEGORY_PATTERNS = [
  // Apparel
  /t-shirt/i,
  /shirt/i,
  /hoodie/i,
  /sweatshirt/i,
  /jacket/i,
  /cap/i,
  /hat/i,
  /beanie/i,
  /apparel/i,
  /clothing/i,
  /wear/i,
  /textile/i,
  
  // Accessories & Bags
  /bag/i,
  /tote/i,
  /backpack/i,
  /pouch/i,
  /case/i,
  /wallet/i,
  /purse/i,
  /ryggsäck/i, // Swedish for backpack
  /kasse/i, // Swedish for bag
  /väska/i, // Swedish for bag
  
  // Drinkware
  /mug/i,
  /cup/i,
  /bottle/i,
  /tumbler/i,
  /glass/i,
  /thermos/i,
  /flask/i,
  
  // Office & Stationery
  /notebook/i,
  /journal/i,
  /pen/i,
  /pencil/i,
  /mousepad/i,
  /mouse pad/i,
  
  // Promotional Items
  /lanyard/i,
  /keychain/i,
  /badge/i,
  /sticker/i,
  /decal/i,
  /poster/i,
  /banner/i,
  /flag/i,
  
  // Phone & Tech
  /phone case/i,
  /phone cover/i,
  /laptop/i,
  /tablet/i,
  /tech/i,
  
  // Home & Living
  /pillow/i,
  /cushion/i,
  /blanket/i,
  /towel/i,
  /apron/i,
  /coaster/i,
  
  // Sports & Outdoor
  /sport/i,
  /gym/i,
  /yoga/i,
  /beach/i,
  /outdoor/i,
  
  // Other common designable items
  /custom/i,
  /personalize/i,
  /print/i,
  /design/i
];

async function markDesignableCategories() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'printwrap');
    const categories = db.collection('categories');
    
    // Get all categories
    const allCategories = await categories.find({}).toArray();
    
    console.log(`\n📋 Found ${allCategories.length} total categories\n`);
    console.log('Analyzing categories for designability...\n');
    console.log('=' .repeat(60));
    
    let updatedCount = 0;
    let alreadyDesignableCount = 0;
    
    for (const category of allCategories) {
      // Check if category name matches any designable pattern
      const isDesignable = DESIGNABLE_CATEGORY_PATTERNS.some(pattern => 
        pattern.test(category.name) || 
        (category.description && pattern.test(category.description))
      );
      
      if (isDesignable) {
        if (category.isDesignable) {
          console.log(`✅ Already designable: ${category.name}`);
          alreadyDesignableCount++;
        } else {
          // Update category to be designable
          const result = await categories.updateOne(
            { _id: category._id },
            { 
              $set: { 
                isDesignable: true,
                designableAreas: ['front', 'back'],
                designTechniques: ['DTG', 'Embroidery', 'Vinyl'],
                designUpchargePercent: 20, // 20% upcharge for custom designs
                designUpchargePerCm2: 0.05, // $0.05 per cm²
                useMetricPricing: false,
                updatedAt: new Date()
              } 
            }
          );
          
          if (result.modifiedCount > 0) {
            console.log(`🎨 Marked as designable: ${category.name}`);
            updatedCount++;
          }
        }
      } else {
        if (category.isDesignable) {
          console.log(`⚠️  Currently designable but doesn't match patterns: ${category.name}`);
        } else {
          console.log(`⬜ Not designable: ${category.name}`);
        }
      }
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('\n📊 Summary:');
    console.log(`- Total categories: ${allCategories.length}`);
    console.log(`- Already designable: ${alreadyDesignableCount}`);
    console.log(`- Newly marked as designable: ${updatedCount}`);
    console.log(`- Total designable now: ${alreadyDesignableCount + updatedCount}`);
    
    // Verify the changes
    const designableCategories = await categories.find({ isDesignable: true }).toArray();
    console.log('\n🎨 All designable categories:');
    designableCategories.forEach(cat => {
      console.log(`  - ${cat.name} (ID: ${cat._id})`);
    });
    
    // Count products in designable categories
    const products = db.collection('products');
    const designableCategoryIds = designableCategories.map(cat => cat._id.toString());
    const designableProductCount = await products.countDocuments({
      categoryId: { $in: designableCategoryIds }
    });
    
    console.log(`\n📦 Total products in designable categories: ${designableProductCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

markDesignableCategories();