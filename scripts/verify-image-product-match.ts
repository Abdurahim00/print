import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''

interface MismatchReport {
  productId: string
  productName: string
  categoryId: string
  categoryName?: string
  imageUrl: string
  issue: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  suggestedAction: string
}

// Keywords that indicate product types
const PRODUCT_KEYWORDS = {
  apparel: [
    't-shirt', 'tshirt', 'shirt', 'hoodie', 'sweatshirt', 'jacket', 'coat', 
    'pants', 'jeans', 'shorts', 'dress', 'skirt', 'blouse', 'sweater',
    'polo', 'tank top', 'vest', 'uniform', 'overall', 'tröja', 'jacka',
    'byxa', 'kläder', 'textile', 'garment', 'wear', 'clothing'
  ],
  
  food: [
    'chocolate', 'candy', 'sweet', 'snack', 'food', 'drink', 'beverage',
    'coffee', 'tea', 'juice', 'energy', 'bar', 'cookie', 'cake', 'chips',
    'nuts', 'fruit', 'vegetable', 'meal', 'sauce', 'spice', 'choklad',
    'kakor', 'godis', 'dryck', 'energidryck', 'ingefära', 'shot'
  ],
  
  accessories: [
    'bag', 'backpack', 'wallet', 'belt', 'hat', 'cap', 'glove', 'scarf',
    'watch', 'jewelry', 'necklace', 'bracelet', 'ring', 'earring', 'väska',
    'bälte', 'hatt', 'mössa', 'handskar', 'halsduk', 'ryggsäck'
  ],
  
  electronics: [
    'phone', 'computer', 'laptop', 'tablet', 'headphone', 'speaker',
    'charger', 'cable', 'mouse', 'keyboard', 'monitor', 'printer',
    'camera', 'electronic', 'device', 'gadget', 'tech'
  ],
  
  home: [
    'glass', 'mug', 'cup', 'plate', 'bowl', 'pot', 'pan', 'kitchen',
    'furniture', 'lamp', 'candle', 'vase', 'decor', 'towel', 'bedding',
    'pillow', 'blanket', 'rug', 'curtain', 'glas', 'mugg', 'tallrik',
    'skål', 'ljus', 'vas', 'kudde', 'täcke', 'pläd', 'karaff'
  ],
  
  toys: [
    'toy', 'game', 'puzzle', 'doll', 'figure', 'lego', 'board game',
    'card', 'playing', 'children', 'kids', 'pussel', 'spel', 'leksak'
  ],
  
  sports: [
    'ball', 'soccer', 'football', 'basketball', 'tennis', 'golf',
    'fitness', 'gym', 'yoga', 'running', 'cycling', 'swimming',
    'sport', 'exercise', 'training', 'workout'
  ],
  
  safety: [
    'helmet', 'safety', 'protection', 'glove', 'mask', 'goggles',
    'vest', 'shoe', 'boot', 'hjälm', 'skydd', 'säkerhet', 'sko',
    'stövel', 'handskar', 'visir', 'knäskydd'
  ],
  
  office: [
    'pen', 'pencil', 'notebook', 'folder', 'binder', 'paper', 'desk',
    'chair', 'stationary', 'office', 'business', 'card', 'badge',
    'lanyard', 'penna', 'papper', 'mapp', 'kontor', 'kort'
  ],
  
  promotional: [
    'promotional', 'promo', 'gift', 'giveaway', 'swag', 'branded',
    'custom', 'logo', 'corporate', 'marketing', 'advertising',
    'reklam', 'present', 'gåva', 'profil'
  ]
}

// Image URL patterns that indicate product types
const IMAGE_URL_PATTERNS = {
  apparel: [
    /clothing/i, /apparel/i, /fashion/i, /wear/i, /textile/i,
    /tshirt/i, /shirt/i, /hoodie/i, /jacket/i, /pants/i
  ],
  food: [
    /food/i, /beverage/i, /drink/i, /snack/i, /candy/i,
    /chocolate/i, /coffee/i, /tea/i, /energy/i
  ],
  accessories: [
    /accessory/i, /accessories/i, /bag/i, /wallet/i, /belt/i
  ],
  electronics: [
    /electronic/i, /tech/i, /device/i, /gadget/i, /computer/i
  ],
  home: [
    /home/i, /kitchen/i, /furniture/i, /decor/i, /glass/i,
    /mug/i, /cup/i, /plate/i, /bowl/i
  ]
}

