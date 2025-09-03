const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

function parseProductsFromFile() {
  console.log('📖 Reading new.json with fallback parser...');
  
  // Read the file as buffer first
  const buffer = fs.readFileSync('new.json');
  // Convert to string with latin1 encoding
  let content = buffer.toString('latin1');
  
  console.log(`File size: ${(content.length / 1024 / 1024).toFixed(2)} MB`);
  
  const products = [];
  let currentPos = 0;
  let productCount = 0;
  
  // Find products one by one
  while (currentPos < content.length) {
    // Find start of next product
    const startIndex = content.indexOf('{\n    "Url":', currentPos);
    if (startIndex === -1) break;
    
    // Find the end of this product by counting braces
    let braceCount = 0;
    let endIndex = startIndex;
    let inString = false;
    let escaped = false;
    
    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];
      const prevChar = i > 0 ? content[i-1] : '';
      
      // Track if we're inside a string
      if (char === '"' && !escaped) {
        inString = !inString;
      }
      
      // Track escape characters
      escaped = (char === '\\' && !escaped);
      
      // Count braces only outside of strings
      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
    }
    
    if (endIndex > startIndex) {
      let productStr = content.substring(startIndex, endIndex);
      
      // Clean up the product string
      // Remove problematic Detaljer fields
      productStr = productStr.replace(/"Detaljer":\s*"[^"]*(?:\\.[^"]*)*"/g, '"Detaljer": ""');
      
      // Try to parse this product
      try {
        const product = JSON.parse(productStr);
        if (product.Title || product.title) {
          products.push(product);
          productCount++;
          
          if (productCount % 1000 === 0) {
            console.log(`  Parsed ${productCount} products...`);
          }
        }
      } catch (e) {
        // Skip malformed products
      }
    }
    
    currentPos = endIndex + 1;
  }
  
  console.log(`✅ Successfully parsed ${products.length} products!`);
  return products;
}

function prepareProduct(product) {
  const now = new Date();
  
  // Parse price
  let price = 0;
  if (product['Pris/st']) {
    const priceStr = product['Pris/st'].toString();
    price = parseFloat(priceStr.replace(/[^\d.]/g, '')) || 0;
  } else if (product.price_after_tax) {
    const priceStr = product.price_after_tax.toString();
    price = parseFloat(priceStr.replace(/[^\d.]/g, '')) || 0;
  } else if (product.price) {
    price = typeof product.price === 'string' 
      ? parseFloat(product.price.replace(/[^\d.]/g, '')) || 0
      : product.price;
  } else if (product.product_info && product.product_info['Pris/st']) {
    const priceStr = product.product_info['Pris/st'].toString();
    price = parseFloat(priceStr.replace(/[^\d.]/g, '')) || 0;
  }
  
  // Get main image - use variant image if no main image
  let mainImage = 'https://via.placeholder.com/500';
  const allImages = [];
  
  // Check for image_urls array
  if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    mainImage = product.image_urls[0];
    allImages.push(...product.image_urls);
  }
  
  // If no main image, use variant images
  if (mainImage === 'https://via.placeholder.com/500' && product.variants_dict && Array.isArray(product.variants_dict)) {
    for (const variant of product.variants_dict) {
      if (variant.variant_image) {
        if (mainImage === 'https://via.placeholder.com/500') {
          mainImage = variant.variant_image;
        }
        if (!allImages.includes(variant.variant_image)) {
          allImages.push(variant.variant_image);
        }
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
  if (product.Article_no) {
    dbProduct.sku = product.Article_no;
  } else if (product.Artikelnummer) {
    dbProduct.sku = product.Artikelnummer;
  } else if (product.product_info && product.product_info.Artikelnummer) {
    dbProduct.sku = product.product_info.Artikelnummer;
  }
  
  // Add sizes
  if (product.Sizes && Array.isArray(product.Sizes)) {
    dbProduct.sizes = product.Sizes;
  }
  
  // Add brand
  if (product.brand_info) {
    // Extract brand name from brand_info (usually first line)
    const brandLines = product.brand_info.split('\n');
    if (brandLines.length > 0) {
      dbProduct.brand = brandLines[0].trim();
    }
  }
  
  // Add variants
  if (product.variants_dict && Array.isArray(product.variants_dict) && product.variants_dict.length > 0) {
    dbProduct.variants = product.variants_dict.map(v => ({
      name: v.variant_name || '',
      image: v.variant_image || '',
      url: v.variant_url || ''
    }));
    dbProduct.hasVariations = true;
  }
  
  // Add specifications
  if (product.product_info && typeof product.product_info === 'object') {
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
  
  console.log('\n🔍 Parsing products from new.json...');
  const products = parseProductsFromFile();
  
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
  console.log(`- Products with image_urls: ${withImages}`);
  console.log(`- Products with variants: ${withVariants}`);
  console.log(`- Products without images but with variant images: ${withoutImagesButVariants}`);
  
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
    
    // Count how many will have images after using variants
    const productsWithFinalImages = dbProducts.filter(p => 
      p.image !== 'https://via.placeholder.com/500'
    ).length;
    console.log(`Products that will have images (including from variants): ${productsWithFinalImages}`);
    
    // Insert in batches
    const batchSize = 500;
    let inserted = 0;
    
    console.log('\n📤 Inserting products in batches...');
    for (let i = 0; i < dbProducts.length; i += batchSize) {
      const batch = dbProducts.slice(i, Math.min(i + batchSize, dbProducts.length));
      try {
        const result = await collection.insertMany(batch);
        inserted += result.insertedCount;
        console.log(`  Progress: ${inserted}/${dbProducts.length} products (${((inserted/dbProducts.length)*100).toFixed(1)}%)`);
      } catch (error) {
        console.error(`  Error inserting batch at index ${i}:`, error.message);
        // Continue with next batch
      }
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
    console.log('\n📋 Sample products with images from variants:');
    const samplesWithVariantImages = await collection.find({
      hasVariations: true,
      image: { $ne: 'https://via.placeholder.com/500' }
    }).limit(5).toArray();
    
    if (samplesWithVariantImages.length > 0) {
      samplesWithVariantImages.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
        console.log(`   Price: ${p.price || 'No price'} SEK`);
        console.log(`   Main image: ${p.image.substring(0, 50)}...`);
        console.log(`   Total images: ${p.images ? p.images.length : 0}`);
        console.log(`   Variants: ${p.variants ? p.variants.length : 0}`);
      });
    }
    
    console.log('\n📋 Sample products overall:');
    const samples = await collection.find({}).limit(5).toArray();
    samples.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Price: ${p.price || 'No price'} SEK`);
      console.log(`   Has image: ${p.image !== 'https://via.placeholder.com/500' ? '✓' : '✗'}`);
      console.log(`   Variants: ${p.variants ? p.variants.length : 0}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed!');
  }
}

// Run
importToMongoDB().catch(console.error);