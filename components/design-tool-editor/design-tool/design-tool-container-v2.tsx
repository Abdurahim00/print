"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useSearchParams } from "next/navigation"
import * as fabric from "fabric"
import { CentralCanvas } from "./cental-canvas"
import { ProductModal } from "./modals/product-modal"
import { TemplateModal } from "./modals/template-modal"
import { setShowProductModal, setShowTemplateModal, setSelectedTool, setSelectedProduct, setProductColor, setProductWithVariant } from "@/lib/redux/designToolSlices/designSlice"
import { fetchDesignableProducts } from "@/lib/redux/slices/productsSlice"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { RootState } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Type, 
  Image, 
  Palette, 
  Upload,
  Undo2,
  Redo2,
  ShoppingCart,
  ChevronRight,
  Sparkles,
  Package,
  Check,
  X,
  Plus
} from "lucide-react"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { ProductPanel } from "./panels/product-panel"
import { SizeQuantityModal } from "./modals/size-quantity-modal"

export function DesignToolContainerV2() {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const { showProductModal, showTemplateModal, selectedProduct, hasDesignElements, designAreaPercentage } = useSelector((state: RootState) => state.design)
  const { items: products, loading } = useSelector((state: RootState) => state.products)
  const { canUndo, canRedo, fabricCanvas } = useSelector((state: RootState) => state.canvas)
  const { handleUndo, handleRedo, addText } = useFabricCanvas("design-canvas")
  const [currentStep, setCurrentStep] = useState(1)
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false)
  const [isCheckoutReady, setIsCheckoutReady] = useState(false)

  // Fetch only designable products and categories
  useEffect(() => {
    dispatch(fetchDesignableProducts() as any)
    dispatch(fetchCategories(true) as any) // Force refresh categories to get latest metric pricing
  }, [dispatch])

  // Load product from URL if productId is provided
  useEffect(() => {
    const productId = searchParams.get('productId')
    const variantId = searchParams.get('variant')
    
    if (productId && products.length > 0 && !selectedProduct) {
      const product = products.find((p: any) => p.id === productId || p._id === productId)
      if (product) {
        // Use the new action that handles variant properly
        if (variantId) {
          dispatch(setProductWithVariant({ product, variantId }))
        } else {
          dispatch(setSelectedProduct(product))
        }
        setCurrentStep(2) // Jump directly to design step
      }
    }
  }, [searchParams, products, selectedProduct, dispatch])

  // Auto-advance to step 2 when product is selected
  useEffect(() => {
    if (selectedProduct && currentStep === 1) {
      setCurrentStep(2)
    }
  }, [selectedProduct])

  const handleAddToCart = () => {
    setIsSizeModalOpen(true)
    setIsCheckoutReady(true)
  }

  const handleQuickAction = (action: string) => {
    if (action === "text" && fabricCanvas) {
      addText(fabricCanvas)
    } else if (action === "upload") {
      // Handle image upload
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file && fabricCanvas) {
          const reader = new FileReader()
          reader.onload = async (event) => {
            const imageUrl = event.target?.result as string
            
            try {
              // Use the new fabric.js v6 API with async/await
              // Pass empty object for filters and options for properties
              const img = await fabric.FabricImage.fromURL(imageUrl, {}, {
                crossOrigin: 'anonymous'
              })
              img.scaleToWidth(200)
              fabricCanvas.add(img)
              fabricCanvas.setActiveObject(img)
              fabricCanvas.renderAll()
            } catch (error) {
              console.error('Failed to load image:', error)
              // Try fallback approach with data URL directly
              try {
                const tempImg = new Image()
                tempImg.crossOrigin = 'anonymous'
                tempImg.onload = () => {
                  const fabricImg = new fabric.FabricImage(tempImg)
                  fabricImg.scaleToWidth(200)
                  fabricCanvas.add(fabricImg)
                  fabricCanvas.setActiveObject(fabricImg)
                  fabricCanvas.renderAll()
                  console.log('Image added via fallback')
                }
                tempImg.src = imageUrl
              } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError)
                alert('Failed to load the image. Please try a different image.')
              }
            }
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    } else if (action === "template") {
      dispatch(setShowTemplateModal(true))
    }
  }

  const steps = [
    { id: 1, name: "Choose Product", icon: Package, completed: !!selectedProduct },
    { id: 2, name: "Design It", icon: Palette, completed: hasDesignElements },
    { id: 3, name: "Buy It", icon: ShoppingCart, completed: false }
  ]

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Steps */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = step.completed || currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => {
                      // Validate step navigation
                      if (step.id === 1) {
                        // Always allow going back to step 1
                        setCurrentStep(step.id)
                      } else if (step.id === 2) {
                        // Only allow step 2 if product is selected
                        if (selectedProduct) {
                          setCurrentStep(step.id)
                        } else {
                          // Show product modal if trying to skip to design without product
                          dispatch(setShowProductModal(true))
                        }
                      } else if (step.id === 3) {
                        // Only allow step 3 if product is selected and has design
                        if (selectedProduct && hasDesignElements) {
                          setCurrentStep(step.id)
                          setIsSizeModalOpen(true)
                        } else if (selectedProduct && !hasDesignElements) {
                          // If product selected but no design, go to step 2
                          setCurrentStep(2)
                        } else {
                          // No product selected, show product modal
                          dispatch(setShowProductModal(true))
                        }
                      }
                    }}
                    disabled={
                      // Disable clicking on steps that can't be accessed yet
                      (step.id === 2 && !selectedProduct) ||
                      (step.id === 3 && (!selectedProduct || !hasDesignElements))
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-black text-white scale-105' 
                        : isCompleted 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    } ${
                      ((step.id === 2 && !selectedProduct) || 
                       (step.id === 3 && (!selectedProduct || !hasDesignElements)))
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-white text-black' : ''
                    }`}>
                      {isCompleted && !isActive ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className="font-semibold hidden sm:inline">{step.name}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="mx-2 text-gray-300 flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick Actions Bar */}
          {currentStep === 2 && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Add to your design:</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAction('text')}
                    className="gap-2"
                  >
                    <Type className="w-4 h-4" />
                    Add Text
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAction('upload')}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAction('template')}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Use Template
                  </Button>
                </div>
              </div>
              
              {/* Undo/Redo */}
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleUndo(fabricCanvas)}
                  disabled={!canUndo || !fabricCanvas}
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRedo(fabricCanvas)}
                  disabled={!canRedo || !fabricCanvas}
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          {currentStep === 1 && !selectedProduct ? (
            <div className="text-center">
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Choose Your Product</h2>
              <p className="text-gray-600 mb-6">Select a product to start designing</p>
              <Button 
                size="lg" 
                onClick={() => dispatch(setShowProductModal(true))}
                className="bg-black hover:bg-gray-800 text-white"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <CentralCanvas />
          )}
        </div>

        {/* Right Panel - Product Info & Pricing */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {selectedProduct ? (
            <>
              <div className="flex-1 overflow-y-auto">
                <ProductPanel />
              </div>
              
              {/* Bottom Action Buttons */}
              <div className="p-4 border-t border-gray-200 space-y-3">
                {currentStep === 2 && (
                  <>
                    {hasDesignElements ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 text-green-700">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">Design ready!</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Coverage: {designAreaPercentage.toFixed(1)}% of product area
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-amber-700">
                          Add text, images, or templates to your design
                        </p>
                      </div>
                    )}
                  </>
                )}
                
                <Button
                  size="lg"
                  className="w-full bg-black hover:bg-gray-800 text-white disabled:opacity-50"
                  onClick={() => {
                    if (currentStep === 1) {
                      dispatch(setShowProductModal(true))
                    } else if (currentStep === 2) {
                      // Only proceed if design has been added
                      if (hasDesignElements) {
                        setCurrentStep(3)
                        setIsSizeModalOpen(true)
                      } else {
                        // Could show a toast here to inform user
                        alert("Please add a design to your product before continuing to checkout")
                      }
                    } else {
                      setIsSizeModalOpen(true)
                    }
                  }}
                  disabled={currentStep === 2 && !hasDesignElements}
                >
                  {currentStep === 1 
                    ? "Choose Product" 
                    : currentStep === 2 
                    ? "Continue to Checkout" 
                    : "Add to Cart"}
                </Button>
                
                {currentStep > 1 && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  >
                    Back
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p>No product selected</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => dispatch(setShowProductModal(false))}
        products={products}
        loading={loading}
      />

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => dispatch(setShowTemplateModal(false))}
      />

      <SizeQuantityModal
        open={isSizeModalOpen}
        onOpenChange={setIsSizeModalOpen}
        onAddToCart={(sizes) => {
          console.log('Adding to cart:', sizes)
          // Handle cart addition
          setIsCheckoutReady(true)
        }}
      />
    </div>
  )
}