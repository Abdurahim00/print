import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''

interface ImageIssue {
  productId: string
  productName: string
  field: string
  value: string
  issue: string
  suggestion: string
}

// Check if string looks like it should be an image URL
function looksLikeImageUrl(str: string): boolean {
  if (!str || typeof str !== 'string') return false
  
  // Common image file extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff?)$/i
  
  // Common image URL patterns
  const imagePatterns = [
    /cloudinary\.com/i,
    /amazonaws\.com.*\.(jpg|jpeg|png|gif|webp)/i,
    /googleusercontent\.com/i,
    /fbcdn\.net/i,
    /instagram\.com.*\/media/i,
    /imgur\.com/i,
    /flickr\.com/i,
    /wp-content\/uploads/i,
    /\/images?\//i,
    /\/media\//i,
    /\/photo/i,
    /\/picture/i,
    /\/gallery/i,
    /\/product/i
  ]
  
  // Check if it has an image extension
  if (imageExtensions.test(str)) return true
  
  // Check if it matches common image URL patterns
  return imagePatterns.some(pattern => pattern.test(str))
}

// Check for various image URL issues
function detectImageUrlIssues(value: string): { hasIssue: boolean; issue: string; suggestion: string } | null {
  if (!value || typeof value !== 'string') return null
  
  // Check for double http/https
  if (/https?:\/\/https?:\/\//i.test(value)) {
    return {
      hasIssue: true,
      issue: 'Double protocol (http://http:// or similar)',
      suggestion: 'Remove duplicate protocol'
    }
  }
  
  // Check for malformed protocols
  if (/^(htp|htps|http[^s]:|https[^:]|ttp|tps):/i.test(value)) {
    return {
      hasIssue: true,
      issue: 'Malformed protocol',
      suggestion: 'Fix protocol to http:// or https://'
    }
  }
  
  // Check for missing protocol but looks like URL
  if (/^(www\.|[a-z]+\.(com|net|org|io))/i.test(value) && !/^https?:\/\//i.test(value)) {
    return {
      hasIssue: true,
      issue: 'Missing protocol',
      suggestion: 'Add http:// or https:// prefix'
    }
  }
  
  // Check for escaped URL encoding issues
  if (/%25[0-9A-F]{2}/i.test(value)) {
    return {
      hasIssue: true,
      issue: 'Double URL encoding',
      suggestion: 'Decode URL properly'
    }
  }
  
  // Check for broken/incomplete URLs
  if (/^https?:\/\/[^\/]+$/i.test(value) && !value.includes('.')) {
    return {
      hasIssue: true,
      issue: 'Incomplete URL (no domain extension)',
      suggestion: 'Complete the URL with proper domain'
    }
  }
  
  // Check for localhost URLs in production
  if (/localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(value)) {
    return {
      hasIssue: true,
      issue: 'Local development URL',
      suggestion: 'Replace with production URL'
    }
  }
  
  // Check for file:// protocol
  if (/^file:\/\//i.test(value)) {
    return {
      hasIssue: true,
      issue: 'Local file protocol',
      suggestion: 'Upload to server and use HTTP URL'
    }
  }
  
  // Check for C:\ or similar local paths
  if (/^[A-Z]:\\/i.test(value) || /^\/Users\/|^\/home\//i.test(value)) {
    return {
      hasIssue: true,
      issue: 'Local file system path',
      suggestion: 'Upload to server and use HTTP URL'
    }
  }
  
  // Check if it's just a filename without path
  if (/^[^\/\\]+\.(jpg|jpeg|png|gif|webp)$/i.test(value)) {
    return {
      hasIssue: true,
      issue: 'Filename without path',
      suggestion: 'Add full URL path to image'
    }
  }
  
  // Check for spaces in URL (not encoded)
  if (/https?:\/\/.*\s+.*\.(jpg|jpeg|png|gif|webp)/i.test(value)) {
    return {
      hasIssue: true,
      issue: 'Unencoded spaces in URL',
      suggestion: 'Encode spaces as %20'
    }
  }
  
  // Check for backslashes instead of forward slashes
  if (value.includes(':\\\\') || value.includes(':\\')) {
    return {
      hasIssue: true,
      issue: 'Backslashes in URL',
      suggestion: 'Replace backslashes with forward slashes'
    }
  }
  
  // Check if it looks like it should be an image but isn't properly formatted
  if (looksLikeImageUrl(value) && !value.startsWith('http') && !value.startsWith('//') && !value.startsWith('data:')) {
    return {
      hasIssue: true,
      issue: 'Possible image URL without proper format',
      suggestion: 'Add proper URL protocol'
    }
  }
  
  return null
}

