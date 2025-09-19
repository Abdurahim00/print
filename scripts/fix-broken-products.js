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
    'polo', 'piké', 'pike', 'sweatshirt', 'fleece', 'softshell', 'vest'
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

function fixProduct(product) {
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
  
  // 5. Convert _id if it's a string
  if (typeof product._id === 'string') {
    product._id = new ObjectId(product._id);
  }
  
  return product;
}

async function fixBrokenProducts() {
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

    // Check current state
    const currentCount = await products.countDocuments();
    const sample = await products.findOne();
    console.log(`Current products in DB: ${currentCount}`);
    console.log(`Sample product fields: ${Object.keys(sample || {}).join(', ')}\n`);

    if (Object.keys(sample || {}).length <= 1) {
      console.log('⚠️  Products are broken (only _id field exists)');
      console.log('🔧 Will drop and recreate with full data from backup\n');
      
      // Drop the broken collection
      await products.drop();
      console.log('✅ Dropped broken collection\n');
      
      // Fix all products and categorize them
      console.log('🔧 Processing and categorizing products...');
      const categoryCounts = {};
      const fixedProducts = backupProducts.map(product => {
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
      
      // Create indexes
      console.log('\n📇 Creating indexes...');
      const newProducts = db.collection('products');
      await newProducts.createIndex({ name: 'text', description: 'text' });
      await newProducts.createIndex({ categoryId: 1 });
      await newProducts.createIndex({ price: 1 });
      await newProducts.createIndex({ featured: -1, inStock: -1 });
      
      // Insert in batches
      console.log('\n📝 Inserting products with fixed data...');
      const batchSize = 500;
      let inserted = 0;
      let errors = 0;
      
      for (let i = 0; i < fixedProducts.length; i += batchSize) {
        const batch = fixedProducts.slice(i, i + batchSize);
        try {
          await newProducts.insertMany(batch, { ordered: false });
          inserted += batch.length;
          process.stdout.write(`\rProgress: ${inserted}/${fixedProducts.length} products...`);
        } catch (err) {
          errors++;
          console.error('\nBatch error (continuing):', err.message);
        }
      }
      
      console.log(`\n\n✅ Inserted ${inserted} products successfully!`);
      if (errors > 0) {
        console.log(`⚠️  ${errors} batches had errors (some duplicates may have been skipped)`);
      }
    } else {
      console.log('Products appear to have data. Not dropping collection.');
      console.log('Run a different script if you need to update existing products.');
    }

    // Verify final state
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
    
    // Get sample product to verify
    const verifyProduct = await products.findOne();
    console.log('\nSample product after fix:');
    console.log(`  Name: ${verifyProduct?.name}`);
    console.log(`  Category: ${verifyProduct?.categoryId}`);
    console.log(`  Image: ${verifyProduct?.imageUrl ? 'Yes' : 'No'}`);
    console.log(`  Price: ${verifyProduct?.price}`);
    
    console.log('\n✅ Products fixed successfully!');
    console.log('📊 Check the /products page - categories should now show product counts!');

  } catch (error) {
    console.error('❌ Operation failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('=== Fix Broken Products Tool ===');
console.log('This will restore products from backup with proper categories\n');
fixBrokenProducts();