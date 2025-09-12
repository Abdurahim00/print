async function fixProductImages() {
  const productId = '68be85eb094d08828df03170';
  const apiUrl = `http://localhost:3000/api/products/${productId}`;
  
  try {
    // First get the current product
    const getResponse = await fetch(apiUrl);
    const product = await getResponse.json();
    
    console.log('Current product:', product.name);
    console.log('Has images array:', product.images ? product.images.length : 0);
    
    // Remove _id and id fields to avoid immutable field error
    const { _id, id, ...productWithoutId } = product;
    
    // Use the real images from the images array
    const realImages = product.images || [];
    const mainImage = realImages[0] || '/placeholder.jpg';
    
    // Update with real images
    const updateData = {
      ...productWithoutId,
      image: mainImage,  // Set the main image
      imageUrl: mainImage,  // Also set imageUrl
      frontImage: realImages[0] || mainImage,
      backImage: realImages[1] || mainImage,
      leftImage: realImages[2] || mainImage,
      rightImage: realImages[3] || mainImage,
      materialImage: realImages[4] || mainImage,
      // Keep the rest of the configuration
      hasVariations: false,
      variations: [],
      angles: ['front', 'back', 'left', 'right'],
      isDesignable: true,
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
      console.log('✅ Successfully updated product images!');
      console.log('Main image:', updatedProduct.image);
      console.log('frontImage:', updatedProduct.frontImage);
      console.log('backImage:', updatedProduct.backImage);
      console.log('leftImage:', updatedProduct.leftImage);
      console.log('rightImage:', updatedProduct.rightImage);
    } else {
      console.error('Failed to update product:', putResponse.status, putResponse.statusText);
      const errorText = await putResponse.text();
      console.error('Error details:', errorText);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixProductImages();