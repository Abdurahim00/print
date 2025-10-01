import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const productsCollection = db.collection('products')

    // Get 5 sample products to see their structure
    const sampleProducts = await productsCollection.find({}).limit(5).toArray()

    // Get unique field names from first 100 products
    const products100 = await productsCollection.find({}).limit(100).toArray()
    const allFields = new Set<string>()
    products100.forEach(product => {
      Object.keys(product).forEach(key => allFields.add(key))
    })

    // Check what category-related fields exist
    const categoryFields = Array.from(allFields).filter(field =>
      field.toLowerCase().includes('categ')
    )

    // Get sample values for category-related fields
    const categoryFieldSamples: any = {}
    for (const field of categoryFields) {
      const samples = await productsCollection
        .find({ [field]: { $exists: true, $ne: null } })
        .limit(3)
        .project({ [field]: 1 })
        .toArray()
      categoryFieldSamples[field] = samples.map(s => s[field])
    }

    // Count products with different category fields
    const counts: any = {}
    counts.withCategoryId = await productsCollection.countDocuments({ categoryId: { $exists: true } })
    counts.withCategory = await productsCollection.countDocuments({ category: { $exists: true } })
    counts.withCategorySlug = await productsCollection.countDocuments({ categorySlug: { $exists: true } })
    counts.withCategories = await productsCollection.countDocuments({ categories: { $exists: true } })
    counts.total = await productsCollection.countDocuments({})

    return NextResponse.json({
      sampleProduct: sampleProducts[0] ? {
        _id: sampleProducts[0]._id,
        name: sampleProducts[0].name,
        categoryId: sampleProducts[0].categoryId,
        category: sampleProducts[0].category,
        categorySlug: sampleProducts[0].categorySlug,
        categories: sampleProducts[0].categories,
        subcategoryId: sampleProducts[0].subcategoryId,
        subcategory: sampleProducts[0].subcategory,
        allFields: Object.keys(sampleProducts[0])
      } : null,
      categoryFields,
      categoryFieldSamples,
      counts,
      first5Products: sampleProducts.map(p => ({
        name: p.name,
        categoryId: p.categoryId,
        category: p.category,
        categorySlug: p.categorySlug,
        categories: p.categories
      }))
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}