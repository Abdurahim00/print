const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs').promises;
require('dotenv').config();

// Category mapping rules
const CATEGORY_IDS = {
  'Apparel': '68b2f79d65a5cb13315a529a',
  'Bags': '68b2f7a465a5cb13315a52bb',
  'Drinkware': '68b2f7a165a5cb13315a52ae',
  'Accessories': '68b2f7a065a5cb13315a52a7',
  'Tech Accessories': '68b2f7a365a5cb13315a52b6',
  'Office & Supplies': '68a9c487edaa349aacbf3151',
  'Promotional Items': '68b2f7a165a5cb13315a52ab',
  'Textiles': '68b2f7a265a5cb13315a52b3',
  'Toys & Games': '68b2f7a465a5cb13315a52b9',
  'Safety': '68b2f79f65a5cb13315a52a3',
  'Other': '68b2f79f65a5cb13315a52a5'
};

const CATEGORY_RULES = {
  [CATEGORY_IDS.Apparel]: [
    't-shirt', 'tshirt', 'shirt', 'hoodie', 'tröja', 'jacka', 'jacket',
    'byxa', 'pants', 'shorts', 'kjol', 'skirt', 'klänning', 'dress',
    'kläder', 'clothes', 'overall', 'rock', 'blazer', 'kostym', 'suit',
    'polo', 'piké', 'pike', 'sweatshirt', 'fleece', 'softshell', 'vest',
    'cardigan', 'pullover', 'sweater', 'jumper', 'top', 'blouse', 'tunic'
  ],
  [CATEGORY_IDS.Bags]: [
    'väska', 'bag', 'ryggsäck', 'backpack', 'portfölj', 'portfolio',
    'resväska', 'luggage', 'suitcase', 'duffel', 'tote', 'shopper',
    'axelväska', 'messenger', 'kasse', 'pouch', 'briefcase', 'satchel'
  ],
  [CATEGORY_IDS.Drinkware]: [
    'mugg', 'mug', 'kopp', 'cup', 'glas', 'glass', 'flaska', 'bottle',
    'termos', 'thermos', 'tumbler', 'vattenflaska', 'water bottle'
  ],
  [CATEGORY_IDS.Accessories]: [
    'keps', 'cap', 'hatt', 'hat', 'mössa', 'beanie', 'halsduk', 'scarf',
    'vantar', 'gloves', 'bälte', 'belt', 'solglasögon', 'sunglasses',
    'klocka', 'watch', 'armband', 'bracelet', 'smycke', 'jewelry'
  ],
  [CATEGORY_IDS['Tech Accessories']]: [
    'case', 'fodral', 'skal', 'cover', 'hörlurar', 'headphone', 'powerbank',
    'laddare', 'charger', 'kabel', 'cable', 'usb', 'adapter', 'mus', 'mouse',
    'tangentbord', 'keyboard', 'musmatta', 'mousepad', 'speaker', 'högtalare'
  ],
  [CATEGORY_IDS['Office & Supplies']]: [
    'penna', 'pen', 'blyerts', 'pencil', 'anteckningsbok', 'notebook',
    'block', 'notepad', 'kalendar', 'calendar', 'dagbok', 'diary',
    'mapp', 'folder', 'häftapparat', 'stapler', 'gem', 'paperclip'
  ],
  [CATEGORY_IDS['Promotional Items']]: [
    'nyckelring', 'keyring', 'keychain', 'lanyard', 'badge', 'pin',
    'klistermärke', 'sticker', 'magnet', 'reflex', 'reflector',
    'parasoll', 'umbrella', 'paraply', 'fläkt', 'fan'
  ],
  [CATEGORY_IDS.Textiles]: [
    'handduk', 'towel', 'filt', 'blanket', 'kudde', 'pillow',
    'lakan', 'sheet', 'pläd', 'throw', 'textil', 'textile'
  ],
  [CATEGORY_IDS['Toys & Games']]: [
    'leksak', 'toy', 'spel', 'game', 'pussel', 'puzzle', 'boll', 'ball',
    'nallebjörn', 'teddy', 'docka', 'doll', 'plush', 'mjukis'
  ],
  [CATEGORY_IDS.Safety]: [
    'hjälm', 'helmet', 'skydd', 'protection', 'varsel', 'hi-vis',
    'safety', 'säkerhet', 'mask', 'gloves', 'goggles'
  ]
};

function getCategoryForProduct(productName) {
  if (!productName) return CATEGORY_IDS.Other;
  const nameLower = productName.toLowerCase();
  
  for (const [categoryId, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(keyword => nameLower.includes(keyword))) {
      return categoryId;
    }
  }
  
  return CATEGORY_IDS.Other;
}

