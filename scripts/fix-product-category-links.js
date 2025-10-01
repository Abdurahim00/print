const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

async function fixProductCategoryLinks() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');
    
    // Get all categories
    const categories = await categoriesCollection.find({}).toArray();
    console.log(`Found ${categories.length} categories`);
    
    // Create a map of ObjectId to string id
    const categoryIdMap = new Map();
    categories.forEach(cat => {
      categoryIdMap.set(cat._id.toString(), cat._id.toString());
    });
    
    // Get all products
    const products = await productsCollection.find({}).toArray();
    console.log(`Found ${products.length} products to check`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      const updates = {};
      
      // Check if categoryId is an ObjectId or missing
      if (product.categoryId) {
        if (product.categoryId instanceof ObjectId) {
          // Convert ObjectId to string
          updates.categoryId = product.categoryId.toString();
          needsUpdate = true;
          console.log(`Product "${product.name}": Converting categoryId from ObjectId to string`);
        } else if (typeof product.categoryId === 'string') {
          // Check if it's a valid category
          const categoryExists = categoryIdMap.has(product.categoryId);
          if (!categoryExists) {
            console.log(`Product "${product.name}": Invalid categoryId "${product.categoryId}"`);
            // Try to assign a default category
            if (categories.length > 0) {
              updates.categoryId = categories[0]._id.toString();
              needsUpdate = true;
              console.log(`  -> Assigning to default category: ${categories[0].name}`);
            }
          }
        }
      } else {
        // No categoryId, assign default
        if (categories.length > 0) {
          updates.categoryId = categories[0]._id.toString();
          needsUpdate = true;
          console.log(`Product "${product.name}": No category, assigning to default: ${categories[0].name}`);
        }
      }
      
      // Also check subcategoryIds
      if (product.subcategoryIds && Array.isArray(product.subcategoryIds)) {
        const newSubcategoryIds = product.subcategoryIds.map(id => {
          if (id instanceof ObjectId) {
            return id.toString();
          }
          return id;
        });
        
        if (JSON.stringify(newSubcategoryIds) !== JSON.stringify(product.subcategoryIds)) {
          updates.subcategoryIds = newSubcategoryIds;
          needsUpdate = true;
          console.log(`Product "${product.name}": Converting subcategoryIds to strings`);
        }
      }
      
      // Also check subcategoryId (singular)
      if (product.subcategoryId && product.subcategoryId instanceof ObjectId) {
        updates.subcategoryId = product.subcategoryId.toString();
        needsUpdate = true;
        console.log(`Product "${product.name}": Converting subcategoryId from ObjectId to string`);
      }
      
      if (needsUpdate) {
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: updates }
        );
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log('\n=== Summary ===');
    console.log(`Total products: ${products.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (already correct): ${skippedCount}`);
    
    // Verify the fix
    console.log('\n=== Verification ===');
    const sampleProducts = await productsCollection.find({}).limit(5).toArray();
    sampleProducts.forEach(product => {
      console.log(`Product: ${product.name}`);
      console.log(`  categoryId: ${product.categoryId} (type: ${typeof product.categoryId})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
fixProductCategoryLinks().catch(console.error);