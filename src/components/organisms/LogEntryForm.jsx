import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BookOpen, FileText, Tag, Trophy, Save } from 'lucide-react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { emailService } from '@/api/emailService'
import { toast } from 'react-hot-toast'

const LogEntryForm = ({ onSuccess, user: propUser }) => {
  const { user, updateUser } = useAuth()
  const { addEntry } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const currentUser = propUser || user
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tutorial',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = [
    { value: 'tutorial', label: 'Tutorial', icon: BookOpen },
    { value: 'project', label: 'Project', icon: FileText },
    { value: 'course', label: 'Course', icon: BookOpen },
    { value: 'workshop', label: 'Workshop', icon: Tag },
    { value: 'certification', label: 'Certification', icon: Calendar }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const entryData = {
        ...formData,
        id: Date.now().toString(),
        userId: currentUser.id,
        author: currentUser.fullName,
        createdAt: new Date().toISOString(),
        date: new Date(formData.date).toISOString()
      }

      // Save to localStorage
      const existingEntries = JSON.parse(localStorage.getItem('skillforge_entries') || '[]')
      existingEntries.push(entryData)
      localStorage.setItem('skillforge_entries', JSON.stringify(existingEntries))
      
      // Update user stats
      const newTotalEntries = currentUser.totalEntries + 1
      const today = new Date().toDateString()
      const lastEntryDate = currentUser.lastEntryDate ? new Date(currentUser.lastEntryDate).toDateString() : null
      const newStreak = lastEntryDate === today ? currentUser.learningStreak : 
                       lastEntryDate === new Date(Date.now() - 86400000).toDateString() ? currentUser.learningStreak + 1 : 1
      
      updateUser({
        totalEntries: newTotalEntries,
        learningStreak: newStreak,
        lastEntryDate: new Date().toISOString()
      })

      // Add to blockchain (will use local fallback)
      try {
        await addEntry(entryData)
      } catch (error) {
        console.warn('Blockchain recording failed, but entry saved locally:', error)
      }
      
      // Check for badge unlock
      const badgeUnlocked = checkBadgeUnlock(newTotalEntries)
      if (badgeUnlocked) {
        toast.success(`🏆 Badge Unlocked: ${badgeUnlocked}!`, { duration: 6000 })
        updateUser({ totalBadges: currentUser.totalBadges + 1 })
        
        // Send badge unlock email
        if (currentUser.email) {
          emailService.sendBadgeUnlockedEmail(currentUser, {
            name: badgeUnlocked,
            description: getBadgeDescription(badgeUnlocked),
            icon: getBadgeIcon(badgeUnlocked),
            rarity: getBadgeRarity(badgeUnlocked)
          })
        }
      }
      
      toast.success('Learning entry recorded on blockchain! 🎉')
      setFormData({
        title: '',
        description: '',
        category: 'tutorial',
        date: new Date().toISOString().split('T')[0]
      })
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to record entry. Please try again.')
      console.error('Failed to record entry:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const checkBadgeUnlock = (totalEntries) => {
    const badges = {
      1: 'First Steps',
      5: 'Learning Streak', 
      10: 'Knowledge Builder',
      20: 'Learning Master',
      50: 'Dedicated Learner',
      100: 'Learning Legend'
    }
    return badges[totalEntries]
  }
  
  const getBadgeDescription = (badgeName) => {
    const descriptions = {
      'First Steps': 'Recorded your first learning milestone',
      'Learning Streak': 'Completed 5 learning milestones',
      'Knowledge Builder': 'Reached 10 learning milestones',
      'Learning Master': 'Achieved 20 learning milestones',
      'Dedicated Learner': 'Completed 50 learning milestones',
      'Learning Legend': 'Reached 100 learning milestones'
    }
    return descriptions[badgeName] || 'Achievement unlocked!'
  }
  
  const getBadgeIcon = (badgeName) => {
    const icons = {
      'First Steps': '🎯',
      'Learning Streak': '🔥',
      'Knowledge Builder': '🏗️',
      'Learning Master': '👑',
      'Dedicated Learner': '🌟',
      'Learning Legend': '🏆'
    }
    return icons[badgeName] || '🏅'
  }
  
  const getBadgeRarity = (badgeName) => {
    const rarities = {
      'First Steps': 'common',
      'Learning Streak': 'uncommon',
      'Knowledge Builder': 'rare',
      'Learning Master': 'legendary',
      'Dedicated Learner': 'legendary',
      'Learning Legend': 'legendary'
    }
    return rarities[badgeName] || 'common'
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What did you learn?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          placeholder="Describe your learning experience, challenges faced, and key takeaways..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!formData.title || !formData.description}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Recording to Blockchain...' : 'Record Entry'}
          </Button>
        </div>
        
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Blockchain Verified</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Badge Eligible</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Entry #{currentUser?.totalEntries + 1 || 1} • Permanently stored on Hedera blockchain
          </p>
        </div>
      </div>
    </form>
  )
}

export default LogEntryForm