function detectProductType(name: string, description?: string): string[] {
  const types: string[] = []
  const searchText = `${name} ${description || ''}`.toLowerCase()
  
  for (const [type, keywords] of Object.entries(PRODUCT_KEYWORDS)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      types.push(type)
    }
  }
  
  return types
}

function detectImageType(url: string): string[] {
  const types: string[] = []
  
  for (const [type, patterns] of Object.entries(IMAGE_URL_PATTERNS)) {
    if (patterns.some(pattern => pattern.test(url))) {
      types.push(type)
    }
  }
  
  // Also check for specific file names in the URL
  const urlLower = url.toLowerCase()
  for (const [type, keywords] of Object.entries(PRODUCT_KEYWORDS)) {
    if (keywords.some(keyword => urlLower.includes(keyword.replace(' ', '-')))) {
      if (!types.includes(type)) {
        types.push(type)
      }
    }
  }
  
  return types
}

function checkForMismatch(
  productName: string,
  productDescription: string,
  imageUrl: string,
  categoryName?: string
): { isMismatch: boolean; issue: string; severity: 'HIGH' | 'MEDIUM' | 'LOW' } {
  const productTypes = detectProductType(productName, productDescription)
  const imageTypes = detectImageType(imageUrl)
  
  // Special cases that are definitely wrong
  const criticalMismatches = [
    { product: ['food', 'chocolate', 'candy'], image: ['clothing', 'apparel', 'shirt', 'jacket'] },
    { product: ['clothing', 'shirt', 'jacket', 'pants'], image: ['food', 'chocolate', 'drink'] },
    { product: ['electronics', 'phone', 'computer'], image: ['food', 'clothing'] },
    { product: ['toy', 'game', 'puzzle'], image: ['food', 'safety', 'office'] }
  ]
  
  // Check for critical mismatches
  for (const mismatch of criticalMismatches) {
    const hasProductMatch = mismatch.product.some(term => 
      productName.toLowerCase().includes(term) || 
      (productDescription && productDescription.toLowerCase().includes(term))
    )
    const hasImageMatch = mismatch.image.some(term => 
      imageUrl.toLowerCase().includes(term)
    )
    
    if (hasProductMatch && hasImageMatch) {
      return {
        isMismatch: true,
        issue: `Critical mismatch: Product appears to be ${mismatch.product.join('/')} but image suggests ${mismatch.image.join('/')}`,
        severity: 'HIGH'
      }
    }
  }
  
  // Check if product types and image types have no overlap
  if (productTypes.length > 0 && imageTypes.length > 0) {
    const hasOverlap = productTypes.some(pt => imageTypes.includes(pt))
    if (!hasOverlap) {
      return {
        isMismatch: true,
        issue: `Type mismatch: Product is ${productTypes.join('/')} but image appears to be ${imageTypes.join('/')}`,
        severity: 'MEDIUM'
      }
    }
  }
  
  // Check for placeholder images
  if (imageUrl.includes('placeholder') || imageUrl.includes('placehold.co')) {
    return {
      isMismatch: false,
      issue: 'Using placeholder image',
      severity: 'LOW'
    }
  }
  
  // Check for generic product images that might not match
  if (imageUrl.includes('generic') || imageUrl.includes('default')) {
    return {
      isMismatch: false,
      issue: 'Using generic/default image',
      severity: 'LOW'
    }
  }
  
  return { isMismatch: false, issue: '', severity: 'LOW' }
}

