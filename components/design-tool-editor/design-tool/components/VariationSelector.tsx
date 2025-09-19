import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { setProductColor, saveVariationDesign, loadVariationDesign } from '@/lib/redux/designToolSlices/designSlice'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Palette } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface VariationSelectorProps {
  product: any
  onVariationChange?: (variation: any) => void
  className?: string
}

export const VariationSelector: React.FC<VariationSelectorProps> = ({ 
  product, 
  onVariationChange,
  className = ""
}) => {
  const dispatch = useDispatch()
  const { productColor, variationDesigns, viewMode } = useSelector((state: RootState) => state.design)
  const [selectedVariation, setSelectedVariation] = useState<any>(null)
  const [hoveredVariation, setHoveredVariation] = useState<string | null>(null)

  // Initialize with first variation if product has variations
  useEffect(() => {
    // Check for variations or variants field
    const variations = product?.variations || product?.variants
    const hasVariations = product?.hasVariations || (variations && variations.length > 0)
    
    if (hasVariations && variations?.length > 0) {
      // Handle both variation formats
      const formattedVariations = variations.map((v: any, index: number) => {
        // If it's the old format (variants), convert it
        if (v.variant_name && !v.color) {
          return {
            id: `var_${index}`,
            color: {
              name: v.variant_name,
              hex_code: v.variant_hex || '#' + Math.floor(Math.random()*16777215).toString(16),
              swatch_image: v.variant_image
            },
            price: v.variant_price || product.price || product.basePrice,
            inStock: true,
            stockQuantity: 100,
            images: v.variant_image ? [{ url: v.variant_image, angle: 'front' }] : []
          }
        }
        return v
      })
      
      const currentVariation = formattedVariations.find((v: any) => 
        v.color?.hex_code === productColor
      ) || formattedVariations[0]
      
      setSelectedVariation(currentVariation)
      if (currentVariation && currentVariation.color?.hex_code !== productColor) {
        dispatch(setProductColor(currentVariation.color?.hex_code))
      }
    }
  }, [product])

  const handleVariationSelect = async (variation: any) => {
    if (!variation || variation.id === selectedVariation?.id) return

    // Get fabric canvas reference
    const fabricCanvas = (window as any).fabricCanvas

    // Save current design before switching
    const currentVariationId = getVariationDesignId(selectedVariation)
    if (currentVariationId && fabricCanvas) {
      const canvasJSON = fabricCanvas.toJSON()
      dispatch(saveVariationDesign({
        variationId: currentVariationId,
        viewMode,
        canvasJSON,
        designAreaCm2: 0, // Calculate actual area
        designAreaPercentage: 0 // Calculate actual percentage
      }))
    }

    // Update selected variation
    setSelectedVariation(variation)
    dispatch(setProductColor(variation.color?.hex_code))
    
    // Load new variation's design if exists
    const newVariationId = getVariationDesignId(variation)
    const existingDesign = variationDesigns.find(
      d => d.variationId === newVariationId && d.viewMode === viewMode
    )
    
    if (existingDesign && fabricCanvas) {
      fabricCanvas.loadFromJSON(existingDesign.canvasJSON, () => {
        fabricCanvas.renderAll()
      })
    } else if (fabricCanvas) {
      // Clear canvas for new variation
      fabricCanvas.clear()
      fabricCanvas.renderAll()
    }

    // Notify parent component
    onVariationChange?.(variation)
  }

  const getVariationDesignId = (variation: any) => {
    if (!variation || !product) return null
    return `${product.id}_${variation.id}_${viewMode}`
  }

  const getVariationPrice = (variation: any) => {
    const basePrice = variation.price || product.price
    // Add design cost if applicable
    const designCost = variation.designCostPerCm2 ? 
      (variation.designCostPerCm2 * getDesignArea(variation)) : 0
    return basePrice + designCost
  }

  const getDesignArea = (variation: any) => {
    // Calculate based on variation's design frames
    const frames = variation.designFrames || []
    const currentFrame = frames.find((f: any) => f.position === viewMode)
    if (currentFrame) {
      return currentFrame.width * currentFrame.height
    }
    return 0
  }

  const hasDesignForVariation = (variation: any) => {
    const variationId = getVariationDesignId(variation)
    return variationDesigns.some(d => 
      d.variationId === variationId && 
      d.canvasJSON?.objects?.length > 0
    )
  }

  // Check for variations or variants
  const variations = product?.variations || product?.variants
  const hasVariations = product?.hasVariations || (variations && variations.length > 0)
  
  if (!hasVariations || !variations?.length) {
    return null
  }
  
  // Format variations to consistent structure
  const formattedVariations = variations.map((v: any, index: number) => {
    if (v.variant_name && !v.color) {
      return {
        id: `var_${index}`,
        color: {
          name: v.variant_name,
          hex_code: v.variant_hex || '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
          swatch_image: v.variant_image
        },
        price: v.variant_price || product.price || product.basePrice,
        inStock: true,
        stockQuantity: 100,
        images: v.variant_image ? [{ url: v.variant_image, angle: 'front' }] : [],
        designFrames: product.designFrames || [],
        designCostPerCm2: product.designCostPerCm2 || 0.5
      }
    }
    return v
  })

  return (
    <div className={`variation-selector ${className}`}>
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Choose Variation
        </h4>
        
        <div className="grid grid-cols-4 gap-2">
          {formattedVariations.map((variation: any) => {
            const isSelected = selectedVariation?.id === variation.id
            const hasDesign = hasDesignForVariation(variation)
            const isHovered = hoveredVariation === variation.id
            
            return (
              <TooltipProvider key={variation.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className={`
                        relative cursor-pointer transition-all duration-200
                        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg scale-105' : 'hover:shadow-md'}
                        ${isHovered ? 'transform scale-102' : ''}
                      `}
                      onClick={() => handleVariationSelect(variation)}
                      onMouseEnter={() => setHoveredVariation(variation.id)}
                      onMouseLeave={() => setHoveredVariation(null)}
                    >
                      {/* Color swatch */}
                      <div className="p-2">
                        {variation.color?.swatch_image ? (
                          <img 
                            src={variation.color.swatch_image} 
                            alt={variation.color.name}
                            className="w-full h-12 object-cover rounded"
                          />
                        ) : (
                          <div 
                            className="w-full h-12 rounded border"
                            style={{ backgroundColor: variation.color?.hex_code || '#000' }}
                          />
                        )}
                        
                        {/* Variation info */}
                        <div className="mt-1">
                          <p className="text-xs font-medium truncate">
                            {variation.color?.name || 'Color'}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${getVariationPrice(variation).toFixed(2)}
                          </p>
                        </div>
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                        
                        {/* Design indicator */}
                        {hasDesign && (
                          <Badge 
                            variant="secondary" 
                            className="absolute bottom-1 right-1 text-[10px] px-1 py-0"
                          >
                            Design
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium">{variation.color?.name}</p>
                      <p className="text-gray-500">{variation.color?.hex_code}</p>
                      {variation.inStock ? (
                        <p className="text-green-600">In Stock</p>
                      ) : (
                        <p className="text-red-600">Out of Stock</p>
                      )}
                      {hasDesign && (
                        <p className="text-blue-600 mt-1">Has saved design</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
        
        {/* Selected variation details */}
        {selectedVariation && (
          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {selectedVariation.color?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedVariation.stockQuantity > 0 
                    ? `${selectedVariation.stockQuantity} in stock`
                    : 'Out of stock'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  ${getVariationPrice(selectedVariation).toFixed(2)}
                </p>
                {selectedVariation.designCostPerCm2 && (
                  <p className="text-xs text-gray-500">
                    +${selectedVariation.designCostPerCm2}/cm²
                  </p>
                )}
              </div>
            </div>
            
            {/* Design frames info */}
            {selectedVariation.designFrames?.length > 0 && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs text-gray-600">
                  Design areas: {selectedVariation.designFrames.length} configured
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Quick actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            // Copy design to all variations
            if (window.confirm('Copy current design to all variations?')) {
              const fabricCanvas = (window as any).fabricCanvas
              const currentDesign = fabricCanvas?.toJSON()
              if (currentDesign) {
                formattedVariations.forEach((v: any) => {
                  if (v.id !== selectedVariation?.id) {
                    dispatch(saveVariationDesign({
                      variationId: getVariationDesignId(v),
                      viewMode,
                      canvasJSON: currentDesign,
                      isShared: true
                    }))
                  }
                })
              }
            }
          }}
          className="text-xs"
        >
          Copy to All
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            // Clear current variation's design
            if (window.confirm('Clear design for this variation?')) {
              const fabricCanvas = (window as any).fabricCanvas
              fabricCanvas?.clear()
              fabricCanvas?.renderAll()
              dispatch(saveVariationDesign({
                variationId: getVariationDesignId(selectedVariation),
                viewMode,
                canvasJSON: { objects: [] }
              }))
            }
          }}
          className="text-xs"
        >
          Clear Design
        </Button>
      </div>
    </div>
  )
}

// Export a function to get variation-specific frames
export const getVariationFrames = (product: any, variation: any, viewMode: string) => {
  // First check variation-specific frames
  if (variation?.designFrames?.length > 0) {
    const frames = variation.designFrames.filter((f: any) => 
      f.position === viewMode || f.angle === viewMode
    )
    if (frames.length > 0) return frames
  }
  
  // Fallback to product-level frames
  if (product?.designFrames?.length > 0) {
    return product.designFrames.filter((f: any) => 
      f.position === viewMode || f.angle === viewMode
    )
  }
  
  return []
}