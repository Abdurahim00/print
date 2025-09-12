const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function checkProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('printwrap-pro');
    
    // Get 5 sample products with images
    const products = await db.collection('products')
      .find({ images: { $exists: true, $ne: [] } })
      .limit(5)
      .toArray();
    
    console.log('Sample products with images:');
    products.forEach(p => {
      console.log({
        name: p.name,
        hasImages: !!p.images,
        imageCount: p.images?.length || 0,
        firstImage: p.images?.[0]?.substring(0, 50) + '...',
        hasVariations: !!p.variations,
        variationCount: p.variations?.length || 0,
        firstVariation: p.variations?.[0] ? {
          id: p.variations[0].id,
          color: p.variations[0].color?.name,
          hasImages: !!p.variations[0].images
        } : null
      });
    });
    
    // Count products with images
    const withImages = await db.collection('products').countDocuments({ 
      images: { $exists: true, $ne: [] } 
    });
    
    const withVariations = await db.collection('products').countDocuments({ 
      variations: { $exists: true, $ne: [] } 
    });
    
    const total = await db.collection('products').countDocuments();
    
    console.log('\nStats:');
    console.log('Total products:', total);
    console.log('Products with images:', withImages);
    console.log('Products with variations:', withVariations);
    
    // Check a specific product structure
    const sampleProduct = await db.collection('products').findOne({ 
      variations: { $exists: true, $ne: [] } 
    });
    
    if (sampleProduct) {
      console.log('\nSample product structure:');
      console.log('Name:', sampleProduct.name);
      console.log('Image fields:', {
        image: !!sampleProduct.image,
        imageUrl: !!sampleProduct.imageUrl,
        images: !!sampleProduct.images,
        frontImage: !!sampleProduct.frontImage,
        backImage: !!sampleProduct.backImage
      });
      console.log('Variations:', sampleProduct.variations?.length || 0);
      if (sampleProduct.variations?.[0]) {
        console.log('First variation:', {
          id: sampleProduct.variations[0].id,
          color: sampleProduct.variations[0].color,
          images: sampleProduct.variations[0].images?.length || 0
        });
      }
    }
    
  } finally {
    await client.close();
  }
}

checkProducts().catch(console.error);