// Simple cloud sync using JSONBin.io (free, no setup required)
const API_URL = 'https://api.jsonbin.io/v3/b'
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY

export const simpleCloudSync = {
  // Create user bin
  async createUser(userData) {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({
          type: 'user',
          email: userData.email,
          data: userData,
          createdAt: new Date().toISOString()
        })
      })
      const result = await response.json()
      return { ...userData, binId: result.metadata.id }
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    }
  },

  // Find user by email (simple search)
  async findUser(email) {
    try {
      // For demo, we'll use localStorage to store user-bin mapping
      const userBins = JSON.parse(localStorage.getItem('user_bins') || '{}')
      const binId = userBins[email]
      
      if (!binId) return null
      
      const response = await fetch(`${API_URL}/${binId}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      })
      const result = await response.json()
      return result.record.data
    } catch (error) {
      console.error('Failed to find user:', error)
      return null
    }
  },

  // Sync entries
  async syncEntries(userId, entries) {
    try {
      const entryBins = JSON.parse(localStorage.getItem('entry_bins') || '{}')
      let binId = entryBins[userId]
      
      if (!binId) {
        // Create new bin for user entries
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
          },
          body: JSON.stringify({
            userId,
            entries,
            syncedAt: new Date().toISOString()
          })
        })
        const result = await response.json()
        binId = result.metadata.id
        entryBins[userId] = binId
        localStorage.setItem('entry_bins', JSON.stringify(entryBins))
      } else {
        // Update existing bin
        await fetch(`${API_URL}/${binId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
          },
          body: JSON.stringify({
            userId,
            entries,
            syncedAt: new Date().toISOString()
          })
        })
      }
      
      return true
    } catch (error) {
      console.error('Failed to sync entries:', error)
      return false
    }
  },

  // Get entries
  async getEntries(userId) {
    try {
      const entryBins = JSON.parse(localStorage.getItem('entry_bins') || '{}')
      const binId = entryBins[userId]
      
      if (!binId) return []
      
      const response = await fetch(`${API_URL}/${binId}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      })
      const result = await response.json()
      return result.record.entries || []
    } catch (error) {
      console.error('Failed to get entries:', error)
      return []
    }
  }
}