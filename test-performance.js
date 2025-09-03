// Performance test script for products page
const https = require('https');

async function testProductsAPI() {
  console.log('Testing Products API Performance...\n');
  
  const tests = [
    { 
      name: 'Basic products fetch', 
      url: 'http://localhost:3000/api/products?page=1&limit=20' 
    },
    {
      name: 'Products with field selection (optimized)',
      url: 'http://localhost:3000/api/products?page=1&limit=20&fields=name,price,image,categoryId'
    },
    {
      name: 'Categories fetch',
      url: 'http://localhost:3000/api/categories'
    },
    {
      name: 'Subcategories fetch',
      url: 'http://localhost:3000/api/subcategories'
    }
  ];
  
  for (const test of tests) {
    console.log(`Testing: ${test.name}`);
    const start = Date.now();
    
    try {
      const response = await fetch(test.url);
      const data = await response.json();
      const duration = Date.now() - start;
      
      console.log(`  ✓ Status: ${response.status}`);
      console.log(`  ✓ Time: ${duration}ms`);
      console.log(`  ✓ Response size: ${JSON.stringify(data).length} bytes`);
      
      if (data.products) {
        console.log(`  ✓ Products returned: ${data.products.length}`);
      } else if (Array.isArray(data)) {
        console.log(`  ✓ Items returned: ${data.length}`);
      }
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('\n=== Performance Improvements Summary ===');
  console.log('1. Index creation now happens only once per app lifecycle');
  console.log('2. API supports field selection to reduce payload size');
  console.log('3. Parallel fetching of categories and products');
  console.log('4. Client-side caching for 1 minute');
  console.log('5. Reduced debounce delay from 500ms to 300ms');
  console.log('6. Image lazy loading with loading states');
  console.log('7. Categories/subcategories skip re-fetching if already loaded');
}

// Wait for server to be ready then run tests
setTimeout(testProductsAPI, 5000);