"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchProducts, fetchCategoryCounts } from "@/lib/redux/slices/productsSlice"
import { fetchCategories, fetchSubcategories } from "@/lib/redux/slices/categoriesSlice"
import { translations } from "@/lib/constants"
import { useRouter, useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/products/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, SlidersHorizontal, X, ChevronDown, ChevronRight, ChevronLeft, Palette } from "lucide-react"
import { setFilters, setPage } from "@/lib/redux/slices/productsSlice"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function ProductsView({ categorySlug, subcategorySlug }: { categorySlug?: string; subcategorySlug?: string }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items: products, loading, error, pagination, filters, categoryCounts } = useAppSelector((state) => state.products)
  const { language } = useAppSelector((state) => state.app)
  const sessionUser = useAppSelector((s: any) => s.auth.user)
  const t = translations[language]
  const [loadTimeout, setLoadTimeout] = useState(false)
  
  // Store category counts once when they first arrive
  useEffect(() => {
    if (categoryCounts.length > 0 && staticCategoryCounts.length === 0) {
      console.log('[ProductsView] Storing static category counts:', categoryCounts)
      setStaticCategoryCounts(categoryCounts)
    }
  }, [categoryCounts]) // Only depend on categoryCounts to avoid initialization error

  const cats = useAppSelector((s: any) => s.categories.categories)
  const subs = useAppSelector((s: any) => s.categories.subcategories)
  
  // Track if counts have been fetched once AND store them locally
  const [countsFetched, setCountsFetched] = useState(false)
  const [staticCategoryCounts, setStaticCategoryCounts] = useState<any[]>([])
  
  // Initialize state from URL parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || "featured")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(searchParams.get('filterCategory'))
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<string | null>(searchParams.get('filterSubcategory'))
  const [showDesignableOnly, setShowDesignableOnly] = useState(searchParams.get('designable') === 'true')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ 
    min: parseInt(searchParams.get('minPrice') || '0'), 
    max: parseInt(searchParams.get('maxPrice') || '10000') 
  })
  const [currentPage, setCurrentPageState] = useState(parseInt(searchParams.get('page') || '1'))
  
  // Helper function to update page and URL together
  const setCurrentPage = (page: number) => {
    setCurrentPageState(page)
    updateURL({ page: page.toString() })
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Sync page state with URL when searchParams change (e.g., browser back/forward)
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1')
    if (pageFromUrl !== currentPage) {
      setCurrentPageState(pageFromUrl)
    }
  }, [searchParams.get('page')])

  // Update URL when filters change (debounced)
  const updateURL = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (params: Record<string, string | undefined>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const url = new URL(window.location.href)
        Object.entries(params).forEach(([key, value]) => {
          if (value) {
            url.searchParams.set(key, value)
          } else {
            url.searchParams.delete(key)
          }
        })
        router.push(url.pathname + url.search, { scroll: false })
      }, 100)
    }
  }, [router])
  
  // Initial load with parallel fetching
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all data in parallel for better performance
        const promises = [
          dispatch(fetchCategories()),
          dispatch(fetchSubcategories())
        ]
        
        // Only fetch category counts once
        if (!countsFetched) {
          promises.push(dispatch(fetchCategoryCounts({})))
          setCountsFetched(true)
        }
        
        // Only fetch products if we don't have categories yet
        // Otherwise wait for categories to load first
        if (cats.length > 0 || !categorySlug) {
          const category = categorySlug ? cats.find((c: any) => c.slug === categorySlug) : null
          promises.push(
            dispatch(fetchProducts({ 
              page: currentPage, 
              limit: 20,
              categoryId: category?.id || selectedCategoryFilter || undefined,
              subcategoryId: selectedSubcategoryFilter || undefined,
              search: searchTerm || undefined,
              sortBy: sortBy,
              minPrice: priceRange.min > 0 ? priceRange.min : undefined,
              maxPrice: priceRange.max < 10000 ? priceRange.max : undefined
            }))
          )
        }
        
        await Promise.all(promises)
        
        // If we had a category slug but no categories loaded yet, load products now
        if (categorySlug && cats.length === 0) {
          await dispatch(fetchProducts({ 
            page: currentPage, 
            limit: 20
          }))
        }
      } catch (err) {
        console.error('Failed to load products:', err)
      }
    }
    loadData()
    
    // Set timeout to show error after 10 seconds (reduced from 15)
    const timer = setTimeout(() => {
      if (loading) {
        setLoadTimeout(true)
      }
    }, 10000)
    
    return () => clearTimeout(timer)
  }, [dispatch, categorySlug]) // Only re-run if categorySlug changes
  
  
  // Handle filter changes with optimized debouncing
  useEffect(() => {
    const loadFilteredProducts = async () => {
      setLoadTimeout(false) // Reset timeout when making a new request
      
      // Fetch products only - category counts remain static
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
    
    // Only debounce search, apply other filters immediately
    const shouldDebounce = searchTerm !== ""
    const debounceDelay = shouldDebounce ? 200 : 0 // Reduced debounce
    
    const debounceTimer = setTimeout(() => {
      loadFilteredProducts()
    }, debounceDelay)
    
    return () => clearTimeout(debounceTimer)
  }, [dispatch, currentPage, selectedCategoryFilter, selectedSubcategoryFilter, searchTerm, sortBy, priceRange.min, priceRange.max])
  
  // Save scroll position before navigating away
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem(`products-scroll-${window.location.search}`, window.scrollY.toString())
    }
    
    window.addEventListener('beforeunload', saveScrollPosition)
    
    // Restore scroll position when returning to the page
    const savedPosition = sessionStorage.getItem(`products-scroll-${window.location.search}`)
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedPosition), behavior: 'instant' })
      }, 100)
    }
    
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition)
    }
  }, [searchParams.toString()])

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

  // Filter for designable products if needed
  const filteredAndSortedProducts = useMemo(() => {
    if (!showDesignableOnly) return products
    
    // Filter products that are designable (check both product and category)
    return products.filter((product: any) => {
      // Check if product itself is marked as designable
      if (product.isDesignable === true) {
        return true
      }
      
      // Check if category is designable
      const category = cats.find((c: any) => c.id === product.categoryId)
      if (category?.isDesignable === true) {
        return true
      }
      
      // Legacy check for designableAreas
      if (category?.designableAreas && category.designableAreas.length > 0) {
        return true
      }
      
      return false
    })
  }, [products, showDesignableOnly, cats])


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
      <div className="relative bg-black text-white py-8 sm:py-12 lg:py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 opacity-20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wider mb-2 sm:mb-4">
            {selectedCategory ? selectedCategory.name : t.products}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">
            {selectedSubcategory ? selectedSubcategory.name : t.viewProducts}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {selectedCategory ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href="/products" className="hover:text-black dark:hover:text-white transition-colors">
                      Products
                    </Link>
                  </BreadcrumbLink>
                </>
              ) : (
                <BreadcrumbPage className="font-semibold">Products</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {selectedCategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {selectedSubcategory ? (
                    <BreadcrumbLink asChild>
                      <Link 
                        href={`/products/${categorySlug}`} 
                        className="hover:text-black dark:hover:text-white transition-colors"
                      >
                        {selectedCategory.name}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-semibold">{selectedCategory.name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </>
            )}
            {selectedSubcategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">{selectedSubcategory.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search and Controls Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border-2 border-black dark:border-white p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
              <Input
                type="search"
                placeholder={t.searchProducts || "Search products..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 sm:h-12 pl-10 sm:pl-12 pr-3 sm:pr-4 border-2 border-black dark:border-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base"
              />
            </div>
            
            {/* Controls */}
            <div className="flex gap-2">
              {/* Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-10 sm:h-12 px-3 sm:px-6 border-2 font-bold uppercase transition-all text-xs sm:text-sm ${
                  showFilters 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'bg-transparent border-black text-black dark:border-white dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                }`}
              >
                <Filter className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Filters</span>
                <span className="sm:hidden">Filter</span>
                {(selectedCategoryFilter || selectedSubcategoryFilter || showDesignableOnly) && (
                  <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-white text-black dark:bg-black dark:text-white rounded-full text-[10px] sm:text-xs">
                    {(selectedCategoryFilter ? 1 : 0) + (selectedSubcategoryFilter ? 1 : 0) + (showDesignableOnly ? 1 : 0)}
                  </span>
                )}
              </Button>
              
              {/* Designable Products Toggle */}
              <Button
                onClick={() => {
                  setShowDesignableOnly(!showDesignableOnly)
                  updateURL({ designable: !showDesignableOnly ? 'true' : undefined })
                }}
                className={`h-10 sm:h-12 px-3 sm:px-4 border-2 font-bold uppercase transition-all text-xs sm:text-sm flex items-center gap-1 sm:gap-2 ${
                  showDesignableOnly 
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
                    : 'bg-transparent border-black text-black dark:border-white dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                }`}
                title="Show only customizable products"
              >
                <Palette className="h-4 sm:h-5 w-4 sm:w-5" />
                <span className="hidden lg:inline">Customizable</span>
              </Button>
              
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-none h-10 sm:h-12 px-2 sm:px-4 border-2 border-black dark:border-white bg-transparent rounded-lg sm:rounded-xl font-bold uppercase cursor-pointer text-xs sm:text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Low → High</option>
                <option value="price-desc">High → Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory || selectedSubcategory || selectedCategoryFilter || selectedSubcategoryFilter || showDesignableOnly) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
              <span className="text-sm font-bold uppercase">Active Filters:</span>
              {showDesignableOnly && (
                <button
                  onClick={() => {
                    setShowDesignableOnly(false)
                    updateURL({ designable: undefined })
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-bold"
                >
                  <Palette className="h-3 w-3" />
                  Customizable
                  <X className="h-3 w-3" />
                </button>
              )}
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
        
        {/* Mobile Filters Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-gray-900 rounded-xl border-2 border-black dark:border-white p-4 mb-4 overflow-hidden"
            >
              <div className="space-y-4">
                {/* Categories Filter */}
                <div>
                  <h4 className="font-bold uppercase text-sm mb-2 text-black dark:text-white">Categories</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {cats.filter((c: any) => c.isActive).map((category: any) => {
                      const categorySubcategories = subs.filter((s: any) => s.categoryId === category.id && s.isActive)
                      const isExpanded = expandedCategories.includes(category.id)
                      const isCategorySelected = selectedCategoryFilter === category.id
                      // Use static counts that never change
                      const countsToUse = staticCategoryCounts.length > 0 ? staticCategoryCounts : categoryCounts
                      const categoryCount = countsToUse.find(cc => cc.categoryId === category.id)
                      const count = categoryCount?.count || 0
                      
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
                            className={`w-full text-left px-3 py-2 rounded-lg border-2 transition-all font-bold text-sm flex items-center justify-between ${
                              isCategorySelected
                                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                                : 'border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              {categorySubcategories.length > 0 && (
                                <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              )}
                              {category.name}
                            </span>
                            <span className="text-xs opacity-60">({count})</span>
                          </button>
                          
                          {/* Subcategories */}
                          {isExpanded && categorySubcategories.length > 0 && (
                            <div className="mt-1 ml-4 space-y-1">
                              <button
                                onClick={() => {
                                  setSelectedCategoryFilter(category.id)
                                  setSelectedSubcategoryFilter(null)
                                }}
                                className={`w-full text-left px-2 py-1.5 rounded-md border transition-all text-xs ${
                                  selectedCategoryFilter === category.id && !selectedSubcategoryFilter
                                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-black border-gray-900 dark:border-gray-100'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-100'
                                }`}
                              >
                                All {category.name}
                              </button>
                              {categorySubcategories.map((subcategory: any) => {
                                const subCount = categoryCount?.subcategories?.find(sc => sc.subcategoryId === subcategory.id)?.count || 0
                                return (
                                  <button
                                  key={subcategory.id}
                                  onClick={() => {
                                    setSelectedCategoryFilter(category.id)
                                    setSelectedSubcategoryFilter(subcategory.id)
                                  }}
                                  className={`w-full text-left px-2 py-1.5 rounded-md border transition-all text-xs ${
                                    selectedSubcategoryFilter === subcategory.id
                                      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-black border-gray-900 dark:border-gray-100'
                                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-100'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span>{subcategory.name}</span>
                                    {subCount > 0 && (
                                      <span className="text-xs opacity-60">({subCount})</span>
                                    )}
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
                
                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedCategoryFilter(null)
                    setSelectedSubcategoryFilter(null)
                    setPriceRange({ min: 0, max: 10000 })
                    setSearchTerm("")
                    setShowFilters(false)
                  }}
                  className="w-full border-2 border-black dark:border-white bg-white hover:bg-black text-black hover:text-white dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:text-black font-bold uppercase text-sm py-2 px-4 rounded-lg transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="hidden lg:block w-64 flex-shrink-0"
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
                        // Use static counts that never change (desktop view)
                        const countsToUse = staticCategoryCounts.length > 0 ? staticCategoryCounts : categoryCounts
                        const categoryCount = countsToUse.find(cc => cc.categoryId === category.id)
                        const count = categoryCount?.count || 0
                        
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
                                  // Use subcategory counts from Redux if available
                                  const categoryData = categoryCounts.find(cc => cc.categoryId === category.id)
                                  const subCount = categoryData?.subcategories?.find((sc: any) => sc.subcategoryId === subcategory.id)?.count || 0
                                  
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
          
          {/* Products Grid - Always full width on mobile */}
          <div className="flex-1 min-w-0 w-full">

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
              <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            <div className="text-center">
              <p className="text-xs sm:text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
                Showing {Math.min(pagination.limit * (pagination.page - 1) + 1, pagination.total)}-{Math.min(pagination.limit * pagination.page, pagination.total)} of {pagination.total} products
              </p>
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-2 border-black dark:border-white font-bold text-xs sm:text-sm min-h-[36px] sm:min-h-[40px] touch-manipulation"
                >
                  <ChevronLeft className="h-3 sm:h-4 w-3 sm:w-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
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
                    <span className="px-1 sm:px-2 flex items-center text-xs sm:text-sm">...</span>
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
                        className={`min-w-[32px] sm:min-w-[40px] min-h-[32px] sm:min-h-[40px] border-2 text-xs sm:text-sm ${
                          currentPage === page
                            ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                            : "border-gray-300 dark:border-gray-600"
                        } font-bold touch-manipulation`}
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
                  className="border-2 border-black dark:border-white font-bold text-xs sm:text-sm min-h-[36px] sm:min-h-[40px] touch-manipulation"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


