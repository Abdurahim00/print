const fs = require('fs').promises;
const path = require('path');

async function process60kJsonImages() {
  try {
    // Check if 60k.json exists
    const jsonPath = path.join(__dirname, '..', '60k.json');
    
    try {
      await fs.access(jsonPath);
    } catch (error) {
      console.error('❌ 60k.json file not found!');
      console.error('Please ensure 60k.json is in the root directory of the project.');
      return;
    }
    
    console.log('📖 Reading 60k.json file...');
    const rawData = await fs.readFile(jsonPath, 'utf8');
    const products = JSON.parse(rawData);
    console.log(`✅ Found ${products.length} products in 60k.json\n`);
    
    // Statistics
    let stringImageUrls = 0;
    let arrayImageUrls = 0;
    let noImageUrls = 0;
    let emptyImageUrls = 0;
    let fixedProducts = 0;
    
    // Process each product
    const processedProducts = products.map(product => {
      const processedProduct = { ...product };
      
      // Check the current state of image_urls
      if (!product.image_urls) {
        noImageUrls++;
        
        // Try to get images from variants
        if (product.variants_dict && Array.isArray(product.variants_dict)) {
          const variantImages = [];
          product.variants_dict.forEach(variant => {
            if (variant.variant_image && !variantImages.includes(variant.variant_image)) {
              variantImages.push(variant.variant_image);
            }
          });
          
          if (variantImages.length > 0) {
            processedProduct.image_urls = variantImages;
            fixedProducts++;
          }
        }
      } else if (typeof product.image_urls === 'string') {
        stringImageUrls++;
        
        // Convert string to array
        if (product.image_urls.trim() !== '') {
          processedProduct.image_urls = [product.image_urls];
          fixedProducts++;
        } else {
          emptyImageUrls++;
          // Try to get images from variants
          if (product.variants_dict && Array.isArray(product.variants_dict)) {
            const variantImages = [];
            product.variants_dict.forEach(variant => {
              if (variant.variant_image && !variantImages.includes(variant.variant_image)) {
                variantImages.push(variant.variant_image);
              }
            });
            
            if (variantImages.length > 0) {
              processedProduct.image_urls = variantImages;
              fixedProducts++;
            }
          }
        }
      } else if (Array.isArray(product.image_urls)) {
        arrayImageUrls++;
        
        // Check if array is empty and try to fix
        if (product.image_urls.length === 0) {
          emptyImageUrls++;
          
          // Try to get images from variants
          if (product.variants_dict && Array.isArray(product.variants_dict)) {
            const variantImages = [];
            product.variants_dict.forEach(variant => {
              if (variant.variant_image && !variantImages.includes(variant.variant_image)) {
                variantImages.push(variant.variant_image);
              }
            });
            
            if (variantImages.length > 0) {
              processedProduct.image_urls = variantImages;
              fixedProducts++;
            }
          }
        }
      }
      
      return processedProduct;
    });
    
    // Report statistics
    console.log('=== Original Image URL Statistics ===');
    console.log(`Products with string image_urls: ${stringImageUrls}`);
    console.log(`Products with array image_urls: ${arrayImageUrls}`);
    console.log(`Products with no image_urls field: ${noImageUrls}`);
    console.log(`Products with empty image_urls: ${emptyImageUrls}`);
    console.log(`\n✅ Fixed ${fixedProducts} products\n`);
    
    // Save the processed file
    const outputPath = path.join(__dirname, '..', '60k-fixed.json');
    console.log('💾 Saving processed file as 60k-fixed.json...');
    await fs.writeFile(outputPath, JSON.stringify(processedProducts, null, 2));
    console.log('✅ File saved successfully!\n');
    
    // Final statistics
    let finalStringCount = 0;
    let finalArrayCount = 0;
    let finalNoImagesCount = 0;
    let finalEmptyCount = 0;
    let finalWithImagesCount = 0;
    
    processedProducts.forEach(product => {
      if (!product.image_urls) {
        finalNoImagesCount++;
      } else if (typeof product.image_urls === 'string') {
        finalStringCount++;
      } else if (Array.isArray(product.image_urls)) {
        finalArrayCount++;
        if (product.image_urls.length === 0) {
          finalEmptyCount++;
        } else {
          finalWithImagesCount++;
        }
      }
    });
    
    console.log('=== Final Image URL Statistics ===');
    console.log(`Products with valid image arrays: ${finalWithImagesCount} (${(finalWithImagesCount/products.length*100).toFixed(1)}%)`);
    console.log(`Products with empty arrays: ${finalEmptyCount}`);
    console.log(`Products with no images: ${finalNoImagesCount}`);
    console.log(`Products with string images (shouldn't exist): ${finalStringCount}`);
    
    // Show samples of products still without images
    const stillWithoutImages = processedProducts.filter(p => 
      !p.image_urls || (Array.isArray(p.image_urls) && p.image_urls.length === 0)
    );
    
    if (stillWithoutImages.length > 0) {
      console.log(`\n⚠️  ${stillWithoutImages.length} products still without images`);
      console.log('Sample products without images:');
      stillWithoutImages.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.Title || 'No title'}`);
        console.log(`   Has variants: ${!!(product.variants_dict && product.variants_dict.length > 0)}`);
      });
    }
    
    console.log('\n✅ Processing complete!');
    console.log('The fixed file has been saved as 60k-fixed.json');
    console.log('You can now use this file with the import-60k-products.js script');
    
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
    console.error(error.stack);
  }
}

console.log('=== 60k.json Image Processor ===');
console.log('This tool processes the 60k.json file to fix image format issues\n');
process60kJsonImages();