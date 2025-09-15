const { MongoClient } = require('mongodb');
require('dotenv').config();

async function assignProductsToSubcategories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('printwrap-pro');
    const products = db.collection('products');
    const categories = db.collection('categories');
    const subcategories = db.collection('subcategories');

    // Get all categories and subcategories
    const allCategories = await categories.find({}).toArray();
    const allSubcategories = await subcategories.find({}).toArray();
    
    console.log(`Found ${allCategories.length} categories`);
    console.log(`Found ${allSubcategories.length} subcategories`);

    // Create mapping for quick lookup
    const subcategoryByName = {};
    allSubcategories.forEach(sub => {
      const key = `${sub.categoryId}_${sub.name.toLowerCase()}`;
      subcategoryByName[key] = sub;
      if (sub.swedishName) {
        const keySwedish = `${sub.categoryId}_${sub.swedishName.toLowerCase()}`;
        subcategoryByName[keySwedish] = sub;
      }
    });

    // Keywords for matching products to subcategories
    const subcategoryKeywords = {
      // Profile Clothing subcategories
      't-shirts': ['t-shirt', 'tshirt', 't shirt', 'tee', 'dam t-shirt', 'herr t-shirt'],
      'polo shirts': ['polo', 'pike', 'piké', 'pikétröja'],
      'hoodies': ['hoodie', 'huvtröja', 'luvtröja', 'hood'],
      'sweatshirts': ['sweatshirt', 'sweat', 'college'],
      'jackets': ['jacka', 'jacket', 'rock', 'coat'],
      'shirts': ['skjorta', 'shirt', 'blouse'],
      'pants': ['byxa', 'byxor', 'pants', 'trousers'],
      'shorts': ['shorts', 'short'],
      'caps': ['keps', 'cap', 'snapback'],
      'beanies': ['mössa', 'beanie', 'hat'],
      'vests': ['väst', 'vest'],
      'underwear': ['underkläder', 'underwear', 'boxer'],
      
      // Giveaways subcategories
      'keychains': ['nyckelring', 'keychain', 'key ring'],
      'lanyards': ['nyckelband', 'lanyard'],
      'pens': ['penna', 'pen', 'kulspets'],
      'mugs': ['mugg', 'mug', 'kopp'],
      'water bottles': ['vattenflaska', 'bottle', 'flaska', 'dricka'],
      'bags': ['väska', 'bag', 'kasse', 'ryggsäck'],
      'umbrellas': ['paraply', 'umbrella'],
      'stress balls': ['stressboll', 'stress ball'],
      'usb drives': ['usb', 'minnessticka', 'flash drive'],
      'power banks': ['powerbank', 'power bank', 'laddare'],
      'notebooks': ['anteckningsbok', 'notebook', 'notepad', 'block'],
      'lighters': ['tändare', 'lighter'],
      'bottle openers': ['flasköppnare', 'bottle opener', 'kapsylöppnare'],
      
      // Work clothes subcategories
      'work jackets': ['arbetsjacka', 'work jacket'],
      'high-visibility clothing': ['varsel', 'reflex', 'high-vis'],
      'work overalls': ['overall', 'arbetsoverall'],
      'work pants': ['arbetsbyxa', 'work pants'],
      
      // Office subcategories
      'calendars': ['kalender', 'calendar', 'almanacka'],
      'computer equipment': ['dator', 'computer', 'laptop', 'mus', 'mouse', 'tangentbord'],
    };

    // Get all products
    const allProducts = await products.find({}).toArray();
    console.log(`\nProcessing ${allProducts.length} products for subcategory assignment...\n`);

    const updates = [];
    const subcategoryCounts = {};
    let noMatchCount = 0;

    for (const product of allProducts) {
      const categoryId = product.categoryId;
      
      if (!categoryId || categoryId === 'uncategorized') {
        continue; // Skip uncategorized products
      }

      const productNameLower = (product.name || '').toLowerCase();
      const productDescLower = (product.description || '').toLowerCase();
      const combinedText = productNameLower + ' ' + productDescLower;

      // Find matching subcategory
      let matchedSubcategory = null;
      
      // Try exact subcategory name match first
      const categorySubcategories = allSubcategories.filter(sub => sub.categoryId === categoryId);
      
      for (const sub of categorySubcategories) {
        const subNameLower = sub.name.toLowerCase();
        
        // Check if product name contains subcategory name
        if (combinedText.includes(subNameLower)) {
          matchedSubcategory = sub;
          break;
        }
        
        // Check Swedish name if it exists
        if (sub.swedishName) {
          const subSwedishLower = sub.swedishName.toLowerCase();
          if (combinedText.includes(subSwedishLower)) {
            matchedSubcategory = sub;
            break;
          }
          // Check against keywords with Swedish name
          const keywords = subcategoryKeywords[subSwedishLower] || [];
          if (keywords.some(keyword => combinedText.includes(keyword))) {
            matchedSubcategory = sub;
            break;
          }
        }
        
        // Check against keywords with English name
        const keywords = subcategoryKeywords[subNameLower] || [];
        if (keywords.some(keyword => combinedText.includes(keyword))) {
          matchedSubcategory = sub;
          break;
        }
      }

      if (matchedSubcategory) {
        updates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { 
              $set: { 
                subcategoryId: matchedSubcategory._id.toString(),
                subcategoryIds: [matchedSubcategory._id.toString()]
              }
            }
          }
        });
        
        const countKey = matchedSubcategory.swedishName 
          ? `${matchedSubcategory.name} (${matchedSubcategory.swedishName})`
          : matchedSubcategory.name;
        subcategoryCounts[countKey] = (subcategoryCounts[countKey] || 0) + 1;
      } else {
        noMatchCount++;
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
    console.log(`Products assigned to subcategories: ${updates.length}`);
    console.log(`Products without subcategory match: ${noMatchCount}`);
    
    console.log('\n=== Top Subcategories by Product Count ===');
    Object.entries(subcategoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .forEach(([subcategory, count]) => {
        console.log(`  ${subcategory}: ${count} products`);
      });

    // Verify final counts
    const finalCount = await products.countDocuments({
      subcategoryId: { $exists: true, $ne: null }
    });
    console.log(`\nTotal products with subcategories: ${finalCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Assigning products to existing subcategories...');
assignProductsToSubcategories();