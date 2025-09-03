import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap'
const DATABASE_NAME = process.env.DATABASE_NAME || 'printwrap'

// The Swedish text to remove
const textToRemove = `Prident Sveriges ledande producent av promotionprodukter som tillverkas i Bredaryd, mitt i hjärtat av Småland. Sortimentet inkluderar reflexer, vattenflaskor, isskrapor, muggar, smörknivar, frisbees med mera. Stor expertis inom tryck, inklusive digitalt, screen, tampo och lasergravyr på olika material. Hög kompetens och modern utrustning gör Prident till en naturlig samarbetspartner för företag som behöver trycka på produkter utanför sin egen produktion. Visa samtliga produkter frånPrident`

async function cleanProductDescriptions() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Find all products that contain this text in their description
    const products = await productsCollection.find({
      description: { $regex: 'Prident Sveriges ledande producent', $options: 'i' }
    }).toArray()
    
    console.log(`Found ${products.length} products with Prident text in description`)
    
    let updatedCount = 0
    
    for (const product of products) {
      if (product.description) {
        // Remove the Prident text and any variations
        let cleanedDescription = product.description
        
        // Remove the exact text
        cleanedDescription = cleanedDescription.replace(textToRemove, '').trim()
        
        // Also remove partial matches with "Visa samtliga produkter"
        cleanedDescription = cleanedDescription.replace(/Visa samtliga produkter från\s*\w+/gi, '').trim()
        
        // Remove any standalone Prident sentences
        cleanedDescription = cleanedDescription.replace(/Prident Sveriges ledande producent.*?Visa samtliga produkter från\s*\w+/gis, '').trim()
        
        // Update the product if description changed
        if (cleanedDescription !== product.description) {
          await productsCollection.updateOne(
            { _id: product._id },
            { $set: { description: cleanedDescription } }
          )
          updatedCount++
          console.log(`Updated product: ${product.name}`)
        }
      }
    }
    
    console.log(`\nCleaning complete! Updated ${updatedCount} products`)
    
  } catch (error) {
    console.error('Error cleaning product descriptions:', error)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

// Run the script
cleanProductDescriptions().catch(console.error)