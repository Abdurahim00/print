"use client"

import type { Product } from "@/types"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { translations, productCategories } from "@/lib/constants"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useMemo } from "react"
import { composeProductAndDesign } from "@/lib/utils/imageCompose"
import { formatSEK } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const { language } = useAppSelector((state) => state.app)
  const sessionUser = useAppSelector((state) => (state as any).auth.user)
  const favorites = useAppSelector((s: any) => s.favorites.items)
  const { toast } = useToast()
  const t = translations[language]
  const favoritesState = useAppSelector((s: any) => s.favorites)
  const appliedCategoryDesigns = useAppSelector((s: any) => s.app.appliedCategoryDesigns || {})
  const designs = useAppSelector((s: any) => s.designs.items)
  const activeCoupon = useAppSelector((s: any) => s.coupons.activeCoupon)
  const allCategories = useAppSelector((s: any) => s.categories.categories)

  const handleAddToCart = async () => {
    // If a category-level design is applied, carry the design preview and id forward
    if (appliedDesignForCategory) {
      const overlay = appliedDesignForCategory.designData?.canvasData 
        || appliedDesignForCategory.preview
      const designId = appliedDesignForCategory.id
      const baseState = appliedDesignForCategory.designData?.selectedState || {}
      const designContext: any = {
        viewMode: "front",
        productColor: undefined,
        selectedVariation: null,
        selectedTemplate: baseState?.selectedTemplate || null,
      }
      const designCanvasJSON = appliedDesignForCategory.designData?.canvasJSON || null

      // Compose product image + overlay so cart shows final mockup
      let composed: string | undefined = undefined
      try {
        const productImageUrl = product.image
        if (productImageUrl && overlay) {
          composed = await composeProductAndDesign({
            productImageUrl,
            overlayImageUrl: overlay,
            targetWidth: 1000,
            overlayScale: appliedDesignForCategory?.designData?.overlay?.scale ?? 0.6,
          })
        }
      } catch {}

      dispatch({
        type: 'cart/addToCartWithDesign',
        payload: {
          product,
          quantity: 1,
          designPreview: composed || overlay,
          designId,
          designContext,
          designCanvasJSON,
        }
      })
    } else {
      dispatch(addToCart(product))
    }
    toast({
      title: t.addedToCart,
      description: t.itemAddedToCart.replace("{productName}", product.name),
      variant: "success",
    })
  }

  const categoryName = useMemo(() => {
    const fromStore = (allCategories || []).find((c: any) => c.id === product.categoryId)
    if (fromStore?.name) return fromStore.name
    const fromConstants = productCategories.find((c) => c.id === product.categoryId)?.name(t)
    return fromConstants || product.categoryId
  }, [allCategories, product.categoryId, t])

  // Resolve category-level applied design (set by "Preview on other products" from designs tab)
  const appliedDesignForCategory = useMemo(() => {
    // Prefer global app mapping if set for immediate UI response
    const mappedId = appliedCategoryDesigns[product.categoryId]
    if (mappedId) {
      return designs.find((d: any) => d.id === mappedId) || null
    }
    // Fallback to favorites-derived applied design
    const favWithApplied = favoritesState.items.find(
      (f: any) => f.userId === sessionUser?.id && f.categoryId === product.categoryId && f.appliedDesignId,
    )
    if (!favWithApplied?.appliedDesignId) return null
    return designs.find((d: any) => d.id === favWithApplied.appliedDesignId) || null
  }, [appliedCategoryDesigns, favoritesState.items, product.categoryId, sessionUser?.id, designs])

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover rounded-t-lg"
        />
        {appliedDesignForCategory && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent z-10" />
            {(() => {
              const overlaySrc = appliedDesignForCategory?.designData?.canvasData || appliedDesignForCategory?.preview
              const overlayScale = appliedDesignForCategory?.designData?.overlay?.scale ?? 0.6
              return (
                <img
                  src={overlaySrc || "/placeholder.svg"}
                  alt="Applied design overlay"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 object-contain"
                  style={{
                    width: `${overlayScale * 100}%`,
                    height: "auto",
                    filter: "saturate(1.05)",
                    mixBlendMode: "normal",
                  }}
                />
              )
            })()}
          </>
        )}
        <button
          className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white p-2 shadow-sm border border-slate-200 z-[999]"
          onClick={async () => {
            if (!sessionUser?.id) {
              toast({ title: "Sign in required", description: "Please sign in to add favorites.", variant: "default" })
              return
            }
            try {
              const { addToFavorites, removeFromFavorites, applyDesignToFavorites, setDesignForFavoriteThunk } = await import("@/lib/redux/slices/favoritesSlice")
              const isFav = favorites.some((f: any) => f.productId === product.id && f.userId === sessionUser.id)
              if (isFav) {
                // @ts-ignore
                await dispatch(removeFromFavorites({ userId: sessionUser.id, productId: product.id }))
                toast({ title: "Removed from favorites", description: product.name })
              } else {
                // If a design is applied, compose a preview and store it with the favorite
                let preview: string | null = null
                if (appliedDesignForCategory) {
                  const overlay = appliedDesignForCategory.designData?.canvasData || appliedDesignForCategory.preview
                  try {
                    if (product.image && overlay) {
                      preview = await composeProductAndDesign({
                        productImageUrl: product.image,
                        overlayImageUrl: overlay,
                        targetWidth: 1000,
                        overlayScale: appliedDesignForCategory?.designData?.overlay?.scale ?? 0.6,
                      })
                    }
                  } catch {}
                }
                // @ts-ignore
                const addResult = await dispatch(addToFavorites({ userId: sessionUser.id, productId: product.id, categoryId: product.categoryId, preview }))
                // If this category has an applied design, explicitly attach it to this new favorite for complete payload
                if (appliedDesignForCategory?.id) {
                  // @ts-ignore
                  await dispatch(setDesignForFavoriteThunk({ userId: sessionUser.id, productId: product.id, designId: appliedDesignForCategory.id }))
                }
                toast({ title: "Added to favorites", description: product.name })
              }
            } catch (e) {
              toast({ title: "Failed", description: "Could not add to favorites" })
            }
          }}
          aria-label="Add to favorites"
        >
          {favorites.some((f: any) => f.productId === product.id && f.userId === sessionUser?.id) ? (
            <Heart className="w-4 h-4 text-pink-600 fill-pink-600" style={{ zIndex: 999 }} />
          ) : (
            <Heart className="w-4 h-4 text-pink-600" style={{ zIndex: 999 }} />
          )}
        </button>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{product.name}</h3>
        {activeCoupon && activeCoupon.discountType === "percentage" && product.eligibleForCoupons ? (
          <div className="mt-1">
            <span className="text-purple-700 dark:text-purple-300 font-bold mr-2">
              {formatSEK(product.price * (1 - activeCoupon.discountValue / 100))}
            </span>
            <span className="text-slate-400 line-through">{formatSEK(product.price)}</span>
          </div>
        ) : (
          <p className="text-sky-600 dark:text-sky-400 font-medium mt-1">{formatSEK(product.price)}</p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{categoryName}</p>
        {/* Optional: show product id only for debug; comment out to hide */}
        {product.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 flex-grow">{product.description}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t dark:border-slate-700">
        <Button
          className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-md"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? t.addToCart : t.outOfStock}
        </Button>
      </CardFooter>
    </Card>
  )
}
