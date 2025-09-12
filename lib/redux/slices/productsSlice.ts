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
  designableOnly?: boolean
  locale?: string
}

// Cache for products to avoid redundant fetches
const productCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 60000 // 1 minute cache

// Fetch category counts for filters
export const fetchCategoryCounts = createAsyncThunk(
  "products/fetchCategoryCounts",
  async (params: { search?: string; minPrice?: number; maxPrice?: number } = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.search) queryParams.append('search', params.search)
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString())
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString())
      
      const response = await fetch(`/api/products/counts?${queryParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch category counts")
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching category counts:", error)
      throw error
    }
  }
)

// Fetch only designable products for design tool
export const fetchDesignableProducts = createAsyncThunk(
  "products/fetchDesignableProducts",
  async () => {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('designableOnly', 'true')
      queryParams.append('limit', '50')
      
      const response = await fetch(`/api/products?${queryParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch designable products")
      }
      const data = await response.json()
      
      console.log("Designable products fetched:", data)
      return data
    } catch (error) {
      console.error("Error fetching designable products:", error)
      throw error
    }
  }
)

// Async thunks for database operations
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: FetchProductsParams = {}) => {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination params - fetch products in reasonable chunks
      queryParams.append('page', (params.page || 1).toString())
      queryParams.append('limit', (params.limit || 1000).toString()) // Fetch 1000 products per page for performance
      
      // Add filter params
      if (params.categoryId) queryParams.append('categoryId', params.categoryId)
      if (params.subcategoryId) queryParams.append('subcategoryId', params.subcategoryId)
      if (params.search) queryParams.append('search', params.search)
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString())
      if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString())
      if (params.designableOnly) queryParams.append('designableOnly', 'true')
      if (params.locale) queryParams.append('locale', params.locale)
      
      // Fetch ALL fields including all image fields for admin dashboard
      // Removed field limitation to ensure all product data including images is fetched
      
      const cacheKey = queryParams.toString()
      const cached = productCache.get(cacheKey)
      
      // Return cached data if it's fresh
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log("Returning cached products")
        return cached.data
      }
      
      const response = await fetch(`/api/products?${queryParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      
      // Cache the response
      productCache.set(cacheKey, { data, timestamp: Date.now() })
      
      // Clean up old cache entries
      if (productCache.size > 20) {
        const oldestKey = productCache.keys().next().value
        productCache.delete(oldestKey)
      }
      
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
    const { id, _id, ...update } = productData as any
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
  },
  categoryCounts: [] as {
    categoryId: string
    count: number
    subcategories?: {
      subcategoryId: string
      count: number
    }[]
  }[]
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
      // Fetch category counts
      .addCase(fetchCategoryCounts.fulfilled, (state, action) => {
        state.categoryCounts = action.payload
      })
      .addCase(fetchCategoryCounts.rejected, (state, action) => {
        console.error("Failed to fetch category counts:", action.error.message)
        // Don't set error state as this is a non-critical feature
      })
      // Fetch designable products
      .addCase(fetchDesignableProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDesignableProducts.fulfilled, (state, action) => {
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
      .addCase(fetchDesignableProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch designable products"
      })
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
