import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('slug')

    const db = await getDatabase()

    // Get the category by slug
    const categoriesCollection = db.collection('categories')
    const category = await categoriesCollection.findOne({ slug: categorySlug })

    if (!category) {
      return NextResponse.json({
        error: `No category found with slug: ${categorySlug}`,
        availableCategories: await categoriesCollection.find({}).project({ slug: 1, name: 1, _id: 1 }).limit(10).toArray()
      })
    }

    // Get a few products with this categoryId
    const productsCollection = db.collection('products')

    // Try different formats
    const productsByObjectId = await productsCollection.find({ categoryId: category._id.toString() }).limit(5).toArray()
    const productsBySlug = await productsCollection.find({ categoryId: categorySlug }).limit(5).toArray()
    const productsByRawId = await productsCollection.find({ categoryId: category._id }).limit(5).toArray()

    // Get a sample product to see its categoryId format
    const sampleProduct = await productsCollection.findOne({})

    return NextResponse.json({
      category: {
        id: category._id.toString(),
        slug: category.slug,
        name: category.name
      },
      productsByObjectIdString: productsByObjectId.map(p => ({ name: p.name, categoryId: p.categoryId })),
      productsBySlug: productsBySlug.map(p => ({ name: p.name, categoryId: p.categoryId })),
      productsByRawId: productsByRawId.map(p => ({ name: p.name, categoryId: p.categoryId })),
      sampleProduct: sampleProduct ? {
        name: sampleProduct.name,
        categoryId: sampleProduct.categoryId,
        categoryIdType: typeof sampleProduct.categoryId
      } : null,
      totalProductsInDb: await productsCollection.countDocuments({})
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}