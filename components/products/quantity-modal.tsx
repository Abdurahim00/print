"use client"

import { useState } from "react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addToCart } from "@/lib/redux/slices/cartSlice"
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

interface QuantityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function QuantityModal({ open, onOpenChange, product }: QuantityModalProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  
  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }
  
  const handleAddToCart = () => {
    // Add multiple items to cart
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product))
    }
    
    // Reset and close
    setQuantity(1)
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Select Quantity</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={product.image || "/placeholder.svg"} 
              alt={product.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">${typeof product.price === 'object' ? '0' : product.price} per item</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Quantity:</Label>
            <div className="flex items-center justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center"
                min="1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span>Total Price:</span>
              <span className="font-bold">${((typeof product.price === 'object' ? 0 : product.price) * quantity).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart ({quantity})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}