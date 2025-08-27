"use client"

import { useState } from "react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addToCartWithSizes } from "@/lib/redux/slices/cartSlice"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Product } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface SizeSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

// Common apparel sizes
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export function SizeSelectionModal({ open, onOpenChange, product }: SizeSelectionModalProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [selectedSizes, setSelectedSizes] = useState<{ size: string; quantity: number; price: number }[]>([])
  
  // Check if product has variations or is apparel
  const needsSizes = product.categoryId === 'apparel' || product.hasVariations
  const availableSizes = needsSizes ? APPAREL_SIZES : ['Standard']
  
  const handleQuantityChange = (size: string, delta: number) => {
    setSelectedSizes(prev => {
      const existing = prev.find(s => s.size === size)
      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + delta)
        if (newQuantity === 0) {
          return prev.filter(s => s.size !== size)
        }
        return prev.map(s => 
          s.size === size 
            ? { ...s, quantity: newQuantity }
            : s
        )
      } else if (delta > 0) {
        return [...prev, { size, quantity: 1, price: product.price }]
      }
      return prev
    })
  }
  
  const getQuantity = (size: string) => {
    return selectedSizes.find(s => s.size === size)?.quantity || 0
  }
  
  const getTotalQuantity = () => {
    return selectedSizes.reduce((sum, s) => sum + s.quantity, 0)
  }
  
  const getTotalPrice = () => {
    return selectedSizes.reduce((sum, s) => sum + (s.quantity * s.price), 0)
  }
  
  const handleAddToCart = () => {
    if (selectedSizes.length === 0) {
      toast({
        title: "No sizes selected",
        description: "Please select at least one size and quantity",
        variant: "destructive"
      })
      return
    }
    
    // Add to cart with sizes
    dispatch(addToCartWithSizes({
      product,
      selectedSizes
    }))
    
    // Reset and close
    setSelectedSizes([])
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Size & Quantity</DialogTitle>
        </DialogHeader>
        <div>
          
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={product.image || "/placeholder.svg"} 
              alt={product.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.price} per item</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Select Sizes:</Label>
            {availableSizes.map(size => (
              <div key={size} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{size}</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(size, -1)}
                    disabled={getQuantity(size) === 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={getQuantity(size)}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      const diff = val - getQuantity(size)
                      if (diff !== 0) handleQuantityChange(size, diff)
                    }}
                    className="w-16 h-8 text-center"
                    min="0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(size, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {getTotalQuantity() > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total Items:</span>
                <span className="font-medium">{getTotalQuantity()}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Total Price:</span>
                <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddToCart}
            disabled={getTotalQuantity() === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart ({getTotalQuantity()})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}