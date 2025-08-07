import { productionService } from './productionService'
import { supabaseService } from './supabaseClient'

export const reliableSync = {
  // Create user with local-first approach
  async createUser(userData) {
    // Always save locally first
    const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
    users.push(userData)
    localStorage.setItem('skillforge_users', JSON.stringify(users))
    
    // Try cloud sync in background
    try {
      await supabaseService.createUser(userData)
      console.log('✅ User synced to cloud')
    } catch (error) {
      console.log('⚠️ Cloud sync failed, user saved locally')
    }
    
    return userData
  },

  // Login with local-first approach
  async loginUser(identifier, password) {
    const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
    const user = users.find(u => 
      (u.email === identifier || u.username === identifier) && u.password === password
    )
    
    if (user) {
      console.log('✅ Login successful')
      return user
    }
    
    return null
  },

  // Create entry with production service
  async createEntry(entryData) {
    return await productionService.createEntry(entryData)
  },

  // Get entries with production service
  async getUserEntries(userId) {
    const entries = await productionService.getUserEntries(userId)
    console.log(`✅ Loaded ${entries.length} entries`)
    return entries
  },

  // Update user with local-first approach
  async updateUser(userId, updates) {
    // Update locally first
    const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem('skillforge_users', JSON.stringify(users))
    }
    
    // Try cloud sync in background
    try {
      await supabaseService.updateUser(userId, updates)
      console.log('✅ User updated in cloud')
    } catch (error) {
      console.log('⚠️ Cloud update failed, user updated locally')
    }
    
    return updates
  }
}