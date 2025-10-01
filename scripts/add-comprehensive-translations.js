const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';

// Comprehensive Swedish translations
const translations = {
  // Common product terms
  "notebook": "anteckningsbok",
  "pen": "penna",
  "shirt": "skjorta",
  "t-shirt": "t-shirt",
  "hoodie": "huvtröja",
  "sweatshirt": "sweatshirt",
  "jacket": "jacka",
  "pants": "byxor",
  "shorts": "shorts",
  "cap": "keps",
  "hat": "hatt",
  "beanie": "mössa",
  "bag": "väska",
  "backpack": "ryggsäck",
  "phone case": "mobilskal",
  "mug": "mugg",
  "bottle": "flaska",
  "sticker": "klistermärke",
  "poster": "affisch",
  "canvas": "canvastavla",
  "keychain": "nyckelring",
  "mousepad": "musmatta",
  "towel": "handduk",
  "pillow": "kudde",
  "blanket": "filt",
  "apron": "förkläde",
  "socks": "strumpor",
  "scarf": "halsduk",
  "gloves": "handskar",
  "mask": "mask",
  "bandana": "bandana",
  "wallet": "plånbok",
  "card": "kort",
  "calendar": "kalender",
  "planner": "planerare",
  "journal": "dagbok",
  
  // Materials
  "cotton": "bomull",
  "polyester": "polyester",
  "organic": "ekologisk",
  "bamboo": "bambu",
  "wool": "ull",
  "leather": "läder",
  "metal": "metall",
  "plastic": "plast",
  "glass": "glas",
  "ceramic": "keramik",
  "wood": "trä",
  "paper": "papper",
  
  // Descriptive terms
  "premium": "premium",
  "classic": "klassisk",
  "modern": "modern",
  "vintage": "vintage",
  "sport": "sport",
  "casual": "vardaglig",
  "formal": "formell",
  "professional": "professionell",
  "outdoor": "utomhus",
  "indoor": "inomhus",
  "unisex": "unisex",
  "men": "herr",
  "women": "dam",
  "kids": "barn",
  "baby": "baby",
  "adult": "vuxen",
  
  // Colors
  "black": "svart",
  "white": "vit",
  "red": "röd",
  "blue": "blå",
  "green": "grön",
  "yellow": "gul",
  "orange": "orange",
  "purple": "lila",
  "pink": "rosa",
  "gray": "grå",
  "grey": "grå",
  "brown": "brun",
  "navy": "marinblå",
  "beige": "beige",
  "turquoise": "turkos",
  "gold": "guld",
  "silver": "silver",
  
  // Sizes
  "small": "liten",
  "medium": "medium",
  "large": "stor",
  "extra large": "extra stor",
  
  // Product features
  "with": "med",
  "without": "utan",
  "custom": "anpassad",
  "personalized": "personlig",
  "printed": "tryckt",
  "embroidered": "broderad",
  "engraved": "graverad",
  "handmade": "handgjord",
  "eco-friendly": "miljövänlig",
  "sustainable": "hållbar",
  "recyclable": "återvinningsbar",
  "waterproof": "vattentät",
  "durable": "hållbar",
  "comfortable": "bekväm",
  "soft": "mjuk",
  "lightweight": "lätt",
  "heavy duty": "kraftig",
  
  // Common patterns in product names
  "spectrum": "spektrum",
  "plus": "plus",
  "pro": "pro",
  "deluxe": "deluxe",
  "elite": "elit",
  "standard": "standard",
  "basic": "grundläggande",
  "advanced": "avancerad",
  "professional": "professionell",
  "executive": "executive",
  "luxury": "lyx",
  "economy": "ekonomi",
  
  // Office supplies
  "office": "kontor",
  "desk": "skrivbord",
  "chair": "stol",
  "lamp": "lampa",
  "folder": "mapp",
  "binder": "pärm",
  "stapler": "häftapparat",
  "scissors": "sax",
  "tape": "tejp",
  "glue": "lim",
  "marker": "märkpenna",
  "highlighter": "överstrykningspenna",
  "eraser": "suddgummi",
  "ruler": "linjal",
  "calculator": "miniräknare"
};

// Category translations
const categoryTranslations = {
  "Clothing": "Kläder",
  "Accessories": "Tillbehör",
  "Home & Living": "Hem & Inredning",
  "Sports & Outdoors": "Sport & Fritid",
  "Electronics": "Elektronik",
  "Office": "Kontor",
  "Office Supplies": "Kontorsmaterial",
  "Kids & Baby": "Barn & Baby",
  "Pets": "Husdjur",
  "Art & Decor": "Konst & Dekor",
  "Stationery": "Pappersvaror",
  "Bags": "Väskor",
  "Drinkware": "Dryckesartiklar",
  "Tech Accessories": "Teknikprylar",
  "Home Decor": "Heminredning",
  "Kitchen": "Kök",
  "Bathroom": "Badrum",
  "Bedroom": "Sovrum",
  "Living Room": "Vardagsrum",
  "Garden": "Trädgård",
  "Outdoor": "Utomhus",
  "Travel": "Resor",
  "Gifts": "Presenter",
  "Seasonal": "Säsong"
};

// Function to translate text using the dictionary
function translateText(text, dictionary) {
  if (!text) return null;
  
  let translated = text.toLowerCase();
  let hasTranslation = false;
  
  // Sort by length (longer phrases first) to avoid partial replacements
  const sortedEntries = Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length);
  
  for (const [en, sv] of sortedEntries) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    if (regex.test(translated)) {
      translated = translated.replace(regex, sv);
      hasTranslation = true;
    }
  }
  
  // Capitalize first letter if original was capitalized
  if (text[0] === text[0].toUpperCase()) {
    translated = translated.charAt(0).toUpperCase() + translated.slice(1);
  }
  
  // Only return translation if we actually translated something
  return hasTranslation ? translated : null;
}

