const { MongoClient } = require('mongodb');
require('dotenv').config();

async function assignSubcategories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db(process.env.MONGODB_DB || 'printwrap');
    const products = db.collection('products');
    const categories = db.collection('categories');
    const subcategories = db.collection('subcategories');

    // Get all categories and subcategories
    const allCategories = await categories.find({}).toArray();
    const allSubcategories = await subcategories.find({}).toArray();
    
    console.log(`Found ${allCategories.length} categories`);
    console.log(`Found ${allSubcategories.length} subcategories`);

    // Create a map of category to subcategories
    const categorySubcategoryMap = {};
    allCategories.forEach(cat => {
      categorySubcategoryMap[cat._id.toString()] = allSubcategories.filter(
        sub => sub.categoryId === cat._id.toString()
      );
    });

    // Subcategory assignment rules based on product characteristics
    const subcategoryRules = {
      'Apparel': {
        'T-Shirts': ['t-shirt', 'tshirt', 'tee', 't-tröja', 'basic tee'],
        'Hoodies & Sweatshirts': ['hoodie', 'sweatshirt', 'huvtröja', 'luvtröja', 'pullover'],
        'Jackets': ['jacket', 'jacka', 'coat', 'rock', 'väst', 'vest'],
        'Shirts': ['shirt', 'skjorta', 'polo', 'pikétröja', 'button-up'],
        'Pants': ['pants', 'byxor', 'jeans', 'trousers', 'shorts'],
        'Workwear': ['overall', 'arbets', 'work', 'uniform', 'safety'],
        'Sportswear': ['sport', 'träning', 'gym', 'athletic', 'running']
      },
      'Bags': {
        'Backpacks': ['ryggsäck', 'backpack', 'school bag', 'laptop bag'],
        'Shopping Bags': ['shopping', 'shoppingväska', 'tote', 'grocery'],
        'Travel Bags': ['resväska', 'luggage', 'suitcase', 'kabinväska', 'duffel', 'travel'],
        'Tote Bags': ['tote', 'axelväska', 'shoulder bag', 'canvas bag'],
        'Gym Bags': ['gym', 'sport bag', 'träningsväska', 'duffel'],
        'Laptop Bags': ['laptop', 'computer', 'business bag', 'briefcase', 'portfölj'],
        'Cooler Bags': ['cooler', 'kylväska', 'insulated', 'picnic']
      },
      'Drinkware': {
        'Mugs': ['mugg', 'mug', 'coffee mug', 'kaffemugg', 'ceramic'],
        'Water Bottles': ['bottle', 'flaska', 'vattenflaska', 'water', 'sports bottle'],
        'Tumblers': ['tumbler', 'tumblr', 'travel mug', 'termo'],
        'Glasses': ['glass', 'glas', 'drinking glass', 'wine glass'],
        'Thermoses': ['termos', 'thermos', 'vacuum', 'insulated bottle']
      },
      'Office & Supplies': {
        'Pens': ['penna', 'pen', 'kulspetspenna', 'ballpoint', 'stylus'],
        'Notebooks': ['notebook', 'anteckningsbok', 'notepad', 'journal', 'dagbok'],
        'Desk Accessories': ['desk', 'skrivbord', 'organizer', 'holder', 'stand'],
        'Calendars': ['kalender', 'calendar', 'planner', 'agenda'],
        'Folders': ['folder', 'mapp', 'binder', 'portfolio']
      },
      'Tech Accessories': {
        'Phone Cases': ['case', 'skal', 'phone cover', 'protection'],
        'Chargers': ['laddare', 'charger', 'charging', 'adapter'],
        'Cables': ['cable', 'kabel', 'wire', 'cord', 'usb'],
        'Power Banks': ['powerbank', 'power bank', 'battery', 'portable charger'],
        'Headphones': ['headphone', 'hörlurar', 'earphone', 'earbud'],
        'Speakers': ['speaker', 'högtalare', 'bluetooth speaker', 'audio']
      },
      'Promotional Items': {
        'Keychains': ['nyckelring', 'keychain', 'key ring', 'key holder'],
        'Badges': ['badge', 'pin', 'button', 'märke'],
        'Lanyards': ['lanyard', 'nyckelband', 'neck strap'],
        'Stickers': ['sticker', 'klistermärke', 'decal', 'label'],
        'Magnets': ['magnet', 'magnetisk', 'fridge magnet']
      },
      'Accessories': {
        'Hats & Caps': ['keps', 'cap', 'hat', 'mössa', 'beanie', 'snapback'],
        'Sunglasses': ['solglasögon', 'sunglasses', 'shades'],
        'Watches': ['watch', 'klocka', 'armbandsur', 'wristwatch'],
        'Belts': ['belt', 'bälte', 'strap'],
        'Scarves': ['scarf', 'halsduk', 'sjal', 'shawl']
      },
      'Home & Living': {
        'Towels': ['handduk', 'towel', 'bath towel', 'beach towel'],
        'Blankets': ['filt', 'blanket', 'throw', 'fleece'],
        'Pillows': ['kudde', 'pillow', 'cushion'],
        'Kitchen': ['kitchen', 'kök', 'cooking', 'utensil'],
        'Bathroom': ['bathroom', 'badrum', 'toilet', 'shower']
      },
      'Sports & Outdoor': {
        'Sports Equipment': ['ball', 'boll', 'racket', 'club', 'equipment'],
        'Outdoor Gear': ['camping', 'tent', 'tält', 'hiking', 'vandring'],
        'Fitness': ['fitness', 'gym', 'träning', 'workout', 'exercise'],
        'Team Sports': ['fotboll', 'football', 'soccer', 'basketball', 'hockey'],
        'Water Sports': ['swim', 'simning', 'surf', 'diving', 'beach']
      }
    };

    // Get all products
    const allProducts = await products.find({}).toArray();
    console.log(`\nProcessing ${allProducts.length} products for subcategory assignment...\n`);

    const updates = [];
    const subcategoryCounts = {};
    let noSubcategoryCount = 0;

    for (const product of allProducts) {
      const categoryId = product.categoryId;
      
      if (!categoryId || categoryId === 'uncategorized') {
        continue; // Skip uncategorized products
      }

      // Find the category name
      const category = allCategories.find(c => c._id.toString() === categoryId);
      if (!category) continue;

      const categoryName = category.name;
      const productNameLower = (product.name || '').toLowerCase();
      const productDescLower = (product.description || '').toLowerCase();
      const combinedText = productNameLower + ' ' + productDescLower;

      // Try to find matching subcategory
      let assignedSubcategory = null;
      const subcategoryRulesForCategory = subcategoryRules[categoryName];

      if (subcategoryRulesForCategory) {
        for (const [subcategoryName, keywords] of Object.entries(subcategoryRulesForCategory)) {
          if (keywords.some(keyword => combinedText.includes(keyword))) {
            // Find the actual subcategory document
            const subcategory = allSubcategories.find(
              sub => sub.name === subcategoryName && sub.categoryId === categoryId
            );
            
            if (subcategory) {
              assignedSubcategory = subcategory._id.toString();
              subcategoryCounts[`${categoryName} > ${subcategoryName}`] = 
                (subcategoryCounts[`${categoryName} > ${subcategoryName}`] || 0) + 1;
              break;
            }
          }
        }
      }

      if (assignedSubcategory) {
        updates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { 
              $set: { 
                subcategoryId: assignedSubcategory,
                // Also ensure we have both category and subcategory IDs as arrays for compatibility
                categoryIds: [categoryId],
                subcategoryIds: [assignedSubcategory]
              }
            }
          }
        });
      } else {
        noSubcategoryCount++;
        // Product stays in main category without subcategory
      }
    }

    // Execute updates in batches
    if (updates.length > 0) {
      console.log(`Executing ${updates.length} subcategory assignments...`);
      const batchSize = 500;
      let processed = 0;
      
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, Math.min(i + batchSize, updates.length));
        const result = await products.bulkWrite(batch);
        processed += batch.length;
        console.log(`  Processed ${processed}/${updates.length} products (${result.modifiedCount} modified)`);
      }
    }

    console.log('\n=== Subcategory Assignment Summary ===');
    Object.entries(subcategoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([subcategory, count]) => {
        console.log(`  ${subcategory}: ${count} products`);
      });
    
    console.log(`\nProducts without subcategory (remain in main category): ${noSubcategoryCount}`);

    // Verify final counts
    console.log('\n=== Final Subcategory Counts in Database ===');
    for (const cat of allCategories) {
      const catSubs = categorySubcategoryMap[cat._id.toString()] || [];
      if (catSubs.length > 0) {
        console.log(`\n${cat.name}:`);
        for (const sub of catSubs) {
          const count = await products.countDocuments({ subcategoryId: sub._id.toString() });
          if (count > 0) {
            console.log(`  - ${sub.name}: ${count} products`);
          }
        }
      }
    }

    // Count products with subcategories
    const withSubcategory = await products.countDocuments({
      subcategoryId: { $exists: true, $ne: null }
    });
    console.log(`\nTotal products with subcategories: ${withSubcategory}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Assigning subcategories to products...');
assignSubcategories();