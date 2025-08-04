import { supabase } from './supabaseClient'

// Sample leaderboard data for development
const SAMPLE_USERS = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    totalPoints: 2850,
    coursesCompleted: 12,
    certificatesEarned: 8,
    workshopsAttended: 5,
    forumPosts: 23,
    learningStreak: 45,
    badges: ['React Expert', 'Top Contributor', 'Learning Streak Master'],
    level: 'Advanced',
    joinedDate: '2023-08-15T00:00:00Z',
    lastActive: '2024-01-15T10:30:00Z',
    achievements: {
      'First Course': '2023-08-20T00:00:00Z',
      'Quiz Master': '2023-09-10T00:00:00Z',
      'Community Helper': '2023-10-05T00:00:00Z',
      'Blockchain Pioneer': '2023-11-15T00:00:00Z'
    }
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    totalPoints: 2650,
    coursesCompleted: 10,
    certificatesEarned: 7,
    workshopsAttended: 4,
    forumPosts: 18,
    learningStreak: 32,
    badges: ['Python Expert', 'Data Science Pro', 'Workshop Enthusiast'],
    level: 'Advanced',
    joinedDate: '2023-07-20T00:00:00Z',
    lastActive: '2024-01-15T09:15:00Z',
    achievements: {
      'First Course': '2023-07-25T00:00:00Z',
      'Data Wizard': '2023-09-30T00:00:00Z',
      'Forum Contributor': '2023-10-20T00:00:00Z'
    }
  },
  {
    id: 'user-3',
    name: 'Mike Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    totalPoints: 2400,
    coursesCompleted: 8,
    certificatesEarned: 6,
    workshopsAttended: 6,
    forumPosts: 31,
    learningStreak: 28,
    badges: ['Blockchain Expert', 'Community Leader', 'Workshop Master'],
    level: 'Advanced',
    joinedDate: '2023-09-10T00:00:00Z',
    lastActive: '2024-01-15T08:45:00Z',
    achievements: {
      'First Course': '2023-09-15T00:00:00Z',
      'Blockchain Pioneer': '2023-10-30T00:00:00Z',
      'Community Helper': '2023-11-25T00:00:00Z'
    }
  },
  {
    id: 'user-4',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    totalPoints: 2200,
    coursesCompleted: 9,
    certificatesEarned: 5,
    workshopsAttended: 3,
    forumPosts: 15,
    learningStreak: 21,
    badges: ['UI/UX Designer', 'Frontend Pro', 'Creative Thinker'],
    level: 'Intermediate',
    joinedDate: '2023-10-05T00:00:00Z',
    lastActive: '2024-01-15T07:20:00Z',
    achievements: {
      'First Course': '2023-10-10T00:00:00Z',
      'Design Master': '2023-11-20T00:00:00Z'
    }
  },
  {
    id: 'user-5',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    totalPoints: 1950,
    coursesCompleted: 7,
    certificatesEarned: 4,
    workshopsAttended: 2,
    forumPosts: 12,
    learningStreak: 15,
    badges: ['JavaScript Pro', 'Quick Learner'],
    level: 'Intermediate',
    joinedDate: '2023-11-15T00:00:00Z',
    lastActive: '2024-01-15T06:30:00Z',
    achievements: {
      'First Course': '2023-11-20T00:00:00Z',
      'JavaScript Master': '2023-12-15T00:00:00Z'
    }
  }
]

// Point system configuration
const POINT_SYSTEM = {
  courseCompletion: 200,
  lessonCompletion: 10,
  quizPassed: 25,
  workshopAttendance: 150,
  certificateEarned: 300,
  forumPost: 15,
  forumReply: 5,
  forumLike: 2,
  dailyLogin: 5,
  learningStreakBonus: 10, // per day in streak
  firstTimeBonus: 50 // for first time completing any activity
}

