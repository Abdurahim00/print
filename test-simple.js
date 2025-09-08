const http = require('http');
const fs = require('fs');

async function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function testDesignToolFlow() {
  console.log('🧪 SIMPLE DESIGN TOOL TEST\n');
  console.log('=' .repeat(50));
  
  try {
    // Step 1: Test API endpoint
    console.log('\n📍 Step 1: Testing Product API');
    console.log('-'.repeat(40));
    
    const apiResponse = await makeRequest('/api/products?designableOnly=true&limit=2');
    const products = JSON.parse(apiResponse.data);
    
    if (!products.products || products.products.length === 0) {
      console.log('❌ No products returned from API');
      return;
    }
    
    console.log(`✅ Found ${products.products.length} designable products`);
    
    // Analyze first product structure
    const firstProduct = products.products[0];
    console.log('\n📦 First Product Analysis:');
    console.log(`  Name: ${firstProduct.name}`);
    console.log(`  ID: ${firstProduct._id || firstProduct.id}`);
    console.log(`  Price: $${firstProduct.price}`);
    
    // Check image sources
    console.log('\n🖼️ Image Sources:');
    let imageUrl = null;
    
    if (firstProduct.images && firstProduct.images.length > 0) {
      imageUrl = firstProduct.images[0];
      console.log(`  ✅ images array: ${firstProduct.images.length} images`);
      console.log(`     First: ${imageUrl.substring(0, 60)}...`);
    } else {
      console.log(`  ❌ images array: empty or missing`);
    }
    
    if (firstProduct.variants && firstProduct.variants.length > 0) {
      console.log(`  ✅ variants array: ${firstProduct.variants.length} variants`);
      if (firstProduct.variants[0].variant_image) {
        imageUrl = imageUrl || firstProduct.variants[0].variant_image;
        console.log(`     First variant_image: ${firstProduct.variants[0].variant_image.substring(0, 60)}...`);
      }
      if (firstProduct.variants[0].images) {
        console.log(`     First variant has images: ${firstProduct.variants[0].images.length}`);
      }
    } else {
      console.log(`  ❌ variants array: empty or missing`);
    }
    
    if (firstProduct.image) {
      imageUrl = imageUrl || firstProduct.image;
      console.log(`  ✅ image field: ${firstProduct.image.substring(0, 60)}...`);
    } else {
      console.log(`  ❌ image field: missing`);
    }
    
    // Check individual angle images
    const angleImages = ['frontImage', 'backImage', 'leftImage', 'rightImage', 'materialImage'];
    let hasAngleImages = false;
    angleImages.forEach(field => {
      if (firstProduct[field]) {
        hasAngleImages = true;
        imageUrl = imageUrl || firstProduct[field];
        console.log(`  ✅ ${field}: ${firstProduct[field].substring(0, 60)}...`);
      }
    });
    
    if (!hasAngleImages) {
      console.log(`  ❌ No individual angle images (frontImage, backImage, etc.)`);
    }
    
    // Check variations structure
    if (firstProduct.hasVariations && firstProduct.variations) {
      console.log(`  ✅ variations (multi-color): ${firstProduct.variations.length} variations`);
      const firstVariation = firstProduct.variations[0];
      if (firstVariation.images && firstVariation.images.length > 0) {
        console.log(`     First variation has ${firstVariation.images.length} images`);
        const angleImage = firstVariation.images.find(img => img.url);
        if (angleImage) {
          imageUrl = imageUrl || angleImage.url;
          console.log(`     Sample: angle=${angleImage.angle}, url=${angleImage.url.substring(0, 60)}...`);
        }
      }
    }
    
    // Step 2: Test image URL
    console.log('\n📍 Step 2: Testing Image URL');
    console.log('-'.repeat(40));
    
    if (imageUrl) {
      console.log(`✅ Found image URL: ${imageUrl}`);
      
      // Try to fetch the image
      const https = require('https');
      const url = new URL(imageUrl);
      
      await new Promise((resolve) => {
        https.get(imageUrl, (res) => {
          console.log(`  HTTP Status: ${res.statusCode}`);
          console.log(`  Content-Type: ${res.headers['content-type']}`);
          console.log(`  Content-Length: ${res.headers['content-length']} bytes`);
          
          if (res.statusCode === 200 && res.headers['content-type']?.startsWith('image/')) {
            console.log('  ✅ Image is accessible and valid');
          } else {
            console.log('  ❌ Image might not be accessible');
          }
          
          res.on('data', () => {}); // Consume data
          res.on('end', resolve);
        }).on('error', (err) => {
          console.log(`  ❌ Error fetching image: ${err.message}`);
          resolve();
        });
      });
    } else {
      console.log('❌ No image URL found in product data!');
    }
    
    // Step 3: Simulate what ProductModal does
    console.log('\n📍 Step 3: Simulating ProductModal Selection');
    console.log('-'.repeat(40));
    
    const selectedProduct = {
      id: firstProduct.id || firstProduct._id,
      name: firstProduct.name,
      price: `$${firstProduct.price}`,
      image: imageUrl || '',
      images: firstProduct.images || [],
      variants: firstProduct.variants || [],
      // Include angle images for single products
      frontImage: firstProduct.frontImage,
      backImage: firstProduct.backImage,
      leftImage: firstProduct.leftImage,
      rightImage: firstProduct.rightImage,
      materialImage: firstProduct.materialImage
    };
    
    console.log('Selected product structure:');
    console.log(`  id: ${selectedProduct.id}`);
    console.log(`  name: ${selectedProduct.name}`);
    console.log(`  image: ${selectedProduct.image ? 'Yes' : 'No'}`);
    console.log(`  images.length: ${selectedProduct.images.length}`);
    console.log(`  variants.length: ${selectedProduct.variants.length}`);
    
    // Step 4: Test what getCurrentImage would return
    console.log('\n📍 Step 4: Testing getCurrentImage Logic');
    console.log('-'.repeat(40));
    
    let currentImage = '';
    
    // Same logic as getCurrentImage function
    if (selectedProduct.variants && selectedProduct.variants.length > 0) {
      const firstVariant = selectedProduct.variants[0];
      if (firstVariant.variant_image) {
        currentImage = firstVariant.variant_image;
        console.log('✅ Found image from: variants[0].variant_image');
      } else if (firstVariant.images && firstVariant.images.length > 0) {
        currentImage = firstVariant.images[0];
        console.log('✅ Found image from: variants[0].images[0]');
      }
    }
    
    if (!currentImage && selectedProduct.images && selectedProduct.images.length > 0) {
      currentImage = selectedProduct.images[0];
      console.log('✅ Found image from: images[0]');
    }
    
    if (!currentImage && selectedProduct.image) {
      currentImage = selectedProduct.image;
      console.log('✅ Found image from: image field');
    }
    
    if (!currentImage && selectedProduct.frontImage) {
      currentImage = selectedProduct.frontImage;
      console.log('✅ Found image from: frontImage field');
    }
    
    if (currentImage) {
      console.log(`\n🎯 FINAL IMAGE URL: ${currentImage}`);
    } else {
      console.log('\n❌ NO IMAGE URL FOUND - This is the problem!');
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    
    if (currentImage) {
      console.log('✅ Product should display visually in design tool');
      console.log(`   Image URL: ${currentImage}`);
      console.log('\nIf image is NOT showing, possible causes:');
      console.log('  1. CORS blocking external images');
      console.log('  2. CSS z-index issues (image behind canvas)');
      console.log('  3. Image element not rendering properly');
      console.log('  4. React state not updating correctly');
    } else {
      console.log('❌ Product will NOT display - no image URL found');
      console.log('\nProduct data structure issue:');
      console.log('  - Product has no images array');
      console.log('  - Product has no variants with images');
      console.log('  - Product has no image field');
      console.log('  - Product has no angle images');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDesignToolFlow().catch(console.error);