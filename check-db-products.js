const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkProductCount() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap-pro');
    const productsCollection = db.collection('products');
    
    // Count total products
    const totalProducts = await productsCollection.countDocuments();
    console.log(`\nTotal products in database: ${totalProducts}`);
    
    // Get sample of products
    const sampleProducts = await productsCollection.find().limit(5).toArray();
    console.log('\nSample products:');
    sampleProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name || p.Title || 'No name'} - ${p._id}`);
    });
    
    // Count designable products
    const designableCount = await productsCollection.countDocuments({ isDesignable: true });
    console.log(`\nDesignable products: ${designableCount}`);
    
    // Count products with design frames
    const withFramesCount = await productsCollection.countDocuments({ 
      designFrames: { $exists: true, $ne: [] } 
    });
    console.log(`Products with design frames: ${withFramesCount}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkProductCount();