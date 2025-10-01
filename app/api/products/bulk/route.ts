import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/services/productService"

export const runtime = 'nodejs'
export const revalidate = 60

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get offset and limit for cursor-based pagination
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = Math.min(parseInt(searchParams.get('limit') || '500'), 1000) // Max 1000 per request
    
    // Filter parameters
    const categoryId = searchParams.get('categoryId')
    const subcategoryId = searchParams.get('subcategoryId')
    const search = searchParams.get('search')
    const designableOnly = searchParams.get('designableOnly') === 'true'
    
    // Build filter object
    const filter: any = {}
    if (categoryId) filter.categoryId = categoryId
    if (subcategoryId) filter.subcategoryId = subcategoryId
    if (search) filter.search = search
    if (designableOnly) filter.designableOnly = true
    
    // Get products with minimal fields for performance
    const result = await ProductService.getPaginatedProducts({
      filter,
      skip: offset,
      limit,
      sortBy: 'name', // Simple sort for consistency
      fields: ['name', 'price', 'image', 'categoryId', 'isDesignable', 'inStock']
    })
    
    return NextResponse.json({
      products: result.products,
      offset,
      limit,
      total: result.total,
      hasMore: offset + limit < result.total
    })
  } catch (error) {
    console.error("Error fetching bulk products:", error)
    return NextResponse.json(
      { error: "Failed to fetch bulk products" },
      { status: 500 }
    )
  }
}