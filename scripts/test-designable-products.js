const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

async function testDesignableProducts() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'printwrap');
    
    // Get all designable categories
    const categories = db.collection('categories');
    const designableCategories = await categories.find({ isDesignable: true }).toArray();
    
    console.log('\n📋 Designable Categories:');
    console.log('=' .repeat(50));
    designableCategories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });
    
    const designableCategoryIds = designableCategories.map(cat => cat._id.toString());
    
    // Get products in designable categories
    const products = db.collection('products');
    const designableProducts = await products.find({ 
      categoryId: { $in: designableCategoryIds } 
    }).limit(10).toArray();
    
    console.log('\n📦 Sample Designable Products:');
    console.log('=' .repeat(50));
    designableProducts.forEach(product => {
      const category = designableCategories.find(cat => cat._id.toString() === product.categoryId);
      console.log(`- ${product.name}`);
      console.log(`  Category: ${category?.name || 'Unknown'}`);
      console.log(`  Price: $${product.price}`);
      console.log(`  Has Variations: ${product.hasVariations || false}`);
    });
    
    // Count total designable products
    const totalCount = await products.countDocuments({
      categoryId: { $in: designableCategoryIds }
    });
    
    console.log('\n📊 Statistics:');
    console.log('=' .repeat(50));
    console.log(`Total designable categories: ${designableCategories.length}`);
    console.log(`Total designable products: ${totalCount}`);
    
    // Test the API endpoint
    console.log('\n🔍 Testing API Endpoint:');
    console.log('=' .repeat(50));
    const fetch = require('node-fetch');
    const apiUrl = 'http://localhost:3000/api/products?designableOnly=true&limit=5';
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log(`API returned ${data.products?.length || 0} products`);
      if (data.products && data.products.length > 0) {
        console.log('Sample products from API:');
        data.products.slice(0, 3).forEach(p => {
          console.log(`  - ${p.name} (Category: ${p.categoryId})`);
        });
      }
    } catch (apiError) {
      console.log('Could not test API endpoint (server might not be running)');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testDesignableProducts();