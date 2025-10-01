const { MongoClient } = require('mongodb');
require('dotenv').config();

const translations = {
  // Categories
  'Flyers': 'Flygblad',
  'Business Cards': 'Visitkort',
  'Stickers': 'Klistermärken',
  'Car Wraps': 'Bilfoliering',
  'Decals': 'Dekaler',
  'Apparel': 'Kläder',
  'Promotional Items': 'Kampanjartiklar',
  'Posters': 'Affischer',
  'Banners': 'Banderoller',
  'Signs': 'Skyltar',
  
  // Common product name parts
  'Custom': 'Anpassad',
  'Premium': 'Premium',
  'Standard': 'Standard',
  'Professional': 'Professionell',
  'Design': 'Design',
  'Print': 'Tryck',
};

// Function to translate a product name
function translateProductName(name) {
  let translated = name;
  
  // Replace known terms
  Object.keys(translations).forEach(en => {
    const sv = translations[en];
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, sv);
  });
  
  return translated;
}

async function addSwedishTranslationsBatch() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap');
    
    // Process products in batches
    const batchSize = 100;
    const totalProducts = await db.collection('products').countDocuments();
    console.log(`Found ${totalProducts} products to update`);
    
    for (let skip = 0; skip < totalProducts; skip += batchSize) {
      const products = await db.collection('products')
        .find({})
        .skip(skip)
        .limit(batchSize)
        .toArray();
      
      const bulkOps = products.map(product => ({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              nameTranslations: {
                en: product.name,
                sv: translateProductName(product.name)
              }
            }
          }
        }
      }));
      
      if (bulkOps.length > 0) {
        await db.collection('products').bulkWrite(bulkOps);
        console.log(`Updated batch ${skip / batchSize + 1} of ${Math.ceil(totalProducts / batchSize)}`);
      }
    }
    
    console.log('Products updated with Swedish translations');
    
    // Update categories
    const categories = await db.collection('categories').find({}).toArray();
    console.log(`Found ${categories.length} categories to update`);
    
    for (const category of categories) {
      const swedishName = translations[category.name] || translateProductName(category.name);
      
      await db.collection('categories').updateOne(
        { _id: category._id },
        { 
          $set: {
            nameTranslations: {
              en: category.name,
              sv: swedishName
            }
          }
        }
      );
    }
    
    console.log('Categories updated with Swedish translations');
    
    // Update subcategories
    const subcategories = await db.collection('subcategories').find({}).toArray();
    console.log(`Found ${subcategories.length} subcategories to update`);
    
    const subcatBulkOps = subcategories.map(subcategory => ({
      updateOne: {
        filter: { _id: subcategory._id },
        update: {
          $set: {
            nameTranslations: {
              en: subcategory.name,
              sv: subcategory.swedishName || translateProductName(subcategory.name)
            }
          },
          $unset: { swedishName: "" }
        }
      }
    }));
    
    if (subcatBulkOps.length > 0) {
      await db.collection('subcategories').bulkWrite(subcatBulkOps);
    }
    
    console.log('Subcategories updated with Swedish translations');
    console.log('All translations added successfully!');
    
  } catch (error) {
    console.error('Error adding translations:', error);
  } finally {
    await client.close();
  }
}

// Run the migration
addSwedishTranslationsBatch();