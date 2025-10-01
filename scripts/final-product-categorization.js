const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

async function finalProductCategorization() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('printwrap-pro');
    const products = db.collection('products');
    const subcategories = db.collection('subcategories');
    const categories = db.collection('categories');
    
    // Read the backup JSON file
    console.log('Reading products from backup JSON file...');
    const jsonContent = fs.readFileSync('products-backup-1757320722828.json', 'utf8');
    const backupProducts = JSON.parse(jsonContent);
    console.log(`Found ${backupProducts.length} products in backup file\n`);
    
    // Get all subcategories
    const allSubcategories = await subcategories.find({}).toArray();
    console.log(`Found ${allSubcategories.length} subcategories in database\n`);
    
    // Create comprehensive mapping based on analysis
    const nameToSubcategoryId = {};
    
    // Map subcategory names to their IDs
    allSubcategories.forEach(sub => {
      const key = sub.name.toLowerCase();
      nameToSubcategoryId[key] = sub._id;
      
      // Also map Swedish names
      if (sub.swedishName) {
        nameToSubcategoryId[sub.swedishName.toLowerCase()] = sub._id;
      }
      
      // Map slugs
      if (sub.slug) {
        nameToSubcategoryId[sub.slug.toLowerCase()] = sub._id;
      }
    });
    
    // Comprehensive keyword mappings based on our analysis
    const keywordMappings = {
      // Sportswear (many jersey/squad products)
      'sportswear': ['jersey', 'squad', 'progress', 'match', 'training', 'träning', 'sport', 'athletic', 'gym', 'fitness', 'running', 'jogging'],
      'traningsklader': ['jersey', 'squad', 'progress', 'match', 'training', 'träning', 'sport', 'athletic', 'gym', 'fitness'],
      
      // T-Shirts
      't-shirts': ['t-shirt', 'tshirt', 't shirt', 'tee', 'topp', 'linne'],
      't shirt': ['t-shirt', 'tshirt', 't shirt', 'tee'],
      
      // Tank Tops
      'tank tops': ['tanktop', 'tank top', 'linne', 'singlet', 'sleeveless'],
      'linnen': ['tanktop', 'tank top', 'linne', 'singlet'],
      
      // Hoodies
      'hoodies': ['hoodie', 'huvtröja', 'luvtröja', 'hood', 'hooded'],
      'huvtrojor': ['hoodie', 'huvtröja', 'luvtröja', 'hood'],
      
      // Sweatshirts
      'sweatshirts': ['sweat', 'crewneck', 'crew neck', 'college', 'pullover', 'jumper'],
      'sweatshirts collegetrojor': ['sweat', 'crewneck', 'college'],
      
      // Jackets
      'jackets': ['jacket', 'jacka', 'coat', 'rock', 'blazer', 'windbreaker', 'anorak'],
      'jackor': ['jacket', 'jacka', 'coat', 'rock'],
      
      // Fleece
      'fleece': ['fleece', 'flis', 'polar', 'microfleece'],
      'fleecetrojor': ['fleece', 'flis'],
      
      // Softshell
      'softshell': ['softshell', 'soft shell', 'soft-shell'],
      
      // Vests
      'vests': ['vest', 'väst', 'bodywarmer', 'gilet', 'waistcoat'],
      'vastar': ['vest', 'väst'],
      
      // Pants
      'pants': ['pants', 'byxa', 'byxor', 'trousers', 'jeans', 'chinos', 'slacks'],
      'byxor': ['pants', 'byxa', 'byxor', 'trousers'],
      
      // Shorts
      'shorts': ['shorts', 'short', 'bermuda', 'kortbyxa'],
      
      // Tights/Leggings
      'tights': ['tights', 'leggings', 'compression'],
      
      // Skirts
      'skirts': ['skirt', 'kjol', 'mini', 'maxi'],
      'kjolar': ['skirt', 'kjol'],
      
      // Dresses
      'dresses': ['dress', 'klänning', 'gown', 'frock'],
      'klanningar': ['dress', 'klänning'],
      
      // Shirts
      'shirts': ['shirt', 'skjorta', 'blouse', 'blus', 'oxford', 'button-up'],
      'skjortor': ['shirt', 'skjorta', 'blouse'],
      
      // Polo Shirts
      'polo shirts': ['polo', 'pike', 'piké', 'golf shirt'],
      'piketrojor': ['polo', 'pike', 'piké'],
      
      // Underwear
      'underwear': ['underwear', 'underkläder', 'boxer', 'briefs', 'panties'],
      'underklader': ['underwear', 'underkläder', 'boxer'],
      
      // Caps
      'caps': ['cap', 'keps', 'snapback', 'trucker', 'baseball', 'fitted'],
      'kepsar': ['cap', 'keps', 'snapback'],
      
      // Beanies
      'beanies': ['beanie', 'mössa', 'knit hat', 'winter hat', 'skull cap'],
      'mossor': ['beanie', 'mössa', 'hat'],
      
      // Bags
      'bags': ['bag', 'väska', 'sack', 'carrier', 'holdall'],
      'vaskor': ['bag', 'väska'],
      
      // Backpacks
      'backpacks': ['backpack', 'ryggsäck', 'rucksack', 'knapsack', 'daypack'],
      
      // Tote Bags
      'tote bags': ['tote', 'shopping', 'shopper', 'kasse', 'canvas bag'],
      
      // Luggage
      'luggage': ['luggage', 'resväska', 'suitcase', 'trolley', 'travel bag'],
      
      // Bottles
      'bottles': ['bottle', 'flaska', 'water bottle', 'sport bottle', 'drinking bottle'],
      'vattenflaskor': ['bottle', 'flaska', 'vattenflaska'],
      
      // Mugs
      'mugs': ['mug', 'mugg', 'cup', 'kopp', 'coffee mug'],
      'muggar': ['mug', 'mugg', 'kopp'],
      
      // Thermos
      'thermos': ['thermos', 'termos', 'vacuum', 'insulated', 'thermal'],
      
      // Pens
      'pens': ['pen', 'penna', 'ballpoint', 'kulspets', 'biro', 'stylus', 'marker'],
      'pennor': ['pen', 'penna', 'kulspets'],
      
      // Notebooks
      'notebooks': ['notebook', 'anteckningsbok', 'notepad', 'journal', 'diary', 'planner'],
      
      // Keychains
      'keychains': ['keychain', 'nyckelring', 'key ring', 'key fob', 'key holder'],
      'nyckelringar': ['keychain', 'nyckelring'],
      
      // Lanyards
      'lanyards': ['lanyard', 'nyckelband', 'neck strap', 'badge holder'],
      'nyckelband': ['lanyard', 'nyckelband'],
      
      // Umbrellas
      'umbrellas': ['umbrella', 'paraply', 'parasol', 'brolly'],
      'paraplyer': ['umbrella', 'paraply'],
      
      // Towels
      'towels': ['towel', 'handduk', 'bath towel', 'beach towel', 'hand towel'],
      
      // Blankets
      'blankets': ['blanket', 'filt', 'throw', 'plaid', 'fleece blanket'],
      
      // USB Drives
      'usb drives': ['usb', 'minnessticka', 'flash drive', 'memory stick', 'thumb drive'],
      'usb minnen': ['usb', 'minnessticka', 'flash'],
      
      // Power Banks
      'power banks': ['powerbank', 'power bank', 'charger', 'laddare', 'battery pack'],
      'powerbank': ['powerbank', 'power bank', 'laddare'],
      
      // Speakers
      'speakers': ['speaker', 'högtalare', 'bluetooth', 'wireless speaker', 'portable speaker'],
      
      // Headphones
      'headphones': ['headphone', 'hörlurar', 'earbuds', 'earphone', 'earpods'],
      
      // High-Visibility Clothing
      'high-visibility clothing': ['varsel', 'hi-vis', 'high-vis', 'reflex', 'visibility', 'safety'],
      'varselklader': ['varsel', 'hi-vis', 'reflex'],
      'hi-vis clothing': ['varsel', 'hi-vis', 'high-vis', 'reflex'],
      
      // Work Clothes
      'work pants & shorts': ['arbetsbyxa', 'work pants', 'work shorts', 'cargo'],
      'arbetsbyxor shorts': ['arbetsbyxa', 'work pants'],
      'work jackets': ['arbetsjacka', 'work jacket', 'work coat'],
      'arbetsjackor': ['arbetsjacka', 'work jacket'],
      'work overalls': ['overall', 'coverall', 'boilersuit', 'jumpsuit'],
      'arbetsoveraller': ['overall', 'coverall'],
      
      // Accessories
      'gloves': ['glove', 'handske', 'mitten', 'vante'],
      'handskar vantar': ['glove', 'handske', 'vante'],
      'scarves': ['scarf', 'halsduk', 'shawl', 'wrap', 'snood'],
      'belts': ['belt', 'bälte', 'strap'],
      'hats': ['hat', 'hatt', 'fedora', 'panama'],
      
      // Office items
      'calendars & planners': ['calendar', 'kalender', 'planner', 'agenda', 'diary'],
      'almanackor och kalendrar': ['calendar', 'kalender', 'almanacka'],
      
      // Promotional items
      'stress balls': ['stress', 'squeeze', 'stress ball', 'antistress'],
      'stressbollar': ['stress', 'squeeze', 'stressboll'],
      'magnets': ['magnet', 'magnetic', 'fridge magnet'],
      'kylskapsmagneter': ['magnet', 'kylskåpsmagnet'],
      'badges': ['badge', 'pin', 'button', 'märke'],
      'pins': ['pin', 'badge', 'button'],
      'stickers': ['sticker', 'klistermärke', 'decal', 'label'],
      
      // Food items
      'candy': ['candy', 'godis', 'sweet', 'mint', 'chocolate'],
      'godis': ['candy', 'godis', 'sweet'],
      'lunch boxes': ['lunchlåda', 'lunch box', 'food container', 'bento'],
      
      // Kitchen items
      'aprons': ['apron', 'förkläde', 'cooking apron', 'kitchen apron'],
      'cutting boards': ['cutting board', 'skärbräda', 'chopping board'],
      
      // Games & Toys
      'toys': ['toy', 'leksak', 'game', 'spel', 'puzzle'],
      
      // Reflectors
      'reflectors': ['reflector', 'reflex', 'safety reflector'],
      
      // Balloons
      'balloons': ['balloon', 'ballong', 'reklamballong'],
      'ballonger': ['balloon', 'ballong'],
      
      // Ties
      'ties': ['tie', 'slips', 'necktie', 'bow tie'],
      
      // Wallets
      'wallets': ['wallet', 'plånbok', 'purse', 'card holder', 'money clip'],
      
      // Shoes
      'shoes': ['shoe', 'sko', 'boot', 'stövel', 'sneaker', 'trainer'],
      'skor': ['shoe', 'sko', 'boot'],
      
      // Socks
      'socks': ['sock', 'strumpa', 'socka', 'ankle sock', 'knee sock'],
      'strumpor sockar': ['sock', 'strumpa', 'socka']
    };
    
    const updates = [];
    const stats = {
      matched: 0,
      unmatched: 0,
      byCategory: {}
    };
    
    console.log('Processing products for final categorization...\n');
    
    for (let i = 0; i < backupProducts.length; i++) {
      const product = backupProducts[i];
      
      if (i % 5000 === 0 && i > 0) {
        console.log(`  Processed ${i}/${backupProducts.length} products...`);
      }
      
      const productId = product._id?.$oid || product._id;
      const productName = (product.name || '').toLowerCase();
      const productDesc = (product.description || '').toLowerCase();
      const combinedText = productName + ' ' + productDesc;
      
      let matchedSubcategoryId = null;
      let matchReason = '';
      
      // Try to match based on keywords
      for (const [subcatKey, keywords] of Object.entries(keywordMappings)) {
        for (const keyword of keywords) {
          if (combinedText.includes(keyword.toLowerCase())) {
            // Find the subcategory ID
            matchedSubcategoryId = nameToSubcategoryId[subcatKey];
            if (matchedSubcategoryId) {
              matchReason = `keyword: ${keyword}`;
              break;
            }
          }
        }
        if (matchedSubcategoryId) break;
      }
      
      // If no match, try to keep in Miscellaneous
      if (!matchedSubcategoryId) {
        matchedSubcategoryId = nameToSubcategoryId['miscellaneous'];
        matchReason = 'no match';
        stats.unmatched++;
      } else {
        stats.matched++;
      }
      
      // Track statistics
      if (matchReason !== 'no match') {
        stats.byCategory[matchReason] = (stats.byCategory[matchReason] || 0) + 1;
      }
      
      // Create update
      if (matchedSubcategoryId) {
        updates.push({
          updateOne: {
            filter: { _id: new ObjectId(productId) },
            update: { 
              $set: { 
                subcategoryId: matchedSubcategoryId,
                subcategoryIds: [matchedSubcategoryId]
              }
            }
          }
        });
      }
    }
    
    // Execute updates
    if (updates.length > 0) {
      console.log(`\nExecuting ${updates.length} updates...`);
      const batchSize = 1000;
      let processed = 0;
      let totalModified = 0;
      
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, Math.min(i + batchSize, updates.length));
        const result = await products.bulkWrite(batch, { ordered: false });
        processed += batch.length;
        totalModified += result.modifiedCount;
        
        if (processed % 5000 === 0 || processed === updates.length) {
          console.log(`  Processed ${processed}/${updates.length} (${totalModified} modified)`);
        }
      }
      
      console.log(`\nTotal products modified: ${totalModified}`);
    }
    
    // Display statistics
    console.log('\n=== CATEGORIZATION STATISTICS ===');
    console.log(`Products successfully categorized: ${stats.matched}`);
    console.log(`Products without clear category: ${stats.unmatched}`);
    console.log(`Success rate: ${((stats.matched / backupProducts.length) * 100).toFixed(2)}%`);
    
    // Final verification
    console.log('\n=== FINAL DISTRIBUTION ===');
    
    const pipeline = [
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subcategoryId',
          foreignField: '_id',
          as: 'subcategory'
        }
      },
      {
        $unwind: {
          path: '$subcategory',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$subcategory.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ];
    
    const distribution = await products.aggregate(pipeline).toArray();
    
    console.log('\nTop 20 subcategories by product count:');
    distribution.forEach(item => {
      console.log(`  ${item._id || 'No subcategory'}: ${item.count} products`);
    });
    
    // Check Miscellaneous count
    const miscSubcat = await subcategories.findOne({ name: 'Miscellaneous' });
    if (miscSubcat) {
      const miscCount = await products.countDocuments({ subcategoryId: miscSubcat._id });
      console.log(`\nProducts in Miscellaneous: ${miscCount}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Starting final product categorization...\n');
finalProductCategorization();