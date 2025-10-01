"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Currency, getUserCurrency, formatPrice, getCurrencyInfo } from '@/lib/utils/currency'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (value: unknown) => string
  currencyInfo: ReturnType<typeof getCurrencyInfo>
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('SEK') // Default to SEK since prices are in SEK
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Detect and set user's currency on mount
    getUserCurrency().then((detectedCurrency) => {
      setCurrency(detectedCurrency)
      setIsLoading(false)
    })
  }, [])

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_currency', newCurrency)
    }
  }

  const value: CurrencyContextType = {
    currency,
    setCurrency: handleSetCurrency,
    formatPrice: (value: unknown) => formatPrice(value, currency),
    currencyInfo: getCurrencyInfo(currency),
    isLoading
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}