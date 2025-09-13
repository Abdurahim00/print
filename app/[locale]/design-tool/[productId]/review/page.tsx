"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShoppingCart, Edit, Download, Check } from "lucide-react"
import Link from "next/link"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { useToast } from "@/components/ui/use-toast"

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
  
  // Load product and all designs
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load product
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) throw new Error('Failed to load product')
        const productData = await response.json()
        setProduct(productData)
        
        // Load all saved designs for this product
        const savedDesigns: DesignData[] = []
        const maxSteps = 4 // Check up to 4 steps
        const angleMap = { 1: 'front', 2: 'back', 3: 'left', 4: 'right' }
        
        for (let step = 1; step <= maxSteps; step++) {
          const storageKey = `design_${productId}_step_${step}`
          const savedDesign = localStorage.getItem(storageKey)
          
          if (savedDesign) {
            try {
              const designData = JSON.parse(savedDesign)
              
              // Only include designs that actually have content
              if (designData.canvasJSON?.objects && designData.canvasJSON.objects.length > 0) {
                savedDesigns.push({
                  ...designData,
                  angle: designData.angle || angleMap[step as keyof typeof angleMap],
                  imageUrl: `/api/design/preview/${productId}/${step}` // Placeholder URL
                })
                console.log(`🎨 Found design for step ${step} with ${designData.canvasJSON.objects.length} objects`)
              } else {
                console.log(`⚠️ Step ${step} has no design objects`)
              }
            } catch (error) {
              console.error(`Error parsing design for step ${step}:`, error)
            }
          } else {
            console.log(`💭 No saved design for step ${step}`)
          }
        }
        
        setDesigns(savedDesigns)
        setLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setLoading(false)
      }
    }
    
    loadData()
  }, [productId])
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!product) return 0
    
    const basePrice = product.price || 0
    const pricePerCm2 = 5 // 5 SEK per cm² for design
    
    const totalDesignArea = designs.reduce((sum, design) => {
      return sum + (design.designAreaCm2 || 0)
    }, 0)
    
    console.log(`💰 Review price calc - Base: ${basePrice} SEK, Total area: ${totalDesignArea} cm², Total: ${basePrice + (totalDesignArea * pricePerCm2)} SEK`)
    return basePrice + (totalDesignArea * pricePerCm2)
  }
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product || designs.length === 0) return
    
    setIsAddingToCart(true)
    
    try {
      // Combine all designs into cart item
      const cartItem = {
        id: `${productId}_${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productImage: product.frontImage || product.image,
        price: product.price,
        quantity: 1,
        designs: designs.map(design => ({
          angle: design.angle,
          stepNumber: design.stepNumber,
          canvasJSON: design.canvasJSON,
          designAreaCm2: design.designAreaCm2,
          designAreaPercentage: design.designAreaPercentage
        })),
        totalDesignArea: designs.reduce((sum, d) => sum + d.designAreaCm2, 0),
        totalPrice: calculateTotalPrice()
      }
      
      // Add to cart
      dispatch(addToCart(cartItem))
      
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
    const locale = window.location.pathname.split('/')[1] || 'en'
    router.push(`/${locale}/design-tool/${productId}/step/${stepNumber}`)
  }
  
  // Handle download design
  const handleDownloadDesign = async (design: DesignData) => {
    // This would export the design as an image
    console.log('Downloading design:', design)
    // Implementation would use fabric.js to render and export
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
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  const locale = window.location.pathname.split('/')[1] || 'en'
                  router.push(`/${locale}/design-tool/${productId}/step/${designs.length || 1}`)
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Design
              </Button>
              <div>
                <h1 className="text-xl font-bold">Review Your Designs</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Price</p>
                <p className="text-2xl font-bold">${calculateTotalPrice().toFixed(2)}</p>
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
                No designs created yet
              </p>
              <Button onClick={() => {
                const locale = window.location.pathname.split('/')[1] || 'en'
                router.push(`/${locale}/design-tool/${productId}/step/1`)
              }}>
                Start Designing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {designs.map((design) => (
              <Card key={design.stepNumber} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{design.angle.toUpperCase()} Design</span>
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      Step {design.stepNumber}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Design Preview */}
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    {/* Product Image Background */}
                    {product && (
                      <img
                        src={
                          design.angle === 'front' ? (product.frontImage || product.image) :
                          design.angle === 'back' ? product.backImage :
                          design.angle === 'left' ? product.leftImage :
                          design.angle === 'right' ? product.rightImage :
                          product.image
                        }
                        alt={`${product.name} - ${design.angle}`}
                        className="absolute inset-0 w-full h-full object-contain opacity-50"
                      />
                    )}
                    
                    {/* Design Status Overlay */}
                    {design.canvasJSON?.objects?.length > 0 ? (
                      <div className="relative z-10 text-center bg-white/90 dark:bg-gray-900/90 rounded-lg p-4">
                        <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Design Created
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {design.canvasJSON.objects.length} element{design.canvasJSON.objects.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-400 relative z-10">No design</p>
                    )}
                  </div>
                  
                  {/* Design Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Design Area:</span>
                      <span>{design.designAreaCm2?.toFixed(2) || 0} cm²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Coverage:</span>
                      <span>{design.designAreaPercentage?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Design Cost:</span>
                      <span>${((design.designAreaCm2 || 0) * 5).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditDesign(design.stepNumber)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownloadDesign(design)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
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
                  <span className="font-semibold">${product.price?.toFixed(2) || 0}</span>
                </div>
                {designs.map((design) => (
                  <div key={design.stepNumber} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {design.angle.toUpperCase()} Design ({design.designAreaCm2?.toFixed(1) || 0} cm²):
                    </span>
                    <span>${((design.designAreaCm2 || 0) * 5).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const locale = window.location.pathname.split('/')[1] || 'en'
              router.push(`/${locale}/design-tool/${productId}/step/1`)
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Designing
          </Button>
          
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={designs.length === 0 || isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Adding to Cart...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}