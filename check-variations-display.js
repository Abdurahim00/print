require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkVariations() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap-pro');
    const products = db.collection('products');
    
    // Count products with different variation fields
    const withVariations = await products.countDocuments({ variations: { $exists: true, $ne: [] } });
    const withVariants = await products.countDocuments({ variants: { $exists: true, $ne: [] } });
    const withBoth = await products.countDocuments({ 
      $and: [
        { variations: { $exists: true, $ne: [] } },
        { variants: { $exists: true, $ne: [] } }
      ]
    });
    
    console.log(`\n=== Variation Field Statistics ===`);
    console.log(`Products with 'variations' field: ${withVariations}`);
    console.log(`Products with 'variants' field: ${withVariants}`);
    console.log(`Products with both fields: ${withBoth}`);
    
    // Get sample products with variations
    console.log(`\n=== Sample Products with Variations ===`);
    const sampleWithVariations = await products.findOne({ variations: { $exists: true, $ne: [] } });
    if (sampleWithVariations) {
      console.log(`\nProduct with 'variations': ${sampleWithVariations.name}`);
      console.log('Variations structure:', JSON.stringify(sampleWithVariations.variations?.slice(0, 2), null, 2));
    }
    
    const sampleWithVariants = await products.findOne({ 
      variants: { $exists: true, $ne: [] },
      variations: { $exists: false }
    });
    if (sampleWithVariants) {
      console.log(`\nProduct with 'variants' only: ${sampleWithVariants.name}`);
      console.log('Variants structure:', JSON.stringify(sampleWithVariants.variants?.slice(0, 2), null, 2));
    }
    
    // Check hasVariations flag
    const withHasVariations = await products.countDocuments({ hasVariations: true });
    console.log(`\n=== hasVariations Flag ===`);
    console.log(`Products with hasVariations=true: ${withHasVariations}`);
    
    // Check products with images
    const withImages = await products.countDocuments({ images: { $exists: true, $ne: [] } });
    const withImage = await products.countDocuments({ image: { $exists: true, $ne: null } });
    console.log(`\n=== Image Fields ===`);
    console.log(`Products with 'images' array: ${withImages}`);
    console.log(`Products with 'image' field: ${withImage}`);
    
    // Get a specific product to check its complete structure
    const specificProduct = await products.findOne({ _id: { $oid: '68be85eb094d08828df03170' } });
    if (specificProduct) {
      console.log(`\n=== Specific Product (68be85eb094d08828df03170) ===`);
      console.log('Name:', specificProduct.name);
      console.log('Has variations field:', !!specificProduct.variations);
      console.log('Has variants field:', !!specificProduct.variants);
      console.log('Variations count:', specificProduct.variations?.length || 0);
      console.log('Variants count:', specificProduct.variants?.length || 0);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkVariations();