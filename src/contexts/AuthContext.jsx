import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { reliableSync } from '@/api/reliableSync'
import { realEmailService } from '@/api/realEmailService'
import { supabaseService } from '@/api/supabaseClient'

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
      
      // Debug: Log what userData contains
      console.log('🔍 Register called with userData:', {
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        hasPassword: !!userData.password,
        passwordLength: userData.password?.length,
        allKeys: Object.keys(userData)
      })
      
      // Check if user already exists (both local and cloud)
      const existingUsers = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
      const localUserExists = existingUsers.find(u => 
        u.email === userData.email || u.username === userData.username
      )
      
      // Also check cloud database
      let cloudUserExists = null
      try {
        cloudUserExists = await supabaseService.getUserByEmail(userData.email)
      } catch (e) {
        // Cloud check failed, continue with local check only
      }
      
      if (localUserExists) {
        if (localUserExists.email === userData.email) {
          throw new Error('An account with this email already exists. Please use a different email or try logging in.')
        }
        if (localUserExists.username === userData.username) {
          throw new Error('This username is already taken. Please choose a different username.')
        }
      }
      
      if (cloudUserExists) {
        throw new Error('An account with this email already exists. Please try logging in instead.')
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        password: userData.password, // ✅ Added missing password
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
      
      // Try login with email first, then username
      let user = await reliableSync.loginUser(credentials.identifier, credentials.password)
      
      // If email login failed, try username login
      if (!user) {
        const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
        user = users.find(u => 
          u.username === credentials.identifier && u.password === credentials.password
        )
        
        // Also try cloud with username
        if (!user) {
          try {
            const cloudUsers = await supabaseService.getUserByEmail(credentials.identifier)
            if (cloudUsers && cloudUsers.password === credentials.password) {
              user = cloudUsers
            }
          } catch (e) {
            // Continue with local fallback
          }
        }
      }
      
      if (!user) {
        throw new Error('Invalid email/username or password')
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

  const updateUser = async (updates) => {
    const { productionService } = await import('@/api/productionService')
    const updatedUser = await productionService.updateUser(user.id, updates)
    
    if (updatedUser) {
      setUser(updatedUser)
      console.log('✅ User updated successfully')
    }
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