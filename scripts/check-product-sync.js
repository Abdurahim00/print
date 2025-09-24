const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function checkProductSync() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mrmerch');
    console.log('Connected to MongoDB');
    
    // Access the products collection directly
    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');
    
    // Get total count
    const totalCount = await productsCollection.countDocuments();
    console.log('\n📊 PRODUCT DATABASE STATISTICS:');
    console.log('================================');
    console.log(`Total products in database: ${totalCount}`);
    
    // Check products with images
    const withImages = await productsCollection.countDocuments({ 
      $or: [
        { image: { $exists: true, $ne: null, $ne: '' } },
        { imageUrl: { $exists: true, $ne: null, $ne: '' } },
        { images: { $exists: true, $ne: [], $not: { $size: 0 } } }
      ]
    });
    console.log(`Products with images: ${withImages}`);
    
    // Check products without images
    const withoutImages = totalCount - withImages;
    console.log(`Products without images: ${withoutImages}`);
    
    // Check products with variations
    const withVariations = await productsCollection.countDocuments({ 
      hasVariations: true,
      variations: { $exists: true, $ne: [], $not: { $size: 0 } }
    });
    console.log(`Products with variations: ${withVariations}`);
    
    // Sample some products without images
    if (withoutImages > 0) {
      console.log('\n🔍 Sample products without images:');
      const sampleNoImages = await productsCollection.find({ 
        $and: [
          { $or: [{ image: null }, { image: '' }, { image: { $exists: false } }] },
          { $or: [{ imageUrl: null }, { imageUrl: '' }, { imageUrl: { $exists: false } }] },
          { $or: [{ images: [] }, { images: { $size: 0 } }, { images: { $exists: false } }] }
        ]
      }).limit(5).toArray();
      
      sampleNoImages.forEach(p => {
        console.log(`  - ${p.name} (ID: ${p._id})`);
      });
    }
    
    // Check pagination requirements
    console.log('\n📄 PAGINATION REQUIREMENTS:');
    console.log('================================');
    const pagesNeeded100 = Math.ceil(totalCount / 100);
    const pagesNeeded1000 = Math.ceil(totalCount / 1000);
    const pagesNeeded10000 = Math.ceil(totalCount / 10000);
    
    console.log(`Pages needed (100 per page): ${pagesNeeded100}`);
    console.log(`Pages needed (1000 per page): ${pagesNeeded1000}`);
    console.log(`Pages needed (10000 per page): ${pagesNeeded10000}`);
    
    console.log('\n✅ RECOMMENDATION:');
    console.log(`   To fetch ALL products in admin dashboard, we need to:`);
    console.log(`   1. Update the admin dashboard to fetch with limit: ${Math.min(totalCount, 10000)}`);
    console.log(`   2. OR implement proper pagination to load all ${pagesNeeded1000} pages`);
    
    mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProductSync();