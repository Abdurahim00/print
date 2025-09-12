const fs = require('fs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bellakoroma:kN1FtoGvG8a1vMcp@cluster0.jlzve.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

// Translation mapping for Swedish to English categories
const categoryTranslations = {
  // Main categories
  'presentreklam': 'gifts',
  'giveaways': 'giveaways',
  'profilklader': 'apparel',
  'kontorsmaterial': 'office',
  'hem-och-kok': 'home-kitchen',
  'sport-och-fritid': 'sports-leisure',
  'elektronik': 'electronics',
  'mat-och-dryck': 'food-drinks',
  
  // Subcategories
  'vaskor': 'bags',
  'shoppingvaskor': 'shopping-bags',
  'trolleyvaskor': 'trolley-bags',
  'resvaskor': 'travel-bags',
  'ryggsackar': 'backpacks',
  'axelvaskor': 'shoulder-bags',
  'sportvaskor': 'sports-bags',
  'nyckelringar': 'keychains',
  'nyckelringar-led': 'led-keychains',
  'pennor': 'pens',
  'muggar': 'mugs',
  'termosar': 'thermoses',
  'flaskor': 'bottles',
  'dryckesflaskor': 'drink-bottles',
  'vattenflaskor': 'water-bottles',
  't-shirts': 't-shirts',
  'poloshirts': 'polo-shirts',
  'huvtrojor': 'hoodies',
  'jackor': 'jackets',
  'kepsar': 'caps',
  'mossor': 'beanies',
  'handdukar': 'towels',
  'paraply': 'umbrellas',
  'paraplyer': 'umbrellas',
  'planboksfodral': 'wallets',
  'kortfodral': 'card-holders',
  'datortillbehor': 'computer-accessories',
  'mobilaccessoarer': 'mobile-accessories',
  'powerbanks': 'powerbanks',
  'hogtalare': 'speakers',
  'bluetooth-hogtalare': 'bluetooth-speakers',
  'horlurar': 'headphones',
  'usb-minnen': 'usb-drives',
  'usb': 'usb',
  'anteckningsblock': 'notebooks',
  'kalendrar': 'calendars',
  'papper': 'paper',
  'kontorsprodukter': 'office-products',
  'linjaler': 'rulers',
  'gem': 'paperclips',
  'klisterlappar': 'sticky-notes',
  'barnprodukter': 'kids-products',
  'leksaker': 'toys',
  'spel': 'games',
  'pussel': 'puzzles',
  'badleksaker': 'bath-toys',
  'skrivmaterial': 'writing-materials',
  'kritor': 'crayons',
  'reflexer': 'reflectors',
  'reflexband': 'reflective-bands',
  'reflexvaster': 'reflective-vests',
  'ficklampor': 'flashlights',
  'verktyg': 'tools',
  'multiverktyg': 'multi-tools',
  'mattor': 'measuring-tapes',
  'nyckelbrickor': 'key-tags',
  'kylvaskor': 'cooler-bags',
  'picknickkorgar': 'picnic-baskets',
  'grillredskap': 'bbq-tools',
  'koksredskap': 'kitchen-tools',
  'skararbraden': 'cutting-boards',
  'forkladden': 'aprons',
  'kokstextilier': 'kitchen-textiles',
  'glasunderlagg': 'coasters',
  'oronproppar': 'earplugs',
  'forstahjalpenprodukter': 'first-aid',
  'plastar': 'bandages',
  'handsprit': 'hand-sanitizer',
  'solglasogon': 'sunglasses',
  'solskydd': 'sun-protection',
  'badbolar': 'beach-balls',
  'strandleksaker': 'beach-toys',
  'handdukar-strand': 'beach-towels',
  'kylvaskor-strand': 'beach-coolers',
  'vinfodral': 'wine-accessories',
  'korkskruvar': 'corkscrews',
  'vinglas': 'wine-glasses',
  'olfat': 'beer-glasses',
  'snapsglas': 'shot-glasses',
  'serveringsfat': 'serving-trays',
  'ljus': 'candles',
  'ljusstakar': 'candle-holders',
  'vaxter': 'plants',
  'fropasar': 'seed-packets',
  'tradgardsredskap': 'garden-tools',
  'grillar': 'grills',
  'picknick': 'picnic',
  'camping': 'camping',
  'talt': 'tents',
  'sovsackar': 'sleeping-bags',
  'liggunderlag': 'sleeping-pads',
  'kompasser': 'compasses',
  'kikare': 'binoculars',
  'regnklader': 'rain-gear',
  'ponchos': 'ponchos',
  'sportsaker': 'sports-equipment',
  'fotbollar': 'footballs',
  'golfbollar': 'golf-balls',
  'golfredskap': 'golf-accessories',
  'yogamattor': 'yoga-mats',
  'traningsband': 'resistance-bands',
  'pedometrar': 'pedometers',
  'aktivitetsarmband': 'fitness-trackers',
  'armband': 'bracelets',
  'pins': 'pins',
  'marken': 'badges',
  'nalar': 'pins',
  'knappar': 'buttons',
  'magneter': 'magnets',
  'kylskapsmagneter': 'fridge-magnets',
  'stickers': 'stickers',
  'klistermarken': 'stickers',
  'dekaler': 'decals',
  'tatueringar': 'tattoos',
  'ballonger': 'balloons',
  'flaggor': 'flags',
  'banderoller': 'banners',
  'skyltar': 'signs',
  'displayer': 'displays',
  'posters': 'posters',
  'affischer': 'posters',
  'rollups': 'rollups',
  'massor': 'trade-show',
  'montrar': 'exhibition',
  'disk': 'counter-displays',
  'broschyrer': 'brochures',
  'foldrar': 'folders',
  'kataloger': 'catalogs',
  'bocker': 'books',
  'tidningar': 'magazines',
  'kuvert': 'envelopes',
  'brevpapper': 'letterheads',
  'visitkort': 'business-cards',
  'namnskyltar': 'name-tags',
  'id-korthallare': 'id-card-holders',
  'lanyarder': 'lanyards',
  'nyckelband': 'keychains',
  'band': 'ribbons',
  'snoren': 'cords',
  'pasar': 'bags',
  'papperspasar': 'paper-bags',
  'plastpasar': 'plastic-bags',
  'tygpasar': 'fabric-bags',
  'kassar': 'shopping-bags',
  'poser': 'pouches',
  'fodral': 'cases',
  'etuier': 'cases',
  'askar': 'boxes',
  'lador': 'boxes',
  'forpackningar': 'packaging',
  'presentpapper': 'gift-wrap',
  'presentpasar': 'gift-bags',
  'rosetter': 'bows',
  'etiketter': 'labels',
  'taggar': 'tags',
  'prislapper': 'price-tags'
};

function extractCategoryFromUrl(url) {
  if (!url) return { category: null, subcategory: null };
  
  // Parse the URL path
  const urlParts = url.split('/').filter(part => part && part !== 'med-tryck');
  
  // Find where the product categories start (after domain)
  const startIndex = urlParts.findIndex(part => 
    part === 'presentreklam' || 
    part === 'giveaways' || 
    part === 'profilklader' ||
    part === 'kontorsmaterial' ||
    part === 'hem-och-kok' ||
    part === 'sport-och-fritid' ||
    part === 'elektronik' ||
    part === 'mat-och-dryck'
  );
  
  if (startIndex === -1) return { category: null, subcategory: null };
  
  // Extract category and subcategory
  const category = urlParts[startIndex];
  const subcategory1 = urlParts[startIndex + 1]; // First level subcategory
  const subcategory2 = urlParts[startIndex + 2]; // Second level subcategory (if exists)
  
  // Translate to English
  const translatedCategory = categoryTranslations[category] || category;
  const translatedSub1 = subcategory1 ? (categoryTranslations[subcategory1] || subcategory1) : null;
  const translatedSub2 = subcategory2 ? (categoryTranslations[subcategory2] || subcategory2) : null;
  
  // Use the most specific subcategory available
  const finalSubcategory = translatedSub2 || translatedSub1;
  
  return {
    category: translatedCategory,
    subcategory: finalSubcategory,
    originalPath: `${category}/${subcategory1}${subcategory2 ? '/' + subcategory2 : ''}`
  };
}

async function assignSubcategoriesFromUrls() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    // Load products from JSON file
    console.log('Loading products from backup file...');
    const products = JSON.parse(fs.readFileSync('products-backup-1757320722828.json', 'utf8'));
    console.log(`Total products loaded: ${products.length}`);
    
    // Statistics
    const stats = {
      total: products.length,
      withUrl: 0,
      withoutUrl: 0,
      categorized: 0,
      subcategorized: 0,
      failed: 0,
      categoryMap: {},
      subcategoryMap: {},
      urlPatterns: new Set()
    };
    
    // Process each product
    const updatedProducts = [];
    
    for (const product of products) {
      const productId = product._id?.$oid || product._id || product.id;
      const sourceUrl = product.sourceUrl || product.variant_url || product.url || product.productUrl;
      
      if (sourceUrl) {
        stats.withUrl++;
        
        const { category, subcategory, originalPath } = extractCategoryFromUrl(sourceUrl);
        
        if (originalPath) {
          stats.urlPatterns.add(originalPath);
        }
        
        if (category) {
          stats.categorized++;
          
          // Track category usage
          if (!stats.categoryMap[category]) {
            stats.categoryMap[category] = { count: 0, subcategories: {} };
          }
          stats.categoryMap[category].count++;
          
          if (subcategory) {
            stats.subcategorized++;
            
            // Track subcategory usage
            if (!stats.categoryMap[category].subcategories[subcategory]) {
              stats.categoryMap[category].subcategories[subcategory] = 0;
            }
            stats.categoryMap[category].subcategories[subcategory]++;
            
            if (!stats.subcategoryMap[subcategory]) {
              stats.subcategoryMap[subcategory] = 0;
            }
            stats.subcategoryMap[subcategory]++;
          }
          
          // Update product
          updatedProducts.push({
            ...product,
            extractedCategory: category,
            extractedSubcategory: subcategory,
            sourceUrl: sourceUrl
          });
        } else {
          stats.failed++;
          updatedProducts.push(product);
        }
      } else {
        stats.withoutUrl++;
        updatedProducts.push(product);
      }
    }
    
    // Print statistics
    console.log('\n========================================');
    console.log('URL-BASED CATEGORIZATION RESULTS');
    console.log('========================================\n');
    
    console.log('OVERALL STATISTICS:');
    console.log(`Total Products: ${stats.total}`);
    console.log(`Products with URL: ${stats.withUrl} (${(stats.withUrl/stats.total*100).toFixed(2)}%)`);
    console.log(`Products without URL: ${stats.withoutUrl} (${(stats.withoutUrl/stats.total*100).toFixed(2)}%)`);
    console.log(`Successfully categorized: ${stats.categorized} (${(stats.categorized/stats.total*100).toFixed(2)}%)`);
    console.log(`Successfully subcategorized: ${stats.subcategorized} (${(stats.subcategorized/stats.total*100).toFixed(2)}%)`);
    console.log(`Failed to parse: ${stats.failed} (${(stats.failed/stats.total*100).toFixed(2)}%)`);
    
    console.log('\n\nCATEGORY DISTRIBUTION:');
    const sortedCategories = Object.entries(stats.categoryMap)
      .sort((a, b) => b[1].count - a[1].count);
    
    for (const [category, data] of sortedCategories) {
      console.log(`\n${category}: ${data.count} products`);
      
      // Show top subcategories for this category
      const sortedSubs = Object.entries(data.subcategories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      for (const [sub, count] of sortedSubs) {
        console.log(`  - ${sub}: ${count} products`);
      }
      
      if (Object.keys(data.subcategories).length > 5) {
        console.log(`  ... and ${Object.keys(data.subcategories).length - 5} more subcategories`);
      }
    }
    
    console.log('\n\nTOP 20 SUBCATEGORIES:');
    const sortedSubcategories = Object.entries(stats.subcategoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    
    for (const [subcategory, count] of sortedSubcategories) {
      console.log(`  ${subcategory}: ${count} products`);
    }
    
    console.log('\n\nUNIQUE URL PATTERNS FOUND: ' + stats.urlPatterns.size);
    
    // Save the updated products with extracted categories
    console.log('\n\nSaving categorized products...');
    fs.writeFileSync('products-with-categories.json', JSON.stringify(updatedProducts, null, 2));
    console.log('Saved to: products-with-categories.json');
    
    // Now connect to MongoDB and update the products
    console.log('\n\nConnecting to MongoDB to update products...');
    await client.connect();
    const db = client.db('test');
    const productsCollection = db.collection('products');
    
    // Create bulk operations
    const bulkOps = [];
    let updateCount = 0;
    
    for (const product of updatedProducts) {
      if (product.extractedCategory && product.extractedSubcategory) {
        const productId = product._id?.$oid || product._id;
        
        if (productId) {
          // First, we need to find or create the category and subcategory in the database
          // For now, we'll just store the extracted names
          bulkOps.push({
            updateOne: {
              filter: { _id: { $oid: productId } },
              update: {
                $set: {
                  extractedCategory: product.extractedCategory,
                  extractedSubcategory: product.extractedSubcategory,
                  categorizedFromUrl: true,
                  lastCategorized: new Date()
                }
              }
            }
          });
          
          updateCount++;
          
          // Execute in batches of 1000
          if (bulkOps.length >= 1000) {
            console.log(`Updating batch of ${bulkOps.length} products...`);
            try {
              await productsCollection.bulkWrite(bulkOps);
              bulkOps.length = 0;
            } catch (error) {
              console.error('Bulk update error:', error.message);
            }
          }
        }
      }
    }
    
    // Execute remaining operations
    if (bulkOps.length > 0) {
      console.log(`Updating final batch of ${bulkOps.length} products...`);
      try {
        await productsCollection.bulkWrite(bulkOps);
      } catch (error) {
        console.error('Final bulk update error:', error.message);
      }
    }
    
    console.log(`\n✅ Updated ${updateCount} products with category and subcategory information`);
    
    // Create summary report
    const report = {
      timestamp: new Date().toISOString(),
      statistics: stats,
      sampleProducts: updatedProducts.filter(p => p.extractedCategory && p.extractedSubcategory).slice(0, 10),
      recommendedActions: [
        'Review the extracted categories and subcategories',
        'Create actual category/subcategory documents in MongoDB',
        'Map extracted categories to database category IDs',
        'Update products with proper category and subcategory IDs'
      ]
    };
    
    fs.writeFileSync('categorization-report.json', JSON.stringify(report, null, 2));
    console.log('\nDetailed report saved to: categorization-report.json');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
console.log('Starting URL-based categorization...\n');
assignSubcategoriesFromUrls();