const { MongoClient } = require('mongodb');
require('dotenv').config();

async function listAllSubcategories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('printwrap-pro');
    const subcategories = db.collection('subcategories');
    const categories = db.collection('categories');
    
    // Get all categories
    const allCategories = await categories.find({}).toArray();
    const catMap = {};
    allCategories.forEach(cat => {
      catMap[cat._id.toString()] = cat.name;
    });
    
    // Get all subcategories
    const allSubcategories = await subcategories.find({}).toArray();
    
    const subcatsByCategory = {};
    allSubcategories.forEach(sub => {
      const catName = catMap[sub.categoryId] || 'Unknown';
      if (!subcatsByCategory[catName]) {
        subcatsByCategory[catName] = [];
      }
      subcatsByCategory[catName].push({
        name: sub.name,
        slug: sub.slug,
        swedish: sub.swedishName,
        id: sub._id.toString()
      });
    });
    
    console.log('=== EXISTING SUBCATEGORIES BY CATEGORY ===\n');
    
    Object.keys(subcatsByCategory).sort().forEach(catName => {
      console.log(`${catName}:`);
      subcatsByCategory[catName].forEach(sub => {
        const swedish = sub.swedish ? ` (${sub.swedish})` : '';
        console.log(`  - ${sub.name}${swedish} [${sub.id.substring(0, 8)}...]`);
      });
      console.log();
    });
    
    console.log(`Total categories: ${Object.keys(subcatsByCategory).length}`);
    console.log(`Total subcategories: ${allSubcategories.length}`);
    
  } finally {
    await client.close();
  }
}

listAllSubcategories();