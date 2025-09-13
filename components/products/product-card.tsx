"use client"

import type { Product } from "@/types"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { translations, productCategories } from "@/lib/constants"
import { getProductImage, getAllProductImages } from "@/lib/utils/product-image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/ui/product-image"
import { Palette, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, memo, useState, useEffect, useCallback } from "react"
import { composeProductAndDesign } from "@/lib/utils/imageCompose"
import { useCurrency } from "@/contexts/CurrencyContext"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { useToast } from "@/hooks/use-toast"
import { SizeSelectionModal } from "./size-selection-modal"
import { QuantityModal } from "./quantity-modal"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"

interface ProductCardProps {
  product: Product
}

function ProductCardComponent({ product }: ProductCardProps) {
  const { formatPrice } = useCurrency()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [sizeModalOpen, setSizeModalOpen] = useState(false)
  const [quantityModalOpen, setQuantityModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]
  
  // Debug logging
  console.log('[ProductCard] Product:', { id: product.id, _id: (product as any)._id, name: product.name })
  
  const appliedCategoryDesigns = useAppSelector((s: any) => s.app.appliedCategoryDesigns || {})
  const designs = useAppSelector((s: any) => s.designs.items)
  const activeCoupon = useAppSelector((s: any) => s.coupons.activeCoupon)
  const allCategories = useAppSelector((s: any) => s.categories.categories)

  // Get all product images for hover effect
  const productImages = useMemo(() => {
    const images = getAllProductImages(product)
    return images.length > 0 ? images : [getProductImage(product)]
  }, [product])

  // Get color variations from product data
  const colorVariations = useMemo(() => {
    const colors: { name: string; hex: string; image?: string }[] = []
    
    // Check for colors array
    if (product.colors && Array.isArray(product.colors)) {
      product.colors.forEach((color: any) => {
        if (color.name && color.hex) {
          colors.push({
            name: color.name,
            hex: color.hex,
            image: color.images?.[0] || color.image
          })
        }
      })
    }
    
    // Check for variants/variations
    const variants = product.variants_dict || product.variants || product.variations
    if (variants && Array.isArray(variants)) {
      variants.forEach((variant: any) => {
        if (variant.color && !colors.find(c => c.name === variant.color)) {
          // Try to map common color names to hex codes
          const colorMap: { [key: string]: string } = {
            'black': '#000000',
            'white': '#FFFFFF',
            'red': '#FF0000',
            'blue': '#0000FF',
            'green': '#008000',
            'yellow': '#FFFF00',
            'orange': '#FFA500',
            'purple': '#800080',
            'pink': '#FFC0CB',
            'gray': '#808080',
            'grey': '#808080',
            'brown': '#A52A2A',
            'navy': '#000080',
            'beige': '#F5F5DC'
          }
          const colorName = variant.color.toLowerCase()
          colors.push({
            name: variant.color,
            hex: variant.hex || colorMap[colorName] || '#808080',
            image: variant.variant_image || variant.image || variant.images?.[0]
          })
        }
      })
    }
    
    return colors.slice(0, 5) // Limit to 5 colors max
  }, [product])

  // Ensure categories are loaded
  useEffect(() => {
    if (allCategories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, allCategories.length])

  // Handle mouse hover to cycle through images
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    if (productImages.length > 1) {
      setCurrentImageIndex(1) // Show second image on hover
    }
  }, [productImages.length])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setCurrentImageIndex(0) // Back to first image
  }, [])

  // Cycle through images while hovering (optional enhancement)
  useEffect(() => {
    if (!isHovering || productImages.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
    }, 1500) // Change image every 1.5 seconds
    
    return () => clearInterval(interval)
  }, [isHovering, productImages.length])

  const handleDesignThisProduct = () => {
    const productId = (product as any)._id || product.id
    // Get current locale from pathname
    const locale = window.location.pathname.split('/')[1] || 'en'
    // Navigate to step-based design tool starting at step 1
    router.push(`/${locale}/design-tool/${productId}/step/1`)
  }

  const handleAddToCart = () => {
    console.log('Add to cart clicked for product:', product)
    console.log('Category:', product.categoryId, 'Has variations:', product.hasVariations)
    
    try {
      // For now, just add directly to cart to test if button works
      dispatch(addToCart(product))
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      })
      
      // Uncomment below to use modals when they're working
      /*
      // Check if product needs size selection (apparel or has variations)
      if (product.categoryId === 'apparel' || product.hasVariations) {
        console.log('Opening size modal')
        setSizeModalOpen(true)
      } else {
        console.log('Opening quantity modal')
        setQuantityModalOpen(true)
      }
      */
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      })
    }
  }

  const categoryName = useMemo(() => {
    const fromStore = (allCategories || []).find((c: any) => c.id === product.categoryId)
    if (fromStore?.name) return fromStore.name
    const fromConstants = productCategories.find((c) => c.id === product.categoryId)?.name(t)
    return fromConstants || product.categoryId
  }, [allCategories, product.categoryId, t])

  // Check if product is customizable based on category
  const isCustomizable = useMemo(() => {
    const category = allCategories.find((c: any) => c.id === product.categoryId)
    // Debug logging
    if (product.name.toLowerCase().includes('giveaway') || category?.name?.toLowerCase().includes('giveaway')) {
      console.log('Giveaway product check:', {
        productName: product.name,
        categoryId: product.categoryId,
        category: category,
        designableAreas: category?.designableAreas,
        hasDesignableAreas: category?.designableAreas && category.designableAreas.length > 0
      })
    }
    // Check if product itself is designable or category is designable
    if (product.isDesignable === true) return true
    if (category?.isDesignable === true) return true
    return category?.designableAreas && category.designableAreas.length > 0
  }, [allCategories, product.categoryId, product.isDesignable])

  // Resolve category-level applied design (set by "Preview on other products" from designs tab)
  const appliedDesignForCategory = useMemo(() => {
    const mappedId = appliedCategoryDesigns[product.categoryId]
    if (!mappedId) return null
    return designs.find((d: any) => d.id === mappedId) || null
  }, [appliedCategoryDesigns, product.categoryId, designs])

  return (
    <Card className={`overflow-hidden group transition-all duration-300 flex flex-col h-full border-2 border-black dark:border-white bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl ${
      product.inStock ? 'hover:scale-102 sm:hover:scale-105' : 'opacity-60'
    }`}>
      <Link 
        href={`/product/${(product as any)._id || product.id}${searchParams.toString() ? `?from=${encodeURIComponent(searchParams.toString())}` : ''}`} 
        className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ProductImage
          src={productImages[currentImageIndex]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-2 bg-gray-50 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
          quality={85}
        />
        {appliedDesignForCategory && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent z-10" />
            {(() => {
              const overlaySrc = appliedDesignForCategory?.designData?.canvasData || appliedDesignForCategory?.preview
              const overlayScale = appliedDesignForCategory?.designData?.overlay?.scale ?? 0.6
              return (
                <Image
                  src={overlaySrc || "/placeholder.svg"}
                  alt="Applied design overlay"
                  width={300}
                  height={300}
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
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <span className="text-white font-black uppercase text-lg bg-red-500 px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      <CardContent className="p-3 sm:p-4 flex-grow flex flex-col justify-between border-t-2 border-black dark:border-white">
        <div>
          <h3 className="font-black text-xs sm:text-sm lg:text-base uppercase text-black dark:text-white line-clamp-2">{product.name}</h3>
          <p className="text-[10px] sm:text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mt-1">{categoryName}</p>
          {/* Color Variations */}
          {colorVariations.length > 0 && (
            <div className="flex gap-1 mt-2">
              {colorVariations.map((color, index) => (
                <div
                  key={index}
                  className="relative group/color"
                  title={color.name}
                >
                  <div
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-all cursor-pointer hover:scale-110"
                    style={{ backgroundColor: color.hex }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // If color has an image, update the current image
                      if (color.image) {
                        const index = productImages.findIndex(img => img === color.image)
                        if (index !== -1) {
                          setCurrentImageIndex(index)
                        }
                      }
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {color.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-3">
          {activeCoupon && activeCoupon.discountType === "percentage" && product.eligibleForCoupons ? (
            <div>
              <span className="text-base sm:text-xl lg:text-2xl font-black text-black dark:text-white">
                {formatPrice(product.price * (1 - activeCoupon.discountValue / 100))}
              </span>
              <span className="text-gray-400 line-through text-[10px] sm:text-xs lg:text-sm ml-1 sm:ml-2">{formatPrice(product.price)}</span>
            </div>
          ) : (
            <p className="text-base sm:text-xl lg:text-2xl font-black text-black dark:text-white">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2 sm:p-3 lg:p-4 pt-0 border-t-2 border-black dark:border-white">
        <div className="flex gap-1.5 sm:gap-2 w-full">
          <Button
            className={`${isCustomizable ? 'flex-1' : 'w-full'} min-h-[44px] sm:min-h-[40px] lg:min-h-[44px] bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase text-[11px] sm:text-xs lg:text-sm transition-all flex items-center justify-center px-2 sm:px-3 touch-manipulation`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 sm:h-3 sm:w-3 lg:h-4 lg:w-4 mr-1 sm:mr-0 lg:mr-1 flex-shrink-0" />
            <span className="truncate">Add to Cart</span>
          </Button>
          {isCustomizable && (
            <Button
              className="w-[44px] sm:w-[40px] lg:w-[44px] min-h-[44px] sm:min-h-[40px] lg:min-h-[44px] border-2 border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center p-0 touch-manipulation"
              onClick={handleDesignThisProduct}
              disabled={!product.inStock}
              title="Design this product"
            >
              <Palette className="h-5 w-5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            </Button>
          )}
        </div>
      </CardFooter>
      
      {/* Size Selection Modal */}
      <SizeSelectionModal
        open={sizeModalOpen}
        onOpenChange={setSizeModalOpen}
        product={product}
      />
      
      {/* Quantity Modal */}
      <QuantityModal
        open={quantityModalOpen}
        onOpenChange={setQuantityModalOpen}
        product={product}
      />
    </Card>
  )
}

export const ProductCard = memo(ProductCardComponent)
