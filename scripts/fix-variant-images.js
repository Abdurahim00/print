const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'printwrap';

async function fixVariantImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');
    
    // Find products with variants
    const productsWithVariants = await collection.find({ 
      variants: { $exists: true, $ne: [] } 
    }).toArray();
    
    console.log(`📊 Found ${productsWithVariants.length} products with variants`);
    
    let fixedCount = 0;
    let pdfVariantsFound = 0;
    const bulkOps = [];
    
    for (const product of productsWithVariants) {
      let needsUpdate = false;
      const cleanedVariants = [];
      const additionalImages = [];
      
      // Process each variant
      if (product.variants && Array.isArray(product.variants)) {
        for (const variant of product.variants) {
          // Check if this is a real variant or a PDF/document thumbnail
          const isPDF = variant.variant_url && (
            variant.variant_url.includes('.pdf') || 
            variant.variant_url.includes('FILE-') ||
            variant.variant_url.includes('THUMBNAIL-FILE-')
          );
          
          const hasPDFImage = variant.variant_image && (
            variant.variant_image.includes('THUMBNAIL-FILE-') ||
            variant.variant_image.includes('.pdf') ||
            variant.variant_image.includes('FILE-')
          );
          
          const hasNoName = !variant.variant_name || variant.variant_name.trim() === '';
          
          if (isPDF || hasPDFImage || (hasNoName && variant.variant_image && variant.variant_image.includes('THUMBNAIL'))) {
            // This is a PDF thumbnail, not a real variant
            // Add the image to additional images if it's valid
            if (variant.variant_image && !variant.variant_image.includes('.pdf')) {
              additionalImages.push(variant.variant_image);
            }
            pdfVariantsFound++;
            needsUpdate = true;
          } else {
            // This is a real variant - keep it
            cleanedVariants.push(variant);
          }
        }
      }
      
      // Also collect images from other fields
      const allProductImages = [];
      
      // Collect main image(s)
      if (product.image) {
        if (Array.isArray(product.image)) {
          allProductImages.push(...product.image.filter(img => img && typeof img === 'string'));
        } else if (typeof product.image === 'string') {
          allProductImages.push(product.image);
        }
      }
      
      // Add variant images from cleaned variants
      cleanedVariants.forEach(variant => {
        if (variant.variant_image && !allProductImages.includes(variant.variant_image)) {
          allProductImages.push(variant.variant_image);
        }
        if (variant.image && !allProductImages.includes(variant.image)) {
          allProductImages.push(variant.image);
        }
      });
      
      // Add additional images found from PDF variants
      additionalImages.forEach(img => {
        if (!allProductImages.includes(img)) {
          allProductImages.push(img);
        }
      });
      
      // Add other image fields
      const otherImageFields = [
        product.frontImage,
        product.backImage,
        product.leftImage,
        product.rightImage,
        product.materialImage
      ];
      
      otherImageFields.forEach(img => {
        if (img && typeof img === 'string' && !allProductImages.includes(img) && !img.includes('.pdf')) {
          allProductImages.push(img);
        }
      });
      
      // Process images array
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach(img => {
          if (typeof img === 'string' && !allProductImages.includes(img) && !img.includes('.pdf')) {
            allProductImages.push(img);
          } else if (img && img.url && !allProductImages.includes(img.url) && !img.url.includes('.pdf')) {
            allProductImages.push(img.url);
          }
        });
      }
      
      // Filter out placeholder and PDF images
      const finalImages = allProductImages.filter(img => 
        img && 
        !img.includes('placeholder') && 
        !img.includes('Placeholder') &&
        !img.includes('.pdf')
      );
      
      // Only update if we made changes
      if (needsUpdate || finalImages.length > (Array.isArray(product.image) ? product.image.length : 1)) {
        const updateData = {
          variants: cleanedVariants,
          image: finalImages.length > 0 ? finalImages : ['/placeholder.jpg']
        };
        
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: updateData }
          }
        });
        
        fixedCount++;
        
        if (fixedCount <= 5) {
          console.log(`\n📝 Fixing: ${product.name || product._id}`);
          console.log(`  Original variants: ${product.variants.length}`);
          console.log(`  Cleaned variants: ${cleanedVariants.length}`);
          console.log(`  Total images: ${finalImages.length}`);
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
    console.log(`  - Products processed: ${productsWithVariants.length}`);
    console.log(`  - Products fixed: ${fixedCount}`);
    console.log(`  - PDF variants removed: ${pdfVariantsFound}`);
    
    // Check specific product if provided
    const sampleProduct = await collection.findOne({ 
      name: { $regex: /MASCOT.*Linz/i } 
    });
    
    if (sampleProduct) {
      console.log('\n🔍 Sample product check (MASCOT Linz):');
      console.log(`  Name: ${sampleProduct.name}`);
      console.log(`  Variants: ${sampleProduct.variants ? sampleProduct.variants.length : 0}`);
      if (sampleProduct.variants) {
        sampleProduct.variants.forEach((v, i) => {
          console.log(`    ${i + 1}. ${v.variant_name || 'Unnamed'}`);
        });
      }
      console.log(`  Images: ${Array.isArray(sampleProduct.image) ? sampleProduct.image.length : 0}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixVariantImages().catch(console.error);