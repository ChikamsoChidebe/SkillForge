import { emailService } from '@/api/emailService'
import { userService } from '@/api/userService'

// Email automation and scheduling system
export const emailScheduler = {
  // Check for users who need progress reminders
  async checkProgressReminders() {
    try {
      const users = JSON.parse(localStorage.getItem('devchain_users') || '[]')
      const now = new Date()
      
      for (const user of users) {
        if (!user.email) continue
        
        // Check if user hasn't logged activity in 3 days
        const lastActivity = user.lastEntryDate ? new Date(user.lastEntryDate) : null
        const daysSinceActivity = lastActivity ? 
          Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24)) : 999
        
        // Send reminder if inactive for 3+ days
        if (daysSinceActivity >= 3) {
          const lastReminderKey = `reminder_${user.id}`
          const lastReminder = localStorage.getItem(lastReminderKey)
          const daysSinceReminder = lastReminder ? 
            Math.floor((now - new Date(lastReminder)) / (1000 * 60 * 60 * 24)) : 999
          
          // Only send reminder once per week
          if (daysSinceReminder >= 7) {
            await emailService.sendProgressReminder(user)
            localStorage.setItem(lastReminderKey, now.toISOString())
          }
        }
      }
    } catch (error) {
      console.error('Failed to check progress reminders:', error)
    }
  },

  // Weekly progress digest
  async sendWeeklyDigest() {
    try {
      const users = JSON.parse(localStorage.getItem('devchain_users') || '[]')
      
      for (const user of users) {
        if (!user.email) continue
        
        const stats = await userService.getUserStats(user.id)
        const entries = await userService.getUserEntries(user.id)
        
        // Only send if user has activity this week
        if (stats.thisWeekEntries > 0) {
          await emailService.sendWeeklyDigest(user, {
            weeklyEntries: stats.thisWeekEntries,
            totalEntries: stats.totalEntries,
            currentStreak: stats.currentStreak,
            recentEntries: entries.slice(0, 3)
          })
        }
      }
    } catch (error) {
      console.error('Failed to send weekly digest:', error)
    }
  },

  // Initialize email scheduler
  init() {
    // Check for reminders every hour
    setInterval(() => {
      this.checkProgressReminders()
    }, 60 * 60 * 1000)

    // Send weekly digest on Sundays
    const checkWeeklyDigest = () => {
      const now = new Date()
      if (now.getDay() === 0 && now.getHours() === 9) { // Sunday 9 AM
        this.sendWeeklyDigest()
      }
    }
    
    setInterval(checkWeeklyDigest, 60 * 60 * 1000) // Check every hour
    
    console.log('📧 Email scheduler initialized')
  }
}