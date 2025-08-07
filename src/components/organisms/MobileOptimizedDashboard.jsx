import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen,
  Trophy,
  TrendingUp,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const MobileOptimizedDashboard = ({ entries, badges, stats }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stats.totalEntries} entries • {stats.unlockedBadges} badges
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2"
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => setShowMobileMenu(true)}
              className="p-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Stats Cards - Horizontal Scroll */}
      <div className="px-4 py-4">
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { label: 'Entries', value: stats.totalEntries, icon: BookOpen, color: 'blue' },
            { label: 'Badges', value: stats.unlockedBadges, icon: Trophy, color: 'yellow' },
            { label: 'Streak', value: `${stats.streak}d`, icon: TrendingUp, color: 'green' }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <Card className="p-4 w-24 text-center">
                  <div className={`w-8 h-8 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={`w-4 h-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4"
        >
          <Card className="p-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <select className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Categories</option>
                  <option>Tutorial</option>
                  <option>Project</option>
                  <option>Course</option>
                </select>
                
                <select className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Time</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Mobile Entries List */}
      <div className="px-4 pb-20">
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-1">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {entry.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        {entry.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          <Button variant="ghost" size="sm" className="flex-col p-2">
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-xs">Entries</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col p-2">
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-xs">Badges</span>
          </Button>
          <Button size="sm" className="flex-col p-3 rounded-full">
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setShowMobileMenu(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="w-full bg-white dark:bg-gray-800 rounded-t-2xl p-6 safe-area-pb"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Quick Actions
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full justify-start" size="lg">
                <Plus className="w-5 h-5 mr-3" />
                Add Learning Entry
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Trophy className="w-5 h-5 mr-3" />
                View Badges
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default MobileOptimizedDashboard