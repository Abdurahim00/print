const { MongoClient } = require('mongodb')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL

if (!MONGODB_URI) {
  console.error('MONGODB_URI or DATABASE_URL not found in environment variables')
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('DATABASE')))
  throw new Error('Please define MONGODB_URI or DATABASE_URL in .env.local')
}

const sampleTemplates = [
  {
    name: "Basic Text Template",
    description: "Simple template with customizable text",
    category: "text",
    price: "free",
    isActive: true,
    image: "/api/placeholder/400/400",
    previewImage: "/api/placeholder/400/400",
    canvasJSON: JSON.stringify({
      version: "6.4.3",
      objects: [
        {
          type: "textbox",
          text: "Your Text Here",
          left: 200,
          top: 150,
          width: 200,
          fontSize: 32,
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#000000",
          textAlign: "center"
        },
        {
          type: "textbox",
          text: "Add Your Subtitle",
          left: 200,
          top: 220,
          width: 200,
          fontSize: 18,
          fontFamily: "Arial",
          fill: "#666666",
          textAlign: "center"
        }
      ]
    })
  },
  {
    name: "Logo & Text",
    description: "Template with logo placeholder and text",
    category: "business",
    price: "free",
    isActive: true,
    image: "/api/placeholder/400/400",
    previewImage: "/api/placeholder/400/400",
    canvasJSON: JSON.stringify({
      version: "6.4.3",
      objects: [
        {
          type: "rect",
          left: 225,
          top: 100,
          width: 150,
          height: 150,
          fill: "#e0e0e0",
          stroke: "#999999",
          strokeWidth: 2,
          rx: 10,
          ry: 10
        },
        {
          type: "textbox",
          text: "LOGO",
          left: 275,
          top: 160,
          width: 50,
          fontSize: 20,
          fontFamily: "Arial",
          fill: "#999999",
          textAlign: "center"
        },
        {
          type: "textbox",
          text: "Company Name",
          left: 200,
          top: 280,
          width: 200,
          fontSize: 24,
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#000000",
          textAlign: "center"
        }
      ]
    })
  },
  {
    name: "Badge Design",
    description: "Circular badge template",
    category: "graphics",
    price: "free",
    isActive: true,
    image: "/api/placeholder/400/400",
    previewImage: "/api/placeholder/400/400",
    canvasJSON: JSON.stringify({
      version: "6.4.3",
      objects: [
        {
          type: "circle",
          left: 200,
          top: 150,
          radius: 100,
          fill: "#ff6b6b",
          stroke: "#ffffff",
          strokeWidth: 5
        },
        {
          type: "textbox",
          text: "SPECIAL",
          left: 235,
          top: 200,
          width: 130,
          fontSize: 28,
          fontFamily: "Arial Black",
          fontWeight: "bold",
          fill: "#ffffff",
          textAlign: "center"
        },
        {
          type: "textbox",
          text: "LIMITED EDITION",
          left: 235,
          top: 235,
          width: 130,
          fontSize: 12,
          fontFamily: "Arial",
          fill: "#ffffff",
          textAlign: "center"
        }
      ]
    })
  },
  {
    name: "Motivational Quote",
    description: "Inspiring quote template",
    category: "quotes",
    price: "free",
    isActive: true,
    image: "/api/placeholder/400/400",
    previewImage: "/api/placeholder/400/400",
    canvasJSON: JSON.stringify({
      version: "6.4.3",
      objects: [
        {
          type: "rect",
          left: 150,
          top: 100,
          width: 300,
          height: 250,
          fill: "rgba(0,0,0,0)",
          stroke: "#333333",
          strokeWidth: 3,
          strokeDashArray: [10, 5]
        },
        {
          type: "textbox",
          text: "Dream Big",
          left: 200,
          top: 150,
          width: 200,
          fontSize: 36,
          fontFamily: "Georgia",
          fontStyle: "italic",
          fill: "#2c3e50",
          textAlign: "center"
        },
        {
          type: "textbox",
          text: "Work Hard",
          left: 200,
          top: 200,
          width: 200,
          fontSize: 36,
          fontFamily: "Georgia",
          fontStyle: "italic",
          fill: "#34495e",
          textAlign: "center"
        },
        {
          type: "textbox",
          text: "Stay Humble",
          left: 200,
          top: 250,
          width: 200,
          fontSize: 36,
          fontFamily: "Georgia",
          fontStyle: "italic",
          fill: "#2c3e50",
          textAlign: "center"
        }
      ]
    })
  },
  {
    name: "Sports Team",
    description: "Team name and number template",
    category: "sports",
    price: "free",
    isActive: true,
    image: "/api/placeholder/400/400",
    previewImage: "/api/placeholder/400/400",
    canvasJSON: JSON.stringify({
      version: "6.4.3",
      objects: [
        {
          type: "textbox",
          text: "TEAM NAME",
          left: 200,
          top: 120,
          width: 200,
          fontSize: 32,
          fontFamily: "Impact",
          fill: "#ff0000",
          stroke: "#000000",
          strokeWidth: 2,
          textAlign: "center"
        },
        {
          type: "textbox",
          text: "01",
          left: 250,
          top: 180,
          width: 100,
          fontSize: 72,
          fontFamily: "Arial Black",
          fontWeight: "bold",
          fill: "#000000",
          textAlign: "center"
        },
        {
          type: "textbox",
          text: "PLAYER",
          left: 225,
          top: 280,
          width: 150,
          fontSize: 20,
          fontFamily: "Arial",
          fill: "#000000",
          textAlign: "center"
        }
      ]
    })
  }
]

async function addSampleTemplates() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db('printwrap-pro')
    const templatesCollection = db.collection('templates')

    // Clear existing templates (optional)
    const clearExisting = process.argv.includes('--clear')
    if (clearExisting) {
      const deleteResult = await templatesCollection.deleteMany({})
      console.log(`Cleared ${deleteResult.deletedCount} existing templates`)
    }

    // Add timestamps and IDs
    const templatesWithMeta = sampleTemplates.map(template => ({
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    // Insert templates
    const result = await templatesCollection.insertMany(templatesWithMeta)
    console.log(`Successfully added ${result.insertedCount} sample templates`)

    // Display the templates
    console.log('\nAdded templates:')
    templatesWithMeta.forEach(t => {
      console.log(`- ${t.name} (${t.category}): ${t.description}`)
    })

  } catch (error) {
    console.error('Error adding sample templates:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('\nDatabase connection closed')
  }
}

// Run the script
addSampleTemplates()