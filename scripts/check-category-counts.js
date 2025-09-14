const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkCategoryCounts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('printwrap-pro');

  console.log('📊 CHECKING HOW PRODUCTS ARE ACTUALLY COUNTED PER CATEGORY:\n');

  const categories = await db.collection('categories').find({}).toArray();
  const subcategories = await db.collection('subcategories').find({}).toArray();

  for (const cat of categories.sort((a,b) => a.name.localeCompare(b.name))) {
    // Get subcategories for this category
    const catSubs = subcategories.filter(s => s.categoryId === cat.id);
    const subIds = catSubs.map(s => s.id || s._id?.toString());

    // Count products in these subcategories
    const productCount = await db.collection('products').countDocuments({
      subcategoryId: { $in: subIds }
    });

    console.log(`${cat.name}: ${productCount} products (${catSubs.length} subcategories)`);

    if (productCount > 0 && catSubs.length > 0) {
      // Show which subcategories have products
      for (const sub of catSubs) {
        const subCount = await db.collection('products').countDocuments({
          subcategoryId: sub.id || sub._id?.toString()
        });
        if (subCount > 0) {
          console.log(`  └─ ${sub.name}: ${subCount}`);
        }
      }
    }
  }

  // Check total
  console.log('\n📊 TOTALS:');
  const totalProducts = await db.collection('products').countDocuments({});
  console.log(`Total products in DB: ${totalProducts}`);

  // Check if products have correct categoryId
  const sample = await db.collection('products').find({}).limit(5).toArray();
  console.log('\nSample product structure:');
  sample.forEach(p => {
    console.log(`- ${p.name}: categoryId=${p.categoryId}, subcategoryId=${p.subcategoryId}`);
  });

  await client.close();
}

checkCategoryCounts().catch(console.error);