import { getDatabase } from "@/lib/mongodb"
import type { ProductDocument, Product } from "@/lib/models/Product"
import { ObjectId } from "mongodb"

export class ProductService {
  private static async getCollection() {
    const db = await getDatabase()
    const collection = db.collection<ProductDocument>("products")
    
    // Ensure indexes are created for optimal performance
    await this.ensureIndexes(collection)
    
    return collection
  }
  
  private static async ensureIndexes(collection: any) {
    try {
      // Create compound indexes for common queries
      await collection.createIndex({ categoryId: 1, inStock: -1, featured: -1 })
      await collection.createIndex({ subcategoryId: 1, inStock: -1, featured: -1 })
      await collection.createIndex({ name: "text", description: "text" })
      await collection.createIndex({ price: 1 })
      await collection.createIndex({ createdAt: -1 })
      await collection.createIndex({ featured: -1, createdAt: -1 })
      await collection.createIndex({ inStock: -1, featured: -1 })
      
      // Individual indexes for frequent filters
      await collection.createIndex({ categoryId: 1 })
      await collection.createIndex({ subcategoryId: 1 })
      await collection.createIndex({ tags: 1 })
      await collection.createIndex({ brand: 1 })
      await collection.createIndex({ source: 1 })
    } catch (error) {
      // Indexes may already exist, which is fine
      console.log("Index creation info:", error)
    }
  }

  static async createProduct(productData: Omit<ProductDocument, "_id" | "createdAt" | "updatedAt">): Promise<Product> {
    const collection = await this.getCollection()

    // Debug: Log what's being received for individual angle images
    console.log('🔧 [ProductService] Creating product with data:', {
      name: productData.name,
      hasVariations: productData.hasVariations,
      angles: productData.angles,
      individualImages: {
        frontImage: productData.frontImage,
        backImage: productData.backImage,
        leftImage: productData.leftImage,
        rightImage: productData.rightImage,
        materialImage: productData.materialImage
      },
      allKeys: Object.keys(productData)
    })

    const newProduct: ProductDocument = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newProduct)

    // Debug: Log what was actually stored
    console.log('🔧 [ProductService] Product created with ID:', result.insertedId.toString())

