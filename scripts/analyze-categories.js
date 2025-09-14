const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'printwrap';

async function analyzeCategories() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const categoriesCollection = db.collection('categories');
    const subcategoriesCollection = db.collection('subcategories');
    const productsCollection = db.collection('products');

    // Get all categories
    const allCategories = await categoriesCollection.find({}).toArray();
    console.log(`\n📊 Found ${allCategories.length} total categories\n`);

    console.log('CATEGORIES ANALYSIS:');
    console.log('=' .repeat(80));

    for (const category of allCategories) {
      // Count products in this category
      const productCount = await productsCollection.countDocuments({
        $or: [
          { categoryId: category.id },
          { categoryId: category._id?.toString() },
          { category: category.name }
        ]
      });

      // Get subcategories for this category
      const subcategories = await subcategoriesCollection.find({
        $or: [
          { categoryId: category.id },
          { categoryId: category._id?.toString() }
        ]
      }).toArray();

      console.log(`\n📁 Category: "${category.name}" (ID: ${category.id || category._id})`);
      console.log(`   Status: ${category.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   Direct products: ${productCount}`);
      console.log(`   Subcategories: ${subcategories.length}`);

      if (subcategories.length > 0) {
        console.log('   Subcategory breakdown:');

        let totalSubcategoryProducts = 0;
        for (const sub of subcategories) {
          const subProductCount = await productsCollection.countDocuments({
            $or: [
              { subcategoryId: sub.id },
              { subcategoryId: sub._id?.toString() },
              { subcategoryIds: sub.id },
              { subcategoryIds: sub._id?.toString() }
            ]
          });

          totalSubcategoryProducts += subProductCount;
          const status = sub.isActive ? '✅' : '❌';
          const emptyIndicator = subProductCount === 0 ? ' 🗑️ EMPTY' : '';
          console.log(`     └─ ${status} "${sub.name}" (${subProductCount} products)${emptyIndicator}`);
        }

        console.log(`   Total products (including subcategories): ${productCount + totalSubcategoryProducts}`);
      }

      if (productCount === 0 && subcategories.length === 0) {
        console.log('   ⚠️  THIS CATEGORY IS COMPLETELY EMPTY!');
      } else if (productCount === 0 && subcategories.every(sub => sub.productCount === 0)) {
        console.log('   ⚠️  THIS CATEGORY HAS ONLY EMPTY SUBCATEGORIES!');
      }
    }

    console.log('\n' + '=' .repeat(80));

    // Summary statistics
    const totalProducts = await productsCollection.countDocuments({});
    const activeCategories = allCategories.filter(c => c.isActive).length;
    const inactiveCategories = allCategories.length - activeCategories;

    const allSubcategories = await subcategoriesCollection.find({}).toArray();
    const activeSubcategories = allSubcategories.filter(s => s.isActive).length;
    const inactiveSubcategories = allSubcategories.length - activeSubcategories;

    console.log('\n📊 SUMMARY STATISTICS:');
    console.log(`   Total products in database: ${totalProducts}`);
    console.log(`   Categories: ${activeCategories} active, ${inactiveCategories} inactive`);
    console.log(`   Subcategories: ${activeSubcategories} active, ${inactiveSubcategories} inactive`);

    // Find truly empty categories
    const emptyCategories = [];
    const categoriesWithOnlyEmptySubcategories = [];

    for (const category of allCategories) {
      const productCount = await productsCollection.countDocuments({
        $or: [
          { categoryId: category.id },
          { categoryId: category._id?.toString() },
          { category: category.name }
        ]
      });

      const subcategories = await subcategoriesCollection.find({
        $or: [
          { categoryId: category.id },
          { categoryId: category._id?.toString() }
        ]
      }).toArray();

      let hasNonEmptySubcategory = false;
      for (const sub of subcategories) {
        const subProductCount = await productsCollection.countDocuments({
          $or: [
            { subcategoryId: sub.id },
            { subcategoryId: sub._id?.toString() },
            { subcategoryIds: sub.id },
            { subcategoryIds: sub._id?.toString() }
          ]
        });
        if (subProductCount > 0) {
          hasNonEmptySubcategory = true;
          break;
        }
      }

      if (productCount === 0 && subcategories.length === 0) {
        emptyCategories.push(category.name);
      } else if (productCount === 0 && !hasNonEmptySubcategory && subcategories.length > 0) {
        categoriesWithOnlyEmptySubcategories.push(category.name);
      }
    }

    if (emptyCategories.length > 0) {
      console.log(`\n🗑️  Completely empty categories: ${emptyCategories.join(', ')}`);
    }
    if (categoriesWithOnlyEmptySubcategories.length > 0) {
      console.log(`🗑️  Categories with only empty subcategories: ${categoriesWithOnlyEmptySubcategories.join(', ')}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the script
analyzeCategories().catch(console.error);