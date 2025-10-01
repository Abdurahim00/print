const { MongoClient } = require('mongodb');
require('dotenv').config();

async function setDesignUpcharge() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap');
    const categoriesCollection = db.collection('categories');
    
    // Set default design upcharge percentage for all categories
    // You can customize these values per category
    const defaultUpcharges = {
      'apparel': 25,        // 25% max upcharge for apparel with full design
      't-shirts': 25,
      'hoodies': 30,        // 30% for hoodies
      'accessories': 20,    // 20% for accessories
      'bags': 35,           // 35% for bags
      'mugs': 15,           // 15% for mugs
      'default': 20         // Default 20% for any other category
    };
    
    // Get all categories
    const categories = await categoriesCollection.find({}).toArray();
    console.log(`Found ${categories.length} categories`);
    
    for (const category of categories) {
      // Determine upcharge based on category name or type
      let upchargePercent = defaultUpcharges.default;
      
      const categoryNameLower = category.name?.toLowerCase() || '';
      
      // Check for specific category types
      if (categoryNameLower.includes('shirt') || categoryNameLower.includes('tee')) {
        upchargePercent = defaultUpcharges['t-shirts'];
      } else if (categoryNameLower.includes('hood')) {
        upchargePercent = defaultUpcharges['hoodies'];
      } else if (categoryNameLower.includes('bag')) {
        upchargePercent = defaultUpcharges['bags'];
      } else if (categoryNameLower.includes('mug') || categoryNameLower.includes('cup')) {
        upchargePercent = defaultUpcharges['mugs'];
      } else if (categoryNameLower.includes('accessor')) {
        upchargePercent = defaultUpcharges['accessories'];
      } else if (categoryNameLower.includes('apparel') || categoryNameLower.includes('cloth')) {
        upchargePercent = defaultUpcharges['apparel'];
      }
      
      // Update the category with design upcharge
      const result = await categoriesCollection.updateOne(
        { _id: category._id },
        { 
          $set: { 
            designUpchargePercent: upchargePercent,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`✓ Updated ${category.name}: ${upchargePercent}% design upcharge`);
    }
    
    console.log('\n✅ All categories updated with design upcharge percentages!');
    
    // Show summary
    const updatedCategories = await categoriesCollection.find({}).toArray();
    console.log('\n📊 Summary:');
    updatedCategories.forEach(cat => {
      console.log(`   ${cat.name}: ${cat.designUpchargePercent}%`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

setDesignUpcharge();