"use client"

import { useEffect, useState, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { translations } from "@/lib/constants"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { fetchProducts } from "@/lib/redux/slices/productsSlice"
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
  Layers
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

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

// Mock featured products with designs
const featuredProducts = [
  {
    id: 1,
    name: "Custom T-Shirt",
    category: "Apparel",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    designOverlay: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&q=80",
    badge: "Best Seller",
    badgeColor: "bg-black text-white",
    rotation: 5
  },
  {
    id: 2,
    name: "Business Cards",
    category: "Print",
    price: "$29.99",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    designOverlay: null,
    badge: "Premium",
    badgeColor: "bg-amber-100 text-amber-700",
    rotation: -3
  },
  {
    id: 3,
    name: "Custom Hoodie",
    category: "Apparel",
    price: "$39.99",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    designOverlay: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&q=80",
    badge: "New",
    badgeColor: "bg-green-100 text-green-700",
    rotation: -5
  },
  {
    id: 4,
    name: "Event Posters",
    category: "Print",
    price: "$34.99",
    image: "https://images.unsplash.com/photo-1527004889751-c2ff39dc8b20?w=600&q=80",
    designOverlay: null,
    badge: "Popular",
    badgeColor: "bg-blue-100 text-blue-700",
    rotation: 3
  },
  {
    id: 5,
    name: "Custom Mugs",
    category: "Promotional",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    designOverlay: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&q=80",
    badge: "Hot Deal",
    badgeColor: "bg-red-100 text-red-700",
    rotation: 4
  },
  {
    id: 6,
    name: "Sticker Pack",
    category: "Stickers",
    price: "$9.99",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80",
    designOverlay: null,
    badge: "Limited",
    badgeColor: "bg-pink-100 text-pink-700",
    rotation: -4
  }
]

// Stats configuration for animated metrics
const statsData = [
  {
    id: 1,
    value: 10000,
    suffix: "+",
    label: "Designs",
    duration: 2
  },
  {
    id: 2,
    value: 500,
    suffix: "+",
    label: "Products",
    duration: 2.5
  },
  {
    id: 3,
    value: 24,
    suffix: "hr",
    label: "Delivery",
    duration: 1.5
  }
]

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Design",
    description: "Create stunning designs in minutes with our intuitive design tool"
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description: "High-quality printing on premium materials that last"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your custom products delivered in 3-5 business days"
  },
  {
    icon: Users,
    title: "24/7 Support",
    description: "Our team is here to help you create the perfect design"
  }
]


