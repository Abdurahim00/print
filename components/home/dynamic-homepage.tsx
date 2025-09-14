"use client"

import React, { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { getProductImage } from "@/lib/utils/product-image"
import { getOptimizedImageUrl, generateImageSizes, blurDataURL } from "@/lib/utils/image-optimizer"
import { toast } from "sonner"
import { useCurrency } from "@/contexts/CurrencyContext"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Palette,
  Package,
  Star,
  Sparkles,
  Zap,
  ShoppingBag,
  Truck,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  MousePointer,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Layers,
  LucideIcon,
  ShoppingCart,
  Eye
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useTranslations } from "next-intl"

// Map icon types to actual icons
const iconMap: Record<string, LucideIcon> = {
  Zap,
  Shield,
  Truck,
  Users,
  Star,
  Package,
  Clock,
  Sparkles,
  ShoppingBag,
  Rocket,
  Layers
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
}

const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

interface SiteConfiguration {
  heroHeadline: {
    line1: string
    line2: string
    subtitle: string
  }
  stats: Array<{
    id: string
    value: number
    suffix: string
    label: string
    duration: number
  }>
  features: Array<{
    id: string
    iconType: string
    title: string
    description: string
  }>
  featuredProducts: Array<{
    productId: string
    order: number
    badge?: string
    badgeColor?: string
  }>
  bestSellers: Array<{
    productId: string
    order: number
  }>
  customSections: Array<{
    id: string
    title: string
    subtitle: string
    products: Array<{
      productId: string
      order: number
    }>
    enabled: boolean
    order: number
  }>
  ctaSection: {
    headline: string
    subtitle: string
    primaryButtonText: string
    primaryButtonLink: string
    secondaryButtonText: string
    secondaryButtonLink: string
  }
  bestSellersTitle: string
  bestSellersSubtitle: string
  featuresTitle: string
}

