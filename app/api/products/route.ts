import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/services/productService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    // Filter parameters
    const categoryId = searchParams.get('categoryId')
    const subcategoryId = searchParams.get('subcategoryId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'featured'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const designableOnly = searchParams.get('designableOnly') === 'true'
    
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
    const result = await ProductService.getPaginatedProducts({
      filter,
      skip,
      limit,
      sortBy,
      fields
    })
    
    return NextResponse.json({
      products: result.products,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    })
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
    // Accept hasVariations and variations in the body
    const product = await ProductService.createProduct(body)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
