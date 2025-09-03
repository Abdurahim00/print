#!/usr/bin/env node
import * as dotenv from "dotenv"
dotenv.config()

import { MongoClient, ObjectId } from "mongodb"

async function findApparelProducts() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db("printwrap-pro")
  
  try {
    // Find Apparel category
    const apparelCategory = await db.collection("categories").findOne({ name: "Apparel" })
    if (!apparelCategory) {
      console.log("Apparel category not found!")
      return
    }
    
    console.log("Apparel Category:")
    console.log("  ID:", apparelCategory._id.toString())
    console.log("  isDesignable:", apparelCategory.isDesignable)
    console.log("  designUpchargePercent:", apparelCategory.designUpchargePercent)
    
    // Find products with Apparel category
    const products = await db.collection("products").find({ 
      categoryId: apparelCategory._id 
    }).limit(5).toArray()
    
    console.log(`\nFound ${products.length} products with Apparel category:`)
    
    for (const product of products) {
      console.log(`\n- ${product.name}`)
      console.log(`  ID: ${product._id.toString()}`)
      console.log(`  categoryId: ${product.categoryId}`)
      
      // Test API for this product
      const baseUrl = 'http://localhost:3000'
      try {
        const response = await fetch(`${baseUrl}/api/products/${product._id.toString()}`)
        const data = await response.json()
        console.log(`  API categoryId: ${data.categoryId}`)
        
        // Test product page URL
        const productPageUrl = `${baseUrl}/product/${product._id.toString()}`
        console.log(`  Product page: ${productPageUrl}`)
      } catch (error: any) {
        console.log(`  API Error:`, error.message)
      }
    }
    
  } finally {
    await client.close()
  }
}

findApparelProducts().catch(console.error)