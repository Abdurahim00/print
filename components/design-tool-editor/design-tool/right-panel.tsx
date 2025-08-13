"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { createDesign, updateDesign } from "@/lib/redux/slices/designsSlice"
import { applyDesignToFavorites } from "@/lib/redux/slices/favoritesSlice"
import { setShowProductModal } from "@/lib/redux/designToolSlices/designSlice"
import { TopHeader } from "./top-header"
import { ProductPanel } from "./panels/product-panel"
import { TextPanel } from "./panels/text-panel"
import { TemplatePanel } from "./panels/template-panel"
import { UploadPanel } from "./panels/upload-panel"
import { Button } from "@/components/ui/button"
import { Save, Loader2, Shirt } from "lucide-react"
import { RootState } from "@/lib/redux/store"
import { useToast } from "@/components/ui/use-toast"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"

export function RightPanel({ isMobile = false }: { isMobile?: boolean }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const { selectedTool, selectedProduct, productColor, viewMode, selectedTemplate } = useSelector((state: RootState) => state.design)
  
  // State for saving
  const [isSaving, setIsSaving] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const renderPanel = () => {
    // If no product is selected, show a guidance message
    if (!selectedProduct) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6">
          <div className="text-center text-gray-500">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
              <Shirt className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start Your Design</h3>
            <p className="text-sm text-gray-400 mb-6">Select a product from the left toolbar to begin designing</p>
            <Button 
              onClick={() => dispatch(setShowProductModal(true))}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Browse Products
            </Button>
          </div>
        </div>
      );
    }

    // Otherwise render the appropriate panel based on selected tool
    switch (selectedTool) {
      case "product":
        return <ProductPanel />
      case "text":
        return <TextPanel />
      case "template":
        return <TemplatePanel />
      case "upload":
        return <UploadPanel />
      default:
        return <ProductPanel />
    }
  }

  // Function to create composite preview image with product background and design elements
  const createCompositePreview = async (canvas: HTMLCanvasElement, product: any): Promise<string> => {
    try {
      // Create a new canvas for compositing
      const compositeCanvas = document.createElement('canvas')
      const ctx = compositeCanvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      // Set canvas size (adjust as needed for preview)
      const width = 400
      const height = 400
      compositeCanvas.width = width
      compositeCanvas.height = height

      // Fill with white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      // Get current product image URL
      const getProductImageUrl = () => {
        if (!product) return null
        
        // Handle products with variations
        if (product.hasVariations && product.variations) {
          const currentVariation = product.variations.find((v: any) => v.color.hex_code === productColor)
          if (currentVariation) {
            const imageForAngle = currentVariation.images?.find((img: any) => img.angle === viewMode && img.url)
            if (imageForAngle) {
              return imageForAngle.url
            }
            // Fallback to front view if current view mode not available
            const frontImage = currentVariation.images?.find((img: any) => img.angle === "front" && img.url)
            if (frontImage) {
              return frontImage.url
            }
            return currentVariation.color.swatch_image || product.image
          }
        }
        return product.image
      }

      const productImageUrl = getProductImageUrl()

      // Load and draw product background image if available
      if (productImageUrl) {
        try {
          const productImg = new Image()
          productImg.crossOrigin = 'anonymous'
          
          await new Promise((resolve, reject) => {
            productImg.onload = resolve
            productImg.onerror = reject
            productImg.src = productImageUrl
          })

          // Calculate scaling to fit the product image in the canvas while maintaining aspect ratio
          const scale = Math.min(width / productImg.width, height / productImg.height) * 0.8 // 0.8 to leave some margin
          const scaledWidth = productImg.width * scale
          const scaledHeight = productImg.height * scale
          const x = (width - scaledWidth) / 2
          const y = (height - scaledHeight) / 2

          ctx.drawImage(productImg, x, y, scaledWidth, scaledHeight)
        } catch (error) {
          console.warn('Could not load product image for preview:', error)
        }
      }

      // Draw the design canvas on top
      if (canvas) {
        // Calculate scaling for the design canvas
        const canvasScale = Math.min(width / canvas.width, height / canvas.height) * 0.6 // Smaller scale for design overlay
        const scaledCanvasWidth = canvas.width * canvasScale
        const scaledCanvasHeight = canvas.height * canvasScale
        const canvasX = (width - scaledCanvasWidth) / 2
        const canvasY = (height - scaledCanvasHeight) / 2

        ctx.drawImage(canvas, canvasX, canvasY, scaledCanvasWidth, scaledCanvasHeight)
      }

      return compositeCanvas.toDataURL('image/png', 0.9)
    } catch (error) {
      console.error('Error creating composite preview:', error)
      // Fallback to just the canvas if composite creation fails
      return canvas.toDataURL('image/png')
    }
  }

  const handleSaveDesign = async () => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      setShowAuthDialog(true)
      return
    }
    
    try {
      setIsSaving(true)
      
      // Get canvas data
      const canvas = document.getElementById('design-canvas') as HTMLCanvasElement
      if (!canvas) {
        toast({
          title: "Error",
          description: "Canvas not found. Please try again.",
          variant: "destructive"
        })
        setIsSaving(false)
        return
      }

      // Get fabric.js canvas instance and export JSON
      const fabricCanvas = (window as any).fabricCanvas
      const canvasJSON = fabricCanvas ? fabricCanvas.toJSON(['isTemplate', 'minFontSize', 'maxFontSize', '_originalFontSize', '_bendAmount']) : null

      // Create composite preview image with product background and design elements (kept for reference)
      const compositePreview = await createCompositePreview(canvas, selectedProduct)
      // Design-only preview with transparent background (used for applying to favorites)
      const designOnlyPreview = canvas.toDataURL('image/png')

      // Get the selected variation details if applicable
      const getSelectedVariationDetails = () => {
        if (!selectedProduct.hasVariations || !selectedProduct.variations) {
          return null
        }
        
        const selectedVariation = selectedProduct.variations.find((v: any) => 
          v.color.hex_code === productColor
        )
        
        return selectedVariation ? {
          variationId: selectedVariation.id,
          colorName: selectedVariation.color.name,
          colorHexCode: selectedVariation.color.hex_code,
          colorSwatchImage: selectedVariation.color.swatch_image,
          variationPrice: selectedVariation.price,
          variationImages: selectedVariation.images,
        } : null
      }

      const selectedVariationDetails = getSelectedVariationDetails()

      // Create design data with complete product reference
      const designData = {
        name: `${selectedProduct.name} Design`,
        type: selectedProduct.type || "design",
        // Use composite (product + design) for the saved preview so dashboards show the actual product mockup
        // The design-only image is still stored separately in designData.canvasData for applying to favorites
        preview: compositePreview,
        userId: (session?.user as any)?.id || "",
        designData: {
          // Complete product reference
          product: {
            id: selectedProduct.id,
            name: selectedProduct.name,
            type: selectedProduct.type,
            baseColor: selectedProduct.baseColor,
            price: selectedProduct.price,
            image: selectedProduct.image,
            description: selectedProduct.description,
            hasVariations: selectedProduct.hasVariations,
            variations: selectedProduct.variations,
            angles: selectedProduct.angles,
            colors: selectedProduct.colors,
            categoryId: selectedProduct.categoryId,
            inStock: selectedProduct.inStock,
          },
          
          // Selected state details
          selectedState: {
            viewMode: viewMode,
            productColor: productColor,
            selectedVariation: selectedVariationDetails,
            selectedTemplate: selectedTemplate ? {
              id: selectedTemplate.id,
              name: selectedTemplate.name,
              category: selectedTemplate.category,
              image: selectedTemplate.image,
              price: selectedTemplate.price,
            } : null,
          },
          
          // Canvas and design elements
          canvasData: designOnlyPreview,
          canvasSize: { width: canvas.width, height: canvas.height },
          overlay: { scale: 0.6 },
          // Keep composite as optional for future use (galleries, etc.)
          previewComposite: compositePreview,
          canvasJSON: canvasJSON, // Store the full fabric.js canvas state with custom properties
          elements: fabricCanvas ? fabricCanvas.getObjects().map((obj: any) => ({
            type: obj.type,
            id: obj.id || `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            properties: {
              left: obj.left,
              top: obj.top,
              width: obj.width,
              height: obj.height,
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
              angle: obj.angle,
              text: obj.text,
              fontFamily: obj.fontFamily,
              fontSize: obj.fontSize,
              fontWeight: obj.fontWeight,
              fontStyle: obj.fontStyle,
              textAlign: obj.textAlign,
              fill: obj.fill,
              stroke: obj.stroke,
              src: obj.src, // For images
              isTemplate: obj.isTemplate, // Custom property for templates
              _originalFontSize: obj._originalFontSize, // For text scaling
              _bendAmount: obj._bendAmount, // For text bending
            }
          })) : [],
          
          // Legacy fields for backward compatibility
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          productType: selectedProduct.type,
          viewMode: viewMode,
          productColor: productColor,
        },
        status: "Draft" as const,
      }

      // Determine if we're editing an existing design
      const editingDesignId = searchParams.get('designId')

      // Save or update design using Redux action
      const resultAction = editingDesignId
        ? await dispatch(updateDesign({ id: editingDesignId, ...designData } as any) as any)
        : await dispatch(createDesign(designData) as any)
      
      if (createDesign.fulfilled.match(resultAction) || updateDesign.fulfilled.match(resultAction)) {
        const saved = (resultAction as any).payload
        const tryCategoryFromSaved = saved?.designData?.product?.categoryId
        const tryCategoryFromComposed = designData.designData?.product?.categoryId
        const tryCategoryFromSelected = (selectedProduct as any)?.categoryId
        // As a final fallback, attempt to fetch product by id and read categoryId (only if missing)
        let categoryIdResolved = tryCategoryFromSaved || tryCategoryFromComposed || tryCategoryFromSelected
        if (!categoryIdResolved) {
          try {
            const productId = saved?.designData?.product?.id || designData.designData?.product?.id || (selectedProduct as any)?.id
            if (productId) {
              console.log("🔥 [RightPanel] Fallback fetch to resolve categoryId", { productId })
              const res = await fetch(`/api/products/${productId}`)
              if (res.ok) {
                const fullProduct = await res.json()
                categoryIdResolved = fullProduct?.categoryId
                console.log("🔥 [RightPanel] Fallback resolved categoryId", { categoryIdResolved })
              }
            }
          } catch (e) {
            console.warn("🔥 [RightPanel] Fallback fetch failed", e)
          }
        }
        console.log("🔥🔥 [RightPanel] Design save fulfilled", { savedId: saved?.id, editingDesignId, categoryId: tryCategoryFromSaved, categoryIdResolved })
        // Auto-apply this design to all favorites in same category (optimistic handled in slice)
        try {
          const categoryIdForApply = categoryIdResolved
          const designIdForApply = saved?.id || editingDesignId
          if (categoryIdForApply && designIdForApply && (session?.user as any)?.id) {
            console.log("🔥 [RightPanel] Dispatch applyDesignToFavorites", { userId: (session?.user as any).id, categoryId: categoryIdForApply, designId: designIdForApply })
            await dispatch(applyDesignToFavorites({
              userId: (session?.user as any).id,
              categoryId: categoryIdForApply,
              designId: designIdForApply,
            }) as any)
          } else {
            console.log("🔥 [RightPanel] Skip auto-apply: missing categoryId/designId/userId", { categoryIdForApply, designIdForApply, userId: (session?.user as any)?.id })
          }
        } catch (e) {
          console.warn('🔥 [RightPanel] Failed to auto-apply design to favorites', e)
        }
        toast({
          title: "Design Saved Successfully!",
          description: "Your design has been saved to your dashboard.",
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-800 shadow-lg",
          duration: 5000
        })
        
        // Navigate to dashboard after short delay
        setTimeout(() => {
          router.push('/dashboard?tab=designs')
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: "Failed to save design. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving design:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isMobile) {
    return (
      <div className="bg-white border-t border-gray-200 max-h-72 flex flex-col">
        <div className="p-3 border-b border-gray-200 flex-shrink-0">
          <Button 
            onClick={handleSaveDesign}
            className="w-full bg-purple-700 hover:bg-purple-700 text-white transition-all duration-200 hover:scale-105"
            size="sm"
            disabled={isSaving || !selectedProduct}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Design
              </>
            )}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin">
          {renderPanel()}
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 lg:w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <TopHeader />
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <Button 
          onClick={handleSaveDesign}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 hover:scale-105"
          size="sm"
          disabled={isSaving || !selectedProduct}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Design
            </>
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin">
        <div className="h-full">
          {renderPanel()}
        </div>
      </div>
      
      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Authentication Required</DialogTitle>
            <DialogDescription className="text-center">
              You need to sign in or create an account to save your design.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <Button 
              onClick={() => {
                setShowAuthDialog(false)
                router.push('/login?returnUrl=/design-tool')
              }}
              className="bg-purple-700 hover:bg-purple-700 text-white"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => {
                setShowAuthDialog(false)
                router.push('/signup?returnUrl=/design-tool')
              }}
              variant="outline"
            >
              Create Account
            </Button>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              variant="ghost"
              onClick={() => setShowAuthDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
