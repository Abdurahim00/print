const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function fixOrderTotals() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const ordersCollection = db.collection('orders');
    
    // Find all orders
    const orders = await ordersCollection.find({}).toArray();
    console.log(`Found ${orders.length} orders to check`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    for (const order of orders) {
      // Check if order has a total field
      if (order.total === undefined || order.total === null) {
        // Calculate total from items
        let calculatedTotal = 0;
        
        if (order.items && Array.isArray(order.items)) {
          calculatedTotal = order.items.reduce((sum, item) => {
            const price = typeof item.price === 'number' ? item.price : 0;
            const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
            return sum + (price * quantity);
          }, 0);
        }
        
        // Update the order with calculated total
        await ordersCollection.updateOne(
          { _id: order._id },
          { 
            $set: { 
              total: calculatedTotal,
              updatedAt: new Date()
            } 
          }
        );
        
        console.log(`✅ Fixed order ${order.orderId || order._id}: total = ${calculatedTotal}`);
        fixedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Total orders: ${orders.length}`);
    console.log(`   Fixed: ${fixedCount}`);
    console.log(`   Already had total: ${skippedCount}`);
    
    if (fixedCount > 0) {
      console.log('\n✅ All orders now have total field!');
    } else {
      console.log('\n✅ All orders already had total field');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

fixOrderTotals();