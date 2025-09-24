"use client"

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages, Check } from "lucide-react"
import { localeNames, locales } from '@/i18n'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  // Extract current locale from pathname
  const currentLocale = locales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || 'en'

  const switchLocale = (newLocale: string) => {
    // Get path segments
    const segments = pathname.split('/')

    // Check if first segment is a locale
    const hasLocalePrefix = locales.includes(segments[1] as any)

    // Build new path
    let newPath: string
    if (hasLocalePrefix) {
      // Replace existing locale
      segments[1] = newLocale
      newPath = segments.join('/')
    } else {
      // Add locale prefix
      newPath = `/${newLocale}${pathname}`
    }

    // Ensure path starts with /
    if (!newPath.startsWith('/')) {
      newPath = '/' + newPath
    }

    // Use window.location for more reliable navigation
    window.location.href = newPath
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 font-bold"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{localeNames[currentLocale as keyof typeof localeNames]}</span>
          <span className="sm:hidden">{currentLocale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        <DropdownMenuItem
          onClick={() => {
            setIsOpen(false)
            switchLocale('en')
          }}
          className={`cursor-pointer ${currentLocale === 'en' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <span className="font-semibold">EN</span>
              <span className="ml-2 text-sm text-gray-500">English</span>
            </div>
            {currentLocale === 'en' && <Check className="h-4 w-4 ml-2" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setIsOpen(false)
            switchLocale('sv')
          }}
          className={`cursor-pointer ${currentLocale === 'sv' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <span className="font-semibold">SV</span>
              <span className="ml-2 text-sm text-gray-500">Svenska</span>
            </div>
            {currentLocale === 'sv' && <Check className="h-4 w-4 ml-2" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}