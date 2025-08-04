import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  Star,
  Crown,
  Zap,
  Target,
  BookOpen,
  Calendar,
  Filter,
  Search,
  ChevronUp,
  ChevronDown,
  Flame
} from 'lucide-react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import { leaderboardService } from '@/api/leaderboardService'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const Leaderboard = () => {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [userRanking, setUserRanking] = useState(null)
  const [trendingLearners, setTrendingLearners] = useState([])
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('all')
  const [category, setCategory] = useState('')
  const [activeTab, setActiveTab] = useState('global')

  useEffect(() => {
    loadLeaderboardData()
  }, [timeframe, category, user])

  const loadLeaderboardData = async () => {
    try {
      setLoading(true)
      const [
        leaderboardData,
        trendingData,
        achievementsData,
        statsData
      ] = await Promise.all([
        activeTab === 'global' 
          ? leaderboardService.getGlobalLeaderboard({ timeframe })
          : leaderboardService.getCategoryLeaderboard(category),
        leaderboardService.getTrendingLearners(),
        leaderboardService.getAvailableAchievements(),
        leaderboardService.getLeaderboardStats()
      ])
      
      setLeaderboard(leaderboardData)
      setTrendingLearners(trendingData)
      setAchievements(achievementsData)
      setStats(statsData)

      if (user) {
        const userRank = await leaderboardService.getUserRanking(user.id)
        setUserRanking(userRank)
      }
    } catch (error) {
      toast.error('Failed to load leaderboard data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
    if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
    if (rank <= 10) return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
    return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      case 'Intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
      case 'Advanced':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const LeaderboardItem = ({ user, rank, showChange = false }) => {
    const rankChange = user.rankChange || 0
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rank * 0.05 }}
        className={`group ${rank <= 3 ? 'mb-6' : 'mb-4'}`}
      >
        <Card className={`p-6 hover:shadow-lg transition-all duration-300 ${
          rank <= 3 ? 'ring-2 ring-yellow-200 dark:ring-yellow-800' : ''
        }`}>
          <div className="flex items-center space-x-4">
            {/* Rank */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankBadge(rank)}`}>
              {rank <= 3 ? getRankIcon(rank) : rank}
            </div>

            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
              />
              {rank === 1 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(user.level)}`}>
                  {user.level}
                </span>
                {showChange && rankChange !== 0 && (
                  <div className={`flex items-center space-x-1 text-xs ${
                    rankChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {rankChange > 0 ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(rankChange)}</span>
                  </div>
                )}
              </div>

              {/* Badges */}
              {user.badges && user.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {user.badges.slice(0, 3).map((badge, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                  {user.badges.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{user.badges.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {user.coursesCompleted} courses
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {user.certificatesEarned} certs
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {user.learningStreak} day streak
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {user.forumPosts} posts
                  </span>
                </div>
              </div>
            </div>

            {/* Points */}
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatNumber(user.totalPoints)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">points</div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  const UserRankingCard = () => {
    if (!userRanking) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Your Ranking
            </h2>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Top {userRanking.percentile}%
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={userRanking.avatar}
                  alt={userRanking.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {userRanking.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Rank #{userRanking.rank} of {userRanking.totalUsers}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(userRanking.totalPoints)}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Total Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {userRanking.coursesCompleted}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Courses</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {userRanking.pointsToNext > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Next Rank Progress
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {userRanking.pointsToNext} points to go
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.max(10, 100 - (userRanking.pointsToNext / 1000) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {userRanking.badges && userRanking.badges.slice(0, 4).map((badge, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  const AchievementCard = ({ achievement }) => (
    <Card className="p-4 text-center hover:shadow-lg transition-all duration-300">
      <div className="text-3xl mb-2">{achievement.icon}</div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {achievement.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {achievement.description}
      </p>
      <div className="text-lg font-bold text-blue-600">
        {achievement.points} pts
      </div>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Leaderboard
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Compete with fellow learners, track your progress, and celebrate achievements. 
          Climb the ranks by completing courses, earning certificates, and engaging with the community.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalUsers || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Learners</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatNumber(stats.totalPoints || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.averagePoints || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Average Points</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Crown className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.topUser?.name?.split(' ')[0] || 'N/A'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Top Learner</div>
        </Card>
      </motion.div>

      {/* User Ranking */}
      {user && <UserRankingCard />}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Tabs */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('global')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'global'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Global
                  </button>
                  <button
                    onClick={() => setActiveTab('category')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'category'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    By Category
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 flex-1">
                  {activeTab === 'global' && (
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Time</option>
                      <option value="year">This Year</option>
                      <option value="month">This Month</option>
                      <option value="week">This Week</option>
                    </select>
                  )}

                  {activeTab === 'category' && (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="Mobile">Mobile</option>
                    </select>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Leaderboard List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, index) => (
                  <Card key={index} className="p-6 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/3"></div>
                        <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-1/2"></div>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No rankings available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start learning to appear on the leaderboard!
                </p>
              </Card>
            ) : (
              <div>
                {leaderboard.map((user, index) => (
                  <LeaderboardItem
                    key={user.id}
                    user={user}
                    rank={index + 1}
                    showChange={timeframe !== 'all'}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Learners */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Trending Learners
                </h2>
              </div>
              <div className="space-y-3">
                {trendingLearners.slice(0, 5).map((user, index) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600">
                        {index + 1}
                      </span>
                    </div>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span>{user.learningStreak} day streak</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatNumber(user.totalPoints)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Achievements
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {achievements.slice(0, 6).map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Point System */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Point System
                </h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Complete Course</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">200 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Attend Workshop</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">150 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Earn Certificate</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">300 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pass Quiz</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">25 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Forum Post</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">15 pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Daily Login</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">5 pts</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard