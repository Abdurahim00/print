const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixSubcategoryslugs() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('printwrap-pro');
    const subcategories = db.collection('subcategories');

    // Get all subcategories
    const allSubcategories = await subcategories.find({}).toArray();
    
    console.log(`Found ${allSubcategories.length} subcategories to fix\n`);

    const updates = [];

    for (const sub of allSubcategories) {
      const currentSlug = sub.slug;
      let newSlug = currentSlug;
      
      // If slug contains a slash, take only the part after the slash
      if (currentSlug && currentSlug.includes('/')) {
        const parts = currentSlug.split('/');
        newSlug = parts[parts.length - 1]; // Take the last part
      }
      
      // Convert Swedish characters to English equivalents for URL friendliness
      newSlug = newSlug
        .replace(/ä/g, 'a')
        .replace(/å/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/Ä/g, 'A')
        .replace(/Å/g, 'A')
        .replace(/Ö/g, 'O');
      
      if (newSlug !== currentSlug) {
        console.log(`Updating: "${currentSlug}" -> "${newSlug}"`);
        updates.push({
          updateOne: {
            filter: { _id: sub._id },
            update: { $set: { slug: newSlug } }
          }
        });
      }
    }

    if (updates.length > 0) {
      console.log(`\nApplying ${updates.length} slug updates...`);
      const result = await subcategories.bulkWrite(updates);
      console.log(`Updated ${result.modifiedCount} subcategory slugs`);
    } else {
      console.log('No subcategory slugs need updating');
    }

    // Show sample of updated subcategories
    console.log('\n=== Sample Updated Subcategories ===');
    const samples = await subcategories.find({}).limit(10).toArray();
    samples.forEach(sub => {
      console.log(`- ${sub.name}: ${sub.slug}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Fixing subcategory slugs...');
fixSubcategoryslugs();