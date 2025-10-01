const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'printwrap';

// Example product data with the issue
const exampleProduct = {
  "Title": "MASCOT® Linz",
  "variants_dict": [
    {
      "variant_name": "Hi-vis orange/marin",
      "variant_image": "https://static.unpr.io/itemimage/1557/products/full/163c13802c2983.jpg"
    },
    {
      "variant_name": "Hi-vis gul/marin", 
      "variant_image": "https://static.unpr.io/itemimage/1557/products/full/163c13803131fd.jpg"
    },
    // PDF thumbnails that shouldn't be variants
    {
      "variant_name": "",
      "variant_image": "https://static.unpr.io/media/full/THUMBNAIL-FILE-65e5174604676-54992949.png?s=90&box=1"
    },
    {
      "variant_name": "",
      "variant_image": "https://static.unpr.io/media/full/THUMBNAIL-FILE-65e51747bd566-54992950.png?s=90&box=1"
    }
  ]
};

async function fixSpecificProductVariants() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');
    
    // Find all products
    const allProducts = await collection.find({}).toArray();
    console.log(`📊 Found ${allProducts.length} products total`);
    
    let fixedCount = 0;
    let pdfVariantsRemoved = 0;
    const bulkOps = [];
    
    for (const product of allProducts) {
      let needsUpdate = false;
      const cleanedVariants = [];
      const additionalImages = [];
      
      // Check if product has variants in any form
      const variantSources = [
        product.variants,
        product.variants_dict,
        product.originalData?.variants_dict
      ];
      
      let variants = null;
      for (const source of variantSources) {
        if (source && Array.isArray(source) && source.length > 0) {
          variants = source;
          break;
        }
      }
      
      if (!variants) {
        continue;
      }
      
      // Process variants
      for (const variant of variants) {
        // Check if this is a PDF/thumbnail variant
        const variantImage = variant.variant_image || variant.image || '';
        const variantName = variant.variant_name || variant.name || '';
        const variantUrl = variant.variant_url || variant.url || '';
        
        const isPDFThumbnail = (
          variantImage.includes('THUMBNAIL-FILE-') ||
          variantImage.includes('FILE-') && variantImage.includes('.png') ||
          variantUrl.includes('.pdf') ||
          (variantName === '' && variantImage.includes('media/full/'))
        );
        
        if (isPDFThumbnail) {
          // This is a PDF thumbnail, not a real variant
          if (variantImage && !variantImage.includes('.pdf')) {
            additionalImages.push(variantImage);
          }
          pdfVariantsRemoved++;
          needsUpdate = true;
        } else if (variantName || variantImage) {
          // This is a real variant
          cleanedVariants.push({
            id: variant.id || `variant-${cleanedVariants.length}`,
            variant_name: variantName || `Variant ${cleanedVariants.length + 1}`,
            variant_image: variantImage,
            color: variant.color,
            price: variant.price
          });
        }
      }
      
      // Collect all valid images
      const allImages = [];
      
      // Add current images
      if (product.image) {
        if (Array.isArray(product.image)) {
          allImages.push(...product.image.filter(img => img && !img.includes('.pdf')));
        } else if (typeof product.image === 'string' && !product.image.includes('.pdf')) {
          allImages.push(product.image);
        }
      }
      
      // Add variant images
      cleanedVariants.forEach(v => {
        if (v.variant_image && !allImages.includes(v.variant_image)) {
          allImages.push(v.variant_image);
        }
      });
      
      // Add additional images from PDF thumbnails
      additionalImages.forEach(img => {
        if (!allImages.includes(img)) {
          allImages.push(img);
        }
      });
      
      // Remove duplicates and filter
      const finalImages = [...new Set(allImages)].filter(img => 
        img && !img.includes('placeholder')
      );
      
      // Update if changes were made
      if (needsUpdate || (variants !== product.variants)) {
        const updateData = {
          variants: cleanedVariants
        };
        
        // Only update image if we have more images than before
        if (finalImages.length > 0) {
          updateData.image = finalImages;
        }
        
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: updateData }
          }
        });
        
        fixedCount++;
        
        if (fixedCount <= 10) {
          console.log(`\n📝 Fixing: ${product.name || 'Unnamed'}`);
          console.log(`  Original variants: ${variants.length}`);
          console.log(`  Cleaned variants: ${cleanedVariants.length}`);
          console.log(`  Images: ${finalImages.length}`);
          if (cleanedVariants.length > 0) {
            cleanedVariants.forEach((v, i) => {
              console.log(`    ${i + 1}. ${v.variant_name}`);
            });
          }
        }
      }
    }
    
    // Execute bulk updates
    if (bulkOps.length > 0) {
      console.log(`\n💾 Updating ${bulkOps.length} products...`);
      const result = await collection.bulkWrite(bulkOps);
      console.log(`✅ Successfully updated ${result.modifiedCount} products`);
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  - Products processed: ${allProducts.length}`);
    console.log(`  - Products fixed: ${fixedCount}`);
    console.log(`  - PDF variants removed: ${pdfVariantsRemoved}`);
    
    // Verify products now have proper variants
    const withVariants = await collection.countDocuments({
      variants: { $exists: true, $ne: [] }
    });
    console.log(`  - Products with variants: ${withVariants}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixSpecificProductVariants().catch(console.error);