const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://MRmerch:ZAfgqZ5MZFCmxxzR@mrmerch.ij8az.mongodb.net/printwrap-pro';

async function checkProducts() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap-pro');
    const collection = db.collection('products');
    
    // Count total products
    const totalProducts = await collection.countDocuments();
    console.log(`Total products: ${totalProducts}`);
    
    // Count products with empty or missing images
    const emptyImageCount = await collection.countDocuments({
      $or: [
        { image: '' },
        { image: null },
        { image: { $exists: false } }
      ]
    });
    console.log(`Products with empty/missing images: ${emptyImageCount}`);
    
    // Count products with variants
    const withVariantsCount = await collection.countDocuments({
      variants: { $exists: true, $ne: [], $not: { $size: 0 } }
    });
    console.log(`Products with variants: ${withVariantsCount}`);
    
    // Find sample products with empty images
    const emptyImageProducts = await collection.find(
      {
        $or: [
          { image: '' },
          { image: null }
        ]
      },
      { 
        projection: { 
          name: 1, 
          image: 1, 
          images: 1,
          variants: { $slice: 1 },
          variations: { $slice: 1 },
          originalData: 1
        } 
      }
    ).limit(3).toArray();
    
    console.log('\nSample products with empty images:');
    emptyImageProducts.forEach(p => {
      console.log(`\nName: ${p.name}`);
      console.log(`Image: "${p.image}"`);
      console.log(`Images array: ${p.images ? p.images.length : 0} items`);
      console.log(`Has variants: ${p.variants && p.variants.length > 0}`);
      if (p.variants && p.variants[0]) {
        console.log(`First variant:`, JSON.stringify(p.variants[0], null, 2));
      }
    });
    
    // Find products with variants to see structure
    const withVariants = await collection.findOne(
      { 
        variants: { $exists: true, $ne: [], $not: { $size: 0 } }
      },
      { 
        projection: { 
          name: 1, 
          image: 1,
          variants: { $slice: 2 }
        } 
      }
    );
    
    if (withVariants) {
      console.log('\nExample product with variants:');
      console.log(JSON.stringify(withVariants, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkProducts();