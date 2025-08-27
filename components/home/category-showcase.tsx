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
    't-shirt': { iconUrl: "https://api.iconify.design/tabler:shirt.svg", gradient: "from-gray-50 to-white" },
    'apparel': { iconUrl: "https://api.iconify.design/tabler:hanger.svg", gradient: "from-gray-50 to-white" },
    'clothing': { iconUrl: "https://api.iconify.design/carbon:clothes-rack.svg", gradient: "from-gray-50 to-white" },
    'hoodie': { iconUrl: "https://api.iconify.design/mdi:hoodie-outline.svg", gradient: "from-gray-50 to-white" },
    'cap': { iconUrl: "https://api.iconify.design/mdi:hat-fedora.svg", gradient: "from-gray-50 to-white" },
    
    // Drinkware
    'mug': { iconUrl: "https://api.iconify.design/tabler:mug.svg", gradient: "from-gray-50 to-white" },
    'drinkware': { iconUrl: "https://api.iconify.design/tabler:cup.svg", gradient: "from-gray-50 to-white" },
    'bottle': { iconUrl: "https://api.iconify.design/tabler:bottle.svg", gradient: "from-gray-50 to-white" },
    'tumbler': { iconUrl: "https://api.iconify.design/mdi:tumbler-glass.svg", gradient: "from-gray-50 to-white" },
    
    // Bags & Accessories  
    'bag': { iconUrl: "https://api.iconify.design/tabler:shopping-bag.svg", gradient: "from-gray-50 to-white" },
    'tote': { iconUrl: "https://api.iconify.design/carbon:shopping-bag.svg", gradient: "from-gray-50 to-white" },
    'backpack': { iconUrl: "https://api.iconify.design/tabler:backpack.svg", gradient: "from-gray-50 to-white" },
    'wallet': { iconUrl: "https://api.iconify.design/tabler:wallet.svg", gradient: "from-gray-50 to-white" },
    
    // Accessories
    'watch': { iconUrl: "https://api.iconify.design/mdi:watch.svg", gradient: "from-gray-50 to-white" },
    'jewelry': { iconUrl: "https://api.iconify.design/tabler:diamond.svg", gradient: "from-gray-50 to-white" },
    'accessories': { iconUrl: "https://api.iconify.design/carbon:badge.svg", gradient: "from-gray-50 to-white" },
    'sunglasses': { iconUrl: "https://api.iconify.design/mdi:sunglasses.svg", gradient: "from-gray-50 to-white" },
    
    // Print Products
    'sticker': { iconUrl: "https://api.iconify.design/tabler:sticker.svg", gradient: "from-gray-50 to-white" },
    'print': { iconUrl: "https://api.iconify.design/tabler:printer.svg", gradient: "from-gray-50 to-white" },
    'poster': { iconUrl: "https://api.iconify.design/carbon:image.svg", gradient: "from-gray-50 to-white" },
    'business card': { iconUrl: "https://api.iconify.design/tabler:id.svg", gradient: "from-gray-50 to-white" },
    'card': { iconUrl: "https://api.iconify.design/tabler:credit-card.svg", gradient: "from-gray-50 to-white" },
    'flyer': { iconUrl: "https://api.iconify.design/tabler:file-text.svg", gradient: "from-gray-50 to-white" },
    'banner': { iconUrl: "https://api.iconify.design/tabler:flag.svg", gradient: "from-gray-50 to-white" },
    'calendar': { iconUrl: "https://api.iconify.design/tabler:calendar.svg", gradient: "from-gray-50 to-white" },
    'label': { iconUrl: "https://api.iconify.design/tabler:tag.svg", gradient: "from-gray-50 to-white" },
    
    // Office & Stationery
    'office': { iconUrl: "https://api.iconify.design/tabler:briefcase.svg", gradient: "from-gray-50 to-white" },
    'notebook': { iconUrl: "https://api.iconify.design/tabler:notebook.svg", gradient: "from-gray-50 to-white" },
    'pen': { iconUrl: "https://api.iconify.design/tabler:pencil.svg", gradient: "from-gray-50 to-white" },
    'document': { iconUrl: "https://api.iconify.design/tabler:file.svg", gradient: "from-gray-50 to-white" },
    'folder': { iconUrl: "https://api.iconify.design/tabler:folder.svg", gradient: "from-gray-50 to-white" },
    
    // Tech & Electronics
    'phone': { iconUrl: "https://api.iconify.design/tabler:device-mobile.svg", gradient: "from-gray-50 to-white" },
    'tech': { iconUrl: "https://api.iconify.design/tabler:cpu.svg", gradient: "from-gray-50 to-white" },
    'electronic': { iconUrl: "https://api.iconify.design/tabler:devices.svg", gradient: "from-gray-50 to-white" },
    'headphone': { iconUrl: "https://api.iconify.design/tabler:headphones.svg", gradient: "from-gray-50 to-white" },
    'speaker': { iconUrl: "https://api.iconify.design/tabler:speakerphone.svg", gradient: "from-gray-50 to-white" },
    'mouse': { iconUrl: "https://api.iconify.design/tabler:mouse.svg", gradient: "from-gray-50 to-white" },
    'keyboard': { iconUrl: "https://api.iconify.design/tabler:keyboard.svg", gradient: "from-gray-50 to-white" },
    'usb': { iconUrl: "https://api.iconify.design/mdi:usb.svg", gradient: "from-gray-50 to-white" },
    
    // Home & Living
    'home': { iconUrl: "https://api.iconify.design/tabler:home.svg", gradient: "from-gray-50 to-white" },
    'decor': { iconUrl: "https://api.iconify.design/tabler:lamp.svg", gradient: "from-gray-50 to-white" },
    'kitchen': { iconUrl: "https://api.iconify.design/tabler:tools-kitchen-2.svg", gradient: "from-gray-50 to-white" },
    'pillow': { iconUrl: "https://api.iconify.design/mdi:bed-outline.svg", gradient: "from-gray-50 to-white" },
    'towel': { iconUrl: "https://api.iconify.design/mdi:paper-roll-outline.svg", gradient: "from-gray-50 to-white" },
    'candle': { iconUrl: "https://api.iconify.design/tabler:candle.svg", gradient: "from-gray-50 to-white" },
    
    // Promotional & Gifts
    'gift': { iconUrl: "https://api.iconify.design/tabler:gift.svg", gradient: "from-gray-50 to-white" },
    'promotional': { iconUrl: "https://api.iconify.design/tabler:speakerphone.svg", gradient: "from-gray-50 to-white" },
    'award': { iconUrl: "https://api.iconify.design/tabler:award.svg", gradient: "from-gray-50 to-white" },
    'trophy': { iconUrl: "https://api.iconify.design/tabler:trophy.svg", gradient: "from-gray-50 to-white" },
    'medal': { iconUrl: "https://api.iconify.design/tabler:medal.svg", gradient: "from-gray-50 to-white" },
    
    // Packaging & Shipping
    'package': { iconUrl: "https://api.iconify.design/tabler:package.svg", gradient: "from-gray-50 to-white" },
    'packaging': { iconUrl: "https://api.iconify.design/tabler:box.svg", gradient: "from-gray-50 to-white" },
    'box': { iconUrl: "https://api.iconify.design/carbon:box.svg", gradient: "from-gray-50 to-white" },
    'envelope': { iconUrl: "https://api.iconify.design/tabler:mail.svg", gradient: "from-gray-50 to-white" },
    
    // Events & Occasions
    'party': { iconUrl: "https://api.iconify.design/tabler:confetti.svg", gradient: "from-gray-50 to-white" },
    'event': { iconUrl: "https://api.iconify.design/tabler:calendar-event.svg", gradient: "from-gray-50 to-white" },
    'wedding': { iconUrl: "https://api.iconify.design/tabler:heart.svg", gradient: "from-gray-50 to-white" },
    'birthday': { iconUrl: "https://api.iconify.design/tabler:cake.svg", gradient: "from-gray-50 to-white" },
    'graduation': { iconUrl: "https://api.iconify.design/tabler:school.svg", gradient: "from-gray-50 to-white" },
    'baby': { iconUrl: "https://api.iconify.design/mdi:baby-carriage.svg", gradient: "from-gray-50 to-white" },
    'christmas': { iconUrl: "https://api.iconify.design/tabler:christmas-tree.svg", gradient: "from-gray-50 to-white" },
    
    // Sports & Outdoor
    'sport': { iconUrl: "https://api.iconify.design/tabler:ball-football.svg", gradient: "from-gray-50 to-white" },
    'gym': { iconUrl: "https://api.iconify.design/tabler:barbell.svg", gradient: "from-gray-50 to-white" },
    'fitness': { iconUrl: "https://api.iconify.design/tabler:run.svg", gradient: "from-gray-50 to-white" },
    'yoga': { iconUrl: "https://api.iconify.design/mdi:yoga.svg", gradient: "from-gray-50 to-white" },
    'outdoor': { iconUrl: "https://api.iconify.design/tabler:tent.svg", gradient: "from-gray-50 to-white" },
    'camping': { iconUrl: "https://api.iconify.design/tabler:campfire.svg", gradient: "from-gray-50 to-white" },
    'travel': { iconUrl: "https://api.iconify.design/tabler:plane.svg", gradient: "from-gray-50 to-white" },
    'beach': { iconUrl: "https://api.iconify.design/tabler:beach.svg", gradient: "from-gray-50 to-white" },
    
    // Food & Beverage
    'food': { iconUrl: "https://api.iconify.design/tabler:meat.svg", gradient: "from-gray-50 to-white" },
    'beverage': { iconUrl: "https://api.iconify.design/tabler:glass-full.svg", gradient: "from-gray-50 to-white" },
    'restaurant': { iconUrl: "https://api.iconify.design/tabler:tools-kitchen.svg", gradient: "from-gray-50 to-white" },
    'coffee': { iconUrl: "https://api.iconify.design/tabler:coffee.svg", gradient: "from-gray-50 to-white" },
    
    // Other Categories
    'kid': { iconUrl: "https://api.iconify.design/tabler:baby-bottle.svg", gradient: "from-gray-50 to-white" },
    'children': { iconUrl: "https://api.iconify.design/mdi:teddy-bear.svg", gradient: "from-gray-50 to-white" },
    'toy': { iconUrl: "https://api.iconify.design/tabler:horse-toy.svg", gradient: "from-gray-50 to-white" },
    'game': { iconUrl: "https://api.iconify.design/tabler:device-gamepad.svg", gradient: "from-gray-50 to-white" },
    'gaming': { iconUrl: "https://api.iconify.design/mdi:controller.svg", gradient: "from-gray-50 to-white" },
    'health': { iconUrl: "https://api.iconify.design/tabler:heartbeat.svg", gradient: "from-gray-50 to-white" },
    'medical': { iconUrl: "https://api.iconify.design/tabler:stethoscope.svg", gradient: "from-gray-50 to-white" },
    'beauty': { iconUrl: "https://api.iconify.design/mdi:lipstick.svg", gradient: "from-gray-50 to-white" },
    'spa': { iconUrl: "https://api.iconify.design/tabler:flower.svg", gradient: "from-gray-50 to-white" },
    'car': { iconUrl: "https://api.iconify.design/tabler:car.svg", gradient: "from-gray-50 to-white" },
    'vehicle': { iconUrl: "https://api.iconify.design/mdi:car-side.svg", gradient: "from-gray-50 to-white" },
    'music': { iconUrl: "https://api.iconify.design/tabler:music.svg", gradient: "from-gray-50 to-white" },
    'art': { iconUrl: "https://api.iconify.design/tabler:palette.svg", gradient: "from-gray-50 to-white" },
    'design': { iconUrl: "https://api.iconify.design/tabler:brush.svg", gradient: "from-gray-50 to-white" },
    'photo': { iconUrl: "https://api.iconify.design/tabler:camera.svg", gradient: "from-gray-50 to-white" },
    'photography': { iconUrl: "https://api.iconify.design/tabler:capture.svg", gradient: "from-gray-50 to-white" },
    'marketing': { iconUrl: "https://api.iconify.design/tabler:chart-line.svg", gradient: "from-gray-50 to-white" },
    'business': { iconUrl: "https://api.iconify.design/tabler:building-skyscraper.svg", gradient: "from-gray-50 to-white" },
    'custom': { iconUrl: "https://api.iconify.design/tabler:wand.svg", gradient: "from-gray-50 to-white" },
    'eco': { iconUrl: "https://api.iconify.design/tabler:recycle.svg", gradient: "from-gray-50 to-white" },
    'sustainable': { iconUrl: "https://api.iconify.design/tabler:leaf.svg", gradient: "from-gray-50 to-white" },
    'luxury': { iconUrl: "https://api.iconify.design/tabler:crown.svg", gradient: "from-gray-50 to-white" },
    'premium': { iconUrl: "https://api.iconify.design/tabler:star.svg", gradient: "from-gray-50 to-white" },
    'team': { iconUrl: "https://api.iconify.design/tabler:users.svg", gradient: "from-gray-50 to-white" },
    'corporate': { iconUrl: "https://api.iconify.design/tabler:building.svg", gradient: "from-gray-50 to-white" },
    'pet': { iconUrl: "https://api.iconify.design/tabler:paw.svg", gradient: "from-gray-50 to-white" },
    'animal': { iconUrl: "https://api.iconify.design/mdi:dog.svg", gradient: "from-gray-50 to-white" },
    'nature': { iconUrl: "https://api.iconify.design/tabler:plant.svg", gradient: "from-gray-50 to-white" },
    'craft': { iconUrl: "https://api.iconify.design/tabler:scissors.svg", gradient: "from-gray-50 to-white" },
    'diy': { iconUrl: "https://api.iconify.design/tabler:hammer.svg", gradient: "from-gray-50 to-white" },
    'tool': { iconUrl: "https://api.iconify.design/tabler:tool.svg", gradient: "from-gray-50 to-white" },
  }
  
  // Additional fallback icons - minimalistic generic icons
  const fallbackIcons = [
    "https://api.iconify.design/tabler:box.svg",
    "https://api.iconify.design/tabler:tag.svg",
    "https://api.iconify.design/tabler:shopping-cart.svg",
    "https://api.iconify.design/tabler:basket.svg",
    "https://api.iconify.design/tabler:archive.svg",
    "https://api.iconify.design/tabler:cube.svg",
    "https://api.iconify.design/tabler:grid-dots.svg",
    "https://api.iconify.design/tabler:circle.svg",
    "https://api.iconify.design/tabler:square.svg",
    "https://api.iconify.design/tabler:hexagon.svg"
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
    return { iconUrl: "https://api.iconify.design/tabler:box.svg", gradient: "from-gray-50 to-white" }
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
          <div className="flex items-center justify-center">
            {/* Left scroll button - professional design */}
            {showArrows && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-[48px] -translate-y-1/2 z-10 w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-xl"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Scrollable container with padding for expansion */}
            <motion.div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-2 mx-auto"
              style={{ 
                scrollbarWidth: 'none' as any, 
                msOverflowStyle: 'none',
                marginTop: '8px',
                marginBottom: '8px',
                paddingLeft: showArrows ? '60px' : '0',
                paddingRight: showArrows ? '60px' : '0'
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
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-black dark:border-white flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300">
                          <img 
                            src={style.iconUrl} 
                            alt={category.name}
                            className="w-8 h-8 filter transition-all"
                            style={{ filter: 'grayscale(100%) contrast(1.5) brightness(0)' }}
                          />
                        </div>
                      </motion.div>
                      <span className="text-xs font-bold text-black dark:text-white transition-colors text-center max-w-[80px] uppercase">
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
                className="absolute right-2 top-[48px] -translate-y-1/2 z-10 w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-xl"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}