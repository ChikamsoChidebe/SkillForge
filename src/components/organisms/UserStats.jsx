import { motion } from 'framer-motion'
import { Trophy, BookOpen, Calendar, TrendingUp, Target, Zap } from 'lucide-react'
import Card from '@/components/atoms/Card'
import { useAuth } from '@/contexts/AuthContext'

const UserStats = () => {
  const { user } = useAuth()

  if (!user) return null

  const stats = [
    {
      label: 'Total Entries',
      value: user.totalEntries || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Badges Earned',
      value: user.totalBadges || 0,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      label: 'Learning Streak',
      value: `${user.learningStreak || 0} days`,
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: 'Member Since',
      value: new Date(user.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ]

  const getNextBadge = () => {
    const badges = [
      { threshold: 1, name: 'First Steps' },
      { threshold: 5, name: 'Learning Streak' },
      { threshold: 10, name: 'Knowledge Builder' },
      { threshold: 20, name: 'Learning Master' },
      { threshold: 50, name: 'Dedicated Learner' },
      { threshold: 100, name: 'Learning Legend' }
    ]
    
    const nextBadge = badges.find(badge => badge.threshold > user.totalEntries)
    return nextBadge
  }

  const nextBadge = getNextBadge()
  const progress = nextBadge ? (user.totalEntries / nextBadge.threshold) * 100 : 100

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Progress to Next Badge */}
      {nextBadge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Next Badge: {nextBadge.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {nextBadge.threshold - user.totalEntries} more entries to unlock
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {user.totalEntries}/{nextBadge.threshold}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default UserStats