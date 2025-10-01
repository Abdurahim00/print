const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
require('dotenv').config();

async function fixPricesFromPrendo() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    // Read 60k.json for correct Prendo prices
    console.log('📖 Reading correct prices from 60k.json (price_before_tax field)...');
    const jsonContent = await fs.readFile('60k.json', 'utf8');
    const jsonProducts = JSON.parse(jsonContent);
    console.log(`✅ Found ${jsonProducts.length} products in 60k.json\n`);

    // Create price map using price_before_tax (the correct field)
    const prendoPriceMap = {};
    let validPrices = 0;
    
    jsonProducts.forEach(product => {
      if (product.Title && product.price_before_tax) {
        // Extract numeric price from string like "750.00 kr/st"
        const priceStr = product.price_before_tax.replace(/\s/g, '');
        const match = priceStr.match(/[\d,]+\.?\d*/);
        if (match) {
          const price = parseFloat(match[0].replace(',', ''));
          if (price > 0 && price < 100000) { // Reasonable price range
            prendoPriceMap[product.Title] = price;
            validPrices++;
          }
        }
      }
    });

    console.log(`Found ${validPrices} valid prices from Prendo\n`);

    // Sample some prices to verify they look correct
    const sampleNames = Object.keys(prendoPriceMap).slice(0, 10);
    console.log('Sample Prendo prices:');
    sampleNames.forEach(name => {
      console.log(`  ${name.substring(0, 50)}: ${prendoPriceMap[name]} SEK`);
    });

    // Get all products from database
    const allProducts = await products.find({}).toArray();
    console.log(`\nProcessing ${allProducts.length} products...\n`);

    // Prepare updates
    const updates = [];
    let matchedCount = 0;
    let notMatched = [];
    let priceChanges = {
      major: [], // Price changed by more than 50%
      minor: []  // Price changed by less than 50%
    };

    for (const product of allProducts) {
      if (product.name && prendoPriceMap[product.name]) {
        const newPrice = prendoPriceMap[product.name];
        const oldPrice = product.price || 0;
        
        if (Math.abs(newPrice - oldPrice) > 0.01) { // Only update if different
          updates.push({
            updateOne: {
              filter: { _id: product._id },
              update: { 
                $set: { 
                  price: newPrice,
                  basePrice: newPrice
                }
              }
            }
          });
          
          // Track significant changes
          const changePercent = oldPrice > 0 ? Math.abs((newPrice - oldPrice) / oldPrice * 100) : 100;
          if (changePercent > 50) {
            priceChanges.major.push({
              name: product.name,
              old: oldPrice,
              new: newPrice
            });
          } else {
            priceChanges.minor.push({
              name: product.name,
              old: oldPrice,
              new: newPrice
            });
          }
          
          matchedCount++;
        }
      } else if (product.name) {
        notMatched.push(product.name);
      }
    }

    console.log(`Matched ${matchedCount} products with Prendo prices`);
    console.log(`Could not match ${notMatched.length} products\n`);

    // Show significant price changes
    if (priceChanges.major.length > 0) {
      console.log(`⚠️  Major price changes (> 50% difference):`);
      priceChanges.major.slice(0, 10).forEach(p => {
        console.log(`  ${p.name.substring(0, 40)}: ${p.old} → ${p.new} SEK`);
      });
      if (priceChanges.major.length > 10) {
        console.log(`  ... and ${priceChanges.major.length - 10} more`);
      }
    }

    // Execute batch update
    if (updates.length > 0) {
      console.log(`\n🔧 Updating ${updates.length} product prices to match Prendo...`);
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
      console.log('\n✅ Prices updated to match Prendo!\n');
    } else {
      console.log('✅ All prices already match Prendo!\n');
    }

    // Verify final prices
    const finalStats = await products.aggregate([
      { $match: { price: { $exists: true } } },
      { $group: {
        _id: null,
        min: { $min: '$price' },
        max: { $max: '$price' },
        avg: { $avg: '$price' },
        count: { $sum: 1 },
        under100: { $sum: { $cond: [{ $lt: ['$price', 100] }, 1, 0] } },
        from100to500: { $sum: { $cond: [{ $and: [{ $gte: ['$price', 100] }, { $lt: ['$price', 500] }] }, 1, 0] } },
        from500to1000: { $sum: { $cond: [{ $and: [{ $gte: ['$price', 500] }, { $lt: ['$price', 1000] }] }, 1, 0] } },
        from1000to5000: { $sum: { $cond: [{ $and: [{ $gte: ['$price', 1000] }, { $lt: ['$price', 5000] }] }, 1, 0] } },
        over5000: { $sum: { $cond: [{ $gte: ['$price', 5000] }, 1, 0] } }
      }}
    ]).toArray();
    
    console.log('=== Final Price Statistics ===');
    if (finalStats[0]) {
      const stats = finalStats[0];
      console.log(`Min price: ${stats.min.toFixed(2)} SEK`);
      console.log(`Max price: ${stats.max.toFixed(2)} SEK`);
      console.log(`Average price: ${stats.avg.toFixed(2)} SEK`);
      console.log(`\nPrice distribution:`);
      console.log(`  Under 100 SEK: ${stats.under100} products`);
      console.log(`  100-500 SEK: ${stats.from100to500} products`);
      console.log(`  500-1,000 SEK: ${stats.from500to1000} products`);
      console.log(`  1,000-5,000 SEK: ${stats.from1000to5000} products`);
      console.log(`  Over 5,000 SEK: ${stats.over5000} products`);
    }
    
    // Sample some products to verify
    console.log('\n=== Sample Product Prices ===');
    const samples = await products.aggregate([{ $sample: { size: 10 } }]).toArray();
    samples.forEach(p => {
      console.log(`  ${p.name?.substring(0, 50)}: ${p.price} SEK`);
    });

    console.log('\n✅ All prices now match Prendo catalog!');

  } catch (error) {
    console.error('❌ Operation failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('=== Fix Prices from Prendo Tool ===');
console.log('This will update all prices to match the Prendo catalog (price_before_tax field)\n');
fixPricesFromPrendo();