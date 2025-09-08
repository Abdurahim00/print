const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Helper function to map products to categories based on URL patterns
function determineCategory(product) {
  const url = product.Url?.toLowerCase() || '';
  const title = product.Title?.toLowerCase() || '';
  const description = product.description?.toLowerCase() || '';
  
  // Map based on URL patterns and content
  const categoryMappings = {
    'Apparel': [
      't-shirt', 'tshirt', 'shirt', 'hoodie', 'sweatshirt', 'jacka', 
      'kläder', 'byxor', 'klänning', 'polo', 'tröja', 'overall',
      'väst', 'jacket', 'coat', 'pants', 'dress', 'sweater'
    ],
    'Bags': [
      'väska', 'bag', 'ryggsäck', 'backpack', 'shopper', 'tote',
      'portfölj', 'briefcase', 'necessär', 'toiletry', 'trolley',
      'resväska', 'luggage', 'suitcase', 'shoppingvagn'
    ],
    'Drinkware': [
      'mugg', 'mug', 'kopp', 'cup', 'termos', 'thermos', 'flaska',
      'bottle', 'glas', 'glass', 'tumbler', 'kaffee', 'coffee'
    ],
    'Office': [
      'penna', 'pen', 'anteckningsbok', 'notebook', 'kalender',
      'calendar', 'kontorsmaterial', 'office', 'skrivare', 'writing',
      'bläck', 'ink', 'block', 'notepad'
    ],
    'Technology': [
      'usb', 'powerbank', 'laddare', 'charger', 'hörlur', 'headphone',
      'högtalare', 'speaker', 'kabel', 'cable', 'adapter', 'elektronik',
      'electronic', 'tech', 'gadget'
    ],
    'Home & Living': [
      'handduk', 'towel', 'kudde', 'pillow', 'filt', 'blanket',
      'hem', 'home', 'kök', 'kitchen', 'badrum', 'bathroom',
      'inredning', 'decor', 'möbel', 'furniture'
    ],
    'Sports & Outdoor': [
      'sport', 'träning', 'gym', 'fitness', 'outdoor', 'camping',
      'vandring', 'hiking', 'cykel', 'bike', 'löpning', 'running',
      'yoga', 'golf', 'tennis'
    ],
    'Accessories': [
      'nyckelring', 'keychain', 'keps', 'cap', 'hatt', 'hat',
      'mössa', 'beanie', 'solglasögon', 'sunglasses', 'armband',
      'bracelet', 'badge', 'pin', 'reflex', 'reflector'
    ],
    'Kids': [
      'barn', 'kid', 'leksak', 'toy', 'baby', 'junior', 'ungdom',
      'youth', 'skola', 'school'
    ],
    'Eco & Sustainable': [
      'eko', 'eco', 'hållbar', 'sustainable', 'återvinn', 'recycle',
      'miljö', 'environment', 'organic', 'bambu', 'bamboo'
    ]
  };

  // Check each category
  for (const [category, keywords] of Object.entries(categoryMappings)) {
    for (const keyword of keywords) {
      if (url.includes(keyword) || title.includes(keyword) || description.includes(keyword)) {
        return category;
      }
    }
  }

  // Default category if no match
  return 'Other';
}

// Helper function to parse price
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  
  // Remove currency symbols and text, extract number
  const match = priceStr.match(/[\d,.\s]+/);
  if (match) {
    // Remove spaces and convert comma to dot for decimals
    const cleanPrice = match[0].replace(/\s/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 0;
  }
  return 0;
}

// Helper function to extract sizes
function extractSizes(product) {
  const sizes = product.Sizes || [];
  
  // Also check variants for size information
  if (product.variants_dict && product.variants_dict.length > 0) {
    product.variants_dict.forEach(variant => {
      if (variant.variant_name && !sizes.includes(variant.variant_name)) {
        // Check if variant name looks like a size
        const sizePatterns = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2XL', '3XL'];
        if (sizePatterns.includes(variant.variant_name.toUpperCase())) {
          sizes.push(variant.variant_name);
        }
      }
    });
  }
  
  return sizes.length > 0 ? sizes : ['One Size'];
}

