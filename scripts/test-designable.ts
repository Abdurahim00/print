#!/usr/bin/env node
import * as dotenv from "dotenv"
dotenv.config()

import { getDatabase } from "../lib/mongodb"
import { ObjectId } from "mongodb"

async function testDesignableFeature() {
  console.log("🔍 Testing Designable Feature...")
  console.log("MongoDB URI:", process.env.MONGODB_URI ? "Found" : "Not found")
  
  const db = await getDatabase()
  
  // 1. Check categories for isDesignable
  console.log("\n📁 Checking Categories:")
  const categories = await db.collection("categories").find({}).toArray()
  categories.forEach(cat => {
    console.log(`  - ${cat.name}: isDesignable=${cat.isDesignable}, designUpchargePercent=${cat.designUpchargePercent}`)
  })
  
  // 2. Check a sample product's categoryId
  console.log("\n📦 Checking Sample Products:")
  const products = await db.collection("products").find({}).limit(5).toArray()
  for (const product of products) {
    const categoryId = product.categoryId
    console.log(`  - ${product.name}:`)
    console.log(`    categoryId: ${categoryId} (type: ${typeof categoryId})`)
    
    if (categoryId) {
      // Check if it's an ObjectId or string
      const isObjectId = categoryId instanceof ObjectId
      console.log(`    isObjectId: ${isObjectId}`)
      
      // Try to find the category
      let category = null
      if (isObjectId) {
        category = await db.collection("categories").findOne({ _id: categoryId })
      } else if (typeof categoryId === 'string' && /^[0-9a-fA-F]{24}$/.test(categoryId)) {
        category = await db.collection("categories").findOne({ _id: new ObjectId(categoryId) })
      } else {
        category = await db.collection("categories").findOne({ id: categoryId })
      }
      
      if (category) {
        console.log(`    ✓ Category found: ${category.name}, isDesignable=${category.isDesignable}`)
      } else {
        console.log(`    ✗ Category not found!`)
      }
    }
  }
  
  // 3. Test API endpoints
  console.log("\n🌐 Testing API Endpoints:")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  // Get first designable category
  const designableCategory = categories.find(c => c.isDesignable)
  if (designableCategory) {
    console.log(`  Testing category API for: ${designableCategory.name}`)
    try {
      const response = await fetch(`${baseUrl}/api/categories/${designableCategory._id.toString()}`)
      const data = await response.json()
      console.log(`    API Response: isDesignable=${data.isDesignable}, designUpchargePercent=${data.designUpchargePercent}`)
    } catch (error) {
      console.log(`    API Error:`, error)
    }
  }
  
  process.exit(0)
}

testDesignableFeature().catch(console.error)