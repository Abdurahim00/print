const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'printwrap';

async function forceFixImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');
    
    console.log('🔄 Force converting ALL product images to arrays...');
    
    // Get all products
    const allProducts = await collection.find({}).toArray();
    console.log(`📊 Processing ${allProducts.length} products...`);
    
    let fixedCount = 0;
    let alreadyArrayCount = 0;
    const bulkOps = [];
    
    for (const product of allProducts) {
      let needsUpdate = false;
      let newImageArray = [];
      
      // Check current image field
      if (Array.isArray(product.image) && product.image.length > 0) {
        // Already an array with images
        alreadyArrayCount++;
        continue;
      } else if (typeof product.image === 'string' && product.image.trim() !== '') {
        // String image - convert to array
        newImageArray = [product.image];
        needsUpdate = true;
      } else {
        // No valid image or empty - try to find alternatives
        const imageFields = [];
        
        // Check all possible image fields
        if (product.frontImage && typeof product.frontImage === 'string') {
          imageFields.push(product.frontImage);
        }
        if (product.backImage && typeof product.backImage === 'string') {
          imageFields.push(product.backImage);
        }
        if (product.leftImage && typeof product.leftImage === 'string') {
          imageFields.push(product.leftImage);
        }
        if (product.rightImage && typeof product.rightImage === 'string') {
          imageFields.push(product.rightImage);
        }
        if (product.materialImage && typeof product.materialImage === 'string') {
          imageFields.push(product.materialImage);
        }
        
        // Check images array
        if (product.images && Array.isArray(product.images)) {
          for (const img of product.images) {
            if (typeof img === 'string' && img.trim() !== '') {
              imageFields.push(img);
            } else if (img && img.url) {
              imageFields.push(img.url);
            }
          }
        }
        
        // Check variants
        if (product.variants && Array.isArray(product.variants)) {
          for (const variant of product.variants) {
            if (variant.image && typeof variant.image === 'string') {
              imageFields.push(variant.image);
            }
            if (variant.variant_image && typeof variant.variant_image === 'string') {
              imageFields.push(variant.variant_image);
            }
            if (variant.images && Array.isArray(variant.images)) {
              for (const vImg of variant.images) {
                if (typeof vImg === 'string') {
                  imageFields.push(vImg);
                } else if (vImg && vImg.url) {
                  imageFields.push(vImg.url);
                }
              }
            }
          }
        }
        
        // Remove duplicates and filter out placeholders
        const uniqueImages = [...new Set(imageFields)].filter(img => 
          img && !img.includes('placeholder') && !img.includes('Placeholder')
        );
        
        if (uniqueImages.length > 0) {
          newImageArray = uniqueImages;
          needsUpdate = true;
        } else {
          // No images found - use placeholder
          newImageArray = ['/placeholder.jpg'];
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: { image: newImageArray } }
          }
        });
        fixedCount++;
      }
    }
    
    // Execute bulk updates
    if (bulkOps.length > 0) {
      console.log(`📝 Updating ${bulkOps.length} products...`);
      const result = await collection.bulkWrite(bulkOps);
      console.log(`✅ Successfully updated ${result.modifiedCount} products`);
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  - Already had array images: ${alreadyArrayCount}`);
    console.log(`  - Fixed/updated: ${fixedCount}`);
    
    // Final verification
    console.log('\n🔍 Final verification...');
    const stringImageCount = await collection.countDocuments({ 
      image: { $type: 'string' } 
    });
    const arrayImageCount = await collection.countDocuments({
      image: { $type: 'array', $ne: [] }
    });
    const noImageCount = await collection.countDocuments({
      $or: [
        { image: { $exists: false } },
        { image: null },
        { image: [] }
      ]
    });
    
    console.log(`✅ Products with array images: ${arrayImageCount}`);
    console.log(`${stringImageCount > 0 ? '❌' : '✅'} Products with string images: ${stringImageCount}`);
    console.log(`${noImageCount > 0 ? '⚠️' : '✅'} Products with no/empty images: ${noImageCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
forceFixImages().catch(console.error);