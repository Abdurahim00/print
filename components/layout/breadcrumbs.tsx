"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname()
  const t = useTranslations()
  
  // Auto-generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items
    
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    // Always add home
    breadcrumbs.push({ label: t("common.home"), href: "/" })
    
    // Build up the path
    let currentPath = ""
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const isLast = index === paths.length - 1
      
      // Format the label
      let label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      // Special cases for better labels
      const labelMap: Record<string, string> = {
        'products': 'Products',
        'cart': 'Shopping Cart',
        'checkout': 'Checkout',
        'design-tool': 'Design Tool',
        'car-mockup': 'Car Mockup',
        'dashboard': 'Dashboard',
        'account': 'My Account',
        'orders': 'Orders',
        'customizable': 'Customizable Products'
      }
      
      if (labelMap[path]) {
        label = labelMap[path]
      }
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbItems = generateBreadcrumbs()
  
  // Don't show breadcrumbs on home page
  if (pathname === '/') return null
  
  return (
    <Breadcrumb className={`${className}`}>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          
          return (
            <div key={index} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="font-semibold">
                    {index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link 
                      href={item.href}
                      className="hover:text-black dark:hover:text-white transition-colors"
                    >
                      {index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Export a hook for programmatic breadcrumb generation
export function useBreadcrumbs(customItems?: BreadcrumbItem[]) {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems
    
    const paths = pathname.split('/').filter(Boolean)
    const t = useTranslations()
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t("common.home"), href: "/" }
    ]
    
    let currentPath = ""
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const isLast = index === paths.length - 1
      
      // Format the label
      let label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast
      })
    })
    
    return breadcrumbs
  }
  
  return generateBreadcrumbs()
}