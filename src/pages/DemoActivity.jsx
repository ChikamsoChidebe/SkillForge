import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Award, Activity, Trash2, RefreshCw } from 'lucide-react'
import { userActivityService } from '../services/userActivityService'
import Card from '../components/atoms/Card'
import Button from '../components/atoms/Button'

const DemoActivity = () => {
  const [userActivity, setUserActivity] = useState({
    learningEntries: [],
    badges: [],
    totalEntries: 0,
    totalBadges: 0
  })
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({ title: '', description: '', category: 'learning' })
  const demoAccountId = '0.0.6478142'

  useEffect(() => {
    loadUserActivity()
  }, [])

  const loadUserActivity = () => {
    const activity = userActivityService.getUserActivity(demoAccountId)
    setUserActivity(activity)
  }

  const handleAddEntry = async () => {
    if (!newEntry.title.trim()) return
    
    try {
      userActivityService.addLearningEntry(demoAccountId, newEntry)
      loadUserActivity()
      setNewEntry({ title: '', description: '', category: 'learning' })
      setShowAddEntry(false)
    } catch (error) {
      console.error('Failed to add entry:', error)
    }
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all demo data?')) {
      localStorage.removeItem('skillforge_user_activity')
      loadUserActivity()
    }
  }

  const addSampleData = () => {
    const sampleEntries = [
      { title: 'React Hooks Mastery', description: 'Learned useState, useEffect, and custom hooks', category: 'learning' },
      { title: 'JavaScript ES6 Features', description: 'Arrow functions, destructuring, and modules', category: 'learning' },
      { title: 'Built Todo App', description: 'Created a full-stack todo application', category: 'project' },
      { title: 'CSS Grid Layout', description: 'Mastered CSS Grid for responsive layouts', category: 'skill' },
      { title: 'API Integration', description: 'Connected frontend to REST APIs', category: 'achievement' }
    ]

    sampleEntries.forEach(entry => {
      userActivityService.addLearningEntry(demoAccountId, entry)
    })
    
    loadUserActivity()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Real User Activity Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This demonstrates real user activity tracking with blockchain verification
        </p>
        
        <div className="flex justify-center gap-4">
          <Button onClick={() => setShowAddEntry(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </Button>
          <Button variant="outline" onClick={addSampleData} className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Add Sample Data</span>
          </Button>
          <Button variant="outline" onClick={clearAllData} className="flex items-center space-x-2 text-red-600">
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userActivity.totalEntries}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Learning Entries</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userActivity.totalBadges}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">NFT Badges Earned</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Learning Entries */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Learning Entries
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userActivity.learningEntries.length > 0 ? (
            userActivity.learningEntries.slice().reverse().map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {entry.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {entry.description || 'No description'}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {entry.category}
                    </span>
                    <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
              No learning entries yet. Add your first entry!
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          NFT Badges
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userActivity.badges.length > 0 ? (
            userActivity.badges.slice().reverse().map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 text-center">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {badge.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {badge.description}
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                      badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      badge.rarity === 'uncommon' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {badge.rarity}
                    </span>
                    <span className="text-gray-500">
                      {new Date(badge.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400">
              No badges earned yet. Complete learning entries to earn badges!
            </div>
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Add Learning Entry
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entry Title
                </label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What did you learn?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newEntry.description}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your learning experience..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newEntry.category}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="learning">Learning</option>
                  <option value="project">Project</option>
                  <option value="skill">Skill</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddEntry(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddEntry}
                  disabled={!newEntry.title.trim()}
                  className="flex-1"
                >
                  Add Entry
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default DemoActivity