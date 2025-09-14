"use client"

import { ProductsView } from "@/components/products/ProductsView"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get("category") || undefined
  const subcategorySlug = searchParams.get("subcategory") || undefined
  const collectionId = searchParams.get("collection") || undefined

  return <ProductsView
    categorySlug={categorySlug}
    subcategorySlug={subcategorySlug}
    collectionId={collectionId}
  />
}
