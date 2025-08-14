import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CartItem, Product, CartItemSize } from "@/types"

interface CartState {
  items: CartItem[]
}

// Helper function to load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    return []
  }
}

// Helper function to save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem('cart', JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

const initialState: CartState = {
  items: loadCartFromStorage(),
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Replace entire cart (e.g., after merge/hydrate)
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      saveCartToStorage(state.items)
    },
    // Standard add to cart (legacy)
    addToCart: (state, action: PayloadAction<Product>) => {
      const baseId = action.payload.id
      // Find an existing cart item with same base product and no design/context
      const existingItem = state.items.find((item) => {
        const sameBase = (item.productId || item.id) === baseId
        const hasNoDesign = !item.designId && !item.designPreview && !item.selectedSizes
        return sameBase && hasNoDesign
      })
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1, productId: baseId })
      }
      // Save to localStorage
      saveCartToStorage(state.items)
    },
    
    // Add to cart with size information
    addToCartWithSizes: (state, action: PayloadAction<{
      product: Product, 
      selectedSizes: CartItemSize[],
      designPreview?: string,
      designId?: string,
      designContext?: any,
      designCanvasJSON?: any
    }>) => {
      const { product, selectedSizes, designPreview, designId, designContext, designCanvasJSON } = action.payload
      
      // Generate a unique ID for this specific product + design combination
      const uniqueId = designId 
        ? `${product.id}-${designId}` 
        : `${product.id}-${Date.now()}`
      
      // Calculate total quantity across all sizes
      const totalQuantity = selectedSizes.reduce((sum, size) => sum + size.quantity, 0)
      
      // Create cart item with size information
      const newItem: CartItem = {
        ...product,
        id: uniqueId,
        productId: product.id,
        quantity: totalQuantity,
        selectedSizes,
        designPreview,
        designId,
        designContext,
        designCanvasJSON
      }
      
      state.items.push(newItem)
      
      // Save to localStorage
      saveCartToStorage(state.items)
    },

    // Add to cart carrying design data without sizes (defaults to quantity 1)
    addToCartWithDesign: (state, action: PayloadAction<{
      product: Product,
      quantity?: number,
      designPreview?: string,
      designId?: string,
      designContext?: any,
      designCanvasJSON?: any
    }>) => {
      const { product, quantity = 1, designPreview, designId, designContext, designCanvasJSON } = action.payload

      // Unique composite id per product+design
      const uniqueId = designId ? `${product.id}-${designId}` : `${product.id}-${Date.now()}`

      const newItem: CartItem = {
        ...product,
        id: uniqueId,
        productId: product.id,
        quantity,
        designPreview,
        designId,
        designContext,
        designCanvasJSON,
      }

      state.items.push(newItem)
      saveCartToStorage(state.items)
    },
    
    // Update quantity for standard cart items
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id)
      } else {
        const item = state.items.find((item) => item.id === id)
        if (item) {
          item.quantity = quantity
        }
      }
      // Save to localStorage
      saveCartToStorage(state.items)
    },
    
    // Update size quantities for a cart item
    updateSizeQuantities: (state, action: PayloadAction<{ 
      id: string; 
      selectedSizes: CartItemSize[] 
    }>) => {
      const { id, selectedSizes } = action.payload
      const item = state.items.find((item) => item.id === id)
      
      if (item) {
        // Update the selected sizes
        item.selectedSizes = selectedSizes
        
        // Recalculate total quantity
        item.quantity = selectedSizes.reduce((sum, size) => sum + size.quantity, 0)
        
        // Remove item if all sizes have 0 quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id)
        }
      }
      // Save to localStorage
      saveCartToStorage(state.items)
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      // Save to localStorage
      saveCartToStorage(state.items)
    },
    
    clearCart: (state) => {
      state.items = []
      // Save to localStorage
      saveCartToStorage(state.items)
    },
  },
})

export const { 
  setCart, 
  addToCart, 
  addToCartWithSizes,
  addToCartWithDesign,
  updateQuantity, 
  updateSizeQuantities,
  removeFromCart, 
  clearCart 
} = cartSlice.actions
export default cartSlice.reducer
