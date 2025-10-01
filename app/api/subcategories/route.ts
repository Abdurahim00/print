import { NextRequest, NextResponse } from "next/server"
import { createSubcategory, getSubcategories } from "@/lib/services/categoryService"
import { getLocalizedSubcategory } from "@/lib/utils/translations"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined
    const locale = searchParams.get('locale') || 'en'
    
    const items = await getSubcategories(categoryId)
    
    // Localize subcategories if locale is provided
    const localizedItems = items.map(item => 
      locale !== 'en' ? getLocalizedSubcategory(item, locale) : item
    )
    
    return NextResponse.json(localizedItems)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const item = await createSubcategory(body)
    return NextResponse.json(item, { status: 201 })
  } catch (e: any) {
    const status = e.message?.includes("exists") ? 400 : 500
    return NextResponse.json({ error: e.message || "Failed to create subcategory" }, { status })
  }
}

