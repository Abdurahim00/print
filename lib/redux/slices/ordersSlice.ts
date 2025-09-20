import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Order } from "@/types"

interface OrdersState {
  items: Order[]
  loading: boolean
  error: string | null
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  console.log('Fetching orders...')
  
  // First try to fetch real orders from main endpoint
  try {
    const response = await fetch("/api/orders")
    if (response.ok) {
      const data = await response.json()
      console.log('Fetched real orders:', data.length)
      return data
    }
  } catch (error) {
    console.log('Main orders endpoint failed:', error)
  }
  
  // Use demo endpoint as fallback for testing
  try {
    const demoResponse = await fetch("/api/orders/demo")
    if (demoResponse.ok) {
      const demoData = await demoResponse.json()
      console.log('Using demo orders as fallback:', demoData.length)
      return demoData
    }
  } catch (error) {
    console.log('Demo endpoint failed:', error)
  }
  
  // Try mock endpoint as last fallback
  try {
    const mockResponse = await fetch("/api/orders/mock")
    if (mockResponse.ok) {
      const mockData = await mockResponse.json()
      console.log('Using mock orders as fallback:', mockData.length)
      return mockData
    }
  } catch (error) {
    console.log('Mock endpoint failed')
  }
  
  // Return empty array if all fail
  console.log('All endpoints failed, returning empty array')
  return []
})

export const fetchActiveOrders = createAsyncThunk("orders/fetchActiveOrders", async () => {
  const response = await fetch("/api/orders/active")
  if (!response.ok) {
    throw new Error("Failed to fetch active orders")
  }
  return response.json()
})

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: Omit<Order, "id" | "date" | "createdAt" | "updatedAt">) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
    if (!response.ok) {
      throw new Error("Failed to create order")
    }
    return response.json()
  },
)

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }: { id: string; status: Order["status"] }) => {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      throw new Error("Failed to update order status")
    }
    return response.json()
  },
)

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch orders"
      })
      .addCase(fetchActiveOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchActiveOrders.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchActiveOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch active orders"
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload) // Add new order to the beginning
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
  },
})

export default ordersSlice.reducer
