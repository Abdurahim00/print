import dotenv from "dotenv"
import path from "path"
import { MongoClient } from "mongodb"
import axios from "axios"
import * as cheerio from "cheerio"

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function scrapeImagesFromUrl(url: string): Promise<string[]> {
  try {
    console.log(`  Fetching: ${url}`)

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      timeout: 10000
    })

    const $ = cheerio.load(response.data)
    const images: string[] = []

    // Look for product images with various selectors
    const selectors = [
      '.product-image img',
      '.product-images img',
      '.product-gallery img',
      '.gallery-image img',
      '.item-images img',
      '.images img',
      'img.product-img',
      'img[data-src]',
      'img[data-lazy]',
      '.carousel img',
      '.slider img',
      '.swiper-slide img',
      '.slick-slide img',
      '[data-image] img',
      '.product-photo img',
      'img[src*="product"]',
      'img[src*="itemimage"]',
      'img[src*="media"]',
      'img[src*="static.unpr.io"]'
    ]

    // Try each selector
    selectors.forEach(selector => {
      $(selector).each((_, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('data-lazy')
        if (src) {
          // Make absolute URL if relative
          const absoluteUrl = src.startsWith('http') ? src : new URL(src, url).href
          if (!images.includes(absoluteUrl) &&
              !absoluteUrl.includes('placeholder') &&
              !absoluteUrl.includes('loader') &&
              !absoluteUrl.includes('logo') &&
              !absoluteUrl.includes('icon')) {
            images.push(absoluteUrl)
          }
        }
      })
    })

    // If no images found with specific selectors, get all images
    if (images.length === 0) {
      $('img').each((_, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('data-lazy')
        if (src) {
          const absoluteUrl = src.startsWith('http') ? src : new URL(src, url).href
          if (!images.includes(absoluteUrl) &&
              !absoluteUrl.includes('logo') &&
              !absoluteUrl.includes('icon') &&
              !absoluteUrl.includes('placeholder') &&
              !absoluteUrl.includes('loader') &&
              !absoluteUrl.includes('banner') &&
              (absoluteUrl.includes('.jpg') ||
               absoluteUrl.includes('.jpeg') ||
               absoluteUrl.includes('.png') ||
               absoluteUrl.includes('.webp'))) {
            images.push(absoluteUrl)
          }
        }
      })
    }

    console.log(`  Found ${images.length} images`)
    return images.slice(0, 10) // Return max 10 images

  } catch (error: any) {
    console.error(`  Error scraping ${url}:`, error.message)
    return []
  }
}

async function scrapeMissingImages() {
  console.log("Starting to scrape missing product images...")

  const client = new MongoClient(process.env.MONGODB_URI!)
  await client.connect()
  const db = client.db('printwrap-pro')
  const collection = db.collection('products')

  // Get products without images
  const productsWithoutImages = await collection.find({
    $and: [
      { sourceUrl: { $exists: true, $ne: null, $ne: '' } },
      { $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: null }
      ]}
    ]
  }).toArray()

  console.log(`Found ${productsWithoutImages.length} products without images`)

  let updatedCount = 0
  let failedCount = 0

  // Process products
  for (let i = 0; i < productsWithoutImages.length; i++) {
    const product = productsWithoutImages[i]
    console.log(`\n[${i + 1}/${productsWithoutImages.length}] Processing: ${product.name}`)

    try {
      const images = await scrapeImagesFromUrl(product.sourceUrl)

      if (images.length > 0) {
        // Update product with scraped images
        await collection.updateOne(
          { _id: product._id },
          {
            $set: {
              images: images,
              imageUrl: images[0], // Set first image as primary
              updatedAt: new Date()
            }
          }
        )
        updatedCount++
        console.log(`  ✅ Updated with ${images.length} images`)
      } else {
        failedCount++
        console.log(`  ❌ No images found`)
      }

      // Add delay between requests to be respectful
      await delay(1000)

    } catch (error: any) {
      console.error(`  ❌ Error processing product:`, error.message)
      failedCount++
    }

    // Stop after 20 products for testing (remove this limit for full run)
    if (i >= 19) {
      console.log("\n⚠️  Stopping after 20 products (test mode)")
      break
    }
  }

  console.log("\n=== Summary ===")
  console.log(`✅ Successfully updated: ${updatedCount} products`)
  console.log(`❌ Failed: ${failedCount} products`)

  // Verify the updates
  const stillMissingImages = await collection.countDocuments({
    $or: [
      { images: { $exists: false } },
      { images: { $size: 0 } },
      { images: null }
    ]
  })
  console.log(`\nProducts still without images: ${stillMissingImages}`)

  await client.close()
  process.exit(0)
}

scrapeMissingImages().catch(err => {
  console.error("Fatal error:", err)
  process.exit(1)
})