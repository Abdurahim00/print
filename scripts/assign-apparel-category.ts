#!/usr/bin/env node
import * as dotenv from "dotenv"
dotenv.config()

import { MongoClient, ObjectId } from "mongodb"

async function assignApparelCategory() {
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
    
    console.log("Apparel Category ID:", apparelCategory._id.toString())
    
    // Find products that look like apparel (T-shirt, shirt, etc.)
    const apparelProducts = await db.collection("products").find({
      $or: [
        { name: /t-shirt/i },
        { name: /shirt/i },
        { name: /tröja/i },
        { name: /hoodie/i },
        { name: /jacket/i }
      ]
    }).limit(10).toArray()
    
    console.log(`\nFound ${apparelProducts.length} apparel-like products`)
    
    // Update them to use Apparel category
    for (const product of apparelProducts) {
      const result = await db.collection("products").updateOne(
        { _id: product._id },
        { $set: { categoryId: apparelCategory._id } }
      )
      console.log(`Updated ${product.name}: ${result.modifiedCount > 0 ? 'SUCCESS' : 'FAILED'}`)
    }
    
    // Test one of them
    if (apparelProducts.length > 0) {
      const testProduct = apparelProducts[0]
      console.log(`\nTesting product: ${testProduct.name} (${testProduct._id.toString()})`)
      
      const baseUrl = 'http://localhost:3000'
      try {
        const response = await fetch(`${baseUrl}/api/products/${testProduct._id.toString()}`)
        const data = await response.json()
        console.log(`API Response:`)
        console.log(`  - categoryId: ${data.categoryId}`)
        console.log(`  - name: ${data.name}`)
        
        if (data.categoryId) {
          const catResponse = await fetch(`${baseUrl}/api/categories/${data.categoryId}`)
          const catData = await catResponse.json()
          console.log(`\nCategory API Response:`)
          console.log(`  - name: ${catData.name}`)
          console.log(`  - isDesignable: ${catData.isDesignable}`)
          console.log(`  - designUpchargePercent: ${catData.designUpchargePercent}`)
        }
        
        console.log(`\nProduct page URL: ${baseUrl}/product/${testProduct._id.toString()}`)
      } catch (error: any) {
        console.log(`API Error:`, error.message)
      }
    }
    
  } finally {
    await client.close()
  }
}

assignApparelCategory().catch(console.error)