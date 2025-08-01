"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import { translations } from "@/lib/constants"

export function Footer() {
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]

  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} {t.platformName}. {t.allRightsReserved}.
        </p>
        <p className="mt-1">Inspired by Vistaprint.se - Demo for Stakeholders</p>
      </div>
    </footer>
  )
}
