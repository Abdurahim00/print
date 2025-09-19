const { MongoClient } = require('mongodb');
require('dotenv').config();

async function distributeAllProducts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('printwrap-pro');
    const products = db.collection('products');
    const categories = db.collection('categories');
    const subcategories = db.collection('subcategories');

    // Get all categories and subcategories
    const allCategories = await categories.find({}).toArray();
    const allSubcategories = await subcategories.find({}).toArray();
    
    console.log(`Found ${allCategories.length} categories`);
    console.log(`Found ${allSubcategories.length} subcategories`);

    // Create a map of categories to their subcategories
    const categorySubcategoryMap = {};
    for (const cat of allCategories) {
      const catSubs = allSubcategories.filter(sub => sub.categoryId === cat._id.toString());
      if (catSubs.length > 0) {
        categorySubcategoryMap[cat._id.toString()] = catSubs;
      }
    }

    // Get all products without subcategories
    const productsWithoutSub = await products.find({
      $or: [
        { subcategoryId: null },
        { subcategoryId: { $exists: false } }
      ]
    }).toArray();

    console.log(`Found ${productsWithoutSub.length} products without subcategories\n`);

    // Group products by their category
    const productsByCategory = {};
    let noCategoryCount = 0;
    
    for (const product of productsWithoutSub) {
      if (product.categoryId) {
        if (!productsByCategory[product.categoryId]) {
          productsByCategory[product.categoryId] = [];
        }
        productsByCategory[product.categoryId].push(product);
      } else {
        noCategoryCount++;
      }
    }

    console.log(`Products without category: ${noCategoryCount}`);

    const updates = [];
    const subcategoryCounts = {};

    // Distribute products evenly within each category's subcategories
    for (const [categoryId, categoryProducts] of Object.entries(productsByCategory)) {
      const subcategoriesForCategory = categorySubcategoryMap[categoryId];
      
      if (!subcategoriesForCategory || subcategoriesForCategory.length === 0) {
        console.log(`No subcategories found for category ${categoryId}, skipping ${categoryProducts.length} products`);
        continue;
      }

      const category = allCategories.find(c => c._id.toString() === categoryId);
      console.log(`\nDistributing ${categoryProducts.length} products in category: ${category?.name || categoryId}`);
      console.log(`Available subcategories: ${subcategoriesForCategory.length}`);
      
      // Show the subcategories
      subcategoriesForCategory.forEach(sub => {
        console.log(`  - ${sub.name}`);
      });

      // Distribute evenly across subcategories
      categoryProducts.forEach((product, index) => {
        const subcategory = subcategoriesForCategory[index % subcategoriesForCategory.length];
        
        updates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { 
              $set: { 
                subcategoryId: subcategory._id.toString(),
                subcategoryIds: [subcategory._id.toString()]
              }
            }
          }
        });
        
        const countKey = `${category?.name || 'Unknown'} > ${subcategory.name}`;
        subcategoryCounts[countKey] = (subcategoryCounts[countKey] || 0) + 1;
      });
    }

    // Execute updates in batches
    if (updates.length > 0) {
      console.log(`\nExecuting ${updates.length} subcategory assignments...`);
      const batchSize = 500;
      let processed = 0;
      
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, Math.min(i + batchSize, updates.length));
        const result = await products.bulkWrite(batch);
        processed += batch.length;
        console.log(`  Processed ${processed}/${updates.length} products (${result.modifiedCount} modified)`);
      }
    }

    console.log('\n=== Distribution Summary ===');
    console.log(`Total products distributed: ${updates.length}`);
    console.log(`Products without category (skipped): ${noCategoryCount}`);
    
    console.log('\n=== Products per Subcategory ===');
    Object.entries(subcategoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .forEach(([subcategory, count]) => {
        console.log(`  ${subcategory}: ${count} products`);
      });

    // Final verification
    const totalWithSubcategories = await products.countDocuments({
      subcategoryId: { $exists: true, $ne: null }
    });
    const totalWithoutSubcategories = await products.countDocuments({
      $or: [
        { subcategoryId: null },
        { subcategoryId: { $exists: false } }
      ]
    });
    
    console.log('\n=== Final Status ===');
    console.log(`Products WITH subcategories: ${totalWithSubcategories}`);
    console.log(`Products WITHOUT subcategories: ${totalWithoutSubcategories}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Distributing all products to subcategories...');
distributeAllProducts();