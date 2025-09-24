const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'printwrap';

async function importVariantsFromJson() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');
    
    // Look for JSON files that might contain product data
    const possibleFiles = ['60k.json', 'new.json', 'products.json'];
    let jsonData = null;
    let jsonFile = null;
    
    for (const file of possibleFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        console.log(`📄 Found ${file}, reading...`);
        const content = fs.readFileSync(filePath, 'utf8');
        jsonData = JSON.parse(content);
        jsonFile = file;
        break;
      }
    }
    
    if (!jsonData) {
      console.log('❌ No product JSON file found');
      return;
    }
    
    console.log(`✅ Loaded ${jsonFile} with ${Array.isArray(jsonData) ? jsonData.length : Object.keys(jsonData).length} items`);
    
    // Process products
    const products = Array.isArray(jsonData) ? jsonData : Object.values(jsonData);
    let updatedCount = 0;
    let variantsAdded = 0;
    const bulkOps = [];
    
    for (const product of products) {
      if (!product.variants_dict || product.variants_dict.length === 0) {
        continue;
      }
      
      // Clean up variants - separate real variants from PDF thumbnails
      const realVariants = [];
      const additionalImages = [];
      
      for (const variant of product.variants_dict) {
        const isPDF = variant.variant_url && (
          variant.variant_url.includes('.pdf') || 
          variant.variant_url.includes('FILE-') ||
          variant.variant_url.includes('THUMBNAIL-FILE-')
        );
        
        const hasPDFImage = variant.variant_image && (
          variant.variant_image.includes('THUMBNAIL-FILE-') ||
          variant.variant_image.includes('.pdf') ||
          variant.variant_image.includes('FILE-')
        );
        
        const hasNoName = !variant.variant_name || variant.variant_name.trim() === '';
        
        if (isPDF || hasPDFImage || (hasNoName && variant.variant_image && variant.variant_image.includes('THUMBNAIL'))) {
          // This is a PDF thumbnail, add to additional images
          if (variant.variant_image && !variant.variant_image.includes('.pdf')) {
            additionalImages.push(variant.variant_image);
          }
        } else {
          // This is a real variant
          realVariants.push({
            id: variant.variant_url ? variant.variant_url.split('/').pop() : `variant-${realVariants.length}`,
            variant_name: variant.variant_name || `Variant ${realVariants.length + 1}`,
            variant_image: variant.variant_image,
            variant_url: variant.variant_url
          });
        }
      }
      
      if (realVariants.length === 0 && additionalImages.length === 0) {
        continue;
      }
      
      // Collect all images for this product
      const allImages = [];
      
      // Add main image if exists
      if (product.image_urls && Array.isArray(product.image_urls)) {
        product.image_urls.forEach(url => {
          if (url && !url.includes('.pdf')) {
            allImages.push(url);
          }
        });
      }
      
      // Add variant images
      realVariants.forEach(v => {
        if (v.variant_image && !allImages.includes(v.variant_image)) {
          allImages.push(v.variant_image);
        }
      });
      
      // Add additional images from PDF thumbnails
      additionalImages.forEach(img => {
        if (!allImages.includes(img)) {
          allImages.push(img);
        }
      });
      
      // Create update operation
      const updateData = {};
      
      if (realVariants.length > 0) {
        updateData.variants = realVariants;
        variantsAdded += realVariants.length;
      }
      
      if (allImages.length > 0) {
        updateData.image = allImages;
      }
      
      // Also store original data for reference
      updateData.originalData = {
        ...product,
        variants_dict: undefined // Remove to avoid duplication
      };
      
      // Find by article number or URL
      const filter = product.Article_no 
        ? { 'originalData.Article_no': product.Article_no }
        : product.Url 
          ? { 'originalData.Url': product.Url }
          : { name: product.Title || 'Unknown' };
      
      bulkOps.push({
        updateOne: {
          filter: filter,
          update: { 
            $set: {
              ...updateData,
              name: product.Title || 'Unnamed Product',
              description: product.description || '',
              price: product.price_after_tax ? parseFloat(product.price_after_tax.replace(/[^\d.,]/g, '').replace(',', '.')) : 0,
              sizes: product.Sizes || [],
              inStock: true
            }
          },
          upsert: true
        }
      });
      
      updatedCount++;
      
      if (updatedCount <= 5) {
        console.log(`\n📝 Processing: ${product.Title || 'Unnamed'}`);
        console.log(`  Original variants: ${product.variants_dict.length}`);
        console.log(`  Real variants: ${realVariants.length}`);
        console.log(`  Total images: ${allImages.length}`);
      }
    }
    
    // Execute bulk operations
    if (bulkOps.length > 0) {
      console.log(`\n💾 Updating ${bulkOps.length} products...`);
      const result = await collection.bulkWrite(bulkOps);
      console.log(`✅ Modified: ${result.modifiedCount}`);
      console.log(`✅ Upserted: ${result.upsertedCount}`);
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  - Products processed: ${updatedCount}`);
    console.log(`  - Variants added: ${variantsAdded}`);
    
    // Check if MASCOT Linz was updated
    const mascotProduct = await collection.findOne({
      name: { $regex: /MASCOT.*Linz/i }
    });
    
    if (mascotProduct) {
      console.log('\n✅ MASCOT Linz product check:');
      console.log(`  Name: ${mascotProduct.name}`);
      console.log(`  Variants: ${mascotProduct.variants ? mascotProduct.variants.length : 0}`);
      if (mascotProduct.variants) {
        mascotProduct.variants.forEach((v, i) => {
          console.log(`    ${i + 1}. ${v.variant_name}`);
        });
      }
      console.log(`  Images: ${Array.isArray(mascotProduct.image) ? mascotProduct.image.length : 0}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
importVariantsFromJson().catch(console.error);