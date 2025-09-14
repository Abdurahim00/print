const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'printwrap-pro';

async function quickReassign() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  console.log('🚀 QUICK REASSIGNMENT STARTING...\n');

  // Get all products
  const products = await db.collection('products').find({}).toArray();
  console.log(`Processing ${products.length} products...`);

  // Get current subcategories
  const subcategories = await db.collection('subcategories').find({}).toArray();
  console.log(`Found ${subcategories.length} subcategories\n`);

  // Keyword mapping for subcategories
  const keywords = {
    't-shirts': ['t-shirt', 'tshirt', 'tee', 't shirt'],
    'hoodies': ['hoodie', 'hood', 'sweatshirt'],
    'bags': ['bag', 'väska', 'ryggsäck', 'backpack', 'tote'],
    'mugs': ['mug', 'kopp', 'cup'],
    'pens': ['pen', 'penna', 'pencil', 'marker'],
    'notebooks': ['notebook', 'anteckningsbok', 'notepad', 'journal'],
    'bottles': ['bottle', 'flaska', 'flask', 'thermos'],
    'caps': ['cap', 'keps', 'hat', 'snapback'],
    'jackets': ['jacket', 'jacka', 'coat', 'windbreaker'],
    'shirts': ['shirt', 'skjorta', 'polo'],
    'pants': ['pant', 'byxa', 'trouser', 'jean'],
    'keychains': ['keychain', 'nyckelring', 'keyring'],
    'umbrellas': ['umbrella', 'paraply'],
    'lanyards': ['lanyard', 'nyckelband'],
    'stickers': ['sticker', 'klistermärke', 'decal'],
    'toys': ['toy', 'leksak', 'game'],
    'towels': ['towel', 'handduk'],
    'blankets': ['blanket', 'filt'],
    'speakers': ['speaker', 'högtalare'],
    'headphones': ['headphone', 'hörlurar', 'earphone'],
    'power banks': ['powerbank', 'power bank', 'charger', 'laddare'],
    'usb drives': ['usb', 'flash drive', 'memory stick'],
    'miscellaneous': ['misc', 'övrigt', 'other', 'diverse']
  };

  let updateCount = 0;
  const bulkOps = [];

  for (const product of products) {
    const productName = (product.name || '').toLowerCase();
    const productDesc = (product.description || '').toLowerCase();
    const combined = `${productName} ${productDesc}`;

    let assignedSubId = null;
    let assignedCatId = null;

    // Try to find matching subcategory
    for (const sub of subcategories) {
      const subNameLower = sub.name.toLowerCase();

      // Direct name match
      if (combined.includes(subNameLower)) {
        assignedSubId = sub.id || sub._id.toString();
        assignedCatId = sub.categoryId;
        break;
      }

      // Keyword match
      const subKeywords = keywords[subNameLower] || [];
      if (subKeywords.some(keyword => combined.includes(keyword))) {
        assignedSubId = sub.id || sub._id.toString();
        assignedCatId = sub.categoryId;
        break;
      }
    }

    // Default to Miscellaneous if no match
    if (!assignedSubId) {
      const misc = subcategories.find(s => s.name === 'Miscellaneous');
      if (misc) {
        assignedSubId = misc.id || misc._id.toString();
        assignedCatId = misc.categoryId;
      }
    }

    if (assignedSubId) {
      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              subcategoryId: assignedSubId,
              subcategoryIds: [assignedSubId],
              categoryId: assignedCatId
            }
          }
        }
      });
      updateCount++;

      // Execute in batches of 500
      if (bulkOps.length >= 500) {
        await db.collection('products').bulkWrite(bulkOps);
        console.log(`Updated ${updateCount} products...`);
        bulkOps.length = 0;
      }
    }
  }

  // Execute remaining operations
  if (bulkOps.length > 0) {
    await db.collection('products').bulkWrite(bulkOps);
  }

  console.log(`\n✅ Successfully reassigned ${updateCount} products`);

  // Show final distribution
  console.log('\n📊 PRODUCT DISTRIBUTION BY SUBCATEGORY:\n');

  for (const sub of subcategories) {
    const count = await db.collection('products').countDocuments({
      subcategoryId: { $in: [sub.id, sub._id?.toString()] }
    });
    if (count > 0) {
      console.log(`${sub.name}: ${count} products`);
    }
  }

  await client.close();
  console.log('\n✅ Done!');
}

quickReassign().catch(console.error);