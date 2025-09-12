const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Color name to hex mapping
const colorHexMap = {
  'Black': '#000000',
  'White': '#FFFFFF',
  'Red': '#FF0000',
  'Blue': '#0074D9',
  'Navy': '#001F3F',
  'Green': '#2ECC40',
  'Yellow': '#FFDC00',
  'Orange': '#FF851B',
  'Pink': '#FF69B4',
  'Purple': '#B10DC9',
  'Gray': '#AAAAAA',
  'Grey': '#AAAAAA',
  'Brown': '#8B4513',
  'Beige': '#F5F5DC',
  'Petrol': '#005F6B',
  'Turquoise': '#40E0D0',
  'Gold': '#FFD700',
  'Silver': '#C0C0C0',
  'Lime': '#01FF70',
  'Aqua': '#7FDBFF',
  'Maroon': '#85144B',
  'Olive': '#3D9970',
  'Teal': '#39CCCC'
};

async function importVariations() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    // Read the 60k.json file
    console.log('Reading 60k.json...');
    const data = JSON.parse(fs.readFileSync('60k.json', 'utf8'));
    
    await client.connect();
    const db = client.db('printwrap-pro');
    const collection = db.collection('products');
    
    // Get products with variants
    const productsWithVariants = data.filter(p => 
      p.variants_dict && Object.keys(p.variants_dict).length > 0
    );
    
    console.log(`Found ${productsWithVariants.length} products with variations in JSON`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    for (const jsonProduct of productsWithVariants) {
      // Try to find the product in database by name or sourceUrl
      const dbProduct = await collection.findOne({
        $or: [
          { name: jsonProduct.Title },
          { sourceUrl: jsonProduct.Url }
        ]
      });
      
      if (!dbProduct) {
        notFoundCount++;
        continue;
      }
      
      // Convert variants_dict to variations array
      const variations = [];
      const colors = [];
      
      for (const [key, variant] of Object.entries(jsonProduct.variants_dict)) {
        const colorName = variant.variant_name || 'Default';
        const hexCode = colorHexMap[colorName] || '#808080'; // Default to gray if not found
        
        colors.push(colorName);
        
        variations.push({
          id: `${dbProduct._id}-${colorName.toLowerCase().replace(/\s+/g, '-')}`,
          color: {
            id: colorName.toLowerCase().replace(/\s+/g, '-'),
            name: colorName,
            hex_code: hexCode
          },
          variant_image: variant.variant_image,
          images: [variant.variant_image],
          variant_url: variant.variant_url,
          price: dbProduct.price || dbProduct.basePrice,
          inStock: true
        });
      }
      
      // Update the product with variations
      await collection.updateOne(
        { _id: dbProduct._id },
        { 
          $set: { 
            variations: variations,
            hasVariations: true,
            colors: [...new Set(colors)] // Unique colors
          } 
        }
      );
      
      updatedCount++;
      
      if (updatedCount % 100 === 0) {
        console.log(`Progress: ${updatedCount} products updated with variations`);
      }
    }
    
    console.log('\n=== Import Complete ===');
    console.log(`Total products with variations in JSON: ${productsWithVariants.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Not found in database: ${notFoundCount}`);
    
    // Verify the update
    const totalWithVariations = await collection.countDocuments({ 
      variations: { $exists: true, $ne: [] } 
    });
    console.log(`Total products with variations in database: ${totalWithVariations}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

console.log('Starting variation import from 60k.json...');
importVariations();