async function addComprehensiveTranslations() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap');
    
    // Update products
    console.log('\n📦 Adding Swedish translations to ALL products...');
    const products = db.collection('products');
    const productsCursor = products.find({});
    
    let productCount = 0;
    let productUpdated = 0;
    let batch = [];
    const BATCH_SIZE = 100;
    
    while (await productsCursor.hasNext()) {
      const product = await productsCursor.next();
      productCount++;
      
      const updates = {};
      
      // Translate name
      if (product.name) {
        const swedishName = translateText(product.name, translations);
        if (swedishName) {
          updates['nameTranslations.sv'] = swedishName;
          updates['nameTranslations.en'] = product.name;
        }
      }
      
      // Translate description
      if (product.description) {
        const swedishDesc = translateText(product.description, translations);
        if (swedishDesc) {
          updates['descriptionTranslations.sv'] = swedishDesc;
          updates['descriptionTranslations.en'] = product.description;
        }
      }
      
      // Update if we have translations
      if (Object.keys(updates).length > 0) {
        batch.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: updates }
          }
        });
        productUpdated++;
      }
      
      // Process batch
      if (batch.length >= BATCH_SIZE) {
        await products.bulkWrite(batch);
        console.log(`  Updated ${productUpdated} products...`);
        batch = [];
      }
    }
    
    // Process remaining batch
    if (batch.length > 0) {
      await products.bulkWrite(batch);
    }
    
    console.log(`✅ Updated ${productUpdated} out of ${productCount} products with Swedish translations`);
    
    // Update categories
    console.log('\n📁 Adding Swedish translations to categories...');
    const categories = db.collection('categories');
    const categoriesCursor = categories.find({});
    
    let categoryCount = 0;
    let categoryUpdated = 0;
    
    while (await categoriesCursor.hasNext()) {
      const category = await categoriesCursor.next();
      categoryCount++;
      
      const updates = {};
      
      // Direct translation or word-by-word
      if (category.name) {
        const directTranslation = categoryTranslations[category.name];
        const wordTranslation = translateText(category.name, {...translations, ...categoryTranslations});
        const swedishName = directTranslation || wordTranslation;
        
        if (swedishName) {
          updates['nameTranslations.sv'] = swedishName;
          updates['nameTranslations.en'] = category.name;
        }
      }
      
      // Translate description
      if (category.description) {
        const swedishDesc = translateText(category.description, translations);
        if (swedishDesc) {
          updates['descriptionTranslations.sv'] = swedishDesc;
          updates['descriptionTranslations.en'] = category.description;
        }
      }
      
      // Update if we have translations
      if (Object.keys(updates).length > 0) {
        await categories.updateOne(
          { _id: category._id },
          { $set: updates }
        );
        categoryUpdated++;
      }
    }
    
    console.log(`✅ Updated ${categoryUpdated} out of ${categoryCount} categories with Swedish translations`);
    
    // Update subcategories
    console.log('\n📂 Adding Swedish translations to subcategories...');
    const subcategories = db.collection('subcategories');
    const subcategoriesCursor = subcategories.find({});
    
    let subcategoryCount = 0;
    let subcategoryUpdated = 0;
    
    while (await subcategoriesCursor.hasNext()) {
      const subcategory = await subcategoriesCursor.next();
      subcategoryCount++;
      
      const updates = {};
      
      // Translate name
      if (subcategory.name) {
        const directTranslation = categoryTranslations[subcategory.name];
        const wordTranslation = translateText(subcategory.name, {...translations, ...categoryTranslations});
        const swedishName = directTranslation || wordTranslation;
        
        if (swedishName) {
          updates['nameTranslations.sv'] = swedishName;
          updates['nameTranslations.en'] = subcategory.name;
        }
      }
      
      // Update if we have translations
      if (Object.keys(updates).length > 0) {
        await subcategories.updateOne(
          { _id: subcategory._id },
          { $set: updates }
        );
        subcategoryUpdated++;
      }
    }
    
    console.log(`✅ Updated ${subcategoryUpdated} out of ${subcategoryCount} subcategories with Swedish translations`);
    
    // Summary
    console.log('\n📊 Translation Summary:');
    console.log(`  - Products: ${productUpdated}/${productCount} updated`);
    console.log(`  - Categories: ${categoryUpdated}/${categoryCount} updated`);
    console.log(`  - Subcategories: ${subcategoryUpdated}/${subcategoryCount} updated`);
    
    // Show sample translations
    console.log('\n📝 Sample Translations:');
    const sampleProduct = await products.findOne({ 'nameTranslations.sv': { $exists: true } });
    if (sampleProduct) {
      console.log(`  Product: "${sampleProduct.name}" → "${sampleProduct.nameTranslations.sv}"`);
    }
    
    const sampleCategory = await categories.findOne({ 'nameTranslations.sv': { $exists: true } });
    if (sampleCategory) {
      console.log(`  Category: "${sampleCategory.name}" → "${sampleCategory.nameTranslations.sv}"`);
    }
    
  } catch (error) {
    console.error('Error adding translations:', error);
  } finally {
    await client.close();
    console.log('\n✨ Translation process completed!');
  }
}

// Run the script
addComprehensiveTranslations().catch(console.error);