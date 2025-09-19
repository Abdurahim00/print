import dotenv from "dotenv"
import path from "path"
import { MongoClient } from "mongodb"
import puppeteer from "puppeteer"
import axios from "axios"

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function scrapeImagesFromUrl(url: string): Promise<string[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    console.log(`  Navigating to: ${url}`)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    // Wait for images to load
    await page.waitForSelector('img', { timeout: 10000 }).catch(() => {})

    // Extract image URLs from the page
    const imageUrls = await page.evaluate(() => {
      const images: string[] = []

      // Look for product images in common selectors
      const selectors = [
        '.product-image img',
        '.product-images img',
        '.product-gallery img',
        '.swiper-slide img',
        '.slick-slide img',
        '[data-image] img',
        '.gallery img',
        '.product-photo img',
        'img[src*="product"]',
        'img[src*="itemimage"]',
        'img[src*="media"]'
      ]

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(img => {
          const src = (img as HTMLImageElement).src
          if (src && !src.includes('placeholder') && !src.includes('loader')) {
            images.push(src)
          }
        })
      })

      // If no images found with specific selectors, get all images
      if (images.length === 0) {
        document.querySelectorAll('img').forEach(img => {
          const src = (img as HTMLImageElement).src
          if (src &&
              !src.includes('logo') &&
              !src.includes('icon') &&
              !src.includes('placeholder') &&
              !src.includes('loader') &&
              !src.includes('banner') &&
              (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp'))) {
            images.push(src)
          }
        })
      }

      return [...new Set(images)] // Remove duplicates
    })

    console.log(`  Found ${imageUrls.length} images`)
    return imageUrls.slice(0, 10) // Return max 10 images

  } catch (error) {
    console.error(`  Error scraping ${url}:`, error.message)
    return []
  } finally {
    await browser.close()
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

  // Process products in batches to avoid overwhelming the server
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
      await delay(2000)

    } catch (error) {
      console.error(`  ❌ Error processing product:`, error.message)
      failedCount++
    }

    // Stop after 10 products for testing (remove this limit for full run)
    if (i >= 9) {
      console.log("\n⚠️  Stopping after 10 products (test mode)")
      break
    }
  }

  console.log("\n=== Summary ===")
  console.log(`✅ Successfully updated: ${updatedCount} products`)
  console.log(`❌ Failed: ${failedCount} products`)

  await client.close()
  process.exit(0)
}

scrapeMissingImages().catch(err => {
  console.error("Fatal error:", err)
  process.exit(1)
})