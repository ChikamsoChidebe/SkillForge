import { hederaClient } from './hederaClient'
import { emailService } from './emailService'
import { syncService } from './syncService'

// Badge definitions for consistency across the app
export const BADGE_DEFINITIONS = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Recorded your first learning milestone',
    rarity: 'common',
    milestone: 1,
    icon: '🎯'
  },
  {
    id: 'learning_streak',
    name: 'Learning Streak',
    description: 'Completed 5 learning milestones',
    rarity: 'uncommon',
    milestone: 5,
    icon: '🔥'
  },
  {
    id: 'knowledge_builder',
    name: 'Knowledge Builder',
    description: 'Reached 10 learning milestones',
    rarity: 'rare',
    milestone: 10,
    icon: '🏗️'
  },
  {
    id: 'learning_master',
    name: 'Learning Master',
    description: 'Achieved 20 learning milestones',
    rarity: 'legendary',
    milestone: 20,
    icon: '👑'
  },
  {
    id: 'dedicated_learner',
    name: 'Dedicated Learner',
    description: 'Completed 50 learning milestones',
    rarity: 'legendary',
    milestone: 50,
    icon: '🌟'
  },
  {
    id: 'learning_legend',
    name: 'Learning Legend',
    description: 'Reached 100 learning milestones',
    rarity: 'legendary',
    milestone: 100,
    icon: '🏆'
  }
]

