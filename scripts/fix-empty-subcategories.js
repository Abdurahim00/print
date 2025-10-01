const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

async function fixEmptySubcategories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('printwrap-pro');
    const products = db.collection('products');
    const subcategories = db.collection('subcategories');
    
    // Read the backup JSON file
    console.log('Reading products from backup JSON file...');
    const jsonContent = fs.readFileSync('products-backup-1757320722828.json', 'utf8');
    const backupProducts = JSON.parse(jsonContent);
    console.log(`Found ${backupProducts.length} products in backup file\n`);
    
    // Get all subcategories
    const allSubcategories = await subcategories.find({}).toArray();
    
    // Create comprehensive mapping for empty subcategories
    const subcategoryMappings = {
      // Bathrobes
      'bathrobes': {
        id: null,
        keywords: ['badrock', 'morgonrock', 'bathrobe', 'robe', 'velourbadrock']
      },
      'morgonrockar': {
        id: null,
        keywords: ['badrock', 'morgonrock', 'bathrobe', 'robe']
      },
      
      // Blazers
      'blazers': {
        id: null,
        keywords: ['kavaj', 'blazer', 'suit jacket', 'damkavaj', 'herrkavaj']
      },
      'kavajer': {
        id: null,
        keywords: ['kavaj', 'blazer', 'damkavaj', 'herrkavaj']
      },
      
      // Cardigans
      'cardigans': {
        id: null,
        keywords: ['cardigan', 'kofta']
      },
      
      // Men's specific
      "men's t-shirts": {
        id: null,
        keywords: ['herr t-shirt', 'men t-shirt', "men's t-shirt", 'herr tee']
      },
      'herr t shirt': {
        id: null,
        keywords: ['herr t-shirt', 'herr tee', 't-shirt herr']
      },
      "men's shirts": {
        id: null,
        keywords: ['herrskjorta', "men's shirt", 'skjorta herr', 'herr skjorta']
      },
      'herrskjortor': {
        id: null,
        keywords: ['herrskjorta', 'skjorta herr', 'herr skjorta']
      },
      "men's polo shirts": {
        id: null,
        keywords: ['herr polo', 'herr pike', 'piké herr', 'polo herr']
      },
      'piketrojor herr': {
        id: null,
        keywords: ['herr pike', 'piké herr', 'polo herr', 'herr polo']
      },
      
      // Women's specific
      "women's t-shirts": {
        id: null,
        keywords: ['dam t-shirt', 'women t-shirt', "women's t-shirt", 'dam tee', 'lady t-shirt']
      },
      'dam t shirt': {
        id: null,
        keywords: ['dam t-shirt', 'dam tee', 't-shirt dam', 'lady']
      },
      "women's shirts": {
        id: null,
        keywords: ['damskjorta', "women's shirt", 'skjorta dam', 'dam skjorta', 'blus']
      },
      'damskjortor': {
        id: null,
        keywords: ['damskjorta', 'skjorta dam', 'dam skjorta', 'blus']
      },
      "women's polo shirts": {
        id: null,
        keywords: ['dam polo', 'dam pike', 'piké dam', 'polo dam', 'lady polo']
      },
      'piketrojor dam': {
        id: null,
        keywords: ['dam pike', 'piké dam', 'polo dam', 'dam polo']
      },
      "women's sweaters": {
        id: null,
        keywords: ['damtröja', 'dam tröja', 'sweater dam', 'tröja dam']
      },
      'damtrojor': {
        id: null,
        keywords: ['damtröja', 'dam tröja', 'tröja dam']
      },
      
      // Kids specific
      'kids clothing': {
        id: null,
        keywords: ['barn kläder', 'barnkläder', 'kids wear', 'children clothing']
      },
      'profilklader barn': {
        id: null,
        keywords: ['barnkläder', 'barn kläder', 'junior kläder']
      },
      'kids t-shirts': {
        id: null,
        keywords: ['barn t-shirt', 'junior t-shirt', 'kids tee', 't-shirt barn']
      },
      'barn t shirt': {
        id: null,
        keywords: ['barn t-shirt', 'junior t-shirt', 't-shirt barn', 't-shirt jr']
      },
      'kids polo shirts': {
        id: null,
        keywords: ['barn polo', 'junior polo', 'barn pike', 'piké barn']
      },
      'piketrojor barn': {
        id: null,
        keywords: ['barn pike', 'piké barn', 'polo barn', 'junior polo']
      },
      'kids sweaters': {
        id: null,
        keywords: ['barntröja', 'barn tröja', 'junior tröja', 'tröja barn']
      },
      'barntrojor': {
        id: null,
        keywords: ['barntröja', 'barn tröja', 'tröja barn', 'junior sweater']
      },
      
      // Organic
      'organic clothing': {
        id: null,
        keywords: ['ekologisk', 'organic', 'eko ', 'ecological']
      },
      'ekologiska profilklader': {
        id: null,
        keywords: ['ekologisk', 'eko kläder', 'organic clothing']
      },
      'organic t-shirts': {
        id: null,
        keywords: ['ekologisk t-shirt', 'organic t-shirt', 'eko t-shirt', 'organic tee']
      },
      'ekologiska t shirt': {
        id: null,
        keywords: ['ekologisk t-shirt', 'eko t-shirt', 'organic cotton t']
      },
      'organic polo shirts': {
        id: null,
        keywords: ['ekologisk polo', 'organic polo', 'eko polo', 'ekologisk pike']
      },
      'ekologiska piketrojor': {
        id: null,
        keywords: ['ekologisk pike', 'eko polo', 'organic polo']
      },
      'organic shirts': {
        id: null,
        keywords: ['ekologisk skjorta', 'organic shirt', 'eko skjorta']
      },
      'ekologiska skjortor': {
        id: null,
        keywords: ['ekologisk skjorta', 'eko skjorta', 'organic cotton shirt']
      },
      'organic sweaters': {
        id: null,
        keywords: ['ekologisk tröja', 'organic sweater', 'eko tröja']
      },
      'ekologiska trojor': {
        id: null,
        keywords: ['ekologisk tröja', 'eko tröja', 'organic cotton sweater']
      },
      
      // Fair Trade
      'fair trade t-shirts': {
        id: null,
        keywords: ['fairtrade t-shirt', 'fair trade t-shirt', 'fairtrade tee']
      },
      'fairtrade t shirt': {
        id: null,
        keywords: ['fairtrade t-shirt', 'fair trade tee', 'fairtrade märkt t-shirt']
      },
      'fair trade polo shirts': {
        id: null,
        keywords: ['fairtrade polo', 'fair trade polo', 'fairtrade pike']
      },
      'fairtrade piketrojor': {
        id: null,
        keywords: ['fairtrade pike', 'fair trade polo', 'fairtrade märkt polo']
      },
      
      // Budget/Cheap
      'budget t-shirts': {
        id: null,
        keywords: ['billig t-shirt', 'budget t-shirt', 'cheap tee', 'ekonomi t-shirt']
      },
      'billiga t shirt': {
        id: null,
        keywords: ['billig t-shirt', 'billiga tees', 'budget tröja']
      },
      'budget polo shirts': {
        id: null,
        keywords: ['billig polo', 'budget polo', 'cheap polo', 'ekonomi polo']
      },
      'billiga piketrojor': {
        id: null,
        keywords: ['billig pike', 'billiga polo', 'budget piké']
      },
      'budget shirts': {
        id: null,
        keywords: ['billig skjorta', 'budget shirt', 'cheap shirt', 'ekonomi skjorta']
      },
      'billiga skjortor': {
        id: null,
        keywords: ['billig skjorta', 'billiga skjortor', 'budget skjorta']
      },
      
      // Styles
      'v-neck t-shirts': {
        id: null,
        keywords: ['v-neck', 'v neck', 'v-ringad', 'v-hals', 'v-neckline']
      },
      'v ringade t shirt': {
        id: null,
        keywords: ['v-ringad', 'v-hals', 'v neck t-shirt']
      },
      'v-neck sweaters': {
        id: null,
        keywords: ['v-neck sweater', 'v-ringad tröja', 'v-hals tröja']
      },
      'v ringade trojor': {
        id: null,
        keywords: ['v-ringad tröja', 'v-hals tröja', 'v neck sweater']
      },
      'crew neck sweaters': {
        id: null,
        keywords: ['crew neck', 'rundhals', 'round neck', 'crewneck']
      },
      'rundhalsade trojor': {
        id: null,
        keywords: ['rundhals tröja', 'round neck', 'crew neck']
      },
      'long sleeve t-shirts': {
        id: null,
        keywords: ['long sleeve', 'långärmad', 'l/s', ' ls ', 'långärm']
      },
      'langarmade t shirt': {
        id: null,
        keywords: ['långärmad t-shirt', 'long sleeve tee', 'ls t-shirt']
      },
      'long sleeve polo shirts': {
        id: null,
        keywords: ['långärmad polo', 'long sleeve polo', 'ls polo', 'långärm pike']
      },
      'langarmade piketrojor': {
        id: null,
        keywords: ['långärmad pike', 'long sleeve polo', 'ls piké']
      },
      'short sleeve shirts': {
        id: null,
        keywords: ['short sleeve', 'kortärmad', 's/s', 'kortärm']
      },
      'skjortor kort arm': {
        id: null,
        keywords: ['kortärmad skjorta', 'short sleeve shirt', 'ss shirt']
      },
      
      // Performance
      'performance t-shirts': {
        id: null,
        keywords: ['performance', 'funktion', 'technical', 'sport t-shirt', 'tränings t-shirt']
      },
      'funktions t shirt': {
        id: null,
        keywords: ['funktions t-shirt', 'sport tee', 'träningströja']
      },
      'performance polo shirts': {
        id: null,
        keywords: ['performance polo', 'funktion polo', 'sport polo', 'tränings polo']
      },
      'piketrojor funktion': {
        id: null,
        keywords: ['funktions pike', 'sport polo', 'tränings piké']
      },
      
      // Other clothing
      'knit sweaters': {
        id: null,
        keywords: ['stickad tröja', 'knitted sweater', 'stickat', 'knit']
      },
      'stickade trojor': {
        id: null,
        keywords: ['stickad tröja', 'stickat', 'knitted']
      },
      'base layer tops': {
        id: null,
        keywords: ['underställ', 'base layer', 'thermal', 'long underwear']
      },
      'understallstrojor': {
        id: null,
        keywords: ['underställströja', 'base layer', 'thermal top']
      },
      'fleece sweaters': {
        id: null,
        keywords: ['fleecetröja', 'fleece sweater', 'fleece top', 'polar fleece']
      },
      'fleecetrojor': {
        id: null,
        keywords: ['fleecetröja', 'fleece', 'polar tröja']
      },
      'polo sweaters': {
        id: null,
        keywords: ['polotröja', 'polo sweater', 'knitted polo']
      },
      'polotrojor': {
        id: null,
        keywords: ['polotröja', 'polo sweater', 'stickad polo']
      },
      'ponchos': {
        id: null,
        keywords: ['poncho', 'regnponcho', 'cape']
      },
      'poncho': {
        id: null,
        keywords: ['poncho', 'regnponcho', 'rain poncho']
      },
      
      // Giveaway items
      'bike seat covers': {
        id: null,
        keywords: ['sadelskydd', 'sadel skydd', 'bike seat cover', 'cykel sadel']
      },
      'sadelskydd': {
        id: null,
        keywords: ['sadelskydd', 'cykel sadel', 'bike seat']
      }
    };
    
    // Map subcategory names/slugs to their IDs
    allSubcategories.forEach(sub => {
      const nameLower = sub.name.toLowerCase();
      const slugLower = sub.slug.toLowerCase();
      const swedishLower = sub.swedishName?.toLowerCase();
      
      if (subcategoryMappings[nameLower]) {
        subcategoryMappings[nameLower].id = sub._id;
      }
      if (subcategoryMappings[slugLower]) {
        subcategoryMappings[slugLower].id = sub._id;
      }
      if (swedishLower && subcategoryMappings[swedishLower]) {
        subcategoryMappings[swedishLower].id = sub._id;
      }
    });
    
    // Process products
    const updates = [];
    const stats = {
      bathrobes: 0,
      blazers: 0,
      cardigans: 0,
      mens: 0,
      womens: 0,
      kids: 0,
      organic: 0,
      fairtrade: 0,
      other: 0
    };
    
    console.log('Processing products to fix empty subcategories...\n');
    
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
      let matchCategory = '';
      
      // Try to match based on keywords
      for (const [subcatKey, mapping] of Object.entries(subcategoryMappings)) {
        if (!mapping.id) continue; // Skip if we don't have the subcategory ID
        
        for (const keyword of mapping.keywords) {
          if (combinedText.includes(keyword.toLowerCase())) {
            matchedSubcategoryId = mapping.id;
            
            // Track stats
            if (subcatKey.includes('bathrobe') || subcatKey.includes('morgonrock')) stats.bathrobes++;
            else if (subcatKey.includes('blazer') || subcatKey.includes('kavaj')) stats.blazers++;
            else if (subcatKey.includes('cardigan')) stats.cardigans++;
            else if (subcatKey.includes("men's") || subcatKey.includes('herr')) stats.mens++;
            else if (subcatKey.includes("women's") || subcatKey.includes('dam')) stats.womens++;
            else if (subcatKey.includes('kids') || subcatKey.includes('barn')) stats.kids++;
            else if (subcatKey.includes('organic') || subcatKey.includes('ekologisk')) stats.organic++;
            else if (subcatKey.includes('fair') || subcatKey.includes('fairtrade')) stats.fairtrade++;
            else stats.other++;
            
            matchCategory = subcatKey;
            break;
          }
        }
        if (matchedSubcategoryId) break;
      }
      
      // Create update if matched
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
      console.log(`\nExecuting ${updates.length} updates to fix empty subcategories...`);
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
    console.log('\n=== PRODUCTS ASSIGNED TO PREVIOUSLY EMPTY SUBCATEGORIES ===');
    console.log(`Bathrobes: ${stats.bathrobes} products`);
    console.log(`Blazers: ${stats.blazers} products`);
    console.log(`Cardigans: ${stats.cardigans} products`);
    console.log(`Men's specific: ${stats.mens} products`);
    console.log(`Women's specific: ${stats.womens} products`);
    console.log(`Kids specific: ${stats.kids} products`);
    console.log(`Organic: ${stats.organic} products`);
    console.log(`Fair Trade: ${stats.fairtrade} products`);
    console.log(`Other: ${stats.other} products`);
    console.log(`Total: ${updates.length} products reassigned`);
    
    // Check how many subcategories are still empty
    console.log('\n=== CHECKING REMAINING EMPTY SUBCATEGORIES ===');
    let emptyCount = 0;
    let populatedCount = 0;
    
    for (const subcat of allSubcategories) {
      const count = await products.countDocuments({ subcategoryId: subcat._id });
      if (count === 0) {
        emptyCount++;
      } else {
        populatedCount++;
      }
    }
    
    console.log(`Empty subcategories: ${emptyCount}`);
    console.log(`Populated subcategories: ${populatedCount}`);
    console.log(`Total subcategories: ${allSubcategories.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Fixing empty subcategories by properly matching products...\n');
fixEmptySubcategories();