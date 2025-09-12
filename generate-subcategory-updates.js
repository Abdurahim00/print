const fs = require('fs');

// URL pattern to subcategory mapping
const urlPatternToSubcategory = {
  // Giveaways
  'giveaways/nyckelringar': 'keychains',
  'giveaways/nyckelringar-led': 'led-keychains',
  'giveaways/nyckelringar-metall': 'metal-keychains',
  'giveaways/nyckelringar-plast': 'plastic-keychains',
  'giveaways/nyckelringar-funktion': 'functional-keychains',
  'giveaways/pins': 'pins-badges',
  'giveaways/magneter': 'magnets',
  'giveaways/reflexer': 'reflectors',
  'giveaways/armband': 'wristbands',
  'giveaways/stickers': 'stickers',
  'giveaways/ballonger': 'balloons',
  'giveaways/godis': 'candy',
  'giveaways/minttabletter': 'mints',
  
  // Bags  
  'vaskor/shoppingvaskor': 'shopping-bags',
  'vaskor/trolleyvaskor': 'trolley-bags',
  'vaskor/resvaskor': 'travel-bags',
  'vaskor/ryggsackar': 'backpacks',
  'vaskor/sportvaskor': 'sports-bags',
  'vaskor/axelvaskor': 'shoulder-bags',
  'vaskor/datorvaskor': 'laptop-bags',
  'vaskor/kylvaskor': 'cooler-bags',
  'vaskor/gympapase': 'gym-bags',
  'vaskor/necessarer': 'toiletry-bags',
  
  // Apparel
  'profilklader/t-shirts': 't-shirts',
  'profilklader/pikeer': 'polo-shirts',
  'profilklader/skjortor': 'shirts',
  'profilklader/huvtrojor': 'hoodies',
  'profilklader/sweatshirts': 'sweatshirts',
  'profilklader/jackor': 'jackets',
  'profilklader/vaster': 'vests',
  'profilklader/byxor': 'pants',
  'profilklader/shorts': 'shorts',
  'profilklader/kepsar': 'caps',
  'profilklader/mossor': 'beanies',
  'profilklader/hattar': 'hats',
  'profilklader/scarves': 'scarves',
  'profilklader/handskar': 'gloves',
  'profilklader/arbetsklaeder': 'workwear',
  'profilklader/sportklader': 'sportswear',
  
  // Office supplies
  'kontorsmaterial/pennor': 'pens',
  'kontorsmaterial/blyertspennor': 'pencils',
  'kontorsmaterial/anteckningsbocker': 'notebooks',
  'kontorsmaterial/kalendrar': 'calendars',
  'kontorsmaterial/mappar': 'folders',
  
  // Electronics
  'elektronik/powerbanks': 'powerbanks',
  'elektronik/usb-minnen': 'usb-drives',
  'elektronik/hogtalare': 'speakers',
  'elektronik/horlurar': 'headphones',
  'elektronik/mobilaccessoarer': 'phone-accessories',
  'elektronik/datortillbehor': 'computer-accessories',
  'elektronik/ficklampor': 'flashlights',
  
  // Home & Kitchen
  'hem-och-kok/muggar': 'mugs',
  'hem-och-kok/termosar': 'thermoses',
  'hem-och-kok/flaskor': 'bottles',
  'hem-och-kok/vattenflaskor': 'water-bottles',
  'hem-och-kok/sportflaskor': 'sports-bottles',
  'hem-och-kok/koksredskap': 'kitchen-tools',
  'hem-och-kok/handdukar': 'towels',
  
  // Sports & Leisure
  'sport-och-fritid/sportredskap': 'sports-equipment',
  'sport-och-fritid/golfprodukter': 'golf-products',
  'sport-och-fritid/fotbollar': 'footballs',
  'sport-och-fritid/paraply': 'umbrellas',
  'sport-och-fritid/leksaker': 'toys',
  'sport-och-fritid/spel': 'games',
  
  // Brand-based patterns
  'craft-jackor': 'jackets',
  'craft-trojor': 'shirts',
  'craft-byxor': 'pants',
  'craft-klubbklader': 'team-wear'
};

