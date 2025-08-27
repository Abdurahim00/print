"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
import { translations } from "@/lib/constants"
import { ProductCard } from "@/components/products/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, SlidersHorizontal, X, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"
import { setFilters, setPage } from "@/lib/redux/slices/productsSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchCategories, fetchSubcategories } from "@/lib/redux/slices/categoriesSlice"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function ProductsView({ categorySlug, subcategorySlug }: { categorySlug?: string; subcategorySlug?: string }) {
  const dispatch = useAppDispatch()
  const { items: products, loading, error, pagination, filters } = useAppSelector((state) => state.products)
  const { language } = useAppSelector((state) => state.app)
  const sessionUser = useAppSelector((s: any) => s.auth.user)
  const t = translations[language]
  const [loadTimeout, setLoadTimeout] = useState(false)

  const cats = useAppSelector((s: any) => s.categories.categories)
  const subs = useAppSelector((s: any) => s.categories.subcategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null)
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [currentPage, setCurrentPage] = useState(1)

  // Initial load with pagination
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories first
        await dispatch(fetchCategories())
        await dispatch(fetchSubcategories())
        
        // Then load products with initial pagination
        const category = categorySlug ? cats.find((c: any) => c.slug === categorySlug) : null
        await dispatch(fetchProducts({ 
          page: 1, 
          limit: 20,
          categoryId: category?.id
        }))
      } catch (err) {
        console.error('Failed to load products:', err)
      }
    }
    loadData()
    
    // Set timeout to show error after 15 seconds (only if still loading)
    const timer = setTimeout(() => {
      if (loading) {
        setLoadTimeout(true)
      }
    }, 15000)
    
    return () => clearTimeout(timer)
  }, [dispatch, categorySlug])
  
  // Handle filter changes
  useEffect(() => {
    const loadFilteredProducts = async () => {
      setLoadTimeout(false) // Reset timeout when making a new request
      await dispatch(fetchProducts({
        page: currentPage,
        limit: 20,
        categoryId: selectedCategoryFilter || undefined,
        subcategoryId: selectedSubcategoryFilter || undefined,
        search: searchTerm || undefined,
        sortBy: sortBy,
        minPrice: priceRange.min > 0 ? priceRange.min : undefined,
        maxPrice: priceRange.max < 10000 ? priceRange.max : undefined
      }))
    }
    
    const debounceTimer = setTimeout(() => {
      loadFilteredProducts()
    }, 500)
    
    return () => clearTimeout(debounceTimer)
  }, [dispatch, currentPage, selectedCategoryFilter, selectedSubcategoryFilter, searchTerm, sortBy, priceRange])

  // Reset timeout when loading completes
  useEffect(() => {
    if (!loading) {
      setLoadTimeout(false)
    }
  }, [loading])

  // Get selected category and subcategory based on URL params
  const selectedCategory = useMemo(() => {
    if (!categorySlug || cats.length === 0) return null
    return cats.find((c: any) => c.slug === categorySlug)
  }, [categorySlug, cats])

  const selectedSubcategory = useMemo(() => {
    if (!subcategorySlug || !selectedCategory || subs.length === 0) return null
    return subs.find((s: any) => s.slug === subcategorySlug && s.categoryId === selectedCategory.id)
  }, [subcategorySlug, selectedCategory, subs])

  // Since we're using server-side filtering now, we don't need client-side filtering
  const filteredAndSortedProducts = products


  const ProductCardSkeleton = () => (
    <Card className="overflow-hidden flex flex-col border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-800" />
      <CardContent className="p-4 flex-grow flex flex-col space-y-2 border-t-2 border-gray-300 dark:border-gray-700">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t-2 border-gray-300 dark:border-gray-700">
        <div className="flex gap-2 w-full">
          <div className="flex-1 h-9 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="flex-1 h-9 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <div className="relative bg-black text-white py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 opacity-20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-black uppercase tracking-wider mb-4">
            {selectedCategory ? selectedCategory.name : t.products}
          </h1>
          <p className="text-xl opacity-90">
            {selectedSubcategory ? selectedSubcategory.name : t.viewProducts}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Controls Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-black dark:border-white p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder={t.searchProducts || "Search products..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-12 pr-4 border-2 border-black dark:border-white rounded-xl font-bold"
              />
            </div>
            
            {/* Controls */}
            <div className="flex gap-2">
              {/* Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-12 px-6 border-2 font-bold uppercase transition-all ${
                  showFilters 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'bg-transparent border-black text-black dark:border-white dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                }`}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                {(selectedCategoryFilter || selectedSubcategoryFilter) && (
                  <span className="ml-2 px-2 py-0.5 bg-white text-black dark:bg-black dark:text-white rounded-full text-xs">
                    {(selectedCategoryFilter ? 1 : 0) + (selectedSubcategoryFilter ? 1 : 0)}
                  </span>
                )}
              </Button>
              
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 px-4 border-2 border-black dark:border-white bg-transparent rounded-xl font-bold uppercase cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory || selectedSubcategory || selectedCategoryFilter || selectedSubcategoryFilter) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
              <span className="text-sm font-bold uppercase">Active Filters:</span>
              {selectedCategory && !selectedCategoryFilter && !selectedSubcategoryFilter && (
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-bold"
                >
                  {selectedCategory.name}
                  <X className="h-3 w-3" />
                </Link>
              )}
              {selectedSubcategory && !selectedSubcategoryFilter && (
                <Link
                  href={`/products?category=${selectedCategory?.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-bold"
                >
                  {selectedSubcategory.name}
                  <X className="h-3 w-3" />
                </Link>
              )}
              {selectedCategoryFilter && !selectedSubcategoryFilter && (
                <button
                  onClick={() => {
                    setSelectedCategoryFilter(null)
                    setSelectedSubcategoryFilter(null)
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-bold"
                >
                  {cats.find((c: any) => c.id === selectedCategoryFilter)?.name || 'Category'}
                  <X className="h-3 w-3" />
                </button>
              )}
              {selectedSubcategoryFilter && (
                <button
                  onClick={() => setSelectedSubcategoryFilter(null)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-bold"
                >
                  {subs.find((s: any) => s.id === selectedSubcategoryFilter)?.name || 'Subcategory'}
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-64 flex-shrink-0"
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-black dark:border-white p-6 sticky top-4">
                  <h3 className="text-lg font-black uppercase mb-6">Filter By</h3>
                  
                  {/* Categories Filter */}
                  <div className="mb-6">
                    <h4 className="font-bold uppercase text-sm mb-3">Categories</h4>
                    <div className="space-y-2">
                      {cats.filter((c: any) => c.isActive).map((category: any) => {
                        const categorySubcategories = subs.filter((s: any) => s.categoryId === category.id && s.isActive)
                        const isExpanded = expandedCategories.includes(category.id)
                        const isCategorySelected = selectedCategoryFilter === category.id
                        const count = products.filter(p => {
                          const pCatId = p.categoryId?.toString ? p.categoryId.toString() : p.categoryId
                          return pCatId === category.id
                        }).length
                        
                        return (
                          <div key={category.id}>
                            <button
                              onClick={() => {
                                if (categorySubcategories.length > 0) {
                                  // Toggle expand/collapse
                                  setExpandedCategories(prev => 
                                    prev.includes(category.id) 
                                      ? prev.filter(id => id !== category.id)
                                      : [...prev, category.id]
                                  )
                                } else {
                                  // Select category if no subcategories
                                  setSelectedCategoryFilter(
                                    selectedCategoryFilter === category.id ? null : category.id
                                  )
                                  setSelectedSubcategoryFilter(null)
                                }
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg border-2 transition-all font-bold ${
                                isCategorySelected
                                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                                  : 'border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                  {categorySubcategories.length > 0 && (
                                    <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                  )}
                                  <span>{category.name}</span>
                                </div>
                                <span className="text-sm opacity-60">({count})</span>
                              </div>
                            </button>
                            
                            {/* Subcategories */}
                            {isExpanded && categorySubcategories.length > 0 && (
                              <div className="mt-1 ml-4 space-y-1">
                                <button
                                  onClick={() => {
                                    setSelectedCategoryFilter(category.id)
                                    setSelectedSubcategoryFilter(null)
                                  }}
                                  className={`w-full text-left px-3 py-1.5 rounded-md border transition-all text-sm ${
                                    selectedCategoryFilter === category.id && !selectedSubcategoryFilter
                                      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-black border-gray-900 dark:border-gray-100'
                                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-100'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold">All {category.name}</span>
                                    <span className="text-xs opacity-60">({count})</span>
                                  </div>
                                </button>
                                {categorySubcategories.map((subcategory: any) => {
                                  const subCount = products.filter(p => {
                                    const subIds = p.subcategoryIds || []
                                    return subIds.includes(subcategory.id)
                                  }).length
                                  
                                  return (
                                    <button
                                      key={subcategory.id}
                                      onClick={() => {
                                        setSelectedCategoryFilter(category.id)
                                        setSelectedSubcategoryFilter(
                                          selectedSubcategoryFilter === subcategory.id ? null : subcategory.id
                                        )
                                      }}
                                      className={`w-full text-left px-3 py-1.5 rounded-md border transition-all text-sm ${
                                        selectedSubcategoryFilter === subcategory.id
                                          ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-black border-gray-900 dark:border-gray-100'
                                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-100'
                                      }`}
                                    >
                                      <div className="flex justify-between items-center">
                                        <span>{subcategory.name}</span>
                                        <span className="text-xs opacity-60">({subCount})</span>
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h4 className="font-bold uppercase text-sm mb-3">Price Range</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs uppercase font-bold">Min: {priceRange.min} SEK</label>
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-bold">Max: {priceRange.max} SEK</label>
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Clear Filters */}
                  <Button
                    onClick={() => {
                      setSelectedCategoryFilter(null)
                      setSelectedSubcategoryFilter(null)
                      setPriceRange({ min: 0, max: 10000 })
                      setSearchTerm("")
                      setExpandedCategories([])
                    }}
                    className="w-full border-2 border-black dark:border-white bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold uppercase"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Products Grid */}
          <div className="flex-1">

            {loading && loadTimeout ? (
              <div className="text-center py-20">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-black dark:border-white p-8 max-w-md mx-auto">
                  <p className="text-red-500 font-bold text-lg mb-4">Products are taking too long to load</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Please check your connection and refresh the page</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
            ) : loading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAndSortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.3) }}
                    className="h-full"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-black dark:border-white p-8 max-w-md mx-auto">
                  <p className="text-2xl font-black uppercase mb-4">No Products Found</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategoryFilter(null)
                      setPriceRange({ min: 0, max: 10000 })
                    }}
                    className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Results Count and Pagination */}
        {!loading && pagination && (
          <div className="mt-8 space-y-4">
            <div className="text-center">
              <p className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                Showing {Math.min(pagination.limit * (pagination.page - 1) + 1, pagination.total)}-{Math.min(pagination.limit * pagination.page, pagination.total)} of {pagination.total} products
              </p>
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-2 border-black dark:border-white font-bold"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {/* First page */}
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    className={`min-w-[40px] border-2 ${
                      currentPage === 1
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                        : "border-gray-300 dark:border-gray-600"
                    } font-bold`}
                  >
                    1
                  </Button>
                  
                  {/* Ellipsis if needed */}
                  {currentPage > 3 && (
                    <span className="px-2 flex items-center">...</span>
                  )}
                  
                  {/* Current page and neighbors */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page !== 1 && 
                      page !== pagination.totalPages && 
                      Math.abs(page - currentPage) <= 1
                    )
                    .map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[40px] border-2 ${
                          currentPage === page
                            ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                            : "border-gray-300 dark:border-gray-600"
                        } font-bold`}
                      >
                        {page}
                      </Button>
                    ))
                  }
                  
                  {/* Ellipsis if needed */}
                  {currentPage < pagination.totalPages - 2 && (
                    <span className="px-2 flex items-center">...</span>
                  )}
                  
                  {/* Last page */}
                  {pagination.totalPages > 1 && (
                    <Button
                      variant={currentPage === pagination.totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pagination.totalPages)}
                      className={`min-w-[40px] border-2 ${
                        currentPage === pagination.totalPages
                          ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                          : "border-gray-300 dark:border-gray-600"
                      } font-bold`}
                    >
                      {pagination.totalPages}
                    </Button>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="border-2 border-black dark:border-white font-bold"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


