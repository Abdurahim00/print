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

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    toast({
      title: t.addedToCart,
      description: t.itemAddedToCart.replace("{productName}", product.name),
      variant: "success",
    })
  }

  const categoryName = productCategories.find((c) => c.id === product.categoryId)?.name(t) || product.categoryId

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover rounded-t-lg"
        />
        <button
          className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white p-2 shadow-sm border border-slate-200"
          onClick={async () => {
            if (!sessionUser?.id) {
              toast({ title: "Sign in required", description: "Please sign in to add favorites.", variant: "default" })
              return
            }
            try {
              const { addToFavorites, removeFromFavorites } = await import("@/lib/redux/slices/favoritesSlice")
              const isFav = favorites.some((f: any) => f.productId === product.id && f.userId === sessionUser.id)
              if (isFav) {
                // @ts-ignore
                await dispatch(removeFromFavorites({ userId: sessionUser.id, productId: product.id }))
                toast({ title: "Removed from favorites", description: product.name })
              } else {
                // @ts-ignore
                await dispatch(addToFavorites({ userId: sessionUser.id, productId: product.id, categoryId: product.categoryId }))
                toast({ title: "Added to favorites", description: product.name })
              }
            } catch (e) {
              toast({ title: "Failed", description: "Could not add to favorites" })
            }
          }}
          aria-label="Add to favorites"
        >
          {favorites.some((f: any) => f.productId === product.id && f.userId === sessionUser?.id) ? (
            <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />
          ) : (
            <Heart className="w-4 h-4 text-pink-600" />
          )}
        </button>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{product.name}</h3>
        <p className="text-sky-600 dark:text-sky-400 font-medium mt-1">{product.price.toFixed(2)} SEK</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{categoryName}</p>
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
