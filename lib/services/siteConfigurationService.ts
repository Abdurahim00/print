import { getDatabase } from "@/lib/mongodb"
import type { SiteConfigurationDocument, SiteConfiguration } from "@/lib/models/SiteConfiguration"
import { ObjectId } from "mongodb"

export class SiteConfigurationService {
  private static async getCollection() {
    const db = await getDatabase()
    const collection = db.collection<SiteConfigurationDocument>("siteConfigurations")
    
    // Create unique index on configKey
    await collection.createIndex({ configKey: 1 }, { unique: true })
    
    return collection
  }

  static async getConfiguration(configKey: string): Promise<SiteConfiguration | null> {
    const collection = await this.getCollection()
    const config = await collection.findOne({ configKey })
    
    if (!config) {
      // Return default configuration if none exists
      return this.getDefaultConfiguration(configKey)
    }
    
    return this.mapConfigToResponse(config)
  }

  static async updateConfiguration(
    configKey: string,
    configData: Partial<Omit<SiteConfigurationDocument, "_id" | "configKey" | "createdAt" | "updatedAt">>,
    userId?: string
  ): Promise<SiteConfiguration> {
    const collection = await this.getCollection()
    
    // Remove any system fields that might have been included
    const { id, _id, configKey: ck, createdAt, updatedAt, lastModifiedBy, ...cleanData } = configData as any
    
    const updateData = {
      ...cleanData,
      updatedAt: new Date(),
      lastModifiedBy: userId
    }
    
    const result = await collection.findOneAndUpdate(
      { configKey },
      {
        $set: updateData,
        $setOnInsert: {
          configKey,
          createdAt: new Date()
        }
      },
      { 
        upsert: true,
        returnDocument: "after"
      }
    )
    
    const config = (result as any)?.value ?? (result as any)
    return this.mapConfigToResponse(config)
  }

  private static mapConfigToResponse(config: SiteConfigurationDocument): SiteConfiguration {
    return {
      id: config._id!.toString(),
      configKey: config.configKey,
      heroHeadline: config.heroHeadline,
      stats: config.stats,
      features: config.features,
      featuredProducts: config.featuredProducts,
      bestSellers: config.bestSellers,
      customSections: config.customSections || [],
      ctaSection: config.ctaSection,
      bestSellersTitle: config.bestSellersTitle,
      bestSellersSubtitle: config.bestSellersSubtitle,
      featuresTitle: config.featuresTitle,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
      lastModifiedBy: config.lastModifiedBy
    }
  }

  static getDefaultConfiguration(configKey: string): SiteConfiguration {
    if (configKey === "homepage") {
      return {
        id: "default",
        configKey: "homepage",
        heroHeadline: {
          line1: "Create Custom",
          line2: "Products",
          subtitle: "Design and print custom t-shirts, business cards, stickers, and more. Professional quality, delivered fast."
        },
        stats: [
          {
            id: "1",
            value: 10000,
            suffix: "+",
            label: "Designs",
            duration: 2
          },
          {
            id: "2",
            value: 500,
            suffix: "+",
            label: "Products",
            duration: 2.5
          },
          {
            id: "3",
            value: 24,
            suffix: "hr",
            label: "Delivery",
            duration: 1.5
          }
        ],
        features: [
          {
            id: "1",
            iconType: "Zap",
            title: "Lightning Fast Design",
            description: "Create stunning designs in minutes with our intuitive design tool"
          },
          {
            id: "2",
            iconType: "Shield",
            title: "Premium Quality",
            description: "High-quality printing on premium materials that last"
          },
          {
            id: "3",
            iconType: "Truck",
            title: "Fast Delivery",
            description: "Get your custom products delivered in 3-5 business days"
          },
          {
            id: "4",
            iconType: "Users",
            title: "24/7 Support",
            description: "Our team is here to help you create the perfect design"
          }
        ],
        featuredProducts: [],
        bestSellers: [],
        customSections: [],
        ctaSection: {
          headline: "Ready to Create Something Amazing?",
          subtitle: "Join thousands of customers who trust us with their custom printing needs",
          primaryButtonText: "Start Your Design",
          primaryButtonLink: "/design-tool",
          secondaryButtonText: "Get Started Free",
          secondaryButtonLink: "/signup"
        },
        bestSellersTitle: "Best Sellers",
        bestSellersSubtitle: "Our most popular products",
        featuresTitle: "Why Choose MR MERCH",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    
    // Return empty default for other config keys
    return {
      id: "default",
      configKey,
      heroHeadline: {
        line1: "",
        line2: "",
        subtitle: ""
      },
      stats: [],
      features: [],
      featuredProducts: [],
      bestSellers: [],
      customSections: [],
      ctaSection: {
        headline: "",
        subtitle: "",
        primaryButtonText: "",
        primaryButtonLink: "",
        secondaryButtonText: "",
        secondaryButtonLink: ""
      },
      bestSellersTitle: "",
      bestSellersSubtitle: "",
      featuresTitle: "",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}