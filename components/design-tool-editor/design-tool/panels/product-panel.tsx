"use client"

import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Truck, Leaf, Palette } from "lucide-react"
import { setProductColor, setViewMode } from "@/lib/redux/designToolSlices/designSlice"
import { RootState } from "@/lib/redux/store"
import Image from "next/image"

export function ProductPanel() {
  const dispatch = useDispatch()
  const { selectedProduct, productColor, viewMode } = useSelector((state: RootState) => state.design)

  const handleColorChange = (color: string) => {
    console.log('ProductPanel: Color change from', productColor, 'to', color)
    dispatch(setProductColor(color))
  }

  const handleViewChange = (view: string) => {
    dispatch(setViewMode(view))
  }

  // Get variations from selected product
  const getVariations = () => {
    if (!selectedProduct || !(selectedProduct as any).hasVariations || !(selectedProduct as any).variations) {
      return []
    }
    return (selectedProduct as any).variations
  }

  // Get current variation based on selected color
  const getCurrentVariation = () => {
    const variations = getVariations()
    return variations.find((v: any) => v.color.hex_code === productColor) || variations[0]
  }

  // Get image for current view mode from current variation
  const getCurrentVariationImage = () => {
    const currentVariation = getCurrentVariation()
    if (!currentVariation) return null
    
    const imageForAngle = currentVariation.images?.find((img: any) => img.angle === viewMode && img.url)
    return imageForAngle?.url || currentVariation.color.swatch_image || selectedProduct.image
  }

  const variations = getVariations()

  return (
    <div className="flex flex-col h-full p-4 lg:p-6">
      <div className="space-y-4 lg:space-y-6">
        {/* Product Header */}
        <div className="space-y-3">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">{selectedProduct.name}</h2>
          <div className="flex items-center space-x-2 mb-3">
            <Leaf className="w-4 h-4 text-green-600" />
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              Eco-friendly
            </Badge>
          </div>
          <div className="text-2xl font-bold text-blue-600">{selectedProduct.price}</div>
        </div>

        {/* Color Variations */}
        {variations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Color Variations</span>
            </div>
            
            <div className="grid grid-cols-6 gap-3">
              {variations.map((variation: any, index: number) => {
                const isSelected = productColor === variation.color.hex_code
                
                return (
                  <button
                    key={variation.id}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                      isSelected 
                        ? "border-sky-500 ring-2 ring-sky-200 scale-110 shadow-lg" 
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: variation.color.hex_code }}
                    onClick={() => handleColorChange(variation.color.hex_code)}
                    title={variation.color.name || `Color ${index + 1}`}
                  >
                    {isSelected && (
                      <div className="flex items-center justify-center w-full h-full">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Default Color Selection (if no variations) */}
        {variations.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Product Color</span>
              <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: productColor }} />
            </div>

            <div className="grid grid-cols-5 lg:grid-cols-6 gap-3">
              {selectedProduct.colors.map((color: string, index: number) => (
                <button
                  key={index}
                  className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95 ${
                    productColor === color
                      ? "border-blue-500 ring-2 ring-blue-200 scale-110 shadow-lg"
                      : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  title={`Color ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>Free delivery: 5-7 business days</span>
        </div>

        {/* Rating */}
        {/* <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 transition-colors duration-200 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">4.0 (264 reviews)</span>
        </div> */}

        {/* Action Button */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
          Choose Size & Quantity
        </Button>
      </div>
    </div>
  )
}