// Product Carousel Component
const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { items: reduxProducts = [] } = useAppSelector((state) => state.products)
  
  // Use real products if available, otherwise use mock data
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
  
  const products = reduxProducts.length > 0 ? reduxProducts.slice(0, 5) : mockProducts
  
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
  }, [currentIndex])
  
  const currentProduct = products[currentIndex]
  
  return (
    <div className="relative w-full h-full min-h-[700px] overflow-hidden bg-white dark:bg-gray-900">
      {/* Main content area */}
      <div className="relative h-full flex flex-col p-8 lg:p-12">
        {/* Top section with title */}
        <div className="mb-8">
          <motion.h3 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Featured Products
          </motion.h3>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 text-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Browse our collection
          </motion.p>
        </div>
        
        {/* Product display area */}
        <div className="flex-1 flex items-center justify-center mb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              className="w-full max-w-2xl"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Product image - Clickable */}
              <Link href={`/product/${currentProduct._id}`} className="block relative h-96 mb-6 overflow-hidden bg-black dark:bg-white cursor-pointer group">
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Price badge */}
                <div className="absolute bottom-6 left-6">
                  <div className="bg-white text-black px-4 py-2">
                    <span className="text-3xl font-black">
                      {typeof currentProduct.price === 'number' ? currentProduct.price.toFixed(2) : (currentProduct.basePrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1 bg-black" />
                </div>
                
                {/* View Product overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xl font-bold uppercase">View Product</span>
                </div>
              </Link>
              
              {/* Product info */}
              <div className="text-center">
                <Link href={`/product/${currentProduct._id}`} className="hover:underline">
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 cursor-pointer">
                    {currentProduct.name}
                  </h4>
                </Link>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {currentProduct.description}
                </p>
                
                {/* Color options - Show variants if available */}
                {currentProduct.variants && currentProduct.variants.length > 1 && (
                  <div className="flex justify-center gap-3 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentProduct.variants.length} variants available
                    </p>
                  </div>
                )}
                
                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex gap-3"
                >
                  <Button 
                    size="lg" 
                    className="flex-1 bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                    asChild
                  >
                    <Link href={`/product/${currentProduct._id}`} className="flex items-center justify-center">
                      <span className="font-black uppercase">View Details</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 border-2 border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    asChild
                  >
                    <Link href={`/design-tool?productId=${currentProduct._id}`} className="flex items-center justify-center">
                      <Palette className="mr-2 h-5 w-5" />
                      <span className="font-black uppercase">Customize</span>
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Navigation controls - positioned at bottom */}
        <div className="absolute bottom-12 left-12 right-12 lg:left-16 lg:right-16">
          <div className="flex items-center justify-between">
            {/* Left arrow */}
            <motion.button
              onClick={prevSlide}
              className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            
            {/* Page dots */}
            <div className="flex gap-2">
              {products.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 bg-black dark:bg-white' 
                      : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  } rounded-full`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>
            
            {/* Right arrow */}
            <motion.button
              onClick={nextSlide}
              className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Animated Stats Component - Minimalistic Design
const AnimatedStats = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState(statsData.map(() => 0))
  
  useEffect(() => {
    setIsVisible(true)
    
    // Animate each counter
    statsData.forEach((stat, index) => {
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
      }, index * 200) // Stagger the start
      
      return () => clearTimeout(timer)
    })
  }, [])
  
  return (
    <div className="relative w-full py-12">
      <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.id}
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.15,
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            {/* Content */}
            <div className="relative p-6 text-center">
              {/* Small icon/decoration */}
              <div className="mb-4 flex justify-center">
                <div className={`w-2 h-2 rounded-full ${
                  index === 0 ? 'bg-brand-green' : 
                  index === 1 ? 'bg-brand-yellow' : 
                  'bg-brand-red'
                }`} />
              </div>
              
              {/* Number display */}
              <div className="flex items-baseline justify-center mb-2">
                <motion.span 
                  className="text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white"
                  animate={{ 
                    scale: counts[index] === statsData[index].value ? [1, 1.05, 1] : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {counts[index].toLocaleString()}
                </motion.span>
                {stat.suffix && (
                  <span className="text-2xl lg:text-3xl font-bold ml-1 text-gray-700 dark:text-gray-300">
                    {stat.suffix}
                  </span>
                )}
              </div>
              
              {/* Label with better styling */}
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              
              {/* Subtle bottom accent */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600 opacity-50" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Best Sellers Carousel Component - Temporarily Removed

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { language } = useAppSelector((state) => state.app)
  const { items: products = [] } = useAppSelector((state) => state.products)
  const t = translations[language]
  
  // Fetch categories and products immediately on mount with pagination
  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts({ page: 1, limit: 10 })) // Only fetch 10 products for home page
  }, [dispatch])

  return (
    <div className="min-h-screen">
      {/* Animated Background Pattern */}
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

      {/* Hero Section with Split Layout */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          {/* Single unified container */}
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category Circles - Now inside the hero container */}
            <div className="px-8 pt-8">
              <CategoryShowcase />
            </div>
            
            <div className="grid lg:grid-cols-2">
              
              {/* Left Side - Content */}
              <motion.div 
                className="p-12 lg:p-16"
              >
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white mb-6 uppercase"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <span className="block">Create Custom</span>
                <span className="block relative">
                  <span>Products</span>
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
              >
                Design and print custom t-shirts, business cards, stickers, and more. 
                <span className="font-bold">Professional quality, delivered fast.</span>
              </motion.p>
              
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

                {/* Animated Stats Display - Below buttons on left side */}
                <AnimatedStats />
              </motion.div>

              {/* Right Side - Product Carousel */}
              <motion.div 
                className="relative hidden lg:block border-l-4 border-black dark:border-white bg-gray-50 dark:bg-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <ProductCarousel />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers Section - Matching Hero Style */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header inside container */}
            <div className="text-center py-12 px-4">
              <h2 className="text-4xl sm:text-5xl font-black text-black dark:text-white mb-4 uppercase tracking-wider">
                Best Sellers
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red mx-auto mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Our most popular products
              </p>
            </div>

            {/* Scrollable Best Sellers Carousel */}
            <div className="relative group pb-12">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('bestsellers-scroll')
                if (container) container.scrollLeft -= 320
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black text-white flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('bestsellers-scroll')
                if (container) container.scrollLeft += 320
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black text-white flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Scrollable Container */}
            <div 
              id="bestsellers-scroll"
              className="flex gap-6 overflow-x-auto scroll-smooth px-8 pb-4"
              style={{ scrollbarWidth: 'none' as any, msOverflowStyle: 'none' }}
            >
              {products && products.length > 0 ? (
                products.slice(0, 10).map((product: any) => (
                  <Link key={product._id} href={`/product/${product._id}`} className="flex-shrink-0 w-80">
                    <Card className="border-2 border-black h-full hover:shadow-xl transition-shadow cursor-pointer">
                      <div className="relative h-64 bg-white">
                        <Image 
                          src={product.image || '/placeholder.jpg'} 
                          alt={product.name} 
                          fill 
                          className="object-cover" 
                        />
                        {product.featured && (
                          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold uppercase">
                            Featured
                          </div>
                        )}
                        {product.colors && product.colors.length > 0 && (
                          <div className="absolute bottom-4 left-4 flex gap-1">
                            {product.colors.slice(0, 5).map((color: string, idx: number) => (
                              <div 
                                key={idx}
                                className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                              />
                            ))}
                            {product.colors.length > 5 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white shadow-md flex items-center justify-center text-xs font-bold">
                                +{product.colors.length - 5}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                          {product.brand || 'MR MERCH'}
                        </p>
                        <h3 className="text-lg font-black text-black mb-3 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-black">
                            {product.basePrice || product.price || '0.00'}
                          </span>
                          <Button 
                            className="bg-black hover:bg-gray-800 text-white font-bold uppercase" 
                            size="sm" 
                            onClick={(e) => {
                              e.preventDefault()
                              window.location.href = `/design-tool?productId=${product._id}`
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
                // Show loading skeleton
                <div className="flex gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-80">
                      <Card className="border-2 border-gray-200 dark:border-gray-700 h-full">
                        <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        <div className="p-6 space-y-3">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="flex justify-between items-center">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Subtle View All Products Link */}
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

      {/* Features Section - MR MERCH Style */}
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
                  Why Choose MR MERCH
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red mx-auto" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.title} 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black dark:bg-white mb-4">
                      <feature.icon className="w-8 h-8 text-white dark:text-black" />
                    </div>
                    <h3 className="text-lg font-black text-black dark:text-white mb-2 uppercase">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - MR MERCH Style */}
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
                Ready to Create Something Amazing?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of customers who trust us with their custom printing needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-200 font-black uppercase px-8" 
                  asChild
                >
                  <Link href="/design-tool" className="flex items-center">
                    <Palette className="mr-2 h-5 w-5" />
                    Start Your Design
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-black uppercase px-8 transition-all" 
                  asChild
                >
                  <Link href="/signup" className="flex items-center">
                    Get Started Free
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