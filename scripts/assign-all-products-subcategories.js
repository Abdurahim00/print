const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

async function assignAllProductsToSubcategories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('printwrap-pro');
    const products = db.collection('products');
    const categories = db.collection('categories');
    const subcategories = db.collection('subcategories');

    // Read the backup JSON file
    console.log('Reading products from backup JSON file...');
    const jsonContent = fs.readFileSync('products-backup-1757320722828.json', 'utf8');
    const backupProducts = JSON.parse(jsonContent);
    console.log(`Found ${backupProducts.length} products in backup file\n`);

    // Get all categories and subcategories
    const allCategories = await categories.find({}).toArray();
    const allSubcategories = await subcategories.find({}).toArray();
    
    console.log(`Found ${allCategories.length} categories in database`);
    console.log(`Found ${allSubcategories.length} subcategories in database\n`);

    // Create category mapping
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat._id.toString()] = cat;
    });

    // Enhanced keyword mapping for subcategory matching
    const subcategoryKeywords = {
      // Profile Clothing (Profilkläder)
      't-shirts': ['t-shirt', 'tshirt', 't shirt', 'tee', 'dam t-shirt', 'herr t-shirt', 'topp', 'linne'],
      'polo shirts': ['polo', 'pike', 'piké', 'pikétröja', 'pikéskjorta'],
      'hoodies': ['hoodie', 'huvtröja', 'luvtröja', 'hood', 'sweat med huva', 'college med huva'],
      'sweatshirts': ['sweatshirt', 'sweat', 'college', 'tröja', 'pullover', 'sweater'],
      'jackets': ['jacka', 'jacket', 'rock', 'coat', 'windbreaker', 'vindtröja', 'softshell', 'fleece'],
      'shirts': ['skjorta', 'shirt', 'blouse', 'blus'],
      'pants': ['byxa', 'byxor', 'pants', 'trousers', 'jeans', 'chinos'],
      'shorts': ['shorts', 'short', 'kortbyxa', 'kortbyxor'],
      'caps': ['keps', 'cap', 'snapback', 'trucker', 'basebollkeps'],
      'beanies': ['mössa', 'beanie', 'hat', 'stickad mössa', 'vintermössa'],
      'vests': ['väst', 'vest', 'bodywarmer'],
      'underwear': ['underkläder', 'underwear', 'boxer', 'kalsonger', 'trosor'],
      'sportswear': ['sport', 'träning', 'gym', 'athletic', 'running', 'jogging'],
      'accessories': ['accessoar', 'halsduk', 'scarf', 'vantar', 'gloves', 'bälte', 'belt'],
      
      // Giveaways (Giveaways)
      'keychains': ['nyckelring', 'keychain', 'key ring', 'nyckel'],
      'lanyards': ['nyckelband', 'lanyard', 'halsband', 'id-band'],
      'pens': ['penna', 'pen', 'kulspets', 'bläckpenna', 'stylus'],
      'mugs': ['mugg', 'mug', 'kopp', 'cup', 'termos', 'thermos', 'coffee'],
      'water bottles': ['vattenflaska', 'bottle', 'flaska', 'dricka', 'sportflaska', 'drinkware'],
      'bags': ['väska', 'bag', 'kasse', 'ryggsäck', 'backpack', 'tote', 'shopping', 'resväska', 'luggage', 'portfölj'],
      'umbrellas': ['paraply', 'umbrella', 'regn'],
      'stress balls': ['stressboll', 'stress ball', 'klämma'],
      'usb drives': ['usb', 'minnessticka', 'flash drive', 'memory stick', 'usb-minne'],
      'power banks': ['powerbank', 'power bank', 'laddare', 'charger', 'batteri'],
      'notebooks': ['anteckningsbok', 'notebook', 'notepad', 'block', 'dagbok', 'journal'],
      'lighters': ['tändare', 'lighter', 'eld'],
      'bottle openers': ['flasköppnare', 'bottle opener', 'kapsylöppnare', 'öppnare'],
      'phone accessories': ['telefon', 'phone', 'mobil', 'smartphone', 'case', 'skal', 'hållare', 'holder'],
      'wallets': ['plånbok', 'wallet', 'korthållare', 'card holder'],
      'badges': ['badge', 'pin', 'märke', 'button'],
      'stickers': ['sticker', 'klistermärke', 'dekal', 'decal'],
      'magnets': ['magnet', 'kylskåpsmagnet'],
      'coasters': ['underlägg', 'coaster', 'glasbricka'],
      'mousepads': ['musmatta', 'mousepad', 'mouse pad'],
      'wristbands': ['armband', 'wristband', 'sweatband'],
      'sunglasses': ['solglasögon', 'sunglasses', 'glasögon'],
      'flashlights': ['ficklampa', 'flashlight', 'torch', 'lampa'],
      'tools': ['verktyg', 'tool', 'multiverktyg', 'multitool', 'kniv', 'knife'],
      
      // Bags & Luggage (Väskor & Bagage)
      'travel bags': ['resväska', 'luggage', 'travel bag', 'weekendbag', 'duffel', 'trolley'],
      'shopping bags': ['shoppingväska', 'shopping bag', 'kasse', 'tygkasse', 'shoppingvagn'],
      'backpacks': ['ryggsäck', 'backpack', 'skolväska', 'laptop bag'],
      'sports bags': ['sportväska', 'gym bag', 'träningsväska', 'sport bag'],
      'cooler bags': ['kylväska', 'cooler bag', 'picknick', 'thermal bag'],
      'tote bags': ['tote', 'axelväska', 'shoulder bag', 'handväska'],
      'briefcases': ['portfölj', 'briefcase', 'dokumentväska', 'laptop väska'],
      'toiletry bags': ['necessär', 'toiletry bag', 'sminkväska', 'wash bag'],
      
      // Work clothes (Arbetskläder)
      'work jackets': ['arbetsjacka', 'work jacket', 'arbets'],
      'high-visibility clothing': ['varsel', 'reflex', 'high-vis', 'synlighet', 'visibility', 'säkerhet'],
      'work overalls': ['overall', 'arbetsoverall', 'hängselbyxa'],
      'work pants': ['arbetsbyxa', 'work pants', 'yrkesbyxa'],
      'safety equipment': ['skydd', 'safety', 'hjälm', 'helmet', 'handskar', 'gloves'],
      'work shirts': ['arbetsskjorta', 'work shirt', 'flanell'],
      'coveralls': ['overall', 'coverall', 'skyddsdräkt'],
      
      // Office (Kontor)
      'calendars': ['kalender', 'calendar', 'almanacka', 'planerare', 'planner'],
      'computer equipment': ['dator', 'computer', 'laptop', 'mus', 'mouse', 'tangentbord', 'keyboard', 'skärm', 'monitor'],
      'desk accessories': ['skrivbord', 'desk', 'pennställ', 'organizer', 'brevkorg'],
      'presentation tools': ['presentation', 'whiteboard', 'flip chart', 'pekare', 'pointer'],
      'folders': ['mapp', 'folder', 'pärm', 'binder', 'portfolio'],
      'writing instruments': ['skrivdon', 'writing', 'pencil', 'blyerts', 'marker'],
      'sticky notes': ['post-it', 'sticky note', 'klisterlapp', 'memo'],
      'calculators': ['kalkylator', 'calculator', 'räknare'],
      'stamps': ['stämpel', 'stamp', 'sigill'],
      'paper products': ['papper', 'paper', 'kuvert', 'envelope', 'brevpapper']
    };

    // Process products and assign subcategories
    const updates = [];
    const subcategoryCounts = {};
    const categoryProductCounts = {};
    let noMatchCount = 0;
    let processedCount = 0;
    const unassignedProducts = [];

    console.log('Processing products for subcategory assignment...\n');

    for (const product of backupProducts) {
      processedCount++;
      
      if (processedCount % 5000 === 0) {
        console.log(`  Processed ${processedCount}/${backupProducts.length} products...`);
      }

      const categoryId = product.category || product.categoryId;
      
      if (!categoryId || categoryId === 'uncategorized') {
        noMatchCount++;
        continue;
      }

      // Count products per category
      categoryProductCounts[categoryId] = (categoryProductCounts[categoryId] || 0) + 1;

      const productNameLower = (product.name || '').toLowerCase();
      const productDescLower = (product.description || '').toLowerCase();
      const combinedText = productNameLower + ' ' + productDescLower;

      // Find matching subcategory for this category
      const categorySubcategories = allSubcategories.filter(sub => 
        sub.categoryId.toString() === categoryId.toString()
      );

      let matchedSubcategory = null;
      let matchReason = '';

      // Strategy 1: Direct name match
      for (const sub of categorySubcategories) {
        const subNameLower = sub.name.toLowerCase();
        const subSlugLower = sub.slug.toLowerCase();
        
        if (productNameLower.includes(subNameLower) || productNameLower.includes(subSlugLower)) {
          matchedSubcategory = sub;
          matchReason = 'direct name match';
          break;
        }
        
        // Check Swedish name
        if (sub.swedishName) {
          const subSwedishLower = sub.swedishName.toLowerCase();
          if (productNameLower.includes(subSwedishLower)) {
            matchedSubcategory = sub;
            matchReason = 'swedish name match';
            break;
          }
        }
      }

      // Strategy 2: Keyword matching
      if (!matchedSubcategory) {
        for (const sub of categorySubcategories) {
          const subNameLower = sub.name.toLowerCase();
          const subSlugLower = sub.slug.toLowerCase();
          
          // Check keywords for this subcategory
          const keywords = subcategoryKeywords[subSlugLower] || subcategoryKeywords[subNameLower] || [];
          
          for (const keyword of keywords) {
            if (combinedText.includes(keyword.toLowerCase())) {
              matchedSubcategory = sub;
              matchReason = `keyword match: ${keyword}`;
              break;
            }
          }
          
          if (matchedSubcategory) break;
          
          // Check Swedish name keywords
          if (sub.swedishName) {
            const subSwedishLower = sub.swedishName.toLowerCase();
            const swedishKeywords = subcategoryKeywords[subSwedishLower] || [];
            
            for (const keyword of swedishKeywords) {
              if (combinedText.includes(keyword.toLowerCase())) {
                matchedSubcategory = sub;
                matchReason = `swedish keyword match: ${keyword}`;
                break;
              }
            }
            
            if (matchedSubcategory) break;
          }
        }
      }

      // Strategy 3: Fallback to first subcategory of the category (if only one exists)
      if (!matchedSubcategory && categorySubcategories.length === 1) {
        matchedSubcategory = categorySubcategories[0];
        matchReason = 'single subcategory fallback';
      }

      // Strategy 4: Smart fallback based on common patterns
      if (!matchedSubcategory && categorySubcategories.length > 0) {
        // Try to find a "general" or "other" subcategory
        const generalSub = categorySubcategories.find(sub => 
          sub.name.toLowerCase().includes('general') || 
          sub.name.toLowerCase().includes('other') ||
          sub.name.toLowerCase().includes('övrig') ||
          sub.name.toLowerCase().includes('diverse')
        );
        
        if (generalSub) {
          matchedSubcategory = generalSub;
          matchReason = 'general subcategory fallback';
        } else {
          // Use the most popular subcategory as fallback
          matchedSubcategory = categorySubcategories[0];
          matchReason = 'default fallback';
        }
      }

      if (matchedSubcategory) {
        // Prepare the update with proper ObjectId
        const productId = product._id?.$oid || product._id;
        
        updates.push({
          updateOne: {
            filter: { _id: new ObjectId(productId) },
            update: { 
              $set: { 
                subcategoryId: matchedSubcategory._id,
                subcategoryIds: [matchedSubcategory._id]
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
        unassignedProducts.push({
          name: product.name,
          category: categoryId,
          description: product.description?.substring(0, 100)
        });
      }
    }

    // Execute updates in batches
    if (updates.length > 0) {
      console.log(`\nExecuting ${updates.length} subcategory assignments...`);
      const batchSize = 1000;
      let processed = 0;
      let totalModified = 0;
      
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, Math.min(i + batchSize, updates.length));
        const result = await products.bulkWrite(batch, { ordered: false });
        processed += batch.length;
        totalModified += result.modifiedCount;
        console.log(`  Batch ${Math.floor(i/batchSize) + 1}: Processed ${processed}/${updates.length} products (${result.modifiedCount} modified)`);
      }
      
      console.log(`\nTotal modified: ${totalModified} products`);
    }

    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('=== SUBCATEGORY ASSIGNMENT SUMMARY ===');
    console.log('='.repeat(60));
    console.log(`Total products processed: ${backupProducts.length}`);
    console.log(`Products assigned to subcategories: ${updates.length}`);
    console.log(`Products without subcategory match: ${noMatchCount}`);
    console.log(`Success rate: ${((updates.length / backupProducts.length) * 100).toFixed(2)}%`);
    
    console.log('\n=== PRODUCTS PER CATEGORY ===');
    Object.entries(categoryProductCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([categoryId, count]) => {
        const category = categoryMap[categoryId];
        const categoryName = category ? category.name : 'Unknown';
        console.log(`  ${categoryName} (${categoryId}): ${count} products`);
      });
    
    console.log('\n=== TOP 30 SUBCATEGORIES BY PRODUCT COUNT ===');
    Object.entries(subcategoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .forEach(([subcategory, count], index) => {
        console.log(`  ${index + 1}. ${subcategory}: ${count} products`);
      });

    // Show some unassigned products if any
    if (unassignedProducts.length > 0) {
      console.log('\n=== SAMPLE UNASSIGNED PRODUCTS (first 10) ===');
      unassignedProducts.slice(0, 10).forEach(product => {
        console.log(`  - "${product.name}" (Category: ${product.category})`);
      });
    }

    // Verify final database counts
    const finalCount = await products.countDocuments({
      subcategoryId: { $exists: true, $ne: null }
    });
    const totalInDb = await products.countDocuments({});
    
    console.log('\n=== FINAL DATABASE STATUS ===');
    console.log(`Total products in database: ${totalInDb}`);
    console.log(`Products with subcategories: ${finalCount}`);
    console.log(`Products without subcategories: ${totalInDb - finalCount}`);
    console.log(`Coverage: ${((finalCount / totalInDb) * 100).toFixed(2)}%`);

  } catch (error) {
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
console.log('Starting comprehensive product subcategory assignment...');
console.log('This will process ALL products from the backup JSON file\n');
assignAllProductsToSubcategories();