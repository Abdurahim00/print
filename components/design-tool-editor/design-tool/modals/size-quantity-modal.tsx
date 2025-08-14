"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addToCartWithSizes } from "@/lib/redux/slices/cartSlice"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingCart, ChevronRight } from "lucide-react"
import { RootState } from "@/lib/redux/store"
import { SizePrice } from "@/lib/models/Product"
import { composeProductAndDesign } from "@/lib/utils/imageCompose"

interface SizeQuantityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart?: (selectedSizes: SelectedSizeQuantity[]) => void
}

export interface SelectedSizeQuantity {
  size: string
  quantity: number
  price: number
}

export function SizeQuantityModal({ open, onOpenChange, onAddToCart }: SizeQuantityModalProps) {
  const dispatch = useDispatch()
  const { selectedProduct, productColor, viewMode, selectedTemplate } = useSelector((state: RootState) => state.design)
  
  // Default sizes if not provided in product data
  const defaultSizes = [
    { size: "XS", price: 0, inStock: true, stockQuantity: 100 },
    { size: "S", price: 0, inStock: true, stockQuantity: 100 },
    { size: "M", price: 0, inStock: true, stockQuantity: 100 },
    { size: "L", price: 0, inStock: true, stockQuantity: 100 },
    { size: "XL", price: 0, inStock: true, stockQuantity: 100 },
    { size: "XXL", price: 5, inStock: true, stockQuantity: 50 }, // Extra charge for XXL
    { size: "3XL", price: 10, inStock: true, stockQuantity: 25 }, // Extra charge for 3XL
    { size: "4XL", price: 15, inStock: true, stockQuantity: 15 }, // Extra charge for 4XL
    { size: "5XL", price: 20, inStock: true, stockQuantity: 10 }, // Extra charge for 5XL
  ]
  
  // State for selected sizes and quantities
  const [selectedSizes, setSelectedSizes] = useState<SelectedSizeQuantity[]>([])
  const [basePrice, setBasePrice] = useState<number>(0)
  const [availableSizes, setAvailableSizes] = useState<SizePrice[]>([])
  
  // Get current variation based on selected color
  const getCurrentVariation = () => {
    if (!selectedProduct || !(selectedProduct as any).hasVariations || !(selectedProduct as any).variations) {
      return null
    }
    const variations = (selectedProduct as any).variations
    return variations.find((v: any) => v.color.hex_code === productColor) || variations[0]
  }
  
  // Initialize available sizes and base price when modal opens or product changes
  useEffect(() => {
    if (open && selectedProduct) {
      const currentVariation = getCurrentVariation()
      const productBasePrice = currentVariation?.price || selectedProduct.price || 0
      setBasePrice(productBasePrice)
      
      // Use size prices from variation if available, otherwise use default sizes
      let sizePrices = currentVariation?.sizePrices || 
        defaultSizes.map(size => ({
          ...size,
          price: productBasePrice + size.price,
          useBasePrice: true
        }))
        
      // Apply base price for any sizes that use it
      sizePrices = sizePrices.map(size => ({
        ...size,
        price: size.useBasePrice ? productBasePrice : size.price
      }))
      
      setAvailableSizes(sizePrices)
      
      // Initialize with empty quantities
      setSelectedSizes(
        sizePrices.map(size => ({
          size: size.size,
          quantity: 0,
          price: size.price
        }))
      )
    }
  }, [open, selectedProduct, productColor])
  
  // Update quantity for a specific size
  const updateQuantity = (sizeIndex: number, newQuantity: number) => {
    // Ensure quantity is not negative
    const validQuantity = Math.max(0, newQuantity)
    
    setSelectedSizes(prev => {
      const updated = [...prev]
      updated[sizeIndex] = {
        ...updated[sizeIndex],
        quantity: validQuantity
      }
      return updated
    })
  }
  
  // Calculate total price
  const calculateTotal = () => {
    return selectedSizes.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  }
  
  // Calculate total quantity
  const calculateTotalQuantity = () => {
    return selectedSizes.reduce((total, item) => total + item.quantity, 0)
  }
  
  // Create composite preview using reusable util
  const createCompositePreview = async (canvas: HTMLCanvasElement, product: any): Promise<string> => {
    // Determine base product image for current state
    const getProductImageUrl = () => {
      if (!product) return null
      if (product.hasVariations && product.variations) {
        const currentVariation = product.variations.find((v: any) => v.color.hex_code === productColor)
        if (currentVariation) {
          const imageForAngle = currentVariation.images?.find((img: any) => img.angle === viewMode && img.url)
          if (imageForAngle) return imageForAngle.url
          const frontImage = currentVariation.images?.find((img: any) => img.angle === "front" && img.url)
          if (frontImage) return frontImage.url
          return currentVariation.color.swatch_image || product.image
        }
      }
      return product.image
    }

    const base = getProductImageUrl()
    try {
      const overlay = canvas.toDataURL('image/png')
      if (!base) return overlay
      return await composeProductAndDesign({ productImageUrl: base, overlayImageUrl: overlay, targetWidth: 1200, overlayScale: 0.6 })
    } catch {
      return canvas.toDataURL('image/png')
    }
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    // Filter out sizes with quantity 0
    const sizesToAdd = selectedSizes.filter(item => item.quantity > 0)
    
    if (sizesToAdd.length === 0) {
      // Show error or notification that no sizes selected
      return
    }
    
    // Get canvas and create composite preview
    const canvas = document.getElementById('design-canvas') as HTMLCanvasElement
    const designPreview = canvas ? await createCompositePreview(canvas, selectedProduct) : undefined
    
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

    // Create enhanced product with complete context
    const productWithContext = {
      ...selectedProduct,
      // Add design context
      designContext: {
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
      }
    }
    
    // Collect canvas JSON if available for precise reproduction
    const fabricCanvas = (window as any).fabricCanvas
    const designCanvasJSON = fabricCanvas ? fabricCanvas.toJSON(['isTemplate','minFontSize','maxFontSize','_originalFontSize','_bendAmount']) : undefined

    // Dispatch action to add to cart with sizes and complete product context
    dispatch(addToCartWithSizes({
      product: { ...productWithContext },
      selectedSizes: sizesToAdd,
      designPreview,
      designCanvasJSON,
      // If we have a saved design, we could include its ID here
      // designId: savedDesignId
    }))
    
    // Also call the callback if provided
    if (onAddToCart) {
      onAddToCart(sizesToAdd)
    }
    
    // Close the modal
    onOpenChange(false)
  }
  
  // Format price with currency
  const formatPrice = (price: number) => {
    return `${price} kr`
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Select Size & Quantity</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto pr-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Size</TableHead>
                <TableHead className="w-1/3 text-right">Price</TableHead>
                <TableHead className="w-1/3 text-center">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedSizes.map((sizeItem, index) => {
                const stockInfo = availableSizes[index]
                const isOutOfStock = !stockInfo?.inStock || stockInfo?.stockQuantity <= 0
                
                return (
                  <TableRow key={sizeItem.size} className={isOutOfStock ? "opacity-50" : ""}>
                    <TableCell className="font-medium">{sizeItem.size}</TableCell>
                    <TableCell className="text-right">{formatPrice(sizeItem.price)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-md"
                          onClick={() => updateQuantity(index, sizeItem.quantity - 1)}
                          disabled={sizeItem.quantity <= 0 || isOutOfStock}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={sizeItem.quantity}
                          onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 0)}
                          className="w-12 h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                          max={stockInfo?.stockQuantity || 999}
                          disabled={isOutOfStock}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-md"
                          onClick={() => updateQuantity(index, sizeItem.quantity + 1)}
                          disabled={isOutOfStock || (stockInfo && sizeItem.quantity >= stockInfo.stockQuantity)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {isOutOfStock && (
                        <div className="text-xs text-red-500 text-center mt-1">Out of stock</div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Quantity:</span>
            <span className="font-medium">{calculateTotalQuantity()} items</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-900 font-medium">Total Price:</span>
            <span className="text-lg font-bold text-blue-600">{formatPrice(calculateTotal())}</span>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleAddToCart} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={calculateTotalQuantity() === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}