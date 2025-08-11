import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Coupon, CreateCouponData, UpdateCouponData } from "@/types"

interface CouponsState {
  items: Coupon[]
  loading: boolean
  error: string | null
}

const initialState: CouponsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchCoupons = createAsyncThunk("coupons/fetchCoupons", async () => {
  const response = await fetch("/api/coupons")
  if (!response.ok) {
    throw new Error("Failed to fetch coupons")
  }
  return response.json()
})

export const createCoupon = createAsyncThunk("coupons/createCoupon", async (couponData: CreateCouponData) => {
  const response = await fetch("/api/coupons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(couponData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to create coupon")
  }
  return response.json()
})

export const updateCoupon = createAsyncThunk("coupons/updateCoupon", async (updateData: UpdateCouponData) => {
  const response = await fetch(`/api/coupons/${updateData.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to update coupon")
  }
  return response.json()
})

export const deleteCoupon = createAsyncThunk("coupons/deleteCoupon", async (id: string) => {
  const response = await fetch(`/api/coupons/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete coupon")
  }
  return id
})

export const validateCouponCode = createAsyncThunk(
  "coupons/validateCouponCode", 
  async ({ code, orderTotal, cartItems }: { code: string; orderTotal: number; cartItems?: any[] }) => {
    const response = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderTotal, cartItems }),
    })
    if (!response.ok) {
      throw new Error("Failed to validate coupon")
    }
    return response.json()
  }
)

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch coupons"
      })
      // Create coupon
      .addCase(createCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false
        // Avoid duplicates by id
        const exists = state.items.some((c) => c.id === action.payload.id)
        state.items = exists ? state.items : [action.payload, ...state.items]
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create coupon"
      })
      // Update coupon
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex((coupon) => coupon.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update coupon"
      })
      // Delete coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((coupon) => coupon.id !== action.payload)
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to delete coupon"
      })
  },
})

export const { clearError } = couponsSlice.actions
export default couponsSlice.reducer
