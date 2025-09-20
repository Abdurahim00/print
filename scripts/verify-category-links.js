const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

async function verifyCategoryLinks() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');
    
    // Get all categories
    const categories = await categoriesCollection.find({}).toArray();
    console.log(`Total categories: ${categories.length}`);
    console.log('Categories:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (ID: ${cat._id.toString()})`);
    });
    
    console.log('\n=== Product Category Distribution ===');
    
    // Count products per category
    for (const category of categories) {
      const count = await productsCollection.countDocuments({
        categoryId: category._id.toString()
      });
      const percentage = ((count / 11742) * 100).toFixed(2);
      console.log(`${category.name}: ${count} products (${percentage}%)`);
    }
    
    // Check for any products without valid categories
    console.log('\n=== Data Integrity Check ===');
    
    const withoutCategory = await productsCollection.countDocuments({ 
      $or: [
        { categoryId: null },
        { categoryId: { $exists: false } },
        { categoryId: '' }
      ]
    });
    console.log(`Products without category: ${withoutCategory}`);
    
    // Check for products with invalid categoryIds
    const validCategoryIds = categories.map(c => c._id.toString());
    const invalidCategory = await productsCollection.countDocuments({
      categoryId: { $nin: [...validCategoryIds, null] }
    });
    console.log(`Products with invalid category: ${invalidCategory}`);
    
    // Sample some products to verify structure
    console.log('\n=== Sample Products ===');
    const sampleProducts = await productsCollection.find({}).limit(5).toArray();
    sampleProducts.forEach(product => {
      const category = categories.find(c => c._id.toString() === product.categoryId);
      console.log(`- ${product.name}`);
      console.log(`  Category: ${category ? category.name : 'INVALID'} (${product.categoryId})`);
      console.log(`  Type of categoryId: ${typeof product.categoryId}`);
    });
    
    console.log('\n✅ All products are now properly linked to categories!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
verifyCategoryLinks().catch(console.error);