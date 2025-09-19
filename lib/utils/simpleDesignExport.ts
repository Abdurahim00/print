import * as fabric from 'fabric'

// Simple export function that works with basic canvas JSON
export async function exportDesignSimple(canvasJSON: any): Promise<string> {
  return new Promise((resolve) => {
    try {
      // Create a temporary canvas element
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = 800
      tempCanvas.height = 600
      
      // Create a 2D context for direct drawing if Fabric fails
      const ctx = tempCanvas.getContext('2d')
      if (!ctx) {
        resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
        return
      }

      // Try to use Fabric.js first
      try {
        const fabricCanvas = new fabric.Canvas(tempCanvas)
        
        // Filter out any problematic objects
        const safeJSON = {
          version: canvasJSON.version || "5.3.0",
          width: canvasJSON.width || 800,
          height: canvasJSON.height || 600,
          backgroundColor: canvasJSON.backgroundColor || "transparent",
          objects: (canvasJSON.objects || []).filter((obj: any) => {
            // Only keep text and basic shapes
            return ['text', 'rect', 'circle', 'triangle', 'polygon', 'path', 'ellipse'].includes(obj.type)
          })
        }

        console.log('Loading canvas with', safeJSON.objects.length, 'objects')

        fabricCanvas.loadFromJSON(safeJSON, () => {
          // Force render
          fabricCanvas.renderAll()
          
          // Export as PNG with high quality
          const dataURL = fabricCanvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 4 // 4x resolution for better quality
          })
          
          // Clean up
          fabricCanvas.dispose()
          
          resolve(dataURL)
        })
      } catch (fabricError) {
        console.error('Fabric.js error, falling back to manual drawing:', fabricError)
        
        // Fallback: manually draw text objects
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 800, 600)
        
        // Draw any text objects manually
        if (canvasJSON.objects) {
          canvasJSON.objects.forEach((obj: any) => {
            if (obj.type === 'text') {
              ctx.font = `${obj.fontSize || 20}px ${obj.fontFamily || 'Arial'}`
              ctx.fillStyle = obj.fill || 'black'
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.fillText(obj.text || '', obj.left || 400, obj.top || 300)
            }
          })
        }
        
        // Export the manually drawn canvas
        resolve(tempCanvas.toDataURL('image/png'))
      }
    } catch (error) {
      console.error('Complete export failure:', error)
      // Return a 1x1 transparent PNG as absolute fallback
      resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
    }
  })
}