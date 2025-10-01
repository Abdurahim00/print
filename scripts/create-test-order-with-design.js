const { MongoClient } = require('mongodb')

async function createTestOrderWithFullDesign() {
  const uri = 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/printwrap-pro?retryWrites=true&w=majority'
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('printwrap-pro')
    const ordersCollection = db.collection('orders')
    
    // Create a comprehensive test order with full design data
    const testOrder = {
      orderId: 'ORD-DESIGN-' + Date.now().toString().slice(-6),
      customer: 'Print Test Customer',
      customerName: 'John Print Designer',
      customerEmail: 'designer@printwrap.com',
      customerPhone: '555-0123',
      customerAddress: '123 Design Street',
      customerCity: 'Print City',
      customerPostalCode: '12345',
      customerCountry: 'USA',
      date: new Date().toISOString().split('T')[0],
      total: 299.97,
      status: 'Queued',
      paymentMethod: 'card',
      shippingOption: 'express',
      items: [
        {
          id: 'prod-001',
          name: 'Custom T-Shirt with Full Design',
          price: 49.99,
          quantity: 3,
          size: 'Large',
          color: 'Blue',
          designData: {
            hasCustomDesign: true,
            designElements: [
              {
                type: 'text',
                content: 'TEAM PRINTWRAP 2025',
                fontSize: 48,
                fontFamily: 'Arial Black',
                fill: '#FF0000',
                position: { x: 200, y: 150 }
              },
              {
                type: 'text',
                content: 'Champions Edition',
                fontSize: 24,
                fontFamily: 'Arial',
                fill: '#0000FF',
                position: { x: 220, y: 220 }
              }
            ],
            canvasJSON: {
              version: "5.3.0",
              width: 800,
              height: 600,
              backgroundColor: "transparent",
              objects: [
                {
                  type: "text",
                  version: "5.3.0",
                  originX: "left",
                  originY: "top",
                  left: 200,
                  top: 150,
                  width: 400,
                  height: 56,
                  fill: "#FF0000",
                  stroke: null,
                  strokeWidth: 1,
                  text: "TEAM PRINTWRAP 2025",
                  fontSize: 48,
                  fontWeight: "bold",
                  fontFamily: "Arial Black",
                  textAlign: "center",
                  lineHeight: 1.16,
                  charSpacing: 0
                },
                {
                  type: "text",
                  version: "5.3.0",
                  originX: "left",
                  originY: "top",
                  left: 220,
                  top: 220,
                  width: 360,
                  height: 28,
                  fill: "#0000FF",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                  text: "Champions Edition",
                  fontSize: 24,
                  fontWeight: "normal",
                  fontFamily: "Arial",
                  textAlign: "center",
                  lineHeight: 1.16,
                  charSpacing: 0
                },
                {
                  type: "rect",
                  version: "5.3.0",
                  originX: "left",
                  originY: "top",
                  left: 150,
                  top: 300,
                  width: 500,
                  height: 100,
                  fill: "rgba(255,255,0,0.3)",
                  stroke: "#FFD700",
                  strokeWidth: 3,
                  rx: 10,
                  ry: 10,
                  angle: 0,
                  scaleX: 1,
                  scaleY: 1
                },
                {
                  type: "circle",
                  version: "5.3.0",
                  originX: "left",
                  originY: "top",
                  left: 100,
                  top: 100,
                  radius: 30,
                  fill: "#00FF00",
                  stroke: "#008000",
                  strokeWidth: 2,
                  angle: 0,
                  scaleX: 1,
                  scaleY: 1
                }
              ]
            },
            designCanvasJSON: {
              version: "5.3.0",
              width: 800,
              height: 600,
              backgroundColor: "transparent",
              objects: [
                {
                  type: "text",
                  text: "TEAM PRINTWRAP 2025",
                  fontSize: 48,
                  fontFamily: "Arial Black",
                  fill: "#FF0000",
                  left: 200,
                  top: 150
                },
                {
                  type: "text",
                  text: "Champions Edition",
                  fontSize: 24,
                  fontFamily: "Arial",
                  fill: "#0000FF",
                  left: 220,
                  top: 220
                }
              ]
            },
            previewImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
          },
          designContext: {
            selectedVariation: {
              variationImages: [
                {
                  url: 'https://via.placeholder.com/800x600/4169E1/FFFFFF?text=T-Shirt+Front',
                  angle: 'front'
                },
                {
                  url: 'https://via.placeholder.com/800x600/4169E1/FFFFFF?text=T-Shirt+Back',
                  angle: 'back'
                }
              ]
            }
          }
        },
        {
          id: 'prod-002',
          name: 'Custom Cap with Logo',
          price: 34.99,
          quantity: 2,
          size: 'One Size',
          color: 'Black',
          designData: {
            hasCustomDesign: true,
            canvasJSON: {
              version: "5.3.0",
              width: 400,
              height: 300,
              backgroundColor: "#FFFFFF",
              objects: [
                {
                  type: "text",
                  text: "LOGO",
                  fontSize: 72,
                  fontFamily: "Impact",
                  fill: "#FFD700",
                  left: 150,
                  top: 100,
                  stroke: "#000000",
                  strokeWidth: 3
                }
              ]
            }
          }
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await ordersCollection.insertOne(testOrder)
    console.log('Test order with full design created:', testOrder.orderId)
    console.log('Inserted ID:', result.insertedId)
    
    // Verify it was created
    const found = await ordersCollection.findOne({ orderId: testOrder.orderId })
    console.log('Order verified in database:', found ? 'YES' : 'NO')
    console.log('Has design data:', found?.items[0]?.designData ? 'YES' : 'NO')
    console.log('Has canvas JSON:', found?.items[0]?.designData?.canvasJSON ? 'YES' : 'NO')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

createTestOrderWithFullDesign()