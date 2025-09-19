const { MongoClient } = require('mongodb')

async function createDemoOrder() {
  const uri = 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/printwrap-pro?retryWrites=true&w=majority'
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('printwrap-pro')
    const ordersCollection = db.collection('orders')
    
    // Create a comprehensive demo order with full design data
    const demoOrder = {
      orderId: 'ORD-DEMO-' + Date.now().toString().slice(-6),
      customer: 'Demo Customer',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@demoprintwrap.com',
      customerPhone: '555-1234',
      customerAddress: '456 Print Avenue',
      customerCity: 'Design City',
      customerPostalCode: '54321',
      customerCountry: 'USA',
      date: new Date().toISOString().split('T')[0],
      total: 189.95,
      status: 'Queued',
      paymentMethod: 'card',
      shippingOption: 'standard',
      items: [
        {
          id: 'demo-tshirt-001',
          name: 'Premium Cotton T-Shirt',
          price: 39.99,
          quantity: 2,
          size: 'Medium',
          color: 'Navy Blue',
          designData: {
            hasCustomDesign: true,
            designElements: [
              {
                type: 'text',
                content: 'CUSTOM BRAND',
                fontSize: 56,
                fontFamily: 'Impact',
                fill: '#FFFFFF',
                position: { x: 400, y: 200 }
              },
              {
                type: 'text',
                content: 'EST. 2025',
                fontSize: 28,
                fontFamily: 'Arial',
                fill: '#FFD700',
                position: { x: 400, y: 280 }
              },
              {
                type: 'shape',
                shapeType: 'star',
                fill: '#FF6B6B',
                position: { x: 400, y: 350 },
                size: { width: 80, height: 80 }
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
                  originX: "center",
                  originY: "center",
                  left: 400,
                  top: 200,
                  width: 350,
                  height: 65,
                  fill: "#FFFFFF",
                  stroke: "#000000",
                  strokeWidth: 2,
                  text: "CUSTOM BRAND",
                  fontSize: 56,
                  fontWeight: "bold",
                  fontFamily: "Impact",
                  textAlign: "center",
                  lineHeight: 1.16,
                  charSpacing: 20,
                  shadow: {
                    color: "rgba(0,0,0,0.3)",
                    blur: 5,
                    offsetX: 3,
                    offsetY: 3
                  }
                },
                {
                  type: "text",
                  version: "5.3.0",
                  originX: "center",
                  originY: "center",
                  left: 400,
                  top: 280,
                  width: 200,
                  height: 33,
                  fill: "#FFD700",
                  stroke: null,
                  text: "EST. 2025",
                  fontSize: 28,
                  fontWeight: "normal",
                  fontFamily: "Arial",
                  textAlign: "center",
                  fontStyle: "italic"
                },
                {
                  type: "polygon",
                  version: "5.3.0",
                  originX: "center",
                  originY: "center",
                  left: 400,
                  top: 350,
                  width: 80,
                  height: 80,
                  fill: "#FF6B6B",
                  stroke: "#FFFFFF",
                  strokeWidth: 3,
                  points: [
                    {x: 40, y: 0},
                    {x: 47, y: 27},
                    {x: 73, y: 27},
                    {x: 50, y: 43},
                    {x: 58, y: 70},
                    {x: 40, y: 54},
                    {x: 22, y: 70},
                    {x: 30, y: 43},
                    {x: 7, y: 27},
                    {x: 33, y: 27}
                  ],
                  angle: 0,
                  scaleX: 1,
                  scaleY: 1
                },
                {
                  type: "rect",
                  version: "5.3.0",
                  originX: "center",
                  originY: "center",
                  left: 400,
                  top: 450,
                  width: 400,
                  height: 3,
                  fill: "#FFFFFF",
                  stroke: null,
                  rx: 1.5,
                  ry: 1.5
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
                  text: "CUSTOM BRAND",
                  fontSize: 56,
                  fontFamily: "Impact",
                  fill: "#FFFFFF",
                  left: 400,
                  top: 200
                },
                {
                  type: "text",
                  text: "EST. 2025",
                  fontSize: 28,
                  fontFamily: "Arial",
                  fill: "#FFD700",
                  left: 400,
                  top: 280
                }
              ]
            },
            previewImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
          },
          designContext: {
            viewMode: 'front',
            productColor: '#1e3a8a',
            selectedTemplate: {
              id: 'template-001',
              name: 'Bold Brand Template'
            },
            selectedVariation: {
              variationImages: [
                {
                  url: 'https://via.placeholder.com/800x600/1e3a8a/FFFFFF?text=T-Shirt+Front+View',
                  angle: 'front'
                },
                {
                  url: 'https://via.placeholder.com/800x600/1e3a8a/FFFFFF?text=T-Shirt+Back+View',
                  angle: 'back'
                },
                {
                  url: 'https://via.placeholder.com/800x600/1e3a8a/FFFFFF?text=T-Shirt+Side+View',
                  angle: 'side'
                }
              ]
            }
          }
        },
        {
          id: 'demo-mug-002',
          name: 'Ceramic Coffee Mug',
          price: 24.99,
          quantity: 3,
          size: '11oz',
          color: 'White',
          designData: {
            hasCustomDesign: true,
            designElements: [
              {
                type: 'text',
                content: 'COFFEE FIRST',
                fontSize: 42,
                fontFamily: 'Georgia',
                fill: '#8B4513',
                position: { x: 200, y: 150 }
              },
              {
                type: 'image',
                src: 'https://via.placeholder.com/100x100/8B4513/FFFFFF?text=☕',
                position: { x: 200, y: 220 },
                size: { width: 100, height: 100 }
              }
            ],
            canvasJSON: {
              version: "5.3.0",
              width: 400,
              height: 400,
              backgroundColor: "#FFFFFF",
              objects: [
                {
                  type: "text",
                  version: "5.3.0",
                  originX: "center",
                  originY: "center",
                  left: 200,
                  top: 150,
                  width: 300,
                  height: 50,
                  fill: "#8B4513",
                  text: "COFFEE FIRST",
                  fontSize: 42,
                  fontWeight: "bold",
                  fontFamily: "Georgia",
                  textAlign: "center"
                },
                {
                  type: "rect",
                  version: "5.3.0",
                  originX: "center",
                  originY: "center",
                  left: 200,
                  top: 250,
                  width: 100,
                  height: 100,
                  fill: "#8B4513",
                  rx: 50,
                  ry: 50
                },
                {
                  type: "text",
                  version: "5.3.0",
                  originX: "center",
                  originY: "center",
                  left: 200,
                  top: 250,
                  width: 60,
                  height: 60,
                  fill: "#FFFFFF",
                  text: "☕",
                  fontSize: 48,
                  textAlign: "center"
                }
              ]
            }
          },
          designContext: {
            viewMode: 'front',
            productColor: '#FFFFFF',
            selectedVariation: {
              variationImages: [
                {
                  url: 'https://via.placeholder.com/400x400/FFFFFF/000000?text=Mug+Front',
                  angle: 'front'
                },
                {
                  url: 'https://via.placeholder.com/400x400/FFFFFF/000000?text=Mug+Handle',
                  angle: 'handle'
                }
              ]
            }
          }
        },
        {
          id: 'demo-hoodie-003',
          name: 'Pullover Hoodie',
          price: 49.99,
          quantity: 1,
          size: 'Large',
          color: 'Black',
          designData: {
            hasCustomDesign: true,
            designElements: [
              {
                type: 'text',
                content: 'NIGHT MODE',
                fontSize: 64,
                fontFamily: 'Courier New',
                fill: '#00FF00',
                position: { x: 400, y: 300 }
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
                  originX: "center",
                  originY: "center",
                  left: 400,
                  top: 300,
                  width: 400,
                  height: 75,
                  fill: "#00FF00",
                  text: "NIGHT MODE",
                  fontSize: 64,
                  fontWeight: "bold",
                  fontFamily: "Courier New",
                  textAlign: "center",
                  shadow: {
                    color: "#00FF00",
                    blur: 20,
                    offsetX: 0,
                    offsetY: 0
                  }
                },
                {
                  type: "rect",
                  version: "5.3.0",
                  originX: "center",
                  originY: "center",
                  left: 400,
                  top: 300,
                  width: 450,
                  height: 100,
                  fill: "transparent",
                  stroke: "#00FF00",
                  strokeWidth: 2,
                  strokeDashArray: [10, 5],
                  rx: 10,
                  ry: 10
                }
              ]
            }
          },
          designContext: {
            viewMode: 'front',
            productColor: '#000000',
            selectedVariation: {
              variationImages: [
                {
                  url: 'https://via.placeholder.com/800x600/000000/FFFFFF?text=Hoodie+Front',
                  angle: 'front'
                },
                {
                  url: 'https://via.placeholder.com/800x600/000000/FFFFFF?text=Hoodie+Back',
                  angle: 'back'
                }
              ]
            }
          }
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await ordersCollection.insertOne(demoOrder)
    console.log('\n✅ Demo order created successfully!')
    console.log('Order ID:', demoOrder.orderId)
    console.log('Customer:', demoOrder.customerName)
    console.log('Total:', '$' + demoOrder.total)
    console.log('Items:', demoOrder.items.length)
    console.log('\nItems with designs:')
    demoOrder.items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} - ${item.quantity}x @ $${item.price}`)
      if (item.designData?.canvasJSON?.objects) {
        console.log(`     ✓ ${item.designData.canvasJSON.objects.length} design elements`)
      }
    })
    console.log('\n📋 Next steps:')
    console.log('1. Go to http://localhost:3000/dashboard')
    console.log('2. Click on "Operations" tab')
    console.log('3. Find order', demoOrder.orderId)
    console.log('4. Click on the order to see details')
    console.log('5. Click "Complete Print Package" to test export')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('\nConnection closed')
  }
}

createDemoOrder()