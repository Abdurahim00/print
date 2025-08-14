"use client"

import { useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchFavorites, removeFromFavorites } from "@/lib/redux/slices/favoritesSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
import { Heart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchDesigns } from "@/lib/redux/slices/designsSlice"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { composeProductAndDesign } from "@/lib/utils/imageCompose"

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

  // Flattened list of favorites with product details
  const favoriteProducts = useMemo(() => {
    return favorites
      .map((f: any) => ({ fav: f, product: products.find((p: any) => p.id === f.productId) }))
      .filter((x: { fav: any; product: any }) => !!x.product)
  }, [favorites, products])

  if (!user?.id) return <div className="text-slate-500">Sign in to see favorites.</div>
  if (favoriteProducts.length === 0) return <div className="text-slate-500">No favorites yet.</div>

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
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" /> Favorites
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {(favoritesState.loading || productsLoading) && <GridSkeleton />}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map(({ fav, product }: { fav: any; product: any }) => (
              <Card key={fav.id} className="overflow-hidden hover:shadow-lg transition-all bg-white dark:bg-slate-900">
                <div className="relative w-full aspect-[4/3] bg-white">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="w-full h-full object-cover"
                    priority={false}
                  />
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
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      onClick={async () => {
                        try {
                          // If a design is applied to the category (via dashboard button), include design elements only
                          const appliedDesignId = fav.appliedDesignId
                          if (appliedDesignId) {
                            const applied = designs.find((d: any) => d.id === appliedDesignId)
                            // Use design-only overlay so we add the CURRENT product with just design elements
                            const overlay = applied?.designData?.canvasData 
                              || applied?.preview
                            // Sanitize context to avoid carrying source product variation/images
                            const baseState = applied?.designData?.selectedState || {}
                            const designContext: any = {
                              viewMode: "front",
                              productColor: undefined,
                              selectedVariation: null,
                              selectedTemplate: baseState?.selectedTemplate || null,
                            }
                            const designCanvasJSON = applied?.designData?.canvasJSON || null

                            // Compose product base with overlay for accurate preview in cart
                            let composed: string | undefined = undefined
                            try {
                              if (product?.image && overlay) {
                                composed = await composeProductAndDesign({
                                  productImageUrl: product.image,
                                  overlayImageUrl: overlay,
                                  targetWidth: 1000,
                                  overlayScale: applied?.designData?.overlay?.scale ?? 0.6,
                                })
                              }
                            } catch {}
                            dispatch({
                              type: 'cart/addToCartWithDesign',
                              payload: {
                                product,
                                quantity: 1,
                                designPreview: composed || overlay,
                                designId: appliedDesignId,
                                designContext,
                                designCanvasJSON,
                              }
                            })
                          } else {
                            dispatch(addToCart(product) as any)
                          }
                        } catch {
                          dispatch(addToCart(product) as any)
                        }
                      }}
                    >
                      Add to cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


