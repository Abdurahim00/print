import fs from 'fs/promises'
import path from 'path'
import type { SiteConfiguration } from "@/lib/models/SiteConfiguration"

const CONFIG_DIR = path.join(process.cwd(), 'data', 'configs')
const CONFIG_FILE = path.join(CONFIG_DIR, 'site-configuration.json')

export class SiteConfigurationFileService {
  private static async ensureConfigDir() {
    try {
      await fs.mkdir(CONFIG_DIR, { recursive: true })
    } catch (error) {
      console.error('Error creating config directory:', error)
    }
  }

  static async getConfiguration(configKey: string): Promise<SiteConfiguration | null> {
    try {
      await this.ensureConfigDir()
      const data = await fs.readFile(CONFIG_FILE, 'utf-8')
      const configs = JSON.parse(data)
      return configs[configKey] || this.getDefaultConfiguration(configKey)
    } catch (error) {
      console.log('No existing configuration file, returning default')
      return this.getDefaultConfiguration(configKey)
    }
  }

  static async updateConfiguration(
    configKey: string,
    configData: Partial<SiteConfiguration>,
    userId?: string
  ): Promise<SiteConfiguration> {
    try {
      await this.ensureConfigDir()
      
      let configs: Record<string, any> = {}
      
      try {
        const existingData = await fs.readFile(CONFIG_FILE, 'utf-8')
        configs = JSON.parse(existingData)
      } catch {
        // File doesn't exist yet
      }
      
      // Get existing config or default
      const existingConfig = configs[configKey] || this.getDefaultConfiguration(configKey)
      
      // Remove fields that shouldn't be updated from configData
      const { id, configKey: ck, createdAt, updatedAt, lastModifiedBy: lmb, ...dataToUpdate } = configData as any
      
      // Merge with existing config, preserving createdAt
      const configuration = {
        ...existingConfig,
        ...dataToUpdate,
        configKey,
        id: existingConfig.id || "config_" + Date.now(),
        createdAt: existingConfig.createdAt || new Date(),
        updatedAt: new Date(),
        lastModifiedBy: userId || 'admin'
      }
      
      configs[configKey] = configuration
      
      await fs.writeFile(CONFIG_FILE, JSON.stringify(configs, null, 2))
      
      return configuration as SiteConfiguration
    } catch (error) {
      console.error('Error updating configuration:', error)
      throw error
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