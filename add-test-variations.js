const { MongoClient, ObjectId } = require('mongodb');

async function addTestVariations() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('printwrap-pro');
    const collection = db.collection('products');
    
    const productId = new ObjectId('68be85eb094d08828df03170');
    
    // First, check current product state
    const product = await collection.findOne({ _id: productId });
    
    if (!product) {
      console.log('Product not found!');
      return;
    }
    
    console.log('Found product:', product.name);
    console.log('Current hasVariations:', product.hasVariations);
    console.log('Current variations count:', product.variations ? product.variations.length : 0);
    
    // Add test variations with different angles
    const testVariations = [
      {
        id: 'var_1',
        name: 'Black Version',
        color: {
          name: 'Black',
          hex_code: '#000000'
        },
        price: product.price || 29.99,
        images: [
          {
            id: 'img_1_front',
            url: product.image || '/placeholder.jpg',
            alt_text: 'Black Front View',
            angle: 'front',
            is_primary: true
          },
          {
            id: 'img_1_back',
            url: product.backImage || product.image || '/placeholder.jpg',
            alt_text: 'Black Back View',
            angle: 'back',
            is_primary: false
          },
          {
            id: 'img_1_left',
            url: product.leftImage || product.image || '/placeholder.jpg',
            alt_text: 'Black Left View',
            angle: 'left',
            is_primary: false
          },
          {
            id: 'img_1_right',
            url: product.rightImage || product.image || '/placeholder.jpg',
            alt_text: 'Black Right View',
            angle: 'right',
            is_primary: false
          }
        ],
        positionMapping: 'front',
        inStock: true
      },
      {
        id: 'var_2',
        name: 'White Version',
        color: {
          name: 'White',
          hex_code: '#FFFFFF'
        },
        price: product.price || 29.99,
        images: [
          {
            id: 'img_2_front',
            url: product.image || '/placeholder.jpg',
            alt_text: 'White Front View',
            angle: 'front',
            is_primary: true
          },
          {
            id: 'img_2_back',
            url: product.backImage || product.image || '/placeholder.jpg',
            alt_text: 'White Back View',
            angle: 'back',
            is_primary: false
          }
        ],
        positionMapping: 'front',
        inStock: true
      }
    ];
    
    // Update the product with variations
    const updateResult = await collection.updateOne(
      { _id: productId },
      {
        $set: {
          hasVariations: true,
          variations: testVariations,
          // Also ensure design fields are set
          isDesignable: true,
          designFrames: product.designFrames || [
            {
              position: 'front',
              width: 30,
              height: 40,
              x: 35,
              y: 20
            },
            {
              position: 'back',
              width: 30,
              height: 40,
              x: 35,
              y: 20
            }
          ],
          designCostPerCm2: product.designCostPerCm2 || 0.08,
          variantPositionMappings: {
            'var_1': {
              'front': 'front',
              'back': 'back',
              'left': 'left',
              'right': 'right'
            },
            'var_2': {
              'front': 'front',
              'back': 'back'
            }
          }
        }
      }
    );
    
    console.log('Update result:', updateResult);
    
    // Verify the update
    const updatedProduct = await collection.findOne({ _id: productId });
    console.log('Updated product hasVariations:', updatedProduct.hasVariations);
    console.log('Updated variations count:', updatedProduct.variations ? updatedProduct.variations.length : 0);
    
    if (updatedProduct.variations && updatedProduct.variations.length > 0) {
      console.log('First variation:', JSON.stringify(updatedProduct.variations[0], null, 2));
    }
    
    console.log('✅ Successfully added test variations to product!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

addTestVariations();