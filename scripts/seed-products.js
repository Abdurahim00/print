const { MongoClient } = require('mongodb')

const uri = process.env.MONGODB_URI || 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/'

const products = [
  // Flyers
  {
    name: "Premium Business Flyers",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80",
    categoryId: "flyers",
    description: "High-quality full-color flyers perfect for marketing campaigns",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Event Flyers",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1614728894747-a83421787b0?w=600&q=80",
    categoryId: "flyers",
    description: "Eye-catching flyers for events and promotions",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Business Cards
  {
    name: "Premium Business Cards",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    categoryId: "business-cards",
    description: "Professional business cards with premium finish",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Luxury Business Cards",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1568992688065-536aecf67a3e?w=600&q=80",
    categoryId: "business-cards",
    description: "Thick, luxurious business cards with special finishes",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Stickers
  {
    name: "Custom Die-Cut Stickers",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80",
    categoryId: "stickers",
    description: "Durable vinyl stickers in custom shapes",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Holographic Stickers",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1596367407372-96cb88503db6?w=600&q=80",
    categoryId: "stickers",
    description: "Eye-catching holographic stickers",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Apparel
  {
    name: "Custom T-Shirt",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    categoryId: "apparel",
    description: "Premium cotton t-shirt with custom print",
    inStock: true,
    hasVariations: true,
    sizePrices: [
      { size: "XS", price: 19.99 },
      { size: "S", price: 19.99 },
      { size: "M", price: 19.99 },
      { size: "L", price: 19.99 },
      { size: "XL", price: 21.99 },
      { size: "XXL", price: 23.99 }
    ],
    variations: [
      {
        id: "tshirt-black",
        color: { name: "Black", hex_code: "#000000" },
        price: 19.99,
        inStock: true,
        stockQuantity: 100,
        images: [
          {
            id: "img1",
            url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
            alt_text: "Black T-Shirt",
            angle: "front",
            is_primary: true
          }
        ]
      },
      {
        id: "tshirt-white",
        color: { name: "White", hex_code: "#FFFFFF" },
        price: 19.99,
        inStock: true,
        stockQuantity: 100,
        images: [
          {
            id: "img2",
            url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
            alt_text: "White T-Shirt",
            angle: "front",
            is_primary: true
          }
        ]
      }
    ],
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Premium Hoodie",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600&q=80",
    categoryId: "apparel",
    description: "Comfortable hoodie with custom design",
    inStock: true,
    hasVariations: true,
    sizePrices: [
      { size: "XS", price: 39.99 },
      { size: "S", price: 39.99 },
      { size: "M", price: 39.99 },
      { size: "L", price: 39.99 },
      { size: "XL", price: 42.99 },
      { size: "XXL", price: 44.99 }
    ],
    variations: [
      {
        id: "hoodie-gray",
        color: { name: "Gray", hex_code: "#808080" },
        price: 39.99,
        inStock: true,
        stockQuantity: 50,
        images: [
          {
            id: "img3",
            url: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600&q=80",
            alt_text: "Gray Hoodie",
            angle: "front",
            is_primary: true
          }
        ]
      }
    ],
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Car Wraps
  {
    name: "Full Vehicle Wrap",
    price: 2999.99,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80",
    categoryId: "car-wraps",
    description: "Complete vehicle wrap with custom design",
    inStock: true,
    eligibleForCoupons: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Partial Vehicle Wrap",
    price: 1499.99,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80",
    categoryId: "car-wraps",
    description: "Partial vehicle wrap for doors and hood",
    inStock: true,
    eligibleForCoupons: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Decals
  {
    name: "Window Decals",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80",
    categoryId: "decals",
    description: "Weather-resistant window decals",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Wall Decals",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1582738509021-5cf1b0ea5cca?w=600&q=80",
    categoryId: "decals",
    description: "Removable wall decals for indoor use",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Promotional Items
  {
    name: "Custom Mugs",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?w=600&q=80",
    categoryId: "promotional-items",
    description: "Ceramic mugs with custom print",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Branded Pens",
    price: 2.99,
    image: "https://images.unsplash.com/photo-1605559911160-a3d95d213904?w=600&q=80",
    categoryId: "promotional-items",
    description: "Quality pens with your logo",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Tote Bags",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80",
    categoryId: "promotional-items",
    description: "Eco-friendly tote bags with custom design",
    inStock: true,
    eligibleForCoupons: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedProducts() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const database = client.db('printwrap')
    const productsCollection = database.collection('products')

    // Check if products already exist
    const existingCount = await productsCollection.countDocuments()
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} products. Skipping seed.`)
      console.log('To reseed, delete existing products first.')
      return
    }

    // Insert products
    const result = await productsCollection.insertMany(products)
    console.log(`Successfully inserted ${result.insertedCount} products!`)

    // List inserted products
    const insertedProducts = await productsCollection.find({}).toArray()
    console.log('\nInserted products:')
    insertedProducts.forEach(p => {
      console.log(`- ${p.name} (${p.categoryId}): $${p.price}`)
    })

  } catch (error) {
    console.error('Error seeding products:', error)
  } finally {
    await client.close()
  }
}

seedProducts()