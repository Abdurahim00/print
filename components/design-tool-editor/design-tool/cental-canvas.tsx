"use client"

import { useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { setViewMode } from "@/lib/redux/designToolSlices/designSlice"
import { Button } from "@/components/ui/button"
import { RootState } from "@/lib/redux/store"
import Image from "next/image"
import { ProductAnglesSelector } from "@/components/dashboard/common/ProductAnglesSelector"

export function CentralCanvas() {
  const dispatch = useDispatch()
  const { selectedTool, viewMode, selectedProduct, productColor } = useSelector((state: RootState) => state.design)
  const { selectedObject } = useSelector((state: RootState) => state.canvas)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const { canvasRef } = useFabricCanvas("design-canvas")

  const handleViewChange = (view: string) => {
    dispatch(setViewMode(view))
  }

  // Get product angles from the selected product
  const getProductAngles = () => {
    if (!selectedProduct || !selectedProduct.angles) {
      return ["front"] // Default fallback
    }
    return selectedProduct.angles
  }

  // Get image for current view mode
  const getCurrentImage = () => {
    if (!selectedProduct) return null
    
    // If product has variations, try to find image for current view mode
    if ((selectedProduct as any).hasVariations && (selectedProduct as any).variations) {
      // Find the variation that matches the current product color
      const currentVariation = (selectedProduct as any).variations.find((v: any) => v.color.hex_code === productColor)
      if (currentVariation) {
        const imageForAngle = currentVariation.images?.find((img: any) => img.angle === viewMode && img.url)
        if (imageForAngle) {
          return imageForAngle.url
        }
        // Fallback to swatch image or main product image
        return currentVariation.color.swatch_image || selectedProduct.image
      }
    }
    
    // Fallback to main product image
    return selectedProduct.image
  }

  // Get current variation images for the selected color
  const getCurrentVariationImages = () => {
    if (!selectedProduct || !(selectedProduct as any).hasVariations || !(selectedProduct as any).variations) {
      return []
    }
    
    // Find the variation that matches the current product color
    const currentVariation = (selectedProduct as any).variations.find((v: any) => v.color.hex_code === productColor)
    return currentVariation?.images || []
  }

  const angles = getProductAngles()
  const currentImage = getCurrentImage()
  const currentVariationImages = getCurrentVariationImages()

  // Debug logging
  console.log('CentralCanvas Debug:', {
    productColor,
    viewMode,
    hasVariations: (selectedProduct as any)?.hasVariations,
    variationsCount: (selectedProduct as any)?.variations?.length,
    currentVariationImagesCount: currentVariationImages.length,
    selectedProduct: selectedProduct?.name
  })

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative max-w-md w-full">
          <div className="relative bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4/5 h-4/5 relative">
                  {/* Product Image */}
                  {selectedProduct && currentImage && (
                    <div className="w-full h-full relative">
                      <Image
                        src={currentImage}
                        alt={selectedProduct.name}
                        fill
                        className="object-contain"
                        style={{ 
                          filter: viewMode === "back" ? "brightness(0.8)" : "none",
                          transform: viewMode === "left" ? "rotateY(45deg)" : 
                                   viewMode === "right" ? "rotateY(-45deg)" : "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Fabric Canvas for design elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4/5 h-4/5 relative">
                  <canvas
                    ref={canvasRef}
                    id="design-canvas"
                    className="absolute inset-0 w-full h-full cursor-crosshair"
                    style={{ zIndex: 10 }}
                  />
                </div>
              </div>
            </div>
            
            {/* Product Angles */}
            <ProductAnglesSelector
              angles={angles}
              selectedAngle={viewMode}
              onSelect={handleViewChange}
              className="my-4"
              productImage={selectedProduct?.image}
              variationImages={currentVariationImages}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
