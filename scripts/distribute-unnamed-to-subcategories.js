const { MongoClient } = require('mongodb');
require('dotenv').config();

async function distributeUnnamedProducts() {
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

    // Get all unnamed products without subcategories
    const unnamedProducts = await products.find({
      $or: [
        { name: 'Unnamed Product' },
        { name: { $regex: /^unnamed/i } },
        { name: null },
        { name: '' }
      ],
      subcategoryId: { $in: [null, undefined] }
    }).toArray();

    console.log(`Found ${unnamedProducts.length} unnamed products without subcategories\n`);

    // Group unnamed products by their category
    const productsByCategory = {};
    for (const product of unnamedProducts) {
      if (product.categoryId) {
        if (!productsByCategory[product.categoryId]) {
          productsByCategory[product.categoryId] = [];
        }
        productsByCategory[product.categoryId].push(product);
      }
    }

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
        
        const countKey = `${category?.name || 'Unknown'} > ${subcategory.name} (${subcategory.swedishName})`;
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
    
    console.log('\n=== Products per Subcategory ===');
    Object.entries(subcategoryCounts)
      .sort((a, b) => b[1] - a[1])
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

    // Show subcategory counts for main categories
    console.log('\n=== Subcategory Distribution by Main Category ===');
    for (const cat of allCategories) {
      const catSubs = categorySubcategoryMap[cat._id.toString()] || [];
      if (catSubs.length > 0) {
        let totalInCategory = 0;
        for (const sub of catSubs) {
          const count = await products.countDocuments({ subcategoryId: sub._id.toString() });
          totalInCategory += count;
        }
        if (totalInCategory > 0) {
          console.log(`${cat.name}: ${totalInCategory} products across ${catSubs.length} subcategories`);
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Distributing unnamed products to subcategories...');
distributeUnnamedProducts();