const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

async function debugProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrappro');
    const collection = db.collection('products');
    
    // Get first 3 products
    const products = await collection.find({}).limit(3).toArray();
    
    console.log('\n=== PRODUCTS IN DATABASE ===');
    products.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}:`);
      console.log('  _id:', product._id);
      console.log('  _id type:', typeof product._id);
      console.log('  _id toString():', product._id.toString());
      console.log('  _id length:', product._id.toString().length);
      console.log('  name:', product.name);
      console.log('  price:', product.price || product.basePrice);
    });
    
    // Test finding by ID
    if (products.length > 0) {
      const testId = products[0]._id.toString();
      console.log('\n=== TESTING PRODUCT FETCH ===');
      console.log('Testing with ID:', testId);
      console.log('ID length:', testId.length);
      console.log('Is valid ObjectId format:', /^[0-9a-fA-F]{24}$/.test(testId));
      
      const foundProduct = await collection.findOne({ _id: products[0]._id });
      console.log('Found product:', foundProduct ? foundProduct.name : 'NOT FOUND');
    }
    
    // Count total products
    const count = await collection.countDocuments();
    console.log('\n=== TOTAL PRODUCTS ===');
    console.log('Total products in database:', count);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

debugProducts();