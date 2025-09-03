import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI!
const DATABASE_NAME = 'printwrap-pro'

// Simple HTML parser to extract images
function extractImagesFromHTML(html: string, productUrl: string): string[] {
  const images: string[] = []
  
  // Pattern 1: Look for product images in static.unpr.io domain
  const unprPattern = /https?:\/\/static\.unpr\.io\/itemimage\/[^"'\s]+\/products\/[^"'\s]+\.(?:jpg|jpeg|png|gif|webp)/gi
  const unprMatches = html.matchAll(unprPattern)
  for (const match of unprMatches) {
    images.push(match[0])
  }
  
  // Pattern 2: Look for image tags with product images
  const imgPattern = /<img[^>]+src=["']([^"']+static\.unpr\.io\/itemimage[^"']+)["'][^>]*>/gi
  const imgMatches = html.matchAll(imgPattern)
  for (const match of imgMatches) {
    if (!images.includes(match[1])) {
      images.push(match[1])
    }
  }
  
  // Pattern 3: Look for data-image or data-src attributes
  const dataPattern = /data-(?:image|src|zoom)=["']([^"']+static\.unpr\.io[^"']+\.(?:jpg|jpeg|png|gif|webp))["']/gi
  const dataMatches = html.matchAll(dataPattern)
  for (const match of dataMatches) {
    if (!images.includes(match[1])) {
      images.push(match[1])
    }
  }
  
  // Filter and deduplicate
  const uniqueImages = [...new Set(images)]
    .filter(img => !img.includes('placeholder'))
    .filter(img => img.includes('/products/'))
  
  return uniqueImages
}

async function fetchMissingImages() {
  console.log('=== FETCHING MISSING IMAGES FROM LIVE WEBSITE ===')
  
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Get products without images that have URLs
    const productsWithoutImages = await productsCollection.find({
      source: 'prendo',
      image: 'https://via.placeholder.com/500',
      'originalData.url': { $exists: true, $ne: null, $ne: '' }
    }).limit(500).toArray() // Fetch 500 at a time
    
    console.log(`Found ${productsWithoutImages.length} products to fetch images for`)
    
    let updated = 0
    let failed = 0
    
    for (const product of productsWithoutImages) {
      const url = product.originalData.url
      
      if (!url) continue
      
      try {
        console.log(`Fetching: ${url}`)
        
        // Fetch the page
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })
        
        if (!response.ok) {
          console.log(`  Failed to fetch: ${response.status}`)
          failed++
          continue
        }
        
        const html = await response.text()
        const images = extractImagesFromHTML(html, url)
        
        if (images.length > 0) {
          console.log(`  Found ${images.length} images`)
          
          // Update the product
          await productsCollection.updateOne(
            { _id: product._id },
            {
              $set: {
                image: images[0],
                images: images
              }
            }
          )
          updated++
        } else {
          console.log(`  No images found`)
          failed++
        }
        
        // Rate limit to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.log(`  Error: ${error}`)
        failed++
      }
    }
    
    // Final stats
    const stats = {
      total: await productsCollection.countDocuments({ source: 'prendo' }),
      withImages: await productsCollection.countDocuments({
        source: 'prendo',
        image: { $ne: 'https://via.placeholder.com/500' }
      }),
      withoutImages: await productsCollection.countDocuments({
        source: 'prendo',
        image: 'https://via.placeholder.com/500'
      })
    }
    
    console.log('\n=== RESULTS ===')
    console.log(`Updated: ${updated} products with new images`)
    console.log(`Failed: ${failed} products`)
    console.log('\nDatabase Status:')
    console.log(`Total products: ${stats.total}`)
    console.log(`WITH images: ${stats.withImages} (${((stats.withImages/stats.total)*100).toFixed(1)}%)`)
    console.log(`WITHOUT images: ${stats.withoutImages} (${((stats.withoutImages/stats.total)*100).toFixed(1)}%)`)
    
    if (stats.withoutImages > 0) {
      console.log(`\nNote: Still ${stats.withoutImages} products without images.`)
      console.log('These may need to be fetched in batches to avoid rate limiting.')
    }
    
  } finally {
    await client.close()
  }
}

fetchMissingImages().catch(console.error)