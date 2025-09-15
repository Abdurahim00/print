import { NextResponse } from "next/server"

// Demo orders endpoint for testing
export async function GET() {
  const demoOrders = [
    {
      id: "ORD-DEMO-304476",
      customer: "Sarah Johnson",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@demoprintwrap.com",
      customerPhone: "555-1234",
      customerAddress: "456 Print Avenue",
      customerCity: "Design City",
      customerPostalCode: "54321",
      customerCountry: "USA",
      date: "2025-09-08",
      total: 189.95,
      status: "Queued",
      paymentMethod: "card",
      shippingOption: "standard",
      items: [
        {
          id: "demo-tshirt-001",
          name: "Premium Cotton T-Shirt",
          price: 39.99,
          quantity: 2,
          size: "Medium",
          color: "Navy Blue",
          designData: {
            hasCustomDesign: true,
            designElements: [
              {
                type: "text",
                content: "CUSTOM BRAND",
                fontSize: 56,
                fontFamily: "Impact",
                fill: "#FFFFFF",
                position: { x: 400, y: 200 }
              },
              {
                type: "text",
                content: "EST. 2025",
                fontSize: 28,
                fontFamily: "Arial",
                fill: "#FFD700",
                position: { x: 400, y: 280 }
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
                  text: "CUSTOM BRAND",
                  fontSize: 56,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  fill: "#FFFFFF",
                  stroke: "#000000",
                  strokeWidth: 2,
                  left: 400,
                  top: 200,
                  originX: "center",
                  originY: "center"
                },
                {
                  type: "text",
                  text: "EST. 2025",
                  fontSize: 28,
                  fontFamily: "Arial",
                  fill: "#FFD700",
                  left: 400,
                  top: 280,
                  originX: "center",
                  originY: "center"
                },
                {
                  type: "rect",
                  left: 400,
                  top: 450,
                  width: 400,
                  height: 3,
                  fill: "#FFFFFF",
                  originX: "center",
                  originY: "center"
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
            }
          },
          designContext: {
            viewMode: "front",
            productColor: "#1e3a8a",
            selectedVariation: {
              variationImages: [
                {
                  url: "/images/placeholder-tshirt.jpg",
                  angle: "front"
                },
                {
                  url: "/images/placeholder-tshirt-back.jpg",
                  angle: "back"
                }
              ]
            }
          }
        },
        {
          id: "demo-mug-002",
          name: "Ceramic Coffee Mug",
          price: 24.99,
          quantity: 3,
          size: "11oz",
          color: "White",
          designData: {
            hasCustomDesign: true,
            canvasJSON: {
              version: "5.3.0",
              width: 400,
              height: 400,
              backgroundColor: "#FFFFFF",
              objects: [
                {
                  type: "text",
                  text: "COFFEE FIRST",
                  fontSize: 42,
                  fontFamily: "Georgia",
                  fill: "#8B4513",
                  left: 200,
                  top: 150,
                  originX: "center",
                  originY: "center"
                },
                {
                  type: "circle",
                  radius: 50,
                  fill: "#8B4513",
                  left: 200,
                  top: 250,
                  originX: "center",
                  originY: "center"
                },
                {
                  type: "text",
                  text: "☕",
                  fontSize: 48,
                  fill: "#FFFFFF",
                  left: 200,
                  top: 250,
                  originX: "center",
                  originY: "center"
                }
              ]
            }
          },
          designContext: {
            viewMode: "front",
            productColor: "#FFFFFF"
          }
        },
        {
          id: "demo-hoodie-003",
          name: "Pullover Hoodie",
          price: 49.99,
          quantity: 1,
          size: "Large",
          color: "Black",
          designData: {
            hasCustomDesign: true,
            canvasJSON: {
              version: "5.3.0",
              width: 800,
              height: 600,
              backgroundColor: "transparent",
              objects: [
                {
                  type: "text",
                  text: "NIGHT MODE",
                  fontSize: 64,
                  fontFamily: "Courier New",
                  fill: "#00FF00",
                  left: 400,
                  top: 300,
                  originX: "center",
                  originY: "center",
                  shadow: {
                    color: "#00FF00",
                    blur: 20,
                    offsetX: 0,
                    offsetY: 0
                  }
                },
                {
                  type: "rect",
                  left: 400,
                  top: 300,
                  width: 450,
                  height: 100,
                  fill: "transparent",
                  stroke: "#00FF00",
                  strokeWidth: 2,
                  strokeDashArray: [10, 5],
                  rx: 10,
                  ry: 10,
                  originX: "center",
                  originY: "center"
                }
              ]
            }
          },
          designContext: {
            viewMode: "front",
            productColor: "#000000"
          }
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "ORD-TEST-999999",
      customer: "Test Customer",
      customerName: "Test Customer",
      date: "2025-09-08",
      total: 99.99,
      status: "Printing",
      items: [
        {
          id: "test-1",
          name: "Simple T-Shirt",
          price: 99.99,
          quantity: 1,
          designData: {
            hasCustomDesign: true,
            canvasJSON: {
              version: "5.3.0",
              width: 400,
              height: 400,
              backgroundColor: "transparent",
              objects: [
                {
                  type: "text",
                  text: "TEST",
                  fontSize: 72,
                  fontFamily: "Arial",
                  fill: "#FF0000",
                  left: 200,
                  top: 200,
                  originX: "center",
                  originY: "center"
                }
              ]
            }
          }
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  
  return NextResponse.json(demoOrders)
}