import { coerceNumber } from "@/lib/utils"

export type Currency = 'SEK' | 'USD'
export type CurrencyInfo = {
  code: Currency
  symbol: string
  name: string
}

const CURRENCIES: Record<Currency, CurrencyInfo> = {
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' }
}

// Get user's currency based on their location
export async function getUserCurrency(): Promise<Currency> {
  try {
    // Try to get cached currency first
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('user_currency')
      if (cached && (cached === 'SEK' || cached === 'USD')) {
        return cached as Currency
      }
    }

    // Fetch user's location based on IP
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    // Check if user is in Sweden (SE country code)
    const currency: Currency = data.country_code === 'SE' ? 'SEK' : 'USD'
    
    // Cache the result
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_currency', currency)
    }
    
    return currency
  } catch (error) {
    console.error('Error detecting user location:', error)
    // Default to USD if detection fails
    return 'USD'
  }
}

// Format price with currency (prices are stored in SEK in database)
export function formatPrice(value: unknown, currency: Currency = 'SEK'): string {
  const numInSEK = coerceNumber(value)
  if (numInSEK === null) return 'N/A'
  
  const currencyInfo = CURRENCIES[currency]
  
  // Convert from SEK if needed
  const displayAmount = currency === 'USD' 
    ? convertCurrency(numInSEK, 'SEK', 'USD')
    : numInSEK
  
  // Format based on currency
  if (currency === 'SEK') {
    // Swedish format: 123,45 kr
    return `${displayAmount.toFixed(2).replace('.', ',')} ${currencyInfo.symbol}`
  } else {
    // US format: $123.45
    return `${currencyInfo.symbol}${displayAmount.toFixed(2)}`
  }
}

// Convert between currencies
export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount
  
  // Current approximate conversion rate (1 USD = 10.87 SEK as of 2024)
  // You may want to fetch this dynamically from an API for real-time rates
  const USD_TO_SEK_RATE = 10.87
  
  if (from === 'USD' && to === 'SEK') {
    return amount * USD_TO_SEK_RATE
  } else if (from === 'SEK' && to === 'USD') {
    return amount / USD_TO_SEK_RATE
  }
  
  return amount
}

// Get currency info
export function getCurrencyInfo(currency: Currency): CurrencyInfo {
  return CURRENCIES[currency]
}