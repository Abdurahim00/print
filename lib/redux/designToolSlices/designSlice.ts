import { createSlice } from "@reduxjs/toolkit"

// Define types for our state
interface ImageLayer {
  id: string;
  src: string;
  type: 'template' | 'upload';
  name: string;
}

// New interface for variation-specific design persistence
interface VariationDesign {
  variationId: string;
  viewMode: string;
  canvasJSON: any;
  lastModified: number;
  isShared: boolean; // Track if this design was shared from another variation
  designAreaCm2?: number; // Track design area for this specific view
  designAreaPercentage?: number; // Track design area percentage for this view
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
  isLoadingProduct: boolean;
  error: string | null;
  // New fields for variation design persistence
  variationDesigns: VariationDesign[];
  currentDesignId: string | null;
  autoSaveEnabled: boolean;
  // Design pricing
  hasDesignElements: boolean;
  designAreaPercentage: number; // Percentage of canvas area covered by design (0-100)
  designAreaCm2: number; // Area covered by design in square centimeters
  // Search
  productSearchQuery: string;
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
  isLoadingProduct: false,
  error: null,
  // New fields initialization
  variationDesigns: [],
  currentDesignId: null,
  autoSaveEnabled: true,
  hasDesignElements: false,
  designAreaPercentage: 0,
  designAreaCm2: 0,
  productSearchQuery: "",
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
        // For products with variations, set the color to the first variation's color
        // Otherwise use baseColor
        if (action.payload.hasVariations && action.payload.variations?.length > 0) {
          // Try to keep current color if it exists in the new product's variations
          const currentColorExists = state.productColor && action.payload.variations.some((v: any) => 
            v.color?.hex_code === state.productColor
          )
          
          if (currentColorExists) {
            // Keep the current color if it exists in the new product
            // This prevents unwanted variant switching
          } else {
            // CRITICAL: Always set to first variation's color for products with variations
            // Never leave it empty as this causes all variations to use the same ID
            const firstVariation = action.payload.variations[0]
            const firstVariationColor = firstVariation?.color?.hex_code
            
            if (!firstVariationColor) {
              console.error('⚠️ [DesignSlice] First variation has no color! This will cause design sync issues.', {
                variation: firstVariation,
                product: action.payload.name
              })
              // Don't use #000000 as fallback - it causes all variations to share the same ID
              // Generate a unique color based on the variation index or properties
              const variationIndex = action.payload.variations.indexOf(firstVariation)
              const fallbackColor = firstVariation?.id || 
                                   firstVariation?.sku || 
                                   `var${variationIndex}_${action.payload.id?.slice(-6) || Math.random().toString(36).slice(2, 8)}`
              state.productColor = fallbackColor
              console.warn('⚠️ [DesignSlice] Using fallback color for variation:', fallbackColor)
            } else {
              state.productColor = firstVariationColor
            }
          }
        } else {
          // For products without variations, use baseColor
          state.productColor = action.payload.baseColor || ""
        }
        
