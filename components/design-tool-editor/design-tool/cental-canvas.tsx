"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { setViewMode, setSelectedProduct, setProductColor, setSelectedTemplate } from "@/lib/redux/designToolSlices/designSlice"
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
  const { selectedTool, viewMode, selectedProduct, productColor, imageLayers, selectedTemplate } = useSelector((state: RootState) => state.design)
  const { selectedObject } = useSelector((state: RootState) => state.canvas)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  
  // State for tracking if a saved design is loaded
  const [isLoadingDesign, setIsLoadingDesign] = useState(false)

  const { canvasRef, loadFromJSON } = useFabricCanvas("design-canvas")
  
  // Persist current design session (product + view + template) on change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const sessionState = {
          selectedProduct,
          productColor,
          viewMode,
          selectedTemplate,
        }
        localStorage.setItem('designSessionState', JSON.stringify(sessionState))
      }
    } catch {}
  }, [selectedProduct, productColor, viewMode, selectedTemplate])

  // Restore persisted design session and canvas after refresh if present and no explicit designId/productId in URL
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      const params = new URLSearchParams(window.location.search)
      const hasDesignId = !!params.get('designId')
      const hasProductId = !!params.get('productId')
      if (hasDesignId || hasProductId) return

      // Restore session state first
      const sessionRaw = localStorage.getItem('designSessionState')
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw)
        if (session?.selectedProduct) {
          dispatch(setSelectedProduct(session.selectedProduct))
        }
        if (session?.productColor) {
          dispatch(setProductColor(session.productColor))
        }
        if (session?.viewMode) {
          dispatch(setViewMode(session.viewMode))
        }
        if (session?.selectedTemplate) {
          dispatch(setSelectedTemplate(session.selectedTemplate))
        }
      }

      // Then restore canvas JSON
      if (loadFromJSON) {
        const persisted = localStorage.getItem('designCanvasJSON')
        if (persisted) {
          const json = JSON.parse(persisted)
          loadFromJSON(json)
        }
      }
    } catch {}
  }, [loadFromJSON, dispatch])
  
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

  // Determine if canvas border should be visible based on selected tool
  const shouldShowCanvasBorder = () => {
    // Only show border when design tools are actively selected
    // This provides clean UI when browsing products and clear feedback when designing
    return selectedProduct !== null && 
           (selectedTool === "text" || selectedTool === "template" || selectedTool === "upload")
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
          {/* Main Container - Relative positioning with base/product image */}
          <div className="flex-1 relative bg-white rounded-xl overflow-hidden border border-gray-200/60 shadow-sm min-h-0">
            
            {/* Base/Product Image - Background layer */}
            {selectedProduct && currentImage ? (
              <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full h-full relative max-w-2xl max-h-full">
                  <Image
                    src={currentImage}
                    alt={(selectedProduct as Product).name}
                    fill
                    className="object-contain drop-shadow-lg"
                    style={{ 
                      filter: viewMode === "back" ? "brightness(0.85) saturate(1.1)" : "saturate(1.1)",
                      transform: viewMode === "left" ? "rotateY(25deg)" : 
                              viewMode === "right" ? "rotateY(-25deg)" : "none",
                      zIndex: 1
                    }}
                  />
                </div>
              </div>
            ) : (
              /* Show instructions when no product selected */
              <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8" style={{ zIndex: 1 }}>
                <div className="text-center text-gray-400">
                  <p className="text-xl font-medium mb-2">Start by selecting a product</p>
                  <p className="text-sm text-gray-400 max-w-md">Click the product icon in the left toolbar to browse available products</p>
                </div>
              </div>
            )}

            {/* Sub Container - Contains canvas and all design layers */}
            <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8" style={{ zIndex: 10 }}>
              <div className="w-full h-full relative max-w-xs max-h-xs">
                
                {/* Canvas Container - Absolutely positioned and centered */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
                  <canvas
                    ref={canvasRef}
                    id="design-canvas"
                    // className="cursor-crosshair bg-transparent transition-all duration-300 ease-in-out"
                    // style={{ 
                    //   border: shouldShowCanvasBorder() 
                    //     ? "2px dashed #3b82f6" 
                    //     : "2px dashed transparent",
                    //   borderRadius: "8px",
                    //   boxShadow: shouldShowCanvasBorder() 
                    //     ? "0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
                    //     : "0 0 0 1px transparent, 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
                    //   backgroundColor: shouldShowCanvasBorder() 
                    //     ? "rgba(255, 255, 255, 0.05)" 
                    //     : "transparent"
                    // }}
                    // width={300}
                    // height={300}
                  />
                </div>

                {/* We don't need to render image layers here anymore since they're handled by Fabric.js canvas */}
              </div>
            </div>
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