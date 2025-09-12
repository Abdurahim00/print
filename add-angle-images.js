async function addAngleImages() {
  const productId = '68be85eb094d08828df03170';
  const apiUrl = `http://localhost:3000/api/products/${productId}`;
  
  try {
    // First get the current product
    const getResponse = await fetch(apiUrl);
    const product = await getResponse.json();
    
    console.log('Current product:', product.name);
    console.log('Current image:', product.image);
    
    // Remove _id and id fields to avoid immutable field error
    const { _id, id, ...productWithoutId } = product;
    
    // Add angle images - using the main product image for different angles
    // In production, you would upload actual different angle images in the admin dashboard
    const updateData = {
      ...productWithoutId,
      hasVariations: false,  // No variations, just angle images
      variations: [],
      frontImage: product.image || '/placeholder.jpg',
      backImage: product.image || '/placeholder.jpg', // You would set different image URLs here
      leftImage: product.image || '/placeholder.jpg',
      rightImage: product.image || '/placeholder.jpg',
      frontAltText: 'Front view of ' + product.name,
      backAltText: 'Back view of ' + product.name,
      leftAltText: 'Left view of ' + product.name,
      rightAltText: 'Right view of ' + product.name,
      angles: ['front', 'back', 'left', 'right'], // Explicitly set angles
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
      designCostPerCm2: product.designCostPerCm2 || 0.08
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
      console.log('✅ Successfully added angle images to product!');
      console.log('frontImage:', updatedProduct.frontImage);
      console.log('backImage:', updatedProduct.backImage);
      console.log('leftImage:', updatedProduct.leftImage);
      console.log('rightImage:', updatedProduct.rightImage);
      console.log('angles:', updatedProduct.angles);
      console.log('hasVariations:', updatedProduct.hasVariations);
    } else {
      console.error('Failed to update product:', putResponse.status, putResponse.statusText);
      const errorText = await putResponse.text();
      console.error('Error details:', errorText);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addAngleImages();