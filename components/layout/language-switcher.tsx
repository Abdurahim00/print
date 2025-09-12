"use client"

import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { localeNames, locales } from '@/i18n'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  
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
    
    router.push(newPath)
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 font-bold"
        >
          <Languages className="h-4 w-4" />
          <span>{localeNames[currentLocale as keyof typeof localeNames]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => switchLocale('en')}
          className={currentLocale === 'en' ? 'bg-gray-100 dark:bg-gray-800' : ''}
        >
          <span className="font-semibold">EN</span>
          <span className="ml-2 text-sm text-gray-500">English</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => switchLocale('sv')}
          className={currentLocale === 'sv' ? 'bg-gray-100 dark:bg-gray-800' : ''}
        >
          <span className="font-semibold">SV</span>
          <span className="ml-2 text-sm text-gray-500">Svenska</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}