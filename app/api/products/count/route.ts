import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/services/productService"

export const runtime = 'nodejs'
export const revalidate = 60

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
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
    if (designableOnly) filter.isDesignable = true
    
    // Get total count
    const total = await ProductService.getProductCount(filter)
    
    // Get counts by category if requested
    const includeCategoryCounts = searchParams.get('includeCategoryCounts') === 'true'
    let categoryCounts = {}
    
    if (includeCategoryCounts) {
      const categories = await ProductService.getCategoryCounts(filter)
      categoryCounts = categories
    }
    
    return NextResponse.json({
      total,
      categoryCounts,
      filter
    })
  } catch (error) {
    console.error("Error getting product count:", error)
    return NextResponse.json(
      { error: "Failed to get product count" },
      { status: 500 }
    )
  }
}