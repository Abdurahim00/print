"use client"

import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { setSelectedProduct } from "@/lib/redux/designToolSlices/designSlice"
import type { Product } from "@/lib/models/Product"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  loading?: boolean
}

export function ProductModal({ isOpen, onClose, products, loading = false }: ProductModalProps) {
  const dispatch = useDispatch()

  const handleSelectProduct = (product: Product) => {
    // Collect angles only from real data: variations' images or product.angles
    const angleSet = new Set<string>()
    if (product.hasVariations && product.variations) {
      product.variations.forEach(variation => {
        variation.images?.forEach(img => {
          if (img?.angle) angleSet.add(img.angle)
        })
      })
    }
    const realAngles = angleSet.size > 0 ? Array.from(angleSet) : (product.angles || [])

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
      type: product.categoryId,
      categoryId: product.categoryId,
      baseColor: initialColor,
      angles: realAngles,
      colors: realColors,
      price: `$${product.price.toFixed(2)}`,
      image: product.image,
      description: product.description,
      inStock: product.inStock,
      hasVariations: product.hasVariations,
      variations: product.variations || [],
    }

    console.log('🔥 [ProductModal] Select product with real data only', {
      productName: product.name,
      hasVariations: product.hasVariations,
      variationsCount: product.variations?.length,
      realAngles,
      realColors,
      initialColor,
    })

    dispatch(setSelectedProduct(selectedProduct))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {products.map((product: Product) => (
              <div
                key={product.id}
                className="border rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleSelectProduct(product)}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-20 h-20 object-contain"
                  />
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                {product.description && (
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                )}

                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {product.categoryId}
                  </Badge>
                  <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>

                <Button 
                  className="w-full rounded-xl" 
                  onClick={() => handleSelectProduct(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Select Product" : "Out of Stock"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
