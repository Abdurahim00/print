"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Check, Package, Loader2 } from "lucide-react"
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
  subcategoryId?: string
  inStock?: boolean
  description?: string
}

interface ProductBrowserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductsSelected: (products: Product[]) => void
  selectedProducts?: Product[]
  multiSelect?: boolean
  title?: string
  maxSelection?: number
}

export function ProductBrowserModal({
  open,
  onOpenChange,
  onProductsSelected,
  selectedProducts = [],
  multiSelect = true,
  title = "Browse Products",
  maxSelection
}: ProductBrowserModalProps) {
  const { formatPrice } = useCurrency()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all")
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(selectedProducts.map(p => p._id || p.id))
  )
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const productsPerPage = 20

  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch products when modal opens or filters change
  useEffect(() => {
    if (open) {
      fetchProducts()
    }
  }, [open, currentPage, selectedCategory, selectedSubcategory, onlyInStock])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data.categories || [])
      setSubcategories(data.subcategories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: productsPerPage.toString()
      })

      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }

      if (selectedSubcategory && selectedSubcategory !== "all") {
        params.append("subcategory", selectedSubcategory)
      }

      if (onlyInStock) {
        params.append("inStock", "true")
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()

      setProducts(data.products || [])
      setTotalPages(Math.ceil((data.total || 0) / productsPerPage))
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products

    const query = searchQuery.toLowerCase()
    return products.filter(product =>
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.id?.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  const handleProductToggle = (product: Product) => {
    const productId = product._id || product.id
    const newSelectedIds = new Set(selectedIds)

    if (multiSelect) {
      if (newSelectedIds.has(productId)) {
        newSelectedIds.delete(productId)
      } else {
        if (maxSelection && newSelectedIds.size >= maxSelection) {
          return // Don't add if max selection reached
        }
        newSelectedIds.add(productId)
      }
    } else {
      // Single select mode
      newSelectedIds.clear()
      newSelectedIds.add(productId)
    }

    setSelectedIds(newSelectedIds)
  }

  const handleSelectAll = () => {
    const allIds = new Set(filteredProducts.map(p => p._id || p.id))
    setSelectedIds(allIds)
  }

  const handleClearAll = () => {
    setSelectedIds(new Set())
  }

  const handleConfirm = () => {
    const selected = products.filter(p => selectedIds.has(p._id || p.id))
    onProductsSelected(selected)
    onOpenChange(false)
  }

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategory || selectedCategory === "all") return subcategories
    return subcategories.filter(sub => sub.categoryId === selectedCategory)
  }, [selectedCategory, subcategories])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedIds.size} selected
              </Badge>
              {maxSelection && (
                <Badge variant="outline">
                  Max: {maxSelection}
                </Badge>
              )}
            </div>
            {multiSelect && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-3 border-b pb-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedSubcategory}
              onValueChange={setSelectedSubcategory}
              disabled={!selectedCategory || selectedCategory === "all"}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Subcategories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {filteredSubcategories.map(sub => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Checkbox
                id="inStock"
                checked={onlyInStock}
                onCheckedChange={(checked) => setOnlyInStock(checked as boolean)}
              />
              <Label htmlFor="inStock" className="text-sm">In Stock Only</Label>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Package className="h-12 w-12 mb-2" />
              <p>No products found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-3">
              {filteredProducts.map(product => {
                const productId = product._id || product.id
                const isSelected = selectedIds.has(productId)
                const isDisabled = !isSelected && maxSelection && selectedIds.size >= maxSelection

                return (
                  <div
                    key={productId}
                    className={`
                      relative border-2 rounded-lg p-2 cursor-pointer transition-all
                      ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'}
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => !isDisabled && handleProductToggle(product)}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1 z-10">
                        <div className="bg-blue-500 text-white rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      </div>
                    )}

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
                      {!product.inStock && (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={selectedIds.size === 0}>
            Confirm Selection ({selectedIds.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}