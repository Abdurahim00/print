/**
 * Safe localStorage wrapper with quota management
 */

export class SafeStorage {
  /**
   * Safely set item in localStorage with quota handling
   */
  static setItem(key: string, value: string): boolean {
    try {
      // Try to set the item
      localStorage.setItem(key, value)
      return true
    } catch (e) {
      if (e instanceof DOMException && (
        e.code === 22 || // Legacy code
        e.code === 1014 || // Firefox
        e.name === 'QuotaExceededError' || // Most browsers
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED' // Firefox
      )) {
        console.warn('LocalStorage quota exceeded, attempting cleanup...')
        
        // Try to clear old/expired data
        if (this.cleanup()) {
          try {
            // Retry after cleanup
            localStorage.setItem(key, value)
            return true
          } catch (retryError) {
            console.error('Failed to store even after cleanup:', retryError)
            
            // As a last resort, try to store a compressed version
            return this.setCompressedItem(key, value)
          }
        }
      }
      
      console.error('Failed to store item:', e)
      return false
    }
  }

  /**
   * Store compressed/minimal version of data
   */
  private static setCompressedItem(key: string, value: string): boolean {
    try {
      const parsed = JSON.parse(value)
      
      if (key === 'cart' && Array.isArray(parsed)) {
        // For cart, keep only essential fields
        const minimalCart = parsed.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedSizes: item.selectedSizes?.map((s: any) => ({
            size: s.size,
            quantity: s.quantity
          }))
        }))
        
        localStorage.setItem(key, JSON.stringify(minimalCart))
        console.log('Stored minimal cart data')
        return true
      }
      
      // For other data, try to store as-is but return false if it fails
      localStorage.setItem(key, value)
      return true
    } catch (e) {
      console.error('Failed to store compressed item:', e)
      return false
    }
  }

  /**
   * Clean up localStorage to free space
   */
  static cleanup(): boolean {
    try {
      const keysToCheck = [
        'designSessionState',
        'canvasDesigns',
        'selectedTemplateSession',
        'productVariationDesigns',
        'fabricCanvasState'
      ]
      
      let freedSpace = false
      
      // Remove old session data
      keysToCheck.forEach(key => {
        const item = localStorage.getItem(key)
        if (item) {
          try {
            const parsed = JSON.parse(item)
            // Remove if data is older than 7 days
            if (parsed.timestamp && Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000) {
              localStorage.removeItem(key)
              freedSpace = true
              console.log(`Removed old ${key}`)
            }
          } catch {
            // If can't parse, it might be corrupted, remove it
            localStorage.removeItem(key)
            freedSpace = true
          }
        }
      })
      
      // Remove design data for products that are no longer in cart
      try {
        const cartRaw = localStorage.getItem('cart')
        const cart = cartRaw ? JSON.parse(cartRaw) : []
        const cartProductIds = new Set(cart.map((item: any) => item.productId))
        
        const designKeys = Object.keys(localStorage).filter(k => k.startsWith('design_'))
        designKeys.forEach(key => {
          const productId = key.split('_')[1]
          if (!cartProductIds.has(productId)) {
            localStorage.removeItem(key)
            freedSpace = true
            console.log(`Removed orphaned design: ${key}`)
          }
        })
      } catch (e) {
        console.error('Error cleaning up design data:', e)
      }
      
      // Clear very large items if they exist
      const allKeys = Object.keys(localStorage)
      allKeys.forEach(key => {
        try {
          const item = localStorage.getItem(key)
          if (item && item.length > 100000) { // Items larger than 100KB
            if (!['cart', 'user'].includes(key)) { // Don't delete critical data
              localStorage.removeItem(key)
              freedSpace = true
              console.log(`Removed large item: ${key} (${item.length} chars)`)
            }
          }
        } catch {
          // Ignore errors
        }
      })
      
      return freedSpace
    } catch (e) {
      console.error('Cleanup failed:', e)
      return false
    }
  }

  /**
   * Get available storage space (approximate)
   */
  static getAvailableSpace(): number {
    try {
      // Try to estimate available space
      const testKey = '_test_quota_'
      const testData = new Array(1024).join('a') // 1KB of data
      let size = 0
      
      // Remove test key if it exists
      localStorage.removeItem(testKey)
      
      // Try progressively larger sizes
      for (let i = 0; i < 5120; i++) { // Max 5MB test
        try {
          localStorage.setItem(testKey, new Array(size + 1024).join('a'))
          size += 1024
        } catch {
          break
        }
      }
      
      // Clean up
      localStorage.removeItem(testKey)
      
      return size
    } catch {
      return 0
    }
  }

  /**
   * Get total size of localStorage
   */
  static getTotalSize(): number {
    try {
      let total = 0
      for (const key in localStorage) {
        const item = localStorage.getItem(key)
        if (item) {
          total += item.length + key.length
        }
      }
      return total
    } catch {
      return 0
    }
  }

  /**
   * Safe getItem with error handling
   */
  static getItem(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.error('Failed to get item from localStorage:', e)
      return null
    }
  }

  /**
   * Safe removeItem with error handling
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      console.error('Failed to remove item from localStorage:', e)
      return false
    }
  }
}