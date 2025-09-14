const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'printwrap-pro';

async function reassignProductsToSubcategories() {
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

    // First, let's analyze the subcategories
    console.log('\n📊 ANALYZING SUBCATEGORIES...\n');

    const allSubcategories = await subcategoriesCollection.find({}).toArray();
    const allCategories = await categoriesCollection.find({}).toArray();

    // Create a map of category IDs to names for reference
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });

    // Group subcategories by category and check if they're empty
    const subcategoriesByCategory = {};
    const emptySubcategories = [];

    for (const sub of allSubcategories) {
      const categoryName = categoryMap[sub.categoryId] || 'Unknown';

      if (!subcategoriesByCategory[categoryName]) {
        subcategoriesByCategory[categoryName] = [];
      }

      // Count products in this subcategory
      const productCount = await productsCollection.countDocuments({
        $or: [
          { subcategoryId: sub.id },
          { subcategoryId: sub._id?.toString() },
          { subcategoryIds: sub.id },
          { subcategoryIds: sub._id?.toString() }
        ]
      });

      sub.productCount = productCount;
      subcategoriesByCategory[categoryName].push(sub);

      if (productCount === 0) {
        emptySubcategories.push(sub);
      }
    }

    // Display subcategory analysis
    console.log('SUBCATEGORIES BY CATEGORY:');
    console.log('=' .repeat(80));

    for (const [categoryName, subs] of Object.entries(subcategoriesByCategory)) {
      console.log(`\n📁 ${categoryName}:`);
      subs.forEach(sub => {
        const status = sub.productCount > 0 ? '✅' : '🗑️';
        console.log(`   ${status} ${sub.name} (${sub.productCount} products)`);
      });
    }

    console.log('\n' + '=' .repeat(80));
    console.log(`\n📊 Found ${emptySubcategories.length} empty subcategories out of ${allSubcategories.length} total`);

    // Now let's create a mapping strategy for products
    console.log('\n🔄 CREATING PRODUCT REASSIGNMENT STRATEGY...\n');

    // Define keyword mappings for subcategories
    const subcategoryKeywords = {
      // Profile Clothing subcategories
      't-shirts': ['t-shirt', 'tshirt', 'tee', 't shirt'],
      'hoodies': ['hoodie', 'hood', 'sweatshirt'],
      'jackets': ['jacket', 'coat', 'windbreaker'],
      'pants': ['pant', 'trouser', 'jean'],
      'shirts': ['shirt', 'blouse', 'polo'],
      'caps': ['cap', 'hat', 'beanie'],

      // Office & Supplies subcategories
      'pens': ['pen', 'pencil', 'marker'],
      'notebooks': ['notebook', 'notepad', 'journal', 'diary'],
      'folders': ['folder', 'binder', 'portfolio'],
      'calendars': ['calendar', 'planner', 'agenda'],
      'desk accessories': ['desk', 'organizer', 'holder'],

      // Printed Materials subcategories
      'business cards': ['business card', 'visiting card'],
      'flyers': ['flyer', 'leaflet', 'brochure'],
      'posters': ['poster', 'banner', 'sign'],
      'stickers': ['sticker', 'label', 'decal'],
      'catalogs': ['catalog', 'catalogue', 'booklet'],

      // Profile Products subcategories
      'bags': ['bag', 'backpack', 'tote', 'duffel'],
      'bottles': ['bottle', 'flask', 'tumbler', 'mug'],
      'keychains': ['keychain', 'keyring', 'key ring'],
      'phone accessories': ['phone', 'mobile', 'charger', 'powerbank', 'case'],
      'tech accessories': ['usb', 'cable', 'adapter', 'mouse', 'keyboard'],

      // Giveaways subcategories
      'small gifts': ['gift', 'souvenir', 'memento'],
      'promotional items': ['promo', 'promotional', 'branded'],
      'event giveaways': ['event', 'conference', 'trade show'],

      // Eco-friendly Products subcategories
      'recycled': ['recycled', 'recycle', 'eco', 'sustainable'],
      'organic': ['organic', 'natural', 'bamboo'],
      'reusable': ['reusable', 'washable', 'durable']
    };

    // Find subcategories and try to match products
    const reassignments = [];
    const products = await productsCollection.find({}).toArray();

    console.log(`\n📦 Analyzing ${products.length} products for reassignment...`);

    for (const product of products) {
      // Skip if product already has a subcategory
      if (product.subcategoryId || product.subcategoryIds?.length > 0) {
        continue;
      }

      const productNameLower = (product.name || '').toLowerCase();
      const productDescLower = (product.description || '').toLowerCase();
      const combinedText = `${productNameLower} ${productDescLower}`;

      // Try to find matching subcategory
      for (const sub of allSubcategories) {
        const subNameLower = sub.name.toLowerCase();

        // Check if subcategory name is in product text
        if (combinedText.includes(subNameLower)) {
          reassignments.push({
            productId: product._id,
            productName: product.name,
            subcategoryId: sub.id,
            subcategoryName: sub.name,
            categoryId: sub.categoryId
          });
          break;
        }

        // Check keywords
        const keywords = subcategoryKeywords[subNameLower] || [];
        const hasKeyword = keywords.some(keyword => combinedText.includes(keyword));

        if (hasKeyword) {
          reassignments.push({
            productId: product._id,
            productName: product.name,
            subcategoryId: sub.id,
            subcategoryName: sub.name,
            categoryId: sub.categoryId
          });
          break;
        }
      }
    }

    console.log(`\n📊 Found ${reassignments.length} products that can be reassigned to subcategories`);

    if (reassignments.length > 0) {
      console.log('\nSample reassignments (first 10):');
      reassignments.slice(0, 10).forEach(r => {
        console.log(`  • "${r.productName}" → ${r.subcategoryName}`);
      });

      console.log('\n⚠️  This will update product subcategory assignments!');
      console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');

      await new Promise(resolve => setTimeout(resolve, 5000));

      // Perform the reassignments
      let updateCount = 0;
      for (const reassignment of reassignments) {
        const result = await productsCollection.updateOne(
          { _id: reassignment.productId },
          {
            $set: {
              subcategoryId: reassignment.subcategoryId,
              subcategoryIds: [reassignment.subcategoryId]
            }
          }
        );
        if (result.modifiedCount > 0) {
          updateCount++;
        }
      }

      console.log(`\n✅ Successfully reassigned ${updateCount} products to subcategories`);
    }

    // Now remove empty subcategories
    console.log('\n🗑️  REMOVING EMPTY SUBCATEGORIES...\n');

    // Re-check for empty subcategories after reassignment
    const stillEmptySubcategories = [];
    for (const sub of allSubcategories) {
      const productCount = await productsCollection.countDocuments({
        $or: [
          { subcategoryId: sub.id },
          { subcategoryId: sub._id?.toString() },
          { subcategoryIds: sub.id },
          { subcategoryIds: sub._id?.toString() }
        ]
      });

      if (productCount === 0) {
        stillEmptySubcategories.push(sub);
        console.log(`  Removing: ${sub.name} (${sub.id})`);
      }
    }

    if (stillEmptySubcategories.length > 0) {
      const idsToDelete = stillEmptySubcategories.map(s => s._id);
      const stringIdsToDelete = stillEmptySubcategories.map(s => s.id).filter(id => id);

      const deleteResult = await subcategoriesCollection.deleteMany({
        $or: [
          { _id: { $in: idsToDelete } },
          { id: { $in: stringIdsToDelete } }
        ]
      });

      console.log(`\n✅ Deleted ${deleteResult.deletedCount} empty subcategories`);
    } else {
      console.log('\n✅ No empty subcategories to remove!');
    }

    // Final statistics
    const finalSubcategoryCount = await subcategoriesCollection.countDocuments({});
    const finalCategoryCount = await categoriesCollection.countDocuments({});

    console.log('\n📊 FINAL STATISTICS:');
    console.log(`   Categories: ${finalCategoryCount}`);
    console.log(`   Subcategories: ${finalSubcategoryCount}`);
    console.log(`   Products reassigned: ${reassignments.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the script
reassignProductsToSubcategories().catch(console.error);