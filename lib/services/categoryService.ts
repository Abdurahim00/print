import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Category, Subcategory } from "@/types"
import type { CategoryDocument, SubcategoryDocument } from "@/lib/models/Category"

const CATEGORIES = "categories"
const SUBCATEGORIES = "subcategories"

function toCategory(doc: CategoryDocument): Category {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    isActive: doc.isActive,
    isDesignable: doc.isDesignable || false,
    designableAreas: doc.designableAreas,
    designTechniques: doc.designTechniques,
    designUpchargePercent: doc.designUpchargePercent || 0,
    designUpchargePerCm2: doc.designUpchargePerCm2 || 0,
    useMetricPricing: doc.useMetricPricing || false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

function toSubcategory(doc: SubcategoryDocument): Subcategory {
  return {
    id: doc._id!.toString(),
    categoryId: typeof doc.categoryId === 'string' ? doc.categoryId : doc.categoryId.toString(),
    name: doc.name,
    swedishName: doc.swedishName,
    slug: doc.slug,
    isActive: doc.isActive,
    isDesignable: doc.isDesignable || false,
    inheritDesignSettings: doc.inheritDesignSettings || false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export async function createCategory(data: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
  const db = await getDatabase()
  const collection = db.collection<CategoryDocument>(CATEGORIES)
  // Uniqueness by slug
  const exists = await collection.findOne({ slug: data.slug })
  if (exists) {
    throw new Error("Category slug already exists")
  }
  const now = new Date()
  const doc: CategoryDocument = { ...data, createdAt: now, updatedAt: now }
  const res = await collection.insertOne(doc)
  const inserted = await collection.findOne({ _id: res.insertedId })
  return toCategory(inserted!)
}

export async function getCategories(): Promise<Category[]> {
  const db = await getDatabase()
  const collection = db.collection<CategoryDocument>(CATEGORIES)
  const docs = await collection.find({}).sort({ name: 1 }).toArray()
  return docs.map(toCategory)
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getDatabase()
  const collection = db.collection<CategoryDocument>(CATEGORIES)
  
  // Try to find by MongoDB ObjectId first
  let doc = null
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    doc = await collection.findOne({ _id: new ObjectId(id) })
  }
  
  // If not found, try to find by string id field
  if (!doc) {
    doc = await collection.findOne({ id: id } as any)
  }
  
  return doc ? toCategory(doc) : null
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
  const db = await getDatabase()
  const collection = db.collection<CategoryDocument>(CATEGORIES)
  if (data.slug) {
    const exists = await collection.findOne({ slug: data.slug, _id: { $ne: new ObjectId(id) } })
    if (exists) throw new Error("Category slug already exists")
  }
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" }
  )
  return result ? toCategory(result) : null
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await getDatabase()
  const categories = db.collection<CategoryDocument>(CATEGORIES)
  const subcategories = db.collection<SubcategoryDocument>(SUBCATEGORIES)
  await subcategories.deleteMany({
    $or: [
      { categoryId: id },
      { categoryId: new ObjectId(id) }
    ]
  })
  const res = await categories.deleteOne({ _id: new ObjectId(id) })
  return res.deletedCount === 1
}

export async function createSubcategory(data: Omit<Subcategory, "id" | "createdAt" | "updatedAt">): Promise<Subcategory> {
  const db = await getDatabase()
  const collection = db.collection<SubcategoryDocument>(SUBCATEGORIES)
  // Uniqueness by slug within category - handle both string and ObjectId
  const exists = await collection.findOne({
    slug: data.slug,
    $or: [
      { categoryId: data.categoryId },
      { categoryId: new ObjectId(data.categoryId) }
    ]
  })
  if (exists) throw new Error("Subcategory slug already exists in this category")
  const now = new Date()
  // Keep categoryId as string
  const doc: SubcategoryDocument = { ...data, categoryId: data.categoryId, createdAt: now, updatedAt: now } as any
  const res = await collection.insertOne(doc)
  const inserted = await collection.findOne({ _id: res.insertedId })
  return toSubcategory(inserted!)
}

export async function getSubcategories(categoryId?: string): Promise<Subcategory[]> {
  const db = await getDatabase()
  const collection = db.collection<SubcategoryDocument>(SUBCATEGORIES)
  let filter: any = {}

  if (categoryId) {
    // Simply use string matching since our subcategories store categoryId as string
    filter = { categoryId: categoryId }
  }

  const docs = await collection.find(filter).sort({ name: 1 }).toArray()
  return docs.map(toSubcategory)
}

export async function getSubcategoryById(id: string): Promise<Subcategory | null> {
  const db = await getDatabase()
  const collection = db.collection<SubcategoryDocument>(SUBCATEGORIES)
  
  // Try to find by MongoDB ObjectId first
  let doc = null
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    doc = await collection.findOne({ _id: new ObjectId(id) })
  }
  
  // If not found, try to find by string id field
  if (!doc) {
    doc = await collection.findOne({ id: id } as any)
  }
  
  return doc ? toSubcategory(doc) : null
}

export async function updateSubcategory(id: string, data: Partial<Subcategory>): Promise<Subcategory | null> {
  const db = await getDatabase()
  const collection = db.collection<SubcategoryDocument>(SUBCATEGORIES)
  const payload: any = { ...data }
  // Keep categoryId as string
  if (payload.slug) {
    const filter: any = { slug: payload.slug, _id: { $ne: new ObjectId(id) } }
    if (payload.categoryId) {
      filter.$or = [
        { categoryId: payload.categoryId },
        { categoryId: new ObjectId(payload.categoryId) }
      ]
    }
    const exists = await collection.findOne(filter)
    if (exists) throw new Error("Subcategory slug already exists")
  }
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...payload, updatedAt: new Date() } },
    { returnDocument: "after" }
  )
  return result ? toSubcategory(result) : null
}

export async function deleteSubcategory(id: string): Promise<boolean> {
  const db = await getDatabase()
  const collection = db.collection<SubcategoryDocument>(SUBCATEGORIES)
  const res = await collection.deleteOne({ _id: new ObjectId(id) })
  return res.deletedCount === 1
}

export async function getDesignableCategoryIds(): Promise<string[]> {
  const db = await getDatabase()
  const collection = db.collection<CategoryDocument>(CATEGORIES)
  const docs = await collection.find({ isDesignable: true }).toArray()
  return docs.map(doc => doc._id!.toString())
}

