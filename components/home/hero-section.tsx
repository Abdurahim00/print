"use client"

import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Palette } from "lucide-react"

export function HeroSection() {
  const t = useTranslations('homepage')
  
  return (
    <div className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 text-center">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
          {t('title')}
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
          {t('subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
          <Link href="/design-tool" className="flex-1 sm:flex-initial">
            <Button size="lg" className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 text-sm sm:text-base">
              <Palette className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {t('startDesigning')}
            </Button>
          </Link>
          
          <Link href="/products" className="flex-1 sm:flex-initial">
            <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 text-sm sm:text-base">
              {t('viewProducts')}
              <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}