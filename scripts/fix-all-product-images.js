const fs = require('fs').promises;
const path = require('path');

async function fixAllProductImages() {
  try {
    // Read the products backup file
    const jsonPath = path.join(__dirname, '..', 'products-backup-1757320722828.json');
    
    console.log('📖 Reading products backup file...');
    const rawData = await fs.readFile(jsonPath, 'utf8');
    const products = JSON.parse(rawData);
    console.log(`✅ Found ${products.length} products\n`);
    
    // Statistics
    let noImages = 0;
    let stringImages = 0;
    let emptyArrays = 0;
    let hasImages = 0;
    let fixedFromImageUrl = 0;
    let fixedFromVariants = 0;
    let fixedFromColors = 0;
    let stillNoImages = 0;
    
    // Process each product to ensure it has images
    const processedProducts = products.map((product, index) => {
      const processedProduct = { ...product };
      let hadImages = false;
      let wasFixed = false;
      
      // Check current state and fix images
      if (!processedProduct.images) {
        noImages++;
        processedProduct.images = [];
      } else if (typeof processedProduct.images === 'string') {
        stringImages++;
        // Convert string to array
        processedProduct.images = [processedProduct.images];
        hadImages = true;
      } else if (Array.isArray(processedProduct.images)) {
        if (processedProduct.images.length === 0) {
          emptyArrays++;
        } else {
          hasImages++;
          hadImages = true;
        }
      }
      
      // If no images, try to fix from various sources
      if (!hadImages || processedProduct.images.length === 0) {
        // 1. Try imageUrl field
        if (processedProduct.imageUrl && typeof processedProduct.imageUrl === 'string' && processedProduct.imageUrl.trim() !== '') {
          processedProduct.images = [processedProduct.imageUrl];
          fixedFromImageUrl++;
          wasFixed = true;
        }
        // 2. Try variants array
        else if (processedProduct.variants && Array.isArray(processedProduct.variants) && processedProduct.variants.length > 0) {
          const variantImages = [];
          processedProduct.variants.forEach(variant => {
            if (variant.variant_image && !variantImages.includes(variant.variant_image)) {
              variantImages.push(variant.variant_image);
            }
          });
          if (variantImages.length > 0) {
            processedProduct.images = variantImages;
            processedProduct.imageUrl = variantImages[0];
            fixedFromVariants++;
            wasFixed = true;
          }
        }
        // 3. Try colors array
        if (!wasFixed && processedProduct.colors && Array.isArray(processedProduct.colors) && processedProduct.colors.length > 0) {
          const colorImages = [];
          processedProduct.colors.forEach(color => {
            if (color.images && Array.isArray(color.images)) {
              color.images.forEach(img => {
                if (img && !colorImages.includes(img)) {
                  colorImages.push(img);
                }
              });
            }
          });
          if (colorImages.length > 0) {
            processedProduct.images = colorImages;
            processedProduct.imageUrl = colorImages[0];
            fixedFromColors++;
            wasFixed = true;
          }
        }
        // 4. Try designAreas mockupUrl
        if (!wasFixed && processedProduct.designAreas && Array.isArray(processedProduct.designAreas)) {
          const designImages = [];
          processedProduct.designAreas.forEach(area => {
            if (area.mockupUrl && !designImages.includes(area.mockupUrl)) {
              designImages.push(area.mockupUrl);
            }
          });
          if (designImages.length > 0) {
            processedProduct.images = designImages;
            processedProduct.imageUrl = designImages[0];
            wasFixed = true;
          }
        }
        
        // If still no images, generate a placeholder
        if (!wasFixed || processedProduct.images.length === 0) {
          // Use a placeholder image URL (you may want to use a real placeholder service)
          const placeholderUrl = `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(processedProduct.name || 'Product')}`;
          processedProduct.images = [placeholderUrl];
          processedProduct.imageUrl = placeholderUrl;
          stillNoImages++;
        }
      }
      
      // Ensure imageUrl is set if we have images
      if (processedProduct.images && processedProduct.images.length > 0 && !processedProduct.imageUrl) {
        processedProduct.imageUrl = processedProduct.images[0];
      }
      
      // Progress indicator
      if ((index + 1) % 5000 === 0) {
        process.stdout.write(`\rProcessing: ${index + 1}/${products.length} products...`);
      }
      
      return processedProduct;
    });
    
    console.log('\n\n=== Processing Statistics ===');
    console.log(`Products originally without images field: ${noImages}`);
    console.log(`Products with string images (converted): ${stringImages}`);
    console.log(`Products with empty image arrays: ${emptyArrays}`);
    console.log(`Products that already had images: ${hasImages}`);
    console.log(`\n=== Fixes Applied ===`);
    console.log(`Fixed from imageUrl field: ${fixedFromImageUrl}`);
    console.log(`Fixed from variants: ${fixedFromVariants}`);
    console.log(`Fixed from colors: ${fixedFromColors}`);
    console.log(`Added placeholder images: ${stillNoImages}`);
    
    // Final verification
    let finalWithImages = 0;
    let finalWithoutImages = 0;
    
    processedProducts.forEach(product => {
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        finalWithImages++;
      } else {
        finalWithoutImages++;
      }
    });
    
    console.log(`\n=== Final Results ===`);
    console.log(`✅ Products with images: ${finalWithImages} (${(finalWithImages/products.length*100).toFixed(1)}%)`);
    console.log(`❌ Products without images: ${finalWithoutImages}`);
    
    // Save the fixed file
    const outputPath = path.join(__dirname, '..', 'products-fixed.json');
    console.log('\n💾 Saving fixed products file...');
    await fs.writeFile(outputPath, JSON.stringify(processedProducts, null, 2));
    console.log(`✅ Saved as products-fixed.json (${processedProducts.length} products)`);
    
    // Show samples of products that needed placeholders
    if (stillNoImages > 0) {
      console.log(`\n⚠️  ${stillNoImages} products received placeholder images`);
      const placeholderProducts = processedProducts.filter(p => 
        p.images && p.images[0] && p.images[0].includes('placeholder')
      );
      console.log('Sample products with placeholders:');
      placeholderProducts.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name || 'Unnamed product'} (SKU: ${product.sku || 'No SKU'})`);
      });
    }
    
    console.log('\n✅ All products now have images!');
    console.log('Use products-fixed.json for importing to the database.');
    
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
    console.error(error.stack);
  }
}

console.log('=== Fix All Product Images ===');
console.log('This tool ensures EVERY product has at least one image\n');
fixAllProductImages();