function extractSubcategoryFromUrl(url) {
  if (!url) return null;
  
  const lowerUrl = url.toLowerCase();
  
  // Try to match against our patterns
  for (const [pattern, subcategory] of Object.entries(urlPatternToSubcategory)) {
    if (lowerUrl.includes(pattern.toLowerCase())) {
      return subcategory;
    }
  }
  
  // For brand URLs, extract the product type
  if (lowerUrl.includes('/varumarken/')) {
    const parts = lowerUrl.split('/');
    const brandIndex = parts.indexOf('varumarken');
    if (brandIndex !== -1 && parts[brandIndex + 2]) {
      const productType = parts[brandIndex + 2];
      
      // Map common Swedish product types to English subcategories
      const typeMapping = {
        'jackor': 'jackets',
        'trojor': 'shirts',
        'byxor': 'pants',
        'shorts': 'shorts',
        'kepsar': 'caps',
        'mossor': 'beanies',
        'skor': 'shoes',
        'vantar': 'gloves',
        'halsduk': 'scarves',
        'vaster': 'vests',
        'huvtrojor': 'hoodies',
        't-shirts': 't-shirts',
        'poloshirts': 'polo-shirts',
        'skjortor': 'shirts',
        'underklaeder': 'underwear',
        'klubbklader': 'team-wear',
        'traningsklader': 'sportswear',
        'accessoarer': 'accessories'
      };
      
      for (const [swedish, english] of Object.entries(typeMapping)) {
        if (productType.includes(swedish)) {
          return english;
        }
      }
    }
  }
  
  return null;
}

