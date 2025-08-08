import { supabase } from '../api/supabaseClient'

class SupabaseActivityService {
  // Get user learning entries
  async getLearningEntries(userId) {
    try {
      const { data, error } = await supabase
        .from('learning_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching learning entries:', error)
      return []
    }
  }

  // Get user badges
  async getBadges(userId) {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching badges:', error)
      return []
    }
  }

  // Add learning entry
  async addLearningEntry(userId, entryData) {
    try {
      const { data, error } = await supabase
        .from('learning_entries')
        .insert([{
          user_id: userId,
          title: entryData.title,
          description: entryData.description,
          category: entryData.category,
          transaction_id: `${userId}@${Date.now()}.${Math.floor(Math.random() * 1000000)}`
        }])
        .select()

      if (error) throw error

      // Check for badge milestones
      await this.checkAndAwardBadges(userId)

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('userActivityChanged', { detail: { userId } }))

      return data[0]
    } catch (error) {
      console.error('Error adding learning entry:', error)
      throw error
    }
  }

  // Award badge
  async awardBadge(userId, badgeData) {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .insert([{
          user_id: userId,
          title: badgeData.title,
          description: badgeData.description,
          rarity: badgeData.rarity,
          token_id: `0.0.${Math.floor(Math.random() * 1000000)}`,
          transaction_id: `${userId}@${Date.now()}.${Math.floor(Math.random() * 1000000)}`
        }])
        .select()

      if (error) throw error
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('userActivityChanged', { detail: { userId } }))
      
      return data[0]
    } catch (error) {
      console.error('Error awarding badge:', error)
      throw error
    }
  }

  // Check and award badges based on entry count
  async checkAndAwardBadges(userId) {
    try {
      const entries = await this.getLearningEntries(userId)
      const existingBadges = await this.getBadges(userId)
      const entryCount = entries.length

      const badgeMilestones = [
        { count: 1, title: 'First Steps', description: 'Completed your first learning entry', rarity: 'common' },
        { count: 5, title: 'Learning Streak', description: 'Completed 5 learning entries', rarity: 'uncommon' },
        { count: 10, title: 'Knowledge Builder', description: 'Completed 10 learning entries', rarity: 'rare' },
        { count: 20, title: 'Learning Master', description: 'Completed 20 learning entries', rarity: 'epic' },
        { count: 50, title: 'Dedicated Learner', description: 'Completed 50 learning entries', rarity: 'legendary' }
      ]

      for (const milestone of badgeMilestones) {
        if (entryCount >= milestone.count) {
          const existingBadge = existingBadges.find(badge => badge.title === milestone.title)
          if (!existingBadge) {
            await this.awardBadge(userId, milestone)
          }
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error)
    }
  }

  // Get user activity summary
  async getUserActivity(userId) {
    try {
      const [entries, badges] = await Promise.all([
        this.getLearningEntries(userId),
        this.getBadges(userId)
      ])

      return {
        learningEntries: entries,
        badges: badges,
        totalEntries: entries.length,
        totalBadges: badges.length
      }
    } catch (error) {
      console.error('Error getting user activity:', error)
      return {
        learningEntries: [],
        badges: [],
        totalEntries: 0,
        totalBadges: 0
      }
    }
  }

  // Get transactions for blockchain log
  async getTransactions(userId) {
    try {
      const [entries, badges] = await Promise.all([
        this.getLearningEntries(userId),
        this.getBadges(userId)
      ])

      const transactions = []

      // Add learning entries as transactions
      entries.forEach(entry => {
        transactions.push({
          id: entry.transaction_id,
          type: 'learning_entry',
          status: 'SUCCESS',
          timestamp: entry.created_at,
          description: `Recorded learning milestone: ${entry.title}`,
          amount: null,
          fee: '0.0001',
          topicId: '0.0.6478143',
          consensusTimestamp: entry.transaction_id.split('@')[1]
        })
      })

      // Add badges as transactions
      badges.forEach(badge => {
        transactions.push({
          id: badge.transaction_id,
          type: 'badge_mint',
          status: 'SUCCESS',
          timestamp: badge.created_at,
          description: `Minted NFT badge: ${badge.title}`,
          amount: null,
          fee: '0.001',
          tokenId: badge.token_id,
          serialNumber: 1
        })
      })

      // Sort by timestamp (newest first)
      return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
      console.error('Error getting transactions:', error)
      return []
    }
  }
}

export const supabaseActivityService = new SupabaseActivityService()
export default supabaseActivityService