require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function fixCategoryIds() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap-pro');
    const categories = db.collection('categories');
    
    // Find categories without IDs
    const badCats = await categories.find({
      $or: [
        { id: { $exists: false } },
        { id: null },
        { id: '' }
      ]
    }).toArray();
    
    console.log(`Found ${badCats.length} categories without proper IDs`);
    
    // Fix each category by using its _id as the id
    for (const cat of badCats) {
      const newId = cat._id.toString();
      await categories.updateOne(
        { _id: cat._id },
        { $set: { id: newId } }
      );
      console.log(`Fixed category "${cat.name}" - set id to: ${newId}`);
    }
    
    console.log('\nAll categories fixed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixCategoryIds();