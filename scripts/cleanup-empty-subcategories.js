const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'printwrap-pro';

async function cleanupEmptySubcategories() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const subcategoriesCollection = db.collection('subcategories');
    const productsCollection = db.collection('products');

    // Get all subcategories
    const allSubcategories = await subcategoriesCollection.find({}).toArray();
    console.log(`\n📊 Found ${allSubcategories.length} total subcategories`);

    // Find which subcategories have products
    const subcategoriesWithProducts = new Set();

    for (const sub of allSubcategories) {
      // Check various possible ways products might reference this subcategory
      const productCount = await productsCollection.countDocuments({
        $or: [
          { subcategoryId: sub._id?.toString() },
          { subcategoryId: sub._id },
          { subcategoryId: sub.id },
          { subcategoryIds: sub._id?.toString() },
          { subcategoryIds: sub._id },
          { subcategoryIds: sub.id },
          { subcategory: sub.name }
        ]
      });

      if (productCount > 0) {
        subcategoriesWithProducts.add(sub._id?.toString());
        console.log(`✅ Keeping: ${sub.name} (${productCount} products)`);
      }
    }

    console.log(`\n📊 Found ${subcategoriesWithProducts.size} subcategories with products`);
    console.log(`🗑️  Will remove ${allSubcategories.length - subcategoriesWithProducts.size} empty subcategories`);

    // Remove empty subcategories
    const toDelete = allSubcategories.filter(sub => !subcategoriesWithProducts.has(sub._id?.toString()));

    if (toDelete.length > 0) {
      console.log('\n⚠️  This will delete the following empty subcategories:');
      toDelete.forEach(sub => console.log(`  - ${sub.name} (${sub.categoryName || 'Unknown category'})`));

      console.log('\nDeleting empty subcategories...');
      const deleteResult = await subcategoriesCollection.deleteMany({
        _id: { $in: toDelete.map(s => s._id) }
      });

      console.log(`\n✅ Deleted ${deleteResult.deletedCount} empty subcategories`);
    } else {
      console.log('\n✅ No empty subcategories to remove!');
    }

    // Final statistics
    const finalSubcategoryCount = await subcategoriesCollection.countDocuments({});
    console.log(`\n📊 FINAL STATISTICS:`);
    console.log(`   Remaining subcategories: ${finalSubcategoryCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the script
cleanupEmptySubcategories().catch(console.error);