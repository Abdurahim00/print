const fs = require('fs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017';

async function analyzeAndFixCategories() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('test');
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');
    const subcategoriesCollection = db.collection('subcategories');
    
    // Get all categories and subcategories
    const categories = await categoriesCollection.find({}).toArray();
    const subcategories = await subcategoriesCollection.find({}).toArray();
    
    console.log(`\n📊 Found ${categories.length} categories and ${subcategories.length} subcategories`);
    
    // Count products per category
    const categoryUsage = {};
    for (const cat of categories) {
      const count = await productsCollection.countDocuments({ 
        category: cat._id.toString() 
      });
      categoryUsage[cat.name] = {
        id: cat._id.toString(),
        count: count,
        slug: cat.slug
      };
    }
    
    // Count products per subcategory
    const subcategoryUsage = {};
    for (const subcat of subcategories) {
      const count = await productsCollection.countDocuments({ 
        subcategoryId: subcat._id.toString() 
      });
      subcategoryUsage[subcat.name] = {
        id: subcat._id.toString(),
        count: count,
        categoryId: subcat.categoryId,
        slug: subcat.slug
      };
    }
    
    // Print category usage
    console.log('\n📦 CATEGORY USAGE:');
    console.log('='.repeat(60));
    Object.entries(categoryUsage)
      .sort((a, b) => b[1].count - a[1].count)
      .forEach(([name, data]) => {
        console.log(`${name}: ${data.count} products`);
      });
    
    // Print subcategory usage
    console.log('\n📁 SUBCATEGORY USAGE (Top 20):');
    console.log('='.repeat(60));
    Object.entries(subcategoryUsage)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)
      .forEach(([name, data]) => {
        console.log(`${name}: ${data.count} products`);
      });
    
    // Find unused categories
    const unusedCategories = Object.entries(categoryUsage)
      .filter(([name, data]) => data.count === 0)
      .map(([name, data]) => ({ name, id: data.id }));
    
    // Find unused subcategories
    const unusedSubcategories = Object.entries(subcategoryUsage)
      .filter(([name, data]) => data.count === 0)
      .map(([name, data]) => ({ name, id: data.id }));
    
    console.log(`\n🗑️  UNUSED CATEGORIES (${unusedCategories.length}):`, unusedCategories.map(c => c.name));
    console.log(`\n🗑️  UNUSED SUBCATEGORIES (${unusedSubcategories.length}):`, unusedSubcategories.slice(0, 20).map(s => s.name));
    
    // Find products in "Other" or similar generic categories
    const otherCategoryIds = Object.entries(categoryUsage)
      .filter(([name]) => name.toLowerCase().includes('other') || name.toLowerCase().includes('misc'))
      .map(([name, data]) => data.id);
    
    console.log('\n🔍 Looking for products in "Other" categories...');
    const productsInOther = await productsCollection.find({
      category: { $in: otherCategoryIds }
    }).limit(100).toArray();
    
    console.log(`Found ${productsInOther.length} products in "Other" categories`);
    
    // Sample some products to see what's in "Other"
    if (productsInOther.length > 0) {
      console.log('\nSample products in "Other":');
      productsInOther.slice(0, 10).forEach(p => {
        console.log(`  - ${p.name} (URL: ${p.sourceUrl || 'N/A'})`);
      });
    }
    
    // Load products with extracted subcategories
    let productsWithSubcategories = [];
    if (fs.existsSync('products-with-complete-subcategories.json')) {
      productsWithSubcategories = JSON.parse(
        fs.readFileSync('products-with-complete-subcategories.json', 'utf8')
      );
      console.log(`\n✅ Loaded ${productsWithSubcategories.length} products with subcategory assignments`);
    }
    
    // Analyze which products are in wrong categories
    const categoryMismatches = [];
    for (const product of productsWithSubcategories.slice(0, 1000)) {
      if (product.extractedSubcategory && product.extractedSubcategory.startsWith('general-')) {
        categoryMismatches.push({
          name: product.name,
          currentCategory: product.category,
          suggestedSubcategory: product.extractedSubcategory,
          url: product.sourceUrl
        });
      }
    }
    
    console.log(`\n⚠️  Found ${categoryMismatches.length} products with generic categorization`);
    if (categoryMismatches.length > 0) {
      console.log('Sample mismatches:');
      categoryMismatches.slice(0, 5).forEach(m => {
        console.log(`  - ${m.name}`);
        console.log(`    Current: ${m.suggestedSubcategory}`);
        console.log(`    URL: ${m.url || 'N/A'}`);
      });
    }
    
    // Generate recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Remove unused categories:', unusedCategories.length);
    console.log('2. Remove unused subcategories:', unusedSubcategories.length);
    console.log('3. Products needing better categorization:', categoryMismatches.length);
    
    // Save analysis report
    const report = {
      timestamp: new Date().toISOString(),
      categories: {
        total: categories.length,
        unused: unusedCategories,
        usage: categoryUsage
      },
      subcategories: {
        total: subcategories.length,
        unused: unusedSubcategories.length,
        usage: Object.entries(subcategoryUsage)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 50)
          .map(([name, data]) => ({ name, ...data }))
      },
      productsInOther: productsInOther.length,
      recommendations: {
        removeCategories: unusedCategories,
        removeSubcategories: unusedSubcategories.slice(0, 100),
        recategorizeProducts: categoryMismatches.length
      }
    };
    
    fs.writeFileSync('category-analysis-report.json', JSON.stringify(report, null, 2));
    console.log('\n📁 Report saved to: category-analysis-report.json');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the analysis
console.log('🚀 Starting category analysis...\n');
analyzeAndFixCategories().catch(console.error);