async function generateSubcategoryUpdates() {
  try {
    // Load products
    console.log('Loading products...');
    let products;
    
    if (fs.existsSync('products-with-categories.json')) {
      products = JSON.parse(fs.readFileSync('products-with-categories.json', 'utf8'));
      console.log(`Loaded ${products.length} products from products-with-categories.json`);
    } else {
      products = JSON.parse(fs.readFileSync('products-backup-1757320722828.json', 'utf8'));
      console.log(`Loaded ${products.length} products from backup file`);
    }
    
    // Statistics
    const stats = {
      total: products.length,
      matched: 0,
      unmatched: 0,
      subcategoryDistribution: {},
      categoryDistribution: {}
    };
    
    // Group products by subcategory
    const productsBySubcategory = {};
    const unmatchedProducts = [];
    
    for (const product of products) {
      const productId = product._id?.$oid || product._id || product.id;
      const sourceUrl = product.sourceUrl || product.variant_url || product.url;
      
      if (!sourceUrl) {
        unmatchedProducts.push({
          id: productId,
          name: product.name,
          reason: 'No URL'
        });
        stats.unmatched++;
        continue;
      }
      
      // Extract subcategory from URL
      let subcategory = extractSubcategoryFromUrl(sourceUrl);
      
      // Use extracted subcategory from previous analysis if available
      if (!subcategory && product.extractedSubcategory) {
        subcategory = product.extractedSubcategory;
      }
      
      if (subcategory) {
        stats.matched++;
        
        if (!productsBySubcategory[subcategory]) {
          productsBySubcategory[subcategory] = [];
        }
        
        productsBySubcategory[subcategory].push({
          id: productId,
          name: product.name,
          url: sourceUrl,
          category: product.category || product.extractedCategory
        });
        
        // Track distribution
        if (!stats.subcategoryDistribution[subcategory]) {
          stats.subcategoryDistribution[subcategory] = 0;
        }
        stats.subcategoryDistribution[subcategory]++;
        
        // Track category distribution
        const category = product.category || product.extractedCategory || 'unknown';
        if (!stats.categoryDistribution[category]) {
          stats.categoryDistribution[category] = new Set();
        }
        stats.categoryDistribution[category].add(subcategory);
      } else {
        unmatchedProducts.push({
          id: productId,
          name: product.name,
          url: sourceUrl,
          reason: 'Could not extract subcategory'
        });
        stats.unmatched++;
      }
    }
    
    // Generate update script
    console.log('\nGenerating update script...');
    
    let updateScript = `// MongoDB Update Script for Product Subcategories
// Generated: ${new Date().toISOString()}
// Total Products: ${stats.total}
// Matched: ${stats.matched}
// Unmatched: ${stats.unmatched}

// This script groups products by their target subcategory
// You'll need to map these subcategory names to your actual subcategory IDs

const updates = {
`;
    
    // Add products grouped by subcategory
    Object.entries(productsBySubcategory)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([subcategory, products]) => {
        updateScript += `  // ${subcategory} (${products.length} products)\n`;
        updateScript += `  '${subcategory}': [\n`;
        
        products.slice(0, 100).forEach(product => {
          updateScript += `    { id: '${product.id}', name: '${product.name.replace(/'/g, "\\'")}' },\n`;
        });
        
        if (products.length > 100) {
          updateScript += `    // ... and ${products.length - 100} more products\n`;
        }
        
        updateScript += `  ],\n\n`;
      });
    
    updateScript += `};

// Example usage:
// 1. First, get your subcategory IDs from the database
// 2. Then run updates like:
/*
for (const [subcategoryName, products] of Object.entries(updates)) {
  const subcategoryId = getSubcategoryIdByName(subcategoryName);
  if (subcategoryId) {
    const productIds = products.map(p => p.id);
    db.products.updateMany(
      { _id: { $in: productIds } },
      { $set: { subcategoryId: subcategoryId, subcategory: subcategoryId } }
    );
  }
}
*/
`;
    
    // Save the update script
    fs.writeFileSync('product-subcategory-updates.js', updateScript);
    console.log('Update script saved to: product-subcategory-updates.js');
    
    // Generate CSV for easy review
    console.log('\nGenerating CSV report...');
    
    let csv = 'Subcategory,Product Count,Sample Products\n';
    
    Object.entries(stats.subcategoryDistribution)
      .sort((a, b) => b[1] - a[1])
      .forEach(([subcategory, count]) => {
        const samples = productsBySubcategory[subcategory]
          .slice(0, 3)
          .map(p => p.name)
          .join('; ');
        csv += `"${subcategory}",${count},"${samples}"\n`;
      });
    
    fs.writeFileSync('subcategory-distribution.csv', csv);
    console.log('CSV report saved to: subcategory-distribution.csv');
    
    // Print summary
    console.log('\n========================================');
    console.log('SUBCATEGORY EXTRACTION SUMMARY');
    console.log('========================================\n');
    
    console.log('STATISTICS:');
    console.log(`Total Products: ${stats.total}`);
    console.log(`Successfully Matched: ${stats.matched} (${(stats.matched/stats.total*100).toFixed(2)}%)`);
    console.log(`Unmatched: ${stats.unmatched} (${(stats.unmatched/stats.total*100).toFixed(2)}%)`);
    console.log(`Unique Subcategories Found: ${Object.keys(stats.subcategoryDistribution).length}`);
    
    console.log('\n\nTOP 20 SUBCATEGORIES:');
    Object.entries(stats.subcategoryDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .forEach(([subcategory, count], index) => {
        console.log(`  ${index + 1}. ${subcategory}: ${count} products`);
      });
    
    console.log('\n\nCATEGORY TO SUBCATEGORY MAPPING:');
    Object.entries(stats.categoryDistribution).forEach(([category, subcategories]) => {
      console.log(`  ${category}: ${subcategories.size} subcategories`);
      if (subcategories.size <= 10) {
        console.log(`    ${Array.from(subcategories).join(', ')}`);
      }
    });
    
    // Save full report
    const fullReport = {
      timestamp: new Date().toISOString(),
      statistics: stats,
      productsBySubcategory: Object.fromEntries(
        Object.entries(productsBySubcategory).map(([k, v]) => [k, v.length])
      ),
      unmatchedSample: unmatchedProducts.slice(0, 100)
    };
    
    fs.writeFileSync('subcategory-extraction-report.json', JSON.stringify(fullReport, null, 2));
    console.log('\nFull report saved to: subcategory-extraction-report.json');
    
    console.log('\n✅ COMPLETED!');
    console.log('\nNext steps:');
    console.log('1. Review the generated files:');
    console.log('   - product-subcategory-updates.js (update script)');
    console.log('   - subcategory-distribution.csv (for review)');
    console.log('   - subcategory-extraction-report.json (detailed report)');
    console.log('2. Map the subcategory names to your actual database subcategory IDs');
    console.log('3. Run the updates to populate products into their correct subcategories');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
console.log('Starting subcategory extraction and update generation...\n');
generateSubcategoryUpdates();