const fs = require('fs').promises;
const path = require('path');

async function fixPdfAndInvalidImages() {
  try {
    // Read the products file
    const jsonPath = path.join(__dirname, '..', 'products-fixed.json');
    
    console.log('📖 Reading products file...');
    const rawData = await fs.readFile(jsonPath, 'utf8');
    const products = JSON.parse(rawData);
    console.log(`✅ Found ${products.length} products\n`);
    
    // Statistics
    let pdfImages = 0;
    let invalidImages = 0;
    let fixedFromVariants = 0;
    let fixedFromColors = 0;
    let fixedFromOtherFields = 0;
    let addedPlaceholder = 0;
    let alreadyValid = 0;
    
    // Valid image extensions
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    
    // Helper function to check if URL is a valid image
    function isValidImageUrl(url) {
      if (!url || typeof url !== 'string') return false;
      const lowerUrl = url.toLowerCase();
      return validExtensions.some(ext => lowerUrl.includes(ext));
    }
    
    // Helper function to extract valid images from an array
    function extractValidImages(imageArray) {
      if (!Array.isArray(imageArray)) return [];
      return imageArray.filter(img => isValidImageUrl(img));
    }
    
    // Process each product
    const processedProducts = products.map((product, index) => {
      const processedProduct = { ...product };
      
      // Check current images
      const currentImages = processedProduct.images || [];
      const validCurrentImages = extractValidImages(currentImages);
      
      if (validCurrentImages.length > 0) {
        // Has valid images already
        processedProduct.images = validCurrentImages;
        processedProduct.imageUrl = validCurrentImages[0];
        alreadyValid++;
      } else {
        // No valid images, need to find alternatives
        let foundValidImages = [];
        
        // Check if current images are PDFs or invalid
        if (currentImages.length > 0) {
          const hasPdf = currentImages.some(img => img && img.includes('.pdf'));
          if (hasPdf) {
            pdfImages++;
          } else {
            invalidImages++;
          }
        }
        
        // Try to find valid images from variants
        if (processedProduct.variants && Array.isArray(processedProduct.variants)) {
          for (const variant of processedProduct.variants) {
            if (variant.variant_image && isValidImageUrl(variant.variant_image)) {
              if (!foundValidImages.includes(variant.variant_image)) {
                foundValidImages.push(variant.variant_image);
              }
            }
            // Also check variant_url for image URLs
            if (variant.variant_url && isValidImageUrl(variant.variant_url)) {
              if (!foundValidImages.includes(variant.variant_url)) {
                foundValidImages.push(variant.variant_url);
              }
            }
          }
          if (foundValidImages.length > 0) {
            fixedFromVariants++;
          }
        }
        
        // Try colors array if no valid images yet
        if (foundValidImages.length === 0 && processedProduct.colors && Array.isArray(processedProduct.colors)) {
          for (const color of processedProduct.colors) {
            if (color.images && Array.isArray(color.images)) {
              const validColorImages = extractValidImages(color.images);
              foundValidImages.push(...validColorImages);
            }
          }
          if (foundValidImages.length > 0) {
            fixedFromColors++;
          }
        }
        
        // Try other image fields
        if (foundValidImages.length === 0) {
          // Check imageUrl field
          if (processedProduct.imageUrl && isValidImageUrl(processedProduct.imageUrl)) {
            foundValidImages.push(processedProduct.imageUrl);
            fixedFromOtherFields++;
          }
          
          // Check designAreas
          if (foundValidImages.length === 0 && processedProduct.designAreas && Array.isArray(processedProduct.designAreas)) {
            for (const area of processedProduct.designAreas) {
              if (area.mockupUrl && isValidImageUrl(area.mockupUrl)) {
                if (!foundValidImages.includes(area.mockupUrl)) {
                  foundValidImages.push(area.mockupUrl);
                }
              }
            }
            if (foundValidImages.length > 0) {
              fixedFromOtherFields++;
            }
          }
        }
        
        // Look through ALL images in the product object recursively
        if (foundValidImages.length === 0) {
          function findImagesRecursive(obj, depth = 0) {
            if (depth > 10) return; // Prevent infinite recursion
            if (!obj || typeof obj !== 'object') return;
            
            for (const key in obj) {
              const value = obj[key];
              if (typeof value === 'string' && isValidImageUrl(value)) {
                if (!foundValidImages.includes(value)) {
                  foundValidImages.push(value);
                }
              } else if (Array.isArray(value)) {
                value.forEach(item => {
                  if (typeof item === 'string' && isValidImageUrl(item)) {
                    if (!foundValidImages.includes(item)) {
                      foundValidImages.push(item);
                    }
                  } else if (typeof item === 'object') {
                    findImagesRecursive(item, depth + 1);
                  }
                });
              } else if (typeof value === 'object') {
                findImagesRecursive(value, depth + 1);
              }
            }
          }
          
          findImagesRecursive(processedProduct);
          if (foundValidImages.length > 0) {
            fixedFromOtherFields++;
          }
        }
        
        // If still no valid images, generate better placeholder
        if (foundValidImages.length === 0) {
          // Create a more descriptive placeholder
          const productName = processedProduct.name || 'Product';
          const category = processedProduct.category || '';
          const sku = processedProduct.sku || '';
          
          // Use a better placeholder service with product details
          const placeholderText = encodeURIComponent(productName.substring(0, 30));
          const placeholderUrl = `https://via.placeholder.com/400x400/cccccc/333333.png?text=${placeholderText}`;
          
          foundValidImages = [placeholderUrl];
          addedPlaceholder++;
        }
        
        // Update the product with valid images
        processedProduct.images = foundValidImages;
        processedProduct.imageUrl = foundValidImages[0];
      }
      
      // Progress indicator
      if ((index + 1) % 5000 === 0) {
        process.stdout.write(`\rProcessing: ${index + 1}/${products.length} products...`);
      }
      
      return processedProduct;
    });
    
    console.log('\n\n=== Image Fix Statistics ===');
    console.log(`Products that already had valid images: ${alreadyValid}`);
    console.log(`Products with PDF "images": ${pdfImages}`);
    console.log(`Products with other invalid images: ${invalidImages}`);
    console.log(`\n=== Fixes Applied ===`);
    console.log(`Fixed from variants: ${fixedFromVariants}`);
    console.log(`Fixed from colors: ${fixedFromColors}`);
    console.log(`Fixed from other fields: ${fixedFromOtherFields}`);
    console.log(`Added placeholder images: ${addedPlaceholder}`);
    
    // Final verification
    let finalValidCount = 0;
    let stillPdfCount = 0;
    let stillInvalidCount = 0;
    const problemProducts = [];
    
    processedProducts.forEach(product => {
      const images = product.images || [];
      if (images.length > 0) {
        const firstImg = images[0];
        if (isValidImageUrl(firstImg) && !firstImg.includes('placeholder')) {
          finalValidCount++;
        } else if (firstImg.includes('.pdf')) {
          stillPdfCount++;
          if (problemProducts.length < 10) {
            problemProducts.push(product);
          }
        } else if (firstImg.includes('placeholder')) {
          // Placeholder is acceptable
          finalValidCount++;
        } else {
          stillInvalidCount++;
          if (problemProducts.length < 10) {
            problemProducts.push(product);
          }
        }
      }
    });
    
    console.log(`\n=== Final Results ===`);
    console.log(`✅ Products with valid images: ${finalValidCount} (${(finalValidCount/products.length*100).toFixed(1)}%)`);
    console.log(`⚠️  Products with placeholder images: ${addedPlaceholder}`);
    console.log(`❌ Products still with PDF: ${stillPdfCount}`);
    console.log(`❌ Products still with invalid images: ${stillInvalidCount}`);
    
    // Show problem products
    if (problemProducts.length > 0) {
      console.log(`\n📋 Sample problem products:`);
      problemProducts.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name || 'Unnamed'} (SKU: ${product.sku || 'No SKU'})`);
        console.log(`   Image: ${product.images[0]}`);
      });
    }
    
    // Save the fully fixed file
    const outputPath = path.join(__dirname, '..', 'products-fully-fixed.json');
    console.log('\n💾 Saving fully fixed products file...');
    await fs.writeFile(outputPath, JSON.stringify(processedProducts, null, 2));
    console.log(`✅ Saved as products-fully-fixed.json`);
    
    console.log('\n✅ Image fix complete!');
    console.log(`All ${products.length} products now have displayable images (real or placeholder).`);
    
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
    console.error(error.stack);
  }
}

console.log('=== Fix PDF and Invalid Images ===');
console.log('This tool replaces PDF files and invalid URLs with real product images\n');
fixPdfAndInvalidImages();