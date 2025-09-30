"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShoppingCart, Edit, Download, Check, Trash2, X } from "lucide-react"
import Link from "next/link"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addToCart, setCart, clearCart } from "@/lib/redux/slices/cartSlice"
import { useToast } from "@/components/ui/use-toast"
import type { CartItem } from "@/types"
import { DesignCanvasRenderer } from "@/components/DesignCanvasRenderer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Helper function to calculate design area from canvas objects (same logic as design tool)
const calculateDesignAreaFromCanvas = (canvasJSON: any): number => {
  if (!canvasJSON?.objects || canvasJSON.objects.length === 0) return 0
  
  try {
    // Standardize on 30cm x 30cm physical area for consistent calculations
    const physicalWidth = 30 // cm
    const physicalHeight = 30 // cm
    
    // Assume canvas is 600x600 pixels (standard from design tool)
    const canvasWidth = 600
    const canvasHeight = 600
    const pixelToCm = physicalWidth / canvasWidth
    
    let totalDesignAreaCm2 = 0
    
    canvasJSON.objects.forEach((obj: any) => {
      // Skip boundary indicators and background objects
      if (obj.visible && !obj.isBackground && !obj.isBoundaryIndicator) {
        // Get the bounding box of the object
        const width = (obj.width || 0) * (obj.scaleX || 1)
        const height = (obj.height || 0) * (obj.scaleY || 1)
        
        if (width > 0 && height > 0) {
          // Convert to cm²
          const widthCm = width * pixelToCm
          const heightCm = height * pixelToCm
          const areaCm2 = widthCm * heightCm
          
          // For text, adjust based on actual character coverage (approximately 60% of bounding box)
          if (obj.type === 'text' || obj.type === 'i-text') {
            totalDesignAreaCm2 += areaCm2 * 0.6
          } else {
            totalDesignAreaCm2 += areaCm2
          }
        }
      }
    })
    
    // Round to 1 decimal place for consistency
    return Math.round(totalDesignAreaCm2 * 10) / 10
  } catch (error) {
    console.warn('Error calculating design area from canvas:', error)
    return 0
  }
}

