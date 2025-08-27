"use client"

import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CategoryCircles() {
  const dispatch = useAppDispatch()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const categories = useAppSelector((state: any) => state.categories.categories)
  const { language } = useAppSelector((state) => state.app)

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 200
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  // Category icons mapping - you can customize these
  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, string> = {
      "T-Shirts": "👕",
      "Hoodies": "🧥",
      "Caps": "🧢",
      "Mugs": "☕",
      "Bags": "👜",
      "Accessories": "🎨",
      "Stickers": "🏷️",
      "Posters": "🖼️",
      "Business Cards": "💼",
      "Flyers": "📄",
      "Banners": "🏳️",
      "Signage": "🚩",
      "Labels": "🏷️",
      "Packaging": "📦",
      "Promotional": "🎁",
      "Office": "🏢",
      "Marketing": "📢",
      "Events": "🎪",
      "Custom": "✨",
      "Other": "📦"
    }
    
    // Try to find a matching icon
    for (const [key, icon] of Object.entries(icons)) {
      if (categoryName.toLowerCase().includes(key.toLowerCase())) {
        return icon
      }
    }
    
    return "📦" // Default icon
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center gap-2">
          {/* Left scroll button */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Scrollable container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Products */}
            <Link 
              href="/products"
              className="shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-2xl group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors shadow-sm group-hover:shadow-md">
                🛍️
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {language === 'en' ? 'All' : 'Alla'}
              </span>
            </Link>

            {/* Category circles */}
            {categories.filter((cat: any) => cat.isActive).map((category: any) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-2xl group-hover:border-purple-500 dark:group-hover:border-purple-400 transition-all shadow-sm group-hover:shadow-md group-hover:scale-105">
                  {getCategoryIcon(category.name)}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-center max-w-[70px]">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Right scroll button */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}