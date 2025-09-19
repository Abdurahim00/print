const fs = require('fs').promises;
const path = require('path');

async function prioritizeRealImages() {
  try {
    // Read the products with PDFs file
    const jsonPath = path.join(__dirname, '..', 'products-with-pdfs.json');
    
    console.log('📖 Reading products file...');
    const rawData = await fs.readFile(jsonPath, 'utf8');
    const products = JSON.parse(rawData);
    console.log(`✅ Found ${products.length} products\n`);
    
    // Statistics
    let reorderedCount = 0;
    let alreadyOptimal = 0;
    let onlyPdfs = 0;
    let noImages = 0;
    
    // Valid image extensions (not PDF)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    
    // Helper to check if URL is a real image (not PDF)
    function isRealImage(url) {
      if (!url || typeof url !== 'string') return false;
      const lower = url.toLowerCase();
      return imageExtensions.some(ext => lower.includes(ext)) && !lower.includes('placeholder');
    }
    
    // Helper to check if URL is a PDF
    function isPdf(url) {
      return url && typeof url === 'string' && url.toLowerCase().includes('.pdf');
    }
    
    // Process each product
    const processedProducts = products.map((product, index) => {
      const processedProduct = { ...product };
      
      if (!processedProduct.images || processedProduct.images.length === 0) {
        noImages++;
        return processedProduct;
      }
      
      // Separate images into categories
      const realImages = [];
      const pdfImages = [];
      const placeholders = [];
      
      for (const img of processedProduct.images) {
        if (!img) continue;
        
        if (img.includes('placeholder')) {
          placeholders.push(img);
        } else if (isPdf(img)) {
          pdfImages.push(img);
        } else if (isRealImage(img)) {
          realImages.push(img);
        }
      }
      
      // Reorder: real images first, then PDFs, then placeholders
      const reorderedImages = [...realImages, ...pdfImages, ...placeholders];
      
      // Check if reordering was needed
      const originalFirst = processedProduct.images[0];
      const newFirst = reorderedImages[0];
      
      if (originalFirst !== newFirst) {
        reorderedCount++;
        console.log(`Reordered: ${product.name || 'Unnamed'}`);
        console.log(`  Was: ${originalFirst?.substring(0, 50)}...`);
        console.log(`  Now: ${newFirst?.substring(0, 50)}...`);
      } else if (isRealImage(originalFirst)) {
        alreadyOptimal++;
      } else if (isPdf(originalFirst) && realImages.length === 0) {
        onlyPdfs++;
      }
      
      // Update product
      processedProduct.images = reorderedImages;
      processedProduct.imageUrl = reorderedImages[0] || null;
      processedProduct.hasPdfImage = reorderedImages.length > 0 && isPdf(reorderedImages[0]);
      processedProduct.hasRealImage = realImages.length > 0;
      
      // Progress indicator
      if ((index + 1) % 5000 === 0) {
        process.stdout.write(`\rProcessing: ${index + 1}/${products.length} products...`);
      }
      
      return processedProduct;
    });
    
    console.log('\n\n=== Reordering Statistics ===');
    console.log(`Products reordered: ${reorderedCount}`);
    console.log(`Already optimal: ${alreadyOptimal}`);
    console.log(`Only PDFs available: ${onlyPdfs}`);
    console.log(`No images: ${noImages}`);
    
    // Final verification
    let finalStats = {
      withRealImageFirst: 0,
      withPdfFirst: 0,
      withPlaceholderFirst: 0,
      noImages: 0
    };
    
    processedProducts.forEach(product => {
      const images = product.images || [];
      if (images.length === 0) {
        finalStats.noImages++;
      } else {
        const first = images[0];
        if (isRealImage(first)) {
          finalStats.withRealImageFirst++;
        } else if (isPdf(first)) {
          finalStats.withPdfFirst++;
        } else if (first.includes('placeholder')) {
          finalStats.withPlaceholderFirst++;
        }
      }
    });
    
    console.log(`\n=== Final Results ===`);
    console.log(`✅ Products with real image first: ${finalStats.withRealImageFirst} (${(finalStats.withRealImageFirst/products.length*100).toFixed(1)}%)`);
    console.log(`📄 Products with PDF first (no real images): ${finalStats.withPdfFirst} (${(finalStats.withPdfFirst/products.length*100).toFixed(1)}%)`);
    console.log(`⚠️  Products with placeholder first: ${finalStats.withPlaceholderFirst} (${(finalStats.withPlaceholderFirst/products.length*100).toFixed(1)}%)`);
    console.log(`❌ Products with no images: ${finalStats.noImages}`);
    
    // Save the optimized file
    const outputPath = path.join(__dirname, '..', 'products-optimized.json');
    console.log('\n💾 Saving optimized products file...');
    await fs.writeFile(outputPath, JSON.stringify(processedProducts, null, 2));
    console.log(`✅ Saved as products-optimized.json`);
    
    // Show MASCOT Livigno as example
    const mascotLivigno = processedProducts.find(p => p.name && p.name.includes('MASCOT® Livigno'));
    if (mascotLivigno) {
      console.log('\n📋 Example - MASCOT® Livigno:');
      console.log(`  Name: ${mascotLivigno.name}`);
      console.log(`  First image: ${mascotLivigno.images[0]}`);
      console.log(`  Has real image: ${mascotLivigno.hasRealImage}`);
      console.log(`  Total images: ${mascotLivigno.images.length} (${mascotLivigno.images.filter(isRealImage).length} real, ${mascotLivigno.images.filter(isPdf).length} PDFs)`);
    }
    
    console.log('\n✅ Image optimization complete!');
    console.log('Real images are now prioritized over PDFs wherever available.');
    
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
    console.error(error.stack);
  }
}

console.log('=== Prioritize Real Images ===');
console.log('Reordering product images to show real images before PDFs\n');
prioritizeRealImages();