    return {
      id: result.insertedId.toString(),
      ...productData,
      hasVariations: productData.hasVariations,
      variations: productData.variations,
      eligibleForCoupons: productData.eligibleForCoupons,
      type: productData.type,
      baseColor: productData.baseColor,
      angles: productData.angles,
      colors: productData.colors,
      purchaseLimit: productData.purchaseLimit, // Add purchase limit data
      // Include individual angle images for single products
      frontImage: productData.frontImage,
      backImage: productData.backImage,
      leftImage: productData.leftImage,
      rightImage: productData.rightImage,
      materialImage: productData.materialImage,
      frontAltText: productData.frontAltText,
      backAltText: productData.backAltText,
      leftAltText: productData.leftAltText,
      rightAltText: productData.rightAltText,
      materialAltText: productData.materialAltText,
    }
  }

  static async getPaginatedProducts(options: {
    filter?: any
    skip?: number
    limit?: number
    sortBy?: string
  }): Promise<{ products: Product[], total: number }> {
    const collection = await this.getCollection()
    
    const { filter = {}, skip = 0, limit = 20, sortBy = 'featured' } = options
    
    // Build MongoDB query
    const query: any = {}
    
    // Category filter
    if (filter.categoryId) {
      query.categoryId = filter.categoryId
    }
    
    // Subcategory filter
    if (filter.subcategoryId) {
      query.$or = [
        { subcategoryId: filter.subcategoryId },
        { subcategoryIds: filter.subcategoryId }
      ]
    }
    
    // Price range filter
    if (filter.price) {
      query.price = filter.price
    }
    
    // Text search
    if (filter.search) {
      query.$text = { $search: filter.search }
    }
    
    // Sort options
    let sort: any = {}
    switch (sortBy) {
      case 'price-asc':
        sort = { price: 1 }
        break
      case 'price-desc':
        sort = { price: -1 }
        break
      case 'newest':
        sort = { createdAt: -1 }
        break
      case 'featured':
      default:
        sort = { featured: -1, inStock: -1, createdAt: -1 }
        break
    }
    
    // Execute queries in parallel for better performance
    const [products, total] = await Promise.all([
      collection
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ])
    
    return {
      products: products.map((product) => this.mapProductToResponse(product)),
      total
    }
  }
  
  private static mapProductToResponse(product: ProductDocument): Product {
    return {
      _id: product._id!.toString(),
      id: product._id!.toString(),
      name: product.name,
      price: product.price || product.basePrice,
      basePrice: product.basePrice || product.price,
      image: product.image,
      images: product.images,
      categoryId: product.categoryId,
      subcategoryIds: product.subcategoryIds,
      subcategoryId: product.subcategoryId,
      description: product.description,
      inStock: product.inStock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      hasVariations: product.hasVariations,
      variations: product.variations,
      variants: product.variants,
      eligibleForCoupons: product.eligibleForCoupons,
      type: product.type,
      baseColor: product.baseColor,
      angles: product.angles,
      colors: product.colors,
      sizes: product.sizes,
      sizePrices: product.sizePrices,
      sku: product.sku,
      brand: product.brand,
      featured: product.featured,
      isActive: product.isActive,
      tags: product.tags,
      specifications: product.specifications,
      source: product.source,
      originalData: product.originalData,
      purchaseLimit: product.purchaseLimit,
      frontImage: product.frontImage,
      backImage: product.backImage,
      leftImage: product.leftImage,
      rightImage: product.rightImage,
      materialImage: product.materialImage,
      frontAltText: product.frontAltText,
      backAltText: product.backAltText,
      leftAltText: product.leftAltText,
      rightAltText: product.rightAltText,
      materialAltText: product.materialAltText
    }
  }

  static async getAllProducts(): Promise<Product[]> {
    const collection = await this.getCollection()
    const products = await collection.find({}).toArray()

    return products.map((product) => this.mapProductToResponse(product))
  }

  static async getProductById(id: string): Promise<Product | null> {
    const collection = await this.getCollection()
    
    // Try to find by MongoDB ObjectId first if it's a valid ObjectId format
    let product = null
    
    // Check if the ID is a valid MongoDB ObjectId (24 hex characters)
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      product = await collection.findOne({ _id: new ObjectId(id) })
    }
    
    // If not found or not a valid ObjectId, try to find by string id field
    if (!product) {
      product = await collection.findOne({ id: id })
    }
    
    // If still not found, try to find by numeric id
    if (!product && !isNaN(Number(id))) {
      product = await collection.findOne({ id: Number(id) })
    }

    if (!product) return null

    // Debug: Log what's actually in the database
    console.log('🔍 [ProductService] Raw database product:', {
      id: product._id?.toString(),
      name: product.name,
      hasPurchaseLimit: !!product.purchaseLimit,
      purchaseLimit: product.purchaseLimit,
      purchaseLimitKeys: product.purchaseLimit ? Object.keys(product.purchaseLimit) : [],
      allKeys: Object.keys(product),
      // Debug individual angle images
      individualImages: {
        frontImage: product.frontImage,
        backImage: product.backImage,
        leftImage: product.leftImage,
        rightImage: product.rightImage,
        materialImage: product.materialImage
      },
      angles: product.angles,
      hasVariations: product.hasVariations
    })

    return {
      _id: product._id!.toString(),
      id: product._id!.toString(),
      name: product.name,
      price: product.price || product.basePrice,
      basePrice: product.basePrice || product.price,
      image: product.image,
      images: product.images,
      categoryId: product.categoryId,
      subcategoryIds: product.subcategoryIds,
      description: product.description,
      inStock: product.inStock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      hasVariations: product.hasVariations,
      variations: product.variations,
      eligibleForCoupons: product.eligibleForCoupons,
      type: product.type,
      baseColor: product.baseColor,
      angles: product.angles,
      colors: product.colors,
      purchaseLimit: product.purchaseLimit, // Add purchase limit data
      // Include individual angle images for single products
      frontImage: product.frontImage,
      backImage: product.backImage,
      leftImage: product.leftImage,
      rightImage: product.rightImage,
      materialImage: product.materialImage,
      frontAltText: product.frontAltText,
      backAltText: product.backAltText,
      leftAltText: product.leftAltText,
      rightAltText: product.rightAltText,
      materialAltText: product.materialAltText,
      // Add missing fields for Prendo products
      subcategoryId: product.subcategoryId,
      sizes: product.sizes,
      sizePrices: product.sizePrices,
      sku: product.sku,
      brand: product.brand,
      featured: product.featured,
      isActive: product.isActive,
      tags: product.tags,
      specifications: product.specifications,
      source: product.source,
      originalData: product.originalData,
      variants: product.variants
    }
  }

  static async updateProduct(
    id: string,
    productData: Partial<Omit<ProductDocument, "createdAt" | "_id">>,
  ): Promise<Product | null> {
    const collection = await this.getCollection()

    const res = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...productData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    const result = (res as any)?.value ?? (res as any) // support driver variations
    if (!result) return null

    return this.mapProductToResponse(result)
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
}
