"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
import { getProductImage } from "@/lib/utils/product-image"
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
  LucideIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

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
  const { items: reduxProducts = [] } = useAppSelector((state) => state.products)
  
  // Use featured products if available, otherwise use redux products or mock data
  const mockProducts = [
    {
      id: 1,
      _id: "1",
      name: "Premium T-Shirt Collection",
      description: "High-quality cotton shirts with custom designs",
      price: 24.99,
      basePrice: 24.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
    },
    {
      id: 2,
      _id: "2",
      name: "Business Card Package",
      description: "Professional business cards with premium finish",
      price: 39.99,
      basePrice: 39.99,
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
      colors: ["#F0F0F0", "#2C3E50", "#E74C3C", "#3498DB"],
    },
    {
      id: 3,
      _id: "3",
      name: "Custom Hoodies",
      description: "Comfortable hoodies with your unique design",
      price: 45.99,
      basePrice: 45.99,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      colors: ["#34495E", "#95A5A6", "#E67E22", "#27AE60"],
    },
    {
      id: 4,
      _id: "4",
      name: "Sticker Pack",
      description: "Waterproof vinyl stickers in various sizes",
      price: 12.99,
      basePrice: 12.99,
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
      colors: ["#9B59B6", "#F39C12", "#1ABC9C", "#C0392B"],
    },
    {
      id: 5,
      _id: "5",
      name: "Custom Mugs",
      description: "Ceramic mugs with vibrant color printing",
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
    <div className="relative w-full h-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] overflow-hidden bg-white dark:bg-gray-900">
      <div className="relative h-full flex flex-col p-4 sm:p-6 lg:p-12">
        <div className="mb-6 sm:mb-8">
          <motion.h3 
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Featured Products
          </motion.h3>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 text-base sm:text-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Browse our collection
          </motion.p>
        </div>
        
        <div className="flex-1 flex items-center justify-center mb-16 sm:mb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id || currentProduct._id}
              className="w-full max-w-sm sm:max-w-xl lg:max-w-2xl"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Link href={`/product/${currentProduct._id || currentProduct.id}`} className="block relative h-64 sm:h-80 lg:h-96 mb-4 sm:mb-6 overflow-hidden bg-black dark:bg-white cursor-pointer group">
                <Image
                  src={getProductImage(currentProduct)}
                  alt={currentProduct.name}
                  fill
                  className="object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity bg-white"
                />
                
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
                
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                  <div className="bg-white text-black px-3 py-1.5 sm:px-4 sm:py-2">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black">
                      ${typeof currentProduct.price === 'number' ? currentProduct.price.toFixed(2) : (currentProduct.basePrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1 bg-black" />
                </div>
                
                {currentProduct.badge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase ${currentProduct.badgeColor || 'bg-black text-white'}`}>
                    {currentProduct.badge}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-lg sm:text-xl font-bold uppercase">View Product</span>
                </div>
              </Link>
              
              <div className="text-center">
                <Link href={`/product/${currentProduct._id || currentProduct.id}`} className="hover:underline">
                  <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 cursor-pointer">
                    {currentProduct.name}
                  </h4>
                </Link>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 px-2 sm:px-0">
                  {currentProduct.description}
                </p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex gap-2 sm:gap-3 px-2 sm:px-0"
                >
                  <Button 
                    size="lg" 
                    className="flex-1 bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 min-h-[44px] touch-manipulation text-sm sm:text-base"
                    asChild
                  >
                    <Link href={`/product/${currentProduct._id || currentProduct.id}`} className="flex items-center justify-center">
                      <span className="font-black uppercase">View Details</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 border-2 border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    asChild
                  >
                    <Link href={`/design-tool?productId=${currentProduct._id || currentProduct.id}`} className="flex items-center justify-center">
                      <Palette className="mr-2 h-5 w-5" />
                      <span className="font-black uppercase">Customize</span>
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-4 right-4 sm:left-8 sm:right-8 lg:left-16 lg:right-16">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <motion.button
              onClick={prevSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-transform rounded-full sm:rounded-none flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
            
            <div className="flex gap-1.5 sm:gap-2">
              {products.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 sm:h-2 transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-6 sm:w-8 bg-black dark:bg-white' 
                      : 'w-1.5 sm:w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  } rounded-full`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>
            
            <motion.button
              onClick={nextSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-transform rounded-full sm:rounded-none flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Animated Stats Component
const AnimatedStats = ({ stats }: { stats: SiteConfiguration['stats'] }) => {
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
    <div className="relative w-full py-6 sm:py-8 lg:py-12">
      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-6 sm:gap-4 lg:gap-8 max-w-5xl mx-auto px-4">
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
            <div className="relative p-4 sm:p-4 lg:p-6 text-center">
              <div className="hidden sm:flex justify-center mb-3 lg:mb-4">
                <div className={`w-2 h-2 rounded-full ${
                  index === 0 ? 'bg-brand-green' : 
                  index === 1 ? 'bg-brand-yellow' : 
                  'bg-brand-red'
                }`} />
              </div>
              
              <div className="flex items-baseline justify-center mb-2">
                <motion.span 
                  className="text-4xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-gray-900 dark:text-white"
                  animate={{ 
                    scale: counts[index] === stat.value ? [1, 1.05, 1] : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {counts[index].toLocaleString()}
                </motion.span>
                {stat.suffix && (
                  <span className="text-xl sm:text-xl lg:text-2xl xl:text-3xl font-bold ml-1 text-gray-700 dark:text-gray-300">
                    {stat.suffix}
                  </span>
                )}
              </div>
              
              <p className="text-sm sm:text-xs lg:text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              
              <div className="hidden sm:block absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600 opacity-50" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Default configuration
const getDefaultConfig = (): SiteConfiguration => ({
  heroHeadline: {
    line1: "Create Custom",
    line2: "Products",
    subtitle: "Design and print custom t-shirts, business cards, stickers, and more. <span class='font-bold'>Professional quality, delivered fast.</span>"
  },
  stats: [
    {
      id: "1",
      value: 10000,
      suffix: "+",
      label: "Designs",
      duration: 2
    },
    {
      id: "2",
      value: 500,
      suffix: "+",
      label: "Products",
      duration: 2.5
    },
    {
      id: "3",
      value: 24,
      suffix: "hr",
      label: "Delivery",
      duration: 1.5
    }
  ],
  features: [
    {
      id: "1",
      iconType: "Zap",
      title: "Lightning Fast Design",
      description: "Create stunning designs in minutes with our intuitive design tool"
    },
    {
      id: "2",
      iconType: "Shield",
      title: "Premium Quality",
      description: "High-quality printing on premium materials that last"
    },
    {
      id: "3",
      iconType: "Truck",
      title: "Fast Delivery",
      description: "Get your custom products delivered in 3-5 business days"
    },
    {
      id: "4",
      iconType: "Users",
      title: "24/7 Support",
      description: "Our team is here to help you create the perfect design"
    }
  ],
  featuredProducts: [],
  bestSellers: [],
  customSections: [],
  ctaSection: {
    headline: "Ready to Create Something Amazing?",
    subtitle: "Join thousands of customers who trust us with their custom printing needs",
    primaryButtonText: "Start Your Design",
    primaryButtonLink: "/design-tool",
    secondaryButtonText: "Get Started Free",
    secondaryButtonLink: "/signup"
  },
  bestSellersTitle: "Best Sellers",
  bestSellersSubtitle: "Our most popular products",
  featuresTitle: "Why Choose MR MERCH"
})

export default function DynamicHomepage() {
  const dispatch = useAppDispatch()
  const { items: products = [] } = useAppSelector((state) => state.products)
  const [config, setConfig] = useState<SiteConfiguration | null>(getDefaultConfig())
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [bestSellerProducts, setBestSellerProducts] = useState<any[]>([])
  const [customSectionsData, setCustomSectionsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Map product IDs from config to actual products when both are available
  useEffect(() => {
    if (config && products.length > 0) {
      // Map featured products
      if (config.featuredProducts && config.featuredProducts.length > 0) {
        const mappedFeatured = config.featuredProducts
          .map(fp => {
            const product = products.find(p => p._id === fp.productId || p.id === fp.productId)
            if (product) {
              return {
                ...product,
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
        console.log("Mapped featured products:", mappedFeatured)
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
              .map(sp => {
                const product = products.find(p => p._id === sp.productId || p.id === sp.productId)
                return product || null
              })
              .filter(Boolean)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
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
          setConfig(getDefaultConfig())
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching configuration:", err)
        // Use default configuration on error
        setConfig(getDefaultConfig())
        setLoading(false)
      })
  }, [dispatch])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  // Ensure config is always available
  if (!config) {
    setConfig(getDefaultConfig())
    return null
  }
  
  const displayBestSellers = bestSellerProducts.length > 0 ? bestSellerProducts : products
  
  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-white dark:bg-black" />
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="px-8 pt-8">
              <CategoryShowcase />
            </div>
            
            <div className="grid lg:grid-cols-2">
              <motion.div className="p-12 lg:p-16">
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white mb-6 uppercase"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <span className="block">{config.heroHeadline.line1}</span>
                  <span className="block relative">
                    <span>{config.heroHeadline.line2}</span>
                    <motion.div 
                      className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-brand-green via-brand-lime via-brand-yellow via-brand-orange to-brand-red"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-10 font-medium"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  dangerouslySetInnerHTML={{ __html: config.heroHeadline.subtitle }}
                />
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 mb-16"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp}>
                    <Button size="lg" asChild className="bg-black hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all relative overflow-hidden group">
                      <Link href="/design-tool" className="flex items-center relative z-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Palette className="mr-2 h-5 w-5 relative z-10" />
                        <span className="relative z-10">Start Designing</span>
                        <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <Button size="lg" variant="outline" asChild className="border-2 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-800 text-black dark:text-white">
                      <Link href="/products" className="flex items-center">
                        <Package className="mr-2 h-5 w-5" />
                        Browse Products
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                <AnimatedStats stats={config.stats} />
              </motion.div>

              <motion.div 
                className="relative hidden lg:block border-l-4 border-black dark:border-white bg-gray-50 dark:bg-gray-900"
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
          <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div 
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center py-12 px-4">
                <h2 className="text-4xl sm:text-5xl font-black text-black dark:text-white mb-4 uppercase tracking-wider">
                  {config.bestSellersTitle}
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red mx-auto mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {config.bestSellersSubtitle}
                </p>
              </div>

              <div className="relative group pb-8 sm:pb-12">
                <button
                  onClick={() => {
                    const container = document.getElementById('bestsellers-scroll')
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
                    const container = document.getElementById('bestsellers-scroll')
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
                  id="bestsellers-scroll"
                  className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scroll-smooth px-4 sm:px-8 pb-2 sm:pb-4"
                  style={{ scrollbarWidth: 'none' as any, msOverflowStyle: 'none' }}
                >
                  {displayBestSellers.map((product: any) => (
                    <Link key={product._id || product.id} href={`/product/${product._id || product.id}`} className="flex-shrink-0 w-48 sm:w-64 lg:w-80">
                      <Card className="border-2 border-black h-full hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="relative h-40 sm:h-52 lg:h-64 bg-white">
                          <Image 
                            src={getProductImage(product)} 
                            alt={product.name} 
                            fill 
                            className="object-contain p-3" 
                          />
                          {product.featured && (
                            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold uppercase">
                              Featured
                            </div>
                          )}
                          {product.colors && product.colors.length > 0 && (
                            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex gap-1">
                              {product.colors.slice(0, 3).map((color: string, idx: number) => (
                                <div 
                                  key={idx}
                                  className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-md"
                                  style={{ backgroundColor: color.toLowerCase() }}
                                  title={color}
                                />
                              ))}
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
                              ${product.basePrice || product.price || '0.00'}
                            </span>
                            <Button 
                              className="bg-black hover:bg-gray-800 text-white font-bold uppercase text-xs sm:text-sm w-full sm:w-auto" 
                              size="sm" 
                              onClick={(e) => {
                                e.preventDefault()
                                window.location.href = `/design-tool?productId=${product._id || product.id}`
                              }}
                            >
                              Customize
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
                    Browse all products
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSectionsData.map((section, index) => (
        <section key={section.id} className="relative overflow-hidden">
          <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div 
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="text-center py-12 px-4">
                <h2 className="text-4xl sm:text-5xl font-black text-black dark:text-white mb-4 uppercase tracking-wider">
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
                        <Card className="border-2 border-black h-full hover:shadow-xl transition-shadow cursor-pointer">
                          <div className="relative h-40 sm:h-52 lg:h-64 bg-gray-50">
                            <Image 
                              src={product.image || '/placeholder.jpg'} 
                              alt={product.name} 
                              fill 
                              className="object-contain p-3" 
                            />
                            {product.featured && (
                              <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold uppercase">
                                Featured
                              </div>
                            )}
                            {product.colors && product.colors.length > 0 && (
                              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex gap-1">
                                {product.colors.slice(0, 3).map((color: string, idx: number) => (
                                  <div 
                                    key={idx}
                                    className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-md"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    title={color}
                                  />
                                ))}
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
                                ${product.basePrice || product.price || '0.00'}
                              </span>
                              <Button 
                                className="bg-black hover:bg-gray-800 text-white font-bold uppercase text-xs sm:text-sm w-full sm:w-auto" 
                                size="sm" 
                                onClick={(e) => {
                                  e.preventDefault()
                                  window.location.href = `/design-tool?productId=${product._id || product.id}`
                                }}
                              >
                                Customize
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8 w-full">
                      <p className="text-gray-500">No products in this section</p>
                    </div>
                  )}
                </div>
                
                <div className="text-center py-6 border-t border-gray-100 dark:border-gray-800">
                  <Link 
                    href="/products" 
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    Browse all products
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
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-black text-black dark:text-white mb-4 uppercase tracking-wider">
                  {config.featuresTitle}
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red mx-auto" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {config.features.map((feature, index) => {
                  const IconComponent = iconMap[feature.iconType] || Zap
                  return (
                    <motion.div 
                      key={feature.id} 
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black dark:bg-white mb-4">
                        <IconComponent className="w-8 h-8 text-white dark:text-black" />
                      </div>
                      <h3 className="text-lg font-black text-black dark:text-white mb-2 uppercase">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
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
      <section className="relative overflow-hidden py-8">
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red p-1 rounded-3xl shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-black rounded-3xl p-16 text-center">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase tracking-wider">
                {config.ctaSection.headline}
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {config.ctaSection.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-200 font-black uppercase px-8" 
                  asChild
                >
                  <Link href={config.ctaSection.primaryButtonLink} className="flex items-center">
                    <Palette className="mr-2 h-5 w-5" />
                    {config.ctaSection.primaryButtonText}
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-black uppercase px-8 transition-all" 
                  asChild
                >
                  <Link href={config.ctaSection.secondaryButtonLink} className="flex items-center">
                    {config.ctaSection.secondaryButtonText}
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