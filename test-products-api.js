const fetch = require('node-fetch');

async function testProductsAPI() {
  try {
    console.log('Testing /api/products endpoint...\n');
    
    const response = await fetch('http://localhost:3000/api/products?page=1&limit=20', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    const text = await response.text();
    console.log('\nRaw response:', text.substring(0, 500));
    
    try {
      const data = JSON.parse(text);
      console.log('\nParsed JSON:');
      console.log('- Products count:', data.products ? data.products.length : 'No products array');
      console.log('- Pagination:', data.pagination);
      
      if (data.products && data.products.length > 0) {
        console.log('\nFirst product:', data.products[0]);
      }
    } catch (parseError) {
      console.log('\nFailed to parse as JSON:', parseError.message);
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testProductsAPI();