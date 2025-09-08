const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixAllUncategorized() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db(process.env.MONGODB_DB || 'printwrap');
    const products = db.collection('products');
    const categories = db.collection('categories');

    // Get all categories
    const allCategories = await categories.find({}).toArray();
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id.toString();
    });

    console.log('Available categories:', Object.keys(categoryMap).join(', '));

    // Category assignment rules based on product names
    const categoryRules = {
      'Apparel': [
        't-shirt', 'tshirt', 'shirt', 'hoodie', 'tröja', 'jacka', 'jacket',
        'byxa', 'pants', 'shorts', 'kjol', 'skirt', 'klänning', 'dress',
        'kläder', 'clothes', 'overall', 'rock', 'blazer', 'kostym', 'suit',
        'polo', 'piké', 'pike', 'sweatshirt', 'fleece', 'softshell'
      ],
      'Bags': [
        'väska', 'bag', 'ryggsäck', 'backpack', 'portfölj', 'portfolio',
        'resväska', 'luggage', 'suitcase', 'duffel', 'tote', 'shopper',
        'axelväska', 'messenger', 'kasse', 'pouch'
      ],
      'Drinkware': [
        'mugg', 'mug', 'kopp', 'cup', 'glas', 'glass', 'flaska', 'bottle',
        'termos', 'thermos', 'tumbler', 'vattenflaska', 'water bottle'
      ],
      'Accessories': [
        'keps', 'cap', 'hatt', 'hat', 'mössa', 'beanie', 'halsduk', 'scarf',
        'vantar', 'gloves', 'bälte', 'belt', 'solglasögon', 'sunglasses',
        'klocka', 'watch', 'armband', 'bracelet', 'smycke', 'jewelry'
      ],
      'Tech Accessories': [
        'case', 'fodral', 'skal', 'cover', 'hörlurar', 'headphone', 'powerbank',
        'laddare', 'charger', 'kabel', 'cable', 'usb', 'adapter', 'mus', 'mouse',
        'tangentbord', 'keyboard', 'musmatta', 'mousepad'
      ],
      'Office & Supplies': [
        'penna', 'pen', 'blyerts', 'pencil', 'anteckningsbok', 'notebook',
        'block', 'notepad', 'kalendar', 'calendar', 'dagbok', 'diary',
        'mapp', 'folder', 'häftapparat', 'stapler', 'gem', 'paperclip',
        'kontor', 'office', 'skrivbord', 'desk'
      ],
      'Promotional Items': [
        'nyckelring', 'keyring', 'keychain', 'lanyard', 'badge', 'pin',
        'klistermärke', 'sticker', 'magnet', 'reflex', 'reflector',
        'parasoll', 'umbrella', 'paraply', 'fläkt', 'fan'
      ],
      'Textiles': [
        'handduk', 'towel', 'filt', 'blanket', 'kudde', 'pillow',
        'lakan', 'sheet', 'pläd', 'throw', 'textil', 'textile'
      ],
      'Toys & Games': [
        'leksak', 'toy', 'spel', 'game', 'pussel', 'puzzle', 'boll', 'ball',
        'nallebjörn', 'teddy', 'docka', 'doll'
      ],
      'Safety': [
        'hjälm', 'helmet', 'skydd', 'protection', 'varsel', 'hi-vis',
        'safety', 'säkerhet', 'mask', 'gloves', 'goggles'
      ]
    };

    // Find ALL products that need categorization
    const allProducts = await products.find({}).toArray();
    const needsCategorization = allProducts.filter(p => {
      return p.categoryId === 'uncategorized' || 
             p.categoryId === null || 
             p.categoryId === undefined ||
             !allCategories.some(cat => cat._id.toString() === p.categoryId);
    });

    console.log(`\nFound ${needsCategorization.length} products needing categorization out of ${allProducts.length} total\n`);

    if (needsCategorization.length === 0) {
      console.log('No products need categorization!');
      return;
    }

    // Process in batches
    const batchSize = 100;
    const categoryCounts = {};
    let processed = 0;

    for (let i = 0; i < needsCategorization.length; i += batchSize) {
      const batch = needsCategorization.slice(i, Math.min(i + batchSize, needsCategorization.length));
      const updates = [];

      for (const product of batch) {
        let assignedCategory = null;
        
        if (product.name) {
          const nameLower = product.name.toLowerCase();
          
          // Try to match product name with category rules
          for (const [categoryName, keywords] of Object.entries(categoryRules)) {
            if (keywords.some(keyword => nameLower.includes(keyword))) {
              assignedCategory = categoryName;
              break;
            }
          }
        }

        // Default to "Other" if no match
        if (!assignedCategory) {
          assignedCategory = 'Other';
        }

        const categoryId = categoryMap[assignedCategory];
        if (categoryId) {
          updates.push({
            updateOne: {
              filter: { _id: product._id },
              update: { 
                $set: { 
                  categoryId: categoryId,
                  // Also ensure price is set
                  price: product.price || product.basePrice || 100
                }
              }
            }
          });

          categoryCounts[assignedCategory] = (categoryCounts[assignedCategory] || 0) + 1;
        }
      }

      // Execute batch update
      if (updates.length > 0) {
        const result = await products.bulkWrite(updates);
        processed += updates.length;
        console.log(`Processed ${processed}/${needsCategorization.length} products (${result.modifiedCount} updated)`);
      }
    }

    console.log('\n=== Category Assignment Summary ===');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} products`);
      });

    // Verify the update
    const stillUncategorized = await products.countDocuments({
      $or: [
        { categoryId: 'uncategorized' },
        { categoryId: null },
        { categoryId: { $exists: false } }
      ]
    });
    console.log(`\nProducts still needing categorization: ${stillUncategorized}`);

    // Show category counts
    console.log('\n=== Final Category Counts ===');
    for (const cat of allCategories) {
      const count = await products.countDocuments({ categoryId: cat._id.toString() });
      if (count > 0) {
        console.log(`  ${cat.name}: ${count} products`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Fixing all uncategorized products...');
fixAllUncategorized();