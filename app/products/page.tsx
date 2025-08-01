"use client"

import { CardFooter } from "@/components/ui/card"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
import { translations, productCategories } from "@/lib/constants"
import { ProductCard } from "@/components/products/product-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const { items: products, loading } = useAppSelector((state) => state.products)
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "all" || p.categoryId === selectedCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">{t.browseOurCatalog}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder={t.searchProducts}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
        <div className="w-full md:w-2/3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t.productCategories} />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
  )
}
