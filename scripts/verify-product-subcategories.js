const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bellakoroma:kN1FtoGvG8a1vMcp@cluster0.jlzve.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function verifyProductSubcategories() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('test');
    const categoriesCollection = db.collection('categories');
    const subcategoriesCollection = db.collection('subcategories');
    
    // Load products from JSON file
    console.log('Loading products from backup file...');
    const productsData = JSON.parse(fs.readFileSync('products-backup-1757320722828.json', 'utf8'));
    console.log(`Total products loaded: ${productsData.length}`);
    
    // Get all categories and subcategories from database
    const categories = await categoriesCollection.find({}).toArray();
    const subcategories = await subcategoriesCollection.find({}).toArray();
    
    console.log(`Total categories in DB: ${categories.length}`);
    console.log(`Total subcategories in DB: ${subcategories.length}`);
    
    // Create maps for quick lookup
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat._id.toString(), cat);
      categoryMap.set(cat.id, cat);
    });
    
    const subcategoryMap = new Map();
    const subcategoriesByCategoryId = new Map();
    
    subcategories.forEach(sub => {
      subcategoryMap.set(sub._id.toString(), sub);
      subcategoryMap.set(sub.id, sub);
      
      // Group subcategories by category
      const catId = sub.categoryId?.toString();
      if (catId) {
        if (!subcategoriesByCategoryId.has(catId)) {
          subcategoriesByCategoryId.set(catId, []);
        }
        subcategoriesByCategoryId.get(catId).push(sub);
      }
    });
    
    // Analyze products
    const stats = {
      totalProducts: productsData.length,
      productsWithCategory: 0,
      productsWithoutCategory: 0,
      productsWithSubcategory: 0,
      productsWithoutSubcategory: 0,
      productsWithValidSubcategory: 0,
      productsWithInvalidSubcategory: 0,
      productsWithMismatchedSubcategory: 0,
      productsByCategory: {},
      productsBySubcategory: {},
      issues: []
    };
    
    const misplacedProducts = [];
    const productsWithoutSubcategory = [];
    
    for (const product of productsData) {
      const productId = product._id?.$oid || product._id || product.id;
      const productName = product.name || 'Unnamed Product';
      
      // Check category
      const categoryId = product.categoryId?.toString();
      if (categoryId) {
        stats.productsWithCategory++;
        const category = categoryMap.get(categoryId);
        
        if (category) {
          const catName = category.name || categoryId;
          stats.productsByCategory[catName] = (stats.productsByCategory[catName] || 0) + 1;
        }
      } else {
        stats.productsWithoutCategory++;
        stats.issues.push({
          productId,
          productName,
          issue: 'No category assigned'
        });
      }
      
      // Check subcategory
      const subcategoryId = product.subcategoryId?.toString();
      if (subcategoryId) {
        stats.productsWithSubcategory++;
        const subcategory = subcategoryMap.get(subcategoryId);
        
        if (subcategory) {
          stats.productsWithValidSubcategory++;
          const subName = subcategory.name || subcategoryId;
          stats.productsBySubcategory[subName] = (stats.productsBySubcategory[subName] || 0) + 1;
          
          // Verify subcategory belongs to the correct category
          if (categoryId && subcategory.categoryId?.toString() !== categoryId) {
            stats.productsWithMismatchedSubcategory++;
            misplacedProducts.push({
              productId,
              productName,
              categoryId,
              subcategoryId,
              expectedCategoryId: subcategory.categoryId?.toString(),
              issue: 'Subcategory belongs to different category'
            });
          }
        } else {
          stats.productsWithInvalidSubcategory++;
          stats.issues.push({
            productId,
            productName,
            issue: `Invalid subcategory ID: ${subcategoryId}`
          });
        }
      } else {
        stats.productsWithoutSubcategory++;
        productsWithoutSubcategory.push({
          productId,
          productName,
          categoryId,
          categoryName: categoryId ? (categoryMap.get(categoryId)?.name || 'Unknown') : 'No Category'
        });
      }
    }
    
    // Print detailed report
    console.log('\n========================================');
    console.log('PRODUCT SUBCATEGORY VERIFICATION REPORT');
    console.log('========================================\n');
    
    console.log('OVERALL STATISTICS:');
    console.log(`Total Products: ${stats.totalProducts}`);
    console.log(`Products with Category: ${stats.productsWithCategory} (${(stats.productsWithCategory/stats.totalProducts*100).toFixed(2)}%)`);
    console.log(`Products without Category: ${stats.productsWithoutCategory} (${(stats.productsWithoutCategory/stats.totalProducts*100).toFixed(2)}%)`);
    console.log(`Products with Subcategory: ${stats.productsWithSubcategory} (${(stats.productsWithSubcategory/stats.totalProducts*100).toFixed(2)}%)`);
    console.log(`Products without Subcategory: ${stats.productsWithoutSubcategory} (${(stats.productsWithoutSubcategory/stats.totalProducts*100).toFixed(2)}%)`);
    
    if (stats.productsWithSubcategory > 0) {
      console.log(`\nSUBCATEGORY VALIDATION:`);
      console.log(`Valid Subcategories: ${stats.productsWithValidSubcategory} (${(stats.productsWithValidSubcategory/stats.productsWithSubcategory*100).toFixed(2)}%)`);
      console.log(`Invalid Subcategories: ${stats.productsWithInvalidSubcategory} (${(stats.productsWithInvalidSubcategory/stats.productsWithSubcategory*100).toFixed(2)}%)`);
      console.log(`Mismatched Category-Subcategory: ${stats.productsWithMismatchedSubcategory}`);
    }
    
    // Show distribution by category
    console.log('\n\nPRODUCTS BY CATEGORY:');
    const sortedCategories = Object.entries(stats.productsByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    sortedCategories.forEach(([catName, count]) => {
      console.log(`  ${catName}: ${count} products`);
    });
    
    if (Object.keys(stats.productsByCategory).length > 10) {
      console.log(`  ... and ${Object.keys(stats.productsByCategory).length - 10} more categories`);
    }
    
    // Show distribution by subcategory
    if (Object.keys(stats.productsBySubcategory).length > 0) {
      console.log('\n\nTOP SUBCATEGORIES BY PRODUCT COUNT:');
      const sortedSubcategories = Object.entries(stats.productsBySubcategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      sortedSubcategories.forEach(([subName, count]) => {
        console.log(`  ${subName}: ${count} products`);
      });
      
      if (Object.keys(stats.productsBySubcategory).length > 10) {
        console.log(`  ... and ${Object.keys(stats.productsBySubcategory).length - 10} more subcategories`);
      }
    }
    
    // Show issues
    if (misplacedProducts.length > 0) {
      console.log('\n\n⚠️ MISPLACED PRODUCTS (Wrong Category-Subcategory Match):');
      console.log(`Found ${misplacedProducts.length} products with mismatched category-subcategory`);
      
      // Show first 5 examples
      misplacedProducts.slice(0, 5).forEach(product => {
        console.log(`  - ${product.productName} (ID: ${product.productId})`);
        console.log(`    Current Category: ${product.categoryId}, Subcategory's Category: ${product.expectedCategoryId}`);
      });
      
      if (misplacedProducts.length > 5) {
        console.log(`  ... and ${misplacedProducts.length - 5} more`);
      }
    }
    
    if (productsWithoutSubcategory.length > 0) {
      console.log('\n\n⚠️ PRODUCTS WITHOUT SUBCATEGORY:');
      console.log(`Found ${productsWithoutSubcategory.length} products without subcategory`);
      
      // Group by category
      const byCategory = {};
      productsWithoutSubcategory.forEach(product => {
        const catName = product.categoryName;
        if (!byCategory[catName]) {
          byCategory[catName] = 0;
        }
        byCategory[catName]++;
      });
      
      console.log('\nDistribution by category:');
      Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([catName, count]) => {
          console.log(`  ${catName}: ${count} products`);
        });
    }
    
    // Save detailed reports
    console.log('\n\nSaving detailed reports...');
    
    fs.writeFileSync('subcategory-verification-report.json', JSON.stringify({
      stats,
      misplacedProducts,
      productsWithoutSubcategory: productsWithoutSubcategory.slice(0, 1000), // Limit to first 1000
      timestamp: new Date().toISOString()
    }, null, 2));
    
    console.log('Report saved to: subcategory-verification-report.json');
    
    // Summary
    console.log('\n========================================');
    console.log('SUMMARY:');
    console.log('========================================');
    
    if (stats.productsWithoutSubcategory === 0 && stats.productsWithMismatchedSubcategory === 0) {
      console.log('✅ All products are correctly placed in their subcategories!');
    } else {
      console.log('❌ Issues found:');
      if (stats.productsWithoutSubcategory > 0) {
        console.log(`  - ${stats.productsWithoutSubcategory} products need subcategory assignment`);
      }
      if (stats.productsWithMismatchedSubcategory > 0) {
        console.log(`  - ${stats.productsWithMismatchedSubcategory} products have mismatched category-subcategory`);
      }
      if (stats.productsWithInvalidSubcategory > 0) {
        console.log(`  - ${stats.productsWithInvalidSubcategory} products have invalid subcategory IDs`);
      }
      console.log('\nRun the fix script to correct these issues.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the verification
verifyProductSubcategories();