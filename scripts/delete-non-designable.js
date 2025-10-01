const { MongoClient } = require('mongodb');
require('dotenv').config();

async function deleteNonDesignableProducts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const products = db.collection('products');

    // Keywords for products to DELETE (non-designable items)
    const deleteKeywords = [
      // Food & Consumables
      'godis', 'candy', 'snacks', 'chips', 'choklad', 'chocolate', 'kaffe', 'coffee',
      'te', 'tea', 'dryck', 'drink', 'läsk', 'soda', 'juice', 'vatten', 'water',
      'mat', 'food', 'frukt', 'fruit', 'grönsak', 'vegetable', 'kött', 'meat',
      'fisk', 'fish', 'ost', 'cheese', 'mjölk', 'milk', 'bröd', 'bread',
      'pasta', 'ris', 'rice', 'krydda', 'spice', 'sås', 'sauce', 'olja', 'oil',
      'vin', 'wine', 'öl', 'beer', 'sprit', 'liquor', 'alkohol', 'alcohol',
      
      // Flags & Banners (non-customizable ones)
      'flagga', 'flag', 'banner', 'vimpel', 'pennant',
      
      // Electronics & Tech (usually not designable)
      'kabel', 'cable', 'laddare', 'charger', 'batteri', 'battery', 'hörlur', 'headphone',
      'elektronik', 'electronic', 'usb', 'hdmi', 'adapter', 'powerbank',
      
      // Office supplies (non-designable)
      'penna', 'pen', 'blyerts', 'pencil', 'sudd', 'eraser', 'häftapparat', 'stapler',
      'gem', 'paperclip', 'tejp', 'tape', 'lim', 'glue', 'sax', 'scissor',
      
      // Tools & Hardware
      'verktyg', 'tool', 'hammare', 'hammer', 'skruv', 'screw', 'spik', 'nail',
      'såg', 'saw', 'borr', 'drill', 'tång', 'plier',
      
      // Cleaning supplies
      'rengöring', 'cleaning', 'tvål', 'soap', 'schampo', 'shampoo', 'tvättmedel', 'detergent',
      
      // Medical/Health
      'medicin', 'medicine', 'plåster', 'bandage', 'vitamin', 'piller', 'pill',
      
      // Random non-designable items
      'batteri', 'battery', 'glödlampa', 'lightbulb', 'säkring', 'fuse'
    ];

    // Keywords for products to KEEP (designable items)
    const keepKeywords = [
      't-shirt', 'tshirt', 'shirt', 'hoodie', 'tröja', 'jacket', 'jacka',
      'byxa', 'pants', 'shorts', 'kjol', 'skirt', 'klänning', 'dress',
      'mugg', 'mug', 'kopp', 'cup', 'bok', 'book', 'anteckningsbok', 'notebook',
      'väska', 'bag', 'ryggsäck', 'backpack', 'portfölj', 'portfolio',
      'keps', 'cap', 'hatt', 'hat', 'mössa', 'beanie',
      'case', 'fodral', 'skal', 'cover',
      'kudde', 'pillow', 'handduk', 'towel',
      'canvas', 'poster', 'print', 'tavla',
      'mousepad', 'musmatta', 'underlägg', 'coaster'
    ];

    // Build query to find products to delete
    const nameRegex = new RegExp(deleteKeywords.join('|'), 'i');
    const keepRegex = new RegExp(keepKeywords.join('|'), 'i');

    // First, let's see what we'll delete
    console.log('Analyzing products to delete...\n');
    
    const toDelete = await products.find({
      $and: [
        { name: { $regex: nameRegex } },  // Matches delete keywords
        { name: { $not: { $regex: keepRegex } } }  // Doesn't match keep keywords
      ]
    }).limit(100).toArray();

    console.log(`Found ${toDelete.length} products matching deletion criteria (showing first 100)\n`);
    
    // Group by type for summary
    const summary = {};
    toDelete.forEach(p => {
      let category = 'other';
      const nameLower = p.name.toLowerCase();
      
      if (nameLower.match(/flag|banner|vimpel/i)) category = 'flags';
      else if (nameLower.match(/godis|candy|choklad|chocolate|kaffe|coffee|te|tea|dryck|drink|mat|food/i)) category = 'food/drinks';
      else if (nameLower.match(/kabel|cable|laddare|charger|batteri|elektronik|usb/i)) category = 'electronics';
      else if (nameLower.match(/verktyg|tool|hammare|skruv/i)) category = 'tools';
      else if (nameLower.match(/penna|pen|blyerts|häftapparat|gem/i)) category = 'office';
      else if (nameLower.match(/rengöring|cleaning|tvål|soap|schampo/i)) category = 'cleaning';
      
      summary[category] = (summary[category] || 0) + 1;
    });

    console.log('Products to delete by category:');
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} products`);
    });

    // Show some examples
    console.log('\nExample products to be deleted:');
    toDelete.slice(0, 10).forEach(p => {
      console.log(`  - ${p.name}`);
    });

    // Count total that would be deleted
    const totalToDelete = await products.countDocuments({
      $and: [
        { name: { $regex: nameRegex } },
        { name: { $not: { $regex: keepRegex } } }
      ]
    });

    console.log(`\nTotal products to delete: ${totalToDelete}`);
    console.log('This will help free up database space.');
    console.log('\nDeleting in 5 seconds... (Ctrl+C to cancel)');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Delete the products
    const result = await products.deleteMany({
      $and: [
        { name: { $regex: nameRegex } },
        { name: { $not: { $regex: keepRegex } } }
      ]
    });
    
    console.log(`\n✅ Deleted ${result.deletedCount} non-designable products`);

    // Show remaining count
    const remaining = await products.countDocuments();
    console.log(`Remaining products in database: ${remaining}`);
    
    // Calculate approximate space saved (rough estimate)
    const avgDocSize = 9; // ~9KB per product based on earlier stats
    const spaceSaved = (result.deletedCount * avgDocSize) / 1024;
    console.log(`Estimated space freed: ~${spaceSaved.toFixed(2)} MB`);

  } catch (error) {
    console.error('Delete failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Starting deletion of non-designable products...');
console.log('This will remove: food, drinks, flags, electronics, tools, etc.');
console.log('This will KEEP: clothing, mugs, books, bags, and other designable items.\n');
deleteNonDesignableProducts();