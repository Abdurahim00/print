const { MongoClient } = require('mongodb');
require('dotenv').config();

async function setMetricPricing() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const categoriesCollection = db.collection('categories');
    
    // Set metric pricing for Apparel category
    const apparelResult = await categoriesCollection.updateOne(
      { name: 'Apparel' },
      { 
        $set: { 
          useMetricPricing: true,
          designUpchargePerCm2: 0.5, // 0.5 kr per square centimeter
          designUpchargePercent: 10 // Keep as fallback
        } 
      }
    );
    
    console.log('Updated Apparel category:', apparelResult.modifiedCount);
    
    // Set metric pricing for other designable categories
    const otherCategories = ['Accessories', 'Home & Living'];
    
    for (const categoryName of otherCategories) {
      const result = await categoriesCollection.updateOne(
        { name: categoryName, isDesignable: true },
        { 
          $set: { 
            useMetricPricing: true,
            designUpchargePerCm2: 0.3, // 0.3 kr per square centimeter for accessories and home items
            designUpchargePercent: 15 // Keep as fallback
          } 
        }
      );
      console.log(`Updated ${categoryName} category:`, result.modifiedCount);
    }
    
    // Verify the updates
    const updatedCategories = await categoriesCollection.find({
      isDesignable: true
    }).toArray();
    
    console.log('\n✅ Updated categories with metric pricing:');
    updatedCategories.forEach(cat => {
      console.log(`- ${cat.name}:`);
      console.log(`  useMetricPricing: ${cat.useMetricPricing}`);
      console.log(`  designUpchargePerCm2: ${cat.designUpchargePerCm2} kr/cm²`);
      console.log(`  designUpchargePercent: ${cat.designUpchargePercent}% (fallback)`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

setMetricPricing();