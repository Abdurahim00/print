import { getDatabase } from "@/lib/mongodb"
import type { ProductDocument, Product } from "@/lib/models/Product"
import { ObjectId } from "mongodb"

export class ProductService {
  private static async getCollection() {
    const db = await getDatabase()
    return db.collection<ProductDocument>("products")
  }

  static async createProduct(productData: Omit<ProductDocument, "_id" | "createdAt" | "updatedAt">): Promise<Product> {
    const collection = await this.getCollection()

    const newProduct: ProductDocument = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newProduct)

    return {
      id: result.insertedId.toString(),
      ...productData,
      hasVariations: productData.hasVariations,
      variations: productData.variations,
      type: productData.type,
      baseColor: productData.baseColor,
      angles: productData.angles,
      colors: productData.colors,
    }
  }

  static async getAllProducts(): Promise<Product[]> {
    const collection = await this.getCollection()
    const products = await collection.find({}).toArray()

    return products.map((product) => ({
      id: product._id!.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      categoryId: product.categoryId,
      description: product.description,
      inStock: product.inStock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      hasVariations: product.hasVariations,
      variations: product.variations,
      type: product.type,
      baseColor: product.baseColor,
      angles: product.angles,
      colors: product.colors,
    }))
  }

  static async getProductById(id: string): Promise<Product | null> {
    const collection = await this.getCollection()
    const product = await collection.findOne({ _id: new ObjectId(id) })

    if (!product) return null

    return {
      id: product._id!.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      categoryId: product.categoryId,
      description: product.description,
      inStock: product.inStock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      hasVariations: product.hasVariations,
      variations: product.variations,
      type: product.type,
      baseColor: product.baseColor,
      angles: product.angles,
      colors: product.colors,
    }
  }

  static async updateProduct(
    id: string,
    productData: Partial<Omit<ProductDocument, "createdAt">>,
  ): Promise<Product | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...productData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) return null

    return {
      id: result._id!.toString(),
      name: result.name,
      price: result.price,
      image: result.image,
      categoryId: result.categoryId,
      description: result.description,
      inStock: result.inStock,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      hasVariations: result.hasVariations,
      variations: result.variations,
      type: result.type,
      baseColor: result.baseColor,
      angles: result.angles,
      colors: result.colors,
    }
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
}
