async function removeTestVariations() {
  const productId = '68be85eb094d08828df03170';
  const apiUrl = `http://localhost:3000/api/products/${productId}`;
  
  try {
    // First get the current product
    const getResponse = await fetch(apiUrl);
    const product = await getResponse.json();
    
    console.log('Current product:', product.name);
    console.log('Has variations:', product.hasVariations);
    console.log('Current variations count:', product.variations ? product.variations.length : 0);
    
    // Remove _id and id fields to avoid immutable field error
    const { _id, id, ...productWithoutId } = product;
    
    // Update to remove variations and set hasVariations to false
    const updateData = {
      ...productWithoutId,
      hasVariations: false,
      variations: []
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
      console.log('✅ Successfully removed variations from product!');
      console.log('Updated hasVariations:', updatedProduct.hasVariations);
      console.log('Variations count:', updatedProduct.variations ? updatedProduct.variations.length : 0);
    } else {
      console.error('Failed to update product:', putResponse.status, putResponse.statusText);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

removeTestVariations();