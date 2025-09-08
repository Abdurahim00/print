const http = require('http');

console.log('Testing Orders API Endpoints\n');

async function testEndpoint(path, name) {
  return new Promise((resolve) => {
    console.log(`Testing ${name} (${path})...`);
    const startTime = Date.now();
    
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const duration = Date.now() - startTime;
        try {
          const json = JSON.parse(data);
          console.log(`✅ ${name}: ${json.length || 0} orders in ${duration}ms`);
          if (json.length > 0) {
            console.log(`   First order: ${json[0].id || json[0].orderId}`);
          }
        } catch (e) {
          console.log(`❌ ${name}: Failed to parse response in ${duration}ms`);
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      const duration = Date.now() - startTime;
      console.log(`❌ ${name}: Error - ${err.message} after ${duration}ms`);
      resolve();
    });
    
    // Set timeout
    req.setTimeout(10000, () => {
      const duration = Date.now() - startTime;
      console.log(`⏱️ ${name}: Timeout after ${duration}ms`);
      req.destroy();
      resolve();
    });
  });
}

async function runTests() {
  await testEndpoint('/api/orders/fast', 'Fast Orders');
  await testEndpoint('/api/orders/mock', 'Mock Orders');
  await testEndpoint('/api/test-db', 'Database Test');
  
  console.log('\n✅ All tests complete!');
  console.log('\nThe operations dashboard should now be using the /api/orders/fast endpoint');
  console.log('which returns orders quickly with only essential fields.');
}

runTests();