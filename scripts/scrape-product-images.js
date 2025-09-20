const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

// Simple fetch function for URLs
async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, { 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Extract image URLs from HTML
function extractImageUrls(html, sourceUrl) {
  const images = new Set();
  const baseUrl = new URL(sourceUrl).origin;
  
  // Pattern to find image URLs in various contexts
  const patterns = [
    // Direct img tags
    /<img[^>]+src=["']([^"']+)["']/gi,
    // Data attributes
    /data-src=["']([^"']+)["']/gi,
    /data-original=["']([^"']+)["']/gi,
    /data-image=["']([^"']+)["']/gi,
    // Lazy loading
    /data-lazy=["']([^"']+)["']/gi,
    /data-lazy-src=["']([^"']+)["']/gi,
    // Background images
    /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/gi,
    // Picture elements
    /<source[^>]+srcset=["']([^"']+)["']/gi,
    // Product specific patterns
    /product-image[^>]*src=["']([^"']+)["']/gi,
    /itemimage[^"']*\/([^"'\s]+\.(?:jpg|jpeg|png|webp|gif))/gi,
    // JSON-LD structured data
    /"image":\s*"([^"]+)"/gi,
    // Open Graph
    /property="og:image"\s+content="([^"]+)"/gi,
    /content="([^"]+)"\s+property="og:image"/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let imageUrl = match[1];
      
      // Skip if it's a placeholder, PDF, or video
      if (imageUrl && 
          !imageUrl.includes('placeholder') && 
          !imageUrl.includes('.pdf') &&
          !imageUrl.includes('youtube') &&
          !imageUrl.includes('vimeo') &&
          !imageUrl.includes('data:image/svg')) {
        
        // Make absolute URL
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl;
        } else if (imageUrl.startsWith('/')) {
          imageUrl = baseUrl + imageUrl;
        } else if (!imageUrl.startsWith('http')) {
          imageUrl = baseUrl + '/' + imageUrl;
        }
        
        // Only add actual image files
        if (/\.(jpg|jpeg|png|webp|gif|bmp)/i.test(imageUrl)) {
          images.add(imageUrl);
        }
      }
    }
  });
  
  return Array.from(images);
}

// Process a single product
async function scrapeProductImages(product, index, total) {
  if (!product.sourceUrl) return product;
  
  try {
    console.log(`[${index}/${total}] Scraping: ${product.name || 'Unnamed'}`);
    console.log(`  URL: ${product.sourceUrl}`);
    
    const html = await fetchUrl(product.sourceUrl);
    const scrapedImages = extractImageUrls(html, product.sourceUrl);
    
    if (scrapedImages.length > 0) {
      console.log(`  ✅ Found ${scrapedImages.length} images`);
      
      // Filter for product images (usually contain 'product', 'item', or are larger)
      const productImages = scrapedImages.filter(img => 
        img.includes('product') || 
        img.includes('item') || 
        img.includes('/full/') ||
        img.includes('/large/') ||
        img.includes('/zoom/')
      );
      
      const finalImages = productImages.length > 0 ? productImages : scrapedImages;
      
      // Update product with scraped images
      return {
        ...product,
        images: finalImages.slice(0, 10), // Limit to 10 images
        imageUrl: finalImages[0],
        scrapedAt: new Date().toISOString()
      };
    } else {
      console.log(`  ⚠️  No images found`);
      return product;
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return product;
  }
}

// Main function
async function scrapeAllProductImages() {
  try {
    // Read products file
    const jsonPath = path.join(__dirname, '..', 'products-optimized.json');
    console.log('📖 Reading products file...');
    const products = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    console.log(`✅ Found ${products.length} products\n`);
    
    // Find products that need image scraping
    const needsScraping = products.filter(p => {
      const hasProblematicImages = p.images && p.images.some(img => 
        img.includes('placeholder') || 
        img.includes('.pdf') || 
        img.includes('youtube')
      );
      const noImages = !p.images || p.images.length === 0;
      const hasSourceUrl = p.sourceUrl && p.sourceUrl.startsWith('http');
      
      return hasSourceUrl && (noImages || hasProblematicImages);
    });
    
    console.log(`🔍 ${needsScraping.length} products need image scraping\n`);
    
    if (needsScraping.length === 0) {
      console.log('No products need scraping!');
      return;
    }
    
    // Process in batches to avoid overwhelming servers
    const batchSize = 5;
    const updatedProducts = [...products];
    
    for (let i = 0; i < needsScraping.length; i += batchSize) {
      const batch = needsScraping.slice(i, Math.min(i + batchSize, needsScraping.length));
      
      console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(needsScraping.length/batchSize)}`);
      
      const promises = batch.map((product, idx) => 
        scrapeProductImages(product, i + idx + 1, needsScraping.length)
      );
      
      const results = await Promise.all(promises);
      
      // Update products array with scraped data
      results.forEach(updatedProduct => {
        const index = products.findIndex(p => 
          (p._id === updatedProduct._id) || 
          (p.sku === updatedProduct.sku && p.name === updatedProduct.name)
        );
        if (index !== -1) {
          updatedProducts[index] = updatedProduct;
        }
      });
      
      // Small delay between batches
      if (i + batchSize < needsScraping.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Save updated products
    const outputPath = path.join(__dirname, '..', 'products-with-scraped-images.json');
    console.log('\n💾 Saving products with scraped images...');
    await fs.writeFile(outputPath, JSON.stringify(updatedProducts, null, 2));
    
    // Statistics
    let successCount = 0;
    updatedProducts.forEach(p => {
      if (p.scrapedAt && p.images && p.images.length > 0 && 
          !p.images[0].includes('placeholder') && 
          !p.images[0].includes('.pdf')) {
        successCount++;
      }
    });
    
    console.log('\n=== Scraping Complete ===');
    console.log(`✅ Successfully scraped images for ${successCount} products`);
    console.log(`📁 Saved to: products-with-scraped-images.json`);
    console.log('\nNext step: Import to MongoDB with:');
    console.log('node scripts/import-to-mongodb.js');
    
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
  }
}

console.log('=== Product Image Scraper ===');
console.log('This will visit product URLs and extract real product images\n');
scrapeAllProductImages();