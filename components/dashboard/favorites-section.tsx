"use client"

import { useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchFavorites, applyDesignToFavorites } from "@/lib/redux/slices/favoritesSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
import { Badge } from "@/components/ui/badge"
import { Tag, Heart } from "lucide-react"
import { setDesignForFavoriteThunk, removeFromFavorites } from "@/lib/redux/slices/favoritesSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchDesigns } from "@/lib/redux/slices/designsSlice"

export function FavoritesSection() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => (s as any).auth.user)
  const favoritesState = useAppSelector((s: any) => s.favorites)
  const favorites = favoritesState.items
  const products = useAppSelector((s: any) => s.products.items)
  const productsLoading = useAppSelector((s: any) => s.products.loading)
  const categories = useAppSelector((s: any) => s.categories.categories)
  const designs = useAppSelector((s: any) => s.designs.items)

  useEffect(() => {
    if (user?.id) {
      console.log("🔥 [FavoritesSection] fetching favorites & designs for user", user.id)
      dispatch(fetchFavorites(user.id) as any)
      dispatch(fetchDesigns(user.id) as any)
    }
    if (!categories?.length) dispatch(fetchCategories() as any)
    // Ensure products are loaded so we can resolve product details for favorites
    dispatch(fetchProducts() as any)
  }, [user?.id, dispatch, categories?.length])

  // Group favorites by categoryId
  const grouped = useMemo(() => {
    const m: Record<string, any[]> = {}
    favorites.forEach((f: any) => {
      if (!m[f.categoryId]) m[f.categoryId] = []
      const product = products.find((p: any) => p.id === f.productId)
      if (product) m[f.categoryId].push({ fav: f, product })
    })
    return m
  }, [favorites, products])

  const categoryIds = Object.keys(grouped)

  if (!user?.id) return <div className="text-slate-500">Sign in to see favorites.</div>
  if (categoryIds.length === 0) return <div className="text-slate-500">No favorites yet.</div>

  const GridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="w-full aspect-[4/3]" />
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-3">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-8">
      {categoryIds.map((catId) => (
        <Card key={catId} className="shadow-lg border-0 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10 dark:border-primary/20 bg-primary/5 dark:bg-primary/10">
            <CardTitle className="flex items-center gap-2 text-primary dark:text-primary/90">
              <Heart className="h-5 w-5 text-primary" />
              {categories.find((c: any) => c.id === catId)?.name || catId}
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Category
              </Badge>
              <Button variant="outline" size="sm" onClick={() => {
                console.log("🔥 [FavoritesSection] remove applied design for category (optimistic)", { categoryId: catId })
                dispatch(applyDesignToFavorites({ userId: user.id, categoryId: catId, designId: undefined }) as any)
              }}>Remove Applied Design</Button>
              <Link href="/design-tool" className="text-sm underline">Open Design Tool</Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {(favoritesState.loading || productsLoading) && <GridSkeleton />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {grouped[catId].map(({ fav, product }) => {
                const appliedDesign = fav.appliedDesignId ? designs.find((d: any) => d.id === fav.appliedDesignId) : null
                return (
                  <Card
                    key={fav.id}
                    className="overflow-hidden hover:shadow-lg transition-all border-primary/10 dark:border-primary/20 group bg-white dark:bg-slate-900"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors z-0"></div>
                      <div className="relative w-full aspect-[4/3] bg-white">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="w-full h-full object-cover z-10 relative"
                          priority={false}
                        />
                        {appliedDesign ? (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-10" />
                            {(() => {
                              const overlaySrc = appliedDesign?.designData?.canvasData || appliedDesign?.preview
                              const overlayScale = appliedDesign?.designData?.overlay?.scale ?? 0.6
                              console.log("🔥 [FavoritesSection] Rendering applied design overlay", { designId: appliedDesign?.id, overlayScale, hasCanvasData: !!appliedDesign?.designData?.canvasData })
                              return (
                                <img
                                  src={overlaySrc || "/placeholder.svg"}
                                  alt="Applied design overlay"
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 object-contain"
                                  style={{
                                    width: `${overlayScale * 100}%`,
                                    height: "auto",
                                    filter: "saturate(1.05)",
                                    mixBlendMode: "multiply",
                                  }}
                                />
                              )
                            })()}
                            <Badge className="absolute top-3 right-3 z-30 bg-green-600/90 text-white border-transparent">Applied</Badge>
                          </>
                        ) : (
                          <Badge className="absolute top-3 right-3 z-30 bg-slate-50 text-slate-700 border-slate-200">No design</Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-base mb-1 text-slate-900 dark:text-white truncate">{product.name}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">#{product.id.slice(-6)}</p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600 border-red-200 transition-colors"
                          onClick={() => dispatch(removeFromFavorites({ userId: user.id, productId: product.id }) as any)}
                        >
                          Remove
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:hover:bg-amber-900/20 text-amber-600 border-amber-200 transition-colors"
                          onClick={() => dispatch(setDesignForFavoriteThunk({ userId: user.id, productId: product.id, designId: null }) as any)}
                        >
                          Remove design
                        </Button>
                      </div>
                      <Button asChild size="sm" className="mt-3 w-full bg-primary hover:bg-primary/90 text-white">
                        <Link href={`/design-tool?productId=${product.id}${fav.appliedDesignId ? `&designId=${fav.appliedDesignId}` : ''}`}>Customize</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


