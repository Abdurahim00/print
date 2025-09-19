"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'

interface DesignCanvasRendererProps {
  canvasJSON: any
  productImage: string
  angle: string
}

export function DesignCanvasRenderer({ canvasJSON, productImage, angle }: DesignCanvasRendererProps) {
  const tOrders = useTranslations('orders')
  
  console.log(`🔍 [DesignCanvasRenderer] ${angle} - Component rendered with:`, {
    hasCanvasJSON: !!canvasJSON,
    objectsCount: canvasJSON?.objects?.length || 0,
    productImage: productImage ? 'Present' : 'Missing',
    canvasJSONType: typeof canvasJSON
  })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const fabricCanvasRef = useRef<any>(null)
  const [isRendered, setIsRendered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [containerReady, setContainerReady] = useState(false)
  
  // FIXED: Use useState for mutable canvas ID instead of useRef
  const [canvasId] = useState(`canvas-${angle}-${Math.random().toString(36).substr(2, 9)}`)

  // FIXED: Improved fabric.js loading with proper TypeScript handling
  const loadFabric = useCallback(async () => {
    try {
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Loading fabric.js...`)
      
      // Check if fabric is already loaded globally
      if (typeof window !== 'undefined' && (window as any).fabric) {
        console.log(`🔍 [DesignCanvasRenderer] ${angle} - Using existing fabric.js`)
        return (window as any).fabric
      }
      
      // FIXED: Handle fabric.js dynamic import properly based on its actual export structure
      const fabricModule = await import('fabric')
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Fabric.js loaded successfully`)
      
      // FIXED: Handle different fabric.js export structures
      if ((fabricModule as any).fabric) {
        return (fabricModule as any).fabric
      } else if (fabricModule.default) {
        return fabricModule.default
      } else {
        // For newer versions where fabric is the default export
        return fabricModule
      }
    } catch (err) {
      console.error(`❌ [DesignCanvasRenderer] ${angle} - Failed to load fabric.js:`, err)
      setError(`Failed to load fabric.js: ${err}`)
      return null
    }
  }, [angle])

  // FIXED: Enhanced scaling calculation that maps design to actual product printable area
  const calculateDesignTransform = useCallback((containerWidth: number, containerHeight: number) => {
    // Get the actual canvas JSON dimensions - these represent the original design canvas
    const originalCanvasWidth = canvasJSON?.width || 800
    const originalCanvasHeight = canvasJSON?.height || 600
    
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Original design canvas:`, {
      width: originalCanvasWidth, 
      height: originalCanvasHeight
    })
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Display container:`, {
      width: containerWidth, 
      height: containerHeight
    })
    
    // CRITICAL FIX: Define the actual printable area on the product
    // T-shirts typically have a printable area that's centered but smaller than the full image
    // Standard t-shirt print area is roughly 60-70% of the shirt width and positioned in the center
    const printableAreaRatio = 0.65 // 65% of the container represents the printable area
    const printableWidth = containerWidth * printableAreaRatio
    const printableHeight = containerHeight * printableAreaRatio
    
    // Position the printable area in the center-upper portion of the shirt
    // For t-shirts, the design area typically starts about 20% from the top
    const printableOffsetX = (containerWidth - printableWidth) / 2
    const printableOffsetY = containerHeight * 0.2 // Start 20% from top
    
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Calculated printable area:`, {
      width: printableWidth,
      height: printableHeight,
      offsetX: printableOffsetX,
      offsetY: printableOffsetY
    })
    
    // Scale the design to fit within the printable area
    const scaleX = printableWidth / originalCanvasWidth
    const scaleY = printableHeight / originalCanvasHeight
    const scale = Math.min(scaleX, scaleY)
    
    // Center the scaled design within the printable area
    const scaledDesignWidth = originalCanvasWidth * scale
    const scaledDesignHeight = originalCanvasHeight * scale
    const designCenterX = printableOffsetX + (printableWidth - scaledDesignWidth) / 2
    const designCenterY = printableOffsetY + (printableHeight - scaledDesignHeight) / 2
    
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Final transform:`, {
      scale,
      printableArea: { width: printableWidth, height: printableHeight },
      designPosition: { x: designCenterX, y: designCenterY },
      scaledDesign: { width: scaledDesignWidth, height: scaledDesignHeight }
    })
    
    return { 
      scale, 
      offsetX: designCenterX, 
      offsetY: designCenterY, 
      scaledWidth: scaledDesignWidth, 
      scaledHeight: scaledDesignHeight,
      originalCanvasWidth,
      originalCanvasHeight,
      printableArea: {
        width: printableWidth,
        height: printableHeight,
        offsetX: printableOffsetX,
        offsetY: printableOffsetY
      }
    }
  }, [angle, canvasJSON])

  // FIXED: Canvas initialization with improved error handling and positioning
  const initializeCanvas = useCallback(async () => {
    // Prevent multiple initializations
    if (isInitializing) {
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Already initializing, skipping...`)
      return
    }
    
    const containerElement = containerRef.current
    if (!containerElement || !canvasJSON) {
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Cannot initialize:`, {
        hasContainerElement: !!containerElement,
        hasCanvasJSON: !!canvasJSON
      })
      return
    }

    // Check if there are any design objects to render
    const hasDesignObjects = canvasJSON?.objects && canvasJSON.objects.length > 0
    
    if (!hasDesignObjects) {
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - No design objects to render, skipping canvas creation`)
      setIsRendered(true)
      return
    }

    setIsInitializing(true)
    setError(null)
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Starting render process...`)
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Canvas JSON data:`, {
      objects: canvasJSON.objects?.length || 0,
      dimensions: { width: canvasJSON.width, height: canvasJSON.height }
    })

    try {
      // Load fabric.js with proper error checking
      const fabric = await loadFabric()
      if (!fabric) {
        console.error(`❌ [DesignCanvasRenderer] ${angle} - Fabric loading failed`)
        setError('Failed to load Fabric.js')
        setIsInitializing(false)
        return
      }

      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Fabric.js imported successfully`)

      // Clean up any existing canvas
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose()
          fabricCanvasRef.current = null
        } catch (disposeErr) {
          console.warn(`⚠️ [DesignCanvasRenderer] ${angle} - Error disposing existing canvas:`, disposeErr)
        }
      }

      // Remove any existing canvas elements
      const existingCanvases = containerElement.querySelectorAll('canvas')
      existingCanvases.forEach(canvas => {
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas)
        }
      })

      // Get container dimensions with fallback
      const containerRect = containerElement.getBoundingClientRect()
      const containerWidth = Math.max(containerRect.width || 400, 200)
      const containerHeight = Math.max(containerRect.height || 300, 150)

      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Container dimensions:`, {
        width: containerWidth,
        height: containerHeight
      })

      // Create canvas element with unique ID
      const canvasElement = document.createElement('canvas')
      canvasElement.id = canvasId
      canvasElement.width = containerWidth
      canvasElement.height = containerHeight
      
      // CSS styling for proper overlay positioning
      canvasElement.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        pointer-events: none;
        background: transparent;
        opacity: 1;
        visibility: visible;
        display: block;
      `
      
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Canvas element created:`, {
        id: canvasId,
        width: containerWidth,
        height: containerHeight
      })
      
      // Append canvas to container
      containerElement.appendChild(canvasElement)
      
      // Wait for canvas to be properly mounted
      await new Promise(resolve => setTimeout(resolve, 100))

      // Create Fabric.js canvas
      const canvas = new fabric.Canvas(canvasElement, {
        width: containerWidth,
        height: containerHeight,
        selection: false,
        interactive: false,
        renderOnAddRemove: true,
        backgroundColor: 'transparent',
        preserveObjectStacking: true,
        skipOffscreen: false,
        enableRetinaScaling: true
      })

      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Fabric.js canvas created successfully`)
      fabricCanvasRef.current = canvas

      // Load canvas JSON with proper error handling
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - About to load canvas JSON...`)
      
      try {
        await new Promise<void>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Canvas JSON loading timeout after 10 seconds'))
          }, 10000)

          canvas.loadFromJSON(canvasJSON, () => {
            clearTimeout(timeoutId)
            
            try {
              console.log(`🔍 [DesignCanvasRenderer] ${angle} - CanvasJSON loaded successfully`)
              
              const objects = canvas.getObjects()
              console.log(`🔍 [DesignCanvasRenderer] ${angle} - Objects loaded:`, objects.length)
              
              if (objects.length > 0) {
                console.log(`🔍 [DesignCanvasRenderer] ${angle} - Processing ${objects.length} objects...`)

                // IMPROVED: Calculate transform to maintain exact positioning
                const transform = calculateDesignTransform(containerWidth, containerHeight)
                console.log(`🔍 [DesignCanvasRenderer] ${angle} - Transform calculated:`, transform)
                
                // FIXED: Process each object with precise positioning that matches original design
                objects.forEach((obj: any, index: number) => {
                  if (obj) {
                    // Store original properties
                    const originalLeft = obj.left || 0
                    const originalTop = obj.top || 0
                    const originalScaleX = obj.scaleX || 1
                    const originalScaleY = obj.scaleY || 1
                    
                    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Processing object ${index + 1}:`, {
                      type: obj.type,
                      originalPosition: { left: originalLeft, top: originalTop },
                      originalScale: { x: originalScaleX, y: originalScaleY }
                    })
                    
                    // IMPROVED: Apply precise scaling and positioning to match original design
                    // Scale the object uniformly
                    obj.scaleX = originalScaleX * transform.scale
                    obj.scaleY = originalScaleY * transform.scale
                    
                    // FIXED: Position objects to maintain exact relative positioning from original design
                    obj.left = (originalLeft * transform.scale) + transform.offsetX
                    obj.top = (originalTop * transform.scale) + transform.offsetY
                    
                    // Handle text objects with proper font scaling
                    if ((obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') && obj.fontSize) {
                      const newFontSize = Math.max(6, obj.fontSize * transform.scale)
                      obj.fontSize = newFontSize
                      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Text object font size adjusted:`, {
                        original: obj.fontSize / transform.scale,
                        new: newFontSize
                      })
                    }
                    
                    // Handle image objects
                    if (obj.type === 'image' && obj.src) {
                      obj.crossOrigin = 'anonymous'
                    }
                    
                    // Force object coordinate recalculation
                    if (obj.setCoords) {
                      obj.setCoords()
                    }
                    
                    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Object ${index + 1} processed:`, {
                      newPosition: { left: obj.left, top: obj.top },
                      newScale: { x: obj.scaleX, y: obj.scaleY }
                    })
                  }
                })

                // IMPROVED: Set canvas viewport to match the scaled design dimensions
                canvas.setViewportTransform([1, 0, 0, 1, 0, 0])

                // Multiple render passes for reliability
                console.log(`🔍 [DesignCanvasRenderer] ${angle} - Rendering canvas...`)
                
                const performRender = () => {
                  canvas.renderAll()
                  console.log(`🔍 [DesignCanvasRenderer] ${angle} - Render pass completed`)
                }
                
                // Multiple render passes
                performRender()
                
                requestAnimationFrame(() => {
                  performRender()
                  
                  setTimeout(() => {
                    performRender()
                    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Final render completed`)
                  }, 100)
                })
              }

              console.log(`✅ [DesignCanvasRenderer] ${angle} - Canvas rendered successfully`)
              setIsRendered(true)
              setIsInitializing(false)
              resolve()

            } catch (processError) {
              clearTimeout(timeoutId)
              console.error(`❌ [DesignCanvasRenderer] ${angle} - Error processing canvas objects:`, processError)
              setError(`Error processing objects: ${processError}`)
              setIsInitializing(false)
              reject(processError)
            }
          }, undefined, (loadError: any) => {
            clearTimeout(timeoutId)
            console.error(`❌ [DesignCanvasRenderer] ${angle} - Error loading canvas JSON:`, loadError)
            const errorMessage = loadError && typeof loadError === 'object' 
              ? (loadError.message || loadError.toString() || 'Canvas JSON loading failed')
              : String(loadError || 'Unknown JSON loading error')
            setError(`Failed to load design data: ${errorMessage}`)
            setIsInitializing(false)
            reject(new Error(errorMessage))
          })
        })
      } catch (loadError) {
        throw loadError
      }

    } catch (err) {
      console.error(`❌ [DesignCanvasRenderer] ${angle} - Error rendering design canvas:`, err)
      setError(`Failed to render design elements: ${err}`)
      setIsInitializing(false)
    }
  }, [canvasJSON, angle, isInitializing, loadFabric, calculateDesignTransform, canvasId])

  // Container ref callback
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Container ref callback: DOM element mounted`)
      containerRef.current = node
      
      requestAnimationFrame(() => {
        setContainerReady(true)
      })
    } else {
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Container ref callback: DOM element unmounted`)
      containerRef.current = null
      setContainerReady(false)
    }
  }, [angle])

  // Canvas initialization effect
  useEffect(() => {
    if (containerReady && canvasJSON && !isRendered && !isInitializing) {
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Container ready, initializing canvas`)
      
      const timer = setTimeout(() => {
        initializeCanvas()
      }, 150)
      
      return () => clearTimeout(timer)
    }
  }, [containerReady, canvasJSON, angle, isRendered, isInitializing, initializeCanvas])

  // Cleanup effect
  useEffect(() => {
    return () => {
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Cleaning up...`)
      
      try {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose()
          fabricCanvasRef.current = null
        }
        
        if (containerRef.current) {
          const canvasElement = containerRef.current.querySelector(`#${canvasId}`)
          if (canvasElement && canvasElement.parentNode) {
            canvasElement.parentNode.removeChild(canvasElement)
          }
          
          const allCanvases = containerRef.current.querySelectorAll('canvas')
          allCanvases.forEach(canvas => {
            if (canvas.parentNode) {
              canvas.parentNode.removeChild(canvas)
            }
          })
        }
      } catch (cleanupError) {
        console.error(`❌ [DesignCanvasRenderer] ${angle} - Cleanup error:`, cleanupError)
      }
    }
  }, [angle, canvasId])

  // Container resize handler
  useEffect(() => {
    if (!containerReady || !containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      if (fabricCanvasRef.current && isRendered) {
        console.log(`🔍 [DesignCanvasRenderer] ${angle} - Container resized, re-rendering...`)
        setTimeout(() => {
          if (fabricCanvasRef.current) {
            fabricCanvasRef.current.renderAll()
          }
        }, 100)
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [containerReady, isRendered, angle])

  // Error state
  if (error) {
    return (
      <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-lg flex items-center justify-center">
        <div className="text-center text-red-600 dark:text-red-400 p-4 max-w-xs">
          <div className="text-sm font-medium mb-2">{tOrders('designRenderError')}</div>
          <div className="text-xs break-words mb-2">{error}</div>
          <div className="text-xs text-red-500">
            {tOrders('angle')}: {angle} • {tOrders('elements')}: {canvasJSON?.objects?.length || 0}
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isInitializing) {
    return (
      <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg flex items-center justify-center">
        <div className="text-center text-blue-600 dark:text-blue-400">
          <div className="animate-pulse">
            <div className="text-sm font-medium mb-1">{tOrders('renderingDesign')}</div>
            <div className="text-xs">Processing {canvasJSON?.objects?.length || 0} {tOrders('elements')}</div>
            <div className="text-xs mt-1">{tOrders('angle')}: {angle}</div>
          </div>
        </div>
      </div>
    )
  }

  // Early returns for invalid data
  if (!canvasJSON) {
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - No canvasJSON provided`)
    return null
  }

  if (!canvasJSON?.objects || canvasJSON.objects.length === 0) {
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - No design objects to render`)
    return null
  }

  // Main container
  console.log(`🎯 [DesignCanvasRenderer] ${angle} - Rendering canvas container for ${canvasJSON.objects.length} objects`)
  return (
    <div 
      ref={setContainerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        zIndex: 10,
        overflow: 'hidden'
      }}
    />
  )
}