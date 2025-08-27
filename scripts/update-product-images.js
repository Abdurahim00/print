const { MongoClient } = require('mongodb')

const uri = process.env.MONGODB_URI || 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/'

// Real stock image URLs (using free image services)
const productImages = {
  'flyers': [
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80',
    'https://images.unsplash.com/photo-1614728894747-a83421787b0?w=600&q=80',
    'https://images.unsplash.com/photo-1563207153-f403b79b0b16?w=600&q=80',
  ],
  'business-cards': [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    'https://images.unsplash.com/photo-1568992688065-536aecf67a3e?w=600&q=80',
    'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=600&q=80',
  ],
  'stickers': [
    'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80',
    'https://images.unsplash.com/photo-1596367407372-96cb88503db6?w=600&q=80',
    'https://images.unsplash.com/photo-1572375992501-4a0892b50c6?w=600&q=80',
  ],
  'car-wraps': [
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80',
    'https://images.unsplash.com/photo-1616788494672-b8509c6b7e0c?w=600&q=80',
  ],
  'decals': [
    'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80',
    'https://images.unsplash.com/photo-1582738509021-5cf1b0ea5cca?w=600&q=80',
    'https://images.unsplash.com/photo-1567449303078-4f1f211a5c57?w=600&q=80',
  ],
  'apparel': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=600&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
  ],
  'promotional-items': [
    'https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?w=600&q=80',
    'https://images.unsplash.com/photo-1605559911160-a3d95d213904?w=600&q=80',
    'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80',
  ],
}

async function updateProductImages() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const database = client.db('printwrap')
    const products = database.collection('products')

    // Get all products
    const allProducts = await products.find({}).toArray()
    console.log(`Found ${allProducts.length} products`)

    // Update each product with a real image
    for (const product of allProducts) {
      const categoryImages = productImages[product.categoryId] || productImages['apparel']
      const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)]
      
      // Also update variations if they exist
      let updatedVariations = product.variations
      if (product.hasVariations && product.variations) {
        updatedVariations = product.variations.map(variation => {
          // Update variation images
          if (variation.images) {
            variation.images = variation.images.map((img, index) => ({
              ...img,
              url: categoryImages[index % categoryImages.length] || randomImage
            }))
          }
          return variation
        })
      }

      await products.updateOne(
        { _id: product._id },
        { 
          $set: { 
            image: randomImage,
            variations: updatedVariations
          } 
        }
      )
      console.log(`Updated product: ${product.name}`)
    }

    console.log('Successfully updated all product images!')
  } catch (error) {
    console.error('Error updating product images:', error)
  } finally {
    await client.close()
  }
}

updateProductImages()