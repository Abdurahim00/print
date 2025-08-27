import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Product } from "@/lib/models/Product"

interface FetchProductsParams {
  page?: number
  limit?: number
  categoryId?: string
  subcategoryId?: string
  search?: string
  sortBy?: string
  minPrice?: number
  maxPrice?: number
}

// Async thunks for database operations
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: FetchProductsParams = {}) => {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination params
      queryParams.append('page', (params.page || 1).toString())
      queryParams.append('limit', (params.limit || 20).toString())
      
      // Add filter params
      if (params.categoryId) queryParams.append('categoryId', params.categoryId)
      if (params.subcategoryId) queryParams.append('subcategoryId', params.subcategoryId)
      if (params.search) queryParams.append('search', params.search)
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString())
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString())
      
      const response = await fetch(`/api/products?${queryParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      console.log("Products fetched:", data)
      return data
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  }
)

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
    if (!response.ok) {
      throw new Error("Failed to create product")
    }
    return response.json()
  }
)

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (productData: Product) => {
    const { id, ...update } = productData as any
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update),
    })
    if (!response.ok) {
      throw new Error("Failed to update product")
    }
    return response.json()
  }
)

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id: string) => {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete product")
  }
  return id
})

const initialState = {
  items: [] as Product[],
  loading: false,
  error: null as string | null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  filters: {
    categoryId: null as string | null,
    subcategoryId: null as string | null,
    search: '',
    sortBy: 'featured',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined
  }
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload
    },
    addProduct: (state, action) => {
      state.items.push(action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.page = 1
    }
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
        // Handle both paginated and non-paginated responses
        if (action.payload.products && action.payload.pagination) {
          state.items = action.payload.products
          state.pagination = action.payload.pagination
        } else {
          // Fallback for non-paginated response
          state.items = action.payload
          state.pagination.total = action.payload.length
          state.pagination.totalPages = 1
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create product"
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex((p) => p.id === action.payload.id)
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

export const { 
  setProducts, 
  addProduct, 
  setLoading, 
  setError, 
  clearError,
  setFilters,
  setPage,
  resetFilters
} = productsSlice.actions

export default productsSlice.reducer
