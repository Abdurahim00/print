const fs = require('fs').promises;
const path = require('path');

async function usePdfsAsImages() {
  try {
    // Read the original backup file
    const jsonPath = path.join(__dirname, '..', 'products-backup-1757320722828.json');
    
    console.log('📖 Reading original products backup file...');
    const rawData = await fs.readFile(jsonPath, 'utf8');
    const products = JSON.parse(rawData);
    console.log(`✅ Found ${products.length} products\n`);
    
    // Statistics
    let hasImages = 0;
    let hasPdfImages = 0;
    let hasOnlyPdf = 0;
    let emptyImages = 0;
    let fixedFromVariants = 0;
    let fixedFromColors = 0;
    let usedPdfAsImage = 0;
    
    // Helper function to check if URL is an image or PDF
    function isImageOrPdf(url) {
      if (!url || typeof url !== 'string') return false;
      const lower = url.toLowerCase();
      return lower.includes('.jpg') || lower.includes('.jpeg') || 
             lower.includes('.png') || lower.includes('.gif') || 
             lower.includes('.webp') || lower.includes('.svg') ||
             lower.includes('.pdf');
    }
    
    // Helper function to convert PDF URL to thumbnail/preview
    // Note: PDFs can be displayed in <iframe> or <embed> tags in HTML
    // For image display, we'll keep the PDF URL and handle it in the frontend
    function processPdfUrl(pdfUrl) {
      // Keep the original PDF URL - frontend can display it using:
      // 1. iframe: <iframe src={pdfUrl} />
      // 2. embed: <embed src={pdfUrl} type="application/pdf" />
      // 3. object: <object data={pdfUrl} type="application/pdf" />
      // 4. Google Docs Viewer: https://docs.google.com/viewer?url={pdfUrl}&embedded=true
      // 5. PDF.js or similar library for rendering
      return pdfUrl;
    }
    
    // Process each product
    const processedProducts = products.map((product, index) => {
      const processedProduct = { ...product };
      
      // Ensure images is an array
      if (!processedProduct.images) {
        processedProduct.images = [];
      } else if (typeof processedProduct.images === 'string') {
        processedProduct.images = [processedProduct.images];
      }
      
      // Collect all valid images (including PDFs)
      const validImages = [];
      
      // Process existing images array
      for (const img of processedProduct.images) {
        if (isImageOrPdf(img)) {
          if (img.toLowerCase().includes('.pdf')) {
            validImages.push(processPdfUrl(img));
            hasPdfImages++;
          } else {
            validImages.push(img);
          }
        }
      }
      
      // If no images yet, check imageUrl
      if (validImages.length === 0 && processedProduct.imageUrl) {
        if (isImageOrPdf(processedProduct.imageUrl)) {
          if (processedProduct.imageUrl.toLowerCase().includes('.pdf')) {
            validImages.push(processPdfUrl(processedProduct.imageUrl));
            usedPdfAsImage++;
          } else {
            validImages.push(processedProduct.imageUrl);
          }
        }
      }
      
      // If still no images, try variants
      if (validImages.length === 0 && processedProduct.variants && Array.isArray(processedProduct.variants)) {
        for (const variant of processedProduct.variants) {
          if (variant.variant_image && isImageOrPdf(variant.variant_image)) {
            if (!validImages.includes(variant.variant_image)) {
              if (variant.variant_image.toLowerCase().includes('.pdf')) {
                validImages.push(processPdfUrl(variant.variant_image));
              } else {
                validImages.push(variant.variant_image);
              }
            }
          }
        }
        if (validImages.length > 0) {
          fixedFromVariants++;
        }
      }
      
      // If still no images, try colors
      if (validImages.length === 0 && processedProduct.colors && Array.isArray(processedProduct.colors)) {
        for (const color of processedProduct.colors) {
          if (color.images && Array.isArray(color.images)) {
            for (const img of color.images) {
              if (isImageOrPdf(img) && !validImages.includes(img)) {
                if (img.toLowerCase().includes('.pdf')) {
                  validImages.push(processPdfUrl(img));
                } else {
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
      
      // Update statistics
      if (validImages.length > 0) {
        if (validImages.every(img => img.toLowerCase().includes('.pdf'))) {
          hasOnlyPdf++;
        } else {
          hasImages++;
        }
      } else {
        emptyImages++;
        // For products with absolutely no images, create a text-based placeholder
        const productName = (processedProduct.name || 'Product').substring(0, 30);
        validImages.push(`https://via.placeholder.com/400x400/f0f0f0/333333.png?text=${encodeURIComponent(productName)}`);
      }
      
      // Update product with all found images
      processedProduct.images = validImages;
      processedProduct.imageUrl = validImages[0] || null;
      
      // Add a flag to indicate if the main image is a PDF
      processedProduct.hasPdfImage = validImages.length > 0 && validImages[0].toLowerCase().includes('.pdf');
      
      // Progress indicator
      if ((index + 1) % 5000 === 0) {
        process.stdout.write(`\rProcessing: ${index + 1}/${products.length} products...`);
      }
      
      return processedProduct;
    });
    
    console.log('\n\n=== Processing Statistics ===');
    console.log(`Products with regular images: ${hasImages}`);
    console.log(`Products with only PDF images: ${hasOnlyPdf}`);
    console.log(`Products that had PDF in images array: ${hasPdfImages}`);
    console.log(`Products where PDF was used from imageUrl: ${usedPdfAsImage}`);
    console.log(`Products with no images (got placeholder): ${emptyImages}`);
    console.log(`Fixed from variants: ${fixedFromVariants}`);
    console.log(`Fixed from colors: ${fixedFromColors}`);
    
    // Final verification
    let finalStats = {
      withImages: 0,
      withPdfOnly: 0,
      withMixed: 0,
      withPlaceholder: 0
    };
    
    processedProducts.forEach(product => {
      const images = product.images || [];
      if (images.length > 0) {
        const hasPdf = images.some(img => img.toLowerCase().includes('.pdf'));
        const hasRegular = images.some(img => !img.toLowerCase().includes('.pdf') && !img.includes('placeholder'));
        const hasPlaceholder = images.some(img => img.includes('placeholder'));
        
        if (hasPlaceholder) {
          finalStats.withPlaceholder++;
        } else if (hasPdf && !hasRegular) {
          finalStats.withPdfOnly++;
        } else if (hasPdf && hasRegular) {
          finalStats.withMixed++;
        } else {
          finalStats.withImages++;
        }
      }
    });
    
    console.log(`\n=== Final Results ===`);
    console.log(`✅ Products with regular images: ${finalStats.withImages} (${(finalStats.withImages/products.length*100).toFixed(1)}%)`);
    console.log(`📄 Products with PDF images: ${finalStats.withPdfOnly} (${(finalStats.withPdfOnly/products.length*100).toFixed(1)}%)`);
    console.log(`🔄 Products with mixed (images + PDF): ${finalStats.withMixed} (${(finalStats.withMixed/products.length*100).toFixed(1)}%)`);
    console.log(`⚠️  Products with placeholder: ${finalStats.withPlaceholder} (${(finalStats.withPlaceholder/products.length*100).toFixed(1)}%)`);
    console.log(`\n✅ Total with displayable content: ${products.length} (100%)`);
    
    // Save the final file
    const outputPath = path.join(__dirname, '..', 'products-with-pdfs.json');
    console.log('\n💾 Saving products with PDFs as valid images...');
    await fs.writeFile(outputPath, JSON.stringify(processedProducts, null, 2));
    console.log(`✅ Saved as products-with-pdfs.json`);
    
    // Show examples of products with PDFs
    const pdfProducts = processedProducts.filter(p => p.hasPdfImage);
    if (pdfProducts.length > 0) {
      console.log(`\n📄 Sample products using PDF as image (${pdfProducts.length} total):`);
      pdfProducts.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name || 'Unnamed'} (SKU: ${product.sku || 'No SKU'})`);
        console.log(`   PDF: ${product.images[0]}`);
      });
    }
    
    console.log('\n=== IMPORTANT FRONTEND IMPLEMENTATION NOTES ===');
    console.log('Products with PDF "images" need special handling in your React/Next.js app:');
    console.log('\n1. Check if image URL ends with .pdf');
    console.log('2. For PDFs, use one of these approaches:');
    console.log('   a) Google Docs Viewer (easiest):');
    console.log('      <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`} />');
    console.log('   b) Direct embed:');
    console.log('      <embed src={pdfUrl} type="application/pdf" width="100%" height="500px" />');
    console.log('   c) Use PDF.js library for full control');
    console.log('   d) Generate thumbnails server-side using a service');
    console.log('\n3. Example React component:');
    console.log('   {imageUrl.endsWith(".pdf") ? (');
    console.log('     <iframe src={`https://docs.google.com/viewer?url=${imageUrl}&embedded=true`} />');
    console.log('   ) : (');
    console.log('     <img src={imageUrl} alt={productName} />');
    console.log('   )}');
    
    console.log('\n✅ All products now have displayable content!');
    
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
    console.error(error.stack);
  }
}

console.log('=== Use PDFs as Images ===');
console.log('Processing products to use PDF files as displayable images\n');
usePdfsAsImages();