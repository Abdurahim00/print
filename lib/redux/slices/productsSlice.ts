import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Product } from "@/types"

interface ProductsState {
  items: Product[]
  loading: boolean
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await fetch("/api/products")
  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }
  return response.json()
})

export const addProduct = createAsyncThunk("products/addProduct", async (product: Omit<Product, "id">) => {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
  if (!response.ok) {
    throw new Error("Failed to add product")
  }
  return response.json()
})

export const updateProduct = createAsyncThunk("products/updateProduct", async (product: Product) => {
  const response = await fetch(`/api/products/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
  if (!response.ok) {
    throw new Error("Failed to update product")
  }
  return response.json()
})

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id: string) => {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete product")
  }
  return id
})

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })
      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to add product"
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update product"
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to delete product"
      })
  },
})

export const { clearError } = productsSlice.actions
export default productsSlice.reducer
