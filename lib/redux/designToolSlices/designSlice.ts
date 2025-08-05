import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  selectedTool: "product",
  viewMode: "front",
  selectedProduct: {
    id: "tshirt-classic",
    name: "Classic T-Shirt",
    type: "tshirt",
    baseColor: "#1f2937",
    angles: ["front", "back", "left", "right"],
    colors: [
      "#1f2937",
      "#374151",
      "#d1d5db",
      "#f3f4f6",
      "#ffffff",
      "#fef3c7",
      "#065f46",
      "#1e40af",
      "#dc2626",
      "#ea580c",
    ],
    price: "$19.99",
    image: "/placeholder.svg?height=300&width=300&text=T-Shirt",
    description: "Premium cotton t-shirt perfect for custom designs",
    inStock: true,
  },
  productColor: "#1f2937",
  showProductModal: false,
  showTemplateModal: false,
  isLoading: false,
  error: null,
}

const designSlice = createSlice({
  name: "design",
  initialState,
  reducers: {
    setSelectedTool: (state, action) => {
      state.selectedTool = action.payload
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
      state.productColor = action.payload.baseColor
    },
    setProductColor: (state, action) => {
      state.productColor = action.payload
    },
    setShowProductModal: (state, action) => {
      state.showProductModal = action.payload
    },
    setShowTemplateModal: (state, action) => {
      state.showTemplateModal = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setSelectedTool,
  setViewMode,
  setSelectedProduct,
  setProductColor,
  setShowProductModal,
  setShowTemplateModal,
  setLoading,
  setError,
} = designSlice.actions

export default designSlice.reducer
    