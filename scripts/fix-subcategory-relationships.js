const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'printwrap-pro';

async function fixSubcategoryRelationships() {
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

    // Get all categories and subcategories
    const allCategories = await categoriesCollection.find({}).toArray();
    const allSubcategories = await subcategoriesCollection.find({}).toArray();

    console.log(`\n📊 Found ${allCategories.length} categories and ${allSubcategories.length} subcategories`);

    // Create mapping of subcategory names to appropriate categories
    const subcategoryToCategoryMapping = {
      // Profile Clothing
      'T-Shirts': 'Profile Clothing',
      'Men\'s T-Shirts': 'Profile Clothing',
      'Women\'s T-Shirts': 'Profile Clothing',
      'Kids T-Shirts': 'Profile Clothing',
      'Long Sleeve T-Shirts': 'Profile Clothing',
      'V-Neck T-Shirts': 'Profile Clothing',
      'Performance T-Shirts': 'Profile Clothing',
      'Budget T-Shirts': 'Profile Clothing',
      'Organic T-Shirts': 'Profile Clothing',
      'Fair Trade T-Shirts': 'Profile Clothing',
      'Polo Shirts': 'Profile Clothing',
      'Men\'s Polo Shirts': 'Profile Clothing',
      'Women\'s Polo Shirts': 'Profile Clothing',
      'Kids Polo Shirts': 'Profile Clothing',
      'Long Sleeve Polo Shirts': 'Profile Clothing',
      'Performance Polo Shirts': 'Profile Clothing',
      'Budget Polo Shirts': 'Profile Clothing',
      'Organic Polo Shirts': 'Profile Clothing',
      'Fair Trade Polo Shirts': 'Profile Clothing',
      'Shirts': 'Profile Clothing',
      'Men\'s Shirts': 'Profile Clothing',
      'Women\'s Shirts': 'Profile Clothing',
      'Short Sleeve Shirts': 'Profile Clothing',
      'Organic Shirts': 'Profile Clothing',
      'Budget Shirts': 'Profile Clothing',
      'Hoodies': 'Profile Clothing',
      'Sweaters': 'Profile Clothing',
      'Sweatshirts': 'Profile Clothing',
      'Women\'s Sweaters': 'Profile Clothing',
      'Kids Sweaters': 'Profile Clothing',
      'V-Neck Sweaters': 'Profile Clothing',
      'Crew Neck Sweaters': 'Profile Clothing',
      'Cardigans': 'Profile Clothing',
      'Fleece Sweaters': 'Profile Clothing',
      'Knit Sweaters': 'Profile Clothing',
      'Organic Sweaters': 'Profile Clothing',
      'Polo Sweaters': 'Profile Clothing',
      'Jackets': 'Profile Clothing',
      'Blazers': 'Profile Clothing',
      'Vests': 'Profile Clothing',
      'Pants': 'Profile Clothing',
      'Shorts': 'Profile Clothing',
      'Skirts': 'Profile Clothing',
      'Dresses': 'Profile Clothing',
      'Tank Tops': 'Profile Clothing',
      'Underwear': 'Profile Clothing',
      'Bathrobes': 'Profile Clothing',
      'Ponchos': 'Profile Clothing',
      'Rain Ponchos': 'Profile Clothing',
      'Sportswear': 'Profile Clothing',
      'Base Layer Tops': 'Profile Clothing',
      'Socks': 'Profile Clothing',
      'Caps': 'Profile Clothing',
      'Beanies': 'Profile Clothing',
      'Gloves & Mittens': 'Profile Clothing',
      'Accessories': 'Profile Clothing',
      'Kids Clothing': 'Profile Clothing',
      'Organic Clothing': 'Profile Clothing',
      'Shoes': 'Profile Clothing',

      // Work Clothes
      'Work Jackets': 'Work Clothes',
      'Work Pants & Shorts': 'Work Clothes',
      'Work Overalls': 'Work Clothes',
      'High-Visibility Clothing': 'Work Clothes',

      // Personal Protection
      'Head Protection': 'Personal Protection',
      'Eye Protection': 'Personal Protection',
      'Hearing Protection': 'Personal Protection',
      'Respiratory Protection': 'Personal Protection',

      // Profile Products
      'Bags': 'Profile Products',
      'Keychains': 'Profile Products',
      'Lanyards': 'Profile Products',
      'Water Bottles': 'Profile Products',
      'Mugs': 'Profile Products',
      'Umbrellas': 'Profile Products',
      'Power Banks': 'Profile Products',
      'USB Drives': 'Profile Products',
      'Mobile Accessories': 'Profile Products',
      'Computer & Mobile Equipment': 'Profile Products',
      'Glasses': 'Profile Products',
      'Shoe Horns': 'Profile Products',
      'Luggage Tags': 'Profile Products',

      // Office & Supplies
      'Pens': 'Office & Supplies',
      'Calendars & Planners': 'Office & Supplies',
      'Office Machines': 'Office & Supplies',
      'Packaging & Storage': 'Office & Supplies',
      'Paper Clips': 'Office & Supplies',
      'Abacus': 'Office & Supplies',

      // Printed Materials
      'Brochures': 'Printed Materials',
      'Flyers': 'Printed Materials',
      'Posters': 'Printed Materials',
      'Letterheads': 'Printed Materials',

      // Exhibition Materials
      'Roll-ups & Pop-ups': 'Exhibition Materials',
      'Sidewalk Signs': 'Exhibition Materials',
      'Advertising Flags': 'Exhibition Materials',
      'Mats': 'Exhibition Materials',

      // Giveaways
      'Candy': 'Giveaways',
      'Balloons': 'Giveaways',
      'Beach Balls': 'Giveaways',
      'Frisbees': 'Giveaways',
      'Stress Balls': 'Giveaways',
      'Lighters': 'Giveaways',
      'Bottle Openers': 'Giveaways',
      'Shopping Cart Coins': 'Giveaways',
      'Fridge Magnets': 'Giveaways',
      'Pins': 'Giveaways',
      'Promotional Buttons': 'Giveaways',
      'Festival Wristbands': 'Giveaways',
      'Fan Items': 'Giveaways',
      'Bag Clips': 'Giveaways',
      'Ice Scrapers': 'Giveaways',
      'Grill Scrapers': 'Giveaways',
      'Butter Knives': 'Giveaways',
      'Lip Balm': 'Giveaways',
      'Hand Sanitizer': 'Giveaways',
      'Band-Aids': 'Giveaways',
      'Earplugs': 'Giveaways',
      'Microfiber Cloths': 'Giveaways',
      'Dish Cloths': 'Giveaways',
      'Makeup Mirrors': 'Giveaways',
      'Magnifying Glasses': 'Giveaways',
      'Shoe Polish': 'Giveaways',

      // Gift Advertising
      'Gift Cards': 'Gift Advertising',

      // Corporate Gifts
      'Summer Gifts': 'Corporate Gifts',
      'Christmas Gifts': 'Corporate Gifts',
      'Food Gifts': 'Corporate Gifts',

      // Eco-friendly Products
      'Eco-friendly Clothing & Textiles': 'Eco-friendly Products',
      'Eco-friendly Umbrellas': 'Eco-friendly Products',
      'Eco-friendly Pens': 'Eco-friendly Products',

      // Brands
      'AD Company': 'Brands',
      'Adidas': 'Brands',
      'Clique': 'Brands',
      'Craft': 'Brands',
      'J. Harvest & Frost': 'Brands',
      'Tee Jays': 'Brands',
      'Adapt': 'Brands',
      'Geyser': 'Brands'
    };

    // Create a map of category names to IDs
    const categoryNameToId = {};
    allCategories.forEach(cat => {
      categoryNameToId[cat.name] = cat.id || cat._id.toString();
    });

    console.log('\n🔄 Fixing subcategory relationships...\n');

    let fixedCount = 0;
    let notFoundCount = 0;
    const notFoundSubcategories = [];

    for (const subcategory of allSubcategories) {
      const targetCategoryName = subcategoryToCategoryMapping[subcategory.name];

      if (targetCategoryName) {
        const targetCategoryId = categoryNameToId[targetCategoryName];

        if (targetCategoryId) {
          // Update the subcategory with the correct categoryId
          const result = await subcategoriesCollection.updateOne(
            { _id: subcategory._id },
            {
              $set: {
                categoryId: targetCategoryId,
                categoryName: targetCategoryName
              }
            }
          );

          if (result.modifiedCount > 0) {
            fixedCount++;
            console.log(`  ✅ Fixed: "${subcategory.name}" → "${targetCategoryName}"`);
          }
        } else {
          console.log(`  ⚠️  Category not found: "${targetCategoryName}" for subcategory "${subcategory.name}"`);
          notFoundCount++;
        }
      } else {
        notFoundSubcategories.push(subcategory.name);
        notFoundCount++;
      }
    }

    if (notFoundSubcategories.length > 0) {
      console.log('\n⚠️  Subcategories without mapping:');
      notFoundSubcategories.forEach(name => {
        console.log(`  - ${name}`);
      });
    }

    // Now verify the relationships
    console.log('\n📊 Verifying relationships...\n');

    const subcategoriesByCategory = {};
    const updatedSubcategories = await subcategoriesCollection.find({}).toArray();

    for (const sub of updatedSubcategories) {
      const categoryName = categoryNameToId[sub.categoryId] ?
        allCategories.find(c => (c.id || c._id.toString()) === sub.categoryId)?.name :
        'Unknown';

      if (!subcategoriesByCategory[categoryName]) {
        subcategoriesByCategory[categoryName] = [];
      }
      subcategoriesByCategory[categoryName].push(sub.name);
    }

    // Display the updated structure
    console.log('UPDATED SUBCATEGORY STRUCTURE:');
    console.log('=' .repeat(80));

    for (const [categoryName, subs] of Object.entries(subcategoriesByCategory)) {
      console.log(`\n📁 ${categoryName}: ${subs.length} subcategories`);
      if (subs.length <= 10) {
        subs.forEach(subName => {
          console.log(`   └─ ${subName}`);
        });
      } else {
        subs.slice(0, 5).forEach(subName => {
          console.log(`   └─ ${subName}`);
        });
        console.log(`   ... and ${subs.length - 5} more`);
      }
    }

    console.log('\n' + '=' .repeat(80));
    console.log('\n📊 SUMMARY:');
    console.log(`   Fixed relationships: ${fixedCount}`);
    console.log(`   Not mapped: ${notFoundCount}`);
    console.log(`   Total subcategories: ${allSubcategories.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the script
fixSubcategoryRelationships().catch(console.error);