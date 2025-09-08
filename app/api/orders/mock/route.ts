import { NextResponse } from "next/server"

// Mock orders for testing when database is slow
export async function GET() {
  const mockOrders = [
    {
      id: "ORD-DEMO-304476",
      customer: "Sarah Johnson",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@demoprintwrap.com",
      date: "2025-09-08",
      total: 189.95,
      status: "Queued",
      items: [
        {
          id: "demo-tshirt-001",
          name: "Premium Cotton T-Shirt",
          price: 39.99,
          quantity: 2,
          size: "Medium",
          color: "Navy Blue",
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
              }
            ]
          },
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
          }
        },
        {
          id: "demo-mug-002",
          name: "Ceramic Coffee Mug",
          price: 24.99,
          quantity: 3,
          size: "11oz",
          color: "White",
          designContext: {
            viewMode: "front",
            productColor: "#FFFFFF",
            selectedVariation: {
              variationImages: [
                {
                  url: "/images/placeholder-mug.jpg",
                  angle: "front"
                },
                {
                  url: "/images/placeholder-mug-handle.jpg",
                  angle: "handle"
                }
              ]
            }
          },
          designCanvasJSON: {
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
              }
            ]
          },
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
                  top: 150
                }
              ]
            }
          }
        },
        {
          id: "demo-hoodie-003",
          name: "Pullover Hoodie",
          price: 49.99,
          quantity: 1,
          size: "Large",
          color: "Black",
          designContext: {
            viewMode: "front",
            productColor: "#000000",
            selectedVariation: {
              variationImages: [
                {
                  url: "/images/placeholder-hoodie.jpg",
                  angle: "front"
                },
                {
                  url: "/images/placeholder-hoodie-back.jpg",
                  angle: "back"
                }
              ]
            }
          },
          designCanvasJSON: {
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
                originY: "center"
              }
            ]
          },
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
                  top: 300
                }
              ]
            }
          }
        }
      ],
      paymentMethod: "card",
      shippingOption: "standard",
      customerAddress: "456 Print Avenue",
      customerCity: "Design City",
      customerPostalCode: "54321",
      customerCountry: "USA",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "ORD-TEST-999",
      customer: "Test Customer",
      date: "2025-09-08",
      total: 199.98,
      status: "Queued",
      items: [
        {
          id: "test-product-1",
          name: "Test Product with Design",
          price: 99.99,
          quantity: 2,
          designData: {
            hasCustomDesign: true,
            designElements: [
              {
                type: "text",
                content: "Custom Text",
                position: { x: 100, y: 100 }
              }
            ]
          }
        }
      ],
      paymentMethod: "card",
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "ORD-PRINT-888",
      customer: "PrintShop Customer",
      date: "2025-09-08",
      total: 119.97,
      status: "Printing",
      items: [
        {
          id: "prod-print",
          name: "T-Shirt with Custom Design",
          price: 39.99,
          quantity: 3,
          designData: {
            hasCustomDesign: true,
            designElements: [
              {
                type: "text",
                content: "TEAM 2025",
                fontSize: 48
              }
            ]
          }
        }
      ],
      paymentMethod: "card",
      customerName: "PrintShop Customer",
      customerEmail: "print@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  
  return NextResponse.json(mockOrders)
}