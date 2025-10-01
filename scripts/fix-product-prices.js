const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
require('dotenv').config();

async function fixProductPrices() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    // Read both backup and 60k.json for prices
    console.log('📖 Reading price data from backup and 60k.json...');
    
    // Read backup for basePrice
    const backupContent = await fs.readFile('products-backup-1757320722828.json', 'utf8');
    const backupProducts = JSON.parse(backupContent);
    
    // Read 60k.json for price_after_tax
    const jsonContent = await fs.readFile('60k.json', 'utf8');
    const jsonProducts = JSON.parse(jsonContent);
    
    console.log(`✅ Found ${backupProducts.length} products in backup`);
    console.log(`✅ Found ${jsonProducts.length} products in 60k.json\n`);

    // Create price maps
    const backupPriceMap = {};
    backupProducts.forEach(product => {
      if (product._id && product.basePrice) {
        const id = typeof product._id === 'object' && product._id.$oid ? 
          product._id.$oid : product._id.toString();
        backupPriceMap[id] = product.basePrice;
      }
    });

    const jsonPriceMap = {};
    jsonProducts.forEach(product => {
      if (product.Title && product.price_after_tax) {
        // Extract numeric price from string like "750.00 kr"
        const priceStr = product.price_after_tax.replace(/\s/g, '');
        const match = priceStr.match(/[\d,]+\.?\d*/);
        if (match) {
          const price = parseFloat(match[0].replace(',', '.'));
          jsonPriceMap[product.Title] = price;
        }
      }
    });

    console.log(`Found ${Object.keys(backupPriceMap).length} prices in backup`);
    console.log(`Found ${Object.keys(jsonPriceMap).length} prices in 60k.json\n`);

    // Get all products
    const allProducts = await products.find({}).toArray();
    console.log(`Processing ${allProducts.length} products...\n`);

    // Prepare updates
    const updates = [];
    let fixedCount = 0;
    let priceStats = {
      under100: 0,
      from100to1000: 0,
      from1000to5000: 0,
      from5000to10000: 0,
      over10000: 0
    };

    for (const product of allProducts) {
      const id = product._id.toString();
      let newPrice = null;
      
      // First try to get price from backup
      if (backupPriceMap[id]) {
        newPrice = backupPriceMap[id];
      }
      // If not in backup or price seems wrong, try from 60k.json by name
      else if (product.name && jsonPriceMap[product.name]) {
        newPrice = jsonPriceMap[product.name];
      }
      
      // If we found a price and it's different from current
      if (newPrice && newPrice !== product.price) {
        updates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { 
              $set: { 
                price: newPrice,
                basePrice: newPrice  // Also update basePrice for consistency
              }
            }
          }
        });
        fixedCount++;
        
        // Track price distribution
        if (newPrice < 100) priceStats.under100++;
        else if (newPrice < 1000) priceStats.from100to1000++;
        else if (newPrice < 5000) priceStats.from1000to5000++;
        else if (newPrice < 10000) priceStats.from5000to10000++;
        else priceStats.over10000++;
      }
    }

    console.log(`Found ${fixedCount} products needing price fixes`);
    console.log('\nNew price distribution:');
    console.log(`  Under 100 SEK: ${priceStats.under100}`);
    console.log(`  100-1,000 SEK: ${priceStats.from100to1000}`);
    console.log(`  1,000-5,000 SEK: ${priceStats.from1000to5000}`);
    console.log(`  5,000-10,000 SEK: ${priceStats.from5000to10000}`);
    console.log(`  Over 10,000 SEK: ${priceStats.over10000}`);

    // Execute batch update
    if (updates.length > 0) {
      console.log(`\n🔧 Updating ${updates.length} product prices...`);
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
      console.log('\n✅ Prices updated!\n');
    } else {
      console.log('\n✅ All prices are already correct!\n');
    }

    // Verify the fix
    const priceStats2 = await products.aggregate([
      { $match: { price: { $exists: true } } },
      { $group: {
        _id: null,
        min: { $min: '$price' },
        max: { $max: '$price' },
        avg: { $avg: '$price' },
        count: { $sum: 1 }
      }}
    ]).toArray();
    
    console.log('=== Final Price Statistics ===');
    if (priceStats2[0]) {
      console.log(`Min price: ${priceStats2[0].min} SEK`);
      console.log(`Max price: ${priceStats2[0].max} SEK`);
      console.log(`Average price: ${priceStats2[0].avg.toFixed(2)} SEK`);
      console.log(`Products with price: ${priceStats2[0].count}`);
    }
    
    // Check for any remaining suspicious prices
    const suspiciousCount = await products.countDocuments({ 
      $or: [
        { price: { $lt: 10 } },
        { price: { $gt: 50000 } }
      ]
    });
    
    if (suspiciousCount > 0) {
      console.log(`\n⚠️  Still ${suspiciousCount} products with unusual prices (< 10 SEK or > 50,000 SEK)`);
      const examples = await products.find({ 
        $or: [
          { price: { $lt: 10 } },
          { price: { $gt: 50000 } }
        ]
      }).limit(5).toArray();
      
      console.log('Examples:');
      examples.forEach(p => {
        console.log(`  - ${p.name}: ${p.price} SEK`);
      });
    } else {
      console.log('\n✅ All prices look reasonable!');
    }

  } catch (error) {
    console.error('❌ Operation failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('=== Fix Product Prices Tool ===');
console.log('This will restore correct prices from backup and 60k.json\n');
fixProductPrices();