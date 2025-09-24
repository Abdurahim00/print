const { MongoClient } = require('mongodb');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

function cleanText(text) {
  if (!text) return text;
  
  // Fix common encoding issues
  return text
    .replace(/�/g, 'ä')
    .replace(/�/g, 'ö')
    .replace(/�/g, 'å')
    .replace(/�/g, 'Ä')
    .replace(/�/g, 'Ö')
    .replace(/�/g, 'Å')
    .replace(/�/g, 'é')
    .replace(/[�]/g, ''); // Remove unreadable characters
}

function parsePrice(priceStr) {
  if (!priceStr) return 299;
  const match = priceStr.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 299;
}

async function importProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    console.log('Reading new.json file...');
    
    // Read file as buffer first
    const buffer = fs.readFileSync('new.json');
    const content = buffer.toString('utf8');
    
    // Try to find valid JSON array start and parse line by line
    const lines = content.split('\n');
    const products = [];
    let currentProduct = '';
    let inProduct = false;
    let braceCount = 0;
    
    for (const line of lines) {
      if (line.includes('{')) {
        inProduct = true;
        braceCount++;
      }
      
      if (inProduct) {
        currentProduct += line + '\n';
      }
      
      if (line.includes('}')) {
        braceCount--;
        if (braceCount === 0 && inProduct) {
          try {
            // Clean and parse the product
            const cleanedProduct = cleanText(currentProduct);
            const product = JSON.parse(cleanedProduct.replace(/,\s*}/, '}').replace(/,\s*]/, ']'));
            products.push(product);
            if (products.length >= 50) break; // Limit to 50 products for now
          } catch (e) {
            // Skip malformed products
          }
          currentProduct = '';
          inProduct = false;
        }
      }
    }
    
    console.log(`Parsed ${products.length} products`);
    
    if (products.length === 0) {
      console.log('No products could be parsed. The file might be corrupted.');
      return;
    }
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrappro');
    const collection = db.collection('products');
    
    // Clear existing products
    const deleteResult = await collection.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products`);
    
    // Transform products for our schema
    const transformedProducts = products.map((product, index) => {
      const price = parsePrice(product.price_before_tax);
      const image = product.image_urls && product.image_urls.length > 0 
        ? product.image_urls[0] 
        : 'https://via.placeholder.com/400x400/888888/FFFFFF?text=Product';
      
      return {
        name: cleanText(product.Title) || `Product ${index + 1}`,
        price: price,
        basePrice: price,
        image: image,
        images: product.image_urls || [image],
        categoryId: 'apparel',
        subcategoryIds: [],
        description: cleanText(product.description) || 'Quality product',
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        eligibleForCoupons: true,
        articleNo: product.Article_no,
        sizes: product.Sizes || [],
        sourceUrl: product.Url
      };
    });
    
    // Insert products
    console.log(`Inserting ${transformedProducts.length} products...`);
    const result = await collection.insertMany(transformedProducts);
    console.log(`✅ Successfully imported ${result.insertedCount} products!`);
    
    // Show first 5 products
    const inserted = await collection.find({}).limit(5).toArray();
    console.log('\n=== FIRST 5 IMPORTED PRODUCTS ===');
    inserted.forEach(product => {
      console.log(`\n- ${product.name}`);
      console.log(`  ID: ${product._id.toString()}`);
      console.log(`  Price: ${product.price} SEK`);
    });
    
    const total = await collection.countDocuments();
    console.log(`\nTotal products in database: ${total}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

importProducts();