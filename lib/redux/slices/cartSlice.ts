import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CartItem, Product, CartItemSize } from "@/types"
import { SafeStorage } from "@/lib/utils/storage"

interface CartState {
  items: CartItem[]
}

// Helper function to load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const savedCart = SafeStorage.getItem('cart')
    const cartItems = savedCart ? JSON.parse(savedCart) : []
    console.log('🛒 Loading cart from localStorage:', cartItems.length, 'items')
    cartItems.forEach((item: any, index: number) => {
      console.log(`🛒 Loaded item ${index + 1}:`, {
        id: item.id,
        price: item.price,
        basePrice: item.basePrice,
        totalPrice: item.totalPrice,
        hasDesigns: !!item.designs
      })
    })
    return cartItems
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
  
  const success = SafeStorage.setItem('cart', JSON.stringify(items))
  if (!success) {
    console.warn('Cart data could not be fully saved due to storage limitations')
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
      console.log('🛒 Redux setCart called with:', action.payload.length, 'items')
      action.payload.forEach((item, index) => {
        console.log(`🛒 setCart item ${index + 1}:`, {
          id: item.id,
          price: item.price,
          basePrice: (item as any).basePrice,
          totalPrice: (item as any).totalPrice,
          hasDesigns: !!(item as any).designs
        })
      })
      state.items = action.payload
      saveCartToStorage(state.items)
    },
    // Standard add to cart (legacy)
    addToCart: (state, action: PayloadAction<Product | any>) => {
      const payload = action.payload
      
      console.log('🛒 Redux addToCart called with:', {
        id: payload.id,
        price: payload.price,
        basePrice: payload.basePrice,
        totalPrice: payload.totalPrice,
        hasDesigns: !!payload.designs,
        designsLength: payload.designs?.length
      })
      
      // If it's a custom cart item (has designs, totalPrice, etc.), add it directly
      if (payload.designs || payload.totalPrice || payload.basePrice) {
        console.log('🛒 Adding custom cart item:', payload)
        state.items.push(payload)
        saveCartToStorage(state.items)
        return
      }
      
      // Otherwise, handle as standard product
      const baseId = payload.id
      // Find an existing cart item with same base product and no design/context
      const existingItem = state.items.find((item) => {
        const sameBase = (item.productId || item.id) === baseId
        const hasNoDesign = !item.designId && !item.designPreview && !item.selectedSizes
        return sameBase && hasNoDesign
      })
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...payload, quantity: 1, productId: baseId })
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
      designCanvasJSON?: any,
      designCosts?: any
    }>) => {
      const { product, selectedSizes, designPreview, designId, designContext, designCanvasJSON, designCosts } = action.payload
      
      // Log the data being added to cart
      console.log('🛒 [CartSlice] Adding to cart with sizes:', {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          hasVariations: (product as any).hasVariations,
          type: typeof product.price
        },
        selectedSizes: selectedSizes.map(size => ({
          size: size.size,
          quantity: size.quantity,
          price: size.price,
          totalPrice: size.price * size.quantity
        })),
        designPreview: designPreview ? 'Present' : 'None',
        designId: designId || 'None',
        designContext: designContext ? {
          viewMode: designContext.viewMode,
          productColor: designContext.productColor,
          hasTemplate: !!designContext.selectedTemplate,
          hasDesignCosts: !!designContext.designCosts,
          allDesignedAngles: designContext.allDesignedAngles ? {
            count: designContext.allDesignedAngles.length,
            angles: designContext.allDesignedAngles.map((angle: any) => ({
              angle: angle.angle,
              hasDesign: angle.hasDesign,
              hasCanvasData: !!angle.canvasJSON
            }))
          } : 'Missing'
        } : 'None',
        designCanvasJSON: designCanvasJSON ? 'Present' : 'None'
      })
      
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
        designCanvasJSON,
        designCosts
      }
      
      console.log('🛒 [CartSlice] Created cart item:', {
        uniqueId,
        totalQuantity,
        finalItem: {
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: newItem.quantity,
          selectedSizesCount: newItem.selectedSizes?.length || 0,
          hasDesignPreview: !!newItem.designPreview,
          hasDesignContext: !!newItem.designContext,
          designContextDetails: newItem.designContext ? {
            viewMode: newItem.designContext.viewMode,
            productColor: newItem.designContext.productColor,
            allDesignedAnglesCount: (newItem.designContext as any).allDesignedAngles?.length || 0,
            allDesignedAngles: (newItem.designContext as any).allDesignedAngles?.map((angle: any) => ({
              angle: angle.angle,
              hasDesign: angle.hasDesign,
              hasCanvasData: !!angle.canvasJSON
            })) || []
          } : 'None'
        }
      })
      
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
