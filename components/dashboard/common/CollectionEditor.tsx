"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ProductBrowserModal } from "./ProductBrowserModal"
import { X, Plus, Package, Grip, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { getProductImage } from "@/lib/utils/product-image"
import { useCurrency } from "@/contexts/CurrencyContext"

interface Product {
  _id: string
  id: string
  name: string
  price: number
  image?: string
  categoryId?: string
  inStock?: boolean
}

interface Collection {
  id?: string
  name: string
  description?: string
  image?: string
  products: Product[]
  badge?: string
  badgeColor?: string
}

interface CollectionEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (collection: Collection) => void
  initialCollection?: Collection
  allProducts?: Product[]
}

export function CollectionEditor({
  open,
  onOpenChange,
  onSave,
  initialCollection,
  allProducts = []
}: CollectionEditorProps) {
  const { formatPrice } = useCurrency()
  const [collection, setCollection] = useState<Collection>(
    initialCollection || {
      name: "",
      description: "",
      products: [],
      badge: "",
      badgeColor: ""
    }
  )
  const [showProductBrowser, setShowProductBrowser] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (initialCollection) {
      setCollection(initialCollection)
    } else {
      setCollection({
        name: "",
        description: "",
        products: [],
        badge: "",
        badgeColor: ""
      })
    }
  }, [initialCollection, open])

  const handleProductsSelected = (products: Product[]) => {
    // Add new products that aren't already in the collection
    const existingIds = new Set(collection.products.map(p => p._id || p.id))
    const newProducts = products.filter(p => !existingIds.has(p._id || p.id))

    setCollection({
      ...collection,
      products: [...collection.products, ...newProducts]
    })
  }

  const removeProduct = (index: number) => {
    const newProducts = collection.products.filter((_, i) => i !== index)
    setCollection({ ...collection, products: newProducts })
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newProducts = [...collection.products]
    const draggedProduct = newProducts[draggedIndex]

    // Remove from old position
    newProducts.splice(draggedIndex, 1)

    // Insert at new position
    newProducts.splice(dropIndex, 0, draggedProduct)

    setCollection({ ...collection, products: newProducts })
    setDraggedIndex(null)
  }

  const handleSave = () => {
    if (!collection.name || collection.products.length === 0) {
      return
    }

    // Generate an ID if it doesn't exist
    const collectionToSave = {
      ...collection,
      id: collection.id || `collection_${Date.now()}`
    }

    onSave(collectionToSave)
    onOpenChange(false)
  }

  const isValid = collection.name && collection.products.length > 0

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {initialCollection ? "Edit Collection" : "Create Collection"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Collection Name *</Label>
                <Input
                  id="name"
                  value={collection.name}
                  onChange={(e) => setCollection({ ...collection, name: e.target.value })}
                  placeholder="e.g., Christmas Collection"
                />
              </div>
              <div>
                <Label htmlFor="badge">Badge (Optional)</Label>
                <Input
                  id="badge"
                  value={collection.badge || ""}
                  onChange={(e) => setCollection({ ...collection, badge: e.target.value })}
                  placeholder="e.g., Limited Time"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={collection.description || ""}
                onChange={(e) => setCollection({ ...collection, description: e.target.value })}
                placeholder="Describe this collection..."
                rows={2}
              />
            </div>

            {/* Collection Image */}
            <div>
              <Label htmlFor="collectionImage">Collection Image URL (Optional)</Label>
              <Input
                id="collectionImage"
                value={collection.image || ""}
                onChange={(e) => setCollection({ ...collection, image: e.target.value })}
                placeholder="https://example.com/image.jpg or /path/to/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a custom hero image for this collection. If left empty, a grid of products will be shown.
              </p>
              {collection.image && (
                <div className="mt-2 relative w-full h-32 bg-gray-100 rounded border">
                  <Image
                    src={collection.image}
                    alt="Collection preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Badge Color */}
            <div>
              <Label>Badge Style (Optional)</Label>
              <div className="flex gap-2 mt-1">
                {[
                  { value: "", label: "Default", className: "bg-black text-white" },
                  { value: "bg-red-500 text-white", label: "Red", className: "bg-red-500 text-white" },
                  { value: "bg-green-500 text-white", label: "Green", className: "bg-green-500 text-white" },
                  { value: "bg-blue-500 text-white", label: "Blue", className: "bg-blue-500 text-white" },
                  { value: "bg-yellow-400 text-black", label: "Yellow", className: "bg-yellow-400 text-black" },
                ].map(style => (
                  <Button
                    key={style.value}
                    variant={collection.badgeColor === style.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCollection({ ...collection, badgeColor: style.value })}
                    className={collection.badgeColor === style.value ? "" : style.className}
                  >
                    {style.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Products in Collection *</Label>
                <Badge variant="secondary">
                  {collection.products.length} products
                </Badge>
              </div>

              {collection.products.length === 0 ? (
                <Card className="p-8 text-center border-dashed">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500 mb-3">No products added yet</p>
                  <Button onClick={() => setShowProductBrowser(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Products
                  </Button>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {collection.products.map((product, index) => (
                      <div
                        key={product._id || product.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`
                          relative border-2 rounded-lg p-2 cursor-move
                          ${draggedIndex === index ? 'opacity-50' : ''}
                          hover:border-gray-400 transition-colors
                        `}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 z-10 h-6 w-6 p-0"
                          onClick={() => removeProduct(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>

                        <div className="absolute top-1 left-1 z-10">
                          <Grip className="h-4 w-4 text-gray-400" />
                        </div>

                        <div className="aspect-square relative mb-2 bg-gray-100 rounded">
                          {product.image ? (
                            <Image
                              src={getProductImage(product)}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium line-clamp-2">{product.name}</p>
                          <p className="text-xs font-bold">{formatPrice(product.price || 0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => setShowProductBrowser(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Products
                  </Button>
                </>
              )}
            </div>

            {/* Preview Section */}
            {collection.name && collection.products.length > 0 && (
              <div>
                <Label>Preview</Label>
                <Card className="p-4 mt-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{collection.name}</h3>
                        {collection.badge && (
                          <Badge className={collection.badgeColor || "bg-black text-white"}>
                            {collection.badge}
                          </Badge>
                        )}
                      </div>
                      {collection.description && (
                        <p className="text-sm text-gray-600 mb-2">{collection.description}</p>
                      )}
                      <p className="text-sm font-medium">
                        {collection.products.length} Products in this collection
                      </p>
                      {collection.image && (
                        <p className="text-xs text-gray-500 mt-1">
                          <ImageIcon className="inline h-3 w-3 mr-1" />
                          Custom image set
                        </p>
                      )}
                    </div>
                    {collection.image ? (
                      // Show custom image if set
                      <div className="w-32 h-32 relative bg-gray-100 rounded border-2 border-gray-200">
                        <Image
                          src={collection.image}
                          alt="Collection image"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      // Show product grid otherwise
                      <div className="grid grid-cols-2 gap-1 w-24">
                        {collection.products.slice(0, 4).map((product, idx) => (
                          <div key={idx} className="aspect-square relative bg-gray-100 rounded">
                            {product.image ? (
                              <Image
                                src={getProductImage(product)}
                                alt=""
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              {initialCollection ? "Update" : "Create"} Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProductBrowserModal
        open={showProductBrowser}
        onOpenChange={setShowProductBrowser}
        onProductsSelected={handleProductsSelected}
        selectedProducts={collection.products}
        multiSelect={true}
        title="Add Products to Collection"
      />
    </>
  )
}