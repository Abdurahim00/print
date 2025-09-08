const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const sampleProducts = [
  {
    name: "Custom T-Shirt",
    price: 299,
    basePrice: 299,
    image: "https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Custom+T-Shirt",
    images: ["https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Custom+T-Shirt"],
    categoryId: "apparel",
    subcategoryIds: ["t-shirts"],
    description: "High-quality custom t-shirt with your design",
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    eligibleForCoupons: true,
    type: "t-shirt"
  },
  {
    name: "Custom Hoodie",
    price: 599,
    basePrice: 599,
    image: "https://via.placeholder.com/400x400/10B981/FFFFFF?text=Custom+Hoodie",
    images: ["https://via.placeholder.com/400x400/10B981/FFFFFF?text=Custom+Hoodie"],
    categoryId: "apparel",
    subcategoryIds: ["hoodies"],
    description: "Comfortable custom hoodie perfect for any season",
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    eligibleForCoupons: true,
    type: "hoodie"
  },
  {
    name: "Custom Mug",
    price: 149,
    basePrice: 149,
    image: "https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=Custom+Mug",
    images: ["https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=Custom+Mug"],
    categoryId: "drinkware",
    subcategoryIds: ["mugs"],
    description: "Ceramic mug with your custom design",
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    eligibleForCoupons: true,
    type: "mug"
  },
  {
    name: "Custom Poster",
    price: 199,
    basePrice: 199,
    image: "https://via.placeholder.com/400x400/EF4444/FFFFFF?text=Custom+Poster",
    images: ["https://via.placeholder.com/400x400/EF4444/FFFFFF?text=Custom+Poster"],
    categoryId: "prints",
    subcategoryIds: ["posters"],
    description: "High-quality poster print with your artwork",
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    eligibleForCoupons: true,
    type: "poster"
  },
  {
    name: "Custom Stickers",
    price: 49,
    basePrice: 49,
    image: "https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Custom+Stickers",
    images: ["https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Custom+Stickers"],
    categoryId: "stickers",
    subcategoryIds: ["vinyl-stickers"],
    description: "Durable vinyl stickers with your design",
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    eligibleForCoupons: true,
    type: "stickers"
  },
  {
    name: "Custom Phone Case",
    price: 249,
    basePrice: 249,
    image: "https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Phone+Case",
    images: ["https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Phone+Case"],
    categoryId: "accessories",
    subcategoryIds: ["phone-cases"],
    description: "Protective phone case with your custom design",
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    eligibleForCoupons: true,
    type: "phone-case"
  },
  {
    name: "Custom Tote Bag",
    price: 299,
    basePrice: 299,
    image: "https://via.placeholder.com/400x400/14B8A6/FFFFFF?text=Tote+Bag",
    images: ["https://via.placeholder.com/400x400/14B8A6/FFFFFF?text=Tote+Bag"],
    categoryId: "bags",
    subcategoryIds: ["tote-bags"],
    description: "Eco-friendly tote bag with your design",
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    eligibleForCoupons: true,
    type: "tote-bag"
  },
  {
    name: "Custom Cap",
    price: 199,
    basePrice: 199,
    image: "https://via.placeholder.com/400x400/F97316/FFFFFF?text=Custom+Cap",
    images: ["https://via.placeholder.com/400x400/F97316/FFFFFF?text=Custom+Cap"],
    categoryId: "apparel",
    subcategoryIds: ["caps"],
    description: "Stylish cap with embroidered custom design",
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    eligibleForCoupons: true,
    type: "cap"
  }
];

async function seedProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrappro');
    const collection = db.collection('products');
    
    // Check if products already exist
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} products. Skipping seed.`);
      console.log('To reseed, clear the products collection first.');
      return;
    }
    
    // Insert sample products
    const result = await collection.insertMany(sampleProducts);
    console.log(`\n✅ Successfully inserted ${result.insertedCount} sample products!`);
    
    // Display the inserted products with their IDs
    const insertedProducts = await collection.find({}).toArray();
    console.log('\n=== INSERTED PRODUCTS ===');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (ID: ${product._id.toString()})`);
    });
    
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

seedProducts();