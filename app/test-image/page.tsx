"use client"

import { useState, useEffect } from 'react'

export default function TestImagePage() {
  const [testResults, setTestResults] = useState<any[]>([])
  
  useEffect(() => {
    // Test loading a product image
    const testImageUrl = "https://static.unpr.io/itemimage/800/products/full/IMAGE-677b5ef2560c5.jpg"
    
    const results: any[] = []
    
    // Test 1: Can we fetch the API?
    fetch('/api/products?designableOnly=true&limit=1')
      .then(res => res.json())
      .then(data => {
        const product = data.products?.[0]
        results.push({
          test: 'API Fetch',
          success: !!product,
          data: product ? `Found: ${product.name}` : 'No product'
        })
        
        if (product) {
          // Test 2: Does product have images?
          const hasImages = product.images && product.images.length > 0
          const hasVariants = product.variants && product.variants.length > 0
          results.push({
            test: 'Product Structure',
            success: hasImages || hasVariants,
            data: `Images: ${product.images?.length || 0}, Variants: ${product.variants?.length || 0}`
          })
          
          // Test 3: Get first image URL
          let imageUrl = null
          if (product.images && product.images[0]) {
            imageUrl = product.images[0]
          } else if (product.variants && product.variants[0]?.variant_image) {
            imageUrl = product.variants[0].variant_image
          }
          
          results.push({
            test: 'Image URL',
            success: !!imageUrl,
            data: imageUrl || 'No image URL found'
          })
          
          // Test 4: Can we load the image?
          if (imageUrl) {
            const img = new Image()
            img.onload = () => {
              results.push({
                test: 'Image Load',
                success: true,
                data: `Loaded: ${imageUrl.substring(0, 50)}...`
              })
              setTestResults([...results])
            }
            img.onerror = (e) => {
              results.push({
                test: 'Image Load',
                success: false,
                data: `Failed: ${e}`
              })
              setTestResults([...results])
            }
            img.src = imageUrl
          }
        }
        
        setTestResults([...results])
      })
      .catch(err => {
        results.push({
          test: 'API Fetch',
          success: false,
          data: err.message
        })
        setTestResults([...results])
      })
  }, [])
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Loading Test</h1>
      
      <div className="space-y-4">
        {testResults.map((result, i) => (
          <div key={i} className={`p-4 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="font-bold">{result.test}: {result.success ? '✅' : '❌'}</div>
            <div className="text-sm">{result.data}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Direct Image Test</h2>
        <p className="mb-2">Testing URL: https://static.unpr.io/itemimage/800/products/full/IMAGE-677b5ef2560c5.jpg</p>
        <img 
          src="https://static.unpr.io/itemimage/800/products/full/IMAGE-677b5ef2560c5.jpg"
          alt="Test"
          className="w-64 h-64 object-contain border"
          onLoad={() => console.log('✅ Direct image loaded')}
          onError={(e) => console.error('❌ Direct image failed:', e)}
        />
      </div>
    </div>
  )
}