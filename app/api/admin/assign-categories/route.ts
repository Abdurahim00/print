import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const productsCollection = db.collection('products')
    const categoriesCollection = db.collection('categories')

    // Get all categories
    const categories = await categoriesCollection.find({}).toArray()

    if (categories.length === 0) {
      return NextResponse.json({ error: "No categories found in database" }, { status: 400 })
    }

    // Get count of products without categories
    const productsWithoutCategoryCount = await productsCollection.countDocuments({
      $or: [
        { categoryId: { $exists: false } },
        { categoryId: null },
        { categoryId: "" }
      ]
    })

    if (productsWithoutCategoryCount === 0) {
      return NextResponse.json({
        message: "All products already have categories assigned",
        productsUpdated: 0
      })
    }

    // Assign categories to products in batches
    let updatedCount = 0
    const batchSize = 1000
    const totalBatches = Math.ceil(productsWithoutCategoryCount / batchSize)

    console.log(`[AssignCategories] Starting to assign categories to ${productsWithoutCategoryCount} products`)

    for (let batch = 0; batch < totalBatches; batch++) {
      // Get products without categories
      const productsWithoutCategory = await productsCollection
        .find({
          $or: [
            { categoryId: { $exists: false } },
            { categoryId: null },
            { categoryId: "" }
          ]
        })
        .limit(batchSize)
        .toArray()

      if (productsWithoutCategory.length === 0) break

      // Create bulk operations
      const bulkOps = productsWithoutCategory.map((product, index) => {
        // Distribute products evenly across categories
        const categoryIndex = (batch * batchSize + index) % categories.length
        const category = categories[categoryIndex]

        return {
          updateOne: {
            filter: { _id: product._id },
            update: {
              $set: {
                categoryId: category._id.toString(),
                categorySlug: category.slug,
                category: category.name
              }
            }
          }
        }
      })

      // Execute bulk update
      const result = await productsCollection.bulkWrite(bulkOps)
      updatedCount += result.modifiedCount

      console.log(`[AssignCategories] Batch ${batch + 1}/${totalBatches}: Updated ${result.modifiedCount} products`)
    }

    // Verify the update
    const stillWithoutCategory = await productsCollection.countDocuments({
      $or: [
        { categoryId: { $exists: false } },
        { categoryId: null },
        { categoryId: "" }
      ]
    })

    console.log(`[AssignCategories] Completed. ${updatedCount} products updated, ${stillWithoutCategory} still without category`)

    return NextResponse.json({
      success: true,
      message: `Successfully assigned categories to ${updatedCount} products`,
      productsUpdated: updatedCount,
      productsWithoutCategory: stillWithoutCategory,
      totalProducts: await productsCollection.countDocuments({}),
      categories: categories.length
    })
  } catch (error: any) {
    console.error("[AssignCategories] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}