// Check if a field contains text that might be an unparsed image URL
function detectUnparsedImageUrls(value: string): string[] {
  if (!value || typeof value !== 'string') return []
  
  const unparsedUrls: string[] = []
  
  // Regex to find potential URLs in text
  const urlPatterns = [
    /(?:^|\s)((?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/[^\s]*)?\.(?:jpg|jpeg|png|gif|webp))/gi,
    /\[img\]([^\[]+)\[\/img\]/gi,
    /<img[^>]+src="([^"]+)"/gi,
    /!\[([^\]]*)\]\(([^)]+)\)/g, // Markdown image syntax
    /image:\s*([^\s,;]+\.(?:jpg|jpeg|png|gif|webp))/gi
  ]
  
  urlPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(value)) !== null) {
      const url = match[1] || match[2]
      if (url && !url.startsWith('data:')) {
        unparsedUrls.push(url)
      }
    }
  })
  
  return unparsedUrls
}

async function detectAllImageIssues() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found')
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    const productsCollection = db.collection('products')
    
    const products = await productsCollection.find({}).toArray()
    console.log(`📊 Checking ${products.length} products for image URL issues...`)
    
    const issues: ImageIssue[] = []
    let checkedCount = 0
    
    for (const product of products) {
      checkedCount++
      if (checkedCount % 500 === 0) {
        console.log(`Progress: ${checkedCount}/${products.length}`)
      }
      
      // Fields to check for image URLs
      const fieldsToCheck = [
        'image',
        'thumbnail',
        'imageUrl',
        'imageURL',
        'mainImage',
        'primaryImage',
        'photo',
        'picture'
      ]
      
      // Check main fields
      for (const field of fieldsToCheck) {
        if (product[field]) {
          const issueResult = detectImageUrlIssues(product[field])
          if (issueResult) {
            issues.push({
              productId: product._id.toString(),
              productName: product.name || 'Unknown',
              field,
              value: product[field].substring(0, 200),
              issue: issueResult.issue,
              suggestion: issueResult.suggestion
            })
          }
        }
      }
      
      // Check arrays
      const arrayFields = ['images', 'additionalImages', 'gallery', 'photos', 'individualAngleImages']
      for (const field of arrayFields) {
        if (product[field] && Array.isArray(product[field])) {
          product[field].forEach((item: any, index: number) => {
            if (typeof item === 'string') {
              const issueResult = detectImageUrlIssues(item)
              if (issueResult) {
                issues.push({
                  productId: product._id.toString(),
                  productName: product.name || 'Unknown',
                  field: `${field}[${index}]`,
                  value: item.substring(0, 200),
                  issue: issueResult.issue,
                  suggestion: issueResult.suggestion
                })
              }
            }
          })
        }
      }
      
      // Check description and other text fields for unparsed image URLs
      const textFields = ['description', 'details', 'content', 'body']
      for (const field of textFields) {
        if (product[field]) {
          const unparsedUrls = detectUnparsedImageUrls(product[field])
          if (unparsedUrls.length > 0) {
            unparsedUrls.forEach(url => {
              issues.push({
                productId: product._id.toString(),
                productName: product.name || 'Unknown',
                field: `${field} (unparsed)`,
                value: url,
                issue: 'Image URL found in text field',
                suggestion: 'Extract to proper image field'
              })
            })
          }
        }
      }
      
      // Check variants
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach((variant: any, vIndex: number) => {
          const variantImageFields = ['image', 'imageUrl', 'photo']
          for (const field of variantImageFields) {
            if (variant[field]) {
              const issueResult = detectImageUrlIssues(variant[field])
              if (issueResult) {
                issues.push({
                  productId: product._id.toString(),
                  productName: product.name || 'Unknown',
                  field: `variants[${vIndex}].${field}`,
                  value: variant[field].substring(0, 200),
                  issue: issueResult.issue,
                  suggestion: issueResult.suggestion
                })
              }
            }
          }
        })
      }
    }
    
    // Group issues by type
    const issuesByType: { [key: string]: number } = {}
    issues.forEach(issue => {
      issuesByType[issue.issue] = (issuesByType[issue.issue] || 0) + 1
    })
    
    // Save report
    const report = {
      summary: {
        totalProducts: products.length,
        totalIssues: issues.length,
        issuesByType,
        generatedAt: new Date().toISOString()
      },
      issues: issues.sort((a, b) => a.issue.localeCompare(b.issue))
    }
    
    fs.writeFileSync('image-url-issues-report.json', JSON.stringify(report, null, 2))
    
    // Print summary
    console.log(`
📊 Image URL Issues Detection Complete
======================================
Total Products Checked: ${products.length}
Total Issues Found: ${issues.length}

Issues by Type:
${Object.entries(issuesByType)
  .sort((a, b) => b[1] - a[1])
  .map(([type, count]) => `  • ${type}: ${count}`)
  .join('\n')}

Report saved to: image-url-issues-report.json
`)
    
    // Show sample issues
    if (issues.length > 0) {
      console.log('\n📋 Sample Issues:')
      console.log('='.repeat(60))
      
      issues.slice(0, 5).forEach(issue => {
        console.log(`
Product: ${issue.productName}
Field: ${issue.field}
Issue: ${issue.issue}
Value: ${issue.value}
Fix: ${issue.suggestion}
---`)
      })
      
      if (issues.length > 5) {
        console.log(`\n... and ${issues.length - 5} more issues.`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('✅ Done')
  }
}

detectAllImageIssues().catch(console.error)