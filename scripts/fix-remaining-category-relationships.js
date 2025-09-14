const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'printwrap-pro';

async function fixRemainingCategories() {
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

    // Create category ID map
    const catMap = {};
    categories.forEach(c => catMap[c.name] = c.id);

    console.log('\n📊 REASSIGNING ORPHANED SUBCATEGORIES...\n');

    // Define which orphaned subcategories should belong to empty categories
    const reassignments = [
      // Subcategories that belong to Other category
      { subName: 'Miscellaneous', categoryName: 'Other' },

      // Drinkware subcategories
      { subName: 'Bottles', categoryName: 'Drinkware' },
      { subName: 'Thermos', categoryName: 'Drinkware' },
      { subName: 'Mugs', categoryName: 'Drinkware' },

      // Textiles subcategories
      { subName: 'Blankets', categoryName: 'Textiles' },
      { subName: 'Towels', categoryName: 'Textiles' },

      // Toys & Games subcategories
      { subName: 'Toys', categoryName: 'Toys & Games' },

      // Bags subcategories
      { subName: 'Tote Bags', categoryName: 'Bags' },
      { subName: 'Backpacks', categoryName: 'Bags' },
      { subName: 'Bags', categoryName: 'Bags' },

      // Promotional Items subcategories
      { subName: 'Notebooks', categoryName: 'Promotional Items' },
      { subName: 'Lanyards', categoryName: 'Promotional Items' },

      // Apparel subcategories
      { subName: 'Fleece', categoryName: 'Apparel' },
      { subName: 'Softshell', categoryName: 'Apparel' },
      { subName: 'Vests', categoryName: 'Apparel' },

      // Accessories subcategories
      { subName: 'Gloves', categoryName: 'Accessories' },
      { subName: 'Belts', categoryName: 'Accessories' },
      { subName: 'Scarves', categoryName: 'Accessories' },

      // Tech Accessories subcategories
      { subName: 'Speakers', categoryName: 'Tech Accessories' },
      { subName: 'Headphones', categoryName: 'Tech Accessories' },
      { subName: 'USB Drives', categoryName: 'Tech Accessories' },
      { subName: 'Power Banks', categoryName: 'Tech Accessories' },
    ];

    let updateCount = 0;
    for (const { subName, categoryName } of reassignments) {
      const categoryId = catMap[categoryName];
      if (!categoryId) {
        console.log(`⚠️  Category "${categoryName}" not found, skipping ${subName}`);
        continue;
      }

      const result = await db.collection('subcategories').updateMany(
        { name: subName },
        { $set: { categoryId: categoryId } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Moved ${subName} to ${categoryName}`);
        updateCount += result.modifiedCount;
      }
    }

    console.log(`\n📊 Total subcategories reassigned: ${updateCount}`);

    // Now show updated category counts
    console.log('\n📊 UPDATED CATEGORY COUNTS:\n');
    const updatedSubs = await db.collection('subcategories').find({}).toArray();

    let emptyCategories = [];
    for (const cat of categories) {
      const subCount = updatedSubs.filter(s => s.categoryId === cat.id).length;
      if (subCount > 0) {
        console.log(`✅ ${cat.name}: ${subCount} subcategories`);
      } else {
        emptyCategories.push(cat.name);
      }
    }

    // Remove empty categories
    if (emptyCategories.length > 0) {
      console.log('\n🗑️  REMOVING EMPTY CATEGORIES:\n');
      for (const catName of emptyCategories) {
        console.log(`  Removing: ${catName}`);
      }

      const deleteResult = await db.collection('categories').deleteMany({
        name: { $in: emptyCategories }
      });

      console.log(`\n✅ Deleted ${deleteResult.deletedCount} empty categories`);
    }

    // Final statistics
    const finalCategoryCount = await db.collection('categories').countDocuments({});
    const finalSubcategoryCount = await db.collection('subcategories').countDocuments({});

    console.log('\n📊 FINAL STATISTICS:');
    console.log(`   Categories with subcategories: ${finalCategoryCount}`);
    console.log(`   Total subcategories: ${finalSubcategoryCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the script
fixRemainingCategories().catch(console.error);