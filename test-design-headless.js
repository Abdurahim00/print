const puppeteer = require('puppeteer');

async function testDesignTool() {
  console.log('🚀 Starting Headless Design Tool Test...\n');
  
  let browser;
  try {
    // Launch browser in headless mode
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Enable console logging
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('getCurrentImage') || 
          text.includes('CentralCanvas') || 
          text.includes('ProductModal') ||
          text.includes('🖼️') ||
          text.includes('✅') ||
          text.includes('❌')) {
        console.log(`[Browser]:`, text);
      }
    });
    
    page.on('error', err => {
      console.error('Page error:', err.message);
    });

    page.on('pageerror', err => {
      console.error('Page error:', err.message);
    });
    
    // Test 1: Load design tool
    console.log('📍 Test 1: Loading design tool page...');
    try {
      await page.goto('http://localhost:3000/design-tool', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      console.log('✅ Design tool page loaded\n');
    } catch (e) {
      console.log('❌ Failed to load design tool:', e.message);
      return;
    }
    
    // Wait a bit for React to render
    await page.waitForTimeout(3000);
    
    // Test 2: Check if product modal button exists
    console.log('📍 Test 2: Looking for product selection button...');
    
    // Try multiple selectors for the browse products button
    const buttonSelectors = [
      'button:has-text("Browse Products")',
      'button:contains("Browse Products")',
      '[aria-label*="product"]',
      'button svg[class*="Package"]',
      'button[title*="Product"]',
      'div[role="button"] svg',
      '.left-toolbar button:first-child',
      'button'
    ];
    
    let browseButton = null;
    for (const selector of buttonSelectors) {
      try {
        const buttons = await page.$$(selector);
        console.log(`   Checking selector "${selector}": found ${buttons.length} elements`);
        
        // Check each button for product-related content
        for (const button of buttons) {
          const text = await button.evaluate(el => el.textContent || '');
          const title = await button.evaluate(el => el.getAttribute('title') || '');
          const ariaLabel = await button.evaluate(el => el.getAttribute('aria-label') || '');
          
          if (text.includes('Browse') || text.includes('Product') || 
              title.includes('Product') || ariaLabel.includes('Product')) {
            browseButton = button;
            console.log(`   Found button with text: "${text}", title: "${title}", aria-label: "${ariaLabel}"`);
            break;
          }
        }
        if (browseButton) break;
      } catch (e) {
        // Selector might not be valid, continue
      }
    }
    
    // If still not found, click the first button in the toolbar
    if (!browseButton) {
      console.log('   Trying first button in left toolbar...');
      browseButton = await page.$('.fixed.left-4 button');
    }
    
    if (browseButton) {
      console.log('✅ Found product button\n');
      
      // Test 3: Click browse products
      console.log('📍 Test 3: Clicking product button...');
      await browseButton.click();
      await page.waitForTimeout(2000); // Wait for modal
      
      // Test 4: Check if modal opened and has products
      console.log('📍 Test 4: Checking for product modal...');
      const modal = await page.$('[role="dialog"]');
      if (modal) {
        console.log('✅ Modal opened');
        
        const modalProducts = await page.$$('[role="dialog"] img');
        console.log(`   Found ${modalProducts.length} product images in modal\n`);
        
        // Test 5: Select first product
        console.log('📍 Test 5: Selecting first product...');
        
        // Try to find and click select button
        const selectButton = await page.$('[role="dialog"] button:has-text("Select Product")');
        if (!selectButton) {
          // Try alternative: click the first product card
          const firstProduct = await page.$('[role="dialog"] button');
          if (firstProduct) {
            await firstProduct.click();
            console.log('   Clicked first product card');
          }
        } else {
          await selectButton.click();
          console.log('   Clicked "Select Product" button');
        }
        
        await page.waitForTimeout(3000); // Wait for product to load
        console.log('✅ Product selection attempted\n');
        
        // Test 6: Check if product image is displayed
        console.log('📍 Test 6: Checking if product image is visible in canvas...');
        
        // Execute in page context to check for images
        const imageCheck = await page.evaluate(() => {
          const results = {
            allImages: [],
            productImages: [],
            canvasElement: null,
            logs: []
          };
          
          // Check all images on the page
          const images = document.querySelectorAll('img');
          results.logs.push(`Total images on page: ${images.length}`);
          
          images.forEach(img => {
            const imgInfo = {
              src: img.src,
              displayed: img.offsetWidth > 0 && img.offsetHeight > 0,
              width: img.offsetWidth,
              height: img.offsetHeight,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              complete: img.complete,
              alt: img.alt,
              className: img.className,
              parent: img.parentElement?.className
            };
            
            results.allImages.push(imgInfo);
            
            // Check if this is likely a product image
            if (img.src && (
              img.src.includes('unpr.io') || 
              img.src.includes('IMAGE-') ||
              img.src.includes('product') ||
              img.alt.includes('product') ||
              img.parentElement?.className?.includes('canvas')
            )) {
              results.productImages.push(imgInfo);
              results.logs.push(`Found product image: ${img.src.substring(0, 60)}...`);
              results.logs.push(`  Displayed: ${imgInfo.displayed}, Size: ${imgInfo.width}x${imgInfo.height}`);
            }
          });
          
          // Check for canvas element
          const canvas = document.querySelector('#design-canvas');
          if (canvas) {
            results.canvasElement = {
              found: true,
              width: canvas.offsetWidth,
              height: canvas.offsetHeight,
              displayed: canvas.offsetWidth > 0 && canvas.offsetHeight > 0
            };
            results.logs.push(`Canvas found: ${canvas.offsetWidth}x${canvas.offsetHeight}`);
          }
          
          // Check localStorage for selected product
          try {
            const sessionData = localStorage.getItem('designSessionState');
            if (sessionData) {
              const session = JSON.parse(sessionData);
              if (session.selectedProduct) {
                results.logs.push(`Session has selected product: ${session.selectedProduct.name}`);
                results.logs.push(`  Has image: ${!!session.selectedProduct.image}`);
                results.logs.push(`  Has images: ${!!session.selectedProduct.images}`);
                results.logs.push(`  Has variants: ${!!session.selectedProduct.variants}`);
              }
            }
          } catch (e) {
            results.logs.push(`Error reading session: ${e.message}`);
          }
          
          return results;
        });
        
        // Display results
        console.log('📊 Image Check Results:');
        console.log(`   Total images: ${imageCheck.allImages.length}`);
        console.log(`   Product images found: ${imageCheck.productImages.length}`);
        console.log(`   Canvas element: ${imageCheck.canvasElement?.found ? 'Yes' : 'No'}`);
        
        if (imageCheck.canvasElement?.found) {
          console.log(`   Canvas size: ${imageCheck.canvasElement.width}x${imageCheck.canvasElement.height}`);
        }
        
        console.log('\n📋 Detailed logs:');
        imageCheck.logs.forEach(log => console.log(`   ${log}`));
        
        if (imageCheck.productImages.length > 0) {
          console.log('\n✅ SUCCESS: Product images found and displayed!');
          imageCheck.productImages.forEach((img, i) => {
            console.log(`\n   Product Image ${i + 1}:`);
            console.log(`     URL: ${img.src.substring(0, 80)}...`);
            console.log(`     Displayed: ${img.displayed ? 'Yes ✅' : 'No ❌'}`);
            console.log(`     Size: ${img.width}x${img.height} (natural: ${img.naturalWidth}x${img.naturalHeight})`);
            console.log(`     Loaded: ${img.complete ? 'Yes ✅' : 'No ❌'}`);
            console.log(`     Alt: ${img.alt || 'none'}`);
          });
        } else {
          console.log('\n❌ FAILURE: No product images found in canvas area!');
          console.log('\nAll images on page:');
          imageCheck.allImages.slice(0, 5).forEach((img, i) => {
            console.log(`   Image ${i + 1}: ${img.src.substring(0, 60)}... (${img.width}x${img.height})`);
          });
        }
        
        // Take a screenshot for debugging
        await page.screenshot({ path: 'design-tool-test.png', fullPage: true });
        console.log('\n📸 Screenshot saved as design-tool-test.png');
        
      } else {
        console.log('❌ Modal did not open');
      }
    } else {
      console.log('❌ No product button found');
      
      // Take screenshot to see what's on the page
      await page.screenshot({ path: 'design-tool-error.png', fullPage: true });
      console.log('📸 Error screenshot saved as design-tool-error.png');
      
      // Get page content for debugging
      const pageContent = await page.evaluate(() => {
        return {
          buttons: Array.from(document.querySelectorAll('button')).map(b => ({
            text: b.textContent,
            className: b.className
          })),
          title: document.title,
          bodyText: document.body.textContent.substring(0, 200)
        };
      });
      
      console.log('\nPage debugging info:');
      console.log('  Title:', pageContent.title);
      console.log('  Buttons found:', pageContent.buttons.length);
      pageContent.buttons.forEach(b => {
        if (b.text) console.log(`    - "${b.text.trim()}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  console.log('\n🏁 Test complete!');
}

// Run the test
testDesignTool().catch(console.error);