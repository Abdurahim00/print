"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchCategories, fetchSubcategories } from "@/lib/redux/slices/categoriesSlice"
import Link from "next/link"
import { ChevronDown, Grid3X3 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function CategoryMegaMenu() {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="hover:bg-primary hover:text-white transition-colors"
        >
          <Grid3X3 className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Categories' : 'Kategorier'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-[600px] max-h-[80vh] overflow-y-auto"
        align="start"
      >
        {/* All Products Link */}
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
          <Link href="/products" className="w-full font-semibold text-purple-600 dark:text-purple-400">
            <Grid3X3 className="mr-2 h-4 w-4" />
            {language === 'en' ? 'All Products' : 'Alla Produkter'}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 p-2">
          {activeCategories.map((category: any) => {
            const categorySubcategories = subcategories.filter(
              (sub: any) => sub.categoryId === category.id && sub.isActive
            )
            
            return (
              <div key={category.id} className="space-y-2">
                {/* Category Header */}
                <Link 
                  href={`/products?category=${category.slug}`}
                  className="block font-semibold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors pb-1 border-b border-gray-200 dark:border-gray-700"
                  onClick={() => setOpen(false)}
                >
                  {category.name}
                </Link>
                
                {/* Subcategories */}
                {categorySubcategories.length > 0 && (
                  <div className="space-y-1 pl-2">
                    {categorySubcategories.map((sub: any) => (
                      <Link
                        key={sub.id}
                        href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-1"
                        onClick={() => setOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {activeCategories.length === 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {language === 'en' ? 'No categories available' : 'Inga kategorier tillgängliga'}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}