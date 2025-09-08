const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function assignCategoriesToProducts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
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

    // Process products in batches
    const batchSize = 1000;
    // Check for products with null, "uncategorized", or invalid categoryId
    const query = { 
      $or: [
        { categoryId: null },
        { categoryId: "uncategorized" },
        { categoryId: { $exists: false } },
        { categoryId: { $type: "string", $eq: "uncategorized" } }
      ]
    };
    const totalProducts = await products.countDocuments(query);
    console.log(`\nFound ${totalProducts} products without valid categories\n`);

    let processed = 0;
    const categoryCounts = {};

    while (processed < totalProducts) {
      const batch = await products.find(query)
        .skip(processed)
        .limit(batchSize)
        .toArray();

      if (batch.length === 0) break;

      const updates = [];

      for (const product of batch) {
        if (!product.name) {
          console.log(`Warning: Product ${product._id} has no name, skipping...`);
          continue;
        }
        const nameLower = product.name.toLowerCase();
        let assignedCategory = null;

        // Try to match product name with category rules
        for (const [categoryName, keywords] of Object.entries(categoryRules)) {
          if (keywords.some(keyword => nameLower.includes(keyword))) {
            assignedCategory = categoryName;
            break;
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
                  // Also set price if missing
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
        try {
          const result = await products.bulkWrite(updates);
          processed += batch.length;
          console.log(`Processed ${processed}/${totalProducts} products (${result.modifiedCount} updated)`);
        } catch (err) {
          console.error('Batch update failed:', err.message);
          break;
        }
      } else {
        processed += batch.length;
      }
    }

    console.log('\n=== Category Assignment Summary ===');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count} products`);
      });

    // Verify the update
    const stillWithoutCategory = await products.countDocuments({ categoryId: null });
    console.log(`\nProducts still without category: ${stillWithoutCategory}`);

  } catch (error) {
    console.error('Assignment failed:', error.message);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Assigning categories to products...');
assignCategoriesToProducts();