// Helper function to process images
function processImages(product) {
  const images = [];
  
  // Primary images
  if (product.image_urls && Array.isArray(product.image_urls)) {
    images.push(...product.image_urls);
  }
  
  // Variant images as fallback or additional
  if (product.variants_dict && Array.isArray(product.variants_dict)) {
    product.variants_dict.forEach(variant => {
      if (variant.variant_image && !images.includes(variant.variant_image)) {
        images.push(variant.variant_image);
      }
    });
  }
  
  // If no images found, use first variant image as primary
  if (images.length === 0 && product.variants_dict && product.variants_dict.length > 0) {
    const firstVariant = product.variants_dict[0];
    if (firstVariant.variant_image) {
      images.push(firstVariant.variant_image);
    }
  }
  
  return images;
}

// Helper to create design areas based on product type
function createDesignAreas(product) {
  const title = product.Title?.toLowerCase() || '';
  const category = determineCategory(product);
  
  // Default design areas for different product types
  if (category === 'Apparel' || title.includes('shirt') || title.includes('hoodie')) {
    return [
      {
        name: 'front',
        width: 12,
        height: 16,
        left: 50,
        top: 20,
        mockupUrl: product.image_urls?.[0] || product.variants_dict?.[0]?.variant_image || ''
      },
      {
        name: 'back',
        width: 12,
        height: 16,
        left: 50,
        top: 20,
        mockupUrl: product.image_urls?.[1] || product.variants_dict?.[1]?.variant_image || ''
      }
    ];
  } else if (category === 'Drinkware' || title.includes('mugg') || title.includes('mug')) {
    return [
      {
        name: 'wrap',
        width: 8,
        height: 4,
        left: 50,
        top: 40,
        mockupUrl: product.image_urls?.[0] || product.variants_dict?.[0]?.variant_image || ''
      }
    ];
  } else if (category === 'Bags') {
    return [
      {
        name: 'front',
        width: 10,
        height: 12,
        left: 50,
        top: 30,
        mockupUrl: product.image_urls?.[0] || product.variants_dict?.[0]?.variant_image || ''
      }
    ];
  }
  
  // Default single design area
  return [
    {
      name: 'main',
      width: 10,
      height: 10,
      left: 50,
      top: 35,
      mockupUrl: product.image_urls?.[0] || product.variants_dict?.[0]?.variant_image || ''
    }
  ];
}

// Function to create color variants
function createColorVariants(product) {
  const variants = [];
  
  if (product.variants_dict && Array.isArray(product.variants_dict)) {
    product.variants_dict.forEach(variant => {
      if (variant.variant_name) {
        variants.push({
          name: variant.variant_name,
          color: variant.variant_name.toLowerCase(),
          images: variant.variant_image ? [variant.variant_image] : [],
          inStock: true
        });
      }
    });
  }
  
  // If no variants, create a default one
  if (variants.length === 0) {
    variants.push({
      name: 'Default',
      color: 'default',
      images: processImages(product),
      inStock: true
    });
  }
  
  return variants;
}

