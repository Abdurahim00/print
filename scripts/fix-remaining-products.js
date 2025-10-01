const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

async function fixRemainingProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');
    
    // Get default category
    const categories = await categoriesCollection.find({}).toArray();
    if (categories.length === 0) {
      console.error('No categories found in database!');
      return;
    }
    
    const defaultCategory = categories[0]._id.toString();
    console.log(`Using default category: ${categories[0].name} (${defaultCategory})`);
    
    // Update all products without categoryId in batches
    const result = await productsCollection.updateMany(
      { 
        $or: [
          { categoryId: null },
          { categoryId: { $exists: false } },
          { categoryId: '' }
        ]
      },
      { 
        $set: { 
          categoryId: defaultCategory,
          updatedAt: new Date()
        } 
      }
    );
    
    console.log(`\n=== Update Results ===`);
    console.log(`Updated ${result.modifiedCount} products with default category`);
    console.log(`Matched ${result.matchedCount} products`);
    
    // Verify the fix
    const noCategory = await productsCollection.countDocuments({ 
      $or: [
        { categoryId: null },
        { categoryId: { $exists: false } },
        { categoryId: '' }
      ]
    });
    
    const total = await productsCollection.countDocuments({});
    const withCategory = total - noCategory;
    
    console.log(`\n=== Final Status ===`);
    console.log(`Total products: ${total}`);
    console.log(`Products with category: ${withCategory}`);
    console.log(`Products without category: ${noCategory}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
fixRemainingProducts().catch(console.error);