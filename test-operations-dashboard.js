const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'info') {
        console.log('PAGE LOG:', msg.text());
      } else if (msg.type() === 'error') {
        console.log('PAGE ERROR:', msg.text());
      }
    });
    
    console.log('Opening operations dashboard...');
    await page.goto('http://localhost:3000/dashboard', { 
      waitUntil: 'networkidle0',
      timeout: 15000 
    });
    
    // Wait a bit for React to render
    await page.waitForTimeout(3000);
    
    // Click on Operations tab
    console.log('Clicking Operations tab...');
    const operationsTab = await page.$('button:has-text("Operations")');
    if (operationsTab) {
      await operationsTab.click();
    } else {
      // Try alternative selector
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const operationsBtn = buttons.find(btn => btn.textContent.includes('Operations'));
        if (operationsBtn) operationsBtn.click();
      });
    }
    
    // Wait for operations dashboard to load
    await page.waitForTimeout(3000);
    
    // Check for orders
    console.log('Checking for orders...');
    
    // Look for order cards or table rows
    const orders = await page.evaluate(() => {
      // Try to find order elements
      const orderCards = document.querySelectorAll('[class*="border"][class*="rounded"]');
      const orderRows = document.querySelectorAll('tr');
      const orderElements = document.querySelectorAll('[id^="ORD-"]');
      
      // Check for "No orders" message
      const noOrdersText = document.body.textContent.includes('No orders in queue');
      const allProcessedText = document.body.textContent.includes('All orders have been processed');
      
      // Get any visible order IDs
      const visibleOrders = [];
      document.querySelectorAll('*').forEach(el => {
        if (el.textContent && el.textContent.match(/ORD-\d+/)) {
          const match = el.textContent.match(/ORD-\d+/);
          if (match && !visibleOrders.includes(match[0])) {
            visibleOrders.push(match[0]);
          }
        }
      });
      
      return {
        orderCardsCount: orderCards.length,
        orderRowsCount: orderRows.length,
        orderElementsCount: orderElements.length,
        noOrdersMessage: noOrdersText,
        allProcessedMessage: allProcessedText,
        visibleOrderIds: visibleOrders,
        bodyText: document.body.textContent.substring(0, 500)
      };
    });
    
    console.log('\n=== Operations Dashboard Status ===');
    console.log('Order cards found:', orders.orderCardsCount);
    console.log('Order rows found:', orders.orderRowsCount);
    console.log('Order elements found:', orders.orderElementsCount);
    console.log('Shows "No orders" message:', orders.noOrdersMessage);
    console.log('Shows "All processed" message:', orders.allProcessedMessage);
    console.log('Visible order IDs:', orders.visibleOrderIds);
    
    if (orders.visibleOrderIds.length > 0) {
      console.log('\n✅ SUCCESS: Orders are loading in the operations dashboard!');
      console.log('Found orders:', orders.visibleOrderIds.join(', '));
    } else {
      console.log('\n❌ ISSUE: No orders visible in the operations dashboard');
      console.log('Dashboard content preview:', orders.bodyText);
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'operations-dashboard.png', fullPage: true });
    console.log('\nScreenshot saved as operations-dashboard.png');
    
  } catch (error) {
    console.error('Error during test:', error.message);
  } finally {
    await browser.close();
  }
})();