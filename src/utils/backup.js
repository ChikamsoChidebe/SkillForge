// Data backup and recovery utilities
export const backup = {
  // Create full backup of user data
  async createBackup(userId) {
    try {
      const userData = {
        user: JSON.parse(localStorage.getItem('devchain_users') || '[]').find(u => u.id === userId),
        entries: JSON.parse(localStorage.getItem('devchain_entries') || '[]').filter(e => e.userId === userId),
        settings: JSON.parse(localStorage.getItem('devchain_settings') || '{}'),
        profile: JSON.parse(localStorage.getItem('devchain_profile') || '{}'),
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }

      const backupData = JSON.stringify(userData, null, 2)
      const blob = new Blob([backupData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `devchain-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      console.error('Backup failed:', error)
      return false
    }
  },

  // Restore from backup file
  async restoreBackup(file, userId) {
    try {
      const text = await file.text()
      const backupData = JSON.parse(text)
      
      if (!backupData.version || !backupData.user) {
        throw new Error('Invalid backup file format')
      }

      // Restore user data
      if (backupData.entries) {
        const existingEntries = JSON.parse(localStorage.getItem('devchain_entries') || '[]')
        const filteredEntries = existingEntries.filter(e => e.userId !== userId)
        const restoredEntries = [...filteredEntries, ...backupData.entries]
        localStorage.setItem('devchain_entries', JSON.stringify(restoredEntries))
      }

      // Restore settings
      if (backupData.settings) {
        localStorage.setItem('devchain_settings', JSON.stringify(backupData.settings))
      }

      // Restore profile
      if (backupData.profile) {
        localStorage.setItem('devchain_profile', JSON.stringify(backupData.profile))
      }

      return true
    } catch (error) {
      console.error('Restore failed:', error)
      return false
    }
  },

  // Auto-backup to cloud storage (placeholder)
  async autoBackup(userId) {
    // In production, integrate with cloud storage services
    console.log('Auto-backup triggered for user:', userId)
    return true
  }
}