// Achievement definitions
const ACHIEVEMENTS = {
  'First Course': {
    name: 'First Course',
    description: 'Complete your first course',
    icon: '🎓',
    points: 100,
    condition: (stats) => stats.coursesCompleted >= 1
  },
  'Course Master': {
    name: 'Course Master',
    description: 'Complete 10 courses',
    icon: '📚',
    points: 500,
    condition: (stats) => stats.coursesCompleted >= 10
  },
  'Quiz Master': {
    name: 'Quiz Master',
    description: 'Pass 50 quizzes',
    icon: '🧠',
    points: 300,
    condition: (stats) => stats.quizzesPassed >= 50
  },
  'Workshop Enthusiast': {
    name: 'Workshop Enthusiast',
    description: 'Attend 5 workshops',
    icon: '🎪',
    points: 250,
    condition: (stats) => stats.workshopsAttended >= 5
  },
  'Community Helper': {
    name: 'Community Helper',
    description: 'Make 20 forum posts',
    icon: '🤝',
    points: 200,
    condition: (stats) => stats.forumPosts >= 20
  },
  'Learning Streak Master': {
    name: 'Learning Streak Master',
    description: 'Maintain a 30-day learning streak',
    icon: '🔥',
    points: 400,
    condition: (stats) => stats.learningStreak >= 30
  },
  'Blockchain Pioneer': {
    name: 'Blockchain Pioneer',
    description: 'Complete 3 blockchain courses',
    icon: '⛓️',
    points: 350,
    condition: (stats) => stats.blockchainCourses >= 3
  },
  'Data Wizard': {
    name: 'Data Wizard',
    description: 'Complete 3 data science courses',
    icon: '📊',
    points: 350,
    condition: (stats) => stats.dataScienceCourses >= 3
  },
  'Frontend Pro': {
    name: 'Frontend Pro',
    description: 'Complete 5 frontend courses',
    icon: '💻',
    points: 400,
    condition: (stats) => stats.frontendCourses >= 5
  }
}

class LeaderboardService {
  // Get global leaderboard
  async getGlobalLeaderboard(options = {}) {
    try {
      const { limit = 50, timeframe = 'all' } = options
      
      let users = []
      
      // Try to get real users from localStorage (registered users)
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')
      
      if (registeredUsers.length > 0) {
        // Use real registered users with mock stats
        users = registeredUsers.map((user, index) => ({
          id: user.id,
          name: user.fullName || user.username,
          avatar: user.avatar || `https://images.unsplash.com/photo-${1472099645785 + index}?w=150`,
          totalPoints: Math.floor(Math.random() * 3000) + 500, // Random points for demo
          coursesCompleted: Math.floor(Math.random() * 15) + 1,
          certificatesEarned: Math.floor(Math.random() * 10) + 1,
          workshopsAttended: Math.floor(Math.random() * 8) + 1,
          forumPosts: Math.floor(Math.random() * 25) + 1,
          learningStreak: Math.floor(Math.random() * 50) + 1,
          badges: ['Learner', 'Active Member'],
          level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
          joinedDate: user.createdAt || new Date().toISOString(),
          lastActive: new Date().toISOString()
        }))
      }
      
      // If no registered users, fall back to sample data
      if (users.length === 0) {
        users = [...SAMPLE_USERS]
      }
      
      // Sort by total points
      users.sort((a, b) => b.totalPoints - a.totalPoints)
      
      // Add rankings
      const rankedUsers = users.slice(0, limit).map((user, index) => ({
        ...user,
        rank: index + 1,
        previousRank: index + 1,
        rankChange: 0
      }))
      
      return rankedUsers
    } catch (error) {
      console.error('Error fetching global leaderboard:', error)
      return SAMPLE_USERS.slice(0, options.limit || 50).map((user, index) => ({
        ...user,
        rank: index + 1,
        previousRank: index + 1,
        rankChange: 0
      }))
    }
  }

  // Get category-specific leaderboard
  async getCategoryLeaderboard(category, options = {}) {
    try {
      const { limit = 20 } = options
      
      // Filter users by category expertise (simplified)
      let users = SAMPLE_USERS.filter(user => 
        user.badges.some(badge => 
          badge.toLowerCase().includes(category.toLowerCase())
        )
      )
      
      if (users.length === 0) {
        users = [...SAMPLE_USERS] // Fallback to all users
      }
      
      users.sort((a, b) => b.totalPoints - a.totalPoints)
      
      return users.slice(0, limit).map((user, index) => ({
        ...user,
        rank: index + 1
      }))
    } catch (error) {
      console.error('Error fetching category leaderboard:', error)
      throw error
    }
  }

