import { createSlice } from "@reduxjs/toolkit"

// Define types for our state
interface ImageLayer {
  id: string;
  src: string;
  type: 'template' | 'upload';
  name: string;
}

interface DesignState {
  selectedTool: string;
  viewMode: string;
  selectedProduct: any | null;
  productColor: string;
  selectedTemplate: any | null;
  imageLayers: ImageLayer[];
  showProductModal: boolean;
  showTemplateModal: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: DesignState = {
  selectedTool: "product",
  viewMode: "front",
  selectedProduct: null,
  productColor: "",
  selectedTemplate: null,
  imageLayers: [], // { id, src, type: 'template' | 'upload', name }
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
      // Only set product color if a product is selected
      if (action.payload) {
        state.productColor = action.payload.baseColor
      } else {
        state.productColor = ""
      }
    },
    setProductColor: (state, action) => {
      state.productColor = action.payload
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload
      // Optionally add to imageLayers for rendering
      if (action.payload) {
        state.imageLayers.push({
          id: `template_${action.payload.id}`,
          src: action.payload.image,
          type: "template",
          name: action.payload.name,
        })
      }
    },
    addImageLayer: (state, action) => {
      state.imageLayers.push(action.payload)
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
  setSelectedTemplate,
  addImageLayer,
  setShowProductModal,
  setShowTemplateModal,
  setLoading,
  setError,
} = designSlice.actions

export default designSlice.reducer
    