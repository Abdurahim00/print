const http = require('http');

async function testProductsAPI() {
  console.log('🚀 Testing Products API...\n');
  
  // Test 1: Fetch designable products
  console.log('📍 Test 1: Fetching designable products...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/products?designableOnly=true&limit=5',
    method: 'GET'
  };
  
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ API responded with ${response.products?.length || 0} products\n`);
          
          if (response.products && response.products.length > 0) {
            response.products.forEach((product, index) => {
              console.log(`📦 Product ${index + 1}: ${product.name}`);
              console.log(`   ID: ${product._id || product.id}`);
              console.log(`   Price: $${product.price}`);
              console.log(`   Has images array: ${Array.isArray(product.images)}`);
              console.log(`   Images count: ${product.images?.length || 0}`);
              console.log(`   Has variants: ${Array.isArray(product.variants)}`);
              console.log(`   Variants count: ${product.variants?.length || 0}`);
              
              // Check for image URLs
              let imageUrl = null;
              if (product.images && product.images[0]) {
                imageUrl = product.images[0];
              } else if (product.variants && product.variants[0]) {
                if (product.variants[0].variant_image) {
                  imageUrl = product.variants[0].variant_image;
                } else if (product.variants[0].images && product.variants[0].images[0]) {
                  imageUrl = product.variants[0].images[0];
                }
              } else if (product.image) {
                imageUrl = product.image;
              }
              
              console.log(`   First image URL: ${imageUrl ? imageUrl.substring(0, 80) + '...' : 'NO IMAGE FOUND'}`);
              
              // Check specific image fields
              if (product.frontImage || product.backImage) {
                console.log(`   Has individual angle images: Yes`);
                console.log(`     - frontImage: ${!!product.frontImage}`);
                console.log(`     - backImage: ${!!product.backImage}`);
              }
              
              console.log('');
            });
            
            // Summary
            const withImages = response.products.filter(p => 
              (p.images && p.images.length > 0) || 
              (p.variants && p.variants.length > 0) ||
              p.image ||
              p.frontImage
            ).length;
            
            console.log('📊 Summary:');
            console.log(`   Total products: ${response.products.length}`);
            console.log(`   Products with images: ${withImages}`);
            console.log(`   Products without images: ${response.products.length - withImages}`);
            
            if (withImages < response.products.length) {
              console.log('\n❌ WARNING: Some products have no images!');
              const noImageProducts = response.products.filter(p => 
                !(p.images && p.images.length > 0) && 
                !(p.variants && p.variants.length > 0) &&
                !p.image &&
                !p.frontImage
              );
              noImageProducts.forEach(p => {
                console.log(`   - ${p.name} (${p._id || p.id})`);
              });
            }
          } else {
            console.log('❌ No products returned from API');
          }
        } catch (error) {
          console.error('❌ Failed to parse API response:', error);
          console.log('Raw response:', data.substring(0, 500));
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ API request failed:', error);
      resolve();
    });
    
    req.end();
  });
}

// Run the test
testProductsAPI().then(() => {
  console.log('\n🏁 Test complete!');
}).catch(console.error);