        // Log the product data for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 [DesignSlice] setSelectedProduct:', {
            product: action.payload,
            selectedColor: state.productColor,
            hasVariations: action.payload.hasVariations,
            variationsCount: action.payload.variations?.length,
            variations: action.payload.variations?.map((v: any) => ({
              color: v.color?.hex_code,
              name: v.color?.name,
              imagesCount: v.images?.length
            }))
          })
        }
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
      console.log('🔄 [DesignSlice] setShowProductModal:', { current: state.showProductModal, new: action.payload })
      state.showProductModal = action.payload
    },
    setShowTemplateModal: (state, action) => {
      console.log('🔄 [DesignSlice] setShowTemplateModal:', { current: state.showTemplateModal, new: action.payload })
      state.showTemplateModal = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setLoadingProduct: (state, action) => {
      state.isLoadingProduct = action.payload
    },
    setHasDesignElements: (state, action) => {
      state.hasDesignElements = action.payload
    },
    setDesignAreaPercentage: (state, action) => {
      state.designAreaPercentage = action.payload
    },
    setDesignAreaCm2: (state, action) => {
      state.designAreaCm2 = action.payload
    },
    setProductSearchQuery: (state, action) => {
      state.productSearchQuery = action.payload
    },
    // New reducers for variation design persistence
    saveVariationDesign: (state, action) => {
      const { variationId, viewMode, canvasJSON, isShared = false, designAreaCm2, designAreaPercentage } = action.payload
      
      // CRITICAL DEBUG: Log what's being saved
      console.log('🚨 [Redux] saveVariationDesign ACTION:', {
        variationId,
        viewMode,
        objectCount: canvasJSON?.objects?.length || 0,
        isShared,
        timestamp: new Date().toISOString(),
        beforeSaveCount: state.variationDesigns.length,
        allCurrentDesigns: state.variationDesigns.map(d => ({
          id: d.variationId,
          view: d.viewMode,
          objects: d.canvasJSON?.objects?.length || 0
        }))
      })
      
      // Find existing design for this variation+view combination
      const existingIndex = state.variationDesigns.findIndex(
        design => design.variationId === variationId && design.viewMode === viewMode
      )
      
      const designData: VariationDesign = {
        variationId,
        viewMode,
        canvasJSON,
        lastModified: Date.now(),
        isShared,
        designAreaCm2: designAreaCm2 || state.designAreaCm2, // Use current area if not provided
        designAreaPercentage: designAreaPercentage || state.designAreaPercentage
      }
      
      if (existingIndex !== -1) {
        // Update existing design
        console.log('🔄 [Redux] Updating existing design at index:', existingIndex)
        state.variationDesigns[existingIndex] = designData
      } else {
        // Add new design
        console.log('➕ [Redux] Adding new design')
        state.variationDesigns.push(designData)
      }
      
      // Set current design ID
      state.currentDesignId = `${variationId}:${viewMode}`
      
      console.log('💾 [DesignSlice] After save:', {
        variationId,
        viewMode,
        isShared,
        afterSaveCount: state.variationDesigns.length,
        designAreaCm2: designData.designAreaCm2,
        designAreaPercentage: designData.designAreaPercentage,
        totalDesigns: state.variationDesigns.length
      })
    },
    loadVariationDesign: (state, action) => {
      const { variationId, viewMode } = action.payload
      const design = state.variationDesigns.find(
        d => d.variationId === variationId && d.viewMode === viewMode
      )
      
      if (design) {
        state.currentDesignId = `${variationId}:${viewMode}`
        console.log('📂 [DesignSlice] Loaded variation design:', {
          variationId,
          viewMode,
          isShared: design.isShared,
          lastModified: design.lastModified
        })
      } else {
        state.currentDesignId = null
        console.log('📂 [DesignSlice] No design found for:', { variationId, viewMode })
      }
    },
    shareDesignAcrossVariations: (state, action) => {
      const { sourceVariationId, viewMode, canvasJSON, targetVariationIds } = action.payload
      
      targetVariationIds.forEach((targetVariationId: string) => {
        // Skip if target variation already has a design for this view
        const existingDesign = state.variationDesigns.find(
          d => d.variationId === targetVariationId && d.viewMode === viewMode
        )
        
        if (!existingDesign) {
          // Share the design to this variation
          const sharedDesign: VariationDesign = {
            variationId: targetVariationId,
            viewMode,
            canvasJSON,
            lastModified: Date.now(),
            isShared: true
          }
          
          state.variationDesigns.push(sharedDesign)
          
          console.log('🔄 [DesignSlice] Shared design to variation:', {
            from: sourceVariationId,
            to: targetVariationId,
            viewMode,
            isInitialShare: action.payload.isInitialShare || false
          })
        } else {
          console.log('🔄 [DesignSlice] Skipped sharing to variation (already has design):', {
            variationId: targetVariationId,
            viewMode,
            existingDesignLastModified: existingDesign.lastModified
          })
        }
      })
    },
    clearVariationDesign: (state, action) => {
      const { variationId, viewMode } = action.payload
      state.variationDesigns = state.variationDesigns.filter(
        design => !(design.variationId === variationId && design.viewMode === viewMode)
      )
      
      if (state.currentDesignId === `${variationId}:${viewMode}`) {
        state.currentDesignId = null
      }
      
      console.log('🗑️ [DesignSlice] Cleared variation design:', { variationId, viewMode })
    },
    setAutoSaveEnabled: (state, action) => {
      state.autoSaveEnabled = action.payload
    },
    clearAllDesigns: (state) => {
      state.variationDesigns = []
      state.currentDesignId = null
      console.log('🗑️ [DesignSlice] Cleared all designs')
    },
    setVariationDesigns: (state, action) => {
      state.variationDesigns = action.payload
      console.log('📝 [DesignSlice] Set variation designs:', action.payload.length)
    },
    // New action to set product with specific variant (without changing color)
    setProductWithVariant: (state, action) => {
      const { product, variantId } = action.payload
      state.selectedProduct = product
      
      // Only set the color if a specific variant is provided
      if (variantId && product.variations) {
        const variant = product.variations.find((v: any) => v.id === variantId)
        if (variant && variant.color?.hex_code) {
          state.productColor = variant.color.hex_code
          console.log('🎨 [DesignSlice] Set product with specific variant:', {
            product: product.name,
            variantId,
            color: variant.color.name
          })
        }
      }
    }
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
  setLoadingProduct,
  setHasDesignElements,
  setDesignAreaPercentage,
  setDesignAreaCm2,
  setProductSearchQuery,
  // New actions
  saveVariationDesign,
  loadVariationDesign,
  shareDesignAcrossVariations,
  clearVariationDesign,
  setAutoSaveEnabled,
  clearAllDesigns,
  setVariationDesigns,
  setProductWithVariant,
} = designSlice.actions

export default designSlice.reducer
    