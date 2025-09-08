const fetch = require('node-fetch');

async function testMockOrders() {
  try {
    console.log('Fetching mock orders...');
    const response = await fetch('http://localhost:3000/api/orders/mock');
    const orders = await response.json();
    
    console.log(`\nFound ${orders.length} orders`);
    
    orders.forEach((order, orderIndex) => {
      console.log(`\n========== Order ${orderIndex + 1}: ${order.id} ==========`);
      console.log(`Customer: ${order.customerName}`);
      console.log(`Total: $${order.total}`);
      console.log(`Items: ${order.items.length}`);
      
      order.items.forEach((item, itemIndex) => {
        console.log(`\n  Item ${itemIndex + 1}: ${item.name}`);
        console.log(`    Price: $${item.price} x ${item.quantity}`);
        
        // Check for design data in various locations
        const hasDesignData = item.designData && Object.keys(item.designData).length > 0;
        const hasDesignCanvasJSON = !!item.designCanvasJSON;
        const hasDesignContext = !!item.designContext;
        const canvasJSON = item.designCanvasJSON || item.designData?.canvasJSON || item.designData?.designCanvasJSON;
        
        console.log(`    Has designData: ${hasDesignData}`);
        console.log(`    Has designCanvasJSON: ${hasDesignCanvasJSON}`);
        console.log(`    Has designContext: ${hasDesignContext}`);
        
        if (canvasJSON) {
          console.log(`    Canvas objects: ${canvasJSON.objects?.length || 0}`);
          if (canvasJSON.objects) {
            canvasJSON.objects.forEach((obj, objIndex) => {
              if (obj.type === 'text') {
                console.log(`      Object ${objIndex + 1}: Text - "${obj.text}"`);
              } else {
                console.log(`      Object ${objIndex + 1}: ${obj.type}`);
              }
            });
          }
        }
      });
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Wait a bit for server to be ready
setTimeout(testMockOrders, 5000);