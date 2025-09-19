import dotenv from "dotenv"
import path from "path"
import { MongoClient, ObjectId } from "mongodb"

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function fixCategories() {
  console.log("Fixing category assignments...")

  const client = new MongoClient(process.env.MONGODB_URI!)
  await client.connect()
  const db = client.db('printwrap-pro')
  const productsCollection = db.collection('products')
  const categoriesCollection = db.collection('categories')

  // Get all categories
  const categories = await categoriesCollection.find({}).toArray()
  console.log(`Found ${categories.length} categories`)

  // Create a map for quick lookup
  const categoryMap = new Map()
  categories.forEach(cat => {
    categoryMap.set(cat._id.toString(), cat)
  })

  // Get all products
  const products = await productsCollection.find({}).toArray()
  console.log(`Found ${products.length} products to fix`)

  // Fix products in batches
  const batchSize = 1000
  let fixedCount = 0

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize)
    const bulkOps = []

    for (const product of batch) {
      // Get the category from the categoryId if it's an ObjectId
      let category = null

      if (product.categoryId instanceof ObjectId) {
        category = categoryMap.get(product.categoryId.toString())
      } else if (typeof product.categoryId === 'string') {
        // Try to find by string ID
        category = categoryMap.get(product.categoryId)
      }

      // If no category found, assign a random one
      if (!category) {
        const randomIndex = Math.floor(Math.random() * categories.length)
        category = categories[randomIndex]
      }

      // Update the product with correct category fields
      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              categoryId: category._id.toString(),
              category: category.name,
              categorySlug: category.slug
            }
          }
        }
      })
    }

    if (bulkOps.length > 0) {
      const result = await productsCollection.bulkWrite(bulkOps)
      fixedCount += result.modifiedCount
      console.log(`Fixed ${fixedCount} / ${products.length} products...`)
    }
  }

  // Verify the fix
  const sampleProducts = await productsCollection.find({}).limit(5).toArray()
  console.log('\nSample fixed products:')
  sampleProducts.forEach(p => {
    console.log({
      name: p.name,
      categoryId: p.categoryId,
      category: p.category,
      categorySlug: p.categorySlug
    })
  })

  console.log(`\n✅ Fixed ${fixedCount} products`)

  await client.close()
  process.exit(0)
}

fixCategories().catch(err => {
  console.error("Error:", err)
  process.exit(1)
})