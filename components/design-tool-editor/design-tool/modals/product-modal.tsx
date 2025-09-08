"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check } from "lucide-react"
import { setSelectedProduct } from "@/lib/redux/designToolSlices/designSlice"
import type { Product } from "@/lib/models/Product"
import { formatUSD } from "@/lib/utils"
import { getProductImage } from "@/lib/utils/product-image"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  loading?: boolean
}

export function ProductModal({ isOpen, onClose, products, loading = false }: ProductModalProps) {
  const dispatch = useDispatch()
  const [selectingProductId, setSelectingProductId] = useState<string | null>(null)
  
  console.log('🛠️ [ProductModal] Render state:', { isOpen, productsCount: products?.length, loading })

  const handleSelectProduct = async (product: Product) => {
    // Set selecting state for immediate feedback
    setSelectingProductId(product.id)
    
    // Small delay to show the selecting state
    await new Promise(resolve => setTimeout(resolve, 200))
    // Collect angles from variations OR individual angle images for single products
    let realAngles: string[] = []
    
    if (product.hasVariations && product.variations && product.variations.length > 0) {
      // Get angles from the first variation (which will be the initial color)
      const firstVariation = product.variations[0]
      if (firstVariation.images) {
        const angleSet = new Set<string>()
        firstVariation.images.forEach(img => {
          if (img?.angle && img.url && img.url.trim() !== '') {
            angleSet.add(img.angle)
          }
        })
        realAngles = Array.from(angleSet)
      }
    } else {
      // For single products without variations, check individual angle images
      const angleImages = [
        { angle: 'front', image: (product as any).frontImage },
        { angle: 'back', image: (product as any).backImage },
        { angle: 'left', image: (product as any).leftImage },
        { angle: 'right', image: (product as any).rightImage },
        { angle: 'material', image: (product as any).materialImage }
      ]
      
      angleImages.forEach(({ angle, image }) => {
        if (image && image.trim() !== '') {
          realAngles.push(angle)
        }
      })
    }
    
    // If no angles found, don't show any angles
    if (realAngles.length === 0) {
      realAngles = []
    }

    // Collect colors only from real data: variations or product.colors
    const realColors = (product.hasVariations && product.variations)
      ? product.variations.map(v => v.color?.hex_code).filter(Boolean)
      : (product as any).colors || []

    // Initial color preference: first variation color, else product.baseColor, else empty
    const initialColor = (realColors[0]) || (product as any).baseColor || ""

    // Build the selectedProduct with only real data, no dummy defaults
    const selectedProduct = {
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      subcategoryIds: product.subcategoryIds,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      type: product.type,
      eligibleForCoupons: product.eligibleForCoupons,
      baseColor: initialColor,
      angles: realAngles,
      colors: realColors,
      price: formatUSD(product.price),
      image: getProductImage(product),
      images: product.images || [],
      variants: product.variants || [], // Add variants array for getCurrentImage
      description: product.description,
      inStock: product.inStock,
      hasVariations: product.hasVariations,
      variations: product.variations || [],
      purchaseLimit: product.purchaseLimit, // Add purchase limit data
      // Include individual angle images for single products
      ...(product.hasVariations ? {} : {
        frontImage: (product as any).frontImage,
        backImage: (product as any).backImage,
        leftImage: (product as any).leftImage,
        rightImage: (product as any).rightImage,
        materialImage: (product as any).materialImage,
        frontAltText: (product as any).frontAltText,
        backAltText: (product as any).backAltText,
        leftAltText: (product as any).leftAltText,
        rightAltText: (product as any).rightAltText,
        materialAltText: (product as any).materialAltText,
      })
    }

    console.log('🔥 [ProductModal] Select product with real data only', {
      productName: product.name,
      hasVariations: product.hasVariations,
      variationsCount: product.variations?.length,
      realAngles,
      realColors,
      initialColor,
      variations: product.variations?.map(v => ({
        color: v.color?.hex_code,
        imagesCount: v.images?.length,
        images: v.images?.map(img => ({ angle: img.angle, url: img.url, isValid: img.url && img.url.trim() !== '' }))
      })),
      selectedProduct,
      // Debug single product angle images
      singleProductAngles: !product.hasVariations ? {
        frontImage: (product as any).frontImage,
        backImage: (product as any).backImage,
        leftImage: (product as any).leftImage,
        rightImage: (product as any).rightImage,
        materialImage: (product as any).materialImage,
        realAngles
      } : null,
      // Debug raw product data
      rawProductData: {
        allKeys: Object.keys(product),
        hasFrontImage: !!(product as any).frontImage,
        hasBackImage: !!(product as any).backImage,
        hasLeftImage: !!(product as any).leftImage,
        hasRightImage: !!(product as any).rightImage,
        hasMaterialImage: !!(product as any).materialImage
      }
    })

    dispatch(setSelectedProduct(selectedProduct))
    setSelectingProductId(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Product</DialogTitle>
        </DialogHeader>


        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {products.map((product: Product) => {
              const isSelecting = selectingProductId === product.id
              return (
                <div
                  key={product.id}
                  className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer group ${
                    isSelecting 
                      ? 'border-green-500 bg-green-50 scale-105 shadow-xl' 
                      : 'hover:shadow-lg hover:border-black hover:scale-105 active:scale-100'
                  } ${!product.inStock ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    if (product.inStock && !selectingProductId) {
                      handleSelectProduct(product)
                    }
                  }}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center group-hover:bg-gray-200 transition-colors relative">
                    {isSelecting && (
                      <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Check className="w-12 h-12 text-green-600" />
                      </div>
                    )}
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{formatUSD(product.price)}</p>
                  {product.description && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  <Button 
                    className={`w-full rounded-xl ${
                      isSelecting 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'group-hover:bg-black group-hover:text-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (product.inStock && !selectingProductId) {
                        handleSelectProduct(product)
                      }
                    }}
                    disabled={!product.inStock || !!selectingProductId}
                  >
                    {isSelecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Selecting...
                      </span>
                    ) : product.inStock ? "Select Product" : "Out of Stock"}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