async function verifyImageProductMatches() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables')
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    const productsCollection = db.collection('products')
    const categoriesCollection = db.collection('categories')
    
    // Get all categories for reference
    const categories = await categoriesCollection.find({}).toArray()
    const categoryMap = new Map(categories.map(c => [c._id.toString(), c.name]))
    
    // Get all products with images
    const products = await productsCollection.find({
      image: { $exists: true, $ne: null, $ne: '' }
    }).toArray()
    
    console.log(`📊 Analyzing ${products.length} products with images...`)
    
    const mismatches: MismatchReport[] = []
    const suspicious: MismatchReport[] = []
    let checkedCount = 0
    
    for (const product of products) {
      checkedCount++
      
      if (checkedCount % 100 === 0) {
        console.log(`Progress: ${checkedCount}/${products.length}`)
      }
      
      const categoryName = product.categoryId ? categoryMap.get(product.categoryId.toString()) : undefined
      
      // Check main image
      if (product.image && !product.image.includes('placehold')) {
        const check = checkForMismatch(
          product.name,
          product.description,
          product.image,
          categoryName
        )
        
        if (check.isMismatch || check.severity !== 'LOW') {
          const report: MismatchReport = {
            productId: product._id.toString(),
            productName: product.name,
            categoryId: product.categoryId,
            categoryName,
            imageUrl: product.image,
            issue: check.issue,
            severity: check.severity,
            suggestedAction: check.severity === 'HIGH' 
              ? 'URGENT: Review and replace image immediately'
              : check.severity === 'MEDIUM'
              ? 'Review image for accuracy'
              : 'Consider finding better image'
          }
          
          if (check.isMismatch) {
            mismatches.push(report)
          } else {
            suspicious.push(report)
          }
        }
      }
      
      // Check additional images
      if (product.additionalImages && Array.isArray(product.additionalImages)) {
        for (const additionalImage of product.additionalImages) {
          const check = checkForMismatch(
            product.name,
            product.description,
            additionalImage,
            categoryName
          )
          
          if (check.isMismatch && check.severity === 'HIGH') {
            mismatches.push({
              productId: product._id.toString(),
              productName: product.name,
              categoryId: product.categoryId,
              categoryName,
              imageUrl: additionalImage,
              issue: `Additional image: ${check.issue}`,
              severity: check.severity,
              suggestedAction: 'Review and remove mismatched additional image'
            })
          }
        }
      }
    }
    
    // Sort by severity
    mismatches.sort((a, b) => {
      const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
    
    // Generate report
    const reportPath = path.join(process.cwd(), 'image-mismatch-report.json')
    const report = {
      summary: {
        totalProductsChecked: products.length,
        criticalMismatches: mismatches.filter(m => m.severity === 'HIGH').length,
        mediumMismatches: mismatches.filter(m => m.severity === 'MEDIUM').length,
        lowPrioritySuspicious: suspicious.length,
        generatedAt: new Date().toISOString()
      },
      criticalMismatches: mismatches.filter(m => m.severity === 'HIGH'),
      mediumMismatches: mismatches.filter(m => m.severity === 'MEDIUM'),
      suspiciousMatches: suspicious
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    
    // Print summary
    console.log(`
📊 Image-Product Match Verification Complete
============================================
Total Products Checked: ${products.length}

🚨 CRITICAL MISMATCHES: ${report.summary.criticalMismatches}
⚠️  Medium Priority: ${report.summary.mediumMismatches}
📝 Low Priority/Suspicious: ${report.summary.lowPrioritySuspicious}

Report saved to: image-mismatch-report.json
`)
    
    // Print critical mismatches for immediate attention
    if (report.criticalMismatches.length > 0) {
      console.log('\n🚨 CRITICAL MISMATCHES REQUIRING IMMEDIATE ATTENTION:')
      console.log('=' .repeat(60))
      
      for (const mismatch of report.criticalMismatches.slice(0, 10)) {
        console.log(`
Product: ${mismatch.productName}
Category: ${mismatch.categoryName || 'Unknown'}
Issue: ${mismatch.issue}
Image URL: ${mismatch.imageUrl.substring(0, 80)}...
Action: ${mismatch.suggestedAction}
---`)
      }
      
      if (report.criticalMismatches.length > 10) {
        console.log(`\n... and ${report.criticalMismatches.length - 10} more critical mismatches.`)
        console.log('Check image-mismatch-report.json for full details.')
      }
    } else {
      console.log('\n✅ No critical mismatches found! Product images appear to match their descriptions.')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('\n✅ Analysis complete')
  }
}

// Run the verification
verifyImageProductMatches().catch(console.error)