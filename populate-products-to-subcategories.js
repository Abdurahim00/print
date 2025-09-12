const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bellakoroma:kN1FtoGvG8a1vMcp@cluster0.jlzve.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

// URL pattern to subcategory mapping
// This maps the URL patterns to actual subcategory names/slugs in your database
const urlPatternToSubcategory = {
  // Giveaways
  'giveaways/nyckelringar': 'keychains',
  'giveaways/nyckelringar-led': 'led-keychains',
  'giveaways/nyckelringar-metall': 'metal-keychains',
  'giveaways/nyckelringar-plast': 'plastic-keychains',
  'giveaways/nyckelringar-funktion': 'functional-keychains',
  'giveaways/pins': 'pins-badges',
  'giveaways/magneter': 'magnets',
  'giveaways/reflexer': 'reflectors',
  'giveaways/armband': 'wristbands',
  'giveaways/stickers': 'stickers',
  'giveaways/ballonger': 'balloons',
  'giveaways/godis': 'candy',
  'giveaways/minttabletter': 'mints',
  
  // Bags
  'vaskor/shoppingvaskor': 'shopping-bags',
  'vaskor/trolleyvaskor': 'trolley-bags',
  'vaskor/resvaskor': 'travel-bags',
  'vaskor/ryggsackar': 'backpacks',
  'vaskor/sportvaskor': 'sports-bags',
  'vaskor/axelvaskor': 'shoulder-bags',
  'vaskor/datorvaskor': 'laptop-bags',
  'vaskor/kylvaskor': 'cooler-bags',
  'vaskor/gympapase': 'gym-bags',
  'vaskor/necessarer': 'toiletry-bags',
  
  // Apparel
  'profilklader/t-shirts': 't-shirts',
  'profilklader/pikeer': 'polo-shirts',
  'profilklader/skjortor': 'shirts',
  'profilklader/huvtrojor': 'hoodies',
  'profilklader/sweatshirts': 'sweatshirts',
  'profilklader/jackor': 'jackets',
  'profilklader/vaster': 'vests',
  'profilklader/byxor': 'pants',
  'profilklader/shorts': 'shorts',
  'profilklader/kepsar': 'caps',
  'profilklader/mossor': 'beanies',
  'profilklader/hattar': 'hats',
  'profilklader/scarves': 'scarves',
  'profilklader/handskar': 'gloves',
  'profilklader/arbetsklaeder': 'workwear',
  'profilklader/sportklader': 'sportswear',
  
  // Office supplies
  'kontorsmaterial/pennor': 'pens',
  'kontorsmaterial/blyertspennor': 'pencils',
  'kontorsmaterial/anteckningsbocker': 'notebooks',
  'kontorsmaterial/kalendrar': 'calendars',
  'kontorsmaterial/mappar': 'folders',
  'kontorsmaterial/brevkorgar': 'letter-trays',
  'kontorsmaterial/gem': 'paperclips',
  'kontorsmaterial/klisterlappar': 'sticky-notes',
  'kontorsmaterial/linjaler': 'rulers',
  'kontorsmaterial/saxar': 'scissors',
  'kontorsmaterial/tejp': 'tape',
  'kontorsmaterial/häftapparater': 'staplers',
  
  // Electronics
  'elektronik/powerbanks': 'powerbanks',
  'elektronik/usb-minnen': 'usb-drives',
  'elektronik/hogtalare': 'speakers',
  'elektronik/horlurar': 'headphones',
  'elektronik/mobilaccessoarer': 'phone-accessories',
  'elektronik/datortillbehor': 'computer-accessories',
  'elektronik/kablar': 'cables',
  'elektronik/laddare': 'chargers',
  'elektronik/ficklampor': 'flashlights',
  
  // Home & Kitchen
  'hem-och-kok/muggar': 'mugs',
  'hem-och-kok/termosar': 'thermoses',
  'hem-och-kok/flaskor': 'bottles',
  'hem-och-kok/vattenflaskor': 'water-bottles',
  'hem-och-kok/sportflaskor': 'sports-bottles',
  'hem-och-kok/koksredskap': 'kitchen-tools',
  'hem-och-kok/skararbraden': 'cutting-boards',
  'hem-och-kok/forkladden': 'aprons',
  'hem-och-kok/handdukar': 'towels',
  'hem-och-kok/glasunderlagg': 'coasters',
  'hem-och-kok/ljus': 'candles',
  'hem-och-kok/inredning': 'home-decor',
  
  // Sports & Leisure
  'sport-och-fritid/sportredskap': 'sports-equipment',
  'sport-och-fritid/golfprodukter': 'golf-products',
  'sport-och-fritid/fotbollar': 'footballs',
  'sport-och-fritid/yogamattor': 'yoga-mats',
  'sport-och-fritid/traningsband': 'resistance-bands',
  'sport-och-fritid/camping': 'camping-gear',
  'sport-och-fritid/paraply': 'umbrellas',
  'sport-och-fritid/strandprodukter': 'beach-products',
  'sport-och-fritid/picknick': 'picnic-supplies',
  'sport-och-fritid/leksaker': 'toys',
  'sport-och-fritid/spel': 'games',
  
  // Brand-based patterns (for products under /varumarken/)
  'craft-jackor': 'jackets',
  'craft-trojor': 'shirts',
  'craft-byxor': 'pants',
  'craft-klubbklader': 'team-wear',
  'craft-underklaeder': 'underwear',
  'craft-accessoarer': 'accessories'
};

