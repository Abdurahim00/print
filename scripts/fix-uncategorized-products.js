const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixUncategorizedProducts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(process.env.MONGODB_DB || 'printwrap');
    const products = db.collection('products');
    const categories = db.collection('categories');

    // Get all categories
    const allCategories = await categories.find({}).toArray();
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id.toString();
    });

    console.log('\nAvailable categories:');
    Object.keys(categoryMap).forEach(name => {
      console.log(`  - ${name}: ${categoryMap[name]}`);
    });

    // Find all products with "uncategorized" or null categoryId
    const uncategorizedProducts = await products.find({
      $or: [
        { categoryId: "uncategorized" },
        { categoryId: null },
        { categoryId: { $exists: false } }
      ]
    }).toArray();

    console.log(`\nFound ${uncategorizedProducts.length} uncategorized products`);

    if (uncategorizedProducts.length === 0) {
      console.log('No uncategorized products found!');
      return;
    }

    // Category assignment rules based on product names
    const categoryRules = {
      'Bags': ['bag', 'väska', 'ryggsäck', 'backpack', 'kasse', 'tote', 'pouch', 'gymbag'],
      'Drinkware': ['mugg', 'mug', 'kopp', 'cup', 'glas', 'glass', 'flaska', 'bottle', 'termos'],
      'Apparel': ['shirt', 'tshirt', 't-shirt', 'hoodie', 'jacket', 'tröja', 'kläder'],
      'Office & Supplies': ['penna', 'pen', 'pencil', 'notebook', 'anteckningsbok', 'office'],
      'Tech Accessories': ['usb', 'cable', 'laddare', 'charger', 'powerbank', 'case', 'phone'],
      'Textiles': ['handduk', 'towel', 'textile', 'tyg', 'fabric', 'bomull', 'cotton'],
      'Promotional Items': ['promo', 'merchandise', 'merch', 'branded', 'logo'],
      'Accessories': ['keps', 'cap', 'hat', 'mössa', 'beanie', 'armband', 'bracelet'],
      'Safety': ['safety', 'säkerhet', 'protection', 'mask', 'gloves'],
      'Eco-friendly Products': ['eco', 'miljö', 'sustainable', 'återvin', 'recycle']
    };

    let updateCount = 0;
    const categoryCounts = {};

    for (const product of uncategorizedProducts) {
      let assignedCategory = null;
      
      if (product.name) {
        const nameLower = product.name.toLowerCase();
        
        // Try to match product name with category rules
        for (const [categoryName, keywords] of Object.entries(categoryRules)) {
          if (keywords.some(keyword => nameLower.includes(keyword))) {
            assignedCategory = categoryName;
            break;
          }
        }
      }

      // Default to "Other" if no match
      if (!assignedCategory) {
        assignedCategory = 'Other';
      }

      const categoryId = categoryMap[assignedCategory];
      
      if (categoryId) {
        await products.updateOne(
          { _id: product._id },
          { 
            $set: { 
              categoryId: categoryId,
              // Also ensure price is set
              price: product.price || product.basePrice || 100
            }
          }
        );
        
        updateCount++;
        categoryCounts[assignedCategory] = (categoryCounts[assignedCategory] || 0) + 1;
        
        if (updateCount % 100 === 0) {
          console.log(`  Processed ${updateCount} products...`);
        }
      }
    }

    console.log('\n=== Category Assignment Summary ===\n');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });
    console.log(`\nTotal products updated: ${updateCount}`);

    // Verify the results
    const stillUncategorized = await products.countDocuments({
      $or: [
        { categoryId: "uncategorized" },
        { categoryId: null },
        { categoryId: { $exists: false } }
      ]
    });
    console.log(`\nProducts still uncategorized: ${stillUncategorized}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

fixUncategorizedProducts();