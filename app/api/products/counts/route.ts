import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/services/productService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get filter parameters
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    
    // Build base filter
    const baseFilter: any = {}
    if (search) baseFilter.search = search
    if (minPrice || maxPrice) {
      baseFilter.price = {}
      if (minPrice) baseFilter.price.$gte = parseFloat(minPrice)
      if (maxPrice) baseFilter.price.$lte = parseFloat(maxPrice)
    }
    
    // Get category and subcategory counts
    const counts = await ProductService.getCategoryCounts(baseFilter)
    
    return NextResponse.json(counts)
  } catch (error) {
    console.error("Error fetching product counts:", error)
    return NextResponse.json(
      { error: "Failed to fetch product counts" },
      { status: 500 }
    )
  }
}