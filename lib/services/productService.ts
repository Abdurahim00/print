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
    console.log('[ProductService.getPaginatedProducts] Starting with options:', options)
    const collection = await this.getCollection()
    
    const { filter = {}, skip = 0, limit = 20, sortBy = 'featured', fields } = options
    
    // Debug logging
    console.log('[ProductService] Filter received:', JSON.stringify(filter, null, 2))
    
    // Build MongoDB query
    const query: any = {}
    
    // Category filter - products now have categoryId stored as strings
    if (filter.categoryId) {
      query.categoryId = filter.categoryId
    }
    
    // Subcategory filter - use string matching
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
    
    // Text search - use regex instead since we dropped text index
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } }
      ]
    }
    
    // Filter for designable products only
    if (filter.designableOnly) {
      const designableCategoryIds = await getDesignableCategoryIds()
      if (designableCategoryIds.length > 0) {
        // Use string IDs directly
        
        // Add category filter to existing query
        if (query.categoryId) {
          // If there's already a category filter, combine with AND
          query.$and = [
            { categoryId: query.categoryId },
            { categoryId: { $in: designableCategoryIds } }
          ]
        } else {
          query.categoryId = { $in: designableCategoryIds }
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
    
    // Execute query with all filters including category
    const [products, total] = await Promise.all([
      collection
        .find(query, { projection: Object.keys(projection).length === 0 ? undefined : projection })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .allowDiskUse(true)
        .toArray(),
      collection.countDocuments(query)
    ])
    
    console.log(`[ProductService] Query results: ${products.length} products found, ${total} total`)
    console.log('[ProductService] First product:', products[0] ? { name: products[0].name, id: products[0]._id } : 'No products')
    
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
      imageUrl: product.imageUrl || (product.images && product.images[0]) || product.image,
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
      isDesignable: product.isDesignable,
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
    console.log('[ProductService.getProductById] Looking for product with ID:', id)
    const collection = await this.getCollection()
    
    // Try to find by MongoDB ObjectId first if it's a valid ObjectId format
    let product = null
    
    // Check if the ID is exactly 24 hex characters (valid MongoDB ObjectId)
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('[ProductService.getProductById] ID looks like ObjectId, trying ObjectId query')
      try {
        product = await collection.findOne({ _id: new ObjectId(id) })
        if (product) {
          console.log('[ProductService.getProductById] Found product by ObjectId:', product.name)
        }
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
      isDesignable: product.isDesignable,
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
      baseMatch.$or = [
        { name: { $regex: baseFilter.search, $options: 'i' } },
        { description: { $regex: baseFilter.search, $options: 'i' } }
      ]
    }
    if (baseFilter.price) {
      baseMatch.price = baseFilter.price
    }
    
    // Use MongoDB aggregation for efficient counting
    const pipeline = [
      { $match: baseMatch },
      {
        $group: {
          _id: "$categoryId",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          categoryId: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]
    
    const result = await collection.aggregate(pipeline).toArray()
    return result
  }
}
