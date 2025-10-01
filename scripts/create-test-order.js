const { MongoClient } = require('mongodb')

async function createTestOrder() {
  const uri = 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/printwrap-pro?retryWrites=true&w=majority'
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('printwrap-pro')
    const ordersCollection = db.collection('orders')
    
    // Create a test order with design data
    const testOrder = {
      orderId: 'ORD-' + Date.now().toString().slice(-6),
      customer: 'Test Customer',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      date: new Date().toISOString().split('T')[0],
      total: 149.99,
      status: 'Queued',
      items: [
        {
          id: 'test-product-1',
          name: 'Custom T-Shirt',
          price: 49.99,
          quantity: 2,
          size: 'Large',
          color: 'Blue',
          designData: {
            hasCustomDesign: true,
            designElements: [
              {
                type: 'text',
                content: 'TEAM 2025',
                fontSize: 48,
                fontFamily: 'Arial',
                fill: '#FF0000',
                position: { x: 200, y: 150 }
              },
              {
                type: 'image',
                src: 'https://via.placeholder.com/100',
                position: { x: 250, y: 250 },
                scale: 1.5
              }
            ],
            canvasJSON: '{"version":"5.3.0","objects":[]}',
            previewImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
          }
        },
        {
          id: 'test-product-2',
          name: 'Basic Cap',
          price: 24.99,
          quantity: 2,
          size: 'One Size',
          color: 'Black'
        }
      ],
      paymentMethod: 'card',
      shippingOption: 'standard',
      customerAddress: '123 Test Street',
      customerCity: 'Test City',
      customerPostalCode: '12345',
      customerCountry: 'USA',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await ordersCollection.insertOne(testOrder)
    console.log('Test order created:', testOrder.orderId)
    console.log('Inserted ID:', result.insertedId)
    
    // Verify it was created
    const found = await ordersCollection.findOne({ orderId: testOrder.orderId })
    console.log('Order verified in database:', found ? 'YES' : 'NO')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

createTestOrder()