"use client"

import { useCurrency } from "@/contexts/CurrencyContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DollarSign } from "lucide-react"

export function CurrencySwitcher() {
  const { currency, setCurrency, currencyInfo } = useCurrency()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 font-bold"
        >
          <DollarSign className="h-4 w-4" />
          <span>{currencyInfo.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setCurrency('SEK')}
          className={currency === 'SEK' ? 'bg-gray-100 dark:bg-gray-800' : ''}
        >
          <span className="font-semibold">SEK</span>
          <span className="ml-2 text-sm text-gray-500">Swedish Krona</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setCurrency('USD')}
          className={currency === 'USD' ? 'bg-gray-100 dark:bg-gray-800' : ''}
        >
          <span className="font-semibold">USD</span>
          <span className="ml-2 text-sm text-gray-500">US Dollar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}