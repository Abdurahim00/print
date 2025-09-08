const puppeteer = require('puppeteer');

async function testDesignTool() {
  console.log('🚀 Starting Design Tool Test...\n');
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (text.includes('getCurrentImage') || text.includes('CentralCanvas') || text.includes('ProductModal')) {
        console.log(`[Browser ${type}]:`, text);
      }
    });
    
    page.on('error', err => {
      console.error('Page error:', err);
    });
    
    // Test 1: Load design tool
    console.log('📍 Test 1: Loading design tool page...');
    await page.goto('http://localhost:3000/design-tool', { waitUntil: 'networkidle2' });
    console.log('✅ Design tool page loaded\n');
    
    // Test 2: Check if product modal button exists
    console.log('📍 Test 2: Looking for "Browse Products" button...');
    const browseButton = await page.$('button:has-text("Browse Products")');
    if (browseButton) {
      console.log('✅ Found "Browse Products" button\n');
      
      // Test 3: Click browse products
      console.log('📍 Test 3: Clicking "Browse Products"...');
      await browseButton.click();
      await page.waitForTimeout(2000); // Wait for modal
      
      // Test 4: Check if modal opened and has products
      const modalProducts = await page.$$('[role="dialog"] img');
      console.log(`✅ Modal opened with ${modalProducts.length} product images\n`);
      
      // Test 5: Select first product
      console.log('📍 Test 5: Selecting first product...');
      const selectButton = await page.$('[role="dialog"] button:has-text("Select Product")');
      if (selectButton) {
        await selectButton.click();
        await page.waitForTimeout(3000); // Wait for product to load
        console.log('✅ Product selected\n');
        
        // Test 6: Check if product image is displayed
        console.log('📍 Test 6: Checking if product image is visible in canvas...');
        
        // Check for the product image in the canvas area
        const productImage = await page.evaluate(() => {
          const images = document.querySelectorAll('img');
          for (let img of images) {
            // Look for images from the product CDN
            if (img.src && (img.src.includes('unpr.io') || img.src.includes('IMAGE-'))) {
              return {
                found: true,
                src: img.src,
                displayed: img.offsetWidth > 0 && img.offsetHeight > 0,
                width: img.offsetWidth,
                height: img.offsetHeight,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                complete: img.complete
              };
            }
          }
          return { found: false };
        });
        
        if (productImage.found) {
          console.log('✅ Product image found!');
          console.log('   Source:', productImage.src);
          console.log('   Displayed:', productImage.displayed ? 'Yes' : 'No');
          console.log('   Dimensions:', `${productImage.width}x${productImage.height}`);
          console.log('   Natural:', `${productImage.naturalWidth}x${productImage.naturalHeight}`);
          console.log('   Loaded:', productImage.complete ? 'Yes' : 'No');
          
          if (!productImage.displayed) {
            console.log('\n❌ ISSUE: Image exists but is not visible!');
            console.log('   Possible reasons:');
            console.log('   - Image failed to load (check CORS)');
            console.log('   - CSS hiding the image');
            console.log('   - Image dimensions are 0');
          }
        } else {
          console.log('❌ No product image found in canvas!');
          
          // Debug: Get all images on page
          const allImages = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img')).map(img => ({
              src: img.src,
              width: img.offsetWidth,
              height: img.offsetHeight
            }));
          });
          console.log('\n   All images on page:');
          allImages.forEach(img => {
            console.log(`   - ${img.src.substring(0, 50)}... (${img.width}x${img.height})`);
          });
        }
        
        // Test 7: Check console for getCurrentImage logs
        console.log('\n📍 Test 7: Checking console logs...');
        const logs = await page.evaluate(() => {
          // Try to get the currentImage value from the component
          const hasProduct = window.localStorage.getItem('designSessionState');
          return hasProduct;
        });
        
        if (logs) {
          const session = JSON.parse(logs);
          console.log('✅ Session data found:');
          console.log('   Product:', session.selectedProduct?.name);
          console.log('   Has image:', !!session.selectedProduct?.image);
          console.log('   Has images:', !!session.selectedProduct?.images);
          console.log('   Has variants:', !!session.selectedProduct?.variants);
        }
        
      } else {
        console.log('❌ No "Select Product" button found');
      }
    } else {
      console.log('❌ No "Browse Products" button found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  console.log('\n🏁 Test complete!');
}

// Run the test
testDesignTool().catch(console.error);