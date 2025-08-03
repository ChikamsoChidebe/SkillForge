import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { reliableSync } from '@/api/reliableSync'
import { realEmailService } from '@/api/realEmailService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('skillforge_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error loading user data:', error)
        localStorage.removeItem('skillforge_user')
      }
    }
    setIsLoading(false)
  }, [])

  const register = async (userData) => {
    try {
      setIsLoading(true)
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      const userExists = existingUsers.find(u => 
        u.email === userData.email || u.username === userData.username
      )
      
      if (userExists) {
        throw new Error('User already exists with this email or username')
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        createdAt: new Date().toISOString(),
        totalEntries: 0,
        totalBadges: 0,
        learningStreak: 0,
        lastEntryDate: null,
        preferences: {
          theme: 'system',
          notifications: true,
          publicProfile: true
        }
      }

      // Create with reliable cloud sync
      await reliableSync.createUser(newUser)
      
      // Send welcome email
      if (newUser.email) {
        realEmailService.sendWelcomeEmail(newUser)
      }
      
      // Set as current user
      localStorage.setItem('skillforge_user', JSON.stringify(newUser))
      setUser(newUser)
      setIsAuthenticated(true)
      
      toast.success('Account created successfully!')
      return { success: true, user: newUser }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setIsLoading(true)
      
      // Login with reliable cloud sync
      const user = await reliableSync.loginUser(credentials.identifier, credentials.password)
      
      if (!user) {
        throw new Error('Invalid credentials')
      }

      // Sync user entries after login
      setTimeout(() => reliableSync.getUserEntries(user.id), 1000)
      
      localStorage.setItem('skillforge_user', JSON.stringify(user))
      setUser(user)
      setIsAuthenticated(true)
      
      toast.success(`Welcome back, ${user.fullName}!`)
      return { success: true, user }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('skillforge_user')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    
    // Update in users list
    const existingUsers = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
    const userIndex = existingUsers.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      existingUsers[userIndex] = updatedUser
      localStorage.setItem('skillforge_users', JSON.stringify(existingUsers))
    }
    
    // Update current user
    localStorage.setItem('skillforge_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}