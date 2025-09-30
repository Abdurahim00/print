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
    canvasJSONType: typeof canvasJSON,
    canvasVersion: canvasJSON?.version,
    canvasDimensions: canvasJSON ? { width: canvasJSON.width, height: canvasJSON.height } : null
  })
  
  // Debug: Log the actual canvas JSON structure for troubleshooting
  if (canvasJSON?.objects) {
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Canvas JSON objects preview:`, 
      canvasJSON.objects.map((obj: any, index: number) => ({
        index,
        type: obj.type,
        src: obj.src ? (obj.src.length > 100 ? obj.src.substring(0, 100) + '...' : obj.src) : 'No src',
        visible: obj.visible,
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height
      }))
    )
  }

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
    const originalCanvasWidth = canvasJSON?.width || 600
    const originalCanvasHeight = canvasJSON?.height || 600
    
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Original design canvas:`, {
      width: originalCanvasWidth, 
      height: originalCanvasHeight
    })
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Display container:`, {
      width: containerWidth, 
      height: containerHeight
    })
    
    // CRITICAL FIX: Use responsive scaling that maintains aspect ratio
    // This ensures objects appear in the same relative position across all screen sizes
    const containerAspectRatio = containerWidth / containerHeight
    const canvasAspectRatio = originalCanvasWidth / originalCanvasHeight
    
    let scale: number
    let scaledWidth: number
    let scaledHeight: number
    let offsetX: number
    let offsetY: number
    
    if (containerAspectRatio > canvasAspectRatio) {
      // Container is wider than canvas - scale based on height
      scale = containerHeight / originalCanvasHeight
      scaledHeight = containerHeight
      scaledWidth = originalCanvasWidth * scale
      offsetX = (containerWidth - scaledWidth) / 2
      offsetY = 0
    } else {
      // Container is taller than canvas - scale based on width
      scale = containerWidth / originalCanvasWidth
      scaledWidth = containerWidth
      scaledHeight = originalCanvasHeight * scale
      offsetX = 0
      offsetY = (containerHeight - scaledHeight) / 2
    }
    
    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Responsive scaling:`, {
      scale,
      containerAspectRatio,
      canvasAspectRatio,
      scaledDimensions: { width: scaledWidth, height: scaledHeight },
      offsets: { x: offsetX, y: offsetY }
    })
    
    return { 
      scale, 
      offsetX, 
      offsetY, 
      scaledWidth, 
      scaledHeight,
      originalCanvasWidth,
      originalCanvasHeight,
      printableArea: {
        width: containerWidth,
        height: containerHeight,
        offsetX: 0,
        offsetY: 0
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
      
      // Minimal wait for canvas to be properly mounted
      await new Promise(resolve => setTimeout(resolve, 10))

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

      // Validate and prepare canvas JSON before loading
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - About to load canvas JSON...`)
      
      // Ensure canvas JSON has proper structure
      const validatedCanvasJSON = {
        version: canvasJSON.version || "5.3.0",
        width: canvasJSON.width || 800,
        height: canvasJSON.height || 600,
        backgroundColor: canvasJSON.backgroundColor || "transparent",
        objects: (canvasJSON.objects || []).map((obj: any) => {
          // Ensure image objects have proper structure
          if (obj.type === 'image') {
            return {
              ...obj,
              type: 'image',
              src: obj.src || obj.imageSrc || obj.url, // Handle different src property names
              crossOrigin: 'anonymous',
              visible: obj.visible !== false, // Ensure visible unless explicitly false
              opacity: obj.opacity || 1
            }
          }
          return obj
        })
      }
      
      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Validated canvas JSON:`, {
        version: validatedCanvasJSON.version,
        dimensions: { width: validatedCanvasJSON.width, height: validatedCanvasJSON.height },
        objectCount: validatedCanvasJSON.objects.length,
        imageObjects: validatedCanvasJSON.objects.filter((obj: any) => obj.type === 'image').length
      })
      
      try {
        await new Promise<void>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Canvas JSON loading timeout after 3 seconds'))
          }, 3000)

          canvas.loadFromJSON(validatedCanvasJSON, () => {
            clearTimeout(timeoutId)
            
            try {
              console.log(`🔍 [DesignCanvasRenderer] ${angle} - CanvasJSON loaded successfully`)
              
              const objects = canvas.getObjects()
              console.log(`🔍 [DesignCanvasRenderer] ${angle} - Objects loaded:`, objects.length)
              
              // Debug: Log all object types to identify what's being loaded
              const objectTypes = objects.map((obj: any) => obj.type)
              console.log(`🔍 [DesignCanvasRenderer] ${angle} - Object types loaded:`, objectTypes)
              
              // Count different object types
              const typeCount = objectTypes.reduce((acc: Record<string, number>, type: string) => {
                acc[type] = (acc[type] || 0) + 1
                return acc
              }, {} as Record<string, number>)
              console.log(`🔍 [DesignCanvasRenderer] ${angle} - Object type counts:`, typeCount)
              
              if (objects.length > 0) {
                console.log(`🔍 [DesignCanvasRenderer] ${angle} - Processing ${objects.length} objects...`)

                // CRITICAL FIX: Maintain exact positioning from design canvas without additional transforms
                const transform = calculateDesignTransform(containerWidth, containerHeight)
                console.log(`🔍 [DesignCanvasRenderer] ${angle} - Transform calculated:`, transform)
                
                // FIXED: Process each object to maintain EXACT positioning from design canvas
                objects.forEach((obj: any, index: number) => {
                  if (obj) {
                    // Store original properties from the design canvas
                    const originalLeft = obj.left || 0
                    const originalTop = obj.top || 0
                    const originalScaleX = obj.scaleX || 1
                    const originalScaleY = obj.scaleY || 1
                    
                    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Processing object ${index + 1}:`, {
                      type: obj.type,
                      originalPosition: { left: originalLeft, top: originalTop },
                      originalScale: { x: originalScaleX, y: originalScaleY }
                    })
                    
                    // CRITICAL FIX: Apply scaling but maintain exact relative positioning
                    // Scale the object uniformly
                    obj.scaleX = originalScaleX * transform.scale
                    obj.scaleY = originalScaleY * transform.scale
                    
                    // FIXED: Position objects to maintain EXACT relative positioning from original design
                    // This ensures objects appear in the same relative position as in the design canvas
                    obj.left = (originalLeft * transform.scale) + transform.offsetX
                    obj.top = (originalTop * transform.scale) + transform.offsetY
                    
                    console.log(`🔍 [DesignCanvasRenderer] ${angle} - Object ${index + 1} positioned:`, {
                      type: obj.type,
                      finalPosition: { left: obj.left, top: obj.top },
                      finalScale: { x: obj.scaleX, y: obj.scaleY }
                    })
                    
                    // Handle text objects with proper font scaling
                    if ((obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') && obj.fontSize) {
                      const newFontSize = Math.max(6, obj.fontSize * transform.scale)
                      obj.fontSize = newFontSize
                      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Text object font size adjusted:`, {
                        original: obj.fontSize / transform.scale,
                        new: newFontSize
                      })
                    }
                    
                    // Handle image objects with proper loading and error handling
                    if (obj.type === 'image' && obj.src) {
                      console.log(`🔍 [DesignCanvasRenderer] ${angle} - Processing image object:`, {
                        src: obj.src,
                        width: obj.width,
                        height: obj.height,
                        left: obj.left,
                        top: obj.top
                      })
                      
                      // Set crossOrigin for external images
                      obj.crossOrigin = 'anonymous'
                      
                      // Ensure the image is properly loaded
                      if (obj.src.startsWith('data:') || obj.src.startsWith('blob:')) {
                        // For data URLs and blob URLs, ensure they're properly handled
                        console.log(`🔍 [DesignCanvasRenderer] ${angle} - Data/blob URL detected, ensuring proper handling`)
                      } else {
                        // For external URLs, ensure they load properly
                        console.log(`🔍 [DesignCanvasRenderer] ${angle} - External URL detected, ensuring CORS handling`)
                      }
                      
                      // Ensure the object is visible and properly positioned
                      obj.visible = true
                      obj.opacity = obj.opacity || 1
                      
                      // Add error handling for image loading
                      const originalOnload = obj.onload
                      const originalOnerror = obj.onerror
                      
                      obj.onload = () => {
                        console.log(`🔍 [DesignCanvasRenderer] ${angle} - Image loaded successfully:`, obj.src)
                        if (originalOnload) originalOnload()
                        canvas.requestRenderAll()
                      }
                      
                      obj.onerror = (error: any) => {
                        console.error(`❌ [DesignCanvasRenderer] ${angle} - Image failed to load:`, error)
                        console.error(`❌ [DesignCanvasRenderer] ${angle} - Image src:`, obj.src)
                        
                        // Create a placeholder rectangle for failed images
                        const placeholder = new fabric.Rect({
                          left: obj.left,
                          top: obj.top,
                          width: obj.width || 100,
                          height: obj.height || 100,
                          fill: '#f0f0f0',
                          stroke: '#ccc',
                          strokeWidth: 1,
                          selectable: false,
                          evented: false
                        })
                        
                        // Add text to indicate failed image
                        const text = new fabric.Text('Image Failed', {
                          left: obj.left,
                          top: obj.top + (obj.height || 100) / 2,
                          fontSize: 12,
                          fill: '#666',
                          textAlign: 'center',
                          selectable: false,
                          evented: false
                        })
                        
                        // Replace the failed image with placeholder
                        canvas.remove(obj)
                        canvas.add(placeholder)
                        canvas.add(text)
                        
                        if (originalOnerror) originalOnerror(error)
                        canvas.requestRenderAll()
                      }
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

                // Enhanced rendering with image loading verification
                console.log(`🔍 [DesignCanvasRenderer] ${angle} - Rendering canvas...`)
                
                const performRender = () => {
                  canvas.renderAll()
                  console.log(`🔍 [DesignCanvasRenderer] ${angle} - Render pass completed`)
                }
                
                // Render immediately without waiting for images
                // Images will render asynchronously as they load
                performRender()

                // Single additional render pass for reliability
                requestAnimationFrame(() => {
                  performRender()
                  console.log(`✅ [DesignCanvasRenderer] ${angle} - Render completed`)
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

      // Initialize immediately without delay
      initializeCanvas()
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
