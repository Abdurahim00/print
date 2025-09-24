const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';

// Swedish translations for common product terms
const productTranslations = {
  // T-shirts and clothing
  "T-Shirt": "T-shirt",
  "Hoodie": "Huvtröja",
  "Sweatshirt": "Sweatshirt",
  "Tank Top": "Linne",
  "Long Sleeve": "Långärmad",
  "Polo Shirt": "Pikétröja",
  "Jacket": "Jacka",
  "Pants": "Byxor",
  "Shorts": "Shorts",
  "Cap": "Keps",
  "Hat": "Hatt",
  "Beanie": "Mössa",
  
  // Accessories
  "Bag": "Väska",
  "Tote Bag": "Tygväska",
  "Backpack": "Ryggsäck",
  "Phone Case": "Mobilskal",
  "Mug": "Mugg",
  "Water Bottle": "Vattenflaska",
  "Keychain": "Nyckelring",
  "Sticker": "Klistermärke",
  "Poster": "Affisch",
  "Canvas": "Canvastavla",
  
  // Materials and features
  "Cotton": "Bomull",
  "Polyester": "Polyester",
  "Organic": "Ekologisk",
  "Premium": "Premium",
  "Classic": "Klassisk",
  "Modern": "Modern",
  "Vintage": "Vintage",
  "Sport": "Sport",
  "Casual": "Vardaglig",
  
  // Colors
  "Black": "Svart",
  "White": "Vit",
  "Red": "Röd",
  "Blue": "Blå",
  "Green": "Grön",
  "Yellow": "Gul",
  "Orange": "Orange",
  "Purple": "Lila",
  "Pink": "Rosa",
  "Gray": "Grå",
  "Brown": "Brun",
  "Navy": "Marinblå",
  
  // Sizes
  "Small": "Liten",
  "Medium": "Medium",
  "Large": "Stor",
  "Extra Large": "Extra stor",
  "XXL": "XXL",
  "XXXL": "XXXL"
};

// Category translations
const categoryTranslations = {
  "Clothing": "Kläder",
  "Accessories": "Tillbehör",
  "Home & Living": "Hem & Inredning",
  "Sports & Outdoors": "Sport & Fritid",
  "Electronics": "Elektronik",
  "Office": "Kontor",
  "Kids & Baby": "Barn & Baby",
  "Pets": "Husdjur",
  "Art & Decor": "Konst & Dekor",
  "Stationery": "Pappersvaror",
  
  // Subcategories
  "T-Shirts": "T-shirts",
  "Hoodies": "Huvtröjor",
  "Sweatshirts": "Sweatshirts",
  "Jackets": "Jackor",
  "Pants": "Byxor",
  "Shorts": "Shorts",
  "Dresses": "Klänningar",
  "Skirts": "Kjolar",
  "Bags": "Väskor",
  "Hats": "Hattar",
  "Caps": "Kepsar",
  "Phone Cases": "Mobilskal",
  "Mugs": "Muggar",
  "Posters": "Affischer",
  "Stickers": "Klistermärken",
  "Notebooks": "Anteckningsböcker",
  "Pens": "Pennor"
};

// Description translation helper
function translateDescription(description) {
  if (!description) return null;
  
  let swedishDesc = description;
  
  // Common description patterns
  const descPatterns = {
    "High quality": "Hög kvalitet",
    "Premium quality": "Premiumkvalitet",
    "Comfortable": "Bekväm",
    "Durable": "Hållbar",
    "Perfect for": "Perfekt för",
    "Made from": "Tillverkad av",
    "Available in": "Finns i",
    "multiple colors": "flera färger",
    "different sizes": "olika storlekar",
    "Machine washable": "Maskintvättbar",
    "Hand wash only": "Handtvätt endast",
    "100% cotton": "100% bomull",
    "Eco-friendly": "Miljövänlig",
    "Sustainable": "Hållbar",
    "Custom design": "Anpassad design",
    "Personalized": "Personlig",
    "Gift idea": "Presentidé"
  };
  
  // Replace common patterns
  Object.entries(descPatterns).forEach(([en, sv]) => {
    swedishDesc = swedishDesc.replace(new RegExp(en, 'gi'), sv);
  });
  
  return swedishDesc;
}

// Helper to translate product name
function translateProductName(name) {
  if (!name) return null;
  
  let translatedName = name;
  
  // Try to translate each word in the product name
  Object.entries(productTranslations).forEach(([en, sv]) => {
    translatedName = translatedName.replace(new RegExp(`\\b${en}\\b`, 'gi'), sv);
  });
  
  return translatedName;
}

// Helper to translate category name
function translateCategoryName(name) {
  if (!name) return null;
  
  // Direct translation if available
  if (categoryTranslations[name]) {
    return categoryTranslations[name];
  }
  
  // Try partial translation
  let translatedName = name;
  Object.entries(categoryTranslations).forEach(([en, sv]) => {
    translatedName = translatedName.replace(new RegExp(`\\b${en}\\b`, 'gi'), sv);
  });
  
  return translatedName;
}

async function addTranslations() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap');
    
    // Update products
    console.log('\n📦 Adding Swedish translations to products...');
    const products = db.collection('products');
    const productsCursor = products.find({});
    
    let productCount = 0;
    let productUpdated = 0;
    
    while (await productsCursor.hasNext()) {
      const product = await productsCursor.next();
      productCount++;
      
      const updates = {};
      
      // Add name translation
      if (product.name && !product.nameTranslations?.sv) {
        const swedishName = translateProductName(product.name);
        if (swedishName !== product.name) {
          updates['nameTranslations.sv'] = swedishName;
          updates['nameTranslations.en'] = product.name;
        }
      }
      
      // Add description translation
      if (product.description && !product.descriptionTranslations?.sv) {
        const swedishDesc = translateDescription(product.description);
        if (swedishDesc !== product.description) {
          updates['descriptionTranslations.sv'] = swedishDesc;
          updates['descriptionTranslations.en'] = product.description;
        }
      }
      
      // Update if we have translations
      if (Object.keys(updates).length > 0) {
        await products.updateOne(
          { _id: product._id },
          { $set: updates }
        );
        productUpdated++;
        
        if (productUpdated % 100 === 0) {
          console.log(`  Updated ${productUpdated} products...`);
        }
      }
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
      
      // Add name translation
      if (category.name && !category.nameTranslations?.sv) {
        const swedishName = translateCategoryName(category.name);
        if (swedishName !== category.name) {
          updates['nameTranslations.sv'] = swedishName;
          updates['nameTranslations.en'] = category.name;
        }
      }
      
      // Add description translation if exists
      if (category.description && !category.descriptionTranslations?.sv) {
        const swedishDesc = translateDescription(category.description);
        if (swedishDesc !== category.description) {
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
      
      // Add name translation
      if (subcategory.name && !subcategory.nameTranslations?.sv) {
        const swedishName = translateCategoryName(subcategory.name);
        if (swedishName !== subcategory.name) {
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
    
  } catch (error) {
    console.error('Error adding translations:', error);
  } finally {
    await client.close();
    console.log('\n✨ Translation process completed!');
  }
}

// Run the script
addTranslations().catch(console.error);