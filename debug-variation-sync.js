// Debug script to help identify the syncing issue
// Add this to the browser console to monitor what's happening

console.log("=== VARIATION SYNC DEBUG MONITOR ===");

// Monitor localStorage changes
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  if (key === 'variationDesigns') {
    console.log('📝 localStorage.setItem called for variationDesigns');
    try {
      const designs = JSON.parse(value);
      console.log('Designs being saved:', designs.map(d => ({
        variationId: d.variationId,
        viewMode: d.viewMode,
        objectCount: d.canvasJSON?.objects?.length || 0
      })));
    } catch (e) {
      console.error('Could not parse designs');
    }
  }
  return originalSetItem.apply(this, arguments);
};

// Monitor Redux state changes
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  console.log("Redux DevTools available - check the Redux tab for state changes");
}

// Function to check current variation designs in localStorage
window.checkVariationDesigns = function() {
  const stored = localStorage.getItem('variationDesigns');
  if (stored) {
    const designs = JSON.parse(stored);
    console.table(designs.map(d => ({
      variationId: d.variationId,
      viewMode: d.viewMode,
      objects: d.canvasJSON?.objects?.length || 0,
      lastModified: new Date(d.lastModified).toLocaleTimeString()
    })));
  } else {
    console.log('No designs in localStorage');
  }
};

// Function to clear all designs
window.clearAllDesigns = function() {
  localStorage.removeItem('variationDesigns');
  console.log('✅ All designs cleared from localStorage');
  console.log('Refresh the page to reset Redux state');
};

// Function to check what variation ID is being generated
window.getCurrentVariationInfo = function() {
  const productId = prompt("Enter product ID:");
  const color = prompt("Enter color hex (e.g., #FF0000):");
  const viewMode = prompt("Enter view mode (e.g., front):");
  
  const colorSuffix = color ? color.replace('#', '') : 'default';
  const variationId = `${productId}_${colorSuffix}_${viewMode}`;
  
  console.log('Generated variation ID:', variationId);
  return variationId;
};

console.log(`
Available debug commands:
- checkVariationDesigns() - See all saved designs
- clearAllDesigns() - Clear all designs
- getCurrentVariationInfo() - Test variation ID generation

Monitor the console for localStorage saves.
`);