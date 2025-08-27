"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchCategories, fetchSubcategories } from "@/lib/redux/slices/categoriesSlice"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"

// Minimalistic icon mapping using iconify CDN (similar to flaticon style)
const getCategoryIcon = (categoryName: string, index: number) => {
  const iconMap: { [key: string]: string } = {
    // Apparel
    'apparel': "https://api.iconify.design/tabler:shirt.svg",
    'clothing': "https://api.iconify.design/tabler:hanger.svg",
    't-shirt': "https://api.iconify.design/tabler:shirt.svg",
    'tshirt': "https://api.iconify.design/tabler:shirt.svg",
    'hoodie': "https://api.iconify.design/mdi:hoodie-outline.svg",
    
    // Print & Stationery
    'print': "https://api.iconify.design/tabler:printer.svg",
    'printing': "https://api.iconify.design/tabler:printer.svg",
    'sticker': "https://api.iconify.design/tabler:sticker.svg",
    'poster': "https://api.iconify.design/carbon:image.svg",
    'business': "https://api.iconify.design/tabler:briefcase.svg",
    'card': "https://api.iconify.design/tabler:id.svg",
    'document': "https://api.iconify.design/tabler:file-text.svg",
    'paper': "https://api.iconify.design/tabler:file.svg",
    
    // Promotional
    'promotional': "https://api.iconify.design/tabler:speakerphone.svg",
    'gift': "https://api.iconify.design/tabler:gift.svg",
    'trophy': "https://api.iconify.design/tabler:trophy.svg",
    'award': "https://api.iconify.design/tabler:award.svg",
    
    // Packaging
    'package': "https://api.iconify.design/tabler:package.svg",
    'packaging': "https://api.iconify.design/tabler:box.svg",
    'box': "https://api.iconify.design/carbon:box.svg",
    
    // Shopping
    'shop': "https://api.iconify.design/tabler:shopping-cart.svg",
    'retail': "https://api.iconify.design/tabler:building-store.svg",
    
    // Home & Living
    'home': "https://api.iconify.design/tabler:home.svg",
    'decor': "https://api.iconify.design/tabler:lamp.svg",
    'kitchen': "https://api.iconify.design/tabler:tools-kitchen-2.svg",
    
    // Accessories
    'bag': "https://api.iconify.design/tabler:shopping-bag.svg",
    'wallet': "https://api.iconify.design/tabler:wallet.svg",
    'watch': "https://api.iconify.design/mdi:watch.svg",
    
    // Events
    'event': "https://api.iconify.design/tabler:calendar-event.svg",
    'calendar': "https://api.iconify.design/tabler:calendar.svg",
    'party': "https://api.iconify.design/tabler:confetti.svg",
    'wedding': "https://api.iconify.design/tabler:heart.svg",
    'heart': "https://api.iconify.design/tabler:heart.svg",
    'love': "https://api.iconify.design/tabler:heart.svg",
    
    // Tech
    'tech': "https://api.iconify.design/tabler:cpu.svg",
    'electronic': "https://api.iconify.design/tabler:devices.svg",
    'phone': "https://api.iconify.design/tabler:device-mobile.svg",
    
    // Food & Drink
    'food': "https://api.iconify.design/tabler:meat.svg",
    'beverage': "https://api.iconify.design/tabler:glass-full.svg",
    'coffee': "https://api.iconify.design/tabler:coffee.svg",
    'mug': "https://api.iconify.design/tabler:mug.svg",
    
    // Sports & Outdoor
    'sport': "https://api.iconify.design/tabler:ball-football.svg",
    'outdoor': "https://api.iconify.design/tabler:tent.svg",
    'mountain': "https://api.iconify.design/tabler:mountain.svg",
    'travel': "https://api.iconify.design/tabler:plane.svg",
    
    // Creative
    'design': "https://api.iconify.design/tabler:palette.svg",
    'art': "https://api.iconify.design/tabler:brush.svg",
    'photo': "https://api.iconify.design/tabler:camera.svg",
    'photography': "https://api.iconify.design/tabler:capture.svg",
    'music': "https://api.iconify.design/tabler:music.svg",
    'audio': "https://api.iconify.design/tabler:headphones.svg",
    
    // Gaming
    'game': "https://api.iconify.design/tabler:device-gamepad.svg",
    'gaming': "https://api.iconify.design/mdi:controller.svg",
    
    // Vehicles
    'car': "https://api.iconify.design/tabler:car.svg",
    'vehicle': "https://api.iconify.design/mdi:car-side.svg",
    
    // Other
    'star': "https://api.iconify.design/tabler:star.svg",
    'premium': "https://api.iconify.design/tabler:crown.svg",
    'flag': "https://api.iconify.design/tabler:flag.svg",
    'banner': "https://api.iconify.design/tabler:flag.svg",
    'book': "https://api.iconify.design/tabler:book.svg",
    'publication': "https://api.iconify.design/tabler:news.svg",
    'special': "https://api.iconify.design/tabler:sparkles.svg",
    'eco': "https://api.iconify.design/tabler:recycle.svg",
    'luxury': "https://api.iconify.design/tabler:crown.svg",
    'custom': "https://api.iconify.design/tabler:wand.svg"
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
    "https://api.iconify.design/tabler:box.svg",
    "https://api.iconify.design/tabler:tag.svg",
    "https://api.iconify.design/tabler:shopping-cart.svg",
    "https://api.iconify.design/tabler:archive.svg",
    "https://api.iconify.design/tabler:cube.svg",
    "https://api.iconify.design/tabler:grid-dots.svg"
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
                                    href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
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