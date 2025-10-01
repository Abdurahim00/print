const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'printwrap';

async function checkVariantsStructure() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');
    
    // Check various variant field names
    console.log('\n🔍 Checking variant field names...\n');
    
    const fieldChecks = [
      'variants',
      'variants_dict',
      'variantsDict',
      'variations',
      'colors',
      'options'
    ];
    
    for (const field of fieldChecks) {
      const count = await collection.countDocuments({ 
        [field]: { $exists: true, $ne: [] } 
      });
      if (count > 0) {
        console.log(`✅ "${field}": ${count} products`);
        
        // Get a sample
        const sample = await collection.findOne({ 
          [field]: { $exists: true, $ne: [] } 
        });
        
        if (sample) {
          console.log(`   Sample structure:`);
          console.log(`   - Product: ${sample.name || 'Unnamed'}`);
          console.log(`   - Array length: ${sample[field].length}`);
          if (sample[field][0]) {
            console.log(`   - First item keys: ${Object.keys(sample[field][0]).join(', ')}`);
          }
        }
      }
    }
    
    // Look for MASCOT Linz specifically
    console.log('\n🔍 Looking for MASCOT Linz product...\n');
    
    const mascotSearch = [
      { name: { $regex: /MASCOT.*Linz/i } },
      { 'originalData.Title': { $regex: /MASCOT.*Linz/i } },
      { description: { $regex: /MASCOT.*Linz/i } },
      { 'originalData.description': { $regex: /MASCOT.*Linz/i } }
    ];
    
    for (const query of mascotSearch) {
      const product = await collection.findOne(query);
      if (product) {
        console.log('✅ Found MASCOT Linz product:');
        console.log(`  ID: ${product._id}`);
        console.log(`  Name: ${product.name || 'Unnamed'}`);
        
        // Check all fields that might contain variants
        const variantFields = ['variants', 'variants_dict', 'variantsDict', 'variations'];
        for (const field of variantFields) {
          if (product[field]) {
            console.log(`  ${field}: ${Array.isArray(product[field]) ? product[field].length : 'not array'} items`);
          }
        }
        
        // Check image fields
        console.log(`  image: ${Array.isArray(product.image) ? product.image.length + ' images' : typeof product.image}`);
        console.log(`  images: ${Array.isArray(product.images) ? product.images.length + ' images' : 'none'}`);
        
        // Show originalData if exists
        if (product.originalData) {
          console.log(`  originalData keys: ${Object.keys(product.originalData).join(', ')}`);
          if (product.originalData.variants_dict) {
            console.log(`  originalData.variants_dict: ${product.originalData.variants_dict.length} items`);
          }
        }
        
        break;
      }
    }
    
    // Check for products with originalData.variants_dict
    console.log('\n🔍 Checking originalData.variants_dict...\n');
    const withOriginalVariants = await collection.countDocuments({
      'originalData.variants_dict': { $exists: true, $ne: [] }
    });
    console.log(`Found ${withOriginalVariants} products with originalData.variants_dict`);
    
    if (withOriginalVariants > 0) {
      const sample = await collection.findOne({
        'originalData.variants_dict': { $exists: true, $ne: [] }
      });
      
      console.log('\nSample product with originalData.variants_dict:');
      console.log(`  Name: ${sample.name || 'Unnamed'}`);
      console.log(`  Variants count: ${sample.originalData.variants_dict.length}`);
      
      // Show first few variants
      if (sample.originalData.variants_dict.length > 0) {
        console.log('\n  First variant:');
        const firstVariant = sample.originalData.variants_dict[0];
        Object.entries(firstVariant).forEach(([key, value]) => {
          console.log(`    ${key}: ${typeof value === 'string' ? value.substring(0, 50) : value}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
checkVariantsStructure().catch(console.error);