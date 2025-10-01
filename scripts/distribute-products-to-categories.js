const { MongoClient } = require('mongodb');
require('dotenv').config();

async function distributeProducts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db(process.env.MONGODB_DB || 'printwrap');
    const products = db.collection('products');
    const categories = db.collection('categories');

    // Get all categories
    const allCategories = await categories.find({}).toArray();
    console.log(`Found ${allCategories.length} categories`);

    // Get all products that need categorization
    const allProducts = await products.find({}).toArray();
    console.log(`Found ${allProducts.length} total products\n`);

    // Category assignment rules based on product names
    const categoryRules = {
      'Bags': ['väska', 'bag', 'ryggsäck', 'backpack', 'resväska', 'luggage', 'suitcase', 'kabinväska', 'swift'],
      'Apparel': ['shirt', 'tshirt', 't-shirt', 'hoodie', 'jacket', 'tröja', 'kläder', 'clothes'],
      'Drinkware': ['mugg', 'mug', 'kopp', 'cup', 'glas', 'glass', 'flaska', 'bottle'],
      'Office & Supplies': ['penna', 'pen', 'pencil', 'notebook', 'anteckningsbok', 'office'],
      'Tech Accessories': ['usb', 'cable', 'laddare', 'charger', 'powerbank', 'case', 'phone'],
      'Promotional Items': ['shopping', 'vagn', 'promo', 'merchandise', 'merch', 'branded'],
      'Accessories': ['keps', 'cap', 'hat', 'mössa', 'beanie', 'armband', 'bracelet'],
      'Safety': ['safety', 'säkerhet', 'protection', 'mask', 'gloves'],
      'Eco-friendly Products': ['eco', 'miljö', 'sustainable', 'återvin', 'recycle']
    };

    // Find matching category for each rule
    const categoryMap = {};
    for (const categoryName of Object.keys(categoryRules)) {
      const category = allCategories.find(c => c.name === categoryName);
      if (category) {
        categoryMap[categoryName] = category._id.toString();
      }
    }

    // Add Other category
    const otherCategory = allCategories.find(c => c.name === 'Other');
    if (otherCategory) {
      categoryMap['Other'] = otherCategory._id.toString();
    }

    // For unnamed products, distribute them evenly across categories
    const unnamedProducts = allProducts.filter(p => p.name === 'Unnamed Product');
    const namedProducts = allProducts.filter(p => p.name !== 'Unnamed Product');

    console.log(`Processing ${namedProducts.length} named products...`);
    
    const updates = [];
    const categoryCounts = {};

    // Process named products first
    for (const product of namedProducts) {
      let assignedCategory = null;
      const nameLower = product.name.toLowerCase();
      
      // Try to match product name with category rules
      for (const [categoryName, keywords] of Object.entries(categoryRules)) {
        if (keywords.some(keyword => nameLower.includes(keyword))) {
          assignedCategory = categoryName;
          break;
        }
      }

      // Default to Other if no match
      if (!assignedCategory || !categoryMap[assignedCategory]) {
        assignedCategory = 'Other';
      }

      const categoryId = categoryMap[assignedCategory];
      if (categoryId) {
        updates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { 
              $set: { 
                categoryId: categoryId,
                price: product.price || product.basePrice || 100
              }
            }
          }
        });
        categoryCounts[assignedCategory] = (categoryCounts[assignedCategory] || 0) + 1;
      }
    }

    // Distribute unnamed products evenly across main categories
    console.log(`\nDistributing ${unnamedProducts.length} unnamed products across categories...`);
    
    const mainCategories = ['Apparel', 'Bags', 'Drinkware', 'Office & Supplies', 'Tech Accessories', 'Promotional Items'];
    const availableMainCategories = mainCategories.filter(c => categoryMap[c]);
    
    if (availableMainCategories.length > 0) {
      unnamedProducts.forEach((product, index) => {
        const categoryName = availableMainCategories[index % availableMainCategories.length];
        const categoryId = categoryMap[categoryName];
        
        if (categoryId) {
          updates.push({
            updateOne: {
              filter: { _id: product._id },
              update: { 
                $set: { 
                  categoryId: categoryId,
                  price: product.price || product.basePrice || 100
                }
              }
            }
          });
          categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
        }
      });
    }

    // Execute updates in batches
    console.log(`\nExecuting ${updates.length} updates...`);
    const batchSize = 500;
    let processed = 0;
    
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, Math.min(i + batchSize, updates.length));
      const result = await products.bulkWrite(batch);
      processed += batch.length;
      console.log(`  Processed ${processed}/${updates.length} products (${result.modifiedCount} modified)`);
    }

    console.log('\n=== Category Assignment Summary ===');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} products`);
      });

    // Verify final counts
    console.log('\n=== Final Category Counts in Database ===');
    for (const cat of allCategories) {
      const count = await products.countDocuments({ categoryId: cat._id.toString() });
      if (count > 0) {
        console.log(`  ${cat.name}: ${count} products`);
      }
    }

    // Check if any products are still uncategorized
    const stillUncategorized = await products.countDocuments({
      $or: [
        { categoryId: 'uncategorized' },
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

console.log('Distributing products to categories...');
distributeProducts();