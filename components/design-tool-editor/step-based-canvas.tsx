"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { useCurrency } from "@/contexts/CurrencyContext"
import { 
  setHasDesignElements, 
  setDesignAreaCm2, 
  setDesignAreaPercentage,
  setSelectedProduct,
  setSelectedTool,
  setProductColor 
} from "@/lib/redux/designToolSlices/designSlice"
import { TextPanel } from "./design-tool/panels/text-panel"
import { TemplatePanel } from "./design-tool/panels/template-panel"
import { UploadPanel } from "./design-tool/panels/upload-panel"
import { LeftToolbar } from "./design-tool/left-toolbar"

interface StepBasedCanvasProps {
  product: any
  stepNumber: number
  angle: 'front' | 'back' | 'left' | 'right'
}

export function StepBasedCanvas({ product, stepNumber, angle }: StepBasedCanvasProps) {
  const dispatch = useAppDispatch()
  const { formatPrice } = useCurrency()
  const selectedTool = useAppSelector((state) => state.design.selectedTool)
  const productColor = useAppSelector((state) => state.design.productColor)
  const designAreaCm2Redux = useAppSelector((state) => state.design.designAreaCm2)
  const [canvasScale, setCanvasScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [currentImage, setCurrentImage] = useState<string>("")
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [canvasReady, setCanvasReady] = useState(false)
  // Use Redux design area directly
  const localDesignArea = designAreaCm2Redux
  const setLocalDesignArea = (area: number) => {
    dispatch(setDesignAreaCm2(area))
  }
  const mountedRef = useRef(true)
  
  // Set the product in Redux when component mounts
  useEffect(() => {
    if (product) {
      console.log('🔧 Setting product in Redux:', product.name)
      dispatch(setSelectedProduct(product))
      // Always set text tool as default to ensure panel shows
      dispatch(setSelectedTool('text'))
    }
  }, [product, dispatch])
  
  // Use the standard canvas ID that the panels expect
  const canvasId = "design-canvas"
  
  const { canvasRef, loadFromJSON, setDesignBoundaries, exportCanvas, getCanvasInstance, applyBoundaries } = useFabricCanvas(canvasId, { 
    isMobile, 
    canvasScale 
  })
  
  // Get the fabric canvas instance
  const getFabricCanvas = useCallback(() => {
    if (typeof window === 'undefined') return null
    // Use the getCanvasInstance function from the hook
    const canvas = getCanvasInstance()
    if (canvas) {
      // Ensure it's also set globally for other components
      if (!(window as any).fabricCanvas) {
        (window as any).fabricCanvas = canvas
      }
    }
    return canvas
  }, [getCanvasInstance])
  
  // Cleanup on unmount and save current design
  useEffect(() => {
    mountedRef.current = true
    
    return () => {
      // Save current design before unmounting
      if (mountedRef.current && product?.id) {
        console.log(`🚪 Component unmounting - saving step ${stepNumber}`)
        const canvas = getFabricCanvas()
        if (canvas && !canvas.disposed) {
          try {
            const canvasJSON = canvas.toJSON()
            if (canvasJSON.objects && canvasJSON.objects.length > 0) {
              const storageKey = `design_${product.id}_step_${stepNumber}`
              const areaKey = `design_${product.id}_step_${stepNumber}_area`
              
              const designData = {
                productId: product.id,
                stepNumber,
                angle,
                canvasJSON,
                designAreaCm2: localDesignArea,
                designAreaPercentage: (localDesignArea / 900) * 100,
                productColor: productColor,
                timestamp: Date.now()
              }
              
              localStorage.setItem(storageKey, JSON.stringify(designData))
              localStorage.setItem(areaKey, localDesignArea.toString())
              console.log(`💾 Saved design on unmount for step ${stepNumber} with ${canvasJSON.objects.length} objects`)
            }
          } catch (error) {
            console.error('Error saving on unmount:', error)
          }
        }
      }
      
      mountedRef.current = false
      // Clean up canvas on unmount
      const canvas = getFabricCanvas()
      if (canvas && !canvas.disposed) {
        try {
          // Remove all event listeners first
          if (typeof canvas.off === 'function') {
            canvas.off()
          }
          
          // Try to get the canvas element safely
          let canvasEl = null
          try {
            if (typeof canvas.getElement === 'function') {
              canvasEl = canvas.getElement()
            }
          } catch (e) {
            console.warn('Could not get canvas element:', e)
          }
          
          // Clear the canvas if we have a valid element
          if (canvasEl) {
            try {
              const ctx = canvasEl.getContext ? canvasEl.getContext('2d') : null
              if (ctx && typeof ctx.clearRect === 'function') {
                const width = canvasEl.width || 0
                const height = canvasEl.height || 0
                if (width > 0 && height > 0) {
                  ctx.clearRect(0, 0, width, height)
                }
              }
            } catch (clearError) {
              console.warn('Could not clear canvas context:', clearError)
            }
          }
          
          // Don't dispose the canvas - keep it alive for navigation
          // Just clear the canvas reference to avoid memory leaks
          console.log('🔄 Keeping canvas alive for navigation')
        } catch (error) {
          console.error('Error cleaning up canvas:', error)
        }
        
        // Clear the global reference
        if (typeof window !== 'undefined' && (window as any).fabricCanvas === canvas) {
          delete (window as any).fabricCanvas
        }
      }
    }
  }, [getFabricCanvas, product?.id, stepNumber, angle, localDesignArea, productColor])
  
  // Handle responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      
      if (width < 640) {
        setCanvasScale(0.5)
      } else if (width < 768) {
        setCanvasScale(0.7)
      } else if (width < 1024) {
        setCanvasScale(0.85)
      } else {
        setCanvasScale(1)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Get image for current angle
  const getCurrentImage = useCallback(() => {
    if (!product) {
      console.log('🖼️ No product data available')
      return ""
    }
    
    console.log('🖼️ Getting image for angle:', angle, 'Product:', product.name)
    console.log('🖼️ Product data:', {
      id: product.id || product._id,
      name: product.name,
      image: product.image,
      frontImage: product.frontImage,
      backImage: product.backImage,
      leftImage: product.leftImage,
      rightImage: product.rightImage,
      hasVariations: product.hasVariations,
      variationsCount: product.variations?.length || 0
    })
    
    // Check if product has variations
    if (product.hasVariations && product.variations) {
      console.log('🖼️ Product has variations:', product.variations.length)
      const currentVariation = product.variations[0] // Use first variation for now
      if (currentVariation?.images) {
        console.log('🖼️ Variation images:', currentVariation.images)
        const angleImage = currentVariation.images.find((img: any) => 
          img.angle === angle && img.url && img.url.trim() !== ''
        )
        if (angleImage) {
          console.log('🖼️ Found variation image:', angleImage.url)
          return angleImage.url
        }
      }
    }
    
    // Fall back to individual angle images
    const angleImageMap = {
      'front': product.frontImage || product.image,
      'back': product.backImage,
      'left': product.leftImage,
      'right': product.rightImage
    }
    
    const imageUrl = angleImageMap[angle] || product.image || ""
    console.log('🖼️ Final image URL for', angle, ':', imageUrl)
    return imageUrl
  }, [product, angle])
  
  // Get design frames for current angle
  const getCurrentFrames = useCallback(() => {
    if (!product) return []
    
    // Use product-level frames
    if (product.designFrames) {
      const frames = product.designFrames.filter((frame: any) => 
        frame.angle === angle || frame.position === angle
      )
      console.log('📐 Using product frames:', frames)
      return frames
    }
    
    console.log('📐 No frames found for angle:', angle)
    return []
  }, [product, angle])
  
  // Load saved design for this step
  const loadStepDesign = useCallback(() => {
    if (!mountedRef.current) return
    
    const storageKey = `design_${product.id}_step_${stepNumber}`
    const savedDesign = localStorage.getItem(storageKey)
    
    // First, try to load variation from any saved step
    let savedVariation = null
    let savedColor = null
    for (let step = 1; step <= 4; step++) {
      const key = `design_${product.id}_step_${step}`
      const saved = localStorage.getItem(key)
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.selectedVariation) {
            savedVariation = data.selectedVariation
            savedColor = data.productColor
            break
          }
        } catch (e) {}
      }
    }
    
    // Apply saved variation if found
    if (savedColor && savedColor !== productColor) {
      dispatch(setProductColor(savedColor))
    }
    
    if (savedDesign && loadFromJSON) {
      try {
        const designData = JSON.parse(savedDesign)
        console.log(`📂 Loading design for step ${stepNumber}:`, designData)
        
        if (mountedRef.current) {
          loadFromJSON(designData.canvasJSON)
          
          // Update Redux state with the saved area immediately
          if (designData.designAreaCm2 !== undefined) {
            const savedArea = designData.designAreaCm2
            setLocalDesignArea(savedArea)
            dispatch(setDesignAreaCm2(savedArea))
            
            // Also save to quick access storage
            const areaKey = `design_${product.id}_step_${stepNumber}_area`
            localStorage.setItem(areaKey, savedArea.toString())
            console.log(`📏 Loaded design area for step ${stepNumber}: ${savedArea} cm²`)
            
            // After canvas loads, restore the saved area again to prevent it from being overwritten
            setTimeout(() => {
              if (mountedRef.current && savedArea > 0) {
                console.log(`📏 Restoring area after canvas load: ${savedArea} cm²`)
                setLocalDesignArea(savedArea)
                dispatch(setDesignAreaCm2(savedArea))
                localStorage.setItem(areaKey, savedArea.toString())
              }
            }, 500)
          }
          if (designData.designAreaPercentage) {
            dispatch(setDesignAreaPercentage(designData.designAreaPercentage))
          }
          dispatch(setHasDesignElements(designData.canvasJSON?.objects?.length > 0))
        }
      } catch (error) {
        console.error('Error loading saved design:', error)
      }
    } else {
      console.log(`📭 No saved design for step ${stepNumber}`)
      // Check if there's a saved area even without a full design
      const areaKey = `design_${product.id}_step_${stepNumber}_area`
      const savedArea = localStorage.getItem(areaKey)
      
      if (savedArea) {
        const area = parseFloat(savedArea) || 0
        console.log(`📏 Restored area for step ${stepNumber}: ${area} cm² (no design)`)
        setLocalDesignArea(area)
        dispatch(setDesignAreaCm2(area))
      } else {
        // Clear canvas for new step but keep boundaries
        const canvas = getFabricCanvas()
        if (canvas && mountedRef.current && !canvas.disposed) {
          // Only remove non-boundary objects
          const objectsToRemove = canvas.getObjects().filter((obj: any) => !obj.isBoundaryIndicator)
          objectsToRemove.forEach((obj: any) => {
            canvas.remove(obj)
          })
          canvas.requestRenderAll()
          setLocalDesignArea(0)
        }
      }
    }
  }, [product.id, stepNumber, loadFromJSON, dispatch, getFabricCanvas, productColor])
  
  // Save design for this step
  const saveStepDesign = useCallback(() => {
    if (!mountedRef.current || !product?.id) return
    
    const canvas = getFabricCanvas()
    if (!canvas || canvas.disposed) return
    
    try {
      const canvasJSON = canvas.toJSON()
      const storageKey = `design_${product.id}_step_${stepNumber}`
      
      // Use the current local design area
      const currentArea = localDesignArea
      
      const designData = {
        productId: product.id,
        stepNumber,
        angle,
        canvasJSON,
        designAreaCm2: currentArea,
        designAreaPercentage: (currentArea / 900) * 100,
        productColor: productColor,
        timestamp: Date.now()
      }
      
      localStorage.setItem(storageKey, JSON.stringify(designData))
      
      // Also save the area separately for quick access
      const areaKey = `design_${product.id}_step_${stepNumber}_area`
      localStorage.setItem(areaKey, currentArea.toString())
      
      console.log(`💾 Saved design for step ${stepNumber} (${angle}) with area: ${currentArea} cm²`)
    } catch (error) {
      console.error('Error saving design:', error)
    }
  }, [product, stepNumber, angle, getFabricCanvas, localDesignArea, productColor])
  
  // Auto-save on canvas changes
  useEffect(() => {
    if (!mountedRef.current) return
    
    const canvas = getFabricCanvas()
    if (!canvas) return
    
    let saveTimeout: NodeJS.Timeout
    
    const handleCanvasChange = () => {
      if (!mountedRef.current) return
      
      // Clear existing timeout
      if (saveTimeout) clearTimeout(saveTimeout)
      
      // Set new timeout for auto-save (debounced)
      saveTimeout = setTimeout(() => {
        if (mountedRef.current) {
          saveStepDesign()
        }
      }, 1000) // Save after 1 second of inactivity
    }
    
    // Listen to canvas events - including real-time updates
    canvas.on('object:added', handleCanvasChange)
    canvas.on('object:modified', handleCanvasChange)
    canvas.on('object:removed', handleCanvasChange)
    canvas.on('object:scaling', handleCanvasChange)
    canvas.on('object:rotating', handleCanvasChange)
    canvas.on('object:moving', handleCanvasChange)
    
    return () => {
      if (saveTimeout) clearTimeout(saveTimeout)
      if (canvas && !canvas.disposed) {
        canvas.off('object:added', handleCanvasChange)
        canvas.off('object:modified', handleCanvasChange)
        canvas.off('object:removed', handleCanvasChange)
        canvas.off('object:scaling', handleCanvasChange)
        canvas.off('object:rotating', handleCanvasChange)
        canvas.off('object:moving', handleCanvasChange)
      }
    }
  }, [getFabricCanvas, saveStepDesign])
  
  // Load image when component mounts or angle changes
  useEffect(() => {
    const imageUrl = getCurrentImage()
    console.log('🎨 Image URL for angle', angle, ':', imageUrl)
    setCurrentImage(imageUrl)
    if (imageUrl) {
      setIsImageLoading(true)
    }
  }, [product, angle])
  
  // Set design boundaries when frames are available
  useEffect(() => {
    if (!mountedRef.current) return
    
    let retryCount = 0
    const maxRetries = 10
    
    const applyBoundaries = () => {
      const frames = getCurrentFrames()
      console.log(`🎯 Checking frames for ${angle}:`, frames)
      console.log('📐 Product designFrames:', product?.designFrames)
      
      // Check if canvas is ready
      const canvas = getFabricCanvas()
      if (!canvas && retryCount < maxRetries) {
        retryCount++
        console.log(`⏳ Canvas not ready for boundaries, retrying... (${retryCount}/${maxRetries})`)
        setTimeout(applyBoundaries, 300)
        return
      }
      
      // Always set boundaries - either custom or default
      if (setDesignBoundaries) {
        if (frames.length === 0) {
          // Create default frame for the angle (in cm)
          const defaultFrame = {
            angle: angle,
            position: angle,
            x: 150,
            y: 150,
            width: 20, // 20cm width
            height: 25, // 25cm height
            widthPx: 20 * 37.795, // Convert cm to pixels
            heightPx: 25 * 37.795,
            xPercent: 25,
            yPercent: 25,
            widthPercent: 50,
            heightPercent: 62.5,
            costPerCm2: product?.designCostPerCm2 || 0.5
          }
          console.log(`📐 Using default frame for ${angle}:`, defaultFrame)
          setDesignBoundaries([defaultFrame], { isMobile, canvasScale })
        } else {
          console.log(`🎯 Setting design boundaries for step ${stepNumber}:`, frames)
          setDesignBoundaries(frames, { isMobile, canvasScale })
        }
      }
    }
    
    // Start applying boundaries
    applyBoundaries()
  }, [getCurrentFrames, setDesignBoundaries, getFabricCanvas, isMobile, canvasScale, stepNumber, angle, product])
  
  // Load saved design when canvas is ready
  useEffect(() => {
    if (!mountedRef.current) return
    
    const checkCanvasAndLoad = () => {
      if (!mountedRef.current) return
      
      const canvas = getFabricCanvas()
      if (canvas && mountedRef.current) {
        loadStepDesign()
      } else if (mountedRef.current) {
        // Retry after a short delay
        setTimeout(checkCanvasAndLoad, 100)
      }
    }
    
    checkCanvasAndLoad()
  }, [getFabricCanvas, loadStepDesign])
  
  // State to trigger re-renders for price updates
  const [, forceUpdate] = useState({})
  
  // Calculate total design area across all steps
  const getTotalDesignArea = useCallback(() => {
    let totalArea = 0
    for (let step = 1; step <= 4; step++) {
      if (step === stepNumber) {
        // Use current live area for current step
        totalArea += localDesignArea
      } else {
        // First try to get the live area from localStorage
        const areaKey = `design_${product?.id}_step_${step}_area`
        const savedArea = localStorage.getItem(areaKey)
        if (savedArea) {
          totalArea += parseFloat(savedArea) || 0
        } else {
          // Fallback to design data
          const storageKey = `design_${product?.id}_step_${step}`
          const savedDesign = localStorage.getItem(storageKey)
          if (savedDesign) {
            try {
              const designData = JSON.parse(savedDesign)
              totalArea += (designData.designAreaCm2 || 0)
            } catch (e) {
              console.error('Error parsing saved design:', e)
            }
          }
        }
      }
    }
    return Math.round(totalArea * 10) / 10 // Round to 1 decimal
  }, [product?.id, localDesignArea, stepNumber])
  
  // Force re-render when local design area changes
  useEffect(() => {
    forceUpdate({})
  }, [localDesignArea])

  // Calculate price with design area - memoized for performance
  const calculatePrice = useCallback(() => {
    const basePrice = product?.price || 0
    const totalDesignArea = getTotalDesignArea()
    const pricePerCm2 = product?.designCostPerCm2 || 0.5 // Use product's designCostPerCm2
    const designCost = totalDesignArea * pricePerCm2
    const totalPrice = basePrice + designCost
    console.log(`💰 Price calc - Base: ${basePrice}, Design area: ${totalDesignArea} cm², Cost per cm²: ${pricePerCm2}, Design cost: ${designCost}, Total: ${totalPrice}`)
    return totalPrice
  }, [product?.price, product?.designCostPerCm2, getTotalDesignArea])
  
  // Track canvas changes to update design area with proper calculation
  useEffect(() => {
    let mounted = true
    let canvasReadyListener: any = null
    let skipInitialCalculation = false
    
    // Check if we're loading a saved design
    const storageKey = `design_${product?.id}_step_${stepNumber}`
    const hasSavedDesign = localStorage.getItem(storageKey) !== null
    
    const setupCanvasMonitoring = () => {
      if (!mounted) return
      
      const canvas = getFabricCanvas()
      
      // If canvas not ready, wait for the ready event
      if (!canvas || canvas.disposed) {
        console.log('⏳ Waiting for canvas ready event...')
        
        // Listen for canvas ready event
        canvasReadyListener = (e: CustomEvent) => {
          console.log('🎨 Canvas ready event received!')
          if (mounted && e.detail?.canvas) {
            // After canvas is ready, restore the saved area for this step
            const areaKey = `design_${product?.id}_step_${stepNumber}_area`
            const savedArea = localStorage.getItem(areaKey)
            if (savedArea) {
              const area = parseFloat(savedArea) || 0
              console.log(`📏 Restored area for step ${stepNumber}: ${area} cm²`)
              setLocalDesignArea(area)
            }
            setupCanvasMonitoring()
          }
        }
        window.addEventListener('fabricCanvasReady', canvasReadyListener)
        
        // Also try again after a delay in case event was already fired
        setTimeout(() => {
          if (mounted) {
            const retryCanvas = getFabricCanvas()
            if (retryCanvas && !retryCanvas.disposed) {
              setupCanvasMonitoring()
            }
          }
        }, 500)
        return
      }
      
      console.log('✅ Canvas monitoring setup successful')
      console.log('📊 Canvas object count:', canvas.getObjects().length)
      
      const calculateActualDesignArea = () => {
        const objects = canvas.getObjects()
        let totalArea = 0
        
        // Canvas dimensions in pixels
        const canvasWidth = canvas.width || 600
        const canvasHeight = canvas.height || 600
        
        // Assume canvas represents 40cm x 40cm physical area
        const physicalWidth = 40 // cm
        const physicalHeight = 40 // cm
        const pixelToCm = physicalWidth / canvasWidth
        
        objects.forEach((obj: any) => {
          // Skip boundary indicators and background objects
          if (obj.visible && !obj.isBackground && !obj.isBoundaryIndicator) {
            // Get the bounding box of the object
            const boundingRect = obj.getBoundingRect(true, true)
            
            // Check if bounding rect is valid
            if (!boundingRect || boundingRect.width === 0 || boundingRect.height === 0) {
              console.warn(`⚠️ Invalid bounding rect for object type ${obj.type}:`, boundingRect)
              // Try alternative method
              const width = obj.width * (obj.scaleX || 1)
              const height = obj.height * (obj.scaleY || 1)
              if (width > 0 && height > 0) {
                const widthCm = width * pixelToCm
                const heightCm = height * pixelToCm
                const areaCm2 = widthCm * heightCm
                console.log(`📐 Using alternative calc for ${obj.type}: ${areaCm2.toFixed(2)} cm²`)
                if (obj.type === 'text' || obj.type === 'i-text') {
                  totalArea += areaCm2 * 0.6
                } else {
                  totalArea += areaCm2
                }
              }
            } else {
              // Calculate area in pixels
              const widthPx = boundingRect.width
              const heightPx = boundingRect.height
              
              // Convert to cm²
              const widthCm = widthPx * pixelToCm
              const heightCm = heightPx * pixelToCm
              const areaCm2 = widthCm * heightCm
              
              console.log(`📐 Object type: ${obj.type}, Bounds: ${widthPx.toFixed(1)}x${heightPx.toFixed(1)}px, Area: ${areaCm2.toFixed(2)} cm²`)
              
              // For text, adjust based on actual character coverage (approximately 60% of bounding box)
              if (obj.type === 'text' || obj.type === 'i-text') {
                totalArea += areaCm2 * 0.6
              } else {
                totalArea += areaCm2
              }
            }
          }
        })
        
        return Math.round(totalArea * 10) / 10 // Round to 1 decimal place
      }
      
      const updateDesignArea = () => {
        const area = calculateActualDesignArea()
        console.log(`📏 Live update - Step ${stepNumber}: ${area} cm²`)
        console.log('💰 Product price:', product?.price, 'Cost per cm²:', product?.designCostPerCm2)
        
        // Check if we have actual design objects (not just boundaries)
        const designObjects = canvas.getObjects().filter((obj: any) => !obj.isBoundaryIndicator)
        console.log(`🎨 Design objects count: ${designObjects.length}`)
        
        // If area is 0 but we have design objects, there might be a calculation issue
        if (area === 0 && designObjects.length > 0) {
          console.warn(`⚠️ Area calculated as 0 but we have ${designObjects.length} design objects`)
          // Log the objects for debugging
          designObjects.forEach((obj: any, index: number) => {
            console.log(`  Object ${index}: type=${obj.type}, visible=${obj.visible}, isBoundary=${obj.isBoundaryIndicator}`)
          })
        }
        
        setLocalDesignArea(area)
        dispatch(setDesignAreaCm2(area))
        
        // Force re-render to update price display
        forceUpdate({})
        
        // Calculate percentage of printable area (assume 30x30cm printable area = 900cm²)
        const percentage = (area / 900) * 100
        dispatch(setDesignAreaPercentage(Math.min(percentage, 100)))
        
        // Save to localStorage immediately for price calculation
        const areaKey = `design_${product?.id}_step_${stepNumber}_area`
        if (product?.id) {
          localStorage.setItem(areaKey, area.toString())
        }
      }
      
      // Initial calculation after a short delay to ensure canvas is ready
      // Skip if we have a saved design that was just loaded
      const initTimer = setTimeout(() => {
        if (!hasSavedDesign) {
          updateDesignArea()
        } else {
          // For saved designs, wait longer to ensure objects are loaded
          setTimeout(() => {
            if (mounted) {
              updateDesignArea()
            }
          }, 1000)
        }
      }, 100)
      
      // Listen to canvas events for live updates
      let changeTimeout: NodeJS.Timeout
      const handleCanvasChange = (e?: any) => {
        const eventType = e?.e?.type || e?.type || 'unknown'
        console.log('🎨 Canvas changed event:', eventType, 'Target:', e?.target?.type)
        
        // For scaling events, update immediately without debounce
        if (eventType === 'scale' || eventType === 'scaling' || e?.action === 'scale') {
          console.log('📏 Scaling detected - updating immediately')
          if (mounted) {
            updateDesignArea()
          }
        } else {
          // Debounce other events
          if (changeTimeout) clearTimeout(changeTimeout)
          changeTimeout = setTimeout(() => {
            if (mounted) {
              updateDesignArea()
            }
          }, 50)
        }
      }
      
      // Listen to canvas events for live updates
      canvas.on('object:added', handleCanvasChange)
      canvas.on('object:modified', handleCanvasChange)
      canvas.on('object:removed', handleCanvasChange)
      canvas.on('object:scaling', handleCanvasChange)
      canvas.on('object:rotating', handleCanvasChange)
      canvas.on('object:moving', handleCanvasChange)
      canvas.on('path:created', handleCanvasChange)
      canvas.on('text:changed', handleCanvasChange)
      
      // For truly real-time updates during scaling
      canvas.on('object:resizing', handleCanvasChange)
      canvas.on('object:skewing', handleCanvasChange)
      
      // Track mouse state and active object for real-time updates
      let isTransforming = false
      let activeObject: any = null
      let updateInterval: NodeJS.Timeout | null = null
      
      // Track when object transformation starts
      canvas.on('selection:created', (e: any) => {
        activeObject = e.selected?.[0] || e.target
        console.log('🎯 Object selected:', activeObject?.type)
      })
      
      canvas.on('selection:updated', (e: any) => {
        activeObject = e.selected?.[0] || e.target
        console.log('🎯 Selection updated:', activeObject?.type)
      })
      
      canvas.on('selection:cleared', () => {
        activeObject = null
        isTransforming = false
        if (updateInterval) {
          clearInterval(updateInterval)
          updateInterval = null
        }
      })
      
      // Use mouse:move to detect when user is actively transforming (scaling/rotating)
      canvas.on('mouse:move', (e: any) => {
        // Check if we have an active object and if it's being transformed
        const active = canvas.getActiveObject()
        if (active && !isTransforming) {
          // Check if any transform control is active (corners, rotation point, etc.)
          const pointer = canvas.getPointer(e.e)
          const activeControl = active.__corner
          
          // If mouse is down and we have an active object, we're likely transforming
          if (e.e.buttons === 1 && active) {
            console.log('🔄 Transform started - enabling real-time updates')
            isTransforming = true
            
            // Start interval for continuous updates
            if (updateInterval) clearInterval(updateInterval)
            updateInterval = setInterval(() => {
              if (isTransforming && mounted) {
                console.log('⚡ Real-time update during transform')
                updateDesignArea()
              }
            }, 50) // Update every 50ms for smoother updates
          }
        }
        
        // If transforming and mouse is still down, continue updating
        if (isTransforming && e.e.buttons === 1 && mounted) {
          // Immediate update on mouse move
          updateDesignArea()
        }
      })
      
      // Stop updates when mouse is released
      canvas.on('mouse:up', () => {
        if (isTransforming) {
          console.log('🛑 Transform ended - stopping real-time updates')
          isTransforming = false
          
          if (updateInterval) {
            clearInterval(updateInterval)
            updateInterval = null
          }
          
          // Final update to ensure accuracy
          if (mounted) {
            setTimeout(() => {
              updateDesignArea()
            }, 50)
          }
        }
      })
      
      // Alternative: Use Fabric's built-in scaling event which fires continuously
      let scaleTimeout: NodeJS.Timeout
      canvas.on('object:scaling', (e: any) => {
        console.log('📐 Object scaling in progress')
        // Update immediately
        if (mounted) {
          updateDesignArea()
        }
        
        // Clear previous timeout
        if (scaleTimeout) clearTimeout(scaleTimeout)
        
        // Set a new timeout for final update
        scaleTimeout = setTimeout(() => {
          if (mounted) {
            console.log('📐 Final scaling update')
            updateDesignArea()
          }
        }, 100)
      })
      
      // Also handle rotation
      canvas.on('object:rotating', (e: any) => {
        console.log('🔄 Object rotating')
        if (mounted) {
          updateDesignArea()
        }
      })
      
      // Handle moving
      canvas.on('object:moving', (e: any) => {
        // Moving doesn't change area, but update anyway for consistency
        if (mounted) {
          updateDesignArea()
        }
      })
      
      // Return cleanup function for this canvas
      return () => {
        if (changeTimeout) clearTimeout(changeTimeout)
        if (updateInterval) clearInterval(updateInterval)
        if (scaleTimeout) clearTimeout(scaleTimeout)
        if (canvas && !canvas.disposed) {
          canvas.off('object:added', handleCanvasChange)
          canvas.off('object:modified', handleCanvasChange)
          canvas.off('object:removed', handleCanvasChange)
          canvas.off('object:scaling')
          canvas.off('object:rotating')
          canvas.off('object:moving')
          canvas.off('path:created', handleCanvasChange)
          canvas.off('text:changed', handleCanvasChange)
          canvas.off('object:resizing', handleCanvasChange)
          canvas.off('object:skewing', handleCanvasChange)
          canvas.off('selection:created')
          canvas.off('selection:updated')
          canvas.off('selection:cleared')
          canvas.off('mouse:move')
          canvas.off('mouse:up')
        }
      }
    }
    
    // Start the setup process
    let canvasCleanup: (() => void) | undefined
    const initSetup = async () => {
      canvasCleanup = setupCanvasMonitoring()
    }
    initSetup()
    
    // Cleanup on unmount
    return () => {
      mounted = false
      if (canvasReadyListener) {
        window.removeEventListener('fabricCanvasReady', canvasReadyListener)
      }
      if (canvasCleanup) {
        canvasCleanup()
      }
    }
  }, [getFabricCanvas, dispatch, stepNumber, product?.id, forceUpdate])

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)]">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
        {/* Live Price Display */}
        <div className="bg-white dark:bg-gray-800 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Step {stepNumber}: {angle.charAt(0).toUpperCase() + angle.slice(1)} Side
              </div>
              {/* Step indicator with area */}
              <div className="flex items-center gap-1 text-xs">
                {[1, 2, 3, 4].map(step => {
                  const stepAngle = step === 1 ? 'Front' : step === 2 ? 'Back' : step === 3 ? 'Left' : 'Right'
                  const areaKey = `design_${product?.id}_step_${step}_area`
                  const savedArea = typeof window !== 'undefined' ? localStorage.getItem(areaKey) : null
                  const area = step === stepNumber ? localDesignArea : (savedArea ? parseFloat(savedArea) : 0)
                  return (
                    <div 
                      key={step}
                      className={`px-2 py-1 rounded ${
                        step === stepNumber ? 'bg-primary text-white' : 
                        area > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                      }`}
                      title={`${stepAngle}: ${area.toFixed(1)} cm²`}
                    >
                      {step}
                      {area > 0 && <span className="ml-1">✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Live Price Display */}
            <div className="flex items-center gap-4">
              {/* Clear Design Button */}
              {getTotalDesignArea() > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Clear all designs for this product? This cannot be undone.')) {
                      // Clear all saved designs for this product
                      for (let step = 1; step <= 4; step++) {
                        localStorage.removeItem(`design_${product?.id}_step_${step}`)
                        localStorage.removeItem(`design_${product?.id}_step_${step}_area`)
                      }
                      // Clear current canvas but keep boundaries
                      const canvas = getFabricCanvas()
                      if (canvas && !canvas.disposed) {
                        // Only remove non-boundary objects
                        const objectsToRemove = canvas.getObjects().filter((obj: any) => !obj.isBoundaryIndicator)
                        objectsToRemove.forEach((obj: any) => {
                          canvas.remove(obj)
                        })
                        canvas.requestRenderAll()
                        
                        // Re-apply boundaries to ensure they're visible
                        setTimeout(() => {
                          if (applyBoundaries) {
                            applyBoundaries()
                          }
                        }, 50)
                      }
                      // Reset local state
                      setLocalDesignArea(0)
                      dispatch(setDesignAreaCm2(0))
                      dispatch(setDesignAreaPercentage(0))
                      dispatch(setHasDesignElements(false))
                      // Force re-render
                      forceUpdate({})
                      
                      // Re-setup canvas monitoring to ensure price reactivity
                      setTimeout(() => {
                        const canvas = getFabricCanvas()
                        if (canvas && !canvas.disposed) {
                          console.log('🔄 Re-initializing canvas monitoring after clear')
                          
                          // Trigger a manual update to recalculate area
                          const updateDesignArea = () => {
                            const objects = canvas.getObjects()
                            let totalArea = 0
                            const canvasWidth = canvas.width || 600
                            const physicalWidth = 40 // cm
                            const pixelToCm = physicalWidth / canvasWidth
                            
                            objects.forEach((obj: any) => {
                              if (obj.visible && !obj.isBackground && !obj.isBoundaryIndicator) {
                                const boundingRect = obj.getBoundingRect(true, true)
                                if (boundingRect && boundingRect.width > 0 && boundingRect.height > 0) {
                                  const widthCm = boundingRect.width * pixelToCm
                                  const heightCm = boundingRect.height * pixelToCm
                                  const areaCm2 = widthCm * heightCm
                                  if (obj.type === 'text' || obj.type === 'i-text') {
                                    totalArea += areaCm2 * 0.6
                                  } else {
                                    totalArea += areaCm2
                                  }
                                }
                              }
                            })
                            
                            const area = Math.round(totalArea * 10) / 10
                            console.log(`📏 Post-clear area update: ${area} cm²`)
                            setLocalDesignArea(area)
                            dispatch(setDesignAreaCm2(area))
                            const percentage = (area / 900) * 100
                            dispatch(setDesignAreaPercentage(Math.min(percentage, 100)))
                            
                            const areaKey = `design_${product?.id}_step_${stepNumber}_area`
                            if (product?.id) {
                              localStorage.setItem(areaKey, area.toString())
                            }
                          }
                          
                          // Re-attach event listeners
                          const handleChange = () => {
                            console.log('🎨 Canvas changed after clear')
                            updateDesignArea()
                          }
                          
                          // Remove any existing listeners first
                          canvas.off('object:added')
                          canvas.off('object:modified')
                          canvas.off('object:removed')
                          canvas.off('object:scaling')
                          canvas.off('object:rotating')
                          canvas.off('object:moving')
                          canvas.off('text:changed')
                          
                          // Re-attach listeners for real-time updates
                          canvas.on('object:added', handleChange)
                          canvas.on('object:modified', handleChange)
                          canvas.on('object:removed', handleChange)
                          canvas.on('object:scaling', handleChange)
                          canvas.on('object:rotating', handleChange)
                          canvas.on('object:moving', handleChange)
                          canvas.on('text:changed', handleChange)
                          
                          // Force initial update
                          updateDesignArea()
                          
                          // Also trigger a full component re-render to restart the main monitoring effect
                          setTimeout(() => {
                            forceUpdate({})
                          }, 100)
                        }
                      }, 200)
                    }
                  }}
                  className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded"
                  title="Clear all designs"
                >
                  Clear All
                </button>
              )}
              
              <div className="text-sm">
                <span className="text-gray-600">Base Price:</span>
                <span className="ml-2 font-medium">{formatPrice(product?.price || 0)}</span>
              </div>
              {getTotalDesignArea() > 0 && (
                <div className="text-sm">
                  <span className="text-gray-600">Design Cost:</span>
                  <span className="ml-2 font-medium">
                    +{formatPrice((product?.designCostPerCm2 || 0.5) * getTotalDesignArea())}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    (Total: {getTotalDesignArea().toFixed(1)} cm² × {formatPrice(product?.designCostPerCm2 || 0.5)}/cm²)
                  </span>
                </div>
              )}
              <div className="text-sm font-bold">
                <span className="text-gray-700">Total:</span>
                <span className="ml-2 text-primary">{formatPrice(calculatePrice())}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="relative">
          {/* Live Design Info Badge */}
          {localDesignArea > 0 && (
            <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-br-lg text-xs font-medium z-20">
              {localDesignArea.toFixed(1)} cm² ink coverage
            </div>
          )}
          {/* Product Image Background */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              width: isMobile ? `${600 * canvasScale}px` : '600px',
              height: isMobile ? `${600 * canvasScale}px` : '600px',
              backgroundColor: '#f3f4f6'
            }}
          >
            {currentImage ? (
              <>
                <img
                  src={currentImage}
                  alt={`${product.name} - ${angle} view`}
                  className="max-w-full max-h-full object-contain"
                  onLoad={() => {
                    console.log('✅ Image loaded successfully:', currentImage)
                    setIsImageLoading(false)
                  }}
                  onError={(e) => {
                    console.error('❌ Failed to load image:', currentImage, e)
                    setIsImageLoading(false)
                  }}
                  style={{ 
                    opacity: isImageLoading ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                />
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-400 text-center">
                <p>No image available</p>
                <p className="text-sm mt-2">Product: {product?.name}</p>
              </div>
            )}
          </div>
          
          {/* Fabric Canvas */}
          <canvas
            ref={canvasRef}
            id={canvasId}
            style={{
              width: isMobile ? `${600 * canvasScale}px` : '600px',
              height: isMobile ? `${600 * canvasScale}px` : '600px',
              position: 'relative',
              zIndex: 10
            }}
          />
        </div>
        </div>
      </div>
      
      {/* Right Panel with Design Tools */}
      <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l overflow-y-auto flex">
        {/* Tool Buttons - Vertical like LeftToolbar */}
        <LeftToolbar />
        
        {/* Tool Panels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {selectedTool === 'text' && <TextPanel />}
            {selectedTool === 'template' && <TemplatePanel />}
            {selectedTool === 'upload' && <UploadPanel />}
          </div>
        </div>
      </div>
    </div>
  )
}