import type { ObjectId } from "mongodb"

export interface HeroHeadline {
  line1: string
  line2: string
  subtitle: string
}

export interface StatItem {
  id: string
  value: number
  suffix: string
  label: string
  duration: number
}

export interface FeatureItem {
  id: string
  iconType: string
  title: string
  description: string
}

export interface FeaturedProduct {
  productId: string
  order: number
  badge?: string
  badgeColor?: string
}

export interface BestSeller {
  productId: string
  order: number
}

export interface CustomSection {
  id: string
  title: string
  subtitle: string
  products: Array<{
    productId: string
    order: number
  }>
  enabled: boolean
  order: number
}

export interface CTASection {
  headline: string
  subtitle: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
}

export interface SiteConfigurationDocument {
  _id?: ObjectId
  configKey: string // unique identifier, e.g., "homepage"
  
  // Hero Section
  heroHeadline: HeroHeadline
  
  // Stats Section
  stats: StatItem[]
  
  // Features Section
  features: FeatureItem[]
  
  // Featured Products
  featuredProducts: FeaturedProduct[]
  
  // Best Sellers
  bestSellers: BestSeller[]
  
  // Custom Sections (similar to Best Sellers)
  customSections: CustomSection[]
  
  // CTA Section
  ctaSection: CTASection
  
  // Best Sellers Section Text
  bestSellersTitle: string
  bestSellersSubtitle: string
  
  // Features Section Text
  featuresTitle: string
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  lastModifiedBy?: string
}

export type SiteConfiguration = Omit<SiteConfigurationDocument, "_id"> & {
  id: string
}