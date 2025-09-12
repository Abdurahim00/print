const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkProduct() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('printwrap-pro');
    
    // Get the specific product
    const product = await db.collection('products')
      .findOne({ _id: new ObjectId('68be85eb094d08828df03170') });
    
    if (product) {
      console.log('Product found:', product.name);
      console.log('Has variations:', !!product.variations);
      console.log('Variations count:', product.variations?.length || 0);
      console.log('Has images:', !!product.images);
      console.log('Images count:', product.images?.length || 0);
      
      // Check for variation-like structure in originalData
      if (product.originalData) {
        console.log('\nOriginal Data Structure:');
        console.log('Has originalData.variations:', !!product.originalData.variations);
        console.log('Has originalData.variationGroups:', !!product.originalData.variationGroups);
        console.log('Has originalData.sameSeriesProducts:', !!product.originalData.sameSeriesProducts);
        
        if (product.originalData.sameSeriesProducts) {
          console.log('Same series products count:', product.originalData.sameSeriesProducts.length);
          console.log('First series product:', JSON.stringify(product.originalData.sameSeriesProducts[0], null, 2).substring(0, 500));
        }
      }
      
      console.log('\nFull product keys:');
      console.log(Object.keys(product));
      
    } else {
      console.log('Product not found');
    }
    
  } finally {
    await client.close();
  }
}

checkProduct().catch(console.error);