// Product Carousel Component
const ProductCarousel = ({ featuredProducts }: { featuredProducts: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const { items: reduxProducts = [] } = useAppSelector((state) => state.products)
  const t = useTranslations()
  
  // Use featured products if available, otherwise use redux products or mock data
  const mockProducts = [
    {
      id: 1,
      _id: "1",
      name: "Premium T-Shirt Collection",
      price: 24.99,
      basePrice: 24.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
    },
    {
      id: 2,
      _id: "2",
      name: "Business Card Package",
      price: 39.99,
      basePrice: 39.99,
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
      colors: ["#F0F0F0", "#2C3E50", "#E74C3C", "#3498DB"],
    },
    {
      id: 3,
      _id: "3",
      name: "Custom Hoodies",
      price: 45.99,
      basePrice: 45.99,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      colors: ["#34495E", "#95A5A6", "#E67E22", "#27AE60"],
    },
    {
      id: 4,
      _id: "4",
      name: "Sticker Pack",
      price: 12.99,
      basePrice: 12.99,
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
      colors: ["#9B59B6", "#F39C12", "#1ABC9C", "#C0392B"],
    },
    {
      id: 5,
      _id: "5",
      name: "Custom Mugs",
      price: 15.99,
      basePrice: 15.99,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
      colors: ["#FFFFFF", "#2C3E50", "#E74C3C", "#F39C12"],
    }
  ]
  
  const products = featuredProducts.length > 0 ? featuredProducts : 
                  reduxProducts.length > 0 ? reduxProducts.slice(0, 5) : 
                  mockProducts
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, products.length])
  
  const currentProduct = products[currentIndex]
  
  if (!currentProduct) return null
  
  return (
    <div className="relative w-full h-full min-h-[350px] sm:min-h-[500px] lg:min-h-[600px] overflow-hidden bg-white dark:bg-gray-900">
      <div className="relative h-full flex flex-col p-4 sm:p-4 lg:p-8 xl:p-12">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <motion.h3
            className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {t('homepage.featuredProducts')}
          </motion.h3>
          <motion.p
            className="text-gray-600 dark:text-gray-300 text-xs sm:text-base lg:text-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {t('homepage.browseCollection')}
          </motion.p>
        </div>
        
        <div className="flex-1 flex items-center justify-center mb-12 sm:mb-16 lg:mb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id || currentProduct._id}
              className="w-full max-w-xs sm:max-w-lg lg:max-w-xl xl:max-w-2xl px-2 sm:px-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {currentProduct.type === 'collection' ? (
                // Render collection card
                <div
                  onClick={() => router.push(`/products?collection=${currentProduct.id}`)}
                  className="block relative h-48 sm:h-64 lg:h-80 xl:h-96 mb-4 sm:mb-4 lg:mb-6 overflow-hidden bg-white dark:bg-gray-900 cursor-pointer group rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg sm:border-2 sm:border-black sm:dark:border-white"
                >
                  {/* Collection preview grid */}
                  <div className="absolute inset-0 p-4 grid grid-cols-2 gap-2">
                    {currentProduct.products?.slice(0, 4).map((product: any, idx: number) => (
                      <div key={idx} className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                        {product.image ? (
                          <Image
                            src={getProductImage(product)}
                            alt=""
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Collection overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <Badge className="mb-2 bg-black text-white dark:bg-white dark:text-black">
                      <Layers className="h-3 w-3 mr-1" />
                      {t('homepage.collectionProducts', { count: currentProduct.products?.length || 0 })}
                    </Badge>
                    <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl">
                      {currentProduct.name}
                    </h3>
                    {currentProduct.description && (
                      <p className="text-white/80 text-sm mt-1 line-clamp-2">
                        {currentProduct.description}
                      </p>
                    )}
                  </div>

                  {currentProduct.badge && (
                    <div className={`absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1 text-xs font-bold uppercase ${currentProduct.badgeColor || 'bg-black text-white'}`}>
                      {currentProduct.badge}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-lg sm:text-xl font-bold uppercase">{t('homepage.viewCollection')}</span>
                  </div>
                </div>
              ) : (
                // Render single product
                <Link href={`/product/${currentProduct._id || currentProduct.id}`} className="block relative h-40 sm:h-64 lg:h-80 xl:h-96 mb-3 sm:mb-4 lg:mb-6 overflow-hidden bg-black dark:bg-white cursor-pointer group">
                  <Image
                    src={getOptimizedImageUrl(getProductImage(currentProduct))}
                    alt={currentProduct.name}
                    fill
                    sizes={generateImageSizes('hero')}
                    className="object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity bg-white"
                    priority
                    quality={90}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                  />

                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 lg:bottom-6 lg:left-6">
                    <div className="bg-white text-black px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2">
                      <span className="text-sm sm:text-xl lg:text-2xl xl:text-3xl font-black">
                        {formatPrice(currentProduct.price || currentProduct.basePrice || 0)}
                      </span>
                    </div>
                    <div className="h-0.5 sm:h-1 bg-black" />
                  </div>

                  {currentProduct.badge && (
                    <div className={`absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1 text-xs font-bold uppercase ${currentProduct.badgeColor || 'bg-black text-white'}`}>
                      {currentProduct.badge}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-lg sm:text-xl font-bold uppercase">{t('homepage.viewProduct')}</span>
                  </div>
                </Link>
              )}
              
              <div className="text-center px-2">
                <h4 className="text-base sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4 lg:mb-6 cursor-pointer line-clamp-2">
                  {currentProduct.name}
                </h4>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {currentProduct.type === 'collection' ? (
                    // Collection buttons
                    <>
                      <Button
                        size="lg"
                        className="flex-1 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 min-h-[40px] sm:min-h-[44px] touch-manipulation text-xs sm:text-sm lg:text-base px-2 sm:px-4"
                        onClick={() => router.push(`/products?collection=${currentProduct.id}`)}
                      >
                        <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="font-black uppercase">{t('homepage.viewCollection')}</span>
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1 shadow-md sm:border-2 sm:border-black sm:dark:border-white bg-gray-100 dark:bg-gray-800 sm:bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm lg:text-base px-2 sm:px-4"
                        onClick={() => router.push('/products')}
                      >
                        <Package className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="font-black uppercase">{t('homepage.allProducts')}</span>
                      </Button>
                    </>
                  ) : (
                    // Single product buttons
                    <>
                      <Button
                        size="lg"
                        className="flex-1 bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 min-h-[40px] sm:min-h-[44px] touch-manipulation text-xs sm:text-sm lg:text-base px-2 sm:px-4"
                        asChild
                      >
                        <Link href={`/product/${currentProduct._id || currentProduct.id}`} className="flex items-center justify-center">
                          <span className="font-black uppercase">{t('homepage.view')}</span>
                          <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1 shadow-md sm:border-2 sm:border-black sm:dark:border-white bg-white dark:bg-gray-800 sm:bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors min-h-[44px] sm:min-h-[44px] text-sm sm:text-sm lg:text-base px-3 sm:px-4"
                        onClick={() => {
                          dispatch(addToCart(currentProduct))
                          toast.success(t('homepage.addedToCart'))
                        }}
                      >
                        <ShoppingCart className="mr-1 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                        <span className="font-black uppercase">{t('homepage.addToCart')}</span>
                      </Button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-2 sm:bottom-6 lg:bottom-8 xl:bottom-12 left-3 right-3 sm:left-4 sm:right-4 lg:left-8 lg:right-8 xl:left-16 xl:right-16">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <motion.button
              onClick={prevSlide}
              className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-transform rounded-full flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            </motion.button>

            <div className="flex gap-1 sm:gap-1.5 lg:gap-2 px-2">
              {products.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 sm:h-2 transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-4 sm:w-6 lg:w-8 bg-black dark:bg-white'
                      : 'w-1.5 sm:w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  } rounded-full`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextSlide}
              className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-transform rounded-full flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Animated Stats Component
const AnimatedStats = ({ stats, currentLocale }: { stats: SiteConfiguration['stats'], currentLocale: string }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState(stats.map(() => 0))
  
  useEffect(() => {
    setIsVisible(true)
    
    stats.forEach((stat, index) => {
      const duration = stat.duration * 1000
      const steps = 50
      const increment = stat.value / steps
      let current = 0
      
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          current += increment
          if (current >= stat.value) {
            current = stat.value
            clearInterval(interval)
          }
          setCounts(prev => {
            const newCounts = [...prev]
            newCounts[index] = Math.floor(current)
            return newCounts
          })
        }, duration / steps)
      }, index * 200)
      
      return () => clearTimeout(timer)
    })
  }, [stats])
  
  return (
    <div className="relative w-full py-4 sm:py-6 lg:py-8 xl:py-12">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-6 xl:gap-8 max-w-5xl mx-auto px-3 sm:px-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.15,
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            <div className="relative p-2 sm:p-4 lg:p-5 xl:p-6 text-center">
              <div className="hidden sm:flex justify-center mb-2 sm:mb-3 lg:mb-4">
                <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${
                  index === 0 ? 'bg-brand-green' :
                  index === 1 ? 'bg-brand-yellow' :
                  'bg-brand-red'
                }`} />
              </div>

              <div className="flex items-baseline justify-center mb-1">
                <motion.span
                  className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black tracking-tight text-gray-900 dark:text-white"
                  animate={{
                    scale: counts[index] === stat.value ? [1, 1.05, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {counts[index].toLocaleString()}
                </motion.span>
                {stat.suffix && (
                  <span className="text-xs sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold ml-0.5 text-gray-700 dark:text-gray-300">
                    {stat.suffix}
                  </span>
                )}
              </div>

              <p className="text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-1 sm:px-2">
                {typeof stat.label === 'object' ? stat.label[currentLocale] || stat.label.en : stat.label}
              </p>
              
              <div className="hidden sm:block absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600 opacity-50" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Default configuration with translation keys
const getDefaultConfig = (t?: any): SiteConfiguration => ({
  heroHeadline: {
    line1: t?.('homepage.heroLine1') || "Create Custom",
    line2: t?.('homepage.heroLine2') || "Products",
    subtitle: t?.('homepage.heroSubtitle') || "Design and print custom t-shirts, business cards, stickers, and more. <span class='font-bold'>Professional quality, delivered fast.</span>"
  },
  stats: [
    {
      id: "1",
      value: 10000,
      suffix: "+",
      label: t?.('homepage.statsDesigns') || "Designs",
      duration: 2
    },
    {
      id: "2",
      value: 500,
      suffix: "+",
      label: t?.('homepage.statsProducts') || "Products",
      duration: 2.5
    },
    {
      id: "3",
      value: 24,
      suffix: "hr",
      label: t?.('homepage.statsDelivery') || "Delivery",
      duration: 1.5
    }
  ],
  features: [
    {
      id: "1",
      iconType: "Zap",
      title: t?.('homepage.feature1Title') || "Lightning Fast Design",
      description: t?.('homepage.feature1Description') || "Create stunning designs in minutes with our intuitive design tool"
    },
    {
      id: "2",
      iconType: "Shield",
      title: t?.('homepage.feature2Title') || "Premium Quality",
      description: t?.('homepage.feature2Description') || "High-quality printing on premium materials that last"
    },
    {
      id: "3",
      iconType: "Truck",
      title: t?.('homepage.feature3Title') || "Fast Delivery",
      description: t?.('homepage.feature3Description') || "Get your custom products delivered in 3-5 business days"
    },
    {
      id: "4",
      iconType: "Users",
      title: t?.('homepage.feature4Title') || "24/7 Support",
      description: t?.('homepage.feature4Description') || "Our team is here to help you create the perfect design"
    }
  ],
  featuredProducts: [],
  bestSellers: [],
  customSections: [],
  ctaSection: {
    headline: t?.('homepage.ctaHeadline') || "Ready to Create Something Amazing?",
    subtitle: t?.('homepage.ctaSubtitle') || "Join thousands of customers who trust us with their custom printing needs",
    primaryButtonText: t?.('homepage.ctaPrimaryButton') || "Start Your Design",
    primaryButtonLink: "/design-tool",
    secondaryButtonText: t?.('homepage.ctaSecondaryButton') || "Get Started Free",
    secondaryButtonLink: "/signup"
  },
  bestSellersTitle: t?.('homepage.bestSellersTitle') || "Best Sellers",
  bestSellersSubtitle: t?.('homepage.bestSellersSubtitle') || "Our most popular products",
  featuresTitle: t?.('homepage.featuresTitle') || "Why Choose MR MERCH"
})

export default function DynamicHomepage() {
  const dispatch = useAppDispatch()
  const { formatPrice } = useCurrency()
  const { items: products = [] } = useAppSelector((state) => state.products)
  const t = useTranslations()
  const pathname = usePathname()

  // Extract current locale from pathname
  const currentLocale = pathname.startsWith('/sv') ? 'sv' : 'en'

  const [config, setConfig] = useState<SiteConfiguration | null>(getDefaultConfig(t))
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [bestSellerProducts, setBestSellerProducts] = useState<any[]>([])
  const [customSectionsData, setCustomSectionsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Map product IDs from config to actual products when both are available
  useEffect(() => {
    if (config && products.length > 0) {
      // Map featured products and collections
      if (config.featuredProducts && config.featuredProducts.length > 0) {
        const mappedFeatured = config.featuredProducts
          .map(fp => {
            // Handle collections
            if (fp.type === 'collection') {
              return {
                type: 'collection',
                id: fp.collectionId,
                name: fp.collectionName,
                description: fp.collectionDescription,
                image: fp.collectionImage,
                badge: fp.collectionBadge,
                badgeColor: fp.collectionBadgeColor,
                products: fp.products || [],
                order: fp.order
              }
            }
            // Handle single products
            const product = products.find(p => p._id === fp.productId || p.id === fp.productId)
            if (product) {
              return {
                ...product,
                type: 'product',
                badge: fp.badge,
                badgeColor: fp.badgeColor,
                order: fp.order
              }
            }
            return null
          })
          .filter(Boolean)
          .sort((a, b) => (a.order || 0) - (b.order || 0))

        setFeaturedProducts(mappedFeatured)
        console.log("Mapped featured products and collections:", mappedFeatured)
      }
      
      // Map best sellers
      if (config.bestSellers && config.bestSellers.length > 0) {
        const mappedBestSellers = config.bestSellers
          .map(bs => {
            const product = products.find(p => p._id === bs.productId || p.id === bs.productId)
            if (product) {
              return {
                ...product,
                order: bs.order
              }
            }
            return null
          })
          .filter(Boolean)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
        
        setBestSellerProducts(mappedBestSellers)
        console.log("Mapped best sellers:", mappedBestSellers)
      }
      
      // Map custom sections
      if (config.customSections && config.customSections.length > 0) {
        const mappedSections = config.customSections
          .filter(section => section.enabled)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(section => ({
            ...section,
            products: section.products
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(sp => {
                const product = products.find(p => p._id === sp.productId || p.id === sp.productId)
                return product
              })
              .filter(Boolean)
          }))
        
        setCustomSectionsData(mappedSections)
        console.log("Mapped custom sections:", mappedSections)
      }
    }
  }, [config, products])
  
  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts({ page: 1, limit: 100 })) // Fetch more products
    
    // Fetch site configuration
    fetch("/api/admin/site-configuration?configKey=homepage")
      .then(res => res.json())
      .then(data => {
        // Ensure we have a valid config structure
        if (data && data.heroHeadline) {
          setConfig(data)
          
          // Process featured products from configuration
          if (data.featuredProducts && data.featuredProducts.length > 0) {
            // We'll map these IDs to actual products after products are loaded
            console.log("Featured product IDs from config:", data.featuredProducts)
          }
          
          // Process best sellers from configuration
          if (data.bestSellers && data.bestSellers.length > 0) {
            console.log("Best seller IDs from config:", data.bestSellers)
          }
        } else {
          // Use default configuration if API returns invalid data
          setConfig(getDefaultConfig(t))
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching configuration:", err)
        // Use default configuration on error
        setConfig(getDefaultConfig(t))
        setLoading(false)
      })
  }, [dispatch, t])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  // Ensure config is always available
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const displayBestSellers = bestSellerProducts.length > 0 ? bestSellerProducts : products

  return (
    <div className="min-h-screen -mx-4 sm:mx-0 -my-8 sm:my-0">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white sm:bg-gradient-to-br sm:from-gray-50 sm:to-white dark:bg-black dark:sm:from-gray-900 dark:sm:to-black" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-[1600px] mx-auto px-0 sm:px-4 lg:px-6 xl:px-8 pt-0 sm:pt-6 lg:pt-8 pb-0 sm:pb-6 lg:pb-8">
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl overflow-hidden border-0 sm:border-2 sm:border-gray-100 sm:dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-6 lg:pt-8">
              <CategoryShowcase />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <motion.div className="p-6 sm:p-6 lg:p-10 xl:p-12 2xl:p-16">
                <motion.h1
                  className="text-4xl xs:text-4xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-black dark:text-white mb-6 sm:mb-6 uppercase leading-tight"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <span className="block">{typeof config.heroHeadline.line1 === 'object' ? config.heroHeadline.line1[currentLocale] || config.heroHeadline.line1.en : config.heroHeadline.line1}</span>
                  <span className="block relative">
                    <span>{typeof config.heroHeadline.line2 === 'object' ? config.heroHeadline.line2[currentLocale] || config.heroHeadline.line2.en : config.heroHeadline.line2}</span>
                    <motion.div 
                      className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-brand-green via-brand-lime via-brand-yellow via-brand-orange to-brand-red"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </span>
                </motion.h1>
                
                <motion.p
                  className="text-base sm:text-base lg:text-lg xl:text-xl text-gray-700 dark:text-gray-300 mb-8 sm:mb-8 lg:mb-10 font-medium leading-relaxed"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  dangerouslySetInnerHTML={{ __html: typeof config.heroHeadline.subtitle === 'object' ? config.heroHeadline.subtitle[currentLocale] || config.heroHeadline.subtitle.en : config.heroHeadline.subtitle }}
                />
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 lg:mb-16"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp} className="flex-1">
                    <Button size="lg" asChild className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all relative overflow-hidden group min-h-[52px] text-base sm:text-base px-5 sm:px-6">
                      <Link href="/design-tool" className="flex items-center justify-center relative z-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Palette className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 relative z-10" />
                        <span className="relative z-10 font-bold">{t('homepage.startDesigning')}</span>
                        <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 relative z-10" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div variants={fadeInUp} className="flex-1">
                    <Button size="lg" variant="outline" asChild className="w-full sm:w-auto shadow-sm sm:shadow-md border border-gray-300 sm:border-2 sm:border-black dark:border-gray-600 sm:dark:border-white bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white min-h-[48px] text-sm sm:text-base px-4 sm:px-6">
                      <Link href="/products" className="flex items-center justify-center">
                        <Package className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-bold">{t('homepage.browseProducts')}</span>
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                <AnimatedStats stats={config.stats} currentLocale={currentLocale} />
              </motion.div>

              <motion.div
                className="relative border-t border-gray-100 sm:border-t-2 lg:border-t-0 lg:border-l-2 lg:border-l-4 sm:border-gray-200 sm:border-black dark:border-gray-700 sm:dark:border-white bg-white sm:bg-gray-50 dark:bg-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <ProductCarousel featuredProducts={featuredProducts} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers Section */}
      {displayBestSellers.length > 0 && (
        <section className="relative overflow-hidden">
          <div className="relative max-w-[1600px] mx-auto px-0 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-6 lg:py-8">
            <div className="bg-white dark:bg-gray-900 overflow-hidden">
              <div className="text-center py-6 sm:py-6 lg:py-8 px-4 sm:px-4 border-b-0 sm:border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {typeof config.bestSellersTitle === 'object' ? config.bestSellersTitle[currentLocale] || config.bestSellersTitle.en : config.bestSellersTitle}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {typeof config.bestSellersSubtitle === 'object' ? config.bestSellersSubtitle[currentLocale] || config.bestSellersSubtitle.en : config.bestSellersSubtitle}
                </p>
              </div>

              <div className="relative group pb-4 sm:pb-8">
                <button
                  onClick={() => {
                    const container = document.getElementById('bestsellers-scroll')
                    if (container) {
                      const scrollAmount = window.innerWidth < 640 ? 160 : 280
                      container.scrollLeft -= scrollAmount
                    }
                  }}
                  className="absolute left-2 top-[35%] -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/95 dark:bg-black/95 backdrop-blur-sm text-black dark:text-white flex items-center justify-center shadow-md rounded-full hover:scale-110 transition-transform"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <button
                  onClick={() => {
                    const container = document.getElementById('bestsellers-scroll')
                    if (container) {
                      const scrollAmount = window.innerWidth < 640 ? 160 : 280
                      container.scrollLeft += scrollAmount
                    }
                  }}
                  className="absolute right-2 top-[35%] -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/95 dark:bg-black/95 backdrop-blur-sm text-black dark:text-white flex items-center justify-center shadow-md rounded-full hover:scale-110 transition-transform"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div
                  id="bestsellers-scroll"
                  className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8 pb-2"
                  style={{ scrollbarWidth: 'none' as any, msOverflowStyle: 'none' }}
                >
                  {displayBestSellers.map((product: any) => (
                    <Link key={product._id || product.id} href={`/product/${product._id || product.id}`} className="flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[220px] xl:w-[260px] snap-start">
                      <Card className="border-0 sm:border border-gray-100 sm:border-gray-200 dark:border-gray-800 sm:dark:border-gray-700 h-full hover:shadow-lg transition-all duration-200 cursor-pointer bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
                        <div className="relative h-[180px] sm:h-[200px] lg:h-[240px] xl:h-[280px] bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                          <Image 
                            src={getOptimizedImageUrl(getProductImage(product))} 
                            alt={product.name} 
                            fill 
                            sizes={generateImageSizes('card')}
                            className="object-contain p-2 sm:p-3" 
                            loading="lazy"
                            quality={75}
                          />
                          {product.featured && (
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 bg-black text-white px-2 py-1 sm:px-3 sm:py-1 text-xs font-bold uppercase">
                              Featured
                            </div>
                          )}
                          {product.colors && product.colors.length > 0 && (
                            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 lg:bottom-3 lg:left-3 xl:bottom-4 xl:left-4 flex gap-0.5 sm:gap-1">
                              {product.colors.slice(0, 3).map((colorObj: any, idx: number) => {
                                const colorValue = typeof colorObj === 'string' ? colorObj : (colorObj.color || colorObj.name || 'gray');
                                return (
                                  <div 
                                    key={idx}
                                    className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 rounded-full border border-white sm:border-2 shadow-md"
                                    style={{ backgroundColor: colorValue.toLowerCase() }}
                                    title={typeof colorObj === 'string' ? colorObj : colorObj.name}
                                  />
                                );
                              })}
                              {product.colors.length > 3 && (
                                <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 rounded-full bg-gray-200 border border-white sm:border-2 shadow-md flex items-center justify-center text-[8px] sm:text-[10px] lg:text-xs font-bold">
                                  +{product.colors.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-3 sm:p-3 flex flex-col flex-grow">
                          <h3 className="text-xs sm:text-xs lg:text-sm font-medium text-gray-800 dark:text-gray-200 mb-1.5 line-clamp-2 leading-tight">
                            {product.name}
                          </h3>
                          <div className="mt-auto">
                            <span className="text-sm sm:text-base lg:text-lg font-bold text-black dark:text-white block mb-2">
                              {formatPrice(product.basePrice || product.price || 0)}
                            </span>
                            <Button
                              className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 text-[10px] sm:text-xs w-full h-[30px] sm:h-[34px] flex items-center justify-center px-2"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                // Add to cart logic
                                dispatch(addToCart(product))
                                toast.success(t('homepage.addedToCart'))
                              }}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{t('homepage.addToCart')}</span>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center py-6 border-t border-gray-100 dark:border-gray-800">
                  <Link 
                    href="/products" 
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {t('homepage.browseAllProducts')}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSectionsData.map((section, index) => (
        <section key={section.id} className="relative overflow-hidden">
          <div className="relative max-w-[1600px] mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl overflow-hidden border-0 sm:border-2 sm:border-gray-100 sm:dark:border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-center py-8 sm:py-12 px-4">
                <h2 className="text-3xl sm:text-5xl font-black text-black dark:text-white mb-4 uppercase tracking-wider">
                  {section.title}
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red mx-auto mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {section.subtitle}
                </p>
              </div>

              <div className="relative group pb-8 sm:pb-12">
                <button
                  onClick={() => {
                    const container = document.getElementById(`section-${section.id}-scroll`)
                    if (container) {
                      const scrollAmount = window.innerWidth < 640 ? 200 : 320
                      container.scrollLeft -= scrollAmount
                    }
                  }}
                  className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-12 sm:h-12 bg-black text-white flex items-center justify-center shadow-xl opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity rounded-full sm:rounded-none"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>

                <button
                  onClick={() => {
                    const container = document.getElementById(`section-${section.id}-scroll`)
                    if (container) {
                      const scrollAmount = window.innerWidth < 640 ? 200 : 320
                      container.scrollLeft += scrollAmount
                    }
                  }}
                  className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-12 sm:h-12 bg-black text-white flex items-center justify-center shadow-xl opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity rounded-full sm:rounded-none"
                >
                  <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>

                <div 
                  id={`section-${section.id}-scroll`}
                  className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scroll-smooth px-4 sm:px-8 pb-2 sm:pb-4"
                  style={{ scrollbarWidth: 'none' as any, msOverflowStyle: 'none' }}
                >
                  {section.products && section.products.length > 0 ? (
                    section.products.map((product: any) => (
                      <Link key={product._id || product.id} href={`/product/${product._id || product.id}`} className="flex-shrink-0 w-48 sm:w-64 lg:w-80">
                        <Card className="border-0 sm:border sm:border-2 border-gray-100 sm:border-black dark:border-gray-800 sm:dark:border-white h-full hover:shadow-xl transition-all duration-200 cursor-pointer bg-white dark:bg-gray-900">
                          <div className="relative h-40 sm:h-52 lg:h-64 bg-gray-50 dark:bg-gray-800">
                            <Image 
                              src={getOptimizedImageUrl(product.image || '/placeholder.jpg')} 
                              alt={product.name} 
                              fill 
                              sizes={generateImageSizes('card')}
                              className="object-contain p-3" 
                              loading="lazy"
                              quality={75}
                            />
                            {product.featured && (
                              <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold uppercase">
                                Featured
                              </div>
                            )}
                            {product.colors && product.colors.length > 0 && (
                              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex gap-1">
                                {product.colors.slice(0, 3).map((colorObj: any, idx: number) => {
                                  const colorValue = typeof colorObj === 'string' ? colorObj : (colorObj.color || colorObj.name || 'gray');
                                  return (
                                    <div 
                                      key={idx}
                                      className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-md"
                                      style={{ backgroundColor: colorValue.toLowerCase() }}
                                      title={typeof colorObj === 'string' ? colorObj : colorObj.name}
                                    />
                                  );
                                })}
                                {product.colors.length > 3 && (
                                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gray-200 border-2 border-white shadow-md flex items-center justify-center text-[8px] sm:text-xs font-bold">
                                    +{product.colors.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="p-3 sm:p-5 lg:p-6">
                            <h3 className="text-sm sm:text-base lg:text-lg font-black text-black mb-2 sm:mb-3 line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <span className="text-lg sm:text-xl lg:text-2xl font-black text-black">
                                {formatPrice(product.basePrice || product.price || 0)}
                              </span>
                              <Button 
                                className="bg-black hover:bg-gray-800 text-white font-bold uppercase text-xs sm:text-sm w-full sm:w-auto" 
                                size="sm" 
                                onClick={(e) => {
                                  e.preventDefault()
                                  window.location.href = `/design-tool?productId=${product._id || product.id}`
                                }}
                              >
                                {t('homepage.customize')}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8 w-full">
                      <p className="text-gray-500">{t('homepage.noProductsInSection')}</p>
                    </div>
                  )}
                </div>
                
                <div className="text-center py-6 border-t border-gray-100 dark:border-gray-800">
                  <Link 
                    href="/products" 
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {t('homepage.browseAllProducts')}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* Features Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-6 lg:py-8">
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl overflow-hidden border-0 sm:border-2 sm:border-gray-100 sm:dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-4 sm:p-6 lg:p-8 xl:p-12">
              <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-black dark:text-white mb-3 sm:mb-4 uppercase tracking-wider">
                  {typeof config.featuresTitle === 'object' ? config.featuresTitle[currentLocale] || config.featuresTitle.en : config.featuresTitle}
                </h2>
                <div className="h-0.5 sm:h-1 w-16 sm:w-20 lg:w-24 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red mx-auto" />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                {config.features.map((feature, index) => {
                  const IconComponent = iconMap[feature.iconType] || Zap
                  return (
                    <motion.div 
                      key={feature.id} 
                      className="text-center p-2 sm:p-3"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-black dark:bg-white mb-2 sm:mb-4">
                        <IconComponent className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white dark:text-black" />
                      </div>
                      <h3 className="text-xs sm:text-base lg:text-lg font-black text-black dark:text-white mb-1 sm:mb-2 uppercase leading-tight">
                        {typeof feature.title === 'object' ? feature.title[currentLocale] || feature.title.en : feature.title}
                      </h3>
                      <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed px-1">
                        {typeof feature.description === 'object' ? feature.description[currentLocale] || feature.description.en : feature.description}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-6 sm:py-6 lg:py-8">
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-4 lg:px-6 xl:px-8">
          <motion.div 
            className="bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red p-1 rounded-2xl sm:rounded-3xl shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 text-center">
              <h2 className="text-2xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black text-white mb-4 sm:mb-6 uppercase tracking-wider leading-tight">
                {typeof config.ctaSection.headline === 'object' ? config.ctaSection.headline[currentLocale] || config.ctaSection.headline.en : config.ctaSection.headline}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
                {typeof config.ctaSection.subtitle === 'object' ? config.ctaSection.subtitle[currentLocale] || config.ctaSection.subtitle.en : config.ctaSection.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-none mx-auto">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-200 font-black uppercase px-4 sm:px-6 lg:px-8 min-h-[48px] text-sm sm:text-base" 
                  asChild
                >
                  <Link href={config.ctaSection.primaryButtonLink} className="flex items-center justify-center">
                    <Palette className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{typeof config.ctaSection.primaryButtonText === 'object' ? config.ctaSection.primaryButtonText[currentLocale] || config.ctaSection.primaryButtonText.en : config.ctaSection.primaryButtonText}</span>
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white/10 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none sm:border-2 sm:border-white text-white hover:bg-white hover:text-black font-black uppercase px-4 sm:px-6 lg:px-8 transition-all min-h-[48px] text-sm sm:text-base shadow-lg sm:shadow-none" 
                  asChild
                >
                  <Link href={config.ctaSection.secondaryButtonLink} className="flex items-center justify-center">
                    <span>{typeof config.ctaSection.secondaryButtonText === 'object' ? config.ctaSection.secondaryButtonText[currentLocale] || config.ctaSection.secondaryButtonText.en : config.ctaSection.secondaryButtonText}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}