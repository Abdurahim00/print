require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkCategories() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('printwrap-pro');
    
    // Check categories with empty/null IDs
    const badCats = await db.collection('categories').find({
      $or: [
        { id: '' },
        { id: null },
        { id: { $exists: false } }
      ]
    }).toArray();
    
    console.log('Categories with empty/null/missing IDs:', badCats.length);
    badCats.forEach(c => {
      console.log('- Category:', c.name, 'ID:', c.id, '_id:', c._id);
    });
    
    // Check first few normal categories
    const goodCats = await db.collection('categories').find({ 
      id: { $exists: true, $ne: '', $ne: null } 
    }).limit(3).toArray();
    
    console.log('\nNormal categories:');
    goodCats.forEach(c => {
      console.log('- Category:', c.name, 'ID:', c.id);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkCategories();