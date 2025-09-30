'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CarDesignPage() {
  const t = useTranslations()

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-gray-100 dark:border-gray-800 p-8 sm:p-12 lg:p-16 text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black dark:bg-white flex items-center justify-center">
              <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-white dark:text-black" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black dark:text-white mb-4 uppercase tracking-tight">
            Coming Soon
          </h1>

          {/* Gradient Line */}
          <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red mx-auto mb-6" />

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-lg mx-auto mb-8 leading-relaxed">
            Our car wrap designer is currently under development. We're working hard to bring you an amazing design experience!
          </p>

          {/* Button */}
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 font-black uppercase px-8 min-h-[52px]"
            asChild
          >
            <Link href="/" className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}