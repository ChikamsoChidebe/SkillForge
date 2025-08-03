import { supabaseService } from './supabaseClient'

export const reliableSync = {
  // Create user with cloud sync
  async createUser(userData) {
    try {
      // Cloud-first approach for cross-device sync
      const cloudUser = await supabaseService.createUser(userData)
      console.log('✅ User created in cloud database')
      
      // Store locally as backup
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      users.push(cloudUser)
      localStorage.setItem('skillforge_users', JSON.stringify(users))
      
      return cloudUser
    } catch (error) {
      console.warn('⚠️ Cloud user creation failed, using local fallback:', error.message)
      
      // Local fallback
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      users.push(userData)
      localStorage.setItem('skillforge_users', JSON.stringify(users))
      
      return userData
    }
  },

  // Login with cloud sync (supports email or username)
  async loginUser(identifier, password) {
    try {
      // Cloud-first login for cross-device sync
      const cloudUser = await supabaseService.getUserByEmail(identifier)
      if (cloudUser && cloudUser.password === password) {
        console.log('✅ Cloud login successful - cross-device sync enabled')
        
        // Update local cache
        localStorage.setItem('skillforge_user', JSON.stringify(cloudUser))
        return cloudUser
      }
      
      // If email lookup failed, user might not exist in cloud yet
      console.log('User not found in cloud, checking local...')
    } catch (error) {
      console.warn('⚠️ Cloud login failed, trying local fallback:', error.message)
    }
    
    // Local fallback for users not yet synced to cloud
    const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
    const localUser = users.find(u => 
      (u.email === identifier || u.username === identifier) && u.password === password
    )
    
    if (localUser) {
      console.log('📱 Local login successful - limited to this device')
    }
    
    return localUser
  },

  // Create entry with cloud sync
  async createEntry(entryData) {
    try {
      // Cloud-first approach for cross-device sync
      const cloudEntry = await supabaseService.createEntry(entryData)
      console.log('✅ Entry saved to cloud - will sync across devices')
      
      // Update local cache
      const entries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      entries.unshift(cloudEntry)
      localStorage.setItem('skillforge_entries', JSON.stringify(entries))
      
      return cloudEntry
    } catch (error) {
      console.warn('⚠️ Entry cloud sync failed, saving locally only:', error.message)
      
      // Local fallback
      const entries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      entries.unshift(entryData)
      localStorage.setItem('skillforge_entries', JSON.stringify(entries))
      
      return entryData
    }
  },

  // Get entries with cloud sync
  async getUserEntries(userId) {
    try {
      // Cloud-first approach for latest cross-device data
      const cloudEntries = await supabaseService.getUserEntries(userId)
      console.log(`✅ Loaded ${cloudEntries.length} entries from cloud database`)
      
      // Update local cache with cloud data
      const allLocalEntries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      const otherUsersEntries = allLocalEntries.filter(e => e.userId !== userId)
      const updatedEntries = [...otherUsersEntries, ...cloudEntries]
      localStorage.setItem('skillforge_entries', JSON.stringify(updatedEntries))
      
      return cloudEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      console.warn('⚠️ Cloud entries failed, using local cache:', error.message)
      
      // Local fallback
      const localEntries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      const userEntries = localEntries.filter(e => e.userId === userId)
      
      return userEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }
}