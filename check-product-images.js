const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkProductImages() {
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
    
    // Check products with various image fields
    const withMainImage = await productsCollection.countDocuments({ image: { $exists: true, $ne: null, $ne: '' } });
    const withFrontImage = await productsCollection.countDocuments({ frontImage: { $exists: true, $ne: null, $ne: '' } });
    const withBackImage = await productsCollection.countDocuments({ backImage: { $exists: true, $ne: null, $ne: '' } });
    const withVariations = await productsCollection.countDocuments({ variations: { $exists: true, $ne: [] } });
    
    console.log(`\nProducts with main image: ${withMainImage}`);
    console.log(`Products with front image: ${withFrontImage}`);
    console.log(`Products with back image: ${withBackImage}`);
    console.log(`Products with variations: ${withVariations}`);
    
    // Get a sample product with variations
    const sampleWithVariations = await productsCollection.findOne(
      { variations: { $exists: true, $ne: [] } }
    );
    
    if (sampleWithVariations) {
      console.log('\n--- Sample Product with Variations ---');
      console.log('Name:', sampleWithVariations.name);
      console.log('Main image:', sampleWithVariations.image ? 'Yes' : 'No');
      console.log('Front image:', sampleWithVariations.frontImage ? 'Yes' : 'No');
      console.log('Back image:', sampleWithVariations.backImage ? 'Yes' : 'No');
      console.log('Number of variations:', sampleWithVariations.variations?.length || 0);
      
      if (sampleWithVariations.variations && sampleWithVariations.variations[0]) {
        const firstVariation = sampleWithVariations.variations[0];
        console.log('\nFirst variation:');
        console.log('  Color:', firstVariation.color?.name);
        console.log('  Has images array:', firstVariation.images ? `Yes (${firstVariation.images.length} images)` : 'No');
        if (firstVariation.images && firstVariation.images[0]) {
          console.log('  First image:', typeof firstVariation.images[0] === 'string' ? firstVariation.images[0].substring(0, 100) : firstVariation.images[0].url?.substring(0, 100));
        }
      }
    }
    
    // Get a sample product without variations
    const sampleWithoutVariations = await productsCollection.findOne(
      { 
        variations: { $exists: false },
        $or: [
          { frontImage: { $exists: true, $ne: null, $ne: '' } },
          { backImage: { $exists: true, $ne: null, $ne: '' } }
        ]
      }
    );
    
    if (sampleWithoutVariations) {
      console.log('\n--- Sample Product without Variations ---');
      console.log('Name:', sampleWithoutVariations.name);
      console.log('Main image:', sampleWithoutVariations.image ? sampleWithoutVariations.image.substring(0, 100) : 'No');
      console.log('Front image:', sampleWithoutVariations.frontImage ? sampleWithoutVariations.frontImage.substring(0, 100) : 'No');
      console.log('Back image:', sampleWithoutVariations.backImage ? sampleWithoutVariations.backImage.substring(0, 100) : 'No');
      console.log('Left image:', sampleWithoutVariations.leftImage ? 'Yes' : 'No');
      console.log('Right image:', sampleWithoutVariations.rightImage ? 'Yes' : 'No');
    }
    
    // Check for design frames
    const withDesignFrames = await productsCollection.countDocuments({ 
      designFrames: { $exists: true, $ne: [] } 
    });
    console.log(`\nProducts with design frames: ${withDesignFrames}`);
    
    // Get sample with design frames
    const sampleWithFrames = await productsCollection.findOne(
      { designFrames: { $exists: true, $ne: [] } }
    );
    
    if (sampleWithFrames) {
      console.log('\n--- Sample Product with Design Frames ---');
      console.log('Name:', sampleWithFrames.name);
      console.log('Number of design frames:', sampleWithFrames.designFrames.length);
      if (sampleWithFrames.designFrames[0]) {
        console.log('First frame:', JSON.stringify(sampleWithFrames.designFrames[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkProductImages();