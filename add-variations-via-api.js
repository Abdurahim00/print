async function addVariationsViaAPI() {
  const productId = '68be85eb094d08828df03170';
  const apiUrl = `http://localhost:3000/api/products/${productId}`;
  
  // First get the current product
  try {
    const getResponse = await fetch(apiUrl);
    const product = await getResponse.json();
    
    console.log('Current product:', product.name);
    console.log('Current hasVariations:', product.hasVariations);
    
    // Prepare variations with angle images
    const variations = [
      {
        id: 'var_black',
        name: 'Black Version',
        color: {
          name: 'Black',
          hex_code: '#000000'
        },
        price: product.price || 29.99,
        images: [
          {
            id: 'img_black_front',
            url: product.image || '/placeholder.jpg',
            alt_text: 'Black Front View',
            angle: 'front',
            is_primary: true
          },
          {
            id: 'img_black_back',
            url: product.backImage || product.image || '/placeholder.jpg',
            alt_text: 'Black Back View',
            angle: 'back',
            is_primary: false
          },
          {
            id: 'img_black_left',
            url: product.leftImage || product.image || '/placeholder.jpg',
            alt_text: 'Black Left View',
            angle: 'left',
            is_primary: false
          },
          {
            id: 'img_black_right',
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
        id: 'var_white',
        name: 'White Version',
        color: {
          name: 'White',
          hex_code: '#FFFFFF'
        },
        price: product.price || 29.99,
        images: [
          {
            id: 'img_white_front',
            url: product.image || '/placeholder.jpg',
            alt_text: 'White Front View',
            angle: 'front',
            is_primary: true
          },
          {
            id: 'img_white_back',
            url: product.backImage || product.image || '/placeholder.jpg',
            alt_text: 'White Back View',
            angle: 'back',
            is_primary: false
          },
          {
            id: 'img_white_left',
            url: product.leftImage || product.image || '/placeholder.jpg',
            alt_text: 'White Left View',
            angle: 'left',
            is_primary: false
          }
        ],
        positionMapping: 'front',
        inStock: true
      },
      {
        id: 'var_red',
        name: 'Red Version',
        color: {
          name: 'Red',
          hex_code: '#FF0000'
        },
        price: product.price || 29.99,
        images: [
          {
            id: 'img_red_front',
            url: product.image || '/placeholder.jpg',
            alt_text: 'Red Front View',
            angle: 'front',
            is_primary: true
          },
          {
            id: 'img_red_back',
            url: product.backImage || product.image || '/placeholder.jpg',
            alt_text: 'Red Back View',
            angle: 'back',
            is_primary: false
          }
        ],
        positionMapping: 'front',
        inStock: true
      }
    ];
    
    // Update the product with variations (exclude _id and id fields)
    const { _id, id, ...productWithoutId } = product;
    const updateData = {
      ...productWithoutId,
      hasVariations: true,
      variations: variations,
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
        },
        {
          position: 'left',
          width: 25,
          height: 35,
          x: 37,
          y: 22
        },
        {
          position: 'right',
          width: 25,
          height: 35,
          x: 37,
          y: 22
        }
      ],
      designCostPerCm2: product.designCostPerCm2 || 0.08,
      variantPositionMappings: {
        'var_black': {
          'front': 'front',
          'back': 'back',
          'left': 'left',
          'right': 'right'
        },
        'var_white': {
          'front': 'front',
          'back': 'back',
          'left': 'left'
        },
        'var_red': {
          'front': 'front',
          'back': 'back'
        }
      }
    };
    
    const putResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    if (putResponse.ok) {
      const updatedProduct = await putResponse.json();
      console.log('✅ Successfully updated product with variations!');
      console.log('Updated hasVariations:', updatedProduct.hasVariations);
      console.log('Variations count:', updatedProduct.variations ? updatedProduct.variations.length : 0);
      
      // Show first variation details
      if (updatedProduct.variations && updatedProduct.variations.length > 0) {
        console.log('\nFirst variation:');
        console.log('- Name:', updatedProduct.variations[0].name);
        console.log('- Color:', updatedProduct.variations[0].color);
        console.log('- Images count:', updatedProduct.variations[0].images ? updatedProduct.variations[0].images.length : 0);
        
        if (updatedProduct.variations[0].images) {
          console.log('- Image angles:', updatedProduct.variations[0].images.map(img => img.angle).join(', '));
        }
      }
    } else {
      console.error('Failed to update product:', putResponse.status, putResponse.statusText);
      const errorText = await putResponse.text();
      console.error('Error details:', errorText);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
addVariationsViaAPI();