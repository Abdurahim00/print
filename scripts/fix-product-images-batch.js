const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'printwrap';

async function fixProductImagesBatch() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');
    
    // First, let's analyze the current state
    const totalProducts = await collection.countDocuments();
    console.log(`📊 Total products: ${totalProducts}`);
    
    // Count products with string images
    const productsWithStringImage = await collection.countDocuments({ 
      image: { $type: 'string' } 
    });
    
    console.log(`🔍 Products with image as string: ${productsWithStringImage}`);
    
    if (productsWithStringImage > 0) {
      console.log('\n📝 Converting string images to arrays using bulk operations...');
      
      // Use aggregation pipeline for bulk update
      const result = await collection.updateMany(
        { image: { $type: 'string' } },
        [
          {
            $set: {
              image: {
                $cond: {
                  if: { 
                    $and: [
                      { $ne: ['$image', ''] },
                      { $ne: ['$image', null] }
                    ]
                  },
                  then: ['$image'],
                  else: []
                }
              }
            }
          }
        ]
      );
      
      console.log(`✅ Updated ${result.modifiedCount} products with string images to arrays`);
    }
    
    // Now handle products with no images or empty arrays
    console.log('\n🔍 Finding products with no/empty images...');
    
    const noImageProducts = await collection.find({
      $or: [
        { image: { $exists: false } },
        { image: null },
        { image: [] }
      ]
    }).toArray();
    
    console.log(`Found ${noImageProducts.length} products with no/empty images`);
    
    if (noImageProducts.length > 0) {
      console.log('📝 Attempting to find alternative images...');
      
      const bulkOps = [];
      let fixedCount = 0;
      
      for (const product of noImageProducts) {
        const imageFields = [];
        
        // Collect all possible image sources
        const imageSources = [
          product.frontImage,
          product.backImage,
          product.leftImage,
          product.rightImage,
          product.materialImage
        ];
        
        // Add valid string images
        imageSources.forEach(img => {
          if (img && typeof img === 'string' && !img.includes('placeholder')) {
            imageFields.push(img);
          }
        });
        
        // Check images array
        if (product.images && Array.isArray(product.images)) {
          product.images.forEach(img => {
            if (typeof img === 'string' && !img.includes('placeholder')) {
              imageFields.push(img);
            } else if (img && img.url && !img.url.includes('placeholder')) {
              imageFields.push(img.url);
            }
          });
        }
        
        // Check variants
        if (product.variants && Array.isArray(product.variants)) {
          product.variants.forEach(variant => {
            if (variant.image && typeof variant.image === 'string' && !variant.image.includes('placeholder')) {
              imageFields.push(variant.image);
            }
            if (variant.variant_image && typeof variant.variant_image === 'string' && !variant.variant_image.includes('placeholder')) {
              imageFields.push(variant.variant_image);
            }
          });
        }
        
        // Remove duplicates
        const uniqueImages = [...new Set(imageFields)];
        
        if (uniqueImages.length > 0) {
          bulkOps.push({
            updateOne: {
              filter: { _id: product._id },
              update: { $set: { image: uniqueImages } }
            }
          });
          fixedCount++;
        } else {
          // Use placeholder for products with no images
          bulkOps.push({
            updateOne: {
              filter: { _id: product._id },
              update: { $set: { image: ['/placeholder.jpg'] } }
            }
          });
        }
      }
      
      // Execute bulk operations
      if (bulkOps.length > 0) {
        const bulkResult = await collection.bulkWrite(bulkOps);
        console.log(`✅ Processed ${bulkResult.modifiedCount} products with no/empty images`);
        console.log(`   - ${fixedCount} products found alternative images`);
        console.log(`   - ${bulkOps.length - fixedCount} products set to placeholder`);
      }
    }
    
    // Final verification
    console.log('\n📊 Final Statistics:');
    
    const finalStats = await collection.aggregate([
      {
        $facet: {
          withArrayImages: [
            { $match: { image: { $type: 'array', $ne: [] } } },
            { $count: 'count' }
          ],
          withStringImages: [
            { $match: { image: { $type: 'string' } } },
            { $count: 'count' }
          ],
          withNoImages: [
            { $match: { 
              $or: [
                { image: { $exists: false } },
                { image: null },
                { image: [] }
              ]
            }},
            { $count: 'count' }
          ]
        }
      }
    ]).toArray();
    
    const stats = finalStats[0];
    console.log(`✅ Products with proper image arrays: ${stats.withArrayImages[0]?.count || 0}`);
    console.log(`${stats.withStringImages[0]?.count > 0 ? '❌' : '✅'} Products with string images: ${stats.withStringImages[0]?.count || 0}`);
    console.log(`${stats.withNoImages[0]?.count > 0 ? '⚠️' : '✅'} Products with no/empty images: ${stats.withNoImages[0]?.count || 0}`);
    
    // Show sample of fixed products
    console.log('\n📋 Sample of fixed products:');
    const samples = await collection.find({ image: { $type: 'array' } }).limit(5).toArray();
    samples.forEach(product => {
      console.log(`  - ${product.name || 'Unnamed'}: ${product.image.length} image(s)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixProductImagesBatch().catch(console.error);