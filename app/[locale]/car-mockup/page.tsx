'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function CarDesignPage() {
  const t = useTranslations()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white">
          Coming Soon
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Our car wrap designer is currently under development. Check back soon!
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-8"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}