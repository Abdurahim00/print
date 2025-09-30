"use client"

import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getCategoryIcon } from "../home/category-icons"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export function CategoryShowcase() {
  const dispatch = useAppDispatch()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const categories = useAppSelector((state: any) => state.categories.categories)
  const { language } = useAppSelector((state) => state.app)
  const t = useTranslations()
  const [isVisible, setIsVisible] = useState(false)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const usedIconsRef = useRef(new Set<string>())

  useEffect(() => {
    // Only fetch if not already loaded
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length])

  const activeCategories = categories.filter((cat: any) => cat.isActive)

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // Consider mobile/tablet below 768px
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    // Trigger animation when categories are loaded
    if (categories.length > 0) {
      setIsVisible(true)
    }
  }, [categories])

  // Check scroll position to show/hide arrows (desktop only)
  useEffect(() => {
    if (isMobile) return // Skip on mobile

    const checkScroll = () => {
      if (!scrollContainerRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      checkScroll() // Initial check
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll)
      }
    }
  }, [isVisible, isMobile, activeCategories])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 300
    const currentScroll = scrollContainerRef.current.scrollLeft

    scrollContainerRef.current.scrollTo({
      left: direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount,
      behavior: 'smooth'
    })
  }

  // Reset used icons when categories change
  useEffect(() => {
    usedIconsRef.current.clear()
  }, [categories])

  // Get visible categories for mobile
  const getVisibleCategories = () => {
    if (!isMobile || showAll) return activeCategories
    return activeCategories.slice(0, 8) // Show 8 on mobile initially (2 rows of 4)
  }

  const visibleCategories = getVisibleCategories()
  const hasMoreCategories = isMobile && activeCategories.length > 8 && !showAll

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.05
      }
    }
  }

  // Item animation
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  }

  // Show placeholder while loading
  if (!isVisible) {
    return (
      <div className="w-full py-6 sm:py-8 relative">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-center h-24 sm:h-32">
            <div className="flex gap-4 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="w-12 h-3 sm:w-14 sm:h-3 mt-2 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile Grid Layout
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          className="w-full py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4">
            {/* Categories Grid for Mobile */}
            <motion.div
              className="grid grid-cols-4 gap-3 mx-auto max-w-sm"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {visibleCategories.map((category: any, index: number) => {
                const IconComponent = getCategoryIcon(category.name, index, usedIconsRef.current)
                return (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    className="flex justify-center"
                  >
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="group flex flex-col items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className="w-14 h-14 rounded-full bg-white border-2 border-black dark:border-white flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300">
                          <IconComponent className="w-6 h-6 text-black dark:text-white" />
                        </div>
                      </motion.div>
                      <span className="text-[10px] font-bold text-black dark:text-white text-center max-w-[60px] uppercase line-clamp-2 leading-tight">
                        {category.name}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Show All Button - Mobile */}
            {hasMoreCategories && (
              <motion.div
                className="flex justify-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={() => setShowAll(true)}
                  variant="outline"
                  className="border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-bold uppercase text-xs px-4 py-2"
                >
                  {t("categories.showAllCategories")}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Desktop Scrolling Layout
  return (
    <AnimatePresence>
      <motion.div
        className="w-full py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="relative group">
            {/* Left Arrow - Desktop */}
            <AnimatePresence>
              {showLeftButton && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => scroll('left')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-black dark:text-white flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Right Arrow - Desktop */}
            <AnimatePresence>
              {showRightButton && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => scroll('right')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-black dark:text-white flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Categories container - Desktop */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide px-8 flex justify-center"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <motion.div
                className="flex gap-5 lg:gap-6 py-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {activeCategories.map((category: any, index: number) => {
                  const IconComponent = getCategoryIcon(category.name, index, usedIconsRef.current)
                  return (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      className="flex-shrink-0 scroll-snap-align-start"
                    >
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                      >
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <div className="w-18 h-18 lg:w-20 lg:h-20 rounded-full bg-white border-2 border-black dark:border-white flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300">
                            <IconComponent className="w-8 h-8 lg:w-9 lg:h-9 text-black dark:text-white" />
                          </div>
                        </motion.div>
                        <span className="text-xs font-bold text-black dark:text-white text-center max-w-[80px] uppercase line-clamp-2 leading-tight">
                          {category.name}
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}