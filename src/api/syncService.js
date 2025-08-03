import { simpleCloudSync } from './simpleCloudSync'

export const syncService = {
  // Hybrid sync: localStorage + Cloud
  async createUserWithSync(userData) {
    try {
      // Create in cloud first
      const cloudUser = await simpleCloudSync.createUser(userData)
      
      // Store user-bin mapping
      const userBins = JSON.parse(localStorage.getItem('user_bins') || '{}')
      userBins[userData.email] = cloudUser.binId
      localStorage.setItem('user_bins', JSON.stringify(userBins))
      
      // Store locally as backup
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      users.push(userData)
      localStorage.setItem('skillforge_users', JSON.stringify(users))
      
      return userData
    } catch (error) {
      // Fallback to local only
      console.warn('Cloud sync failed, using local storage:', error)
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      users.push(userData)
      localStorage.setItem('skillforge_users', JSON.stringify(users))
      return userData
    }
  },

  // Login with cloud sync
  async loginWithSync(email, password) {
    try {
      // Try cloud first
      const cloudUser = await simpleCloudSync.findUser(email)
      if (cloudUser && cloudUser.password === password) {
        // Sync to local
        localStorage.setItem('skillforge_user', JSON.stringify(cloudUser))
        return cloudUser
      }
      
      // Fallback to local
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      const localUser = users.find(u => u.email === email && u.password === password)
      return localUser
    } catch (error) {
      // Local fallback
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      return users.find(u => u.email === email && u.password === password)
    }
  },

  // Sync entries across devices
  async syncUserEntries(userId) {
    try {
      // Get local entries
      const localEntries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      const userLocalEntries = localEntries.filter(e => e.userId === userId)
      
      // Get cloud entries
      const cloudEntries = await simpleCloudSync.getEntries(userId)
      
      // Merge and deduplicate
      const allEntries = [...userLocalEntries, ...cloudEntries]
      const uniqueEntries = allEntries.filter((entry, index, self) => 
        index === self.findIndex(e => e.id === entry.id)
      )
      
      // Update cloud
      await simpleCloudSync.syncEntries(userId, uniqueEntries)
      
      // Update local
      const otherUsersEntries = localEntries.filter(e => e.userId !== userId)
      const updatedLocalEntries = [...otherUsersEntries, ...uniqueEntries]
      localStorage.setItem('skillforge_entries', JSON.stringify(updatedLocalEntries))
      
      return uniqueEntries
    } catch (error) {
      console.warn('Entry sync failed:', error)
      // Return local entries as fallback
      const localEntries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      return localEntries.filter(e => e.userId === userId)
    }
  },

  // Auto-sync on entry creation
  async addEntryWithSync(userId, entryData) {
    try {
      // Add locally first
      const entries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      const newEntry = {
        id: Date.now().toString(),
        userId,
        ...entryData,
        timestamp: new Date().toISOString()
      }
      entries.unshift(newEntry)
      localStorage.setItem('skillforge_entries', JSON.stringify(entries))
      
      // Sync to cloud in background
      setTimeout(() => this.syncUserEntries(userId), 1000)
      
      return newEntry
    } catch (error) {
      console.error('Failed to add entry with sync:', error)
      throw error
    }
  }
}