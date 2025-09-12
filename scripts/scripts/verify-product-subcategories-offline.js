const fs = require('fs');

async function verifyProductSubcategories() {
  try {
    // Load products from JSON file
    console.log('Loading products from backup file...');
    const productsData = JSON.parse(fs.readFileSync('products-backup-1757320722828.json', 'utf8'));
    console.log(`Total products loaded: ${productsData.length}`);
    
    // Analyze products
    const stats = {
      totalProducts: productsData.length,
      productsWithCategory: 0,
      productsWithoutCategory: 0,
      productsWithSubcategory: 0,
      productsWithoutSubcategory: 0,
      productsWithMultipleSubcategories: 0,
      productsByCategory: {},
      productsBySubcategory: {},
      categoriesFound: new Set(),
      subcategoriesFound: new Set(),
      issues: []
    };
    
    const productsWithoutSubcategory = [];
    const productsWithMultipleSubcategories = [];
    const categorySubcategoryPairs = new Map();
    
    for (const product of productsData) {
      const productId = product._id?.$oid || product._id || product.id;
      const productName = product.name || 'Unnamed Product';
      
      // Check category
      const categoryId = product.categoryId?.toString();
      if (categoryId) {
        stats.productsWithCategory++;
        stats.categoriesFound.add(categoryId);
        
        // Count by category
        if (!stats.productsByCategory[categoryId]) {
          stats.productsByCategory[categoryId] = 0;
        }
        stats.productsByCategory[categoryId]++;
      } else {
        stats.productsWithoutCategory++;
        stats.issues.push({
          productId,
          productName,
          issue: 'No category assigned'
        });
      }
      
      // Check subcategory (handle both single and multiple subcategories)
      let subcategoryIds = [];
      
      if (product.subcategoryId) {
        subcategoryIds.push(product.subcategoryId.toString());
      }
      
      if (product.subcategoryIds && Array.isArray(product.subcategoryIds)) {
        subcategoryIds = subcategoryIds.concat(product.subcategoryIds.map(id => id.toString()));
      }
      
      // Remove duplicates
      subcategoryIds = [...new Set(subcategoryIds)];
      
      if (subcategoryIds.length > 0) {
        stats.productsWithSubcategory++;
        
        if (subcategoryIds.length > 1) {
          stats.productsWithMultipleSubcategories++;
          productsWithMultipleSubcategories.push({
            productId,
            productName,
            categoryId,
            subcategoryIds,
            count: subcategoryIds.length
          });
        }
        
        // Track all subcategories
        subcategoryIds.forEach(subId => {
          stats.subcategoriesFound.add(subId);
          
          // Count by subcategory
          if (!stats.productsBySubcategory[subId]) {
            stats.productsBySubcategory[subId] = 0;
          }
          stats.productsBySubcategory[subId]++;
          
          // Track category-subcategory pairs
          if (categoryId) {
            const pairKey = `${categoryId}::${subId}`;
            if (!categorySubcategoryPairs.has(pairKey)) {
              categorySubcategoryPairs.set(pairKey, 0);
            }
            categorySubcategoryPairs.set(pairKey, categorySubcategoryPairs.get(pairKey) + 1);
          }
        });
      } else {
        stats.productsWithoutSubcategory++;
        productsWithoutSubcategory.push({
          productId,
          productName,
          categoryId: categoryId || 'No Category'
        });
      }
    }
    
    // Print detailed report
    console.log('\n========================================');
    console.log('PRODUCT SUBCATEGORY VERIFICATION REPORT');
    console.log('========================================\n');
    
    console.log('OVERALL STATISTICS:');
    console.log(`Total Products: ${stats.totalProducts}`);
    console.log(`Unique Categories Found: ${stats.categoriesFound.size}`);
    console.log(`Unique Subcategories Found: ${stats.subcategoriesFound.size}`);
    console.log(`\nProducts with Category: ${stats.productsWithCategory} (${(stats.productsWithCategory/stats.totalProducts*100).toFixed(2)}%)`);
    console.log(`Products without Category: ${stats.productsWithoutCategory} (${(stats.productsWithoutCategory/stats.totalProducts*100).toFixed(2)}%)`);
    console.log(`\nProducts with Subcategory: ${stats.productsWithSubcategory} (${(stats.productsWithSubcategory/stats.totalProducts*100).toFixed(2)}%)`);
    console.log(`Products without Subcategory: ${stats.productsWithoutSubcategory} (${(stats.productsWithoutSubcategory/stats.totalProducts*100).toFixed(2)}%)`);
    console.log(`Products with Multiple Subcategories: ${stats.productsWithMultipleSubcategories}`);
    
    // Show top categories by product count
    console.log('\n\nTOP 15 CATEGORIES BY PRODUCT COUNT:');
    const sortedCategories = Object.entries(stats.productsByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
    
    sortedCategories.forEach(([catId, count], index) => {
      console.log(`  ${index + 1}. Category ${catId}: ${count} products (${(count/stats.totalProducts*100).toFixed(2)}%)`);
    });
    
    // Show top subcategories by product count
    if (Object.keys(stats.productsBySubcategory).length > 0) {
      console.log('\n\nTOP 15 SUBCATEGORIES BY PRODUCT COUNT:');
      const sortedSubcategories = Object.entries(stats.productsBySubcategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);
      
      sortedSubcategories.forEach(([subId, count], index) => {
        console.log(`  ${index + 1}. Subcategory ${subId}: ${count} products`);
      });
    }
    
    // Show products with multiple subcategories
    if (productsWithMultipleSubcategories.length > 0) {
      console.log('\n\n📋 PRODUCTS WITH MULTIPLE SUBCATEGORIES:');
      console.log(`Found ${productsWithMultipleSubcategories.length} products with multiple subcategories`);
      
      // Show first 10 examples
      productsWithMultipleSubcategories.slice(0, 10).forEach(product => {
        console.log(`  - ${product.productName} (ID: ${product.productId})`);
        console.log(`    ${product.count} subcategories: ${product.subcategoryIds.join(', ')}`);
      });
      
      if (productsWithMultipleSubcategories.length > 10) {
        console.log(`  ... and ${productsWithMultipleSubcategories.length - 10} more`);
      }
    }
    
    // Show products without subcategory
    if (productsWithoutSubcategory.length > 0) {
      console.log('\n\n⚠️ PRODUCTS WITHOUT SUBCATEGORY:');
      console.log(`Found ${productsWithoutSubcategory.length} products without any subcategory`);
      
      // Group by category
      const byCategory = {};
      productsWithoutSubcategory.forEach(product => {
        const catId = product.categoryId;
        if (!byCategory[catId]) {
          byCategory[catId] = 0;
        }
        byCategory[catId]++;
      });
      
      console.log('\nDistribution by category:');
      Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([catId, count]) => {
          console.log(`  Category ${catId}: ${count} products without subcategory`);
        });
      
      // Show some examples
      console.log('\nExample products without subcategory:');
      productsWithoutSubcategory.slice(0, 5).forEach(product => {
        console.log(`  - ${product.productName} (ID: ${product.productId}, Category: ${product.categoryId})`);
      });
    }
    
    // Analyze category-subcategory relationships
    console.log('\n\nCATEGORY-SUBCATEGORY RELATIONSHIPS:');
    const categorySubcategoryMap = new Map();
    
    categorySubcategoryPairs.forEach((count, pairKey) => {
      const [catId, subId] = pairKey.split('::');
      if (!categorySubcategoryMap.has(catId)) {
        categorySubcategoryMap.set(catId, new Set());
      }
      categorySubcategoryMap.get(catId).add(subId);
    });
    
    console.log(`Unique category-subcategory pairs: ${categorySubcategoryPairs.size}`);
    console.log('\nSubcategories per category:');
    
    const categoriesBySubcategoryCount = Array.from(categorySubcategoryMap.entries())
      .map(([catId, subs]) => ({ catId, subcategoryCount: subs.size }))
      .sort((a, b) => b.subcategoryCount - a.subcategoryCount)
      .slice(0, 10);
    
    categoriesBySubcategoryCount.forEach(({ catId, subcategoryCount }) => {
      const productCount = stats.productsByCategory[catId] || 0;
      console.log(`  Category ${catId}: ${subcategoryCount} subcategories, ${productCount} products`);
    });
    
    // Save detailed report
    console.log('\n\nSaving detailed report...');
    
    const report = {
      stats: {
        ...stats,
        categoriesFound: Array.from(stats.categoriesFound),
        subcategoriesFound: Array.from(stats.subcategoriesFound)
      },
      productsWithoutSubcategory: productsWithoutSubcategory.slice(0, 100), // First 100 for brevity
      productsWithMultipleSubcategories: productsWithMultipleSubcategories.slice(0, 100),
      categorySubcategoryPairs: Object.fromEntries(categorySubcategoryPairs),
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync('subcategory-verification-report.json', JSON.stringify(report, null, 2));
    console.log('Detailed report saved to: subcategory-verification-report.json');
    
    // Summary
    console.log('\n========================================');
    console.log('SUMMARY:');
    console.log('========================================');
    
    const percentageWithSubcategory = (stats.productsWithSubcategory / stats.totalProducts * 100).toFixed(2);
    
    if (stats.productsWithoutSubcategory === 0) {
      console.log('✅ All products have subcategories assigned!');
    } else {
      console.log(`❌ ${stats.productsWithoutSubcategory} products (${(stats.productsWithoutSubcategory/stats.totalProducts*100).toFixed(2)}%) need subcategory assignment`);
      console.log('\n📊 Current Status:');
      console.log(`  ✅ ${percentageWithSubcategory}% of products have subcategories`);
      console.log(`  ❌ ${(100 - parseFloat(percentageWithSubcategory)).toFixed(2)}% of products need subcategory assignment`);
      
      if (stats.productsWithoutSubcategory > 0) {
        console.log('\nTo fix this, you can:');
        console.log('1. Run a script to automatically assign subcategories based on product names/descriptions');
        console.log('2. Manually review and assign subcategories through the admin interface');
        console.log('3. Use bulk import with proper subcategory mappings');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the verification
verifyProductSubcategories();