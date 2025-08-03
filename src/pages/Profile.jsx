import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  User, 
  Wallet, 
  Settings, 
  Download, 
  Share2, 
  ExternalLink,
  Calendar,
  Trophy,
  BookOpen,
  Target,
  TrendingUp,
  Activity,
  Copy,
  Check,
  Edit3,
  Save,
  X,
  Github,
  Twitter,
  Linkedin,
  Globe
} from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import LoadingSpinner from '@/components/organisms/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { userService } from '@/api/userService'
import toast from 'react-hot-toast'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [copiedField, setCopiedField] = useState(null)
  const { user, logout } = useAuth()
  
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('devchain_profile')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // If parsing fails, return default
      }
    }
    return {
      displayName: 'Anonymous Developer',
      bio: 'Building the future, one line of code at a time.',
      location: '',
      website: '',
      github: '',
      twitter: '',
      linkedin: ''
    }
  })

  // Update display name when user data is available
  useEffect(() => {
    if (user && profileData.displayName === 'Anonymous Developer') {
      setProfileData(prev => ({
        ...prev,
        displayName: user.name || user.username || 'Anonymous Developer'
      }))
    }
  }, [user, profileData.displayName])
  const [entries, setEntries] = useState([])
  const [badges, setBadges] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])
  
  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const [userEntries, userBadges] = await Promise.all([
        userService.getUserEntries(user.id),
        userService.getUserBadges(user.id)
      ])
      setEntries(userEntries)
      setBadges(userBadges)
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const totalEntries = entries.length
    const unlockedBadges = badges.filter(badge => badge.unlocked).length
    const totalBadges = badges.length
    
    // Calculate streak
    const sortedEntries = entries
      .map(entry => new Date(entry.date))
      .sort((a, b) => b - a)
    
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const entryDate of sortedEntries) {
      const entryDateOnly = new Date(entryDate)
      entryDateOnly.setHours(0, 0, 0, 0)
      
      const diffDays = Math.floor((currentDate - entryDateOnly) / (1000 * 60 * 60 * 24))
      
      if (diffDays === tempStreak) {
        tempStreak++
        if (currentStreak === 0) currentStreak = tempStreak
        longestStreak = Math.max(longestStreak, tempStreak)
        currentDate = new Date(entryDateOnly)
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (diffDays > tempStreak) {
        break
      }
    }

    // Calculate weekly activity
    const weekStart = startOfWeek(new Date())
    const weekEnd = endOfWeek(new Date())
    const thisWeekEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate >= weekStart && entryDate <= weekEnd
    }).length

    // Calculate monthly activity
    const monthStart = new Date()
    monthStart.setDate(1)
    const thisMonthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate >= monthStart
    }).length

    // Calculate category distribution
    const categoryStats = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1
      return acc
    }, {})

    // Calculate learning velocity (entries per week over last 4 weeks)
    const fourWeeksAgo = subDays(new Date(), 28)
    const recentEntries = entries.filter(entry => new Date(entry.date) >= fourWeeksAgo)
    const learningVelocity = Math.round((recentEntries.length / 4) * 10) / 10

    return {
      totalEntries,
      unlockedBadges,
      totalBadges,
      completionRate: totalBadges > 0 ? Math.round((unlockedBadges / totalBadges) * 100) : 0,
      currentStreak,
      longestStreak,
      thisWeekEntries,
      thisMonthEntries,
      categoryStats,
      learningVelocity,
      joinDate: entries.length > 0 ? entries[entries.length - 1].date : new Date().toISOString()
    }
  }, [entries, badges])

  // Generate activity heatmap data
  const activityData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 365),
      end: new Date()
    })

    const entryDates = entries.reduce((acc, entry) => {
      const date = format(new Date(entry.date), 'yyyy-MM-dd')
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return days.map(day => ({
      date: format(day, 'yyyy-MM-dd'),
      count: entryDates[format(day, 'yyyy-MM-dd')] || 0
    }))
  }, [entries])

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const handleSaveProfile = () => {
    // In a real app, this would save to a backend or IPFS
    localStorage.setItem('devchain_profile', JSON.stringify(profileData))
    setIsEditing(false)
    toast.success('Profile updated!')
  }

  const handleExportData = () => {
    const exportData = {
      profile: profileData,
      entries,
      badges: badges.filter(badge => badge.unlocked),
      stats,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `devchain-profile-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Profile data exported!')
  }

  const handleShareProfile = async () => {
    const shareData = {
      title: `${profileData.displayName}'s DevChain Profile`,
      text: `Check out my learning journey on DevChain! ${stats.totalEntries} entries, ${stats.unlockedBadges} badges earned.`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await handleCopy(
        `${shareData.text} ${shareData.url}`,
        'share'
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading your profile..." />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Developer Profile
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Your learning journey, achievements, and blockchain-verified progress
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="text-center mb-6">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.fullName || user.username}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div 
                  className={`w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg ${user?.avatar ? 'hidden' : 'flex'}`}
                >
                  {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Display Name"
                    />
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Bio"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {profileData.displayName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {profileData.bio}
                    </p>
                  </>
                )}

                <div className="flex justify-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Wallet Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Wallet
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                      {user?.username}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(user?.username, 'wallet')}
                    >
                      {copiedField === 'wallet' ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Member Since
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(stats.joinDate), 'MMM yyyy')}
                  </span>
                </div>
              </div>

              {/* Social Links */}
              {isEditing && (
                <div className="space-y-3 mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Social Links
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Github className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="GitHub username"
                        value={profileData.github}
                        onChange={(e) => setProfileData(prev => ({ ...prev, github: e.target.value }))}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Twitter className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Twitter handle"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Linkedin className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="LinkedIn profile"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Website URL"
                        value={profileData.website}
                        onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Social Links Display */}
              {!isEditing && (profileData.github || profileData.twitter || profileData.linkedin || profileData.website) && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Social Links
                  </h3>
                  <div className="space-y-2">
                    {profileData.github && (
                      <a
                        href={`https://github.com/${profileData.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>@{profileData.github}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {profileData.twitter && (
                      <a
                        href={`https://twitter.com/${profileData.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        <span>@{profileData.twitter}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {profileData.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${profileData.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>{profileData.linkedin}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {profileData.website && (
                      <a
                        href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>{profileData.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={handleShareProfile}
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Link to="/settings" className="block">
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Statistics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Entries',
                  value: stats.totalEntries,
                  icon: BookOpen,
                  color: 'blue'
                },
                {
                  label: 'Badges Earned',
                  value: `${stats.unlockedBadges}/${stats.totalBadges}`,
                  icon: Trophy,
                  color: 'yellow'
                },
                {
                  label: 'Current Streak',
                  value: `${stats.currentStreak} days`,
                  icon: Activity,
                  color: 'green'
                },
                {
                  label: 'Learning Velocity',
                  value: `${stats.learningVelocity}/week`,
                  icon: TrendingUp,
                  color: 'purple'
                }
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label} className="text-center">
                    <div className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </Card>
                )
              })}
            </div>
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Learning Activity
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-sm ${
                          level === 0 ? 'bg-gray-200 dark:bg-gray-700' :
                          level === 1 ? 'bg-green-200 dark:bg-green-800' :
                          level === 2 ? 'bg-green-300 dark:bg-green-700' :
                          level === 3 ? 'bg-green-400 dark:bg-green-600' :
                          'bg-green-500 dark:bg-green-500'
                        }`}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="flex flex-wrap gap-1 justify-center" style={{ maxWidth: '100%' }}>
                  {activityData.map((day, index) => {
                    const intensity = Math.min(day.count, 4)
                    return (
                      <div
                        key={day.date}
                        className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${
                          intensity === 0 ? 'bg-gray-200 dark:bg-gray-700' :
                          intensity === 1 ? 'bg-green-200 dark:bg-green-800' :
                          intensity === 2 ? 'bg-green-300 dark:bg-green-700' :
                          intensity === 3 ? 'bg-green-400 dark:bg-green-600' :
                          'bg-green-500 dark:bg-green-500'
                        }`}
                        title={`${day.date}: ${day.count} entries`}
                      />
                    )
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Learning Categories
              </h3>
              
              <div className="space-y-4">
                {Object.entries(stats.categoryStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, count]) => {
                    const percentage = Math.round((count / stats.totalEntries) * 100)
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="primary" size="sm">
                            {category}
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {count} entries
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-10">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </Card>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Recent Achievements
              </h3>
              
              <div className="space-y-4">
                {badges
                  .filter(badge => badge.unlocked)
                  .slice(0, 3)
                  .map((badge, index) => (
                    <div key={badge.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {badge.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {badge.description}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {badge.unlockedAt && format(new Date(badge.unlockedAt), 'MMM dd')}
                      </div>
                    </div>
                  ))}
                
                {badges.filter(badge => badge.unlocked).length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No badges earned yet. Keep learning to unlock your first achievement!</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile