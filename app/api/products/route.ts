import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/services/productService"
import { getLocalizedProduct } from "@/lib/utils/translations"
import { startKeepWarm } from "@/lib/keep-warm"

// Start keeping MongoDB connection warm
if (process.env.NODE_ENV === 'production') {
  startKeepWarm()
}

// Use edge runtime for better performance
export const runtime = 'nodejs'
// Cache for 5 minutes on CDN, revalidate in background
export const revalidate = 300
// Enable dynamic caching
export const dynamic = 'force-cache'

// Mock data for designable products
const mockDesignableProducts = [
  {
    id: 'mock-1',
    _id: 'mock-1',
    name: 'Custom T-Shirt',
    description: 'Design your own t-shirt',
    image: 'https://via.placeholder.com/400x400?text=T-Shirt',
    frontImage: 'https://via.placeholder.com/400x400?text=T-Shirt',
    price: 199,
    designCostPerCm2: 0.5
  },
  {
    id: 'mock-2',
    _id: 'mock-2',
    name: 'Custom Mug',
    description: 'Design your own mug',
    image: 'https://via.placeholder.com/400x400?text=Mug',
    frontImage: 'https://via.placeholder.com/400x400?text=Mug',
    price: 99,
    designCostPerCm2: 0.3
  }
]

export async function GET(request: NextRequest) {
  console.log('[API /products] GET request received')
  try {
    const { searchParams } = new URL(request.url)

    // Pagination parameters - support fetching products in reasonable chunks
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 5000) // Max 5000 to avoid MongoDB memory issues
    const skip = (page - 1) * limit

    // Get locale parameter
    const locale = searchParams.get('locale') || 'en'

    // Filter parameters
    const categoryId = searchParams.get('categoryId')
    const subcategoryId = searchParams.get('subcategoryId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'featured'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const designableOnly = searchParams.get('designableOnly') === 'true'

    // TEMPORARY BYPASS: Return mock data for designable products
    if (designableOnly) {
      console.log('[API /products] ⚡ QUICK MODE: Returning mock designable products')
      return NextResponse.json({
        products: mockDesignableProducts,
        pagination: {
          page: 1,
          limit: mockDesignableProducts.length,
          total: mockDesignableProducts.length,
          totalPages: 1
        }
      })
    }
    
    // Build filter object
    const filter: any = {}
    if (categoryId) filter.categoryId = categoryId
    if (subcategoryId) filter.subcategoryId = subcategoryId
    if (search) filter.search = search
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }
    if (designableOnly) filter.designableOnly = true
    
    // Get fields to return (optimize payload)
    const fieldsParam = searchParams.get('fields')
    const fields = fieldsParam ? fieldsParam.split(',') : []
    
    // Get paginated products with total count
    console.log('[API /products] Calling ProductService.getPaginatedProducts with:', { filter, skip, limit, sortBy, fields })
    const result = await ProductService.getPaginatedProducts({
      filter,
      skip,
      limit,
      sortBy,
      fields
    })
    
    console.log('[API /products] Result from ProductService:', { 
      productCount: result.products.length, 
      total: result.total 
    })
    
    // Localize products if locale is provided
    const localizedProducts = result.products.map(product => 
      locale !== 'en' ? getLocalizedProduct(product, locale) : product
    )
    
    const response = {
      products: localizedProducts,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    }
    
    console.log('[API /products] Sending response with', response.products.length, 'products')
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[API /products POST] Creating product:', body.name)
    // Accept hasVariations and variations in the body
    const product = await ProductService.createProduct(body)
    console.log('[API /products POST] Product created with ID:', product.id)
    console.log('[API /products POST] Full product response:', { id: product.id, name: product.name })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
