"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchCategories, fetchSubcategories } from "@/lib/redux/slices/categoriesSlice"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"

// Minimalistic icon mapping using reliable CDN (fallback for iconify)
const getCategoryIcon = (categoryName: string, index: number) => {
  const iconMap: { [key: string]: string } = {
    // Apparel
    'apparel': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shirt.svg",
    'clothing': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shirt.svg",
    't-shirt': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shirt.svg",
    'tshirt': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shirt.svg",
    'hoodie': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shirt.svg",
    
    // Print & Stationery
    'print': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/printer.svg",
    'printing': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/printer.svg",
    'sticker': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/sticker.svg",
    'poster': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/image.svg",
    'business': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/briefcase.svg",
    'card': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/id-card.svg",
    'document': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/file-text.svg",
    'paper': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/file.svg",

    // Promotional
    'promotional': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/megaphone.svg",
    'gift': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/gift.svg",
    'trophy': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/trophy.svg",
    'award': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/award.svg",

    // Packaging
    'package': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/package.svg",
    'packaging': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/box.svg",
    'box': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/box.svg",

    // Shopping
    'shop': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shopping-cart.svg",
    'retail': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/store.svg",

    // Home & Living
    'home': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/home.svg",
    'decor': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/lamp.svg",
    'kitchen': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/chef-hat.svg",

    // Accessories
    'bag': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shopping-bag.svg",
    'wallet': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/wallet.svg",
    'watch': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/watch.svg",

    // Events
    'event': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/calendar.svg",
    'calendar': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/calendar.svg",
    'party': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/party-popper.svg",
    'wedding': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/heart.svg",
    'heart': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/heart.svg",
    'love': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/heart.svg",

    // Tech
    'tech': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/cpu.svg",
    'electronic': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/monitor.svg",
    'phone': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/smartphone.svg",

    // Food & Drink
    'food': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/utensils.svg",
    'beverage': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/glass-water.svg",
    'coffee': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/coffee.svg",
    'mug': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/coffee.svg",

    // Sports & Outdoor
    'sport': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/football.svg",
    'outdoor': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/tent.svg",
    'mountain': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/mountain.svg",
    'travel': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/plane.svg",

    // Creative
    'design': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/palette.svg",
    'art': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/brush.svg",
    'photo': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/camera.svg",
    'photography': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/camera.svg",
    'music': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/music.svg",
    'audio': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/headphones.svg",

    // Gaming
    'game': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/gamepad.svg",
    'gaming': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/gamepad.svg",

    // Vehicles
    'car': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/car.svg",
    'vehicle': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/car.svg",

    // Other
    'star': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/star.svg",
    'premium': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/crown.svg",
    'flag': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/flag.svg",
    'banner': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/flag.svg",
    'book': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/book.svg",
    'publication': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/newspaper.svg",
    'special': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/sparkles.svg",
    'eco': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/recycle.svg",
    'luxury': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/crown.svg",
    'custom': "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/wand.svg"
  }
  
  // Try to match category name with icon map
  const lowerName = categoryName.toLowerCase()
  for (const [key, iconUrl] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) {
      return iconUrl
    }
  }
  
  // Fallback icons - minimalistic generic icons
  const fallbackIcons = [
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/box.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/tag.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/shopping-cart.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/archive.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/cube.svg",
    "https://cdn.jsdelivr.net/npm/lucide-static@0.446.0/icons/grid.svg"
  ]
  
  return fallbackIcons[index % fallbackIcons.length]
}

export function CategoryDropdown() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state: any) => state.categories.categories)
  const subcategories = useAppSelector((state: any) => state.categories.subcategories)
  const { language } = useAppSelector((state) => state.app)

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
    if (subcategories.length === 0) {
      dispatch(fetchSubcategories())
    }
  }, [dispatch, categories.length, subcategories.length])

  const activeCategories = categories.filter((cat: any) => cat.isActive)

  return (
    <NavigationMenu.Root className="relative">
      <NavigationMenu.List className="flex">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group inline-flex items-center justify-center px-4 py-2 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors outline-none select-none">
            <span className="text-black dark:text-white uppercase tracking-wider">
              {language === 'en' ? 'Categories' : 'Kategorier'}
            </span>
            <ChevronDown 
              className="ml-2 h-4 w-4 text-black dark:text-white transition-transform duration-200 group-data-[state=open]:rotate-180" 
              aria-hidden 
            />
          </NavigationMenu.Trigger>
          
          <NavigationMenu.Content className="absolute left-0 top-full mt-2 w-[800px] z-50">
            <div className="bg-white dark:bg-gray-900 shadow-2xl border-2 border-black dark:border-white p-6">
              {/* Categories Circular Grid */}
              <div className="grid grid-cols-6 gap-6">
                {activeCategories.length > 0 ? (
                  activeCategories.map((category: any, index: number) => {
                    const iconUrl = getCategoryIcon(category.name, index)
                    const categorySubcategories = subcategories.filter(
                      (sub: any) => sub.categoryId === category.id && sub.isActive
                    )
                    
                    return (
                      <div key={category.id} className="group relative">
                        {/* Circular Category Button */}
                        <Link 
                          href={`/products?category=${category.slug}`}
                          className="flex flex-col items-center space-y-2 transition-all duration-200"
                        >
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-2 border-black dark:border-white flex items-center justify-center group-hover:scale-110 transition-all duration-200 shadow-md group-hover:shadow-xl">
                              <img 
                                src={iconUrl} 
                                alt={category.name}
                                className="w-8 h-8 transition-all"
                                style={{ filter: 'brightness(0)' }}
                              />
                            </div>
                            {categorySubcategories.length > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-xs font-bold">
                                {categorySubcategories.length}
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center uppercase max-w-[80px] line-clamp-2">
                            {category.name}
                          </span>
                        </Link>
                        
                        {/* Hover Tooltip with Subcategories */}
                        {categorySubcategories.length > 0 && (
                          <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3">
                            <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                              {category.name}
                            </div>
                            <ul className="space-y-1">
                              {categorySubcategories.slice(0, 5).map((sub: any) => (
                                <li key={sub.id}>
                                  <Link
                                    href={`/products/${category.slug}/${sub.slug}`}
                                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:font-bold transition-all block py-1"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                              {categorySubcategories.length > 5 && (
                                <li>
                                  <Link
                                    href={`/products?category=${category.slug}`}
                                    className="text-xs text-black dark:text-white hover:underline transition-all block py-1 font-bold"
                                  >
                                    {language === 'en' ? `+${categorySubcategories.length - 5} more` : `+${categorySubcategories.length - 5} mer`}
                                  </Link>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-6 text-center py-8 text-gray-500 dark:text-gray-400">
                    {language === 'en' ? 'No categories available' : 'Inga kategorier tillgängliga'}
                  </div>
                )}
              </div>
              
              {/* View All Link */}
              {activeCategories.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    href="/products" 
                    className="inline-flex items-center text-black dark:text-white font-bold uppercase tracking-wider hover:underline transition-all"
                  >
                    {language === 'en' ? 'View All Products' : 'Visa Alla Produkter'}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      
    </NavigationMenu.Root>
  )
}