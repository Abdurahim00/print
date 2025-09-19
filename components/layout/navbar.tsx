"use client"

import { useState, useEffect, useMemo } from "react"
import Logo from "@/public/mr-logo.png"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { setSessionUser } from "@/lib/redux/slices/authSlice" // New import
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  Palette,
  Languages,
  LayoutDashboard,
  ShoppingCart,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  Package,
  Brush,
  Car,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react" // New NextAuth imports
import { setCart } from "@/lib/redux/slices/cartSlice"
import type { CartItem } from "@/types"
import { mergeCartsPreferRight } from "@/lib/utils/cartMerge"
import Image from "next/image"
import { useAppSelector as useSelector } from "@/lib/redux/hooks"
import { SafeStorage } from "@/lib/utils/storage"
import { validateCouponCode, setActiveCoupon, fetchCoupons } from "@/lib/redux/slices/couponsSlice"
import { CategoryDropdown } from "./category-dropdown"
import { CurrencySwitcher } from "./currency-switcher"
import { LanguageSwitcher } from "./language-switcher"

export function Navbar() {
  const t = useTranslations('navigation')
  const tCommon = useTranslations('common')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [couponModalOpen, setCouponModalOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession() // Get session data
  const { items: cartItems } = useAppSelector((state) => state.cart)
  const activeCoupon = useSelector((s) => (s as any).coupons.activeCoupon)
  const availableCoupons = useSelector((s) => (s as any).coupons.items)
  
  // Ensure component is mounted before showing dynamic content
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load coupons once for the promo bar
  useEffect(() => {
    if (!availableCoupons || availableCoupons.length === 0) {
      // @ts-ignore
      dispatch(fetchCoupons())
    }
    // hydrate active coupon from storage if present (slice already loads, this ensures banner reflects it immediately)
    try {
      const raw = SafeStorage.getItem("active_coupon")
      if (raw && !activeCoupon) {
        const parsed = JSON.parse(raw)
        // @ts-ignore
        dispatch(setActiveCoupon(parsed))
      }
    } catch {}
  }, [])

  // Pick a valid, active coupon created by admin
  const promoCoupon = useMemo(() => {
    const now = new Date()
    return (availableCoupons || []).find((c: any) => {
      const from = new Date(c.validFrom)
      const until = new Date(c.validUntil)
      return c.isActive && from <= now && now <= until
    }) || null
  }, [availableCoupons])

  // Update Redux user state when NextAuth session changes
  useEffect(() => {
    if (status === "authenticated") {
      dispatch(setSessionUser(session.user as any))

      // One-time merge on login per session
      try {
        const hasMergedKey = `guest_cart_merged_for_session_${(session.user as any).id}`
        const alreadyMerged = sessionStorage.getItem(hasMergedKey)
        // Fetch persisted user cart from DB
        const userId = (session.user as any).id
        const fetchUserCart = async () => {
          const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`, { cache: "no-store" })
          const data = await res.json()
          return (data?.items ?? []) as CartItem[]
        }

        const persistUserCart = async (items: CartItem[]) => {
          await fetch(`/api/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, items }),
          })
        }

        ;(async () => {
          const dbCart = await fetchUserCart()
          const guestCartRaw = SafeStorage.getItem("cart")
          const guestCart: CartItem[] = guestCartRaw ? JSON.parse(guestCartRaw) : []

          if (!alreadyMerged) {
            // Merge guest into DB cart with guest winning on recency
            const merged = mergeCartsPreferRight(dbCart, guestCart)
            dispatch(setCart(merged))
            await persistUserCart(merged)
            // Mark merged to prevent repeat merges during this session
            sessionStorage.setItem(hasMergedKey, "1")
          } else {
            // Hydrate from DB only
            dispatch(setCart(dbCart))
            // Ensure localStorage cart mirrors user cart while logged in
            SafeStorage.setItem("cart", JSON.stringify(dbCart))
          }
        })()
      } catch (e) {
        console.error("Cart merge/hydrate failed", e)
      }
    } else if (status === "unauthenticated") {
      // Enter guest mode: only clear session user; keep guest cart in localStorage
      dispatch(setSessionUser(null))
      // Additionally, clear the per-session merge flag so a future login can merge again
      try {
        // We cannot know userId when unauthenticated; clear all merge flags for safety
        Object.keys(sessionStorage).forEach((k) => {
          if (k.startsWith("guest_cart_merged_for_session_")) sessionStorage.removeItem(k)
        })
      } catch {}
    }
  }, [session, status, dispatch])

  const handleLogout = async () => {
    await signOut({ redirect: false }) // Sign out with NextAuth
    dispatch(setSessionUser(null)) // Clear Redux state
    // Clear local guest cart to ensure no logged-in data remains visible
    try {
      SafeStorage.removeItem("cart")
    } catch {}
    dispatch(setCart([]))
    setMobileMenuOpen(false)
    router.push("/")
  }

  // Persist cart to DB when authenticated and cart changes (debounced)
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return
    const userId = (session.user as any).id
    const t = setTimeout(() => {
      fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items: cartItems }),
      }).catch(() => {})
      // Keep localStorage mirroring while logged in
      SafeStorage.setItem("cart", JSON.stringify(cartItems))
    }, 400)
    return () => clearTimeout(t)
  }, [cartItems, status, session])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const cartItemCount = mounted ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black backdrop-blur-md">
        {/* Promo bar (from admin-created active coupon) */}
        {promoCoupon && (
        <div className="w-full bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red text-black text-center text-sm py-2 cursor-pointer font-bold" onClick={() => setCouponModalOpen(true)}>
          <span className="font-black">
            {promoCoupon.discountType === "percentage" ? `${promoCoupon.discountValue}% OFF` : `${promoCoupon.discountValue} OFF`} 
          </span>
          <span className="ml-2">{tCommon('code')}: <span className="underline font-mono">{promoCoupon.code}</span></span>
        </div>
      )}
      
      {/* Main Navbar */}
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-1 sm:gap-2">
          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Desktop Search Field */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={tCommon('search') + '...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
                  }
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center min-w-0">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <Image 
                src={Logo} 
                alt="MR MERCH" 
                width={150} 
                height={50} 
                className="object-contain w-[80px] xs:w-[90px] sm:w-[110px] md:w-[130px] lg:w-[150px] h-auto max-h-8 sm:max-h-10" 
              />
            </Link>
          </div>

          {/* Right Side - Actions */}
          <div className="flex-1 flex justify-end items-center gap-1 sm:gap-2 min-w-0">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              <CurrencySwitcher />
              <LanguageSwitcher />

              {/* Cart Icon - Always visible */}
              <Button className="bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 text-xs xl:text-sm px-2 xl:px-3 h-8 xl:h-9" asChild>
                <Link href="/cart" className="flex items-center">
                  <ShoppingCart className="mr-1 xl:mr-2 h-3 w-3 xl:h-4 xl:w-4" />
                  <span className="hidden xl:inline">{t('cart')}</span>
                  {cartItemCount > 0 && (
                    <span className="ml-1 bg-white text-black rounded-full px-1.5 xl:px-2.5 py-0.5 xl:py-1 text-xs font-bold">{cartItemCount}</span>
                  )}
                </Link>
              </Button>

              {status === "authenticated" ? (
                <>
                  <Button 
                    variant="ghost" 
                    asChild 
                    className={`${
                      pathname === '/dashboard' || pathname?.startsWith('/dashboard') 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-primary hover:text-white'
                    } transition-colors hidden xl:inline-flex text-xs px-2 h-8`}
                  >
                    <Link href="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-1 h-3 w-3" /> 
                      <span className="hidden 2xl:inline">{t('dashboard')}</span>
                    </Link>
                  </Button>
                  <Button onClick={handleLogout} variant="ghost" className="hover:bg-primary hover:text-white text-xs px-2 h-8">
                    <LogOut className="mr-1 h-3 w-3" />
                    <span className="hidden xl:inline">{t('logout')}</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="text-xs px-2 h-8">
                    <Link href="/login" className="flex items-center">
                      <LogIn className="mr-1 h-3 w-3" /> 
                      <span className="hidden xl:inline">{t('login')}</span>
                    </Link>
                  </Button>
                  <Button asChild className="bg-primary hover:bg-primary hover:text-white text-white text-xs px-2 h-8">
                    <Link href="/signup" className="flex items-center">
                      <UserPlus className="mr-1 h-3 w-3" /> 
                      <span className="hidden xl:inline">{t('signup')}</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile & Tablet Actions */}
            <div className="flex lg:hidden items-center gap-1 sm:gap-2">
              {/* Cart Icon - Always visible on mobile */}
              <Link href="/cart" className="relative">
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] p-4 overflow-y-auto">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-left text-base sm:text-lg">{tCommon('platformName')}</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Currency and Language Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  <CurrencySwitcher />
                  <LanguageSwitcher />
                </div>

                <Separator />

                {/* Navigation Links */}
                <div className="space-y-1 sm:space-y-2">
                  <div className="w-full">
                    <CategoryDropdown />
                  </div>
                  <Button variant="ghost" asChild className="w-full justify-start h-10 sm:h-12 text-sm sm:text-base" onClick={closeMobileMenu}>
                    <Link href="/products">
                      <Package className="mr-2 h-4 w-4 flex-shrink-0" />
                      {t('allProducts')}
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start h-10 sm:h-12 text-sm sm:text-base" onClick={closeMobileMenu}>
                    <Link href="/design-tool">
                      <Brush className="mr-2 h-4 w-4 flex-shrink-0" />
                      {t('designTool')}
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start h-10 sm:h-12 text-sm sm:text-base" onClick={closeMobileMenu}>
                    <Link href="/car-mockup">
                      <Car className="mr-2 h-4 w-4 flex-shrink-0" />
                      {t('carWrapDesigner')}
                    </Link>
                  </Button>
                </div>

                {status === "authenticated" && session?.user && (
                  <>
                    <Separator />
                    <Button 
                      variant="ghost" 
                      asChild 
                      className={`w-full justify-start h-10 sm:h-12 text-sm sm:text-base ${
                        pathname === '/dashboard' || pathname?.startsWith('/dashboard') 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-primary hover:text-white'
                      }`} 
                      onClick={closeMobileMenu}
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4 flex-shrink-0" />
                        {t('dashboard')}
                      </Link>
                    </Button>
                  </>
                )}

                <Separator />

                {/* Auth Actions */}
                {status === "authenticated" && session?.user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-black dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="font-medium truncate text-xs sm:text-sm">{session.user.email}</p>
                      <p className="text-xs opacity-70">{(session.user as any).customerNumber}</p>
                    </div>
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start hover:bg-primary hover:text-white h-10 sm:h-12 text-sm sm:text-base">
                      <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                      {t('logout')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start bg-transparent h-10 sm:h-12 text-sm sm:text-base"
                      onClick={closeMobileMenu}
                    >
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4 flex-shrink-0" />
                        {t('login')}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full justify-start bg-black hover:bg-gray-800 hover:text-white text-white h-10 sm:h-12 text-sm sm:text-base"
                      onClick={closeMobileMenu}
                    >
                      <Link href="/signup">
                        <UserPlus className="mr-2 h-4 w-4 flex-shrink-0" />
                        {t('signup')}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
            </div>
          </div>
        </div>
        
        {/* Secondary Navigation Bar */}
        <div className="hidden lg:block border-t border-gray-200 dark:border-gray-700">
          <nav className="flex items-center justify-center gap-4 xl:gap-8 py-2 xl:py-3 px-2">
            <Button 
              className={`${
                pathname === '/products' || pathname?.startsWith('/products') 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-primary hover:text-white'
              } transition-colors text-xs xl:text-sm px-2 xl:px-3 h-8 xl:h-9`} 
              variant="ghost" 
              asChild
            >
              <Link href="/products" className="flex items-center">
                <Package className="mr-1 xl:mr-2 h-3 w-3 xl:h-4 xl:w-4" />
                <span className="hidden xl:inline">{t('allProducts')}</span>
                <span className="xl:hidden">{t('products')}</span>
              </Link>
            </Button>
            
            <Button 
              className={`${
                pathname === '/design-tool' || pathname?.startsWith('/design-tool') 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-primary hover:text-white'
              } transition-colors text-xs xl:text-sm px-2 xl:px-3 h-8 xl:h-9`} 
              variant="ghost" 
              asChild
            >
              <Link href="/design-tool" className="flex items-center">
                <Palette className="mr-1 xl:mr-2 h-3 w-3 xl:h-4 xl:w-4" />
                <span className="hidden xl:inline">{t('designTool')}</span>
                <span className="xl:hidden">{t('designTool')}</span>
              </Link>
            </Button>
            
            <Button 
              className={`${
                pathname === '/car-mockup' || pathname?.startsWith('/car-mockup') 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-primary hover:text-white'
              } transition-colors text-xs xl:text-sm px-2 xl:px-3 h-8 xl:h-9`} 
              variant="ghost" 
              asChild
            >
              <Link href="/car-mockup" className="flex items-center">
                <Car className="mr-1 xl:mr-2 h-3 w-3 xl:h-4 xl:w-4" />
                <span className="hidden xl:inline">{t('carWrapDesigner')}</span>
                <span className="xl:hidden">{t('carWrapDesigner')}</span>
              </Link>
            </Button>
            
            <div className="flex-shrink-0">
              <CategoryDropdown />
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-[10%] translate-y-0 max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] md:max-w-lg mx-2 sm:mx-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{tCommon('search')} {t('products')}</DialogTitle>
          </DialogHeader>
          <div className="relative mt-3 sm:mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={tCommon('search') + '...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
                  setSearchOpen(false)
                }
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
              autoFocus
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Coupon modal */}
      <Dialog open={couponModalOpen} onOpenChange={setCouponModalOpen}>
        <DialogContent className="max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] md:max-w-lg mx-2 sm:mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-extrabold text-center">
              {promoCoupon && promoCoupon.discountType === "percentage"
                ? `${promoCoupon.discountValue}% ${tCommon('offEverything')}`
                : activeCoupon && activeCoupon.discountType === "percentage"
                ? `${activeCoupon.discountValue}% ${tCommon('offEverything')}`
                : tCommon('coupon')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 text-center p-2">
            <div className="text-sm sm:text-base md:text-lg font-semibold">
              {t('coupons.promoCode')}: 
              <span className="font-mono block sm:inline text-xs sm:text-sm md:text-base mt-1 sm:mt-0 sm:ml-2">
                {promoCoupon?.code ?? activeCoupon?.code ?? tCommon('noActiveCoupon')}
              </span>
            </div>
            <Button 
              className="bg-black hover:bg-gray-800 w-full sm:w-auto text-sm sm:text-base px-6 py-2 sm:py-3" 
              onClick={async () => {
                const code = promoCoupon?.code ?? activeCoupon?.code
                if (!code) { setCouponModalOpen(false); return }
                const orderTotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
                try {
                  const result = await dispatch(validateCouponCode({ code, orderTotal, cartItems }) as any)
                  const payload = result?.payload
                  if (payload?.isValid && payload?.coupon) {
                    dispatch(setActiveCoupon(payload.coupon))
                    setCouponModalOpen(false)
                    // Toast celebration
                    try {
                      const { toast } = await import("@/hooks/use-toast")
                      toast({
                        title: t('coupons.couponApplied'),
                        description: t('coupons.couponActivated', { code: payload.coupon.code, discount: payload.coupon.discountValue }),
                      })
                    } catch {}
                  }
                } catch {}
              }}
            >
              {t('coupons.redeemCoupon')}
            </Button>
            <p className="text-xs sm:text-sm text-slate-500 px-2">
              {t('coupons.discountApplies')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
