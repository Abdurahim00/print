const fs = require('fs').promises;
const path = require('path');

async function finalImageFix() {
  try {
    // Read the original backup file
    const jsonPath = path.join(__dirname, '..', 'products-backup-1757320722828.json');
    
    console.log('📖 Reading original products backup file...');
    const rawData = await fs.readFile(jsonPath, 'utf8');
    const products = JSON.parse(rawData);
    console.log(`✅ Found ${products.length} products\n`);
    
    // Statistics
    let hasValidImages = 0;
    let emptyImages = 0;
    let pdfOnly = 0;
    let placeholderInOriginal = 0;
    let fixedFromVariants = 0;
    let fixedFromColors = 0;
    let addedGenericPlaceholder = 0;
    
    // Process each product
    const processedProducts = products.map((product, index) => {
      const processedProduct = { ...product };
      
      // Ensure images is an array
      if (!processedProduct.images) {
        processedProduct.images = [];
      } else if (typeof processedProduct.images === 'string') {
        processedProduct.images = [processedProduct.images];
      }
      
      // Check if product has valid images
      const hasValidImage = processedProduct.images.some(img => {
        if (!img || typeof img !== 'string') return false;
        const lower = img.toLowerCase();
        // Image is valid if it's not a PDF and not empty
        return !lower.includes('.pdf') && img.trim() !== '';
      });
      
      if (hasValidImage) {
        // Filter out PDFs but keep all other images
        processedProduct.images = processedProduct.images.filter(img => {
          return img && !img.toLowerCase().includes('.pdf');
        });
        
        // Check for placeholder in original
        if (processedProduct.images.some(img => img.toLowerCase().includes('placeholder'))) {
          placeholderInOriginal++;
        }
        
        hasValidImages++;
      } else {
        // No valid images, try to find from other sources
        const validImages = [];
        
        // Check if only has PDFs
        if (processedProduct.images.some(img => img && img.includes('.pdf'))) {
          pdfOnly++;
        } else {
          emptyImages++;
        }
        
        // Try imageUrl
        if (processedProduct.imageUrl && 
            !processedProduct.imageUrl.includes('.pdf') && 
            processedProduct.imageUrl.trim() !== '') {
          validImages.push(processedProduct.imageUrl);
        }
        
        // Try variants
        if (validImages.length === 0 && processedProduct.variants && Array.isArray(processedProduct.variants)) {
          for (const variant of processedProduct.variants) {
            if (variant.variant_image && 
                !variant.variant_image.includes('.pdf') && 
                !variant.variant_image.includes('placeholder') &&
                variant.variant_image.trim() !== '') {
              if (!validImages.includes(variant.variant_image)) {
                validImages.push(variant.variant_image);
              }
            }
          }
          if (validImages.length > 0) {
            fixedFromVariants++;
          }
        }
        
        // Try colors
        if (validImages.length === 0 && processedProduct.colors && Array.isArray(processedProduct.colors)) {
          for (const color of processedProduct.colors) {
            if (color.images && Array.isArray(color.images)) {
              for (const img of color.images) {
                if (img && !img.includes('.pdf') && !img.includes('placeholder') && img.trim() !== '') {
                  if (!validImages.includes(img)) {
                    validImages.push(img);
                  }
                }
              }
            }
          }
          if (validImages.length > 0) {
            fixedFromColors++;
          }
        }
        
        // If still no valid images, add a generic placeholder
        if (validImages.length === 0) {
          const productName = (processedProduct.name || 'Product').replace(/[^a-zA-Z0-9 ]/g, '');
          const shortName = productName.substring(0, 25);
          validImages.push(`https://via.placeholder.com/400x400/e0e0e0/333333.png?text=${encodeURIComponent(shortName)}`);
          addedGenericPlaceholder++;
        }
        
        processedProduct.images = validImages;
      }
      
      // Ensure imageUrl is set
      if (processedProduct.images && processedProduct.images.length > 0) {
        processedProduct.imageUrl = processedProduct.images[0];
      }
      
      // Progress indicator
      if ((index + 1) % 5000 === 0) {
        process.stdout.write(`\rProcessing: ${index + 1}/${products.length} products...`);
      }
      
      return processedProduct;
    });
    
    console.log('\n\n=== Processing Statistics ===');
    console.log(`Products with valid images: ${hasValidImages}`);
    console.log(`Products with empty images: ${emptyImages}`);
    console.log(`Products with only PDFs: ${pdfOnly}`);
    console.log(`Products with placeholder in original data: ${placeholderInOriginal}`);
    console.log(`\n=== Fixes Applied ===`);
    console.log(`Fixed from variants: ${fixedFromVariants}`);
    console.log(`Fixed from colors: ${fixedFromColors}`);
    console.log(`Added generic placeholder: ${addedGenericPlaceholder}`);
    
    // Final verification
    let finalCount = {
      withRealImages: 0,
      withPlaceholder: 0,
      withPdf: 0,
      noImages: 0
    };
    
    processedProducts.forEach(product => {
      const images = product.images || [];
      if (images.length === 0) {
        finalCount.noImages++;
      } else {
        const firstImg = images[0].toLowerCase();
        if (firstImg.includes('placeholder')) {
          finalCount.withPlaceholder++;
        } else if (firstImg.includes('.pdf')) {
          finalCount.withPdf++;
        } else {
          finalCount.withRealImages++;
        }
      }
    });
    
    console.log(`\n=== Final Results ===`);
    console.log(`✅ Products with real images: ${finalCount.withRealImages} (${(finalCount.withRealImages/products.length*100).toFixed(1)}%)`);
    console.log(`⚠️  Products with placeholder: ${finalCount.withPlaceholder} (${(finalCount.withPlaceholder/products.length*100).toFixed(1)}%)`);
    console.log(`❌ Products with PDF: ${finalCount.withPdf}`);
    console.log(`❌ Products with no images: ${finalCount.noImages}`);
    
    // Save the final file
    const outputPath = path.join(__dirname, '..', 'products-final.json');
    console.log('\n💾 Saving final products file...');
    await fs.writeFile(outputPath, JSON.stringify(processedProducts, null, 2));
    console.log(`✅ Saved as products-final.json`);
    
    // Show some examples of products with placeholders
    const placeholderProducts = processedProducts.filter(p => 
      p.images && p.images[0] && p.images[0].includes('placeholder')
    );
    
    if (placeholderProducts.length > 0) {
      console.log(`\n📋 Sample products with placeholders (${placeholderProducts.length} total):`);
      placeholderProducts.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name || 'Unnamed'} (SKU: ${product.sku || 'No SKU'})`);
      });
    }
    
    console.log('\n✅ Final image processing complete!');
    console.log(`Total: ${products.length} products processed`);
    console.log(`Success rate: ${((finalCount.withRealImages / products.length) * 100).toFixed(1)}% have real product images`);
    
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
    console.error(error.stack);
  }
}

console.log('=== Final Image Fix ===');
console.log('Processing original product data to ensure all have valid images\n');
finalImageFix();