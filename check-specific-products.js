require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

async function checkSpecificProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap-pro');
    const products = db.collection('products');
    
    // Check the specific products that API is returning
    const productIds = [
      '68be85eb094d08828df03167',
      '68be85eb094d08828df03166', 
      '68be85eb094d08828df03163'
    ];
    
    for (const id of productIds) {
      const product = await products.findOne({ _id: new ObjectId(id) });
      if (product) {
        console.log(`\n=== Product: ${product.name} ===`);
        console.log(`ID: ${id}`);
        console.log(`Has variations field: ${!!product.variations} (count: ${product.variations?.length || 0})`);
        console.log(`Has variants field: ${!!product.variants} (count: ${product.variants?.length || 0})`);
        console.log(`hasVariations flag: ${product.hasVariations}`);
        console.log(`images array: ${product.images?.length || 0} images`);
        
        if (product.variants && product.variants.length > 0) {
          console.log('First variant:', JSON.stringify(product.variants[0], null, 2));
        }
      } else {
        console.log(`\nProduct with ID ${id} not found`);
      }
    }
    
    // Also check what sorting is happening
    console.log('\n=== First 3 products when sorted by featured ===');
    const sortedProducts = await products.find({}).sort({ featured: -1 }).limit(3).toArray();
    for (const product of sortedProducts) {
      console.log(`- ${product.name} (featured: ${product.featured}, variants: ${product.variants?.length || 0})`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkSpecificProducts();