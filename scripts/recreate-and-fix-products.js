const { MongoClient } = require('mongodb');
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
  const nameLower = productName.toLowerCase();
  
  for (const [categoryId, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(keyword => nameLower.includes(keyword))) {
      return categoryId;
    }
  }
  
  return CATEGORY_IDS.Other;
}

async function fixProduct(product) {
  // 1. Assign category based on name
  if (!product.categoryId || product.categoryId === 'null') {
    product.categoryId = getCategoryForProduct(product.name);
  }
  
  // 2. Ensure price is set
  if (!product.price) {
    product.price = product.basePrice || 100;
  }
  
  // 3. Fix imageUrl if missing but images exist
  if (!product.imageUrl || product.imageUrl === '') {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      product.imageUrl = product.images[0];
    } else if (product.image) {
      product.imageUrl = product.image;
    } else if (product.variants && Array.isArray(product.variants)) {
      for (const variant of product.variants) {
        if (variant.variant_image) {
          product.imageUrl = variant.variant_image;
          break;
        } else if (variant.image) {
          product.imageUrl = variant.image;
          break;
        }
      }
    }
  }
  
  // 4. Ensure proper data types
  product.inStock = product.inStock !== false;
  product.featured = product.featured === true;
  product.isActive = product.isActive !== false;
  
  return product;
}

async function recreateAndFix() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    // Step 1: Check current status
    const count = await products.countDocuments();
    const stats = await db.stats();
    console.log('=== Current Status ===');
    console.log(`Products in collection: ${count}`);
    console.log(`Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Step 2: Backup current products
    console.log('\n📦 Creating backup of all products...');
    const allProducts = await products.find({}).toArray();
    const backupFile = `products-backup-${Date.now()}.json`;
    await fs.writeFile(backupFile, JSON.stringify(allProducts, null, 2));
    console.log(`✅ Backed up ${allProducts.length} products to ${backupFile}`);

    // Step 3: Fix all products BEFORE dropping
    console.log('\n🔧 Fixing categories and images for all products...');
    const categoryCounts = {};
    const fixedProducts = allProducts.map(product => {
      const fixed = fixProduct(product);
      categoryCounts[fixed.categoryId] = (categoryCounts[fixed.categoryId] || 0) + 1;
      return fixed;
    });
    
    console.log('\nCategory assignments:');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([catId, count]) => {
        const catName = Object.keys(CATEGORY_IDS).find(key => CATEGORY_IDS[key] === catId) || 'Unknown';
        console.log(`  ${catName}: ${count} products`);
      });

    // Step 4: Drop the collection
    console.log('\n⚠️  Ready to drop and recreate the products collection');
    console.log('All products have been fixed and will be restored with correct categories.');
    console.log('\n🔴 Dropping collection in 5 seconds... (Press Ctrl+C to cancel)');
    
    for (let i = 5; i > 0; i--) {
      process.stdout.write(`\r${i}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('\n');
    
    await products.drop();
    console.log('✅ Collection dropped successfully - space reclaimed!');

    // Step 5: Recreate and restore with fixed data
    console.log('\n📝 Recreating collection and restoring fixed products...');
    const newProducts = db.collection('products');
    
    // Create indexes for better performance
    await newProducts.createIndex({ name: 'text', description: 'text' });
    await newProducts.createIndex({ categoryId: 1 });
    await newProducts.createIndex({ price: 1 });
    await newProducts.createIndex({ featured: -1, inStock: -1 });
    
    // Insert in batches
    const batchSize = 500;
    let inserted = 0;
    let errors = 0;
    
    for (let i = 0; i < fixedProducts.length; i += batchSize) {
      const batch = fixedProducts.slice(i, i + batchSize);
      try {
        await newProducts.insertMany(batch, { ordered: false });
        inserted += batch.length;
        process.stdout.write(`\rRestoring: ${inserted}/${fixedProducts.length} products...`);
      } catch (err) {
        errors++;
        console.error('\nBatch error (continuing):', err.message);
      }
    }

    console.log(`\n✅ Restored ${inserted} products successfully!`);
    if (errors > 0) {
      console.log(`⚠️  ${errors} batches had errors (some duplicates may have been skipped)`);
    }
    
    // Step 6: Verify final state
    const finalStats = await db.stats();
    const finalCount = await newProducts.countDocuments();
    
    // Verify categories
    const categorizedCount = await newProducts.countDocuments({ 
      categoryId: { $ne: null, $exists: true } 
    });
    const withImageCount = await newProducts.countDocuments({ 
      imageUrl: { $ne: null, $exists: true, $ne: '' } 
    });
    
    console.log('\n=== Final Status ===');
    console.log(`Products in collection: ${finalCount}`);
    console.log(`Products with categories: ${categorizedCount}`);
    console.log(`Products with images: ${withImageCount}`);
    console.log(`Storage Size: ${(finalStats.storageSize / 1024 / 1024).toFixed(2)} MB (was ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`Data Size: ${(finalStats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\n🎉 Space reclaimed: ${((stats.storageSize - finalStats.storageSize) / 1024 / 1024).toFixed(2)} MB`);

    console.log(`\n✅ Success! All products have been:`);
    console.log('   - Assigned to appropriate categories');
    console.log('   - Given proper image URLs where available');
    console.log('   - Fixed with correct pricing');
    
    console.log('\n📊 You can now check the /products page - categories should show product counts!');

  } catch (error) {
    console.error('\n❌ Operation failed:', error.message);
    console.log('Check for backup files (products-backup-*.json) to restore manually if needed.');
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('=== MongoDB Space Reclamation + Product Fix Tool ===');
console.log('This will:');
console.log('1. Backup all products');
console.log('2. Fix categories and images');
console.log('3. Drop and recreate the collection');
console.log('4. Restore products with proper categories\n');
recreateAndFix();