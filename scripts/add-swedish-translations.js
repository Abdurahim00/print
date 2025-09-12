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
  'Service': 'Tjänst',
  'Package': 'Paket',
  'Bundle': 'Bunt',
  'Set': 'Set',
  'Small': 'Liten',
  'Medium': 'Medium',
  'Large': 'Stor',
  'Extra Large': 'Extra Stor',
  'Round': 'Rund',
  'Square': 'Fyrkant',
  'Rectangle': 'Rektangel',
  'Matte': 'Matt',
  'Glossy': 'Glansig',
  'Vinyl': 'Vinyl',
  'Paper': 'Papper',
  'Fabric': 'Tyg',
  'Metal': 'Metall',
  'Plastic': 'Plast',
  'T-Shirt': 'T-shirt',
  'Hoodie': 'Huvtröja',
  'Cap': 'Keps',
  'Mug': 'Mugg',
  'Pen': 'Penna',
  'Keychain': 'Nyckelring',
  'Badge': 'Märke',
  'Full': 'Full',
  'Partial': 'Delvis',
  'Wrap': 'Foliering',
  'Window': 'Fönster',
  'Door': 'Dörr',
  'Hood': 'Huv',
  'Roof': 'Tak',
  'Side': 'Sida',
  'Front': 'Fram',
  'Back': 'Bak',
  'Mirror': 'Spegel',
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

// Function to translate description
function translateDescription(description) {
  if (!description) return null;
  
  // Basic translations for common phrases
  const descTranslations = {
    'High quality': 'Hög kvalitet',
    'Professional': 'Professionell',
    'Custom design': 'Anpassad design',
    'Fast delivery': 'Snabb leverans',
    'Best seller': 'Bästsäljare',
    'Popular choice': 'Populärt val',
    'Eco-friendly': 'Miljövänlig',
    'Waterproof': 'Vattentät',
    'Durable': 'Hållbar',
    'Easy to apply': 'Lätt att applicera',
    'Long lasting': 'Långvarig',
    'Indoor': 'Inomhus',
    'Outdoor': 'Utomhus',
    'Weather resistant': 'Väderbeständig',
  };
  
  let translated = description;
  Object.keys(descTranslations).forEach(en => {
    const sv = descTranslations[en];
    const regex = new RegExp(en, 'gi');
    translated = translated.replace(regex, sv);
  });
  
  return translated;
}

async function addSwedishTranslations() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap');
    
    // Update products
    const products = await db.collection('products').find({}).toArray();
    console.log(`Found ${products.length} products to update`);
    
    for (const product of products) {
      const updates = {
        nameTranslations: {
          en: product.name,
          sv: translateProductName(product.name)
        }
      };
      
      if (product.description) {
        updates.descriptionTranslations = {
          en: product.description,
          sv: translateDescription(product.description)
        };
      }
      
      await db.collection('products').updateOne(
        { _id: product._id },
        { $set: updates }
      );
    }
    
    console.log('Products updated with Swedish translations');
    
    // Update categories
    const categories = await db.collection('categories').find({}).toArray();
    console.log(`Found ${categories.length} categories to update`);
    
    for (const category of categories) {
      const swedishName = translations[category.name] || category.name;
      
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
    
    for (const subcategory of subcategories) {
      // Use existing swedishName if available, otherwise translate
      const swedishName = subcategory.swedishName || translateProductName(subcategory.name);
      
      await db.collection('subcategories').updateOne(
        { _id: subcategory._id },
        { 
          $set: {
            nameTranslations: {
              en: subcategory.name,
              sv: swedishName
            }
          },
          $unset: { swedishName: "" } // Remove old field
        }
      );
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
addSwedishTranslations();