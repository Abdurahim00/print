import type { ObjectId } from "mongodb"

// Translation helper type - can be a string or an object with language keys
export type Translatable<T = string> = T | { en?: T; sv?: T; [key: string]: T | undefined }

export interface HeroHeadline {
  line1: Translatable<string>
  line2: Translatable<string>
  subtitle: Translatable<string>
}

export interface StatItem {
  id: string
  value: number
  suffix: string
  label: Translatable<string>
  duration: number
}

export interface FeatureItem {
  id: string
  iconType: string
  title: Translatable<string>
  description: Translatable<string>
}

export interface FeaturedProduct {
  productId: string
  order: number
  badge?: Translatable<string>
  badgeColor?: string
}

export interface BestSeller {
  productId: string
  order: number
}

export interface CustomSection {
  id: string
  title: Translatable<string>
  subtitle: Translatable<string>
  products: Array<{
    productId: string
    order: number
  }>
  enabled: boolean
  order: number
}

export interface CTASection {
  headline: Translatable<string>
  subtitle: Translatable<string>
  primaryButtonText: Translatable<string>
  primaryButtonLink: string
  secondaryButtonText: Translatable<string>
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
  bestSellersTitle: Translatable<string>
  bestSellersSubtitle: Translatable<string>

  // Features Section Text
  featuresTitle: Translatable<string>
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  lastModifiedBy?: string
}

export type SiteConfiguration = Omit<SiteConfigurationDocument, "_id"> & {
  id: string
}