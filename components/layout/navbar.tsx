"use client"

import { useState, useEffect } from "react"
import Logo from "@/public/logo.png"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { setLanguage } from "@/lib/redux/slices/appSlice"
import { setSessionUser } from "@/lib/redux/slices/authSlice" // New import
import { translations } from "@/lib/constants"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react" // New NextAuth imports
import Image from "next/image"

export function Navbar() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession() // Get session data
  const { language } = useAppSelector((state) => state.app)
  const { items: cartItems } = useAppSelector((state) => state.cart)

  const t = translations[language]

  // Update Redux user state when NextAuth session changes
  useEffect(() => {
    if (status === "authenticated") {
      dispatch(setSessionUser(session.user))
    } else if (status === "unauthenticated") {
      dispatch(setSessionUser(null))
    }
  }, [session, status, dispatch])

  const handleLogout = async () => {
    await signOut({ redirect: false }) // Sign out with NextAuth
    dispatch(setSessionUser(null)) // Clear Redux state
    setMobileMenuOpen(false)
    router.push("/")
  }

  const handleLanguageChange = (lang: "en" | "sv") => {
    dispatch(setLanguage(lang))
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image src={Logo} alt="Logo" width={120} height={120} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" asChild>
            <Link href="/products" className="flex items-center">{t.products}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/design-tool" className="flex items-center">{t.designTool}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/car-mockup" className="flex items-center">{t.carWrapDesigner}</Link>
          </Button>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[120px]">
              <Languages className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t.language} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="sv">Svenska</SelectItem>
            </SelectContent>
          </Select>

          {/* Cart Icon - Always visible */}
          <Button variant="outline" asChild>
            <Link href="/cart" className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t.cart}
              {cartItemCount > 0 && (
                <span className="ml-1 bg-sky-600 text-white rounded-full px-2 py-1 text-xs">{cartItemCount}</span>
              )}
            </Link>
          </Button>

          {status === "authenticated" ? (
            <>
              <Button variant="ghost" asChild className="hidden lg:inline-flex">
                <Link href="/dashboard" className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> {t.dashboard}
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="secondary">
                <LogOut className="mr-2 h-4 w-4" />
                {t.logout}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login" className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" /> {t.login}
                </Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/signup" className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" /> {t.signup}
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* Cart Icon - Always visible on mobile */}
          <Button variant="outline" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">{t.platformName}</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-6">
                {/* Language Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.language}</label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <Languages className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sv">Svenska</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Navigation Links */}
                <div className="space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start" onClick={closeMobileMenu}>
                    <Link href="/products">
                      <Package className="mr-2 h-4 w-4" />
                      {t.products}
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start" onClick={closeMobileMenu}>
                    <Link href="/design-tool">
                      <Brush className="mr-2 h-4 w-4" />
                      {t.designTool}
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start" onClick={closeMobileMenu}>
                    <Link href="/car-mockup">
                      <Car className="mr-2 h-4 w-4" />
                      {t.carWrapDesigner}
                    </Link>
                  </Button>
                </div>

                {status === "authenticated" && session?.user && (
                  <>
                    <Separator />
                    <Button variant="ghost" asChild className="w-full justify-start" onClick={closeMobileMenu}>
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t.dashboard}
                      </Link>
                    </Button>
                  </>
                )}

                <Separator />

                {/* Auth Actions */}
                {status === "authenticated" && session?.user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-slate-600 dark:text-slate-400 p-2">
                      <p className="font-medium">{session.user.email}</p>
                      <p className="text-xs">{session.user.customerNumber}</p>
                    </div>
                    <Button onClick={handleLogout} variant="destructive" className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t.logout}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start bg-transparent"
                      onClick={closeMobileMenu}
                    >
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        {t.login}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full justify-start bg-sky-600 hover:bg-sky-700 text-white"
                      onClick={closeMobileMenu}
                    >
                      <Link href="/signup">
                        <UserPlus className="mr-2 h-4 w-4" />
                        {t.signup}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
