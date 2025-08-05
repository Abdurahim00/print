"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { LeftToolbar } from "./left-toolbar"
import { CentralCanvas } from "./cental-canvas"
import { RightPanel } from "./right-panel"
import { ProductModal } from "./modals/product-modal"
import { TemplateModal } from "./modals/template-modal"
import { setShowProductModal, setShowTemplateModal } from "@/lib/redux/designToolSlices/designSlice"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
import { RootState } from "@/lib/redux/store"

export function DesignToolContainer() {
  const dispatch = useDispatch()
  const { showProductModal, showTemplateModal } = useSelector((state: RootState) => state.design)
  const { items: products, loading } = useSelector((state: RootState) => state.products)
  const { templates } = useSelector((state: RootState) => state.templates)

  // Fetch regular products on mount for the product modal
  useEffect(() => {
    dispatch(fetchProducts() as any)
  }, [dispatch])

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <LeftToolbar />

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <CentralCanvas />

          <div className="hidden lg:block">
            <RightPanel />
          </div>
        </div>
      </div>

      <div className="lg:hidden">
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
        templates={templates}
      />
    </div>
  )
}
