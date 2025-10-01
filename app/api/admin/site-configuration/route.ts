import { NextRequest, NextResponse } from "next/server"
import { SiteConfigurationService } from "@/lib/services/siteConfigurationService"
import { SiteConfigurationFileService } from "@/lib/services/siteConfigurationFileService"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Check if MongoDB is available
async function isMongoAvailable(): Promise<boolean> {
  try {
    const { MongoClient } = require('mongodb')
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 })
    await client.connect()
    await client.close()
    return true
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const configKey = searchParams.get("configKey") || "homepage"
    
    console.log("Fetching configuration for key:", configKey)
    
    // Try MongoDB first, fallback to file system
    const mongoAvailable = await isMongoAvailable()
    console.log("MongoDB available:", mongoAvailable)
    
    let configuration
    if (mongoAvailable) {
      configuration = await SiteConfigurationService.getConfiguration(configKey)
    } else {
      console.log("Using file-based configuration service")
      configuration = await SiteConfigurationFileService.getConfiguration(configKey)
    }
    
    if (!configuration) {
      console.log("No configuration found, returning default")
      // Return a default configuration if none exists
      return NextResponse.json(SiteConfigurationFileService.getDefaultConfiguration(configKey))
    }
    
    console.log("Configuration found:", configuration)
    return NextResponse.json(configuration)
  } catch (error) {
    console.error("Error fetching site configuration:", error)
    // Return default configuration on error instead of error response
    const defaultConfig = SiteConfigurationFileService.getDefaultConfiguration("homepage")
    return NextResponse.json(defaultConfig)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { configKey = "homepage", ...configData } = body
    
    console.log("Updating configuration for key:", configKey)
    console.log("Configuration data:", configData)
    
    // TODO: Add authentication check here
    // const session = await getSession(request)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    
    // Try MongoDB first, fallback to file system
    const mongoAvailable = await isMongoAvailable()
    console.log("MongoDB available for update:", mongoAvailable)
    
    let configuration
    if (mongoAvailable) {
      configuration = await SiteConfigurationService.updateConfiguration(
        configKey,
        configData,
        "admin" // TODO: Use actual user ID from session
      )
    } else {
      console.log("Using file-based configuration service for update")
      configuration = await SiteConfigurationFileService.updateConfiguration(
        configKey,
        configData,
        "admin"
      )
    }
    
    console.log("Configuration updated successfully:", configuration)
    return NextResponse.json(configuration)
  } catch (error) {
    console.error("Error updating site configuration:", error)
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack)
    }
    return NextResponse.json(
      { 
        error: "Failed to update site configuration",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}