interface DesignData {
  stepNumber: number
  angle: string
  canvasJSON: any
  designAreaCm2: number
  designAreaPercentage: number
  timestamp: number
  imageUrl?: string
}

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  
  const productId = params.productId as string
  
  const [product, setProduct] = useState<any>(null)
  const [designs, setDesigns] = useState<DesignData[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [removingDesign, setRemovingDesign] = useState<number | null>(null)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  
  // Load product and all designs
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Debug: Log all localStorage keys for this product
        console.log('🔍 Debugging localStorage for product:', productId)
        const foundKeys: string[] = []
        const debugData: any = {}
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.includes(productId)) {
            foundKeys.push(key)
            console.log(`📦 Found key: ${key}`)
            
            if (key.includes('_area')) {
              const areaValue = localStorage.getItem(key)
              console.log(`   Area value: ${areaValue}`)
              debugData[key] = areaValue
            } else if (key.includes('_total')) {
              const totalValue = localStorage.getItem(key)
              console.log(`   Total value: ${totalValue}`)
              debugData[key] = totalValue
            } else {
              try {
                const data = JSON.parse(localStorage.getItem(key) || '{}')
                console.log(`   Design data:`, {
                  step: data.stepNumber,
                  angle: data.angle,
                  area: data.designAreaCm2,
                  objects: data.canvasJSON?.objects?.length || 0,
                  timestamp: data.timestamp ? new Date(data.timestamp).toLocaleString() : 'No timestamp'
                })
                debugData[key] = {
                  step: data.stepNumber,
                  angle: data.angle,
                  area: data.designAreaCm2,
                  objects: data.canvasJSON?.objects?.length || 0
                }
              } catch (e) {
                const rawValue = localStorage.getItem(key)
                console.log(`   Raw value: ${rawValue}`)
                debugData[key] = rawValue
              }
            }
          }
        }
        console.log('📊 Total keys found:', foundKeys.length, foundKeys)
        console.log('📊 All debug data:', debugData)
        
        // Load product
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) throw new Error('Failed to load product')
        const productData = await response.json()
        
        console.log('🛍️ Product data loaded:', {
          id: productData.id,
          name: productData.name,
          image: productData.image,
          frontImage: productData.frontImage,
          backImage: productData.backImage,
          leftImage: productData.leftImage,
          rightImage: productData.rightImage,
          hasVariations: productData.hasVariations,
          variations: productData.variations
        })
        
        setProduct(productData)
        
        // Load all saved designs for this product
        const savedDesigns: DesignData[] = []
        const maxSteps = 4 // Check up to 4 steps
        const angleMap = { 1: 'front', 2: 'back', 3: 'left', 4: 'right' }
        
        for (let step = 1; step <= maxSteps; step++) {
          const storageKey = `design_${productId}_step_${step}`
          const areaKey = `design_${productId}_step_${step}_area`
          const savedDesign = localStorage.getItem(storageKey)
          const savedArea = localStorage.getItem(areaKey)
          
          console.log(`🔍 Checking step ${step}:`, { 
            hasDesign: !!savedDesign, 
            hasArea: !!savedArea,
            areaValue: savedArea 
          })
          
          // Always create a design entry if we have either design data or area data
          let designEntry: DesignData | null = null
          
          if (savedDesign) {
            try {
              const designData = JSON.parse(savedDesign)
              
              // Check for design area in the main data or fallback to separate area key
              let designArea = designData.designAreaCm2 || 0
              if (designArea === 0 && savedArea) {
                designArea = parseFloat(savedArea) || 0
                designData.designAreaCm2 = designArea
                designData.designAreaPercentage = (designArea / 900) * 100
                console.log(`📏 Using area from separate key for step ${step}: ${designArea} cm²`)
              }
              
              // If we still have 0 area but have canvas objects, calculate it from canvas data
              if (designArea === 0 && designData.canvasJSON?.objects?.length > 0) {
                console.log(`⚠️ Step ${step} has objects but 0 area - calculating from canvas data`)
                const calculatedArea = calculateDesignAreaFromCanvas(designData.canvasJSON)
                if (calculatedArea > 0) {
                  designArea = calculatedArea
                  designData.designAreaCm2 = designArea
                  designData.designAreaPercentage = (designArea / 900) * 100
                  console.log(`📏 Calculated area for step ${step}: ${designArea} cm²`)
                } else {
                  // Fallback to small area if calculation fails
                  designArea = 0.1
                  designData.designAreaCm2 = designArea
                  designData.designAreaPercentage = (designArea / 900) * 100
                  console.log(`📏 Set fallback area for step ${step}: ${designArea} cm²`)
                }
              }
              
              // Always include the design entry, even if area is 0
              designEntry = {
                  ...designData,
                  angle: designData.angle || angleMap[step as keyof typeof angleMap],
                designAreaCm2: designArea,
                designAreaPercentage: (designArea / 900) * 100,
                imageUrl: `/api/design/preview/${productId}/${step}`
              }
              
              console.log(`🎨 Step ${step} analysis:`, {
                hasCanvasObjects: !!(designData.canvasJSON?.objects && designData.canvasJSON.objects.length > 0),
                hasDesignArea: designArea > 0,
                designArea,
                objectCount: designData.canvasJSON?.objects?.length || 0,
                angle: designEntry?.angle
              })
              
            } catch (error) {
              console.error(`Error parsing design for step ${step}:`, error)
            }
          }
          
          // If no design data but we have area data, create a minimal design entry
          if (!designEntry && savedArea) {
            const area = parseFloat(savedArea) || 0
            if (area > 0) {
              designEntry = {
                stepNumber: step,
                angle: angleMap[step as keyof typeof angleMap],
                canvasJSON: { objects: [] },
                designAreaCm2: area,
                designAreaPercentage: (area / 900) * 100,
                timestamp: Date.now(),
                imageUrl: `/api/design/preview/${productId}/${step}`
              }
              console.log(`✅ Created area-only design for step ${step} (${designEntry.angle}) with area: ${area} cm²`)
            }
          }
          
          // If we still have no design entry but have saved design data, try to create one with calculated area
          if (!designEntry && savedDesign) {
            try {
              const designData = JSON.parse(savedDesign)
              if (designData.canvasJSON?.objects?.length > 0) {
                const calculatedArea = calculateDesignAreaFromCanvas(designData.canvasJSON)
                designEntry = {
                  ...designData,
                  angle: designData.angle || angleMap[step as keyof typeof angleMap],
                  designAreaCm2: calculatedArea,
                  designAreaPercentage: (calculatedArea / 900) * 100,
                  imageUrl: `/api/design/preview/${productId}/${step}`
                }
                if (designEntry) {
                  console.log(`✅ Created design entry with calculated area for step ${step} (${designEntry.angle}) with area: ${calculatedArea} cm²`)
                }
              }
            } catch (error) {
              console.error(`Error creating design entry for step ${step}:`, error)
            }
          }
          
          // If still no design entry, create an empty one to show the step exists
          if (!designEntry) {
            designEntry = {
              stepNumber: step,
              angle: angleMap[step as keyof typeof angleMap],
              canvasJSON: { objects: [] },
              designAreaCm2: 0,
              designAreaPercentage: 0,
              timestamp: Date.now(),
              imageUrl: `/api/design/preview/${productId}/${step}`
            }
            console.log(`📝 Created empty design entry for step ${step} (${designEntry.angle})`)
          }
          
          // Only add designs that have actual content (objects or area > 0)
          const hasContent = (designEntry.canvasJSON?.objects?.length || 0) > 0 || designEntry.designAreaCm2 > 0
          if (hasContent) {
            savedDesigns.push(designEntry)
            console.log(`✅ Added design for step ${step} (${designEntry.angle}) with area: ${designEntry.designAreaCm2} cm², objects: ${designEntry.canvasJSON?.objects?.length || 0}`)
          } else {
            console.log(`⚠️ Step ${step} has no content - skipping`)
          }
        }
        
        console.log(`📊 Final designs loaded:`, savedDesigns.map(d => ({
          step: d.stepNumber,
          angle: d.angle,
          area: d.designAreaCm2,
          objects: d.canvasJSON?.objects?.length || 0
        })))
        
        setDesigns(savedDesigns)
        setLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setLoading(false)
      }
    }
    
    loadData()
  }, [productId, refreshKey])
  
  // Add a refresh function to reload data
  const refreshData = () => {
    setRefreshKey(prev => prev + 1)
  }
  
  // Calculate total price - using same cumulative logic as design tool
  const calculateTotalPrice = () => {
    if (!product) return 0
    
    const basePrice = product.price || 0
    const pricePerCm2 = product.designCostPerCm2 || 0.5
    
    // Use the same cumulative calculation as design tool
    // Check if we have a saved total from the last step (try all steps to find the highest)
    let savedLastStepTotal = null
    let lastStepNumber = 0
    
    for (let step = 4; step >= 1; step--) {
      const stepTotalKey = `design_${productId}_step_${step}_total`
      const stepTotal = localStorage.getItem(stepTotalKey)
      if (stepTotal) {
        savedLastStepTotal = stepTotal
        lastStepNumber = step
        break
      }
    }
    
    if (savedLastStepTotal) {
      // Use the saved cumulative total from the design tool
      const totalPrice = Math.round(parseFloat(savedLastStepTotal) * 100) / 100
      console.log(`💰 Review price calc - Using saved cumulative total from step ${lastStepNumber}: ${totalPrice} SEK`)
      return totalPrice
    }
    
    // Fallback: calculate cumulative total step by step (same as design tool)
    let runningTotal = basePrice
    const maxSteps = 4
    
    for (let step = 1; step <= maxSteps; step++) {
      const areaKey = `design_${productId}_step_${step}_area`
      const savedArea = localStorage.getItem(areaKey)
      
      if (savedArea) {
        const area = Math.round(parseFloat(savedArea) * 10) / 10 // Round to 1 decimal
        const stepCost = Math.round(area * pricePerCm2 * 100) / 100
        runningTotal = Math.round((runningTotal + stepCost) * 100) / 100
        console.log(`💰 Step ${step}: area=${area} cm², cost=${stepCost} SEK, running total=${runningTotal} SEK`)
      }
    }
    
    console.log(`💰 Review price calc - Final total: ${runningTotal} SEK`)
    return runningTotal
  }
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product || designs.length === 0) return
    
    setIsAddingToCart(true)
    
    try {
      // Calculate the total price including design costs
      const totalPrice = calculateTotalPrice()
      
      // Combine all designs into cart item
      const cartItem: any = {
        // Spread the product to get all required Product properties
        ...product,
        // Override with custom values
        id: `${productId}_${Date.now()}`,
        price: totalPrice,
        quantity: 1,
        // Additional properties for design items
        productId: product.id,
        designs: designs.map(design => {
          // Get the correct product image for this angle
          const productImage = design.angle === 'front' ? (product.frontImage || product.image) :
            design.angle === 'back' ? product.backImage :
            design.angle === 'left' ? product.leftImage :
            design.angle === 'right' ? product.rightImage :
            product.image
            
          console.log(`🛒 Adding design for ${design.angle} with image:`, productImage)
          
          return {
            angle: design.angle,
            stepNumber: design.stepNumber,
            canvasJSON: design.canvasJSON,
            designAreaCm2: design.designAreaCm2,
            designAreaPercentage: design.designAreaPercentage,
            productImage: productImage // Add the correct product image for this angle
          }
        }),
        totalDesignArea: designs.reduce((sum, d) => sum + d.designAreaCm2, 0),
        totalPrice: totalPrice,
        // Add design cost breakdown for cart display
        designCosts: {
          totalDesignAreaCm2: designs.reduce((sum, d) => sum + d.designAreaCm2, 0),
          costPerCm2: product.designCostPerCm2 || 0.5,
          totalDesignCost: totalPrice - product.price,
          breakdown: {
            objectCount: designs.reduce((sum, d) => sum + (d.canvasJSON?.objects?.length || 0), 0),
            boundingBox: { width: 0, height: 0 },
            frameUsagePercentage: 0
          }
        }
      }
      
      // Debug: Log the cart item being added
      console.log('🛒 Adding to cart:', {
        id: cartItem.id,
        name: cartItem.name,
        price: cartItem.price,
        basePrice: (cartItem as any).basePrice,
        totalPrice: (cartItem as any).totalPrice,
        designCosts: cartItem.designCosts,
        totalDesignArea: (cartItem as any).totalDesignArea,
        hasDesigns: !!(cartItem as any).designs,
        designsLength: (cartItem as any).designs?.length
      })
      
      // Clear the cart completely to avoid conflicts with old data
      dispatch(clearCart())
      
      // Also clear localStorage to prevent conflicts
      localStorage.removeItem('cart')
      
      // If user is authenticated, also clear the database cart
      try {
        const userId = (window as any).__CURRENT_USER_ID__
        if (userId && userId !== 'guest') {
          console.log('🛒 Clearing database cart for user:', userId)
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, items: [] })
          })
        }
      } catch (error) {
        console.error('Failed to clear database cart:', error)
      }
      
      // Add the new cart item
      dispatch(setCart([cartItem]))
      
      // If user is authenticated, also update the database cart
      try {
        const userId = (window as any).__CURRENT_USER_ID__
        if (userId && userId !== 'guest') {
          console.log('🛒 Updating database cart for user:', userId)
          console.log('🛒 Cart item being sent to database:', {
            name: cartItem.name,
            hasDesignsArray: !!(cartItem as any).designs,
            designsArrayLength: (cartItem as any).designs?.length || 0,
            designs: (cartItem as any).designs
          })
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, items: [cartItem] })
          })
        }
      } catch (error) {
        console.error('Failed to update database cart:', error)
      }
      
      // Clear saved designs from localStorage (optional)
      // designs.forEach(design => {
      //   localStorage.removeItem(`design_${productId}_step_${design.stepNumber}`)
      // })
      
      toast({
        title: "Added to cart!",
        description: `${product.name} with ${designs.length} custom designs`,
        duration: 3000,
      })
      
      // Redirect to cart
      setTimeout(() => {
        router.push('/cart')
      }, 1000)
      
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsAddingToCart(false)
    }
  }
  
  // Handle edit design
  const handleEditDesign = (stepNumber: number) => {
    // Force save any current design before editing
    if (typeof window !== 'undefined' && (window as any).saveCurrentDesign) {
      (window as any).saveCurrentDesign()
    }
    
    const locale = window.location.pathname.split('/')[1] || 'en'
    router.push(`/${locale}/design-tool/${productId}/step/${stepNumber}`)
  }
  
  // Handle download design
  const handleDownloadDesign = async (design: DesignData) => {
    // This would export the design as an image
    console.log('Downloading design:', design)
    // Implementation would use fabric.js to render and export
  }

  // Handle remove design
  const handleRemoveDesign = (stepNumber: number) => {
    setRemovingDesign(stepNumber)
    setShowRemoveDialog(true)
  }

  // Confirm remove design
  const confirmRemoveDesign = async () => {
    if (removingDesign === null) return

    try {
      const stepNumber = removingDesign
      
      // Remove from localStorage
      const storageKey = `design_${productId}_step_${stepNumber}`
      const areaKey = `design_${productId}_step_${stepNumber}_area`
      const totalKey = `design_${productId}_step_${stepNumber}_total`
      
      localStorage.removeItem(storageKey)
      localStorage.removeItem(areaKey)
      localStorage.removeItem(totalKey)
      
      console.log(`🗑️ Removed design data for step ${stepNumber}`)
      
      // Update local state
      setDesigns(prevDesigns => prevDesigns.filter(design => design.stepNumber !== stepNumber))
      
      toast({
        title: "Design Removed",
        description: `The ${getAngleName(stepNumber)} design has been successfully removed.`,
        duration: 3000,
      })
      
    } catch (error) {
      console.error('Error removing design:', error)
      toast({
        title: "Error",
        description: "Failed to remove design. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setShowRemoveDialog(false)
      setRemovingDesign(null)
    }
  }

  // Get angle name from step number
  const getAngleName = (stepNumber: number): string => {
    const angleMap = { 1: 'front', 2: 'back', 3: 'left', 4: 'right' }
    return angleMap[stepNumber as keyof typeof angleMap] || 'design'
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading designs...</p>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Product not found</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - Responsive */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const locale = window.location.pathname.split('/')[1] || 'en'
                  router.push(`/${locale}/design-tool/${productId}/step/${designs.length || 1}`)
                }}
                className="h-8 sm:h-10"
              >
                <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Back</span>
              </Button>
              <div>
                <h1 className="text-sm sm:text-xl font-bold">Review Your Designs</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {product.name}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                className="text-[10px] sm:text-xs h-7 sm:h-8"
              >
                🔄 <span className="hidden sm:inline ml-1">Refresh</span>
              </Button>
              <div className="text-right">
                <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400">Total Price</p>
                <p className="text-lg sm:text-2xl font-bold">{calculateTotalPrice().toFixed(2)} kr</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {designs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No designs found. This might be a data loading issue.
              </p>
              <div className="space-y-2">
                <Button onClick={refreshData} className="mr-2">
                  🔄 Refresh Data
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const locale = window.location.pathname.split('/')[1] || 'en'
                    router.push(`/${locale}/design-tool/${productId}/step/1`)
                  }}
                >
                  Start Designing
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {designs.map((design) => (
              <Card key={design.stepNumber} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{design.angle.toUpperCase()} Design</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                        Step {design.stepNumber}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveDesign(design.stepNumber)}
                        title={`Remove ${design.angle} design`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Design Preview - Responsive with maintained aspect ratio */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center w-full aspect-square max-w-[600px] mx-auto">
                    {product && design.canvasJSON?.objects?.length > 0 ? (
                      <>
                    {/* Product Image Background */}
                        {(() => {
                          const imageUrl = design.angle === 'front' ? (product.frontImage || product.image) :
                            design.angle === 'back' ? product.backImage :
                            design.angle === 'left' ? product.leftImage :
                            design.angle === 'right' ? product.rightImage :
                            product.image
                          
                          console.log(`🖼️ Image selection for ${design.angle}:`, {
                            angle: design.angle,
                            frontImage: product.frontImage,
                            backImage: product.backImage,
                            leftImage: product.leftImage,
                            rightImage: product.rightImage,
                            defaultImage: product.image,
                            selectedUrl: imageUrl
                          })
                          
                          return (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img
                                src={imageUrl}
                                alt={`${product.name} - ${design.angle}`}
                                className="object-contain max-w-full max-h-full"
                                style={{ 
                                  width: 'auto',
                                  height: 'auto',
                                  maxWidth: '100%', 
                                  maxHeight: '100%'
                                }}
                                onError={(e) => {
                                  console.error(`❌ Failed to load image for ${design.angle}:`, imageUrl)
                                  console.error('Product data:', product)
                                }}
                                onLoad={() => {
                                  console.log(`✅ Successfully loaded image for ${design.angle}:`, imageUrl)
                                }}
                              />
                              {/* Debug overlay showing the angle and URL */}
                              <div className="absolute top-1 left-1 bg-red-500 text-white text-sm font-bold px-3 py-2 rounded z-20 border-2 border-white">
                                {design.angle.toUpperCase()}
                              </div>
                              <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded z-20 max-w-[200px] truncate border border-white">
                                {imageUrl.split('/').pop()}
                              </div>
                              <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded z-20 border border-white">
                                {design.angle === 'front' ? '🟢' : design.angle === 'back' ? '🔴' : design.angle === 'left' ? '🟡' : '🟣'}
                              </div>
                            </div>
                          )
                        })()}
                        
                        {/* Design Canvas Overlay */}
                        <DesignCanvasRenderer
                          canvasJSON={design.canvasJSON}
                          productImage={
                          design.angle === 'front' ? (product.frontImage || product.image) :
                          design.angle === 'back' ? product.backImage :
                          design.angle === 'left' ? product.leftImage :
                          design.angle === 'right' ? product.rightImage :
                          product.image
                        }
                          angle={design.angle}
                        />
                        
                        {/* Design Info Badge */}
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium z-20">
                          {design.canvasJSON.objects.length} element{design.canvasJSON.objects.length !== 1 ? 's' : ''}
                        </div>
                      </>
                    ) : product ? (
                      <>
                        {/* Product Image Background */}
                        {(() => {
                          const imageUrl = design.angle === 'front' ? (product.frontImage || product.image) :
                            design.angle === 'back' ? product.backImage :
                            design.angle === 'left' ? product.leftImage :
                            design.angle === 'right' ? product.rightImage :
                            product.image
                          
                          console.log(`🖼️ Fallback image selection for ${design.angle}:`, {
                            angle: design.angle,
                            selectedUrl: imageUrl
                          })
                          
                          return (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img
                                src={imageUrl}
                                alt={`${product.name} - ${design.angle}`}
                                className="object-contain max-w-full max-h-full opacity-50"
                                style={{ 
                                  width: 'auto',
                                  height: 'auto',
                                  maxWidth: '100%', 
                                  maxHeight: '100%'
                                }}
                                onError={(e) => {
                                  console.error(`❌ Failed to load fallback image for ${design.angle}:`, imageUrl)
                                }}
                                onLoad={() => {
                                  console.log(`✅ Successfully loaded fallback image for ${design.angle}:`, imageUrl)
                                }}
                              />
                              {/* Debug overlay showing the angle and URL */}
                              <div className="absolute top-1 left-1 bg-red-500 text-white text-sm font-bold px-3 py-2 rounded z-20 border-2 border-white">
                                {design.angle.toUpperCase()} (NO DESIGN)
                              </div>
                              <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded z-20 max-w-[200px] truncate border border-white">
                                {imageUrl.split('/').pop()}
                              </div>
                              <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded z-20 border border-white">
                                {design.angle === 'front' ? '🟢' : design.angle === 'back' ? '🔴' : design.angle === 'left' ? '🟡' : '🟣'}
                              </div>
                            </div>
                          )
                        })()}
                        
                        {/* No Design Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center bg-white/90 dark:bg-gray-900/90 rounded-lg p-4">
                            <p className="text-gray-400 text-sm">No design</p>
                          </div>
                      </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-400">Loading...</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Design Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Design Area:</span>
                      <span className={design.designAreaCm2 > 0 ? "font-medium" : "text-gray-400"}>
                        {(Math.round((design.designAreaCm2 || 0) * 10) / 10).toFixed(1)} cm²
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Coverage:</span>
                      <span className={design.designAreaPercentage > 0 ? "font-medium" : "text-gray-400"}>
                        {(design.designAreaPercentage || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Design Cost:</span>
                      <span className={design.designAreaCm2 > 0 ? "font-medium text-green-600" : "text-gray-400"}>
                        {((design.designAreaCm2 || 0) * (product.designCostPerCm2 || 0.5)).toFixed(2)} kr
                      </span>
                    </div>
                    {design.canvasJSON?.objects?.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Elements:</span>
                        <span className="font-medium text-blue-600">
                          {design.canvasJSON.objects.length} item{design.canvasJSON.objects.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions - Responsive */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditDesign(design.stepNumber)}
                    >
                      <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownloadDesign(design)}
                    >
                      <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="sm:px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                      onClick={() => handleRemoveDesign(design.stepNumber)}
                      title={`Remove ${design.angle} design`}
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-0" />
                      <span className="sm:hidden ml-1 text-xs">Remove</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add more designs card */}
            {designs.length < 4 && (
              <Card className="border-dashed border-2 flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Add more designs to other sides
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const locale = window.location.pathname.split('/')[1] || 'en'
                      router.push(`/${locale}/design-tool/${productId}/step/${designs.length + 1}`)
                    }}
                  >
                    Add Design
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {/* Summary Card */}
        {designs.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Product Price:</span>
                  <span className="font-semibold">{product.price?.toFixed(2) || 0} kr</span>
                </div>
                 {designs.map((design) => {
                   // Calculate design cost using the same logic as individual design cards
                   const designCost = (design.designAreaCm2 || 0) * (product.designCostPerCm2 || 0.5)
                   return (
                     <div key={design.stepNumber} className="flex justify-between text-sm">
                       <span className="text-gray-600 dark:text-gray-400">
                         {design.angle.toUpperCase()} Design ({design.designAreaCm2?.toFixed(1) || 0} cm²):
                       </span>
                       <span>{designCost.toFixed(2)} kr</span>
                     </div>
                   )
                 })}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{calculateTotalPrice().toFixed(2)} kr</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Action Buttons - Responsive */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => {
              const locale = window.location.pathname.split('/')[1] || 'en'
              router.push(`/${locale}/design-tool/${productId}/step/1`)
            }}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Continue Designing</span>
          </Button>

          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={designs.length === 0 || isAddingToCart}
            className="w-full sm:w-auto"
          >
            {isAddingToCart ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Adding to Cart...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Add to Cart</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Remove Design Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Remove Design
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the {getAngleName(removingDesign || 1)} design? 
              This action cannot be undone and will permanently delete your design from this product angle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveDesign}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Design
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}