export const userService = {
  // Create new user account
  async createUser(userData) {
    try {
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      const existingUser = users.find(u => u.username === userData.username || u.email === userData.email)
      
      if (existingUser) {
        throw new Error('User already exists')
      }
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        totalEntries: 0,
        totalBadges: 0,
        learningStreak: 0,
        lastEntryDate: null
      }
      
      users.push(newUser)
      localStorage.setItem('skillforge_users', JSON.stringify(users))
      
      // Send welcome email
      if (newUser.email) {
        emailService.sendWelcomeEmail(newUser)
      }
      
      return newUser
    } catch (error) {
      console.error('Failed to create user:', error)
      throw error
    }
  },

  // Authenticate user
  async authenticateUser(username, password) {
    try {
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      const user = users.find(u => u.username === username && u.password === password)
      
      if (!user) {
        throw new Error('Invalid credentials')
      }
      
      return user
    } catch (error) {
      console.error('Failed to authenticate user:', error)
      throw error
    }
  },

  // Update user data
  async updateUser(userId, updates) {
    try {
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      const userIndex = users.findIndex(u => u.id === userId)
      
      if (userIndex === -1) {
        throw new Error('User not found')
      }
      
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem('skillforge_users', JSON.stringify(users))
      
      return users[userIndex]
    } catch (error) {
      console.error('Failed to update user:', error)
      throw error
    }
  },

  // Record learning entry with cloud sync
  async recordEntry(userId, entryData) {
    try {
      const memo = JSON.stringify({
        type: 'learning_entry',
        userId,
        title: entryData.title,
        description: entryData.description,
        category: entryData.category,
        timestamp: new Date().toISOString()
      })
      
      let transactionResult
      try {
        transactionResult = await hederaClient.recordEntry(entryData)
      } catch (error) {
        console.warn('Blockchain recording failed, using local fallback:', error)
        transactionResult = {
          txHash: `local_${Date.now()}`,
          status: 'LOCAL_FALLBACK',
          timestamp: Date.now()
        }
      }
      
      // Add entry with cloud sync
      const newEntry = await syncService.addEntryWithSync(userId, {
        ...entryData,
        id: transactionResult.txHash,
        transactionId: transactionResult.txHash,
        blockchainStatus: transactionResult.status,
        date: entryData.date || new Date().toISOString()
      })
      
      return newEntry
    } catch (error) {
      console.error('Failed to record entry:', error)
      throw error
    }
  },

  // Get user entries with cloud sync
  async getUserEntries(userId) {
    try {
      // Sync entries from cloud
      const syncedEntries = await syncService.syncUserEntries(userId)
      return syncedEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
      console.error('Failed to get user entries:', error)
      // Fallback to local
      const entries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      return entries.filter(entry => entry.userId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }
  },

  // Get all entries (for admin/demo purposes)
  async getAllEntries() {
    try {
      const entries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      return entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
      console.error('Failed to get all entries:', error)
      return []
    }
  },

  // Delete entry
  async deleteEntry(userId, entryId) {
    try {
      const entries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      const filteredEntries = entries.filter(entry => !(entry.id === entryId && entry.userId === userId))
      localStorage.setItem('skillforge_entries', JSON.stringify(filteredEntries))
      
      // Update user stats
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      const userIndex = users.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users[userIndex].totalEntries = Math.max(0, (users[userIndex].totalEntries || 1) - 1)
        localStorage.setItem('skillforge_users', JSON.stringify(users))
      }
      
      return true
    } catch (error) {
      console.error('Failed to delete entry:', error)
      throw error
    }
  },

  async getUserBadges(userId) {
    const entries = await this.getUserEntries(userId)
    const entryCount = entries.length
    
    // Check for claimed badges
    const claimedBadges = JSON.parse(localStorage.getItem(`user_badges_${userId}`) || '{}')
    
    // Generate badges based on BADGE_DEFINITIONS
    const allBadges = BADGE_DEFINITIONS.map(badgeDef => {
      const isUnlocked = entryCount >= badgeDef.milestone
      const isClaimed = claimedBadges[badgeDef.id] || false
      const unlockedAt = isUnlocked && entries[badgeDef.milestone - 1] ? entries[badgeDef.milestone - 1].timestamp : null
      
      return {
        ...badgeDef,
        unlocked: isUnlocked,
        claimed: isClaimed,
        unlockedAt,
        eligible: isUnlocked && !isClaimed
      }
    })
    
    return allBadges
  },

  // Get comprehensive user statistics
  async getUserStats(userId) {
    const entries = await this.getUserEntries(userId)
    const badges = await this.getUserBadges(userId)
    const unlockedBadges = badges.filter(badge => badge.unlocked)
    
    // Calculate learning streak
    let currentStreak = 0
    let longestStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (entries.length > 0) {
      const sortedEntries = entries.sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp))
      let streakCount = 0
      let checkDate = new Date(today)
      
      for (const entry of sortedEntries) {
        const entryDate = new Date(entry.date || entry.timestamp)
        entryDate.setHours(0, 0, 0, 0)
        
        const daysDiff = Math.floor((checkDate - entryDate) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 0 || daysDiff === 1) {
          streakCount++
          longestStreak = Math.max(longestStreak, streakCount)
          if (daysDiff === 0 || (daysDiff === 1 && currentStreak === 0)) {
            currentStreak = streakCount
          }
          checkDate = new Date(entryDate)
          checkDate.setDate(checkDate.getDate() - 1)
        } else if (daysDiff > 1) {
          break
        }
      }
    }
    
    // Category distribution
    const categories = {}
    entries.forEach(entry => {
      const category = entry.category || 'other'
      categories[category] = (categories[category] || 0) + 1
    })
    
    // Weekly and monthly activity
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const thisWeekEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date || entry.timestamp)
      return entryDate >= weekAgo
    }).length
    
    const thisMonthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date || entry.timestamp)
      return entryDate >= monthAgo
    }).length
    
    // Learning velocity (entries per week over last 4 weeks)
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)
    const recentEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date || entry.timestamp)
      return entryDate >= fourWeeksAgo
    })
    const learningVelocity = Math.round((recentEntries.length / 4) * 10) / 10
    
    return {
      totalEntries: entries.length,
      totalBadges: badges.length,
      unlockedBadges: unlockedBadges.length,
      completionRate: badges.length > 0 ? Math.round((unlockedBadges.length / badges.length) * 100) : 0,
      currentStreak,
      longestStreak,
      thisWeekEntries,
      thisMonthEntries,
      learningVelocity,
      categories,
      categoryStats: categories,
      joinedAt: entries[entries.length - 1]?.timestamp || new Date().toISOString(),
      joinDate: entries[entries.length - 1]?.timestamp || new Date().toISOString(),
      lastActivity: entries[0]?.timestamp || null
    }
  },

  // Export user data
  async exportUserData(userId) {
    try {
      const entries = await this.getUserEntries(userId)
      const badges = await this.getUserBadges(userId)
      const stats = await this.getUserStats(userId)
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      const user = users.find(u => u.id === userId)
      
      return {
        user: user ? { ...user, password: undefined } : null,
        entries,
        badges: badges.filter(badge => badge.unlocked),
        stats,
        exportDate: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to export user data:', error)
      throw error
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      const user = users.find(u => u.id === userId)
      if (user) {
        delete user.password // Don't return password
      }
      return user
    } catch (error) {
      console.error('Failed to get user by ID:', error)
      return null
    }
  },

  // Check if username/email exists
  async checkUserExists(username, email) {
    try {
      const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      return users.some(u => u.username === username || u.email === email)
    } catch (error) {
      console.error('Failed to check user existence:', error)
      return false
    }
  }
}