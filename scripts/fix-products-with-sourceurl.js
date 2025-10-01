const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

async function fixProductsWithSourceUrl() {
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
    
    // Get all categories and subcategories from database
    const allCategories = await categories.find({}).toArray();
    const allSubcategories = await subcategories.find({}).toArray();
    
    console.log(`Found ${allCategories.length} categories in database`);
    console.log(`Found ${allSubcategories.length} subcategories in database\n`);
    
    // Create mapping from URL patterns to subcategories
    // Based on the sourceUrl patterns we discovered
    const urlToSubcategoryMap = {
      // Office & Supplies
      'toner-och-black/tonerkassetter': 'toner',
      'toner-och-black/blackpatroner': 'ink-cartridges',
      'kontorsmaterial/pennor': 'pens',
      'kontorsmaterial/anteckningsbocker': 'notebooks',
      'kontorsmaterial/mappar': 'folders',
      'kontorsmaterial/parmar': 'binders',
      'kontorsmaterial/block': 'notepads',
      'kontorsmaterial/till-skrivbordet': 'desk-accessories',
      'kontorsmaterial/whiteboardtavlor': 'whiteboards',
      'kontorsmaterial/tavlor': 'boards',
      
      // Profile Clothing
      'profilklader/trojor/sweatshirts': 'sweatshirts',
      'profilklader/trojor/huvtrojor': 'hoodies',
      'profilklader/trojor/t-shirts': 't-shirts',
      'profilklader/jackor/fritidsjackor': 'jackets',
      'profilklader/jackor/softshelljackor': 'softshell',
      'profilklader/jackor/fleecejackor': 'fleece',
      'profilklader/byxor': 'pants',
      'profilklader/shorts': 'shorts',
      'profilklader/skjortor': 'shirts',
      'profilklader/pike': 'polos',
      'profilklader/kepsar': 'caps',
      'profilklader/mossor': 'beanies',
      
      // Bags
      'vaskor/ryggsackar': 'backpacks',
      'vaskor/datorvaskor': 'laptop-bags',
      'vaskor/shoppingvaskor': 'tote-bags',
      'vaskor/sportvaskor': 'sports-bags',
      'vaskor/kylvaskor': 'cooler-bags',
      'vaskor/resvaskor': 'travel-bags',
      'vaskor/gympapase': 'gym-bags',
      'vaskor/axelvaskor': 'shoulder-bags',
      'vaskor/trolleyvaskor': 'luggage',
      'vaskor/necessarer': 'toiletry-bags',
      'pasar-kassar/tygpasar': 'canvas-bags',
      'pasar-kassar/non-woven': 'non-woven-bags',
      'pasar-kassar/papperspasar': 'paper-bags',
      'pasar-kassar/bomullspasar': 'cotton-bags',
      
      // Drinkware
      'muggar/porslinsmuggar': 'mugs',
      'muggar/termosmuggar': 'thermos',
      'muggar/glasmuggar': 'glass-mugs',
      'muggar/plastmuggar': 'plastic-mugs',
      'muggar/metallmuggar': 'metal-mugs',
      'sport-fritid/sportflaskor': 'bottles',
      'koksprodukter/flaskor': 'bottles',
      
      // Accessories
      'nyckelringar': 'keychains',
      'nyckelband': 'lanyards',
      'paraplyer': 'umbrellas',
      'reflexer': 'reflectors',
      'mobiltillbehor/hogtalare': 'speakers',
      'mobiltillbehor/mobilladdare': 'chargers',
      'mobiltillbehor/horlurar': 'headphones',
      'mobiltillbehor/mobilhallare': 'phone-holders',
      'mobiltillbehor/mobilskal': 'phone-cases',
      
      // Promotional Items
      'presentreklam': 'promotional-items',
      'giveaways': 'giveaways',
      'profilprodukter': 'profile-products',
      
      // Work Clothes
      'arbetsklader/arbetsbyxor': 'work-pants',
      'arbetsklader/arbetsjackor': 'work-jackets',
      'arbetsklader/varselklader': 'high-visibility-clothing',
      'arbetsklader/arbetsskor': 'work-shoes',
      'arbetsklader/arbetshandskar': 'work-gloves',
      'arbetsklader/overaller': 'coveralls',
      
      // Tech Accessories
      'datorutrustning': 'computer-equipment',
      'usb': 'usb-drives',
      'powerbank': 'power-banks',
      'kablar': 'cables',
      
      // Home & Household
      'hem-hushall/handdukar': 'towels',
      'hem-hushall/pladar': 'blankets',
      'hem-hushall/sangklader': 'bedding',
      'hem-hushall/ljus': 'candles',
      'hem-hushall/inredning': 'home-decor',
      
      // Kitchen
      'koksprodukter/matlador': 'lunch-boxes',
      'koksprodukter/forkladen': 'aprons',
      'koksprodukter/skarbrador': 'cutting-boards',
      'koksprodukter/bestick': 'cutlery',
      'koksprodukter/servering': 'serving',
      'koksprodukter/koksredskap': 'kitchen-tools',
      
      // Sports & Leisure
      'sport-fritid/leksaker': 'toys',
      'sport-fritid/sallskapsspel': 'games',
      'sport-fritid/friluftsliv': 'outdoor',
      'sport-fritid/sommarprodukter': 'summer-products',
      'sport-fritid/picknick': 'picnic',
      'sport-fritid/solglasogon': 'sunglasses',
      
      // Training Clothes
      'traningsklader': 'sportswear',
      'matchstall': 'team-wear',
      
      // Gift & Food
      'julklappar': 'christmas-gifts',
      'matgavor': 'food-gifts',
      'godis': 'candy',
      
      // Office Furniture
      'kontorsmobler': 'office-furniture',
      'bord': 'desks',
      'stolar': 'chairs',
      'skap': 'cabinets',
      'lampor': 'lamps'
    };
    
    // Create a more flexible mapping based on keywords
    const keywordToSubcategorySlug = {
      // Apparel
      't-shirt': 't-shirts',
      'tshirt': 't-shirts',
      'hoodie': 'hoodies',
      'huvtröja': 'hoodies',
      'sweatshirt': 'sweatshirts',
      'jacket': 'jackets',
      'jacka': 'jackets',
      'byxor': 'pants',
      'pants': 'pants',
      'shorts': 'shorts',
      'skjorta': 'shirts',
      'shirt': 'shirts',
      'polo': 'polos',
      'pike': 'polos',
      'fleece': 'fleece',
      'softshell': 'softshell',
      'vest': 'vests',
      'väst': 'vests',
      'keps': 'caps',
      'cap': 'caps',
      'mössa': 'beanies',
      'beanie': 'beanies',
      
      // Bags
      'ryggsäck': 'backpacks',
      'backpack': 'backpacks',
      'väska': 'bags',
      'bag': 'bags',
      'resväska': 'luggage',
      'luggage': 'luggage',
      'necessär': 'toiletry-bags',
      'toiletry': 'toiletry-bags',
      'kylväska': 'cooler-bags',
      'cooler': 'cooler-bags',
      'tote': 'tote-bags',
      'shopping': 'tote-bags',
      
      // Drinkware
      'mugg': 'mugs',
      'mug': 'mugs',
      'kopp': 'mugs',
      'cup': 'mugs',
      'flaska': 'bottles',
      'bottle': 'bottles',
      'termos': 'thermos',
      'thermos': 'thermos',
      
      // Accessories
      'nyckelring': 'keychains',
      'keychain': 'keychains',
      'lanyard': 'lanyards',
      'nyckelband': 'lanyards',
      'paraply': 'umbrellas',
      'umbrella': 'umbrellas',
      
      // Office
      'penna': 'pens',
      'pen': 'pens',
      'anteckningsbok': 'notebooks',
      'notebook': 'notebooks',
      'mapp': 'folders',
      'folder': 'folders',
      'pärm': 'binders',
      'binder': 'binders',
      
      // Tech
      'usb': 'usb-drives',
      'powerbank': 'power-banks',
      'högtalare': 'speakers',
      'speaker': 'speakers',
      'laddare': 'chargers',
      'charger': 'chargers',
      'hörlurar': 'headphones',
      'earbuds': 'headphones',
      
      // Work clothes
      'varsel': 'high-visibility-clothing',
      'arbetsbyxa': 'work-pants',
      'arbetsjacka': 'work-jackets',
      'overall': 'coveralls',
      
      // Home
      'handduk': 'towels',
      'towel': 'towels',
      'filt': 'blankets',
      'blanket': 'blankets',
      'ljus': 'candles',
      'candle': 'candles'
    };
    
    // Process products and assign subcategories based on sourceUrl
    const updates = [];
    const stats = {
      urlMatched: 0,
      keywordMatched: 0,
      nameMatched: 0,
      noMatch: 0
    };
    
    console.log('Processing products for subcategory assignment...\n');
    
    for (let i = 0; i < backupProducts.length; i++) {
      const product = backupProducts[i];
      
      if (i % 5000 === 0 && i > 0) {
        console.log(`  Processed ${i}/${backupProducts.length} products...`);
      }
      
      const productId = product._id?.$oid || product._id;
      const sourceUrl = product.sourceUrl || '';
      const productName = (product.name || '').toLowerCase();
      const productDesc = (product.description || '').toLowerCase();
      
      let matchedSubcategory = null;
      let matchReason = '';
      
      // Strategy 1: Match based on sourceUrl patterns
      if (sourceUrl) {
        // Remove domain and clean URL
        const urlClean = sourceUrl.replace(/^https?:\/\/[^\/]+\//, '');
        
        // Check each URL pattern
        for (const [urlPattern, subcatSlug] of Object.entries(urlToSubcategoryMap)) {
          if (urlClean.includes(urlPattern)) {
            // Find subcategory by slug
            matchedSubcategory = allSubcategories.find(s => 
              s.slug === subcatSlug || 
              s.name.toLowerCase() === subcatSlug.replace(/-/g, ' ')
            );
            
            if (matchedSubcategory) {
              matchReason = 'url-pattern';
              stats.urlMatched++;
              break;
            }
          }
        }
      }
      
      // Strategy 2: Match based on product name keywords
      if (!matchedSubcategory) {
        for (const [keyword, subcatSlug] of Object.entries(keywordToSubcategorySlug)) {
          if (productName.includes(keyword) || productDesc.includes(keyword)) {
            matchedSubcategory = allSubcategories.find(s => 
              s.slug === subcatSlug || 
              s.name.toLowerCase() === subcatSlug.replace(/-/g, ' ')
            );
            
            if (matchedSubcategory) {
              matchReason = 'keyword';
              stats.keywordMatched++;
              break;
            }
          }
        }
      }
      
      // Strategy 3: Direct name matching with subcategory names
      if (!matchedSubcategory) {
        for (const subcat of allSubcategories) {
          const subcatName = subcat.name.toLowerCase();
          const subcatSlug = (subcat.slug || '').toLowerCase();
          
          if (productName.includes(subcatName) || 
              productName.includes(subcatSlug) ||
              (subcat.swedishName && productName.includes(subcat.swedishName.toLowerCase()))) {
            matchedSubcategory = subcat;
            matchReason = 'name-match';
            stats.nameMatched++;
            break;
          }
        }
      }
      
      // If no match, find the most appropriate general subcategory
      if (!matchedSubcategory) {
        // Try to find "Miscellaneous" or "Other" subcategory for the product's category
        const productCategoryId = product.category || product.categoryId;
        if (productCategoryId) {
          matchedSubcategory = allSubcategories.find(s => 
            s.categoryId?.toString() === productCategoryId.toString() &&
            (s.name.toLowerCase().includes('misc') || 
             s.name.toLowerCase().includes('other') ||
             s.name.toLowerCase().includes('general'))
          );
        }
        
        // If still no match, use the global Miscellaneous
        if (!matchedSubcategory) {
          matchedSubcategory = allSubcategories.find(s => s.name === 'Miscellaneous');
          stats.noMatch++;
        }
      }
      
      // Create update
      if (matchedSubcategory) {
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
      }
    }
    
    // Execute updates
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
        
        if (processed % 5000 === 0 || processed === updates.length) {
          console.log(`  Processed ${processed}/${updates.length} (${totalModified} modified)`);
        }
      }
      
      console.log(`\nTotal products modified: ${totalModified}`);
    }
    
    // Display statistics
    console.log('\n=== ASSIGNMENT STATISTICS ===');
    console.log(`URL pattern matched: ${stats.urlMatched} products`);
    console.log(`Keyword matched: ${stats.keywordMatched} products`);
    console.log(`Name matched: ${stats.nameMatched} products`);
    console.log(`No match (kept in Miscellaneous): ${stats.noMatch} products`);
    console.log(`Success rate: ${((stats.urlMatched + stats.keywordMatched + stats.nameMatched) / backupProducts.length * 100).toFixed(2)}%`);
    
    // Final verification
    console.log('\n=== FINAL DISTRIBUTION ===');
    
    const pipeline = [
      {
        $group: {
          _id: {
            categoryId: "$categoryId",
            subcategoryId: "$subcategoryId"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.categoryId",
          totalCount: { $sum: "$count" },
          subcategories: {
            $push: {
              subcategoryId: "$_id.subcategoryId",
              count: "$count"
            }
          }
        }
      },
      { $sort: { totalCount: -1 } }
    ];
    
    const distribution = await products.aggregate(pipeline).toArray();
    
    for (const catDist of distribution.slice(0, 5)) {
      const category = allCategories.find(c => c._id.toString() === catDist._id);
      console.log(`\n${category?.name || catDist._id}: ${catDist.totalCount} products`);
      
      const topSubcats = catDist.subcategories
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      for (const subDist of topSubcats) {
        const subcat = allSubcategories.find(s => s._id.equals(subDist.subcategoryId));
        console.log(`  - ${subcat?.name || 'Unknown'}: ${subDist.count} products`);
      }
    }
    
    // Check Miscellaneous count
    const miscSubcat = allSubcategories.find(s => s.name === 'Miscellaneous');
    if (miscSubcat) {
      const miscCount = await products.countDocuments({ subcategoryId: miscSubcat._id });
      console.log(`\nProducts still in Miscellaneous: ${miscCount}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Starting product subcategory assignment using sourceUrl data...\n');
fixProductsWithSourceUrl();