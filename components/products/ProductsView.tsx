"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
import { translations } from "@/lib/constants"
import { ProductCard } from "@/components/products/product-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchCategories, fetchSubcategories } from "@/lib/redux/slices/categoriesSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"

export function ProductsView({ categorySlug, subcategorySlug }: { categorySlug?: string; subcategorySlug?: string }) {
  const dispatch = useAppDispatch()
  const { items: products, loading } = useAppSelector((state) => state.products)
  const { language } = useAppSelector((state) => state.app)
  const sessionUser = useAppSelector((s: any) => s.auth.user)
  const t = translations[language]

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcats, setSelectedSubcats] = useState<string[]>([])
  const cats = useAppSelector((s: any) => s.categories.categories)
  const subs = useAppSelector((s: any) => s.categories.subcategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
    dispatch(fetchSubcategories())
  }, [dispatch])

  // Map slugs to IDs once categories/subcategories present
  useEffect(() => {
    if (categorySlug && cats.length > 0) {
      const cat = cats.find((c: any) => c.slug === categorySlug)
      if (cat) {
        setSelectedCategories([cat.id])
        // If subcategory slug, set that too
        if (subcategorySlug && subs.length > 0) {
          const sub = subs.find((s: any) => s.slug === subcategorySlug && s.categoryId === cat.id)
          if (sub) setSelectedSubcats([sub.id])
        }
      }
    }
  }, [categorySlug, subcategorySlug, cats, subs])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (selectedSubcats.length > 0) {
        const subIds = p.subcategoryIds || []
        return selectedSubcats.some((id) => subIds.includes(id))
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.categoryId)) return false
      return true
    })
  }, [products, searchTerm, selectedCategories, selectedSubcats])

  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedSubcats([])
  }

  const toggleCategory = (id: string, checked: boolean) => {
    const next = new Set(selectedCategories)
    if (checked) next.add(id)
    else next.delete(id)
    setSelectedCategories(Array.from(next))
    if (!checked) {
      // Remove all subcategories under this category when unchecking
      const toRemove = subs.filter((s: any) => s.categoryId === id).map((s: any) => s.id)
      setSelectedSubcats((prev) => prev.filter((sid) => !toRemove.includes(sid)))
    }
  }

  const toggleSubcategory = (id: string, checked: boolean) => {
    const next = new Set(selectedSubcats)
    if (checked) next.add(id)
    else next.delete(id)
    setSelectedSubcats(Array.from(next))
  }

  const SidebarFilters = (
    <div className="p-4 space-y-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <h4 className="font-semibold">Categories</h4>
          <button className="text-sm text-sky-700" onClick={resetFilters}>Reset filters</button>
        </div>
        
        {(selectedCategories.length > 0 || selectedSubcats.length > 0) && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((cid) => (
              <Badge key={cid} variant="secondary">
                {cats.find((c: any) => c.id === cid)?.name}
                <button className="ml-1" onClick={() => toggleCategory(cid, false)}>×</button>
              </Badge>
            ))}
            {selectedSubcats.map((id) => (
              <Badge key={id} variant="secondary">
                {subs.find((s: any) => s.id === id)?.name}
                <button className="ml-1" onClick={() => toggleSubcategory(id, false)}>×</button>
              </Badge>
            ))}
          </div>
         
        </div>
      )}
      </div>
      <div>
        <div className=" max-h-[420px] overflow-auto">
          {cats.map((c: any) => {
            const isChecked = selectedCategories.includes(c.id)
            const catSubcats = subs.filter((s: any) => s.categoryId === c.id)
            return (
              <div key={c.id} className="group rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(v) => toggleCategory(c.id, Boolean(v))}
                    className="data-[state=checked]:bg-[#7a5ec7] data-[state=checked]:border-[#7a5ec7]"
                  />
                  <span className="font-medium">{c.name}</span>
                </label>
                {isChecked && catSubcats.length > 0 && (
                  <div className="mt-2 ml-6 pl-3 border-l border-slate-200 dark:border-slate-700 ">
                    {catSubcats.map((s: any) => (
                      <label key={s.id} className="flex items-center gap-3 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                        <Checkbox
                          checked={selectedSubcats.includes(s.id)}
                          onCheckedChange={(v) => toggleSubcategory(s.id, Boolean(v))}
                          className="data-[state=checked]:bg-[#7a5ec7] data-[state=checked]:border-[#7a5ec7]"
                        />
                        {s.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

     
    </div>
  )

  const ProductCardSkeleton = () => (
    <Card className="overflow-hidden shadow-lg flex flex-col">
      <Skeleton className="w-full aspect-[4/3] rounded-t-lg" />
      <CardContent className="p-4 flex-grow flex flex-col space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full flex-grow" />
      </CardContent>
      <CardFooter className="p-4 border-t dark:border-slate-700">
        <Skeleton className="w-full h-10" />
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{t.products}</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">{t.viewProducts}</p>
      </div>

      <div className="flex gap-6">
        {/* Left Filter Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <Card className="sticky top-24">{SidebarFilters}</Card>
        </aside>

        {/* Right content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-full md:w-1/2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder={t.searchProducts}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10"
              />
            </div>
            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline">Filters</Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  {SidebarFilters}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-10">{t.noProductsFound}</p>
          )}
        </div>
      </div>
    </div>
  )
}


