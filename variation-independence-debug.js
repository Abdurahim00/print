// Enhanced debug script for variation independence testing
// Paste this into the browser console to monitor design persistence

console.log("=== VARIATION INDEPENDENCE DEBUG MONITOR V2 ===");

// Monitor localStorage changes
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  if (key === 'variationDesigns') {
    console.log('📝 [DEBUG] Saving designs to localStorage');
    try {
      const designs = JSON.parse(value);
      console.table(designs.map(d => ({
        variationId: d.variationId,
        viewMode: d.viewMode,
        hasDesign: (d.canvasJSON?.objects?.length || 0) > 0,
        objectCount: d.canvasJSON?.objects?.length || 0,
        timestamp: new Date(d.lastModified).toLocaleTimeString()
      })));
      
      // Check for duplicate variation IDs (shouldn't happen)
      const ids = designs.map(d => `${d.variationId}_${d.viewMode}`);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicates.length > 0) {
        console.error('⚠️ DUPLICATE VARIATION IDS DETECTED:', duplicates);
      }
    } catch (e) {
      console.error('Could not parse designs:', e);
    }
  }
  return originalSetItem.apply(this, arguments);
};

// Function to check current variation designs
window.checkVariationDesigns = function() {
  console.log('\n📊 Current Variation Designs:');
  const stored = localStorage.getItem('variationDesigns');
  if (stored) {
    const designs = JSON.parse(stored);
    
    // Group by product ID
    const byProduct = {};
    designs.forEach(d => {
      const productId = d.variationId.split('_')[0] === 'single' 
        ? d.variationId.split('_')[1] 
        : d.variationId.split('_')[0];
      if (!byProduct[productId]) {
        byProduct[productId] = [];
      }
      byProduct[productId].push(d);
    });
    
    // Display grouped designs
    Object.entries(byProduct).forEach(([productId, productDesigns]) => {
      console.log(`\n📦 Product: ${productId}`);
      console.table(productDesigns.map(d => ({
        variationId: d.variationId,
        viewMode: d.viewMode,
        objects: d.canvasJSON?.objects?.length || 0,
        area: d.designAreaCm2 || 0,
        lastModified: new Date(d.lastModified).toLocaleTimeString()
      })));
    });
  } else {
    console.log('No designs in localStorage');
  }
};

// Function to clear all designs
window.clearAllDesigns = function() {
  localStorage.removeItem('variationDesigns');
  localStorage.removeItem('designCanvasJSON');
  console.log('✅ All designs cleared from localStorage');
  console.log('Refresh the page to reset Redux state');
};

// Function to clear designs for specific product
window.clearProductDesigns = function(productId) {
  const stored = localStorage.getItem('variationDesigns');
  if (stored) {
    const designs = JSON.parse(stored);
    const filtered = designs.filter(d => !d.variationId.includes(productId));
    localStorage.setItem('variationDesigns', JSON.stringify(filtered));
    console.log(`✅ Cleared designs for product ${productId}`);
  }
};

// Function to verify variation independence
window.testVariationIndependence = function() {
  console.log('\n🧪 Testing Variation Independence:');
  const stored = localStorage.getItem('variationDesigns');
  if (!stored) {
    console.log('No designs to test');
    return;
  }
  
  const designs = JSON.parse(stored);
  const issues = [];
  
  // Check if variation IDs include both color and view
  designs.forEach(d => {
    const parts = d.variationId.split('_');
    if (parts[0] !== 'single' && parts.length < 3) {
      issues.push(`Missing view in variation ID: ${d.variationId}`);
    }
    if (d.variationId !== `${d.variationId.split('_').slice(0, -1).join('_')}_${d.viewMode}`) {
      if (!d.variationId.startsWith('single_')) {
        issues.push(`View mode mismatch: ${d.variationId} vs ${d.viewMode}`);
      }
    }
  });
  
  if (issues.length > 0) {
    console.error('❌ Issues found:', issues);
  } else {
    console.log('✅ All variation IDs are properly formatted');
  }
  
  // Check for unexpected design sharing
  const uniqueDesigns = new Map();
  designs.forEach(d => {
    const canvasStr = JSON.stringify(d.canvasJSON);
    if (uniqueDesigns.has(canvasStr) && d.canvasJSON?.objects?.length > 0) {
      console.warn(`⚠️ Identical designs found in:`, [uniqueDesigns.get(canvasStr), d.variationId]);
    } else {
      uniqueDesigns.set(canvasStr, d.variationId);
    }
  });
  
  return issues.length === 0;
};

// Function to monitor Redux state changes
window.monitorReduxState = function() {
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    console.log("Redux DevTools available - check the Redux tab for state changes");
  } else {
    console.log("Redux DevTools not available");
  }
  
  // Try to access Redux store directly if available
  if (window.store) {
    const state = window.store.getState();
    console.log('Current Redux state:', {
      selectedProduct: state.design?.selectedProduct?.id,
      productColor: state.design?.productColor,
      viewMode: state.design?.viewMode,
      variationDesignsCount: state.design?.variationDesigns?.length
    });
  }
};

// Function to simulate variation switching
window.simulateVariationSwitch = function(color, viewMode) {
  console.log(`\n🔄 Simulating switch to color: ${color}, view: ${viewMode}`);
  
  // You would need to dispatch Redux actions here
  // This is just for demonstration
  console.log('To actually switch, use the UI or dispatch Redux actions');
};

// Function to get current variation ID
window.getCurrentVariationId = function() {
  // Try to get from Redux store if available
  if (window.store) {
    const state = window.store.getState();
    const product = state.design?.selectedProduct;
    const color = state.design?.productColor;
    const view = state.design?.viewMode;
    
    if (product) {
      if (product.hasVariations) {
        const colorSuffix = color ? color.replace('#', '') : 'default';
        return `${product.id}_${colorSuffix}_${view}`;
      } else {
        return `single_${product.id}_${view}`;
      }
    }
  }
  return null;
};

// Auto-run checks on load
setTimeout(() => {
  console.log('\n📊 Initial Status:');
  window.checkVariationDesigns();
  const currentId = window.getCurrentVariationId();
  if (currentId) {
    console.log(`📍 Current variation ID: ${currentId}`);
  }
  window.testVariationIndependence();
}, 1000);

console.log(`
🛠️ Available Debug Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• checkVariationDesigns()    - View all saved designs grouped by product
• clearAllDesigns()          - Clear all designs from storage
• clearProductDesigns(id)    - Clear designs for specific product
• testVariationIndependence() - Test if variations are properly independent
• getCurrentVariationId()     - Get the current variation ID
• monitorReduxState()        - Monitor Redux state changes

📋 Manual Testing Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Select a product with color variations
2. Add a design to RED + FRONT
3. Switch to BLUE + FRONT → Should be empty ✅
4. Add different design to BLUE + FRONT
5. Switch to RED + BACK → Should be empty ✅
6. Switch back to RED + FRONT → Original design should appear ✅
7. Switch to BLUE + FRONT → Blue design should appear ✅

Monitor the console for any issues during these steps.
`);