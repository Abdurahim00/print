const { MongoClient } = require('mongodb');
require('dotenv').config();

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '');      // Remove leading/trailing hyphens
}

async function createEnglishSlugs() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('printwrap-pro');
    const subcategories = db.collection('subcategories');

    // Get all subcategories
    const allSubcategories = await subcategories.find({}).toArray();
    
    console.log(`Found ${allSubcategories.length} subcategories\n`);

    const updates = [];

    for (const sub of allSubcategories) {
      const englishSlug = createSlug(sub.name);
      
      if (englishSlug !== sub.slug) {
        console.log(`Updating: "${sub.name}" | Current: "${sub.slug}" -> New: "${englishSlug}"`);
        updates.push({
          updateOne: {
            filter: { _id: sub._id },
            update: { $set: { slug: englishSlug } }
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

    // Show all subcategories with their new slugs grouped by category
    console.log('\n=== Updated Subcategories by Category ===');
    
    const categories = await db.collection('categories').find({}).toArray();
    
    for (const cat of categories) {
      const catSubs = await subcategories.find({ categoryId: cat._id.toString() }).toArray();
      if (catSubs.length > 0) {
        console.log(`\n${cat.name} (${cat.slug}):`);
        catSubs.forEach(sub => {
          console.log(`  - ${sub.name}: /products/${cat.slug}/${sub.slug}`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('Creating English-friendly slugs for subcategories...');
createEnglishSlugs();