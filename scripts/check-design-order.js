const { MongoClient } = require('mongodb')

async function checkDesignOrder() {
  const uri = 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/printwrap-pro?retryWrites=true&w=majority'
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('printwrap-pro')
    const ordersCollection = db.collection('orders')
    
    // Find the design order
    const designOrder = await ordersCollection.findOne({ orderId: { $regex: 'DESIGN' } })
    
    if (designOrder) {
      console.log('\nOrder found:', designOrder.orderId)
      console.log('Items count:', designOrder.items.length)
      
      if (designOrder.items[0]) {
        const firstItem = designOrder.items[0]
        console.log('\nFirst item:')
        console.log('  Name:', firstItem.name)
        console.log('  Has designData:', !!firstItem.designData)
        
        if (firstItem.designData) {
          console.log('  DesignData keys:', Object.keys(firstItem.designData))
          console.log('  Has canvasJSON:', !!firstItem.designData.canvasJSON)
          console.log('  Has designCanvasJSON:', !!firstItem.designData.designCanvasJSON)
          console.log('  Has designElements:', !!firstItem.designData.designElements)
          
          if (firstItem.designData.canvasJSON) {
            console.log('  CanvasJSON has objects:', !!firstItem.designData.canvasJSON.objects)
            if (firstItem.designData.canvasJSON.objects) {
              console.log('  Number of canvas objects:', firstItem.designData.canvasJSON.objects.length)
            }
          }
        }
      }
    } else {
      console.log('No design order found')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('\nConnection closed')
  }
}

checkDesignOrder()