  // Get user's ranking and stats
  async getUserRanking(userId) {
    try {
      // Get all users for ranking
      const allUsers = await this.getGlobalLeaderboard({ limit: 1000 })
      const userIndex = allUsers.findIndex(user => user.id === userId)
      
      if (userIndex === -1) {
        // If user not found in leaderboard, create a basic profile
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
        if (currentUser.id === userId) {
          return {
            id: userId,
            name: currentUser.fullName || currentUser.username || 'User',
            avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            totalPoints: 0,
            coursesCompleted: 0,
            certificatesEarned: 0,
            workshopsAttended: 0,
            forumPosts: 0,
            learningStreak: 0,
            badges: ['New Member'],
            level: 'Beginner',
            rank: allUsers.length + 1,
            totalUsers: allUsers.length + 1,
            percentile: 0,
            pointsToNext: allUsers.length > 0 ? allUsers[allUsers.length - 1].totalPoints + 1 : 100,
            nextRankUser: allUsers.length > 0 ? allUsers[allUsers.length - 1] : null
          }
        }
        throw new Error('User not found')
      }
      
      const user = allUsers[userIndex]
      const rank = userIndex + 1
      const totalUsers = allUsers.length
      const percentile = Math.round(((totalUsers - rank) / totalUsers) * 100)
      
      // Calculate points needed for next rank
      const nextUser = userIndex > 0 ? allUsers[userIndex - 1] : null
      const pointsToNext = nextUser ? nextUser.totalPoints - user.totalPoints + 1 : 0
      
      return {
        ...user,
        rank,
        totalUsers,
        percentile,
        pointsToNext,
        nextRankUser: nextUser
      }
    } catch (error) {
      console.error('Error fetching user ranking:', error)
      throw error
    }
  }

  // Calculate points for an activity
  calculatePoints(activityType, details = {}) {
    let points = 0
    
    switch (activityType) {
      case 'courseCompletion':
        points = POINT_SYSTEM.courseCompletion
        if (details.isFirstTime) points += POINT_SYSTEM.firstTimeBonus
        break
      case 'lessonCompletion':
        points = POINT_SYSTEM.lessonCompletion
        break
      case 'quizPassed':
        points = POINT_SYSTEM.quizPassed
        // Bonus for perfect score
        if (details.score === 100) points += 10
        break
      case 'workshopAttendance':
        points = POINT_SYSTEM.workshopAttendance
        break
      case 'certificateEarned':
        points = POINT_SYSTEM.certificateEarned
        break
      case 'forumPost':
        points = POINT_SYSTEM.forumPost
        break
      case 'forumReply':
        points = POINT_SYSTEM.forumReply
        break
      case 'forumLike':
        points = POINT_SYSTEM.forumLike
        break
      case 'dailyLogin':
        points = POINT_SYSTEM.dailyLogin
        break
      case 'learningStreak':
        points = details.streakDays * POINT_SYSTEM.learningStreakBonus
        break
      default:
        points = 0
    }
    
    return points
  }

