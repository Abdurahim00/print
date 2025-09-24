const { MongoClient } = require('mongodb')

async function listRecentOrders() {
  const uri = 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/printwrap-pro?retryWrites=true&w=majority'
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB\n')
    
    const db = client.db('printwrap-pro')
    const ordersCollection = db.collection('orders')
    
    // Count total orders
    const totalCount = await ordersCollection.countDocuments({})
    console.log(`Total orders in database: ${totalCount}`)
    
    // Get recent orders
    const recentOrders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()
    
    console.log(`\nMost recent ${recentOrders.length} orders:`)
    console.log('─'.repeat(80))
    
    recentOrders.forEach((order, index) => {
      const hasDesignData = order.items?.some(item => 
        item.designData?.canvasJSON || item.designData?.designCanvasJSON
      )
      
      console.log(`${index + 1}. Order ID: ${order.orderId}`)
      console.log(`   Customer: ${order.customerName || order.customer || 'Unknown'}`)
      console.log(`   Status: ${order.status}`)
      console.log(`   Date: ${order.date || new Date(order.createdAt).toISOString().split('T')[0]}`)
      console.log(`   Total: $${order.total || 0}`)
      console.log(`   Items: ${order.items?.length || 0}`)
      console.log(`   Has Design Data: ${hasDesignData ? '✅ YES' : '❌ NO'}`)
      console.log('─'.repeat(80))
    })
    
    // Check specifically for demo orders
    const demoOrders = await ordersCollection
      .find({ orderId: { $regex: 'DEMO|DESIGN' } })
      .toArray()
    
    if (demoOrders.length > 0) {
      console.log(`\n🎯 Found ${demoOrders.length} demo/design orders:`)
      demoOrders.forEach(order => {
        console.log(`   - ${order.orderId} (${order.status})`)
      })
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
    console.log('\nConnection closed')
  }
}

listRecentOrders()