"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { setViewMode } from "@/lib/redux/designToolSlices/designSlice"
import { Button } from "@/components/ui/button"
import { RootState } from "@/lib/redux/store"
import Image from "next/image"
import { ProductAnglesSelector } from "@/components/dashboard/common/ProductAnglesSelector"
import { LoadSavedDesign } from "./load-saved-design"

// Type definition for product
interface Product {
  id: string;
  name: string;
  type: string;
  baseColor: string;
  angles?: string[];
  colors?: string[];
  price?: string;
  image?: string;
  hasVariations?: boolean;
  variations?: any[];
}

export function CentralCanvas() {
  const dispatch = useDispatch()
  const { selectedTool, viewMode, selectedProduct, productColor, imageLayers } = useSelector((state: RootState) => state.design)
  const { selectedObject } = useSelector((state: RootState) => state.canvas)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  
  // State for tracking if a saved design is loaded
  const [isLoadingDesign, setIsLoadingDesign] = useState(false)

  const { canvasRef, loadFromJSON } = useFabricCanvas("design-canvas")
  
  // Handle loading a saved design
  const handleDesignLoaded = useCallback((canvasJSON: any) => {
    if (canvasJSON && loadFromJSON) {
      setIsLoadingDesign(true)
      // Short delay to ensure canvas is initialized
      setTimeout(() => {
        loadFromJSON(canvasJSON)
        setIsLoadingDesign(false)
      }, 500)
    }
  }, [loadFromJSON])

  const handleViewChange = (view: string) => {
    dispatch(setViewMode(view))
  }

  // Get product angles from the selected product
  const getProductAngles = () => {
    if (!selectedProduct || !(selectedProduct as Product).angles) {
      return [] // No angles when no product is selected
    }
    return (selectedProduct as Product).angles || []
  }

  // Get image for current view mode
  const getCurrentImage = () => {
    if (!selectedProduct) return null
    
    const product = selectedProduct as Product;
    
    // If product has variations, try to find image for current view mode
    if (product.hasVariations && product.variations) {
      // Find the variation that matches the current product color
      const currentVariation = product.variations.find((v: any) => v.color.hex_code === productColor)
      if (currentVariation) {
        const imageForAngle = currentVariation.images?.find((img: any) => img.angle === viewMode && img.url)
        if (imageForAngle) {
          return imageForAngle.url
        }
        // Fallback to swatch image or main product image
        return currentVariation.color.swatch_image || product.image
      }
    }
    
    // Fallback to main product image
    return product.image
  }

  // Get current variation images for the selected color
  const getCurrentVariationImages = () => {
    if (!selectedProduct) return []
    
    const product = selectedProduct as Product;
    if (!product.hasVariations || !product.variations) {
      return []
    }
    
    // Find the variation that matches the current product color
    const currentVariation = product.variations.find((v: any) => v.color.hex_code === productColor)
    return currentVariation?.images || []
  }

  const angles = getProductAngles()
  const currentImage = getCurrentImage()
  const currentVariationImages = getCurrentVariationImages()

  // Enterprise apps typically log only in development environments
  if (process.env.NODE_ENV === 'development') {
    console.log('CentralCanvas:', {
      productName: selectedProduct ? (selectedProduct as Product).name : null,
      viewMode,
      hasVariations: selectedProduct ? (selectedProduct as Product).hasVariations : null,
      colorSelected: productColor
    })
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden relative">
      {/* Load saved design component */}
      <LoadSavedDesign onDesignLoaded={handleDesignLoaded} />
      
      {/* Main Canvas Area - Full height with minimal padding */}
      <div className="flex-1 flex items-center justify-center p-2 lg:p-4">
        <div className="relative w-full h-full max-w-4xl max-h-full flex flex-col">
          {/* Canvas container - maximized space */}
          <div className="flex-1 relative bg-white rounded-xl overflow-hidden border border-gray-200/60 shadow-sm min-h-0">
            {/* Always show the fabric canvas, so text can be added even without a product */}
            <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8">
              <div className="w-full h-full relative max-w-2xl max-h-full">
                <canvas
                  ref={canvasRef}
                  id="design-canvas"
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  style={{ zIndex: 10 }}
                />
              </div>
            </div>

            {selectedProduct ? (
              /* Product content is only shown when a product is selected */
              <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8" style={{ zIndex: 5 }}>
                <div className="w-full h-full relative max-w-2xl max-h-full">
                  {/* Product Image */}
                  {currentImage && (
                    <div className="w-full h-full relative">
                      <Image
                        src={currentImage}
                        alt={(selectedProduct as Product).name}
                        fill
                        className="object-contain drop-shadow-lg"
                        style={{ 
                          filter: viewMode === "back" ? "brightness(0.85) saturate(1.1)" : "saturate(1.1)",
                          transform: viewMode === "left" ? "rotateY(25deg)" : 
                                  viewMode === "right" ? "rotateY(-25deg)" : "none"
                        }}
                      />
                      {/* Render all image layers (templates, uploads) */}
                      {imageLayers.map((layer: any) => (
                        <Image
                          key={layer.id}
                          src={layer.src}
                          alt={layer.name || "Layer"}
                          fill
                          className="object-contain absolute inset-0 pointer-events-none"
                          style={{ zIndex: 20 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Show instructions when no product selected, but keep canvas visible */
              <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8" style={{ zIndex: 5 }}>
                <div className="text-center text-gray-400">
                  <p className="text-xl font-medium mb-2">Start by selecting a product</p>
                  <p className="text-sm text-gray-400 max-w-md">Click the product icon in the left toolbar to browse available products</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Product Angles - Compact design at bottom */}
          {selectedProduct && angles && angles.length > 1 && (
            <div className="flex-shrink-0 mt-3 lg:mt-4">
              <ProductAnglesSelector
                angles={angles}
                selectedAngle={viewMode}
                onSelect={handleViewChange}
                className=""
                productImage={getCurrentImage() || ""}
                variationImages={currentVariationImages}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}