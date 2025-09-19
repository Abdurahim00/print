const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'printwrap';

async function fixProductImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');
    
    // First, let's analyze the current state
    const totalProducts = await collection.countDocuments();
    console.log(`📊 Total products: ${totalProducts}`);
    
    // Find products with various image issues
    const productsWithStringImage = await collection.countDocuments({ 
      image: { $type: 'string' } 
    });
    
    const productsWithNoImage = await collection.countDocuments({ 
      $or: [
        { image: { $exists: false } },
        { image: null },
        { image: '' },
        { image: [] }
      ]
    });
    
    console.log(`🔍 Products with image as string: ${productsWithStringImage}`);
    console.log(`🔍 Products with no/empty image: ${productsWithNoImage}`);
    
    // Fix products where image is a string
    if (productsWithStringImage > 0) {
      console.log('\n📝 Fixing products with string images...');
      
      const stringImageProducts = await collection.find({ 
        image: { $type: 'string' } 
      }).toArray();
      
      let fixedCount = 0;
      for (const product of stringImageProducts) {
        const updateData = {};
        
        // Convert string image to array
        if (typeof product.image === 'string' && product.image.trim() !== '') {
          updateData.image = [product.image];
        }
        
        // Also check if there are other image fields that can be used
        const imageFields = [];
        
        // Collect all available images
        if (product.frontImage && typeof product.frontImage === 'string') {
          imageFields.push(product.frontImage);
        }
        if (product.backImage && typeof product.backImage === 'string') {
          imageFields.push(product.backImage);
        }
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          imageFields.push(...product.images.filter(img => img && typeof img === 'string'));
        }
        
        // Check variants for images
        if (product.variants && Array.isArray(product.variants)) {
          for (const variant of product.variants) {
            if (variant.image && typeof variant.image === 'string') {
              imageFields.push(variant.image);
            }
            if (variant.variant_image && typeof variant.variant_image === 'string') {
              imageFields.push(variant.variant_image);
            }
          }
        }
        
        // If we have collected images, use them
        if (imageFields.length > 0 && (!updateData.image || updateData.image.length === 0)) {
          // Remove duplicates and filter out placeholder images
          const uniqueImages = [...new Set(imageFields)].filter(img => 
            img && !img.includes('placeholder') && !img.includes('Placeholder')
          );
          
          if (uniqueImages.length > 0) {
            updateData.image = uniqueImages;
          }
        }
        
        // Update the product if we have changes
        if (Object.keys(updateData).length > 0) {
          await collection.updateOne(
            { _id: product._id },
            { $set: updateData }
          );
          fixedCount++;
          console.log(`✅ Fixed product: ${product.name || product._id}`);
        }
      }
      
      console.log(`✅ Fixed ${fixedCount} products with string images`);
    }
    
    // Fix products with no images
    const noImageProducts = await collection.find({
      $or: [
        { image: { $exists: false } },
        { image: null },
        { image: '' },
        { image: [] }
      ]
    }).toArray();
    
    if (noImageProducts.length > 0) {
      console.log(`\n📝 Fixing ${noImageProducts.length} products with no images...`);
      
      let fixedNoImageCount = 0;
      for (const product of noImageProducts) {
        const imageFields = [];
        
        // Try to find any available image
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
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          for (const img of product.images) {
            if (typeof img === 'string') {
              imageFields.push(img);
            } else if (img && img.url) {
              imageFields.push(img.url);
            }
          }
        }
        
        // Check variants for images
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
        
        // Check variations
        if (product.variations && Array.isArray(product.variations)) {
          for (const variation of product.variations) {
            if (variation.images && Array.isArray(variation.images)) {
              for (const vImg of variation.images) {
                if (typeof vImg === 'string') {
                  imageFields.push(vImg);
                } else if (vImg && vImg.url) {
                  imageFields.push(vImg.url);
                }
              }
            }
          }
        }
        
        // Remove duplicates and filter out placeholder images
        const uniqueImages = [...new Set(imageFields)].filter(img => 
          img && !img.includes('placeholder') && !img.includes('Placeholder')
        );
        
        if (uniqueImages.length > 0) {
          await collection.updateOne(
            { _id: product._id },
            { $set: { image: uniqueImages } }
          );
          fixedNoImageCount++;
          console.log(`✅ Added images to: ${product.name || product._id}`);
        } else {
          // If still no images found, use a default placeholder
          await collection.updateOne(
            { _id: product._id },
            { $set: { image: ['/placeholder.jpg'] } }
          );
          console.log(`⚠️ No images found for: ${product.name || product._id}, using placeholder`);
        }
      }
      
      console.log(`✅ Fixed ${fixedNoImageCount} products with no images`);
    }
    
    // Final verification
    console.log('\n📊 Final Statistics:');
    const finalStringImages = await collection.countDocuments({ 
      image: { $type: 'string' } 
    });
    const finalNoImages = await collection.countDocuments({ 
      $or: [
        { image: { $exists: false } },
        { image: null },
        { image: '' },
        { image: [] }
      ]
    });
    const finalWithArrayImages = await collection.countDocuments({
      image: { $type: 'array', $ne: [] }
    });
    
    console.log(`✅ Products with proper image arrays: ${finalWithArrayImages}`);
    console.log(`${finalStringImages > 0 ? '❌' : '✅'} Products with string images: ${finalStringImages}`);
    console.log(`${finalNoImages > 0 ? '⚠️' : '✅'} Products with no images: ${finalNoImages}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixProductImages().catch(console.error);