function extractSubcategoryFromUrl(url) {
  if (!url) return null;
  
  // Convert URL to lowercase for matching
  const lowerUrl = url.toLowerCase();
  
  // Try to match against our patterns
  for (const [pattern, subcategory] of Object.entries(urlPatternToSubcategory)) {
    if (lowerUrl.includes(pattern.toLowerCase())) {
      return subcategory;
    }
  }
  
  // For brand URLs, extract the product type
  if (lowerUrl.includes('/varumarken/')) {
    const parts = lowerUrl.split('/');
    const brandIndex = parts.indexOf('varumarken');
    if (brandIndex !== -1 && parts[brandIndex + 2]) {
      const productType = parts[brandIndex + 2];
      
      // Try to match the product type
      for (const [pattern, subcategory] of Object.entries(urlPatternToSubcategory)) {
        if (productType.includes(pattern.split('-').pop())) {
          return subcategory;
        }
      }
    }
  }
  
  return null;
}

async function populateProductsToSubcategories() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('test');
    const productsCollection = db.collection('products');
    const subcategoriesCollection = db.collection('subcategories');
    
    // First, get all existing subcategories
    console.log('Fetching existing subcategories...');
    const subcategories = await subcategoriesCollection.find({}).toArray();
    console.log(`Found ${subcategories.length} subcategories in database`);
    
    // Create a map of subcategory names/slugs to IDs
    const subcategoryMap = new Map();
    subcategories.forEach(sub => {
      // Map by name
      if (sub.name) {
        subcategoryMap.set(sub.name.toLowerCase(), sub._id.toString());
      }
      // Map by slug
      if (sub.slug) {
        subcategoryMap.set(sub.slug.toLowerCase(), sub._id.toString());
      }
      // Map by ID
      subcategoryMap.set(sub._id.toString(), sub._id.toString());
    });
    
    console.log(`Created subcategory map with ${subcategoryMap.size} entries`);
    
    // Load products with extracted categories
    console.log('\nLoading categorized products...');
    let products;
    
    // Try to load the categorized products file first
    if (fs.existsSync('products-with-categories.json')) {
      products = JSON.parse(fs.readFileSync('products-with-categories.json', 'utf8'));
      console.log(`Loaded ${products.length} products from products-with-categories.json`);
    } else {
      // Fall back to original products file
      products = JSON.parse(fs.readFileSync('products-backup-1757320722828.json', 'utf8'));
      console.log(`Loaded ${products.length} products from backup file`);
    }
    
    // Statistics
    const stats = {
      total: products.length,
      matched: 0,
      unmatched: 0,
      updated: 0,
      failed: 0,
      subcategoryDistribution: {}
    };
    
    // Process products and create bulk operations
    const bulkOps = [];
    const unmatchedProducts = [];
    
    for (const product of products) {
      const productId = product._id?.$oid || product._id || product.id;
      const sourceUrl = product.sourceUrl || product.variant_url || product.url;
      
      if (!sourceUrl) continue;
      
      // Try to extract subcategory from URL
      let subcategoryKey = extractSubcategoryFromUrl(sourceUrl);
      
      // If we have an extracted subcategory from the previous script, use it
      if (!subcategoryKey && product.extractedSubcategory) {
        subcategoryKey = product.extractedSubcategory;
      }
      
      if (subcategoryKey) {
        // Try to find the subcategory ID
        const subcategoryId = subcategoryMap.get(subcategoryKey.toLowerCase());
        
        if (subcategoryId) {
          stats.matched++;
          
          // Track distribution
          if (!stats.subcategoryDistribution[subcategoryKey]) {
            stats.subcategoryDistribution[subcategoryKey] = 0;
          }
          stats.subcategoryDistribution[subcategoryKey]++;
          
          // Create update operation
          if (productId) {
            bulkOps.push({
              updateOne: {
                filter: { _id: ObjectId.isValid(productId) ? new ObjectId(productId) : productId },
                update: {
                  $set: {
                    subcategoryId: subcategoryId,
                    subcategory: subcategoryId,
                    lastUpdated: new Date(),
                    updatedFromUrl: true
                  }
                }
              }
            });
          }
        } else {
          stats.unmatched++;
          unmatchedProducts.push({
            name: product.name,
            url: sourceUrl,
            extractedSubcategory: subcategoryKey
          });
        }
      } else {
        stats.unmatched++;
        unmatchedProducts.push({
          name: product.name,
          url: sourceUrl,
          reason: 'Could not extract subcategory from URL'
        });
      }
      
      // Execute bulk operations in batches
      if (bulkOps.length >= 1000) {
        console.log(`Updating batch of ${bulkOps.length} products...`);
        try {
          const result = await productsCollection.bulkWrite(bulkOps);
          stats.updated += result.modifiedCount;
          bulkOps.length = 0;
        } catch (error) {
          console.error('Bulk update error:', error.message);
          stats.failed += bulkOps.length;
          bulkOps.length = 0;
        }
      }
    }
    
    // Execute remaining operations
    if (bulkOps.length > 0) {
      console.log(`Updating final batch of ${bulkOps.length} products...`);
      try {
        const result = await productsCollection.bulkWrite(bulkOps);
        stats.updated += result.modifiedCount;
      } catch (error) {
        console.error('Final bulk update error:', error.message);
        stats.failed += bulkOps.length;
      }
    }
    
    // Print results
    console.log('\n========================================');
    console.log('PRODUCT SUBCATEGORY POPULATION RESULTS');
    console.log('========================================\n');
    
    console.log('STATISTICS:');
    console.log(`Total products processed: ${stats.total}`);
    console.log(`Successfully matched to subcategories: ${stats.matched} (${(stats.matched/stats.total*100).toFixed(2)}%)`);
    console.log(`Could not match to subcategories: ${stats.unmatched} (${(stats.unmatched/stats.total*100).toFixed(2)}%)`);
    console.log(`Products updated in database: ${stats.updated}`);
    console.log(`Failed updates: ${stats.failed}`);
    
    console.log('\n\nSUBCATEGORY DISTRIBUTION:');
    const sortedDistribution = Object.entries(stats.subcategoryDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    
    sortedDistribution.forEach(([subcategory, count]) => {
      console.log(`  ${subcategory}: ${count} products`);
    });
    
    if (Object.keys(stats.subcategoryDistribution).length > 20) {
      console.log(`  ... and ${Object.keys(stats.subcategoryDistribution).length - 20} more subcategories`);
    }
    
    // Show some unmatched examples
    if (unmatchedProducts.length > 0) {
      console.log('\n\nEXAMPLE UNMATCHED PRODUCTS:');
      unmatchedProducts.slice(0, 10).forEach(product => {
        console.log(`  - ${product.name}`);
        console.log(`    URL: ${product.url}`);
        if (product.extractedSubcategory) {
          console.log(`    Extracted: ${product.extractedSubcategory} (not found in database)`);
        }
        if (product.reason) {
          console.log(`    Reason: ${product.reason}`);
        }
      });
      
      if (unmatchedProducts.length > 10) {
        console.log(`  ... and ${unmatchedProducts.length - 10} more unmatched products`);
      }
    }
    
    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      statistics: stats,
      unmatchedProducts: unmatchedProducts.slice(0, 100),
      subcategoryMap: Object.fromEntries(subcategoryMap),
      urlPatterns: Object.keys(urlPatternToSubcategory)
    };
    
    fs.writeFileSync('subcategory-population-report.json', JSON.stringify(report, null, 2));
    console.log('\n\nDetailed report saved to: subcategory-population-report.json');
    
    console.log('\n✅ COMPLETED: Products have been populated to their correct subcategories!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
console.log('Starting product subcategory population...\n');
populateProductsToSubcategories();