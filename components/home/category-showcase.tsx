"use client"

import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function CategoryShowcase() {
  const dispatch = useAppDispatch()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const categories = useAppSelector((state: any) => state.categories.categories)
  const { language } = useAppSelector((state) => state.app)
  const [isVisible, setIsVisible] = useState(false)
  const [showArrows, setShowArrows] = useState(false)
  const usedIconsRef = useRef(new Set<string>())

  useEffect(() => {
    // Only fetch if not already loaded
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length])

  useEffect(() => {
    // Trigger animation when categories are loaded
    if (categories.length > 0) {
      setIsVisible(true)
      // Check if scrolling is needed
      const checkOverflow = () => {
        if (scrollContainerRef.current) {
          const hasOverflow = scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth
          setShowArrows(hasOverflow)
        }
      }
      
      setTimeout(checkOverflow, 100)
      
      // Check on resize
      window.addEventListener('resize', checkOverflow)
      return () => window.removeEventListener('resize', checkOverflow)
    }
  }, [categories])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 320
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  // Reset used icons when categories change
  useEffect(() => {
    usedIconsRef.current.clear()
  }, [categories])
  
  // Minimalistic icon mapping using iconify CDN with tabler/carbon icons (similar to flaticon style)
  // These are black and white minimalistic icons
  const iconMap: { [key: string]: { iconUrl: string, gradient: string } } = {
    // Apparel
    't-shirt': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shirt.svg", gradient: "from-gray-50 to-white" },
    'apparel': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shirt.svg", gradient: "from-gray-50 to-white" },
    'clothing': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shirt.svg", gradient: "from-gray-50 to-white" },
    'hoodie': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shirt.svg", gradient: "from-gray-50 to-white" },
    'cap': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/hat.svg", gradient: "from-gray-50 to-white" },

    // Drinkware
    'mug': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/coffee.svg", gradient: "from-gray-50 to-white" },
    'drinkware': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/glass-water.svg", gradient: "from-gray-50 to-white" },
    'bottle': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/bottle.svg", gradient: "from-gray-50 to-white" },
    'tumbler': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/glass-water.svg", gradient: "from-gray-50 to-white" },

    // Bags & Accessories
    'bag': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shopping-bag.svg", gradient: "from-gray-50 to-white" },
    'tote': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shopping-bag.svg", gradient: "from-gray-50 to-white" },
    'backpack': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/backpack.svg", gradient: "from-gray-50 to-white" },
    'wallet': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/wallet.svg", gradient: "from-gray-50 to-white" },

    // Accessories
    'watch': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/watch.svg", gradient: "from-gray-50 to-white" },
    'jewelry': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/gem.svg", gradient: "from-gray-50 to-white" },
    'accessories': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/tag.svg", gradient: "from-gray-50 to-white" },
    'sunglasses': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/eye.svg", gradient: "from-gray-50 to-white" },

    // Print Products
    'sticker': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/sticker.svg", gradient: "from-gray-50 to-white" },
    'print': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/printer.svg", gradient: "from-gray-50 to-white" },
    'poster': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/image.svg", gradient: "from-gray-50 to-white" },
    'business card': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/id-card.svg", gradient: "from-gray-50 to-white" },
    'card': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/credit-card.svg", gradient: "from-gray-50 to-white" },
    'flyer': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/file-text.svg", gradient: "from-gray-50 to-white" },
    'banner': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/flag.svg", gradient: "from-gray-50 to-white" },
    'calendar': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/calendar.svg", gradient: "from-gray-50 to-white" },
    'label': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/tag.svg", gradient: "from-gray-50 to-white" },

    // Office & Stationery
    'office': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/briefcase.svg", gradient: "from-gray-50 to-white" },
    'notebook': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/book.svg", gradient: "from-gray-50 to-white" },
    'pen': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/pen.svg", gradient: "from-gray-50 to-white" },
    'document': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/file.svg", gradient: "from-gray-50 to-white" },
    'folder': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/folder.svg", gradient: "from-gray-50 to-white" },

    // Tech & Electronics
    'phone': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/smartphone.svg", gradient: "from-gray-50 to-white" },
    'tech': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/cpu.svg", gradient: "from-gray-50 to-white" },
    'electronic': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/monitor.svg", gradient: "from-gray-50 to-white" },
    'headphone': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/headphones.svg", gradient: "from-gray-50 to-white" },
    'speaker': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/speaker.svg", gradient: "from-gray-50 to-white" },
    'mouse': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/mouse.svg", gradient: "from-gray-50 to-white" },
    'keyboard': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/keyboard.svg", gradient: "from-gray-50 to-white" },
    'usb': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/usb.svg", gradient: "from-gray-50 to-white" },

    // Home & Living
    'home': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/home.svg", gradient: "from-gray-50 to-white" },
    'decor': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/lamp.svg", gradient: "from-gray-50 to-white" },
    'kitchen': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/chef-hat.svg", gradient: "from-gray-50 to-white" },
    'pillow': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/bed.svg", gradient: "from-gray-50 to-white" },
    'towel': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shower.svg", gradient: "from-gray-50 to-white" },
    'candle': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/flame.svg", gradient: "from-gray-50 to-white" },

    // Promotional & Gifts
    'gift': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/gift.svg", gradient: "from-gray-50 to-white" },
    'promotional': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/megaphone.svg", gradient: "from-gray-50 to-white" },
    'award': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/award.svg", gradient: "from-gray-50 to-white" },
    'trophy': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/trophy.svg", gradient: "from-gray-50 to-white" },
    'medal': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/medal.svg", gradient: "from-gray-50 to-white" },

    // Packaging & Shipping
    'package': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/package.svg", gradient: "from-gray-50 to-white" },
    'packaging': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/box.svg", gradient: "from-gray-50 to-white" },
    'box': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/box.svg", gradient: "from-gray-50 to-white" },
    'envelope': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/mail.svg", gradient: "from-gray-50 to-white" },

    // Events & Occasions
    'party': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/party-popper.svg", gradient: "from-gray-50 to-white" },
    'event': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/calendar.svg", gradient: "from-gray-50 to-white" },
    'wedding': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/heart.svg", gradient: "from-gray-50 to-white" },
    'birthday': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/cake.svg", gradient: "from-gray-50 to-white" },
    'graduation': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/graduation-cap.svg", gradient: "from-gray-50 to-white" },
    'baby': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/baby.svg", gradient: "from-gray-50 to-white" },
    'christmas': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/christmas-tree.svg", gradient: "from-gray-50 to-white" },

    // Sports & Outdoor
    'sport': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/football.svg", gradient: "from-gray-50 to-white" },
    'gym': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/dumbbell.svg", gradient: "from-gray-50 to-white" },
    'fitness': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/activity.svg", gradient: "from-gray-50 to-white" },
    'yoga': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/flower.svg", gradient: "from-gray-50 to-white" },
    'outdoor': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/tent.svg", gradient: "from-gray-50 to-white" },
    'camping': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/campfire.svg", gradient: "from-gray-50 to-white" },
    'travel': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/plane.svg", gradient: "from-gray-50 to-white" },
    'beach': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/umbrella.svg", gradient: "from-gray-50 to-white" },

    // Food & Beverage
    'food': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/utensils.svg", gradient: "from-gray-50 to-white" },
    'beverage': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/glass-water.svg", gradient: "from-gray-50 to-white" },
    'restaurant': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/chef-hat.svg", gradient: "from-gray-50 to-white" },
    'coffee': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/coffee.svg", gradient: "from-gray-50 to-white" },

    // Other Categories
    'kid': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/baby.svg", gradient: "from-gray-50 to-white" },
    'children': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/baby.svg", gradient: "from-gray-50 to-white" },
    'toy': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/toy-brick.svg", gradient: "from-gray-50 to-white" },
    'game': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/gamepad.svg", gradient: "from-gray-50 to-white" },
    'gaming': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/gamepad.svg", gradient: "from-gray-50 to-white" },
    'health': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/heart.svg", gradient: "from-gray-50 to-white" },
    'medical': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/stethoscope.svg", gradient: "from-gray-50 to-white" },
    'beauty': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/sparkles.svg", gradient: "from-gray-50 to-white" },
    'spa': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/flower.svg", gradient: "from-gray-50 to-white" },
    'car': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/car.svg", gradient: "from-gray-50 to-white" },
    'vehicle': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/car.svg", gradient: "from-gray-50 to-white" },
    'music': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/music.svg", gradient: "from-gray-50 to-white" },
    'art': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/palette.svg", gradient: "from-gray-50 to-white" },
    'design': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/brush.svg", gradient: "from-gray-50 to-white" },
    'photo': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/camera.svg", gradient: "from-gray-50 to-white" },
    'photography': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/camera.svg", gradient: "from-gray-50 to-white" },
    'marketing': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/trending-up.svg", gradient: "from-gray-50 to-white" },
    'business': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/briefcase.svg", gradient: "from-gray-50 to-white" },
    'custom': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/wand.svg", gradient: "from-gray-50 to-white" },
    'eco': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/recycle.svg", gradient: "from-gray-50 to-white" },
    'sustainable': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/leaf.svg", gradient: "from-gray-50 to-white" },
    'luxury': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/crown.svg", gradient: "from-gray-50 to-white" },
    'premium': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/star.svg", gradient: "from-gray-50 to-white" },
    'team': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/users.svg", gradient: "from-gray-50 to-white" },
    'corporate': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/building.svg", gradient: "from-gray-50 to-white" },
    'pet': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/paw-print.svg", gradient: "from-gray-50 to-white" },
    'animal': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/paw-print.svg", gradient: "from-gray-50 to-white" },
    'nature': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/tree-pine.svg", gradient: "from-gray-50 to-white" },
    'craft': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/scissors.svg", gradient: "from-gray-50 to-white" },
    'diy': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/hammer.svg", gradient: "from-gray-50 to-white" },
    'tool': { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/wrench.svg", gradient: "from-gray-50 to-white" },
  }
  
  // Additional fallback icons - minimalistic generic icons
  const fallbackIcons = [
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/box.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/tag.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shopping-cart.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/basket.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/archive.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/cube.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/grid.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/circle.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/square.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/hexagon.svg"
  ]
  
  let fallbackIndex = 0
  
  // Unique icon for each category - no duplicates
  const getCategoryStyle = (categoryName: string, index: number) => {
    const name = categoryName.toLowerCase()
    
    // Check if we already assigned an icon to this exact category
    for (const [key, value] of Object.entries(iconMap)) {
      if (name.includes(key) && !usedIconsRef.current.has(value.iconUrl)) {
        usedIconsRef.current.add(value.iconUrl)
        return value
      }
    }
    
    // If no match found or icon already used, assign a fallback icon based on index
    const fallbackIcon = fallbackIcons[index % fallbackIcons.length]
    if (!usedIconsRef.current.has(fallbackIcon)) {
      usedIconsRef.current.add(fallbackIcon)
      return { iconUrl: fallbackIcon, gradient: "from-gray-50 to-white" }
    }
    
    // Ultimate fallback - find any unused icon
    for (const iconUrl of fallbackIcons) {
      if (!usedIconsRef.current.has(iconUrl)) {
        usedIconsRef.current.add(iconUrl)
        return { iconUrl, gradient: "from-gray-50 to-white" }
      }
    }
    
    // If all icons are used, use a default box icon
    return { iconUrl: "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/box.svg", gradient: "from-gray-50 to-white" }
  }

  const activeCategories = categories.filter((cat: any) => cat.isActive)

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  }

  // Item animation
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  // Show placeholder while loading
  if (!isVisible) {
    return (
      <div className="w-full py-8 relative">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-center h-32">
            <div className="flex gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="w-14 h-3 mt-2 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="w-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full relative group">
          <div className="relative w-full max-w-full overflow-hidden">
            {/* Left scroll button - professional design */}
            {showArrows && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 sm:left-2 top-[40px] sm:top-[48px] -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 shadow-xl rounded-full sm:rounded-none"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}

            {/* Scrollable container with padding for expansion */}
            <motion.div 
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-2"
              style={{ 
                scrollbarWidth: 'none' as any, 
                msOverflowStyle: 'none',
                marginTop: '8px',
                marginBottom: '8px',
                paddingLeft: activeCategories.length <= 5 ? '0' : '20px',
                paddingRight: activeCategories.length <= 5 ? '0' : '20px',
                justifyContent: activeCategories.length <= 5 ? 'center' : 'flex-start',
                width: '100%'
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Category items */}
              {activeCategories.map((category: any, index: number) => {
                const style = getCategoryStyle(category.name, index)
                
                return (
                  <motion.div 
                    key={category.id}
                    variants={itemVariants}
                  >
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="group flex flex-col items-center gap-3 cursor-pointer"
                    >
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-black dark:border-white flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
                          <img 
                            src={style.iconUrl} 
                            alt={category.name}
                            className="w-6 h-6 sm:w-8 sm:h-8 filter transition-all"
                            style={{ filter: 'grayscale(100%) contrast(1.5) brightness(0)' }}
                          />
                        </div>
                      </motion.div>
                      <span className="text-[10px] sm:text-xs font-bold text-black dark:text-white transition-colors text-center max-w-[60px] sm:max-w-[80px] uppercase line-clamp-2">
                        {category.name}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Right scroll button - professional design */}
            {showArrows && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 sm:right-2 top-[40px] sm:top-[48px] -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 shadow-xl rounded-full sm:rounded-none"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}