"use client"

import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { setViewMode, setSelectedProduct, setProductColor, setSelectedTemplate, setLoadingProduct } from "@/lib/redux/designToolSlices/designSlice"
import { Button } from "@/components/ui/button"
import { RootState } from "@/lib/redux/store"
import { ProductAnglesSelector } from "@/components/dashboard/common/ProductAnglesSelector"
import { LoadSavedDesign } from "./load-saved-design"
import { useVariationDesignPersistence } from "@/hooks/useVariationDesignPersistence"

// Type definition for product
interface Product {
  id: string;
  name: string;
  type: string;
  baseColor: string;
  angles?: string[];
  colors?: string[];
  price?: string;
  image?: string;
  hasVariations?: boolean;
  variations?: any[];
}

export function CentralCanvas() {
  const dispatch = useDispatch()
  const { selectedTool, viewMode, selectedProduct, productColor, imageLayers, selectedTemplate, isLoadingProduct } = useSelector((state: RootState) => state.design)
  const { selectedObject } = useSelector((state: RootState) => state.canvas)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  
  // State for tracking if a saved design is loaded
  const [isLoadingDesign, setIsLoadingDesign] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [canvasScale, setCanvasScale] = useState(1)

  const { canvasRef, loadFromJSON, setDesignBoundaries } = useFabricCanvas("design-canvas", { isMobile, canvasScale })
  
  // Get the Fabric.js canvas instance safely
  const getFabricCanvas = useCallback(() => {
    if (typeof window === 'undefined') return null
    return (window as any).fabricCanvas
  }, [])
  
  // CRITICAL FIX: Force color selection for variation products
  useEffect(() => {
    console.log('🔍 [CentralCanvas] Checking for color selection:', {
      productName: selectedProduct?.name,
      hasVariations: selectedProduct?.hasVariations,
      variationsLength: selectedProduct?.variations?.length,
      currentColor: productColor,
      firstVariation: selectedProduct?.variations?.[0]
    })
    
    if (selectedProduct?.hasVariations && 
        (!productColor || productColor === '' || productColor === '#000000')) {
      
      // Try variations array first
      let firstValidColor = selectedProduct.variations?.[0]?.color?.hex_code
      
      // If no variations, but hasVariations is true, force fetch
      if (!selectedProduct.variations || selectedProduct.variations.length === 0) {
        console.error('⚠️ [CentralCanvas] Product marked as hasVariations but no variations array!', {
          product: selectedProduct.name,
          hasVariations: selectedProduct.hasVariations,
          variations: selectedProduct.variations
        })
        // Generate a unique color for this session to prevent sync issues
        // Use product ID and a random component to ensure uniqueness
        const uniqueSessionColor = `#${selectedProduct.id?.slice(-6)?.padEnd(6, '0') || Math.floor(Math.random()*16777215).toString(16)}`
        firstValidColor = uniqueSessionColor
        console.log('🎨 [CentralCanvas] Generated unique session color:', uniqueSessionColor)
      }
      
      if (firstValidColor && firstValidColor !== '#000000') {
        console.log('🚨 [CentralCanvas] FORCING color selection for variation product:', {
          product: selectedProduct.name,
          oldColor: productColor,
          newColor: firstValidColor
        })
        dispatch(setProductColor(firstValidColor))
      }
    }
  }, [selectedProduct, productColor, dispatch])
  
  // Initialize variation design persistence only on client side
  const variationDesignPersistence = useVariationDesignPersistence({
    fabricCanvas: isClient ? getFabricCanvas() : null,
    selectedProduct,
    productColor,
    viewMode,
    autoSaveDelay: 1000
  })
  
  // Set client-side flag and detect mobile device
  useEffect(() => {
    setIsClient(true)
    
    // Detect mobile device and set scale
    const checkMobile = () => {
      const width = window.innerWidth
      const mobile = width < 768 // Tailwind's md breakpoint
      setIsMobile(mobile)
      
      // Calculate scale for mobile to fit canvas in viewport
      if (mobile) {
        // For mobile, scale down to fit screen width with padding
        const maxWidth = width - 32 // 16px padding on each side
        const scale = Math.min(maxWidth / 600, 1) // Never scale up, only down
        setCanvasScale(scale)
      } else {
        setCanvasScale(1) // Desktop/tablet uses full size
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    const cleanup = () => window.removeEventListener('resize', checkMobile)
    
    // Load saved design from localStorage
    if (typeof window !== 'undefined') {
      const savedCanvas = localStorage.getItem('designCanvasJSON')
      if (savedCanvas && loadFromJSON) {
        console.log('📂 [CentralCanvas] Loading saved design from localStorage')
        const fabricCanvas = (window as any).fabricCanvas
        if (fabricCanvas) {
          loadFromJSON(fabricCanvas, savedCanvas)
        } else {
          // Wait for canvas to be initialized
          setTimeout(() => {
            const canvas = (window as any).fabricCanvas
            if (canvas && loadFromJSON) {
              loadFromJSON(canvas, savedCanvas)
            }
          }, 500)
        }
      }
    }
    
    return cleanup
  }, [])
  
  // Persist current design session (product + view + template) on change
  useEffect(() => {
    if (!isClient) return // Only run on client
    
    try {
        const sessionState = {
        selectedProduct: selectedProduct ? {
          id: selectedProduct.id,
          name: selectedProduct.name,
          type: selectedProduct.type,
          categoryId: selectedProduct.categoryId,
          baseColor: selectedProduct.baseColor,
          angles: selectedProduct.angles,
          colors: selectedProduct.colors,
          price: selectedProduct.price,
          image: selectedProduct.image || selectedProduct.imageUrl,
          imageUrl: selectedProduct.imageUrl,
          description: selectedProduct.description,
          inStock: selectedProduct.inStock,
          hasVariations: selectedProduct.hasVariations,
          variations: selectedProduct.variations,
          purchaseLimit: selectedProduct.purchaseLimit,
          // CRITICAL: Include all design and angle fields for proper restoration
          designFrames: selectedProduct.designFrames,
          isDesignable: selectedProduct.isDesignable,
          designCostPerCm2: selectedProduct.designCostPerCm2,
          // Include individual angle images for single products
          frontImage: selectedProduct.frontImage,
          backImage: selectedProduct.backImage,
          leftImage: selectedProduct.leftImage,
          rightImage: selectedProduct.rightImage,
          materialImage: selectedProduct.materialImage,
        } : null,
          // CRITICAL FIX: Don't save empty or #000000 productColor to session
          productColor: (productColor && productColor !== '#000000') ? productColor : 
            (selectedProduct?.hasVariations ? 
              selectedProduct?.variations?.[0]?.color?.hex_code || '' : 
              selectedProduct?.baseColor || ''),
          viewMode,
          selectedTemplate,
        timestamp: Date.now(), // Add timestamp for debugging
        }
        localStorage.setItem('designSessionState', JSON.stringify(sessionState))
      
      console.log('💾 [CentralCanvas] Session state persisted:', {
        productId: selectedProduct?.id,
        productName: selectedProduct?.name,
        productColor,
        viewMode,
        hasTemplate: !!selectedTemplate,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error persisting session state:', error)
    }
  }, [selectedProduct, productColor, viewMode, selectedTemplate, isClient])

  // Restore persisted design session after refresh
  useEffect(() => {
    if (!isClient) return // Only run on client
    
    try {
      const sessionRaw = localStorage.getItem('designSessionState')
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw)
        console.log('🔄 [CentralCanvas] Restoring session from localStorage:', session)
        
        // Check if the session product has purchaseLimit
        if (session.selectedProduct) {
          console.log('🔄 [CentralCanvas] Session product data:', {
            hasPurchaseLimit: !!session.selectedProduct.purchaseLimit,
            purchaseLimit: session.selectedProduct.purchaseLimit,
            allKeys: Object.keys(session.selectedProduct)
          })
        }
        
        // Restore product selection first
        if (session.selectedProduct && !selectedProduct) {
          console.log('🔄 [CentralCanvas] Restoring selected product from session:', {
            productName: session.selectedProduct.name,
            hasAngles: !!session.selectedProduct.angles,
            anglesCount: session.selectedProduct.angles?.length,
            hasVariations: session.selectedProduct.hasVariations,
            hasDesignFrames: !!session.selectedProduct.designFrames
          })
          
          // Ensure the product has all necessary fields
          const restoredProduct = {
            ...session.selectedProduct,
            // Ensure baseColor is set
            baseColor: session.selectedProduct.baseColor || session.productColor || '#000000',
            // Ensure angles array exists
            angles: session.selectedProduct.angles || [],
            // Ensure design frames exist
            designFrames: session.selectedProduct.designFrames || [],
            // Ensure variations are properly structured
            variations: session.selectedProduct.variations || []
          }
          
          // If we have a saved color, make sure the product includes it
          if (session.productColor && restoredProduct.hasVariations) {
            restoredProduct.baseColor = session.productColor
          }
          
          dispatch(setSelectedProduct(restoredProduct))
        }
        
        // CRITICAL FIX: Only restore color if it's valid (not empty, not #000000)
        if (session.productColor && 
            session.productColor !== '' && 
            session.productColor !== '#000000' &&
            session.productColor !== productColor) {
          console.log('🔄 [CentralCanvas] Restoring valid product color:', session.productColor)
          // Small delay to ensure product is set first
          setTimeout(() => {
            dispatch(setProductColor(session.productColor))
          }, 0)
        } else if (session.productColor === '#000000' || session.productColor === '') {
          console.warn('⚠️ [CentralCanvas] Ignoring invalid session color:', session.productColor)
        }
        if (session.viewMode && session.viewMode !== viewMode) {
          dispatch(setViewMode(session.viewMode))
        }
        if (session.selectedTemplate && !selectedTemplate) {
          dispatch(setSelectedTemplate(session.selectedTemplate))
        }
      }
    } catch (error) {
      console.error('Error restoring session state:', error)
    }
  }, [dispatch, isClient]) // Only depend on dispatch and isClient to avoid loops

  // Ensure product is present after refresh: use session data or fetch by productId from URL if missing
  useEffect(() => {
    if (!isClient) return // Only run on client
    
    try {
      // Check if we have a product ID in the URL
      const urlParams = new URLSearchParams(window.location.search)
      const productIdFromUrl = urlParams.get('productId')
      
      // Check if we have a product ID in session
      const sessionRaw = localStorage.getItem('designSessionState')
      const session = sessionRaw ? JSON.parse(sessionRaw) : {}
      const productIdFromSession = session.selectedProduct?.id
      
      // Determine which product ID to use (URL takes priority)
      const targetProductId = productIdFromUrl || productIdFromSession
      
      // Fetch from API if:
      // 1. We have a target product ID AND
      // 2. Either no product is selected OR the selected product ID doesn't match the target
      if (targetProductId && (!selectedProduct || selectedProduct.id !== targetProductId)) {
        console.log('🔄 [CentralCanvas] Fetching product from API (no session data):', targetProductId)
        
        // Set loading state
        dispatch(setLoadingProduct(true))
        
        // Clear current product to avoid showing old product
        if (selectedProduct && selectedProduct.id !== targetProductId) {
          dispatch(setSelectedProduct(null))
        }
        
        // Fetch the product data - try main products first, then test products
        fetch(`/api/products/${targetProductId}`)
          .then(res => {
            if (!res.ok) {
              // If main products API fails, try test products
              console.log('🔄 [CentralCanvas] Main products API failed, trying test products')
              return fetch(`/api/test-products/${targetProductId}`)
            }
            return res
          })
          .then(res => res.json())
          .then(productData => {
            if (productData && productData.id) {
              console.log('🔄 [CentralCanvas] Product restored from API:', productData.name)
              
              // Build the selectedProduct object with the same structure as ProductModal
              // Collect angles from variations OR individual angle images
              let realAngles: string[] = []
              
              if (productData.hasVariations && productData.variations && productData.variations.length > 0) {
                // Get angles from the first variation
                const firstVariation = productData.variations[0]
                if (firstVariation.images) {
                  const angleSet = new Set<string>()
                  firstVariation.images.forEach((img: any) => {
                    if (img?.angle && img.url && img.url.trim() !== '') {
                      angleSet.add(img.angle)
                    }
                  })
                  realAngles = Array.from(angleSet)
                }
              } else {
                // For single products without variations, check individual angle images
                const angleImages = [
                  { angle: 'front', image: productData.frontImage },
                  { angle: 'back', image: productData.backImage },
                  { angle: 'left', image: productData.leftImage },
                  { angle: 'right', image: productData.rightImage },
                  { angle: 'material', image: productData.materialImage }
                ]
                
                angleImages.forEach(({ angle, image }) => {
                  if (image && image.trim() !== '') {
                    realAngles.push(angle)
                  }
                })
              }
              
              // If no angles found, default to front
              if (realAngles.length === 0) {
                realAngles = ['front']
              }
              
              // Collect colors from variations or product.colors
              const realColors = (productData.hasVariations && productData.variations)
                ? productData.variations.map((v: any) => v.color?.hex_code).filter(Boolean)
                : productData.colors || []
              
              // Initial color preference: first variation color, else product.baseColor
              const initialColor = realColors[0] || productData.baseColor || "#000000"
              
              const restoredProduct = {
                id: productData.id,
                name: productData.name,
                type: productData.categoryId,
                categoryId: productData.categoryId,
                subcategoryIds: productData.subcategoryIds,
                createdAt: productData.createdAt,
                updatedAt: productData.updatedAt,
                eligibleForCoupons: productData.eligibleForCoupons,
                baseColor: initialColor,
                angles: realAngles,
                colors: realColors,
                price: productData.price,
                image: productData.image || productData.imageUrl,
                description: productData.description,
                inStock: productData.inStock,
                hasVariations: productData.hasVariations,
                variations: productData.variations?.map((v: any) => ({
                  ...v,
                  // Ensure each variation includes its design frames
                  designFrames: v.designFrames || []
                })) || [],
                purchaseLimit: productData.purchaseLimit,
                // Include design-related fields
                isDesignable: productData.isDesignable || false,
                designFrames: productData.designFrames || [],
                designCostPerCm2: productData.designCostPerCm2 || 0.5,
                // Include individual angle images for single products
                ...(productData.hasVariations ? {} : {
                  frontImage: productData.frontImage,
                  backImage: productData.backImage,
                  leftImage: productData.leftImage,
                  rightImage: productData.rightImage,
                  materialImage: productData.materialImage,
                  frontAltText: productData.frontAltText,
                  backAltText: productData.backAltText,
                  leftAltText: productData.leftAltText,
                  rightAltText: productData.rightAltText,
                  materialAltText: productData.materialAltText,
                })
              }
              
              // Set the product (this will also set baseColor in the reducer)
              dispatch(setSelectedProduct(restoredProduct))
              
              // The setSelectedProduct action in designSlice.ts already sets the productColor
              // from baseColor, so we don't need to set it again unless we have a specific
              // color from session that's different
              // CRITICAL FIX: Don't restore empty colors from session
              if (session.productColor && 
                  session.productColor !== '' && 
                  session.productColor !== restoredProduct.baseColor) {
                console.log('🎨 [CentralCanvas] Restoring color from session:', session.productColor)
                dispatch(setProductColor(session.productColor))
              } else if (!session.productColor || session.productColor === '') {
                console.warn('⚠️ [CentralCanvas] Session had empty color, using product default')
              }
              
              // Always ensure we have a view mode
              const currentViewMode = viewMode || session.viewMode || 'front'
              if (currentViewMode !== viewMode) {
                console.log('🔄 [CentralCanvas] Setting view mode:', currentViewMode)
                dispatch(setViewMode(currentViewMode))
              }
              
              // Clean up the URL after loading the product
              if (productIdFromUrl) {
                const newUrl = window.location.pathname
                window.history.replaceState({}, '', newUrl)
                console.log('🔄 [CentralCanvas] Cleaned productId from URL')
              }
            }
          })
          .catch(error => {
            console.error('Error fetching product for restoration:', error)
            dispatch(setLoadingProduct(false))
          })
          .finally(() => {
            // Always clear loading state
            setTimeout(() => dispatch(setLoadingProduct(false)), 300) // Small delay for smooth transition
          })
      }
    } catch (error) {
      console.error('Error in product restoration logic:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, selectedProduct?.id])

  // Ensure canvas displays product image when product is restored
  useEffect(() => {
    if (isClient && selectedProduct && getFabricCanvas() && !isLoadingDesign) {
      console.log('🔄 [CentralCanvas] Product restored, ensuring canvas displays product image')
      
      // Small delay to ensure everything is ready
      setTimeout(() => {
        // Force a re-render of the canvas to show the product image
        if (getFabricCanvas()) {
          getFabricCanvas()?.requestRenderAll()
          console.log('🔄 [CentralCanvas] Canvas re-rendered after product restoration')
        }
        
        // Force a re-render of the component to update the product image
        const event = new Event('resize')
        window.dispatchEvent(event)
        console.log('🔄 [CentralCanvas] Component re-render triggered after product restoration')
      }, 200)
    }
  }, [selectedProduct?.id, getFabricCanvas, isClient, isLoadingDesign])
  
  // Handle loading a saved design
  const handleDesignLoaded = useCallback((canvasJSON: any) => {
    if (canvasJSON && loadFromJSON) {
      setIsLoadingDesign(true)
      // Short delay to ensure canvas is initialized
      setTimeout(() => {
        loadFromJSON(canvasJSON)
        setIsLoadingDesign(false)
      }, 500)
    }
  }, [loadFromJSON])

  const handleViewChange = (view: string) => {
    console.log('🔄 [CentralCanvas] handleViewChange called with view:', view)
    console.log('🔄 [CentralCanvas] Current viewMode:', viewMode)
    
    // Prevent setting same view mode
    if (view === viewMode) {
      console.log('🔄 [CentralCanvas] Same view mode, skipping')
      return
    }
    
    // REMOVED: The save before switching was causing designs to save to wrong angle
    // The auto-save mechanism in useVariationDesignPersistence handles saving automatically
    // when canvas changes, so we don't need to manually save here
    
    console.log('🔄 [CentralCanvas] Dispatching setViewMode:', view)
    dispatch(setViewMode(view))
    
    // After switching, the useVariationDesignPersistence hook will automatically load the design
    // for the new view mode if it exists
  }

  // Determine if canvas border should be visible based on selected tool
  const shouldShowCanvasBorder = () => {
    // Only show border when design tools are actively selected
    // This provides clean UI when browsing products and clear feedback when designing
    return selectedProduct !== null && 
           (selectedTool === "text" || selectedTool === "template" || selectedTool === "upload")
  }

  // Get product angles from the selected product
  const getProductAngles = () => {
    if (!selectedProduct) {
      return [] // No angles when no product is selected
    }
    
    const product = selectedProduct as Product;
    
    // For products WITHOUT variations, check individual angle images FIRST
    if (!product.hasVariations || !product.variations || product.variations.length === 0) {
      const angleSet = new Set<string>()
      
      // Check each angle image field
      if (product.frontImage) angleSet.add('front')
      if (product.backImage) angleSet.add('back')
      if (product.leftImage) angleSet.add('left')
      if (product.rightImage) angleSet.add('right')
      if (product.materialImage) angleSet.add('material')
      
      const angles = Array.from(angleSet)
      if (angles.length > 0) {
        console.log('🎯 Collected angles from individual images:', angles)
        return angles
      }
    }
    
    // Then check if product has angles already stored (from initial load)
    if (product.angles && product.angles.length > 0) {
      console.log('🎯 Using stored product angles:', product.angles)
      return product.angles
    }
    
    // If product has variations, collect angles from ALL variations to prevent glitching
    if (product.hasVariations && product.variations && product.variations.length > 0) {
      const angleSet = new Set<string>()
      
      // Collect angles from ALL variations, not just the current one
      product.variations.forEach((variation: any) => {
        if (variation.images) {
          variation.images.forEach((img: any) => {
            if (img?.angle && img.url && img.url.trim() !== '') {
              angleSet.add(img.angle)
            }
          })
        }
        
        // Also check positionMapping
        if (variation.positionMapping) {
          angleSet.add(variation.positionMapping)
        }
      })
      
      const angles = Array.from(angleSet)
      if (angles.length > 0) {
        console.log('🎯 Collected angles from all variations:', angles)
        return angles
      }
    }
    
    // Fallback: If product has variations but we're looking for specific variation
    if (product.hasVariations && product.variations) {
      // Find the variation that matches the current product color
      const currentVariation = product.variations.find((v: any) => v.color && v.color.hex_code === productColor)
      
      if (currentVariation && currentVariation.images) {
        const angleSet = new Set<string>()
        
        // Collect angles from the current variation's images
        currentVariation.images.forEach((img: any) => {
          if (img?.angle && img.url && img.url.trim() !== '') {
            angleSet.add(img.angle)
          }
        })
        
        // Also check if variation has positionMapping field for additional angles
        if (currentVariation.positionMapping) {
          // positionMapping might contain angle info - add it if not already present
          angleSet.add(currentVariation.positionMapping)
        }
        
        // Log angles for debugging
        console.log('🔄 [CentralCanvas] Angles for current variation:', {
          variationId: currentVariation.id,
          color: currentVariation.color?.name,
          angles: Array.from(angleSet),
          positionMapping: currentVariation.positionMapping,
          imagesCount: currentVariation.images.length
        })
        
        // Return only the angles that have actual images for this specific variation
        if (angleSet.size > 0) {
          return Array.from(angleSet)
        }
      }
      
      // If no angles found for current variation, check all variations for available angles
      // This helps understand what angles are configured across all variations
      const allAnglesSet = new Set<string>()
      product.variations.forEach((v: any) => {
        if (v.images) {
          v.images.forEach((img: any) => {
            if (img?.angle && img.url && img.url.trim() !== '') {
              allAnglesSet.add(img.angle)
            }
          })
        }
        if (v.positionMapping) {
          allAnglesSet.add(v.positionMapping)
        }
      })
      
      if (allAnglesSet.size > 0) {
        console.log('🔄 [CentralCanvas] All possible angles across variations:', Array.from(allAnglesSet))
      }
    } else {
      // For single products, use the hook's getAvailableViewModes function
      if (variationDesignPersistence.getAvailableViewModes) {
        const availableViewModes = variationDesignPersistence.getAvailableViewModes()
        console.log('🔄 [CentralCanvas] Single product angles from hook:', availableViewModes)
        return availableViewModes
      }
      
      // Fallback to manual checking if hook function not available
      const angleImages = [
        { angle: 'front', image: (product as any).frontImage },
        { angle: 'back', image: (product as any).backImage },
        { angle: 'left', image: (product as any).leftImage },
        { angle: 'right', image: (product as any).rightImage },
        { angle: 'material', image: (product as any).materialImage }
      ]
      
      const availableAngles: string[] = []
      angleImages.forEach(({ angle, image }) => {
        if (image && image.trim() !== '') {
          availableAngles.push(angle)
        }
      })
      
      if (availableAngles.length > 0) {
        return availableAngles
      }
    }
    
    // No fallback - if no images found, return empty array
    return []
  }

  // Get image for current view mode (robust across partial product restore)
  const getCurrentImage = () => {
    if (!selectedProduct) return null
    
    const product = selectedProduct as any;
    
    // Debug logging
    console.log('🖼️ [getCurrentImage] Called with product:', {
      name: product.name,
      hasVariations: product.hasVariations,
      hasVariants: !!product.variants,
      variantsCount: product.variants?.length,
      hasImages: !!product.images,
      imagesCount: product.images?.length,
      hasImage: !!product.image,
      viewMode,
      frontImage: product.frontImage,
      backImage: product.backImage
    });
    
    // First check if product has individual angle images (regardless of variations)
    // This allows products to use angle images even if they have variations for colors
    const hasAngleImages = product.frontImage || product.backImage || product.leftImage || product.rightImage || product.materialImage;
    
    if (hasAngleImages) {
      console.log('🖼️ [getCurrentImage] Product has angle images, using them for viewMode:', viewMode);
      switch(viewMode) {
        case 'back':
          if (product.backImage) return product.backImage
          break
        case 'left':
          if (product.leftImage) return product.leftImage
          break
        case 'right':
          if (product.rightImage) return product.rightImage
          break
        case 'material':
          if (product.materialImage) return product.materialImage
          break
        case 'front':
          if (product.frontImage) return product.frontImage
          break
      }
    }
    
    // For products WITHOUT variations and without angle images
    if (!product.hasVariations || (!product.variations && !product.variants)) {
      console.log('🖼️ [getCurrentImage] No variations, using default image');
      return product.image || '/placeholder.jpg'
    }
    
    // If product has variants, try to find image for current variant
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      // Find the current variant - could be selected by name or index
      let currentVariant = product.variants[0]; // Default to first variant
      
      // Try to find a specific variant if we have selection criteria
      if (product.selectedVariantIndex !== undefined) {
        currentVariant = product.variants[product.selectedVariantIndex] || currentVariant;
      }
      
      console.log('🖼️ [getCurrentImage] Using variant:', {
        variant: currentVariant,
        hasVariantImage: !!currentVariant?.variant_image,
        variantImage: currentVariant?.variant_image
      });
      
      // Get image from variant
      if (currentVariant) {
        if (currentVariant.variant_image) {
          console.log('🖼️ [getCurrentImage] Returning variant_image:', currentVariant.variant_image);
          return currentVariant.variant_image;
        }
        if (currentVariant.images && Array.isArray(currentVariant.images) && currentVariant.images.length > 0) {
          console.log('🖼️ [getCurrentImage] Returning variant images[0]:', currentVariant.images[0]);
          return currentVariant.images[0];
        }
      }
    }
    
    // If product has variations (different structure), try to find image for current view mode
    if (product.hasVariations && product.variations) {
      // Find the variation that matches the current product color
      const currentVariation = product.variations.find((v: any) => v.color?.hex_code === productColor)
      if (currentVariation) {
        const imageForAngle = currentVariation.images?.find((img: any) => img.angle === viewMode && img.url)
        if (imageForAngle) {
          return imageForAngle.url
        }
        // Fallback to variation images
        if (currentVariation.images && Array.isArray(currentVariation.images) && currentVariation.images.length > 0) {
          const firstImage = currentVariation.images[0];
          return typeof firstImage === 'string' ? firstImage : firstImage.url;
        }
        // Fallback to swatch image
        return currentVariation.color?.swatch_image
      }
    } else {
      // For single products without variations, check individual angle images
      const angleImageMap: Record<string, string> = {
        'front': (product as any).frontImage,
        'back': (product as any).backImage,
        'left': (product as any).leftImage,
        'right': (product as any).rightImage,
        'material': (product as any).materialImage
      }
      
      const currentAngleImage = angleImageMap[viewMode]
      
      // Debug logging for single product image selection
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [CentralCanvas] getCurrentImage for single product:', {
          viewMode,
          angleImageMap,
          currentAngleImage,
          hasCurrentAngleImage: !!(currentAngleImage && currentAngleImage.trim() !== ''),
          imageLength: currentAngleImage ? currentAngleImage.length : 0
        })
      }
      
      if (currentAngleImage && currentAngleImage.trim() !== '') {
        return currentAngleImage
      }
    }
    
    // Fallback to images array
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      console.log('🖼️ [getCurrentImage] Returning from images array:', product.images[0]);
      return product.images[0];
    }
    
    // Fallback to imageUrl or image
    const finalImage = product.imageUrl || product.image || null;
    console.log('🖼️ [getCurrentImage] Final fallback image:', finalImage);
    return finalImage
  }

  // Debug logging for image restoration
  useEffect(() => {
    if (isClient && selectedProduct && process.env.NODE_ENV === 'development') {
      console.log('🖼️ [CentralCanvas] Image restoration debug:', {
        productName: selectedProduct.name,
        productColor,
        viewMode,
        hasVariations: selectedProduct.hasVariations,
        variationsCount: selectedProduct.variations?.length,
        currentVariation: getCurrentVariation(),
        currentImage: getCurrentImage(),
        fallbackImage: (selectedProduct as any).imageUrl || (selectedProduct as any).image,
        // Debug single product angle images
        singleProductAngles: !selectedProduct.hasVariations ? {
          frontImage: (selectedProduct as any).frontImage,
          backImage: (selectedProduct as any).backImage,
          leftImage: (selectedProduct as any).leftImage,
          rightImage: (selectedProduct as any).rightImage,
          materialImage: (selectedProduct as any).materialImage,
          angles: selectedProduct.angles
        } : null,
        // Debug raw product data
        rawProductData: {
          allKeys: Object.keys(selectedProduct),
          hasFrontImage: !!(selectedProduct as any).frontImage,
          hasBackImage: !!(selectedProduct as any).backImage,
          hasLeftImage: !!(selectedProduct as any).leftImage,
          hasRightImage: !!(selectedProduct as any).rightImage,
          hasMaterialImage: !!(selectedProduct as any).materialImage
        }
      })
    }
  }, [selectedProduct, productColor, viewMode, isClient])

  // Get current variation images for the selected color
  const getCurrentVariationImages = () => {
    if (!selectedProduct) return []
    
    const product = selectedProduct as Product;
    
    // For products WITHOUT variations, create image array from individual angle images
    if (!product.hasVariations || !product.variations || product.variations.length === 0) {
      const images = []
      if (product.frontImage) {
        images.push({
          id: 'img_front',
          url: product.frontImage,
          alt_text: product.frontAltText || 'Front view',
          angle: 'front',
          is_primary: true
        })
      }
      if (product.backImage) {
        images.push({
          id: 'img_back',
          url: product.backImage,
          alt_text: product.backAltText || 'Back view',
          angle: 'back',
          is_primary: false
        })
      }
      if (product.leftImage) {
        images.push({
          id: 'img_left',
          url: product.leftImage,
          alt_text: product.leftAltText || 'Left view',
          angle: 'left',
          is_primary: false
        })
      }
      if (product.rightImage) {
        images.push({
          id: 'img_right',
          url: product.rightImage,
          alt_text: product.rightAltText || 'Right view',
          angle: 'right',
          is_primary: false
        })
      }
      if (product.materialImage) {
        images.push({
          id: 'img_material',
          url: product.materialImage,
          alt_text: product.materialAltText || 'Material view',
          angle: 'material',
          is_primary: false
        })
      }
      console.log('🖼️ [getCurrentVariationImages] Created images from angle images:', images)
      return images
    }
    
    // If product has variations, find images for the current color variation
    if (product.hasVariations && product.variations) {
      // Find the variation that matches the current product color
      const currentVariation = product.variations.find((v: any) => v.color && v.color.hex_code === productColor)
      
      if (!currentVariation || !currentVariation.images) {
      return []
    }
    
      // Filter out images without valid URLs and return only valid images
      return currentVariation.images.filter((img: any) => img.url && img.url.trim() !== '')
    } else {
      // For single products without variations, return individual angle images
      const individualImages = []
      
      if ((product as any).frontImage && (product as any).frontImage.trim() !== '') {
        individualImages.push({
          id: 'front_img',
          url: (product as any).frontImage,
          alt_text: (product as any).frontAltText || '',
          angle: 'front',
          is_primary: true
        })
      }
      
      if ((product as any).backImage && (product as any).backImage.trim() !== '') {
        individualImages.push({
          id: 'back_img',
          url: (product as any).backImage,
          alt_text: (product as any).backAltText || '',
          angle: 'back',
          is_primary: false
        })
      }
      
      if ((product as any).leftImage && (product as any).leftImage.trim() !== '') {
        individualImages.push({
          id: 'left_img',
          url: (product as any).leftImage,
          alt_text: (product as any).leftAltText || '',
          angle: 'left',
          is_primary: false
        })
      }
      
      if ((product as any).rightImage && (product as any).rightImage.trim() !== '') {
        individualImages.push({
          id: 'right_img',
          url: (product as any).rightImage,
          alt_text: (product as any).rightAltText || '',
          angle: 'right',
          is_primary: false
        })
      }
      
      if ((product as any).materialImage && (product as any).materialImage.trim() !== '') {
        individualImages.push({
          id: 'material_img',
          url: (product as any).materialImage,
          alt_text: (product as any).materialAltText || '',
          angle: 'material',
          is_primary: false
        })
      }
      
      return individualImages
    }
  }

  // Get current variation (for both variation products and single products)
  const getCurrentVariation = () => {
    if (!selectedProduct) return null
    
    const product = selectedProduct as Product;
    
    if (product.hasVariations && product.variations) {
      // For variation products, find the variation that matches the current color
      return product.variations.find((v: any) => v.color && v.color.hex_code === productColor)
    } else {
      // For single products, create a virtual variation with individual angle images
      const individualImages = getCurrentVariationImages()
      if (individualImages.length > 0) {
        return {
          id: 'single_product_variation',
          color: { name: 'Default', hex_code: product.baseColor || '#000000', swatch_image: product.image },
          images: individualImages,
          price: product.price,
          inStock: (product as any).inStock || true,
          stockQuantity: 0,
          isDefault: true
        }
      }
    }
    
    return null
  }

  // Memoize angles to prevent unnecessary re-computation and glitching
  const angles = useMemo(() => {
    return getProductAngles()
  }, [selectedProduct?.id, selectedProduct?.variations, selectedProduct?.angles, selectedProduct?.frontImage, selectedProduct?.backImage, selectedProduct?.leftImage, selectedProduct?.rightImage, productColor])
  
  // Memoize current image to ensure it updates when viewMode changes
  const currentImage = useMemo(() => {
    return getCurrentImage()
  }, [selectedProduct, viewMode, productColor])
  
  const currentVariationImages = getCurrentVariationImages()
  const currentVariation = getCurrentVariation()
  
  // Get design frames for current variation and view mode - memoized to prevent infinite loops
  const currentVariationFrames = useMemo(() => {
    if (!selectedProduct) return []
    
    const product = selectedProduct as any
    
    console.log('🖼️ [getCurrentVariationFrames] Debug:', {
      productId: product.id,
      hasVariations: product.hasVariations,
      variationsCount: product.variations?.length,
      productColor,
      viewMode,
      productDesignFrames: product.designFrames,
      variations: product.variations?.map((v: any) => ({
        id: v.id,
        color: v.color?.hex_code,
        hasDesignFrames: !!v.designFrames,
        designFramesCount: v.designFrames?.length
      }))
    })
    
    // If product has variations, get frames from the current variation
    if (product.hasVariations && product.variations) {
      const currentVariation = product.variations.find((v: any) => v.color && v.color.hex_code === productColor)
      
      console.log('🎨 [getCurrentVariationFrames] Current variation:', {
        found: !!currentVariation,
        variationId: currentVariation?.id,
        designFrames: currentVariation?.designFrames,
        designFramesCount: currentVariation?.designFrames?.length
      })
      
      if (currentVariation && currentVariation.designFrames) {
        // Filter frames for the current view mode/angle
        const filteredFrames = currentVariation.designFrames.filter((frame: any) => 
          (frame.angle === viewMode) || (!frame.angle && frame.position === viewMode)
        )
        
        console.log('📐 [getCurrentVariationFrames] Filtered frames:', {
          viewMode,
          totalFrames: currentVariation.designFrames.length,
          filteredCount: filteredFrames.length,
          frames: filteredFrames
        })
        
        return filteredFrames
      }
    }
    
    // Fallback to product-level design frames
    if (product.designFrames) {
      const filteredFrames = product.designFrames.filter((frame: any) => 
        (frame.angle === viewMode) || (!frame.angle && frame.position === viewMode)
      )
      
      console.log('📐 [getCurrentVariationFrames] Product-level frames:', {
        viewMode,
        totalFrames: product.designFrames.length,
        filteredCount: filteredFrames.length,
        frames: filteredFrames
      })
      
      return filteredFrames
    }
    
    console.log('❌ [getCurrentVariationFrames] No frames found')
    return []
  }, [selectedProduct, productColor, viewMode])
  
  // Set design boundaries when frames change or canvas becomes available
  useEffect(() => {
    if (!setDesignBoundaries) return
    
    const applyFrames = () => {
      // Try calling setDesignBoundaries directly - it now handles canvas availability internally
      if (currentVariationFrames && currentVariationFrames.length > 0) {
        console.log('🎯 [CentralCanvas] Attempting to apply design boundaries:', currentVariationFrames)
        setDesignBoundaries(currentVariationFrames, { isMobile, canvasScale })
        
        // Check if canvas is available for render
        const canvas = getFabricCanvas()
        if (canvas) {
          canvas.requestRenderAll()
          return true
        }
        return false // Canvas not ready yet, but boundaries might be stored
      }
      return false
    }
    
    // If we have frames to apply
    if (currentVariationFrames && currentVariationFrames.length > 0) {
      // Try to apply immediately
      const applied = applyFrames()
      
      // Set up retry mechanism
      let retryCount = 0
      const maxRetries = 60 // 3 seconds at 50ms intervals
      
      const checkInterval = setInterval(() => {
        retryCount++
        
        if (applyFrames()) {
          console.log('✅ [CentralCanvas] Frames applied successfully after', retryCount, 'attempts')
          clearInterval(checkInterval)
        } else if (retryCount >= maxRetries) {
          console.warn('⚠️ [CentralCanvas] Max retries reached for frame application')
          clearInterval(checkInterval)
          
          // Last attempt - force call setDesignBoundaries anyway
          setDesignBoundaries(currentVariationFrames, { isMobile, canvasScale })
        }
      }, 50)
      
      // Also try again after a longer delay as backup
      const backupTimer = setTimeout(() => {
        console.log('🔄 [CentralCanvas] Backup frame application attempt')
        setDesignBoundaries(currentVariationFrames, { isMobile, canvasScale })
        const canvas = getFabricCanvas()
        if (canvas) canvas.requestRenderAll()
      }, 500)
      
      return () => {
        clearInterval(checkInterval)
        clearTimeout(backupTimer)
      }
    } else if (currentVariationFrames?.length === 0) {
      // Clear boundaries if no frames
      setDesignBoundaries([], { isMobile, canvasScale })
    }
  }, [JSON.stringify(currentVariationFrames), isMobile, canvasScale, setDesignBoundaries, getFabricCanvas]) // Dependencies
  
  // Additional effect to ensure frames are applied when product or view changes
  useEffect(() => {
    if (!selectedProduct || !setDesignBoundaries) return
    
    // Small delay to ensure canvas and product data are ready
    const timer = setTimeout(() => {
      const canvas = getFabricCanvas()
      if (canvas && currentVariationFrames.length > 0) {
        console.log('🔄 [CentralCanvas] Reapplying frames after product/view change:', {
          productId: selectedProduct.id,
          viewMode,
          framesCount: currentVariationFrames.length
        })
        setDesignBoundaries(currentVariationFrames, { isMobile, canvasScale })
        canvas.requestRenderAll()
      }
    }, 300) // Slightly longer delay to ensure all data is loaded
    
    return () => clearTimeout(timer)
  }, [selectedProduct?.id, viewMode, productColor, currentVariationFrames.length]) // Re-apply when these change
  
  // Listen for canvas ready event
  useEffect(() => {
    const handleCanvasReady = (event: any) => {
      console.log('🎉 [CentralCanvas] Canvas ready event received')
      
      // Apply frames if we have them
      if (currentVariationFrames.length > 0 && setDesignBoundaries) {
        console.log('🎯 [CentralCanvas] Applying frames on canvas ready')
        setDesignBoundaries(currentVariationFrames, { isMobile, canvasScale })
        
        // Also request render
        const canvas = event.detail?.canvas || getFabricCanvas()
        if (canvas) {
          canvas.requestRenderAll()
        }
      }
    }
    
    window.addEventListener('fabricCanvasReady', handleCanvasReady)
    
    return () => {
      window.removeEventListener('fabricCanvasReady', handleCanvasReady)
    }
  }, [currentVariationFrames, setDesignBoundaries, isMobile, canvasScale, getFabricCanvas])
  
  // Debug logging for angle buttons and image changes
  useEffect(() => {
    console.log('🎯 [CentralCanvas] Angle button state:', {
      hasSelectedProduct: !!selectedProduct,
      angles: angles,
      anglesLength: angles.length,
      isLoadingProduct,
      shouldShowAngles: selectedProduct && angles && angles.length > 0 && !isLoadingProduct,
      currentVariationImages: currentVariationImages.length,
      viewMode,
      currentImage: currentImage ? currentImage.substring(0, 50) + '...' : null,
      productAngles: selectedProduct ? {
        frontImage: !!(selectedProduct as any).frontImage,
        backImage: !!(selectedProduct as any).backImage,
        leftImage: !!(selectedProduct as any).leftImage,
        rightImage: !!(selectedProduct as any).rightImage,
      } : null,
      designFrames: currentVariationFrames,
      framesForCurrentView: currentVariationFrames.length
    })
  }, [selectedProduct, angles, isLoadingProduct, currentVariationImages, viewMode, currentImage, currentVariationFrames])
  
  // Debug current image
  console.log('🎨 [CentralCanvas] Render state:', {
    hasSelectedProduct: !!selectedProduct,
    productName: selectedProduct?.name,
    currentImage,
    isLoadingProduct,
    shouldShowImage: selectedProduct && currentImage && !isLoadingProduct
  })

  // Update view mode if current view mode is not available in new angles
  useEffect(() => {
    if (selectedProduct && angles.length > 0 && !angles.includes(viewMode)) {
      // If current view mode is not available in new angles, switch to first available angle
      dispatch(setViewMode(angles[0]))
    }
  }, [angles, viewMode, selectedProduct, dispatch])

  // Force refresh product data from API (bypass session)
  const forceRefreshProductFromAPI = useCallback(async () => {
    if (!selectedProduct?.id) {
      console.log('🔄 [CentralCanvas] No product ID available for force refresh')
      return
    }
    
    try {
      console.log('🔄 [CentralCanvas] Force refreshing product from API:', selectedProduct.id)
      
      const response = await fetch(`/api/products/${selectedProduct.id}`)
      const productData = await response.json()
      
      if (productData && productData.id) {
        console.log('🔄 [CentralCanvas] Product refreshed from API:', {
          name: productData.name,
          hasPurchaseLimit: !!productData.purchaseLimit,
          purchaseLimit: productData.purchaseLimit,
          price: productData.price
        })
        
        // Build the refreshed product object with the same structure as ProductModal
        const refreshedProduct = {
          id: productData.id,
          name: productData.name,
          type: productData.categoryId,
          categoryId: productData.categoryId,
          baseColor: productData.baseColor || "",
          angles: productData.angles || [],
          colors: productData.hasVariations && productData.variations 
            ? productData.variations.map((v: any) => v.color?.hex_code).filter(Boolean)
            : [],
          price: productData.price,
          image: productData.image || productData.imageUrl,
          description: productData.description,
          inStock: productData.inStock,
          hasVariations: productData.hasVariations,
          variations: productData.variations || [],
          purchaseLimit: productData.purchaseLimit, // Include purchase limit data
        }
        
        // Update the product in Redux state
        dispatch(setSelectedProduct(refreshedProduct))
        
        // Also update the session in localStorage
        const sessionRaw = localStorage.getItem('designSessionState')
        const session = sessionRaw ? JSON.parse(sessionRaw) : {}
        const updatedSession = {
          ...session,
          selectedProduct: refreshedProduct,
          timestamp: Date.now()
        }
        localStorage.setItem('designSessionState', JSON.stringify(updatedSession))
        
        console.log('🔄 [CentralCanvas] Product refreshed and session updated')
      }
    } catch (error) {
      console.error('🔄 [CentralCanvas] Error force refreshing product:', error)
    }
  }, [selectedProduct?.id, dispatch])
  
  // Expose the force refresh function to window for debugging
  useEffect(() => {
    if (isClient) {
      (window as any).forceRefreshProductFromAPI = forceRefreshProductFromAPI
    }
  }, [isClient, forceRefreshProductFromAPI])

  // Enterprise apps typically log only in development environments
  if (isClient && process.env.NODE_ENV === 'development') {
    console.log('CentralCanvas:', {
      productName: selectedProduct ? (selectedProduct as Product).name : null,
      viewMode,
      hasVariations: selectedProduct ? (selectedProduct as Product).hasVariations : null,
      colorSelected: productColor,
      angles,
      currentVariationImagesCount: currentVariationImages.length,
      currentVariationImages: currentVariationImages.map((img: any) => ({ angle: img.angle, url: img.url })),
      currentImage,
      currentVariation: currentVariation ? {
        id: currentVariation.id,
        color: currentVariation.color?.hex_code,
        imagesCount: currentVariation.images?.length
      } : null,
      hasCurrentDesign: variationDesignPersistence.hasCurrentDesign,
      variationsWithCurrentView: variationDesignPersistence.getVariationsWithCurrentView(),
      // Debug single product design persistence
      singleProductDebug: !(selectedProduct as Product)?.hasVariations ? {
        currentVariationId: variationDesignPersistence.getCurrentVariationId(),
        availableViewModes: variationDesignPersistence.getAvailableViewModes(),
        hasCurrentDesign: variationDesignPersistence.hasCurrentDesign
      } : null
    })
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden relative">
      {/* Load saved design component */}
      <LoadSavedDesign onDesignLoaded={handleDesignLoaded} />
      
      {/* Loading Overlay */}
      {isLoadingProduct && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gray-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">Loading Product</p>
              <p className="text-sm text-gray-500 mt-1">Preparing your design canvas...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Canvas Area - Full height with minimal padding */}
      <div className="flex-1 flex items-center justify-center p-2 lg:p-4">
        <div className="relative w-full h-full max-w-4xl max-h-full flex flex-col">
          {/* Angle Selector Above Canvas */}
          {selectedProduct && angles && angles.length > 0 && !isLoadingProduct && (
            <div className="flex justify-center mb-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md border border-gray-200/60">
                <div className="flex gap-1">
                  {angles.map((angle) => (
                    <Button
                      key={angle}
                      variant={viewMode === angle ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleViewChange(angle)}
                      className="capitalize px-3 py-1 text-xs"
                    >
                      {angle}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Main Container - Relative positioning with base/product image */}
          <div className="flex-1 relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/60 shadow-xl min-h-0">
            
            {/* Base/Product Image - Background layer */}
            {selectedProduct && currentImage && !isLoadingProduct ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
                  <div 
                    className="flex items-center justify-center" 
                    style={{ 
                      width: isMobile ? `${600 * canvasScale}px` : '600px', 
                      height: isMobile ? `${600 * canvasScale}px` : '600px', 
                      position: 'relative' 
                    }}
                  >
                    <img
                      key={`product-image-${viewMode}-${currentImage}`}
                      src={currentImage}
                      alt={(selectedProduct as Product).name}
                      className="object-contain drop-shadow-lg"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        filter: viewMode === "back" ? "brightness(0.85) saturate(1.1)" : "saturate(1.1)",
                        transform: viewMode === "left" ? "rotateY(25deg)" : 
                                viewMode === "right" ? "rotateY(-25deg)" : "none"
                      }}
                      onError={(e) => {
                        console.error('❌ [CentralCanvas] Image failed to load:', currentImage);
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.jpg';
                      }}
                      onLoad={() => {
                        console.log('✅ [CentralCanvas] Image loaded successfully:', currentImage);
                      }}
                    />
                  </div>
                </div>
                
                {/* Design Frames Overlay - Hidden since we show boundaries in the canvas itself */}
                {/* Keeping the console logs for debugging */}
                {currentVariationFrames && currentVariationFrames.length > 0 ? (
                  console.log('🖼️ [CentralCanvas] Frames available:', currentVariationFrames) || null
                ) : (
                  console.log('❌ [CentralCanvas] No frames to render:', { 
                    hasFrames: !!currentVariationFrames, 
                    frameCount: currentVariationFrames?.length,
                    viewMode,
                    productId: selectedProduct?.id 
                  }) || null
                )}
              </>
            ) : !isLoadingProduct ? (
              /* Show instructions when no product selected and not loading */
              <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-8" style={{ zIndex: 1 }}>
                <div className="text-center text-gray-400">
                  <p className="text-xl font-medium mb-2">Start by selecting a product</p>
                  <p className="text-sm text-gray-400 max-w-md">Click the product icon in the left toolbar to browse available products</p>
                </div>
              </div>
            ) : null}

            {/* Sub Container - Contains canvas and all design layers */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
              <div 
                className="relative" 
                style={{ 
                  width: isMobile ? `${600 * canvasScale}px` : '600px', 
                  height: isMobile ? `${600 * canvasScale}px` : '600px', 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)'
                }}
              >
                
                {/* Canvas Container - Scaled for mobile */}
                <div 
                  className="absolute inset-0 flex items-center justify-center" 
                  style={{ 
                    zIndex: 20,
                    transform: isMobile ? `scale(${canvasScale})` : 'none',
                    transformOrigin: 'center center'
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    id="design-canvas"
                    style={{ 
                      width: '600px', 
                      height: '600px', 
                      position: 'absolute', 
                      top: isMobile ? '50%' : 0, 
                      left: isMobile ? '50%' : 0,
                      transform: isMobile ? 'translate(-50%, -50%)' : 'none'
                    }}
                    // className="cursor-crosshair bg-transparent transition-all duration-300 ease-in-out"
                    // style={{ 
                    //   border: shouldShowCanvasBorder() 
                    //     ? "2px dashed #3b82f6" 
                    //     : "2px dashed transparent",
                    //   borderRadius: "8px",
                    //   boxShadow: shouldShowCanvasBorder() 
                    //     ? "0 0 0 1px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
                    //     : "0 0 0 1px transparent, 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
                    //   backgroundColor: shouldShowCanvasBorder() 
                    //     ? "rgba(255, 255, 255, 0.05)" 
                    //     : "transparent"
                    // }}
                    // width={300}
                    // height={300}
                  />
                </div>

                {/* We don't need to render image layers here anymore since they're handled by Fabric.js canvas */}
              </div>
            </div>
          </div>
          
          {/* Product Angles - Compact design at bottom */}
          {selectedProduct && angles && angles.length > 0 && (
            <div className="flex-shrink-0 mt-3 lg:mt-4">
             
              <ProductAnglesSelector
                angles={angles}
                selectedAngle={viewMode}
                onSelect={handleViewChange}
                className=""
                productImage={getCurrentImage() || ""}
                variationImages={currentVariationImages}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}