async function restoreProductNames() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    // Read the backup file
    console.log('📖 Reading backup file...');
    const backupContent = await fs.readFile('products-backup-1757320722828.json', 'utf8');
    const backupProducts = JSON.parse(backupContent);
    console.log(`✅ Found ${backupProducts.length} products in backup\n`);

    // Create a map of backup products by ID
    const backupMap = {};
    backupProducts.forEach(product => {
      if (product._id) {
        const id = typeof product._id === 'object' && product._id.$oid ? 
          product._id.$oid : product._id.toString();
        backupMap[id] = product;
      }
    });

    // Get all current products
    const currentProducts = await products.find({}).toArray();
    console.log(`Found ${currentProducts.length} products in database\n`);

    // Prepare batch updates
    const updates = [];
    const categoryCounts = {};
    let restored = 0;
    let withCategory = 0;
    let withImage = 0;

    for (const product of currentProducts) {
      const id = product._id.toString();
      const backupProduct = backupMap[id];
      
      if (backupProduct) {
        const updateFields = {};
        
        // Restore name
        if (backupProduct.name) {
          updateFields.name = backupProduct.name;
          updateFields.Title = backupProduct.name; // Also set Title field
          restored++;
        }
        
        // Assign category based on name
        if (backupProduct.name) {
          const categoryId = getCategoryForProduct(backupProduct.name);
          updateFields.categoryId = categoryId;
          categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
          withCategory++;
        }
        
        // Restore/fix imageUrl
        if (!product.imageUrl || product.imageUrl === '') {
          if (backupProduct.imageUrl) {
            updateFields.imageUrl = backupProduct.imageUrl;
            withImage++;
          } else if (backupProduct.images && Array.isArray(backupProduct.images) && backupProduct.images.length > 0) {
            updateFields.imageUrl = backupProduct.images[0];
            withImage++;
          } else if (backupProduct.image) {
            updateFields.imageUrl = backupProduct.image;
            withImage++;
          } else if (backupProduct.variants && Array.isArray(backupProduct.variants)) {
            for (const variant of backupProduct.variants) {
              if (variant.variant_image) {
                updateFields.imageUrl = variant.variant_image;
                withImage++;
                break;
              } else if (variant.image) {
                updateFields.imageUrl = variant.image;
                withImage++;
                break;
              }
            }
          }
        } else {
          withImage++;
        }
        
        // Ensure price is set
        if (!product.price) {
          updateFields.price = backupProduct.price || backupProduct.basePrice || 100;
        }
        
        if (Object.keys(updateFields).length > 0) {
          updates.push({
            updateOne: {
              filter: { _id: product._id },
              update: { $set: updateFields }
            }
          });
        }
      }
    }

    // Execute batch update
    if (updates.length > 0) {
      console.log(`🔧 Updating ${updates.length} products...`);
      const batchSize = 500;
      let processed = 0;
      
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        try {
          const result = await products.bulkWrite(batch);
          processed += batch.length;
          process.stdout.write(`\rProgress: ${processed}/${updates.length} products...`);
        } catch (err) {
          console.error('\nBatch update error:', err.message);
        }
      }
      console.log('\n✅ Updates completed!\n');
    }

    // Display category distribution
    console.log('=== Category Assignment Summary ===');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([catId, count]) => {
        const catName = Object.keys(CATEGORY_IDS).find(key => CATEGORY_IDS[key] === catId) || 'Unknown';
        console.log(`  ${catName}: ${count} products`);
      });

    // Verify the restoration
    const finalStats = {
      total: await products.countDocuments(),
      withName: await products.countDocuments({ name: { $exists: true, $ne: null } }),
      withCategory: await products.countDocuments({ categoryId: { $exists: true, $ne: null } }),
      withImage: await products.countDocuments({ imageUrl: { $exists: true, $ne: null, $ne: '' } })
    };

    console.log('\n=== Final Status ===');
    console.log(`Total products: ${finalStats.total}`);
    console.log(`Products with names: ${finalStats.withName}`);
    console.log(`Products with categories: ${finalStats.withCategory}`);
    console.log(`Products with images: ${finalStats.withImage}`);
    
    console.log('\n✅ Restoration complete!');
    console.log('Products now have:');
    console.log('  - Names restored from backup');
    console.log('  - Categories assigned based on product names');
    console.log('  - Images restored where available');
    console.log('\n📊 Check the /products page - categories should now show product counts!');

  } catch (error) {
    console.error('❌ Restoration failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('=== Product Name Restoration Tool ===');
console.log('This will restore product names from backup and assign categories\n');
restoreProductNames();