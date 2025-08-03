import { supabaseService } from './supabaseClient'

export const reliableSync = {
  // Create user with cloud sync
  async createUser(userData) {
    try {
      // Try cloud first
      const cloudUser = await supabaseService.createUser(userData)
      
      // Store locally as backup
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      users.push(userData)
      localStorage.setItem('skillforge_users', JSON.stringify(users))
      
      return cloudUser
    } catch (error) {
      console.warn('Cloud user creation failed, using local:', error)
      // Fallback to local
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      users.push(userData)
      localStorage.setItem('skillforge_users', JSON.stringify(users))
      return userData
    }
  },

  // Login with cloud sync
  async loginUser(email, password) {
    try {
      // Try cloud first
      const cloudUser = await supabaseService.getUserByEmail(email)
      if (cloudUser && cloudUser.password === password) {
        // Store locally for offline access
        localStorage.setItem('skillforge_user', JSON.stringify(cloudUser))
        return cloudUser
      }
      
      // Fallback to local
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      const localUser = users.find(u => u.email === email && u.password === password)
      return localUser
    } catch (error) {
      console.warn('Cloud login failed, trying local:', error)
      // Local fallback
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      return users.find(u => u.email === email && u.password === password)
    }
  },

  // Create entry with cloud sync
  async createEntry(entryData) {
    try {
      // Try cloud first
      const cloudEntry = await supabaseService.createEntry(entryData)
      
      // Store locally as backup
      const entries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      entries.unshift(entryData)
      localStorage.setItem('skillforge_entries', JSON.stringify(entries))
      
      return cloudEntry
    } catch (error) {
      console.warn('Cloud entry creation failed, using local:', error)
      // Fallback to local
      const entries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      entries.unshift(entryData)
      localStorage.setItem('skillforge_entries', JSON.stringify(entries))
      return entryData
    }
  },

  // Get entries with cloud sync
  async getUserEntries(userId) {
    try {
      // Try cloud first
      const cloudEntries = await supabaseService.getUserEntries(userId)
      
      // Merge with local entries
      const localEntries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      const userLocalEntries = localEntries.filter(e => e.userId === userId)
      
      // Combine and deduplicate
      const allEntries = [...cloudEntries, ...userLocalEntries]
      const uniqueEntries = allEntries.filter((entry, index, self) => 
        index === self.findIndex(e => e.id === entry.id)
      )
      
      // Update local storage with merged data
      const otherUsersEntries = localEntries.filter(e => e.userId !== userId)
      const updatedEntries = [...otherUsersEntries, ...uniqueEntries]
      localStorage.setItem('skillforge_entries', JSON.stringify(updatedEntries))
      
      return uniqueEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      console.warn('Cloud entries fetch failed, using local:', error)
      // Fallback to local
      const entries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      return entries.filter(e => e.userId === userId)
    }
  }
}