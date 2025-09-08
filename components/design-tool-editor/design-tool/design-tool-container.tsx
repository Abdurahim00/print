"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useSearchParams } from "next/navigation"
import { LeftToolbar } from "./left-toolbar"
import { CentralCanvas } from "./cental-canvas"
import { RightPanel } from "./right-panel"
import { ProductModal } from "./modals/product-modal"
import { TemplateModal } from "./modals/template-modal"
import { setShowProductModal, setShowTemplateModal, setSelectedProduct, setProductColor, setProductWithVariant } from "@/lib/redux/designToolSlices/designSlice"
import { fetchDesignableProducts } from "@/lib/redux/slices/productsSlice"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { RootState } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"

export function DesignToolContainer() {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')
  const variantId = searchParams.get('variant')
  
  const { showProductModal, showTemplateModal } = useSelector((state: RootState) => state.design)
  const { items: products, loading } = useSelector((state: RootState) => state.products)

  console.log('🛠️ [DesignToolContainer] Modal states:', { showProductModal, showTemplateModal, productsCount: products?.length, loading })
  console.log('🛠️ [DesignToolContainer] URL params:', { productId, variantId })

  // Fetch only designable products and categories for the design tool
  useEffect(() => {
    dispatch(fetchDesignableProducts() as any)
    dispatch(fetchCategories(true) as any) // Force refresh categories to get latest metric pricing
  }, [dispatch])

  // Load the product from URL if provided
  useEffect(() => {
    const loadProductFromUrl = async () => {
      if (productId && !loading) {
        // First check if product is in the loaded products
        let product = products.find((p: any) => p._id === productId || p.id === productId)
        
        if (!product && products.length > 0) {
          // If not found in designable products, fetch it directly
          console.log('🛠️ [DesignToolContainer] Product not in designable list, fetching directly:', productId)
          try {
            const response = await fetch(`/api/products/${productId}`)
            if (response.ok) {
              product = await response.json()
            }
          } catch (error) {
            console.error('🛠️ [DesignToolContainer] Error fetching product:', error)
          }
        }
        
        if (product) {
          console.log('🛠️ [DesignToolContainer] Setting product from URL:', product)
          
          // Use the new action that handles variant properly
          if (variantId) {
            dispatch(setProductWithVariant({ product, variantId }))
          } else {
            // If no variant specified, just set the product
            dispatch(setSelectedProduct(product))
          }
        } else {
          console.warn('🛠️ [DesignToolContainer] Product not found for ID:', productId)
        }
      }
    }
    
    loadProductFromUrl()
  }, [productId, variantId, products, loading, dispatch])

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <LeftToolbar />

        <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
          <CentralCanvas />

          <div className="hidden xl:block flex-shrink-0">
            <RightPanel />
          </div>
        </div>
      </div>

      {/* Mobile and tablet right panel */}
      <div className="xl:hidden border-t border-gray-200 bg-white flex-shrink-0">
        <RightPanel isMobile={true} />
      </div>

      <ProductModal
        isOpen={showProductModal}
        onClose={() => dispatch(setShowProductModal(false))}
        products={products}
        loading={loading}
      />

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => dispatch(setShowTemplateModal(false))}
      />

    </div>
  )
}
