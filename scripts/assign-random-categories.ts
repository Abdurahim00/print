import dotenv from "dotenv"
import path from "path"

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { MongoClient } from "mongodb"

async function assignRandomCategories() {
  console.log("Starting to assign random categories to products...")
  console.log("MongoDB URI:", process.env.MONGODB_URI ? "Found" : "Not found")

  const client = new MongoClient(process.env.MONGODB_URI!)
  await client.connect()
  const db = client.db('printwrap-pro')
  const productsCollection = db.collection('products')
  const categoriesCollection = db.collection('categories')

  // Get all categories
  const categories = await categoriesCollection.find({}).toArray()

  if (categories.length === 0) {
    console.log("No categories found in database!")
    process.exit(1)
  }

  console.log(`Found ${categories.length} categories`)

  // Get all products without categoryId
  const productsWithoutCategory = await productsCollection.find({
    $or: [
      { categoryId: { $exists: false } },
      { categoryId: null },
      { categoryId: "" }
    ]
  }).toArray()

  console.log(`Found ${productsWithoutCategory.length} products without category`)

  if (productsWithoutCategory.length === 0) {
    console.log("All products already have categories assigned!")
    process.exit(0)
  }

  // Assign random categories to products
  let updatedCount = 0
  const batchSize = 100

  for (let i = 0; i < productsWithoutCategory.length; i += batchSize) {
    const batch = productsWithoutCategory.slice(i, i + batchSize)
    const bulkOps = batch.map(product => {
      // Assign a random category
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              categoryId: randomCategory._id.toString(),
              categorySlug: randomCategory.slug,
              category: randomCategory.name
            }
          }
        }
      }
    })

    const result = await productsCollection.bulkWrite(bulkOps)
    updatedCount += result.modifiedCount

    console.log(`Updated ${updatedCount} / ${productsWithoutCategory.length} products...`)
  }

  console.log(`✅ Successfully assigned categories to ${updatedCount} products`)

  // Verify the update
  const stillWithoutCategory = await productsCollection.countDocuments({
    $or: [
      { categoryId: { $exists: false } },
      { categoryId: null },
      { categoryId: "" }
    ]
  })

  console.log(`Products still without category: ${stillWithoutCategory}`)

  await client.close()
  process.exit(0)
}

assignRandomCategories().catch(err => {
  console.error("Error:", err)
  process.exit(1)
})