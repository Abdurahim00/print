const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

async function importPrendoProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    // Read and parse the JSON file
    console.log('Reading new.json file...');
    const rawData = fs.readFileSync(path.join(__dirname, '..', 'new.json'), 'utf8');
    const prendoProducts = JSON.parse(rawData);
    
    console.log(`Found ${prendoProducts.length} products in new.json`);
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrappro');
    const collection = db.collection('products');
    
    // Clear existing products first (optional - comment out if you want to keep them)
    const deleteResult = await collection.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products`);
    
    // Transform Prendo products to our schema
    const products = prendoProducts.slice(0, 100).map((product, index) => { // Import first 100 for now
      // Extract price from the string (e.g., "507.50 kr/st" -> 507.50)
      let price = 0;
      if (product.price_before_tax) {
        const priceMatch = product.price_before_tax.match(/(\d+\.?\d*)/);
        if (priceMatch) {
          price = parseFloat(priceMatch[1]);
        }
      }
      
      // Use first image if available, otherwise placeholder
      const image = product.image_urls && product.image_urls.length > 0 
        ? product.image_urls[0] 
        : `https://via.placeholder.com/400x400/888888/FFFFFF?text=${encodeURIComponent(product.Title || 'Product')}`;
      
      return {
        name: product.Title || `Product ${index + 1}`,
        price: price || 299, // Default price if parsing fails
        basePrice: price || 299,
        image: image,
        images: product.image_urls || [image],
        categoryId: "apparel", // Default category
        subcategoryIds: [],
        description: product.description || "Quality product from Prendo",
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        eligibleForCoupons: true,
        articleNo: product.Article_no,
        brand: product.brand_info ? product.brand_info.split('\n')[0] : "Prendo",
        sizes: product.Sizes || [],
        url: product.Url
      };
    });
    
    // Insert products
    console.log(`Inserting ${products.length} products...`);
    const result = await collection.insertMany(products);
    console.log(`✅ Successfully imported ${result.insertedCount} products!`);
    
    // Show first 5 products with their IDs
    const insertedProducts = await collection.find({}).limit(5).toArray();
    console.log('\n=== FIRST 5 IMPORTED PRODUCTS ===');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name}`);
      console.log(`  ID: ${product._id.toString()}`);
      console.log(`  Price: ${product.price} SEK`);
      console.log(`  Article: ${product.articleNo || 'N/A'}`);
      console.log('');
    });
    
    const totalCount = await collection.countDocuments();
    console.log(`Total products in database: ${totalCount}`);
    
  } catch (error) {
    console.error('Error importing products:', error);
    if (error.message.includes('UTF-8')) {
      console.log('\nTrying to fix encoding issues...');
    }
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

importPrendoProducts();