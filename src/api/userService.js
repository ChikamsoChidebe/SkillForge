import { hederaClient } from './hederaClient'

export const userService = {
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
      
      const transactionId = await hederaClient.recordEntry(memo)
      
      // Store locally with user association
      const entries = JSON.parse(localStorage.getItem('devchain_entries') || '[]')
      const newEntry = {
        id: transactionId,
        userId,
        ...entryData,
        timestamp: new Date().toISOString(),
        transactionId
      }
      
      entries.unshift(newEntry)
      localStorage.setItem('devchain_entries', JSON.stringify(entries))
      
      return newEntry
    } catch (error) {
      console.error('Failed to record entry:', error)
      throw error
    }
  },

  async getUserEntries(userId) {
    try {
      const entries = JSON.parse(localStorage.getItem('devchain_entries') || '[]')
      return entries.filter(entry => entry.userId === userId)
    } catch (error) {
      console.error('Failed to get user entries:', error)
      return []
    }
  },

  async getUserBadges(userId) {
    const entries = await this.getUserEntries(userId)
    const entryCount = entries.length
    
    const badges = []
    
    if (entryCount >= 1) {
      badges.push({
        id: 'first_steps',
        name: 'First Steps',
        description: 'Recorded your first learning milestone',
        rarity: 'Common',
        unlockedAt: entries[entries.length - 1]?.timestamp,
        icon: '🎯'
      })
    }
    
    if (entryCount >= 5) {
      badges.push({
        id: 'learning_streak',
        name: 'Learning Streak',
        description: 'Completed 5 learning milestones',
        rarity: 'Uncommon',
        unlockedAt: entries[entries.length - 5]?.timestamp,
        icon: '🔥'
      })
    }
    
    if (entryCount >= 10) {
      badges.push({
        id: 'knowledge_builder',
        name: 'Knowledge Builder',
        description: 'Reached 10 learning milestones',
        rarity: 'Rare',
        unlockedAt: entries[entries.length - 10]?.timestamp,
        icon: '🏗️'
      })
    }
    
    if (entryCount >= 20) {
      badges.push({
        id: 'learning_master',
        name: 'Learning Master',
        description: 'Achieved 20 learning milestones',
        rarity: 'Legendary',
        unlockedAt: entries[entries.length - 20]?.timestamp,
        icon: '👑'
      })
    }
    
    return badges
  },

  async getUserStats(userId) {
    const entries = await this.getUserEntries(userId)
    const badges = await this.getUserBadges(userId)
    
    // Calculate streak
    let currentStreak = 0
    const today = new Date()
    const sortedEntries = entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.timestamp)
      const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff <= currentStreak + 1) {
        currentStreak++
      } else {
        break
      }
    }
    
    // Category distribution
    const categories = {}
    entries.forEach(entry => {
      categories[entry.category] = (categories[entry.category] || 0) + 1
    })
    
    return {
      totalEntries: entries.length,
      totalBadges: badges.length,
      currentStreak,
      categories,
      joinedAt: entries[entries.length - 1]?.timestamp || new Date().toISOString()
    }
  }
}