async function importProducts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');

    // Step 1: Remove all existing products
    console.log('Removing all existing products...');
    const deleteResult = await productsCollection.deleteMany({});
    console.log(`Removed ${deleteResult.deletedCount} products`);

    // Step 2: Get all categories
    const categories = await categoriesCollection.find({}).toArray();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    console.log(`Found ${categories.length} categories`);

    // Create Other category if it doesn't exist
    if (!categoryMap['Other']) {
      const otherCategory = {
        name: 'Other',
        slug: 'other',
        description: 'Other products',
        subcategories: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await categoriesCollection.insertOne(otherCategory);
      categoryMap['Other'] = result.insertedId;
      console.log('Created "Other" category');
    }

    // Step 3: Read the JSON file
    const jsonPath = path.join(__dirname, '..', '60k.json');
    console.log('Reading 60k.json file...');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const products = JSON.parse(rawData);
    console.log(`Found ${products.length} products to import`);

    // Step 4: Import products in batches
    const batchSize = 500;
    let imported = 0;
    let failed = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const productsToInsert = [];

      for (const rawProduct of batch) {
        try {
          const categoryName = determineCategory(rawProduct);
          const categoryId = categoryMap[categoryName] || categoryMap['Other'];
          
          const images = processImages(rawProduct);
          const primaryImage = images[0] || '';
          
          const product = {
            name: rawProduct.Title || 'Untitled Product',
            description: rawProduct.description || '',
            basePrice: parsePrice(rawProduct.price_after_tax),
            category: categoryId,
            subcategory: null,
            images: images,
            imageUrl: primaryImage,
            sku: rawProduct.Article_no || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            inStock: true,
            featured: false,
            isDesignable: ['Apparel', 'Drinkware', 'Bags', 'Accessories'].includes(categoryName),
            designAreas: createDesignAreas(rawProduct),
            sizes: extractSizes(rawProduct),
            colors: createColorVariants(rawProduct),
            brand: rawProduct.brand_info ? rawProduct.brand_info.split('\n')[0] : '',
            productInfo: rawProduct.product_info || {},
            variants: rawProduct.variants_dict || [],
            sourceUrl: rawProduct.Url || '',
            tags: [],
            printingMethods: ['DTG', 'Screen Printing', 'Embroidery'],
            minQuantity: 1,
            maxQuantity: 1000,
            productionTime: 5,
            shippingClass: 'standard',
            weight: rawProduct.product_info?.Vikt || '0.5 kg',
            dimensions: rawProduct.product_info?.Mått || '',
            careInstructions: '',
            material: '',
            createdAt: new Date(),
            updatedAt: new Date()
          };

          // Add sustainability info if applicable
          if (categoryName === 'Eco & Sustainable') {
            product.sustainability = {
              ecoFriendly: true,
              certifications: ['Organic', 'Recycled'],
              carbonFootprint: 'Low'
            };
          }

          productsToInsert.push(product);
        } catch (err) {
          console.error(`Failed to process product: ${rawProduct.Title}`, err.message);
          failed++;
        }
      }

      // Insert batch
      if (productsToInsert.length > 0) {
        try {
          const result = await productsCollection.insertMany(productsToInsert, { ordered: false });
          imported += result.insertedCount;
          console.log(`Progress: ${imported}/${products.length} products imported...`);
        } catch (err) {
          // Handle partial batch failures
          if (err.insertedCount) {
            imported += err.insertedCount;
          }
          console.error(`Batch error: ${err.message}`);
        }
      }
    }

    console.log('\n=== Import Complete ===');
    console.log(`Successfully imported: ${imported} products`);
    console.log(`Failed to import: ${failed} products`);
    console.log(`Total processed: ${products.length} products`);

    // Step 5: Update category product counts
    console.log('\nUpdating category product counts...');
    for (const categoryName in categoryMap) {
      const count = await productsCollection.countDocuments({ category: categoryMap[categoryName] });
      await categoriesCollection.updateOne(
        { _id: categoryMap[categoryName] },
        { 
          $set: { 
            productCount: count,
            updatedAt: new Date()
          } 
        }
      );
      console.log(`${categoryName}: ${count} products`);
    }

    // Create indexes for better performance
    console.log('\nCreating indexes...');
    await productsCollection.createIndex({ name: 'text', description: 'text' });
    await productsCollection.createIndex({ category: 1 });
    await productsCollection.createIndex({ sku: 1 });
    await productsCollection.createIndex({ basePrice: 1 });
    await productsCollection.createIndex({ isDesignable: 1 });
    console.log('Indexes created successfully');

    console.log('\n✅ Import process completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the import
console.log('Starting product import...');
console.log('This will remove all existing products and import new ones from 60k.json');
console.log('-----------------------------------------------------------');
importProducts();