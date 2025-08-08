class UserActivityService {
  constructor() {
    this.storageKey = 'skillforge_user_activity'
  }

  // Get user activity data
  getUserActivity(accountId) {
    try {
      const allActivity = JSON.parse(localStorage.getItem(this.storageKey) || '{}')
      return allActivity[accountId] || {
        learningEntries: [],
        badges: [],
        totalEntries: 0,
        totalBadges: 0
      }
    } catch (error) {
      console.error('Failed to get user activity:', error)
      return {
        learningEntries: [],
        badges: [],
        totalEntries: 0,
        totalBadges: 0
      }
    }
  }

  // Add learning entry
  addLearningEntry(accountId, entryData) {
    try {
      const allActivity = JSON.parse(localStorage.getItem(this.storageKey) || '{}')
      
      if (!allActivity[accountId]) {
        allActivity[accountId] = {
          learningEntries: [],
          badges: [],
          totalEntries: 0,
          totalBadges: 0
        }
      }

      const entry = {
        id: Date.now().toString(),
        title: entryData.title,
        description: entryData.description,
        category: entryData.category,
        timestamp: new Date().toISOString(),
        transactionId: `${accountId}@${Date.now()}.${Math.floor(Math.random() * 1000000)}`
      }

      allActivity[accountId].learningEntries.push(entry)
      allActivity[accountId].totalEntries = allActivity[accountId].learningEntries.length

      localStorage.setItem(this.storageKey, JSON.stringify(allActivity))
      
      // Check if user earned a badge
      this.checkAndAwardBadges(accountId)
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('userActivityChanged', { detail: { accountId } }))
      
      return entry
    } catch (error) {
      console.error('Failed to add learning entry:', error)
      throw error
    }
  }

  // Add badge
  addBadge(accountId, badgeData) {
    try {
      const allActivity = JSON.parse(localStorage.getItem(this.storageKey) || '{}')
      
      if (!allActivity[accountId]) {
        allActivity[accountId] = {
          learningEntries: [],
          badges: [],
          totalEntries: 0,
          totalBadges: 0
        }
      }

      const badge = {
        id: Date.now().toString(),
        title: badgeData.title,
        description: badgeData.description,
        rarity: badgeData.rarity,
        timestamp: new Date().toISOString(),
        tokenId: `0.0.${Math.floor(Math.random() * 1000000)}`,
        transactionId: `${accountId}@${Date.now()}.${Math.floor(Math.random() * 1000000)}`
      }

      allActivity[accountId].badges.push(badge)
      allActivity[accountId].totalBadges = allActivity[accountId].badges.length

      localStorage.setItem(this.storageKey, JSON.stringify(allActivity))
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('userActivityChanged', { detail: { accountId } }))
      
      return badge
    } catch (error) {
      console.error('Failed to add badge:', error)
      throw error
    }
  }

  // Check and award badges based on learning entries
  checkAndAwardBadges(accountId) {
    const activity = this.getUserActivity(accountId)
    const entryCount = activity.totalEntries

    // Award badges based on milestones
    const badgeMilestones = [
      { count: 1, title: 'First Steps', description: 'Completed your first learning entry', rarity: 'common' },
      { count: 5, title: 'Learning Streak', description: 'Completed 5 learning entries', rarity: 'uncommon' },
      { count: 10, title: 'Knowledge Builder', description: 'Completed 10 learning entries', rarity: 'rare' },
      { count: 20, title: 'Learning Master', description: 'Completed 20 learning entries', rarity: 'epic' },
      { count: 50, title: 'Dedicated Learner', description: 'Completed 50 learning entries', rarity: 'legendary' }
    ]

    for (const milestone of badgeMilestones) {
      if (entryCount >= milestone.count) {
        // Check if badge already exists
        const existingBadge = activity.badges.find(badge => badge.title === milestone.title)
        if (!existingBadge) {
          this.addBadge(accountId, milestone)
        }
      }
    }
  }

  // Get transactions for display
  getTransactions(accountId) {
    const activity = this.getUserActivity(accountId)
    const transactions = []

    // Add learning entries as transactions
    activity.learningEntries.forEach(entry => {
      transactions.push({
        id: entry.transactionId,
        type: 'learning_entry',
        status: 'SUCCESS',
        timestamp: entry.timestamp,
        description: `Recorded learning milestone: ${entry.title}`,
        amount: null,
        fee: '0.0001',
        topicId: '0.0.6478143',
        consensusTimestamp: entry.transactionId.split('@')[1]
      })
    })

    // Add badges as transactions
    activity.badges.forEach(badge => {
      transactions.push({
        id: badge.transactionId,
        type: 'badge_mint',
        status: 'SUCCESS',
        timestamp: badge.timestamp,
        description: `Minted NFT badge: ${badge.title}`,
        amount: null,
        fee: '0.001',
        tokenId: badge.tokenId,
        serialNumber: 1
      })
    })

    // Sort by timestamp (newest first)
    return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }
}

export const userActivityService = new UserActivityService()
export default userActivityService