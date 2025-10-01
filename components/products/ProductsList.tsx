import { getTranslations } from 'next-intl/server'
import { ProductCard } from './product-card'
import { getLocalizedProduct } from '@/lib/utils/translations'

interface ProductsListProps {
  products: any[]
  locale: string
}

export async function ProductsList({ products, locale }: ProductsListProps) {
  const t = await getTranslations('products')
  
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('noProductsFound')}</p>
        <p className="text-sm text-gray-400 mt-2">{t('adjustSearchFilter')}</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const localizedProduct = getLocalizedProduct(product, locale)
        return (
          <ProductCard
            key={product.id}
            product={localizedProduct}
          />
        )
      })}
    </div>
  )
}