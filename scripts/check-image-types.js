const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'printwrap';

async function checkImageTypes() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('products');
    
    // Get samples of different image types
    console.log('\n📋 Checking image field types...\n');
    
    // Sample string image products
    const stringImageSample = await collection.findOne({ 
      image: { $type: 'string' } 
    });
    
    if (stringImageSample) {
      console.log('String image example:');
      console.log('  ID:', stringImageSample._id);
      console.log('  Name:', stringImageSample.name || 'Unnamed');
      console.log('  Image value:', stringImageSample.image);
      console.log('  Image type:', typeof stringImageSample.image);
    }
    
    // Sample array image products
    const arrayImageSample = await collection.findOne({ 
      image: { $type: 'array' } 
    });
    
    if (arrayImageSample) {
      console.log('\nArray image example:');
      console.log('  ID:', arrayImageSample._id);
      console.log('  Name:', arrayImageSample.name || 'Unnamed');
      console.log('  Image value:', arrayImageSample.image);
      console.log('  Image type:', typeof arrayImageSample.image, 'isArray:', Array.isArray(arrayImageSample.image));
    }
    
    // Check actual field values
    console.log('\n📊 Analyzing actual data structure...\n');
    
    const samples = await collection.find({}).limit(10).toArray();
    
    samples.forEach((product, index) => {
      console.log(`Product ${index + 1}:`);
      console.log('  ID:', product._id);
      console.log('  Name:', product.name || 'Unnamed');
      console.log('  Image field type:', typeof product.image);
      console.log('  Is Array:', Array.isArray(product.image));
      console.log('  Image value:', JSON.stringify(product.image).substring(0, 100));
      console.log('---');
    });
    
    // Try different count methods
    console.log('\n📈 Counting with different methods...\n');
    
    // Method 1: Direct type check
    const method1String = await collection.countDocuments({ 
      image: { $type: 'string' } 
    });
    console.log('Method 1 - String count:', method1String);
    
    const method1Array = await collection.countDocuments({ 
      image: { $type: 'array' } 
    });
    console.log('Method 1 - Array count:', method1Array);
    
    // Method 2: Check all documents
    const allDocs = await collection.find({}).toArray();
    let stringCount = 0;
    let arrayCount = 0;
    let otherCount = 0;
    
    allDocs.forEach(doc => {
      if (typeof doc.image === 'string') {
        stringCount++;
      } else if (Array.isArray(doc.image)) {
        arrayCount++;
      } else {
        otherCount++;
      }
    });
    
    console.log('\nMethod 2 - Manual count:');
    console.log('  String images:', stringCount);
    console.log('  Array images:', arrayCount);
    console.log('  Other/null:', otherCount);
    console.log('  Total:', stringCount + arrayCount + otherCount);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
checkImageTypes().catch(console.error);