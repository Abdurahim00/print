import { useCallback, useEffect, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, store } from '@/lib/redux/store'
import { 
  saveVariationDesign, 
  loadVariationDesign, 
  shareDesignAcrossVariations,
  clearVariationDesign,
  setVariationDesigns 
} from '@/lib/redux/designToolSlices/designSlice'

interface UseVariationDesignPersistenceProps {
  fabricCanvas: any
  selectedProduct: any
  productColor: string
  viewMode: string
  autoSaveDelay?: number
}

const STORAGE_KEY = 'variationDesigns'

export const useVariationDesignPersistence = ({
  fabricCanvas,
  selectedProduct,
  productColor,
  viewMode,
  autoSaveDelay = 1000
}: UseVariationDesignPersistenceProps) => {
  const dispatch = useDispatch()
  const { variationDesigns, autoSaveEnabled, designAreaCm2, designAreaPercentage } = useSelector((state: RootState) => state.design)
  
  // Refs for debouncing
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCanvasStateRef = useRef<string>('')
  
  // Get current variation ID based on product, color AND view mode
  const getCurrentVariationId = useCallback(() => {
    // ALWAYS use refs to get current values
    const currentProduct = currentSelectedProductRef.current
    const currentColor = currentProductColorRef.current
    const currentView = currentViewModeRef.current
    
    if (!currentProduct) return null
    
    // CRITICAL FIX: Since variant selector is removed, we ignore color variations
    // Each angle (front/back/left/right) gets its own unique design storage
    // This prevents syncing between different angles
    const variationId = `${currentProduct.id}_angle_${currentView}`
    
    console.log('🔄 [useVariationDesignPersistence] Angle-based variation ID (no color tracking):', {
      productId: currentProduct.id,
      viewMode: currentView,
      fullVariationId: variationId,
      hasVariations: currentProduct.hasVariations,
      note: 'Variant selector removed - each angle is independent'
    })
    
    return variationId
  }, []) // Remove all dependencies - always use refs
  
  // Get all variation IDs that have the current view mode
  const getVariationsWithCurrentView = useCallback(() => {
    const currentProduct = currentSelectedProductRef.current
    const currentView = currentViewModeRef.current
    
    if (!currentProduct) return []
    
    // Since variant selector is removed, just return the current angle's ID
    const angleId = `${currentProduct.id}_angle_${currentView}`
    console.log('🔄 [useVariationDesignPersistence] Current angle ID:', angleId)
    return [angleId]
  }, []) // Remove all dependencies - always use refs
  
  // Get all variations that have a specific view mode (for design sharing)
  const getVariationsWithSpecificView = useCallback((specificViewMode: string) => {
    const currentProduct = currentSelectedProductRef.current
    if (!currentProduct) return []
    
    // Since variant selector is removed, just return the specific angle's ID
    const angleId = `${currentProduct.id}_angle_${specificViewMode}`
    console.log('🔄 [useVariationDesignPersistence] Specific angle ID:', angleId)
    return [angleId]
  }, [])
  
  // Get all available view modes for the current product
  const getAvailableViewModes = useCallback(() => {
    const currentProduct = currentSelectedProductRef.current
    if (!currentProduct) return []
    
    if (currentProduct.hasVariations && currentProduct.variations) {
      // For variation products, get view modes from the first variation
      const firstVariation = currentProduct.variations[0]
      if (firstVariation?.images) {
        return firstVariation.images
          .filter((img: any) => img.angle && img.url && img.url.trim() !== '')
          .map((img: any) => img.angle)
      }
      return []
    } else {
      // For single products, check individual angle images
      const viewModes: string[] = []
      const angleFields = ['front', 'back', 'left', 'right', 'material']
      
      angleFields.forEach(angle => {
        const imageField = `${angle}Image`
        if ((currentProduct as any)[imageField] && (currentProduct as any)[imageField].trim() !== '') {
          viewModes.push(angle)
        }
      })
      
      console.log('🔄 [useVariationDesignPersistence] Single product available view modes:', viewModes)
      return viewModes
    }
  }, [])

  // Get all designed angles for the current variation
  const getAllDesignedAngles = useCallback(() => {
    const currentProduct = currentSelectedProductRef.current
    if (!currentProduct) return []
    
    const currentVariationId = getCurrentVariationId()
    if (!currentVariationId) return []
    
    const availableViewModes = getAvailableViewModes()
    const designedAngles: Array<{ angle: string; hasDesign: boolean; designData?: any }> = []
    
    availableViewModes.forEach((viewMode: string) => {
      const design = variationDesigns.find(
        d => d.variationId === currentVariationId && d.viewMode === viewMode
      )
      
      designedAngles.push({
        angle: viewMode,
        hasDesign: !!design,
        designData: design || null
      })
    })
    
    console.log('🔄 [useVariationDesignPersistence] All designed angles for variation:', {
      variationId: currentVariationId,
      designedAngles: designedAngles.map(d => ({ angle: d.angle, hasDesign: d.hasDesign }))
    })
    
    return designedAngles
  }, [getCurrentVariationId, getAvailableViewModes, variationDesigns])
  
  // Save designs to localStorage
  const saveToLocalStorage = useCallback((designs: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
    } catch (error) {
      console.error('Error saving designs to localStorage:', error)
    }
  }, [])
  
  // Load designs from localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading designs from localStorage:', error)
    }
    return []
  }, [])
  
  // Load design for current variation and view
  const loadCurrentDesign = useCallback(() => {
    if (!fabricCanvas) return false
    
    const variationId = getCurrentVariationId()
    const currentView = currentViewModeRef.current
    
    if (!variationId) {
      console.log('🔄 [useVariationDesignPersistence] No variation ID available for loading design')
      return false
    }
    
    console.log('🔍 [useVariationDesignPersistence] Looking for design:', {
      targetVariationId: variationId,
      targetViewMode: currentView,
      availableDesigns: variationDesigns.map(d => ({
        id: d.variationId,
        view: d.viewMode
      }))
    })
    
    const design = variationDesigns.find(
      d => d.variationId === variationId && d.viewMode === currentView
    )
    
    if (design) {
      try {
        fabricCanvas.loadFromJSON(design.canvasJSON, () => {
          fabricCanvas.requestRenderAll()
          console.log('📂 [useVariationDesignPersistence] Loaded design:', {
            variationId,
            viewMode: currentView,
            isShared: design.isShared,
            isSingleProduct: variationId.startsWith('single_'),
            objectCount: design.canvasJSON?.objects?.length || 0
          })
        })
        return true
      } catch (error) {
        console.error('Error loading design:', error)
        return false
      }
    }
    
    console.log('🔄 [useVariationDesignPersistence] No design found for:', {
      variationId,
      viewMode: currentView,
      isSingleProduct: variationId.startsWith('single_'),
      allDesignIds: variationDesigns.map(d => d.variationId)
    })
    
    // CRITICAL: Clear the canvas when no design is found
    // This prevents designs from syncing between variations
    console.log('🧹 [useVariationDesignPersistence] Clearing canvas - no design for this variation')
    fabricCanvas.clear()
    fabricCanvas.requestRenderAll()
    return false
  }, [fabricCanvas, getCurrentVariationId, variationDesigns])
  
  // Clear design for current variation and view
  const clearCurrentDesign = useCallback(() => {
    if (!fabricCanvas) return
    
    const variationId = getCurrentVariationId()
    const currentView = currentViewModeRef.current
    
    if (!variationId) {
      console.log('🔄 [useVariationDesignPersistence] No variation ID available for clearing design')
      return
    }
    
    // Clear the canvas
    fabricCanvas.clear()
    fabricCanvas.requestRenderAll()
    
    // Remove the design from state
    dispatch(clearVariationDesign({ variationId, viewMode: currentView }))
    
    console.log('🗑️ [useVariationDesignPersistence] Cleared design:', { 
      variationId, 
      viewMode: currentView,
      isSingleProduct: variationId.startsWith('single_')
    })
  }, [fabricCanvas, getCurrentVariationId, dispatch])
  
  // Load designs from localStorage on mount
  useEffect(() => {
    const storedDesigns = loadFromLocalStorage()
    if (storedDesigns.length > 0) {
      // CRITICAL: Filter out old color-based designs, keep only angle-based
      const validDesigns = storedDesigns.filter((design: any) => {
        // Only keep designs that use the angle pattern
        const isAngleBased = design.variationId?.includes('_angle_')
        if (!isAngleBased) {
          console.log('🗑️ Filtering out old design:', design.variationId)
        }
        return isAngleBased
      })
      
      console.log('📂 [useVariationDesignPersistence] Loading designs:', {
        totalStored: storedDesigns.length,
        validAngleBased: validDesigns.length,
        filtered: storedDesigns.length - validDesigns.length
      })
      
      // Dispatch only valid angle-based designs to Redux state
      validDesigns.forEach((design: any) => {
        dispatch(saveVariationDesign({
          variationId: design.variationId,
          viewMode: design.viewMode,
          canvasJSON: design.canvasJSON,
          isShared: design.isShared,
          designAreaCm2: design.designAreaCm2,
          designAreaPercentage: design.designAreaPercentage
        }))
      })
      
      // Clean up localStorage if we filtered out old designs
      if (validDesigns.length < storedDesigns.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validDesigns))
        console.log('✅ Cleaned localStorage: removed', storedDesigns.length - validDesigns.length, 'old designs')
      }
    }
  }, [dispatch, loadFromLocalStorage])

  // Use refs to always get the latest values, avoiding stale closures
  // CRITICAL: Initialize refs immediately, not in useEffect
  const currentViewModeRef = useRef(viewMode)
  const currentProductColorRef = useRef(productColor)
  const currentSelectedProductRef = useRef(selectedProduct)
  
  // Update refs SYNCHRONOUSLY whenever values change
  // This ensures refs are always up-to-date before any operations
  currentViewModeRef.current = viewMode
  currentProductColorRef.current = productColor
  currentSelectedProductRef.current = selectedProduct
  
  // Enhanced save function that tracks if design was manually modified
  const saveCurrentDesign = useCallback((canvasJSON?: any, isManualModification = false) => {
    if (!fabricCanvas) return
    
    // CRITICAL: Get the variation ID fresh every time to avoid stale data
    const variationId = getCurrentVariationId()
    
    if (!variationId) {
      console.log('🔄 [useVariationDesignPersistence] No variation ID available for saving design')
      return
    }
    
    // Get current values from refs for logging
    const currentProduct = currentSelectedProductRef.current
    const currentViewMode = currentViewModeRef.current
    const currentProductColor = currentProductColorRef.current
    
    const canvasData = canvasJSON || fabricCanvas.toJSON()
    
    // CRITICAL DEBUG: Log exactly what we're saving and where
    console.log('🔍 [DEBUG] SAVE OPERATION:', {
      calculatedVariationId: variationId,
      currentProductId: currentProduct?.id,
      currentProductColor,
      currentViewMode,
      timestamp: new Date().toISOString(),
      canvasObjects: canvasData.objects?.map((obj: any) => ({
        type: obj.type,
        text: obj.text || 'N/A'
      }))
    })
    
    // Check if this is a new design (no existing design for this variation+view)
    const existingDesign = variationDesigns.find(
      d => d.variationId === variationId && d.viewMode === currentViewMode
    )
    
    const isNewDesign = !existingDesign
    
    console.log('💾 [useVariationDesignPersistence] Saving design:', {
      variationId,
      viewMode: currentViewMode,
      isNewDesign,
      isManualModification,
      hasExistingDesign: !!existingDesign,
      isSingleProduct: variationId.startsWith('single_'),
      hasVariations: currentProduct?.hasVariations,
      productId: currentProduct?.id,
      objectCount: canvasData.objects?.length || 0
    })
    
    // Save the design with manual modification flag and current design area
    dispatch(saveVariationDesign({
      variationId,
      viewMode: currentViewMode,  // CRITICAL: Use ref value, not closure!
      canvasJSON: canvasData,
      isShared: false,
      designAreaCm2: designAreaCm2,
      designAreaPercentage: designAreaPercentage
    }))
    
    // DISABLED AUTO-SHARING: Each angle should have independent designs
    // Auto-sharing is now disabled because variation IDs include the viewMode,
    // making each angle completely independent
    console.log('💾 [useVariationDesignPersistence] Design saved (auto-sharing disabled):', {
      variationId,
      viewMode: currentViewMode,
      isManuallyModified: isManualModification,
      isNewDesign
    })
    
    // Store last canvas state for change detection
    lastCanvasStateRef.current = JSON.stringify(canvasData)
  }, [fabricCanvas, dispatch, designAreaCm2, designAreaPercentage, getCurrentVariationId]) // Add getCurrentVariationId to deps

  // Auto-save handler with debouncing
  const handleAutoSave = useCallback((isManualModification = false) => {
    if (!fabricCanvas || !autoSaveEnabled) return
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    
    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      // CRITICAL: Get the variation ID fresh at save time
      const currentVariationId = getCurrentVariationId()
      
      if (!currentVariationId) {
        console.log('⚠️ [useVariationDesignPersistence] No variation ID for auto-save')
        return
      }
      
      const currentCanvasState = JSON.stringify(fabricCanvas.toJSON())
      
      // Only save if canvas has actually changed
      if (currentCanvasState !== lastCanvasStateRef.current) {
        console.log('💾 [useVariationDesignPersistence] Auto-saving to:', {
          variationId: currentVariationId,
          viewMode: currentViewModeRef.current,
          productColor: currentProductColorRef.current,
          timestamp: new Date().toISOString()
        })
        saveCurrentDesign(undefined, isManualModification)
      }
    }, autoSaveDelay)
  }, [fabricCanvas, autoSaveEnabled, saveCurrentDesign, autoSaveDelay, getCurrentVariationId])
  
  // Set up canvas event listeners for auto-save
  useEffect(() => {
    if (!fabricCanvas || !autoSaveEnabled) return
    
    const handleCanvasChange = () => {
      // Mark this as a manual modification
      handleAutoSave(true)
    }
    
    // Listen to canvas changes
    fabricCanvas.on('object:added', handleCanvasChange)
    fabricCanvas.on('object:modified', handleCanvasChange)
    fabricCanvas.on('object:removed', handleCanvasChange)
    fabricCanvas.on('object:moving', handleCanvasChange)
    fabricCanvas.on('object:scaling', handleCanvasChange)
    fabricCanvas.on('object:rotating', handleCanvasChange)
    
    return () => {
      // CRITICAL: Clear any pending auto-save to prevent saving to wrong view
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
        autoSaveTimeoutRef.current = null
      }
      
      fabricCanvas.off('object:added', handleCanvasChange)
      fabricCanvas.off('object:modified', handleCanvasChange)
      fabricCanvas.off('object:removed', handleCanvasChange)
      fabricCanvas.off('object:moving', handleCanvasChange)
      fabricCanvas.off('object:scaling', handleCanvasChange)
      fabricCanvas.off('object:rotating', handleCanvasChange)
    }
  }, [fabricCanvas, autoSaveEnabled, handleAutoSave, viewMode, productColor]) // Re-setup when view or color changes
  
  // Track previous values to detect actual changes
  const previousVariationIdRef = useRef<string | null>(null)
  const previousViewModeRef = useRef<string>(viewMode)
  const isInitializedRef = useRef(false)
  
  // Auto-load design when variation or view changes
  useEffect(() => {
    if (!fabricCanvas) return
    
    const currentVariationId = getCurrentVariationId()
    
    // Initialize on first run
    if (!isInitializedRef.current && currentVariationId) {
      isInitializedRef.current = true
      previousVariationIdRef.current = currentVariationId
      previousViewModeRef.current = viewMode
      console.log('🔄 [useVariationDesignPersistence] Initial load:', {
        variationId: currentVariationId,
        viewMode
      })
      // Load initial design if it exists
      loadCurrentDesign()
      return
    }
    
    // Check if we have an actual change in variation or view
    const hasVariationChanged = currentVariationId !== previousVariationIdRef.current
    const hasViewChanged = viewMode !== previousViewModeRef.current
    
    // ONLY proceed if the variation ID or view has actually changed
    if (!currentVariationId || (!hasVariationChanged && !hasViewChanged)) {
      return
    }
    
    if (currentVariationId && (hasVariationChanged || hasViewChanged)) {
      // Store old values BEFORE updating refs
      const oldVariationId = previousVariationIdRef.current
      const oldViewMode = previousViewModeRef.current
      
      console.log('🔄 [useVariationDesignPersistence] Variation changed, will load new design:', {
        fromVariation: oldVariationId,
        toVariation: currentVariationId,
        fromView: oldViewMode,
        toView: viewMode
      })
      
      // REMOVED: Problematic save-on-switch logic that was causing cross-contamination
      // The auto-save mechanism will handle saving if there are changes
      // This was incorrectly using the CURRENT product/color with the OLD viewMode
      // causing designs to save to the wrong variation ID
      
      // Update the previous values IMMEDIATELY before any loading
      // This prevents any auto-save from using the wrong variation ID
      previousVariationIdRef.current = currentVariationId
      previousViewModeRef.current = viewMode
      
      console.log('🎯 [useVariationDesignPersistence] Auto-load triggered:', {
        currentVariationId,
        previousVariationId: oldVariationId,
        productColor,
        viewMode,
        previousViewMode: oldViewMode,
        productId: selectedProduct?.id,
        hasVariationChanged,
        hasViewChanged,
        allDesigns: variationDesigns.map(d => ({ id: d.variationId, view: d.viewMode }))
      })
      
      // CRITICAL: Clear the canvas first to prevent design bleed-through
      console.log('🧹 [useVariationDesignPersistence] CLEARING CANVAS for variation switch')
      fabricCanvas.clear()
      fabricCanvas.requestRenderAll()
      
      // Reset the last canvas state so auto-save doesn't trigger immediately
      lastCanvasStateRef.current = JSON.stringify(fabricCanvas.toJSON())
      
      // Design loading is now done above with fresh Redux state
      
      // CRITICAL DEBUG: Show what designs exist and what we're looking for
      // Get fresh designs from Redux store to avoid stale closure
      const latestDesigns = store.getState().design.variationDesigns
      const designToLoad = latestDesigns.find(
        d => d.variationId === currentVariationId && d.viewMode === currentViewModeRef.current
      )
      
      console.log('🔍 [DEBUG] LOAD OPERATION:', {
        lookingFor: { variationId: currentVariationId, viewMode: currentViewModeRef.current },
        allDesigns: latestDesigns.map(d => ({
          variationId: d.variationId,
          viewMode: d.viewMode,
          objectCount: d.canvasJSON?.objects?.length || 0
        })),
        foundDesign: !!designToLoad,
        foundObjects: designToLoad?.canvasJSON?.objects?.map((obj: any) => ({
          type: obj.type,
          text: obj.text || 'N/A'
        }))
      })
      
      if (designToLoad) {
        // Double-check the design is for the correct variation and view
        if (designToLoad.variationId === currentVariationId && designToLoad.viewMode === currentViewModeRef.current) {
          // Extra validation: ensure design has actual objects
          if (designToLoad.canvasJSON?.objects && designToLoad.canvasJSON.objects.length > 0) {
            try {
              fabricCanvas.loadFromJSON(designToLoad.canvasJSON, () => {
                fabricCanvas.requestRenderAll()
                // Update last canvas state after loading to prevent false auto-save
                lastCanvasStateRef.current = JSON.stringify(designToLoad.canvasJSON)
                console.log('📂 [useVariationDesignPersistence] Loaded design for new variation/view:', {
                  variationId: currentVariationId,
                  viewMode: currentViewModeRef.current,
                  objectCount: designToLoad.canvasJSON?.objects?.length || 0
                })
              })
            } catch (error) {
              console.error('Error loading design:', error)
            }
          } else {
            console.log('🔄 [useVariationDesignPersistence] Design found but empty, keeping canvas clear')
          }
        } else {
          console.error('⚠️ [useVariationDesignPersistence] Design mismatch prevented!', {
            expected: { variationId: currentVariationId, viewMode: currentViewModeRef.current },
            found: { variationId: designToLoad.variationId, viewMode: designToLoad.viewMode }
          })
          fabricCanvas.clear()
          fabricCanvas.requestRenderAll()
        }
      } else {
        fabricCanvas.requestRenderAll()
        console.log('🔄 [useVariationDesignPersistence] No design found, canvas cleared for:', {
          variationId: currentVariationId,
          viewMode: currentViewModeRef.current
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabricCanvas, viewMode, selectedProduct?.id]) // Removed productColor since we don't use it for IDs anymore

  // Additional effect to handle product restoration after hook initialization
  useEffect(() => {
    if (fabricCanvas && selectedProduct) {
      const variationId = getCurrentVariationId()
      if (variationId) {
        console.log('🔄 [useVariationDesignPersistence] Product restored, attempting to load design')
        
        // Small delay to ensure canvas is ready
        setTimeout(() => {
          const designLoaded = loadCurrentDesign()
          if (designLoaded) {
            console.log('🔄 [useVariationDesignPersistence] Design successfully loaded after product restoration')
          } else {
            console.log('🔄 [useVariationDesignPersistence] No design found after product restoration')
          }
        }, 100)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct?.id, fabricCanvas]) // Only depend on actual data changes, not functions
  
  // Persist designs to localStorage whenever they change
  useEffect(() => {
    if (variationDesigns.length > 0) {
      saveToLocalStorage(variationDesigns)
    }
  }, [variationDesigns, saveToLocalStorage])
  
  // DISABLED: Initial design sharing across variations when product is first loaded
  // Each angle should have completely independent designs
  // useEffect(() => {
  //   // Auto-sharing disabled to keep designs independent per angle
  // }, [selectedProduct?.id, variationDesigns, dispatch])
  
  // Manual design sharing function for design management panel
  const shareDesignToVariations = useCallback((targetVariationIds: string[]) => {
    if (!fabricCanvas || !getCurrentVariationId()) return false
    
    const variationId = getCurrentVariationId()
    const currentView = currentViewModeRef.current
    const currentDesign = variationDesigns.find(
      d => d.variationId === variationId && d.viewMode === currentView
    )
    
    if (!currentDesign) {
      console.warn('No current design to share')
      return false
    }
    
    // Get all variations that have this same view mode
    const variationsWithSameView = getVariationsWithSpecificView(currentView)
    
    // Filter target variations to only include those that have this view mode
    const validTargets = targetVariationIds.filter(targetId => {
      // Check if target variation has this view mode
      const hasView = variationsWithSameView.includes(targetId)
      
      // Check if target variation already has a design for this view
      const existingDesign = variationDesigns.find(
        d => d.variationId === targetId && d.viewMode === currentView
      )
      
      if (!hasView) {
        console.log(`ℹ️ [useVariationDesignPersistence] Skipping variation ${targetId} - doesn't have ${currentView} view`)
        return false
      }
      
      if (existingDesign) {
        console.log(`ℹ️ [useVariationDesignPersistence] Skipping variation ${targetId} - already has design for ${currentView} view`)
        return false
      }
      
      return true
    })
    
    if (validTargets.length === 0) {
      console.log('ℹ️ [useVariationDesignPersistence] No valid target variations to share with')
      return false
    }
    
    console.log('🔄 [useVariationDesignPersistence] Manually sharing design to variations:', {
      sourceVariation: variationId,
      targetVariations: validTargets,
      viewMode: currentView,
      totalVariationsWithView: variationsWithSameView.length
    })
    
    dispatch(shareDesignAcrossVariations({
      sourceVariationId: variationId,
      viewMode: currentView,
      canvasJSON: currentDesign.canvasJSON,
      targetVariationIds: validTargets
    }))
    
    console.log('✅ [useVariationDesignPersistence] Design manually shared successfully to variations:', validTargets)
    
    return true
  }, [fabricCanvas, getCurrentVariationId, variationDesigns, dispatch, getVariationsWithSpecificView])

  // Auto-cleanup bad designs when product changes
  const cleanupBadDesigns = useCallback(() => {
    const currentProduct = currentSelectedProductRef.current
    if (!currentProduct) return
    
    console.log('🧹 [useVariationDesignPersistence] Checking for bad designs to cleanup...')
    
    let cleanedCount = 0
    const keysToRemove: string[] = []
    
    // Check localStorage for bad variation designs
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue
      
      // Remove ALL design keys that don't use angle pattern
      if (key.startsWith('design_') && !key.includes('_angle_')) {
        keysToRemove.push(key)
        cleanedCount++
      }
      // Remove old variation_design_ keys
      else if (key.includes('variation_design_')) {
        keysToRemove.push(key)
        cleanedCount++
      }
      // Check for bad patterns in any design key
      else if (key.includes('design_')) {
        if (key.includes('_#') || // Old hex color pattern
            key.includes('_000000_') || 
            key.includes('_NO_COLOR_SELECTED_') ||
            key.includes('_default_') ||
            key.includes('__') ||
            key.includes('_var')) { // Old variation pattern
          keysToRemove.push(key)
          cleanedCount++
        }
      }
    }
    
    // Remove bad designs
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log('🗑️ [useVariationDesignPersistence] Removed bad design key:', key)
    })
    
    // Also clean the variationDesigns key
    const storedDesigns = loadFromLocalStorage()
    if (storedDesigns.length > 0) {
      const validDesigns = storedDesigns.filter((design: any) => 
        design.variationId?.includes('_angle_')
      )
      
      if (validDesigns.length < storedDesigns.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validDesigns))
        cleanedCount += storedDesigns.length - validDesigns.length
        console.log('✅ Cleaned variationDesigns storage:', storedDesigns.length - validDesigns.length, 'old designs removed')
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`✅ [useVariationDesignPersistence] Total cleaned: ${cleanedCount} bad designs`)
      
      // Clear Redux and reload with clean data
      const validDesigns = loadFromLocalStorage()
      dispatch(setVariationDesigns(validDesigns))
    }
  }, [dispatch, loadFromLocalStorage])
  
  // Run cleanup when product changes or on mount
  useEffect(() => {
    // Always run cleanup on mount and when product changes
    cleanupBadDesigns()
  }, [selectedProduct?.id, cleanupBadDesigns])
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])
  
  // Calculate hasCurrentDesign only once per render using useMemo
  const hasCurrentDesign = useMemo(() => {
    const currentId = getCurrentVariationId()
    const currentView = currentViewModeRef.current
    return currentId ? variationDesigns.some(
      d => d.variationId === currentId && d.viewMode === currentView
    ) : false
  }, [variationDesigns, viewMode, selectedProduct?.id]) // Re-calculate when these change
  
  return {
    saveCurrentDesign,
    loadCurrentDesign,
    clearCurrentDesign,
    handleAutoSave,
    getCurrentVariationId,
    getVariationsWithCurrentView,
    getVariationsWithSpecificView, // New function for design sharing
    getAvailableViewModes, // New function for single products
    getAllDesignedAngles, // New function for getting all designed angles
    hasCurrentDesign,
    saveToLocalStorage,
    loadFromLocalStorage,
    shareDesignToVariations // New function for manual sharing
  }
}
