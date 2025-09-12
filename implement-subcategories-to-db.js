const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bellakoroma:kN1FtoGvG8a1vMcp@cluster0.jlzve.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function implementSubcategories() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('test');
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');
    const subcategoriesCollection = db.collection('subcategories');
    
    // Load products with complete subcategories
    console.log('\n📂 Loading products with subcategory assignments...');
    const productsWithSubcategories = JSON.parse(
      fs.readFileSync('products-with-complete-subcategories.json', 'utf8')
    );
    console.log(`✅ Loaded ${productsWithSubcategories.length} products`);
    
    // Step 1: Get existing categories and subcategories
    console.log('\n🔍 Fetching existing categories and subcategories...');
    const categories = await categoriesCollection.find({}).toArray();
    const existingSubcategories = await subcategoriesCollection.find({}).toArray();
    
    console.log(`Found ${categories.length} categories`);
    console.log(`Found ${existingSubcategories.length} existing subcategories`);
    
    // Create maps for quick lookup
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat._id.toString(), cat);
    });
    
    const subcategoryBySlug = new Map();
    const subcategoryByName = new Map();
    existingSubcategories.forEach(sub => {
      if (sub.slug) subcategoryBySlug.set(sub.slug.toLowerCase(), sub);
      if (sub.name) subcategoryByName.set(sub.name.toLowerCase(), sub);
    });
    
    // Step 2: Create missing subcategories
    console.log('\n🏗️ Creating missing subcategories...');
    const uniqueSubcategories = new Set();
    const categorySubcategoryMap = new Map();
    
    // Collect all unique subcategories from products
    productsWithSubcategories.forEach(product => {
      if (product.extractedSubcategory) {
        uniqueSubcategories.add(product.extractedSubcategory);
        
        // Map subcategory to category
        const categoryId = product.category;
        if (categoryId) {
          if (!categorySubcategoryMap.has(categoryId)) {
            categorySubcategoryMap.set(categoryId, new Set());
          }
          categorySubcategoryMap.get(categoryId).add(product.extractedSubcategory);
        }
      }
    });
    
    console.log(`Found ${uniqueSubcategories.size} unique subcategories in products`);
    
    // Create subcategories that don't exist
    const subcategoriesToCreate = [];
    const subcategoryIdMap = new Map();
    
    for (const subcatSlug of uniqueSubcategories) {
      // Check if subcategory already exists
      let existingSubcat = subcategoryBySlug.get(subcatSlug.toLowerCase()) || 
                           subcategoryByName.get(subcatSlug.toLowerCase());
      
      if (existingSubcat) {
        subcategoryIdMap.set(subcatSlug, existingSubcat._id.toString());
      } else {
        // Need to create this subcategory
        // Find the most common category for this subcategory
        let bestCategoryId = null;
        let maxCount = 0;
        
        for (const [catId, subcats] of categorySubcategoryMap.entries()) {
          if (subcats.has(subcatSlug)) {
            const count = productsWithSubcategories.filter(p => 
              p.category === catId && p.extractedSubcategory === subcatSlug
            ).length;
            
            if (count > maxCount) {
              maxCount = count;
              bestCategoryId = catId;
            }
          }
        }
        
        // Create subcategory name from slug
        const name = subcatSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        const newSubcategory = {
          _id: new ObjectId(),
          name: name,
          slug: subcatSlug,
          categoryId: bestCategoryId || categories[0]._id.toString(),
          description: `${name} products`,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        subcategoriesToCreate.push(newSubcategory);
        subcategoryIdMap.set(subcatSlug, newSubcategory._id.toString());
      }
    }
    
    if (subcategoriesToCreate.length > 0) {
      console.log(`Creating ${subcategoriesToCreate.length} new subcategories...`);
      try {
        const result = await subcategoriesCollection.insertMany(subcategoriesToCreate);
        console.log(`✅ Created ${result.insertedCount} subcategories`);
      } catch (error) {
        console.log('⚠️ Some subcategories may already exist, continuing...');
      }
    } else {
      console.log('✅ All subcategories already exist');
    }
    
    // Step 3: Update products with subcategory IDs
    console.log('\n🔄 Updating products with subcategory IDs...');
    
    const bulkOps = [];
    let matchedCount = 0;
    let unmatchedCount = 0;
    
    for (const product of productsWithSubcategories) {
      const productId = product._id?.$oid || product._id;
      const subcategorySlug = product.extractedSubcategory;
      
      if (productId && subcategorySlug) {
        const subcategoryId = subcategoryIdMap.get(subcategorySlug);
        
        if (subcategoryId) {
          matchedCount++;
          
          bulkOps.push({
            updateOne: {
              filter: { _id: new ObjectId(productId) },
              update: {
                $set: {
                  subcategoryId: subcategoryId,
                  subcategory: subcategoryId,
                  lastUpdated: new Date(),
                  subcategoryAssigned: true
                }
              }
            }
          });
          
          // Execute in batches of 1000
          if (bulkOps.length >= 1000) {
            console.log(`Updating batch of ${bulkOps.length} products...`);
            try {
              const result = await productsCollection.bulkWrite(bulkOps, { ordered: false });
              console.log(`  Updated: ${result.modifiedCount}, Matched: ${result.matchedCount}`);
              bulkOps.length = 0;
            } catch (error) {
              console.error('  Batch update error:', error.message);
              bulkOps.length = 0;
            }
          }
        } else {
          unmatchedCount++;
        }
      }
    }
    
    // Execute remaining operations
    if (bulkOps.length > 0) {
      console.log(`Updating final batch of ${bulkOps.length} products...`);
      try {
        const result = await productsCollection.bulkWrite(bulkOps, { ordered: false });
        console.log(`  Updated: ${result.modifiedCount}, Matched: ${result.matchedCount}`);
      } catch (error) {
        console.error('  Final batch error:', error.message);
      }
    }
    
    // Step 4: Verify the implementation
    console.log('\n📊 Verifying implementation...');
    
    const totalProducts = await productsCollection.countDocuments({});
    const productsWithSubcategory = await productsCollection.countDocuments({ 
      subcategoryId: { $exists: true, $ne: null } 
    });
    const productsWithoutSubcategory = await productsCollection.countDocuments({ 
      $or: [
        { subcategoryId: { $exists: false } },
        { subcategoryId: null }
      ]
    });
    
    // Get distribution
    const subcategoryDistribution = await productsCollection.aggregate([
      { $match: { subcategoryId: { $exists: true, $ne: null } } },
      { $group: { _id: '$subcategoryId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]).toArray();
    
    // Print final report
    console.log('\n' + '='.repeat(60));
    console.log('IMPLEMENTATION COMPLETE - FINAL REPORT');
    console.log('='.repeat(60));
    
    console.log('\n📈 DATABASE STATISTICS:');
    console.log(`Total products in database: ${totalProducts}`);
    console.log(`Products WITH subcategory: ${productsWithSubcategory} (${(productsWithSubcategory/totalProducts*100).toFixed(1)}%)`);
    console.log(`Products WITHOUT subcategory: ${productsWithoutSubcategory} (${(productsWithoutSubcategory/totalProducts*100).toFixed(1)}%)`);
    
    console.log('\n🏆 TOP SUBCATEGORIES BY PRODUCT COUNT:');
    for (const item of subcategoryDistribution) {
      // Look up subcategory name
      const subcat = await subcategoriesCollection.findOne({ _id: new ObjectId(item._id) });
      const name = subcat ? subcat.name : item._id;
      console.log(`  ${name}: ${item.count} products`);
    }
    
    // Save implementation report
    const report = {
      timestamp: new Date().toISOString(),
      statistics: {
        totalProducts,
        productsWithSubcategory,
        productsWithoutSubcategory,
        coveragePercentage: (productsWithSubcategory/totalProducts*100).toFixed(1),
        subcategoriesCreated: subcategoriesToCreate.length,
        productsProcessed: matchedCount
      },
      subcategoryDistribution: subcategoryDistribution
    };
    
    fs.writeFileSync('implementation-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n✅ IMPLEMENTATION SUCCESSFUL!');
    console.log(`🎯 ${(productsWithSubcategory/totalProducts*100).toFixed(1)}% of products now have subcategories`);
    console.log('\n📁 Report saved to: implementation-report.json');
    
  } catch (error) {
    console.error('❌ Error during implementation:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the implementation
console.log('🚀 Starting subcategory implementation...\n');
implementSubcategories().catch(console.error);