// Security utilities
export const security = {
  // Sanitize user input
  sanitizeInput(input) {
    if (typeof input !== 'string') return input
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim()
      .substring(0, 1000) // Limit length
  },

  // Validate session
  validateSession() {
    const user = localStorage.getItem('devchain_user')
    if (!user) return false
    
    try {
      const userData = JSON.parse(user)
      return userData.id && userData.username
    } catch {
      return false
    }
  },

  // Rate limiting for API calls
  rateLimiter: {
    calls: new Map(),
    
    canMakeCall(key, limit = 10, window = 60000) {
      const now = Date.now()
      const calls = this.calls.get(key) || []
      
      // Remove old calls outside the window
      const recentCalls = calls.filter(time => now - time < window)
      
      if (recentCalls.length >= limit) {
        return false
      }
      
      recentCalls.push(now)
      this.calls.set(key, recentCalls)
      return true
    }
  },

  // Encrypt sensitive data (basic implementation)
  encrypt(data) {
    // In production, use proper encryption
    return btoa(JSON.stringify(data))
  },

  decrypt(encryptedData) {
    try {
      return JSON.parse(atob(encryptedData))
    } catch {
      return null
    }
  }
}