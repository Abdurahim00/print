const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'printwrap-pro';

async function removeEmptyCategories() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const categories = await db.collection('categories').find({}).toArray();
    const subcategories = await db.collection('subcategories').find({}).toArray();
    const products = await db.collection('products').find({}).toArray();

    console.log('\n📊 ANALYZING CATEGORIES...\n');

    const emptyCategories = [];
    const populatedCategories = [];

    for (const cat of categories) {
      // Check if category has any subcategories
      const subCount = subcategories.filter(s => s.categoryId === cat.id).length;

      // Check if category has any products directly assigned
      const productCount = products.filter(p =>
        p.categoryId === cat.id ||
        p.categoryId === cat._id?.toString()
      ).length;

      if (subCount === 0 && productCount === 0) {
        emptyCategories.push(cat);
        console.log(`🗑️  ${cat.name}: 0 subcategories, 0 products - WILL REMOVE`);
      } else {
        populatedCategories.push(cat);
        console.log(`✅ ${cat.name}: ${subCount} subcategories, ${productCount} products - KEEPING`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n📊 Found ${emptyCategories.length} empty categories to remove`);
    console.log(`📊 Keeping ${populatedCategories.length} categories with content`);

    if (emptyCategories.length > 0) {
      console.log('\n🗑️  REMOVING EMPTY CATEGORIES:\n');

      for (const cat of emptyCategories) {
        console.log(`  Removing: ${cat.name}`);
      }

      const idsToDelete = emptyCategories.map(c => c._id);
      const stringIdsToDelete = emptyCategories.map(c => c.id).filter(id => id);

      const deleteResult = await db.collection('categories').deleteMany({
        $or: [
          { _id: { $in: idsToDelete } },
          { id: { $in: stringIdsToDelete } }
        ]
      });

      console.log(`\n✅ Successfully deleted ${deleteResult.deletedCount} empty categories`);
    } else {
      console.log('\n✅ No empty categories to remove!');
    }

    // Final statistics
    const finalCategoryCount = await db.collection('categories').countDocuments({});
    const finalSubcategoryCount = await db.collection('subcategories').countDocuments({});
    const finalProductCount = await db.collection('products').countDocuments({});

    console.log('\n📊 FINAL DATABASE STATISTICS:');
    console.log(`   Active Categories: ${finalCategoryCount}`);
    console.log(`   Active Subcategories: ${finalSubcategoryCount}`);
    console.log(`   Total Products: ${finalProductCount}`);

    // Show remaining categories with their subcategory counts
    console.log('\n📊 REMAINING CATEGORIES:');
    const remainingCategories = await db.collection('categories').find({}).toArray();
    for (const cat of remainingCategories) {
      const subCount = subcategories.filter(s => s.categoryId === cat.id).length;
      console.log(`   ✅ ${cat.name}: ${subCount} subcategories`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the script
removeEmptyCategories().catch(console.error);
