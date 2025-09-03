const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// Category mapping based on URL patterns and product names
const CATEGORY_MAPPINGS = {
  // URL-based mappings
  'arbetsklader': 'Work Clothes',
  'varumarken': 'Brands', 
  'profilklader': 'Profile Clothing',
  'giveaways': 'Giveaways',
  'profilprodukter': 'Profile Products',
  'kontorsmaterial': 'Office & Supplies',
  'personligt-skydd': 'Personal Protection',
  'massmatrial': 'Exhibition Materials',
  'tryckt-material': 'Printed Materials',
  'miljovaror': 'Eco-friendly Products',
  
  // Product type mappings
  'trojor': 'Apparel',
  'skjortor': 'Apparel',
  'pikeer': 'Apparel',
  'jackor': 'Apparel',
  'byxor': 'Apparel',
  'overaller': 'Work Clothes',
  'shorts': 'Apparel',
  'underklader': 'Apparel',
  'skor': 'Accessories',
  'kepsar': 'Accessories',
  'mossor': 'Accessories',
  'handskar': 'Accessories',
  'vantar': 'Accessories',
  'halsdukar': 'Accessories',
  'nyckelringar': 'Promotional Items',
  'pennor': 'Office & Supplies',
  'muggar': 'Drinkware',
  'flaskor': 'Drinkware',
  'kassar': 'Bags',
  'ryggsackar': 'Bags',
  'vaxor': 'Bags',
  
  // Brand mappings
  'projob': 'Work Clothes',
  'mascot': 'Work Clothes',
  'blaklader': 'Work Clothes',
  'lbrador': 'Work Clothes',
  'snickers': 'Work Clothes',
  'helly-hansen': 'Work Clothes',
  'clique': 'Profile Clothing',
  'printer': 'Profile Clothing',
  'harvest': 'Profile Clothing',
  'tee-jays': 'Apparel',
  'russell': 'Apparel',
  'result': 'Apparel'
};

async function determineCategoryForProduct(product, categoryMap) {
  let categoryName = 'Other'; // Default category
  let confidence = 0;
  
  // Check URL for category hints
  if (product.originalUrl) {
    const urlLower = product.originalUrl.toLowerCase();
    const urlParts = urlLower.split('/');
    
    // Check each URL part against mappings
    for (const part of urlParts) {
      if (CATEGORY_MAPPINGS[part]) {
        categoryName = CATEGORY_MAPPINGS[part];
        confidence = 90;
        break;
      }
      
      // Check partial matches
      for (const [key, value] of Object.entries(CATEGORY_MAPPINGS)) {
        if (part.includes(key)) {
          categoryName = value;
          confidence = 80;
          break;
        }
      }
    }
  }
  
  // If no URL match, check product name
  if (confidence < 80 && product.name) {
    const nameLower = product.name.toLowerCase();
    
    for (const [key, value] of Object.entries(CATEGORY_MAPPINGS)) {
      if (nameLower.includes(key)) {
        categoryName = value;
        confidence = 70;
        break;
      }
    }
    
    // Special handling for specific product types
    if (nameLower.includes('tröja') || nameLower.includes('t-shirt') || 
        nameLower.includes('shirt') || nameLower.includes('hoodie')) {
      categoryName = 'Apparel';
      confidence = Math.max(confidence, 75);
    } else if (nameLower.includes('jacka') || nameLower.includes('jacket')) {
      categoryName = 'Apparel';
      confidence = Math.max(confidence, 75);
    } else if (nameLower.includes('byxa') || nameLower.includes('byxor')) {
      categoryName = 'Apparel';
      confidence = Math.max(confidence, 75);
    } else if (nameLower.includes('overall')) {
      categoryName = 'Work Clothes';
      confidence = Math.max(confidence, 85);
    } else if (nameLower.includes('sweatshirt')) {
      categoryName = 'Apparel';
      confidence = Math.max(confidence, 75);
    }
  }
  
  // Check brand info for work clothes brands
  if (product.brand) {
    const brandLower = product.brand.toLowerCase();
    if (['projob', 'mascot', 'blåkläder', 'blaklader', 'snickers', 'helly hansen'].some(b => brandLower.includes(b))) {
      categoryName = 'Work Clothes';
      confidence = Math.max(confidence, 85);
    }
  }
  
  // Get category ID
  const category = categoryMap[categoryName];
  return category ? category._id : categoryMap['Other']?._id;
}

async function assignCategories() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found!');
    process.exit(1);
  }
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');
    
    // Get all categories and create a map
    const categories = await categoriesCollection.find({}).toArray();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat;
    });
    
    console.log(`\n📊 Found ${categories.length} categories`);
    
    // Get all products
    const products = await productsCollection.find({}).toArray();
    console.log(`📦 Found ${products.length} products to categorize`);
    
    // Track category assignments
    const categoryAssignments = {};
    let updatedCount = 0;
    
    // Process products in batches
    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, Math.min(i + batchSize, products.length));
      const bulkOps = [];
      
      for (const product of batch) {
        const categoryId = await determineCategoryForProduct(product, categoryMap);
        
        if (categoryId) {
          // Track assignment
          const categoryName = Object.values(categoryMap).find(c => c._id.equals(categoryId))?.name;
          categoryAssignments[categoryName] = (categoryAssignments[categoryName] || 0) + 1;
          
          // Add to bulk update
          bulkOps.push({
            updateOne: {
              filter: { _id: product._id },
              update: { 
                $set: { 
                  categoryId: categoryId,
                  updatedAt: new Date()
                } 
              }
            }
          });
        }
      }
      
      if (bulkOps.length > 0) {
        const result = await productsCollection.bulkWrite(bulkOps);
        updatedCount += result.modifiedCount;
        console.log(`  Progress: ${Math.min(i + batchSize, products.length)}/${products.length} products processed`);
      }
    }
    
    console.log(`\n✅ Updated ${updatedCount} products with categories`);
    
    // Show category distribution
    console.log('\n📊 Category assignments:');
    Object.entries(categoryAssignments)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`  - ${category}: ${count} products`);
      });
    
    // Verify some products
    console.log('\n📋 Sample categorized products:');
    const samples = await productsCollection
      .find({ categoryId: { $exists: true } })
      .limit(10)
      .toArray();
    
    for (const product of samples) {
      const category = categories.find(c => c._id.equals(product.categoryId));
      console.log(`  - ${product.name}`);
      console.log(`    Category: ${category?.name || 'Unknown'}`);
    }
    
    // Check uncategorized products
    const uncategorized = await productsCollection.countDocuments({ 
      $or: [
        { categoryId: null },
        { categoryId: { $exists: false } }
      ]
    });
    
    if (uncategorized > 0) {
      console.log(`\n⚠️ ${uncategorized} products remain uncategorized`);
      
      // Show some uncategorized examples
      const uncategorizedSamples = await productsCollection
        .find({ 
          $or: [
            { categoryId: null },
            { categoryId: { $exists: false } }
          ]
        })
        .limit(5)
        .toArray();
      
      if (uncategorizedSamples.length > 0) {
        console.log('\nUncategorized product examples:');
        uncategorizedSamples.forEach(p => {
          console.log(`  - ${p.name}`);
          if (p.originalUrl) {
            console.log(`    URL: ${p.originalUrl.substring(0, 80)}...`);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run
assignCategories().catch(console.error);