  // Award points to user
  async awardPoints(userId, activityType, points, details = {}) {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .insert({
          user_id: userId,
          activity_type: activityType,
          points,
          details,
          awarded_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Update user's total points
      await supabase
        .from('users')
        .update({
          total_points: supabase.raw('total_points + ?', [points])
        })
        .eq('id', userId)

      // Check for new achievements
      await this.checkAchievements(userId)

      return data
    } catch (error) {
      console.error('Error awarding points:', error)
      throw error
    }
  }

  // Check and award achievements
  async checkAchievements(userId) {
    try {
      // Get user stats
      const userStats = await this.getUserStats(userId)
      
      // Check each achievement
      for (const [achievementId, achievement] of Object.entries(ACHIEVEMENTS)) {
        // Check if user already has this achievement
        const { data: existingAchievement } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', userId)
          .eq('achievement_id', achievementId)
          .single()

        if (!existingAchievement && achievement.condition(userStats)) {
          // Award achievement
          await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievementId,
              achievement_name: achievement.name,
              points_awarded: achievement.points,
              earned_at: new Date().toISOString()
            })

          // Award points for achievement
          await this.awardPoints(userId, 'achievement', achievement.points, {
            achievementId,
            achievementName: achievement.name
          })
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
      throw error
    }
  }

  // Get user statistics for achievement checking
  async getUserStats(userId) {
    try {
      // In a real implementation, this would aggregate from various tables
      const user = SAMPLE_USERS.find(u => u.id === userId)
      
      if (!user) {
        return {
          coursesCompleted: 0,
          quizzesPassed: 0,
          workshopsAttended: 0,
          forumPosts: 0,
          learningStreak: 0,
          blockchainCourses: 0,
          dataScienceCourses: 0,
          frontendCourses: 0
        }
      }

      return {
        coursesCompleted: user.coursesCompleted,
        quizzesPassed: user.coursesCompleted * 3, // Estimate
        workshopsAttended: user.workshopsAttended,
        forumPosts: user.forumPosts,
        learningStreak: user.learningStreak,
        blockchainCourses: user.badges.includes('Blockchain Expert') ? 3 : 0,
        dataScienceCourses: user.badges.includes('Data Science Pro') ? 3 : 0,
        frontendCourses: user.badges.includes('Frontend Pro') ? 5 : 0
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw error
    }
  }

  // Get user's achievements
  async getUserAchievements(userId) {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })

      if (error) throw error

      // Enrich with achievement details
      const achievements = (data || []).map(userAchievement => ({
        ...userAchievement,
        details: ACHIEVEMENTS[userAchievement.achievement_id] || {}
      }))

      return achievements
    } catch (error) {
      console.error('Error fetching user achievements:', error)
      throw error
    }
  }

  // Get leaderboard statistics
  async getLeaderboardStats() {
    try {
      const users = SAMPLE_USERS
      const totalPoints = users.reduce((sum, user) => sum + user.totalPoints, 0)
      const averagePoints = Math.round(totalPoints / users.length)
      const topUser = users.reduce((top, user) => 
        user.totalPoints > top.totalPoints ? user : top
      )

      const levelDistribution = users.reduce((dist, user) => {
        dist[user.level] = (dist[user.level] || 0) + 1
        return dist
      }, {})

      return {
        totalUsers: users.length,
        totalPoints,
        averagePoints,
        topUser,
        levelDistribution,
        recentAchievements: [] // Would fetch recent achievements in real implementation
      }
    } catch (error) {
      console.error('Error fetching leaderboard stats:', error)
      throw error
    }
  }

  // Get trending learners (users with recent high activity)
  async getTrendingLearners(limit = 10) {
    try {
      // Simple trending algorithm based on recent activity
      const users = [...SAMPLE_USERS]
        .sort((a, b) => {
          // Score based on recent activity (simplified)
          const aScore = a.learningStreak * 2 + a.totalPoints * 0.1
          const bScore = b.learningStreak * 2 + b.totalPoints * 0.1
          return bScore - aScore
        })
        .slice(0, limit)

      return users.map((user, index) => ({
        ...user,
        trendingRank: index + 1
      }))
    } catch (error) {
      console.error('Error fetching trending learners:', error)
      throw error
    }
  }

  // Get point history for user
  async getUserPointHistory(userId, options = {}) {
    try {
      const { limit = 50, days = 30 } = options
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .gte('awarded_at', cutoffDate.toISOString())
        .order('awarded_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching user point history:', error)
      throw error
    }
  }

  // Get available achievements
  getAvailableAchievements() {
    return Object.entries(ACHIEVEMENTS).map(([id, achievement]) => ({
      id,
      ...achievement
    }))
  }

  // Get point system configuration
  getPointSystem() {
    return POINT_SYSTEM
  }
}

export const leaderboardService = new LeaderboardService()