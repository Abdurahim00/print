const { MongoClient } = require('mongodb');
require('dotenv').config();

async function addDesignFrames() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap-pro');
    const productsCollection = db.collection('products');
    
    // Sample design frames for t-shirts and similar products
    const tshirtFrames = [
      {
        id: 'front-chest',
        position: 'front',
        x: 150,
        y: 100,
        width: 20, // 20cm
        height: 25, // 25cm
        widthPx: 400,
        heightPx: 500,
        costPerCm2: 0.05
      },
      {
        id: 'back-full',
        position: 'back',
        x: 100,
        y: 80,
        width: 30, // 30cm
        height: 40, // 40cm
        widthPx: 600,
        heightPx: 800,
        costPerCm2: 0.05
      }
    ];
    
    // Sample design frames for mugs
    const mugFrames = [
      {
        id: 'wrap-around',
        position: 'front',
        x: 50,
        y: 50,
        width: 20, // 20cm wrap
        height: 8, // 8cm height
        widthPx: 800,
        heightPx: 320,
        costPerCm2: 0.08
      }
    ];
    
    // Sample design frames for bags
    const bagFrames = [
      {
        id: 'front-center',
        position: 'front',
        x: 100,
        y: 150,
        width: 25,
        height: 20,
        widthPx: 500,
        heightPx: 400,
        costPerCm2: 0.06
      }
    ];
    
    // Update products based on their names/categories
    console.log('Adding design frames to t-shirt products...');
    const tshirtResult = await productsCollection.updateMany(
      { 
        $or: [
          { name: { $regex: /t-shirt|tshirt|shirt|polo/i } },
          { categoryId: 'apparel' }
        ],
        designFrames: { $exists: false }
      },
      { 
        $set: { 
          isDesignable: true,
          designFrames: tshirtFrames,
          designCostPerCm2: 0.05
        }
      }
    );
    console.log(`Updated ${tshirtResult.modifiedCount} t-shirt products`);
    
    console.log('Adding design frames to mug products...');
    const mugResult = await productsCollection.updateMany(
      { 
        $or: [
          { name: { $regex: /mug|cup|tumbler/i } },
          { categoryId: 'drinkware' }
        ],
        designFrames: { $exists: false }
      },
      { 
        $set: { 
          isDesignable: true,
          designFrames: mugFrames,
          designCostPerCm2: 0.08
        }
      }
    );
    console.log(`Updated ${mugResult.modifiedCount} mug products`);
    
    console.log('Adding design frames to bag products...');
    const bagResult = await productsCollection.updateMany(
      { 
        $or: [
          { name: { $regex: /bag|tote|backpack|väska/i } },
          { categoryId: 'bags' }
        ],
        designFrames: { $exists: false }
      },
      { 
        $set: { 
          isDesignable: true,
          designFrames: bagFrames,
          designCostPerCm2: 0.06
        }
      }
    );
    console.log(`Updated ${bagResult.modifiedCount} bag products`);
    
    // Get count of designable products
    const designableCount = await productsCollection.countDocuments({ isDesignable: true });
    console.log(`\nTotal designable products: ${designableCount}`);
    
    // Show a sample designable product
    const sampleDesignable = await productsCollection.findOne({ isDesignable: true });
    if (sampleDesignable) {
      console.log('\nSample designable product:');
      console.log('Name:', sampleDesignable.name);
      console.log('Design frames:', JSON.stringify(sampleDesignable.designFrames, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

addDesignFrames();