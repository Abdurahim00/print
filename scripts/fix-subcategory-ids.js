const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function fixSubcategoryIds() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap-pro');
    const products = db.collection('products');
    const subcategories = db.collection('subcategories');
    const categories = db.collection('categories');
    
    // Get all valid subcategories
    const validSubcategories = await subcategories.find({}).toArray();
    console.log(`Found ${validSubcategories.length} valid subcategories in database\n`);
    
    // Get all categories
    const allCategories = await categories.find({}).toArray();
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat._id.toString()] = cat;
    });
    
    // Create a mapping of subcategories by category
    const subcatByCategoryId = {};
    validSubcategories.forEach(sub => {
      const catId = sub.categoryId.toString();
      if (!subcatByCategoryId[catId]) {
        subcatByCategoryId[catId] = [];
      }
      subcatByCategoryId[catId].push(sub);
    });
    
    console.log('Categories with subcategories:');
    Object.keys(subcatByCategoryId).forEach(catId => {
      const catName = categoryMap[catId]?.name || 'Unknown';
      console.log(`  ${catName}: ${subcatByCategoryId[catId].length} subcategories`);
    });
    
    // Get current subcategory IDs from products
    const currentSubcatIds = await products.distinct('subcategoryId');
    console.log(`\nProducts currently have ${currentSubcatIds.length} unique subcategoryIds`);
    
    // Check validity
    let validCount = 0;
    let invalidCount = 0;
    const invalidIds = [];
    
    for (const id of currentSubcatIds) {
      if (!id) continue;
      const exists = validSubcategories.find(sub => sub._id.equals(id));
      if (exists) {
        validCount++;
      } else {
        invalidCount++;
        invalidIds.push(id);
      }
    }
    
    console.log(`Valid subcategory IDs: ${validCount}`);
    console.log(`Invalid subcategory IDs: ${invalidCount}`);
    
    if (invalidCount > 0) {
      console.log('\nFixing invalid subcategory IDs...');
      console.log('Sample invalid IDs:', invalidIds.slice(0, 5).map(id => id.toString()));
      
      // For each product with invalid subcategoryId, reassign to a valid one
      const updates = [];
      
      // Get all products with invalid subcategoryIds
      const productsToFix = await products.find({
        subcategoryId: { $in: invalidIds }
      }).toArray();
      
      console.log(`\nFound ${productsToFix.length} products to fix`);
      
      // Enhanced keyword mapping for better matching
      const subcategoryKeywords = {
        // Apparel
        't-shirts': ['t-shirt', 'tshirt', 't shirt', 'tee', 'topp', 'linne'],
        'hoodies': ['hoodie', 'huvtröja', 'luvtröja', 'hood', 'sweat med huva'],
        'sweatshirts': ['sweatshirt', 'sweat', 'college', 'tröja', 'pullover'],
        'jackets': ['jacka', 'jacket', 'rock', 'coat', 'windbreaker', 'softshell'],
        'pants': ['byxa', 'byxor', 'pants', 'trousers', 'jeans'],
        'shorts': ['shorts', 'short', 'kortbyxa'],
        'fleece': ['fleece', 'flis'],
        'softshell': ['softshell', 'soft shell'],
        'vests': ['väst', 'vest', 'bodywarmer'],
        'shirts': ['skjorta', 'shirt', 'blus'],
        'polos': ['polo', 'pike', 'piké'],
        'caps': ['keps', 'cap', 'snapback'],
        'beanies': ['mössa', 'beanie', 'hat'],
        'scarves': ['halsduk', 'scarf', 'schal'],
        
        // Drinkware
        'bottles': ['flaska', 'bottle', 'vattenflaska', 'sportflaska'],
        'mugs': ['mugg', 'mug', 'kopp', 'cup'],
        'thermos': ['termos', 'thermos', 'termosmugg'],
        
        // Bags
        'bags': ['väska', 'bag', 'ryggsäck', 'backpack', 'resväska'],
        'tote bags': ['tote', 'kasse', 'shoppingväska', 'shopping'],
        
        // Accessories
        'umbrellas': ['paraply', 'umbrella'],
        
        // Other/Miscellaneous - will be default
        'miscellaneous': ['misc', 'övrigt', 'other', 'diverse']
      };
      
      for (const product of productsToFix) {
        const categoryId = product.categoryId;
        const categorySubcats = subcatByCategoryId[categoryId] || [];
        
        if (categorySubcats.length === 0) {
          continue; // No subcategories for this category
        }
        
        // Try to match product to a subcategory
        let matchedSubcat = null;
        const productNameLower = (product.name || '').toLowerCase();
        const productDescLower = (product.description || '').toLowerCase();
        const combinedText = productNameLower + ' ' + productDescLower;
        
        // Try keyword matching
        for (const subcat of categorySubcats) {
          const subcatNameLower = subcat.name.toLowerCase();
          const subcatSlugLower = subcat.slug.toLowerCase();
          
          // Direct name match
          if (combinedText.includes(subcatNameLower) || combinedText.includes(subcatSlugLower)) {
            matchedSubcat = subcat;
            break;
          }
          
          // Swedish name match
          if (subcat.swedishName) {
            const swedishLower = subcat.swedishName.toLowerCase();
            if (combinedText.includes(swedishLower)) {
              matchedSubcat = subcat;
              break;
            }
          }
          
          // Keyword matching
          const keywords = subcategoryKeywords[subcatSlugLower] || subcategoryKeywords[subcatNameLower] || [];
          for (const keyword of keywords) {
            if (combinedText.includes(keyword.toLowerCase())) {
              matchedSubcat = subcat;
              break;
            }
          }
          
          if (matchedSubcat) break;
        }
        
        // If no match, use first subcategory or "miscellaneous" if available
        if (!matchedSubcat) {
          matchedSubcat = categorySubcats.find(s => 
            s.name.toLowerCase().includes('misc') || 
            s.name.toLowerCase().includes('other') ||
            s.name.toLowerCase().includes('övrigt')
          ) || categorySubcats[0];
        }
        
        if (matchedSubcat) {
          updates.push({
            updateOne: {
              filter: { _id: product._id },
              update: { 
                $set: { 
                  subcategoryId: matchedSubcat._id,
                  subcategoryIds: [matchedSubcat._id]
                }
              }
            }
          });
        }
      }
      
      // Execute updates in batches
      if (updates.length > 0) {
        console.log(`\nExecuting ${updates.length} updates...`);
        const batchSize = 1000;
        let processed = 0;
        
        for (let i = 0; i < updates.length; i += batchSize) {
          const batch = updates.slice(i, Math.min(i + batchSize, updates.length));
          const result = await products.bulkWrite(batch);
          processed += batch.length;
          console.log(`  Processed ${processed}/${updates.length} (${result.modifiedCount} modified)`);
        }
      }
    }
    
    // Final verification
    console.log('\n=== FINAL VERIFICATION ===');
    const finalValidIds = await products.distinct('subcategoryId');
    let finalValidCount = 0;
    let finalInvalidCount = 0;
    
    for (const id of finalValidIds) {
      if (!id) continue;
      const exists = validSubcategories.find(sub => sub._id.equals(id));
      if (exists) {
        finalValidCount++;
      } else {
        finalInvalidCount++;
      }
    }
    
    console.log(`Products with valid subcategory IDs: ${finalValidCount}`);
    console.log(`Products with invalid subcategory IDs: ${finalInvalidCount}`);
    
    // Show subcategory distribution
    const pipeline = [
      {
        $group: {
          _id: "$subcategoryId",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];
    
    const topSubcategories = await products.aggregate(pipeline).toArray();
    console.log('\nTop 10 subcategories by product count:');
    
    for (const item of topSubcategories) {
      if (item._id) {
        const subcat = validSubcategories.find(s => s._id.equals(item._id));
        if (subcat) {
          console.log(`  ${subcat.name}: ${item.count} products`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Starting subcategory ID fix...\n');
fixSubcategoryIds();