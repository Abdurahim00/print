const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function parseNewJson() {
  console.log('📖 Reading new.json...');
  
  // Read file with latin1 encoding
  let content = fs.readFileSync('new.json', 'latin1');
  console.log(`File size: ${(content.length / 1024 / 1024).toFixed(2)} MB`);
  
  // First attempt: try to parse as-is
  try {
    const data = JSON.parse(content);
    console.log(`✅ Parsed ${data.length} products successfully!`);
    return data;
  } catch (e) {
    console.log(`Initial parse failed: ${e.message}`);
  }
  
  // Fix 1: Remove problematic Detaljer fields
  console.log('Removing problematic Detaljer fields...');
  content = content.replace(/"Detaljer":\s*"[^"]*(?:\\.[^"]*)*"/g, '"Detaljer": ""');
  
  try {
    const data = JSON.parse(content);
    console.log(`✅ Parsed ${data.length} products after fixing Detaljer!`);
    return data;
  } catch (e) {
    console.log(`Still failed: ${e.message}`);
  }
  
  // Fix 2: More aggressive - remove all fields that might have issues
  console.log('Applying more aggressive fixes...');
  
  // Remove Detaljer fields entirely
  content = content.replace(/,?\s*"Detaljer":[^,}]*(?:,[^"}]*"[^"]*")*[^,}]*/g, '');
  
  // Fix trailing commas
  content = content.replace(/,\s*}/g, '}');
  content = content.replace(/,\s*]/g, ']');
  
  try {
    const data = JSON.parse(content);
    console.log(`✅ Parsed ${data.length} products with aggressive fixes!`);
    return data;
  } catch (e) {
    console.log(`Parse still failing: ${e.message}`);
  }
  
  // Last resort: Extract products one by one
  console.log('Attempting to extract products individually...');
  const products = [];
  
  // Split by line and look for complete product objects
  const lines = content.split('\n');
  let currentProduct = '';
  let braceCount = 0;
  let inProduct = false;
  
  for (const line of lines) {
    if (line.includes('"Url":')) {
      inProduct = true;
      currentProduct = '';
      braceCount = 0;
    }
    
    if (inProduct) {
      currentProduct += line + '\n';
      
      // Count braces
      for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }
      
      // If we've closed all braces, try to parse this product
      if (braceCount === 0 && currentProduct.includes('"Title"')) {
        // Clean up the product string
        let productStr = currentProduct.trim();
        if (productStr.endsWith(',')) {
          productStr = productStr.slice(0, -1);
        }
        
        try {
          const product = JSON.parse(productStr);
          products.push(product);
        } catch (e) {
          // Skip malformed products
        }
        
        inProduct = false;
        currentProduct = '';
      }
    }
  }
  
  console.log(`✅ Extracted ${products.length} products individually`);
  return products;
}

function prepareProduct(product) {
  const now = new Date();
  
  // Parse price
  let price = 0;
  if (product['Pris/st']) {
    price = parseFloat(product['Pris/st'].replace(/[^\d.]/g, '')) || 0;
  } else if (product.price) {
    price = typeof product.price === 'string' 
      ? parseFloat(product.price.replace(/[^\d.]/g, '')) || 0
      : product.price;
  }
  
  // Get main image - use variant image if no main image
  let mainImage = 'https://via.placeholder.com/500';
  const allImages = [];
  
  if (product.image_urls && product.image_urls.length > 0) {
    mainImage = product.image_urls[0];
    allImages.push(...product.image_urls);
  } else if (product.variants_dict && product.variants_dict.length > 0) {
    // Find first variant with an image
    for (const variant of product.variants_dict) {
      if (variant.variant_image) {
        if (mainImage === 'https://via.placeholder.com/500') {
          mainImage = variant.variant_image;
        }
        allImages.push(variant.variant_image);
      }
    }
  }
  
  const dbProduct = {
    name: product.Title || product.title || 'Unnamed Product',
    description: product.description || '',
    price: price,
    basePrice: price,
    image: mainImage,
    images: allImages.length > 0 ? allImages : [mainImage],
    inStock: true,
    featured: false,
    createdAt: now,
    updatedAt: now,
    isActive: true,
    eligibleForCoupons: true,
    source: 'new.json'
  };
  
  // Add SKU
  if (product.Artikelnummer) {
    dbProduct.sku = product.Artikelnummer;
  }
  
  // Add variants
  if (product.variants_dict && product.variants_dict.length > 0) {
    dbProduct.variants = product.variants_dict.map(v => ({
      name: v.variant_name || '',
      image: v.variant_image || '',
      url: v.variant_url || ''
    }));
    dbProduct.hasVariations = true;
  }
  
  // Add specifications
  if (product.product_info) {
    dbProduct.specifications = product.product_info;
  }
  
  // Store original URL
  if (product.Url) {
    dbProduct.originalUrl = product.Url;
  }
  
  return dbProduct;
}

async function importToMongoDB() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found!');
    process.exit(1);
  }
  
  const products = await parseNewJson();
  
  if (products.length === 0) {
    console.error('❌ No products found!');
    return;
  }
  
  // Show statistics
  console.log('\n📊 Product statistics:');
  const withImages = products.filter(p => p.image_urls && p.image_urls.length > 0).length;
  const withVariants = products.filter(p => p.variants_dict && p.variants_dict.length > 0).length;
  const withoutImagesButVariants = products.filter(p => 
    (!p.image_urls || p.image_urls.length === 0) && 
    p.variants_dict && 
    p.variants_dict.some(v => v.variant_image)
  ).length;
  
  console.log(`- Total products: ${products.length}`);
  console.log(`- With image_urls: ${withImages}`);
  console.log(`- With variants: ${withVariants}`);
  console.log(`- Without images but with variant images: ${withoutImagesButVariants}`);
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('\n✅ Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('products');
    
    // Clear existing products
    console.log('\n🗑️ Clearing existing products...');
    const deleteResult = await collection.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} products`);
    
    // Prepare products for insertion
    console.log(`\n📥 Preparing ${products.length} products for import...`);
    const dbProducts = products.map(prepareProduct);
    
    // Insert in batches
    const batchSize = 500;
    let inserted = 0;
    
    for (let i = 0; i < dbProducts.length; i += batchSize) {
      const batch = dbProducts.slice(i, Math.min(i + batchSize, dbProducts.length));
      const result = await collection.insertMany(batch);
      inserted += result.insertedCount;
      console.log(`Progress: ${inserted}/${dbProducts.length} products`);
    }
    
    console.log(`\n✅ Successfully imported ${inserted} products!`);
    
    // Verify
    const total = await collection.countDocuments({});
    const withImagesInDB = await collection.countDocuments({
      image: { $ne: 'https://via.placeholder.com/500' }
    });
    const withVariantsInDB = await collection.countDocuments({ hasVariations: true });
    
    console.log('\n📊 Final verification:');
    console.log(`- Total in database: ${total}`);
    console.log(`- Products with images: ${withImagesInDB}`);
    console.log(`- Products with variants: ${withVariantsInDB}`);
    
    // Show samples
    console.log('\n📋 Sample products:');
    const samples = await collection.find({}).limit(5).toArray();
    samples.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Price: ${p.price || 'No price'}`);
      console.log(`   Has image: ${p.image !== 'https://via.placeholder.com/500' ? '✓' : '✗'}`);
      console.log(`   Variants: ${p.variants ? p.variants.length : 0}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Done!');
  }
}

// Run
importToMongoDB().catch(console.error);