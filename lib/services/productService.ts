import { getDatabase } from "@/lib/mongodb"
import type { ProductDocument, Product } from "@/lib/models/Product"
import { ObjectId } from "mongodb"
import { getDesignableCategoryIds } from "@/lib/services/categoryService"

export class ProductService {
  private static indexesCreated = false
  
  private static async getCollection() {
    const db = await getDatabase()
    const collection = db.collection<ProductDocument>("products")
    
    // Only ensure indexes once per application lifecycle
    if (!this.indexesCreated) {
      await this.ensureIndexes(collection)
      this.indexesCreated = true
    }
    
    return collection
  }
  
  private static async ensureIndexes(collection: any) {
    try {
      // Check for existing text index first
      const indexes = await collection.indexes()
      const hasTextIndex = indexes.some((index: any) => 
        index.key && (index.key._fts === 'text' || index.key.name === 'text' || index.key.description === 'text')
      )
      
      // Create compound indexes for common queries
      await collection.createIndex({ categoryId: 1, inStock: -1, featured: -1 })
      await collection.createIndex({ subcategoryId: 1, inStock: -1, featured: -1 })
      
      // Only create text index if it doesn't exist
      if (!hasTextIndex) {
        try {
          await collection.createIndex(
            { name: "text", description: "text" }, 
            { 
              name: "product_search_index",
              weights: { name: 10, description: 5 }
            }
          )
        } catch (textError: any) {
          // If there's still an error, it's likely a conflicting text index exists
          // We'll just continue without creating a new one
          console.log("Text index already exists or cannot be created:", textError.codeName)
        }
      }
      
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
    } catch (error: any) {
      // Only log errors that aren't index conflicts
      if (error.codeName !== 'IndexOptionsConflict') {
        console.log("Index creation error:", error.message)
      }
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
    fields?: string[]
  }): Promise<{ products: Product[], total: number }> {
    const collection = await this.getCollection()
    
    const { filter = {}, skip = 0, limit = 20, sortBy = 'featured', fields } = options
    
    // Debug logging
    console.log('[ProductService] Filter received:', JSON.stringify(filter, null, 2))
    
    // Build MongoDB query
    const query: any = {}
    
    // Category filter - convert to ObjectId if valid
    if (filter.categoryId) {
      // Check if it's a valid ObjectId string and convert it
      if (ObjectId.isValid(filter.categoryId)) {
        query.categoryId = new ObjectId(filter.categoryId)
      } else {
        query.categoryId = filter.categoryId
      }
    }
    
    // Subcategory filter - convert to ObjectId if valid
    if (filter.subcategoryId) {
      if (ObjectId.isValid(filter.subcategoryId)) {
        const oid = new ObjectId(filter.subcategoryId)
        query.$or = [
          { subcategoryId: oid },
          { subcategoryIds: oid }
        ]
      } else {
        query.$or = [
          { subcategoryId: filter.subcategoryId },
          { subcategoryIds: filter.subcategoryId }
        ]
      }
    }
    
    // Price range filter
    if (filter.price) {
      query.price = filter.price
    }
    
    // Text search
    if (filter.search) {
      query.$text = { $search: filter.search }
    }
    
    // Filter for designable products only
    if (filter.designableOnly) {
      const designableCategoryIds = await getDesignableCategoryIds()
      if (designableCategoryIds.length > 0) {
        // Convert string IDs to ObjectIds
        const designableObjectIds = designableCategoryIds.map(id => new ObjectId(id))
        
        // Add category filter to existing query
        if (query.categoryId) {
          // If there's already a category filter, combine with AND
          query.$and = [
            { categoryId: query.categoryId },
            { categoryId: { $in: designableObjectIds } }
          ]
        } else {
          query.categoryId = { $in: designableObjectIds }
        }
      } else {
        // No designable categories found, return empty result
        return { products: [], total: 0 }
      }
    }
    
    // Debug query
    console.log('[ProductService] MongoDB query:', JSON.stringify(query, null, 2))
    
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
    
    // Build projection for selected fields (optimize payload)
    const projection: any = {}
    if (fields && fields.length > 0) {
      fields.forEach(field => {
        projection[field] = 1
      })
      // Always include _id
      projection._id = 1
    }
    
    // Execute queries in parallel for better performance
    const [products, total] = await Promise.all([
      collection
        .find(query, { projection: projection.length === 0 ? undefined : projection })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .allowDiskUse(true) // Allow disk use for large sorts
        .toArray(),
      collection.countDocuments(query)
    ])
    
    console.log(`[ProductService] Query results: ${products.length} products found, ${total} total`)
    
    // Debug: Check data types in DB
    if (filter.categoryId && products.length === 0) {
      const sampleProduct = await collection.findOne({})
      if (sampleProduct) {
        console.log('[ProductService] Sample product categoryId:', sampleProduct.categoryId, 'Type:', typeof sampleProduct.categoryId)
        console.log('[ProductService] Filter categoryId:', filter.categoryId, 'Type:', typeof filter.categoryId)
      }
    }
    
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
      categoryId: product.categoryId ? product.categoryId.toString() : product.categoryId,
      subcategoryIds: product.subcategoryIds,
      subcategoryId: product.subcategoryId ? product.subcategoryId.toString() : product.subcategoryId,
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
    
    // Check if the ID is exactly 24 hex characters (valid MongoDB ObjectId)
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      try {
        product = await collection.findOne({ _id: new ObjectId(id) })
      } catch (error) {
        console.log('Invalid ObjectId format:', id)
      }
    }
    
    // If not found, try to find by string id field
    if (!product) {
      product = await collection.findOne({ id: id })
    }
    
    // Also try to find by _id as string (some databases store ObjectId as string)
    if (!product) {
      product = await collection.findOne({ _id: id } as any)
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
      categoryId: product.categoryId ? product.categoryId.toString() : product.categoryId,
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
      subcategoryId: product.subcategoryId ? product.subcategoryId.toString() : product.subcategoryId,
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

  static async getCategoryCounts(baseFilter: any = {}): Promise<{ categoryId: string; count: number; subcategories?: { subcategoryId: string; count: number }[] }[]> {
    const collection = await this.getCollection()
    
    // Build the base match condition
    const baseMatch: any = {}
    if (baseFilter.search) {
      baseMatch.$text = { $search: baseFilter.search }
    }
    if (baseFilter.price) {
      baseMatch.price = baseFilter.price
    }
    
    // Get category counts
    const categoryCounts = await collection.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } }
    ]).toArray()
    
    // Get subcategory counts for each category
    const result = []
    for (const catCount of categoryCounts) {
      if (!catCount._id) continue
      
      const subcategoryCounts = await collection.aggregate([
        { $match: { ...baseMatch, categoryId: catCount._id } },
        { $unwind: "$subcategoryIds" },
        { $group: { _id: "$subcategoryIds", count: { $sum: 1 } } },
        { $match: { _id: { $ne: null } } }
      ]).toArray()
      
      result.push({
        categoryId: catCount._id,
        count: catCount.count,
        subcategories: subcategoryCounts.map(sub => ({
          subcategoryId: sub._id,
          count: sub.count
        }))
      })
    }
    
    return result
  }
}
