import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/services/productService"
import { getLocalizedProduct } from "@/lib/utils/translations"

// Use edge runtime for better performance
export const runtime = 'nodejs'
// Cache for 60 seconds on CDN, revalidate in background
export const revalidate = 60

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
    const categorySlug = searchParams.get('categorySlug')
    const subcategoryId = searchParams.get('subcategoryId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'featured'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const designableOnly = searchParams.get('designableOnly') === 'true'
    
    // Build filter object
    const filter: any = {}
    if (categoryId) filter.categoryId = categoryId
    if (categorySlug) filter.categorySlug = categorySlug
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
