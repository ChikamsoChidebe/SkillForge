import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  BookOpen,
  Trophy,
  TrendingUp,
  Clock,
  Target,
  Award,
  ChevronDown,
  BarChart3,
  Activity
} from 'lucide-react'
import { format, subDays, isAfter, isBefore } from 'date-fns'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import TutorialCard from '@/components/molecules/TutorialCard'
import Modal from '@/components/molecules/Modal'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { supabaseService } from '@/api/supabaseClient'

import LogEntryForm from '@/components/organisms/LogEntryForm'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showNewEntryModal, setShowNewEntryModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [badges, setBadges] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState(null)
  
  const loadUserData = async () => {
    try {
      setDataLoading(true)
      
      // Load entries from Supabase directly
      console.log('🔍 Loading entries for user:', user.id)
      const userEntries = await supabaseService.getUserEntries(user.id)
      console.log('✅ Loaded', userEntries.length, 'entries from Supabase:', userEntries)
      setEntries(userEntries)
      
      // Load user profile from Supabase for accurate stats
      const userProfile = await supabaseService.getUserProfile(user.id)
      const totalEntries = userProfile?.totalEntries || userEntries.length
      
      console.log('📊 User stats - Entries:', totalEntries, 'Badges:', userProfile?.totalBadges || 0)
      
      // Generate badges based on actual entry count from database
      const badgeThresholds = [
        { threshold: 1, name: 'First Steps', unlocked: totalEntries >= 1 },
        { threshold: 5, name: 'Learning Streak', unlocked: totalEntries >= 5 },
        { threshold: 10, name: 'Knowledge Builder', unlocked: totalEntries >= 10 },
        { threshold: 20, name: 'Learning Master', unlocked: totalEntries >= 20 },
        { threshold: 50, name: 'Dedicated Learner', unlocked: totalEntries >= 50 },
        { threshold: 100, name: 'Learning Legend', unlocked: totalEntries >= 100 }
      ]
      setBadges(badgeThresholds)
      
    } catch (err) {
      setDataError(err)
    } finally {
      setDataLoading(false)
    }
  }
  
  useEffect(() => {
    if (user) loadUserData()
  }, [user])
  
  const eligibleBadges = badges.filter(badge => !badge.unlocked)

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let filtered = entries

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(entry => entry.category === selectedCategory)
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      let startDate
      
      switch (dateRange) {
        case 'week':
          startDate = subDays(now, 7)
          break
        case 'month':
          startDate = subDays(now, 30)
          break
        case '3months':
          startDate = subDays(now, 90)
          break
        default:
          startDate = null
      }

      if (startDate) {
        filtered = filtered.filter(entry => 
          isAfter(new Date(entry.date), startDate)
        )
      }
    }

    // Sort entries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date)
        case 'oldest':
          return new Date(a.date) - new Date(b.date)
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [entries, searchTerm, selectedCategory, dateRange, sortBy])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEntries = entries.length
    const thisWeekEntries = entries.filter(entry => 
      isAfter(new Date(entry.date), subDays(new Date(), 7))
    ).length
    const unlockedBadges = badges.filter(badge => badge.unlocked).length
    const categories = [...new Set(entries.map(entry => entry.category))].length

    return {
      totalEntries,
      thisWeekEntries,
      unlockedBadges,
      categories,
      streak: calculateStreak(entries),
      averagePerWeek: Math.round((totalEntries / Math.max(1, getWeeksSinceFirstEntry(entries))) * 10) / 10
    }
  }, [entries, badges])

  const categories = ['all', 'tutorial', 'project', 'course', 'workshop', 'certification']

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Blockchain Learning Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress with Hedera-verified achievements and NFT badges
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {eligibleBadges.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg"
            >
              <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                {eligibleBadges.length} badge{eligibleBadges.length > 1 ? 's' : ''} ready!
              </span>
            </motion.div>
          )}
          
          <Button onClick={() => setShowNewEntryModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Statistics Cards - Hackathon Winning Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            label: 'Blockchain Entries',
            value: stats.totalEntries,
            icon: BookOpen,
            color: 'blue',
            change: `+${stats.thisWeekEntries} this week`
          },
          {
            label: 'Current Streak',
            value: `${stats.streak} days`,
            icon: Activity,
            color: 'green',
            change: 'Keep it up!'
          },
          {
            label: 'NFT Badges',
            value: stats.unlockedBadges,
            icon: Trophy,
            color: 'yellow',
            change: `${badges.length - stats.unlockedBadges} remaining`
          },
          {
            label: 'Categories',
            value: stats.categories,
            icon: Target,
            color: 'purple',
            change: 'Diverse learning'
          },
          {
            label: 'Weekly Average',
            value: stats.averagePerWeek,
            icon: TrendingUp,
            color: 'indigo',
            change: 'Entries per week'
          },
          {
            label: 'This Week',
            value: stats.thisWeekEntries,
            icon: Calendar,
            color: 'pink',
            change: 'New entries'
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <div className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.change}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="3months">Past 3 Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing {filteredEntries.length} of {entries.length} entries
          {searchTerm && (
            <span> for "{searchTerm}"</span>
          )}
        </div>
        
        {(searchTerm || selectedCategory !== 'all' || dateRange !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setDateRange('all')
              setSortBy('newest')
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Entries Grid */}
      {dataLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </Card>
          ))}
        </div>
      ) : dataError ? (
        <Card className="text-center py-12">
          <div className="text-red-500 mb-4">
            <BarChart3 className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to Load Entries</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            There was an error loading your learning entries.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      ) : filteredEntries.length === 0 ? (
        <Card className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {entries.length === 0 ? 'No Entries Yet' : 'No Matching Entries'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {entries.length === 0 
              ? 'Start your learning journey by recording your first milestone.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {entries.length === 0 && (
            <Button onClick={() => setShowNewEntryModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Entry
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry, index) => (
            <TutorialCard key={entry.id} entry={entry} index={index} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredEntries.length > 0 && filteredEntries.length < entries.length && (
        <div className="text-center">
          <Button variant="outline">
            Load More Entries
          </Button>
        </div>
      )}

      {/* New Entry Modal */}
      <Modal
        isOpen={showNewEntryModal}
        onClose={() => setShowNewEntryModal(false)}
        title="Record Learning Milestone"
        size="lg"
      >
        <LogEntryForm 
          onSuccess={async () => {
            setShowNewEntryModal(false)
            // Wait a moment for Supabase to sync
            setTimeout(async () => {
              await loadUserData()
            }, 1000)
          }} 
        />
      </Modal>
    </div>
  )
}

// Helper functions
function calculateStreak(entries) {
  if (!entries.length) return 0
  
  const sortedEntries = entries
    .map(entry => new Date(entry.date))
    .sort((a, b) => b - a)
  
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  for (const entryDate of sortedEntries) {
    const entryDateOnly = new Date(entryDate)
    entryDateOnly.setHours(0, 0, 0, 0)
    
    const diffDays = Math.floor((currentDate - entryDateOnly) / (1000 * 60 * 60 * 24))
    
    if (diffDays === streak) {
      streak++
      currentDate = new Date(entryDateOnly)
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (diffDays > streak) {
      break
    }
  }
  
  return streak
}

function getWeeksSinceFirstEntry(entries) {
  if (!entries.length) return 1
  
  const firstEntry = entries.reduce((earliest, entry) => 
    new Date(entry.date) < new Date(earliest.date) ? entry : earliest
  )
  
  const weeksDiff = Math.ceil((new Date() - new Date(firstEntry.date)) / (1000 * 60 * 60 * 24 * 7))
  return Math.max(1, weeksDiff)
}

export default Dashboard