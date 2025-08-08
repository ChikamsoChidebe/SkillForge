import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { reliableSync } from '@/api/reliableSync'
import { realEmailService } from '@/api/realEmailService'
import { supabaseService } from '@/api/supabaseClient'
import { googleAuthService } from '@/api/googleAuthService'

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
    console.log('🔍 Loading saved user:', !!savedUser)
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        console.log('✅ User data loaded:', { id: userData.id, username: userData.username })
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('❌ Error loading user data:', error)
        localStorage.removeItem('skillforge_user')
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
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

      // Check if wallet is already connected (from localStorage or session)
      const existingWalletData = localStorage.getItem('skillforge_wallet_data')
      let walletInfo = null
      if (existingWalletData) {
        try {
          walletInfo = JSON.parse(existingWalletData)
          console.log('✅ Found existing wallet connection:', walletInfo.hederaAccountId)
        } catch (e) {
          console.log('⚠️ Invalid wallet data, clearing...')
          localStorage.removeItem('skillforge_wallet_data')
        }
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
        // Include wallet info if already connected
        walletConnected: !!walletInfo,
        hederaAccountId: walletInfo?.hederaAccountId || null,
        connectionType: walletInfo?.connectionType || null,
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
      
      // Clear temporary wallet data since it's now part of user profile
      if (walletInfo) {
        localStorage.removeItem('skillforge_wallet_data')
      }
      
      toast.success('Account created successfully!')
      return { 
        success: true, 
        user: newUser,
        needsWalletConnection: !walletInfo // Indicate if wallet connection is needed
      }
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
      console.log('🔑 Attempting login for:', credentials.identifier)
      
      let user = null
      
      // First, try Supabase database
      try {
        console.log('💾 Checking Supabase database...')
        const cloudUser = await supabaseService.getUserByEmail(credentials.identifier)
        if (cloudUser && cloudUser.password === credentials.password) {
          user = cloudUser
          console.log('✅ User found in Supabase database')
        }
      } catch (error) {
        console.log('⚠️ Supabase check failed:', error.message)
      }
      
      // If not found in Supabase, check localStorage
      if (!user) {
        console.log('💾 Checking localStorage...')
        const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
        user = users.find(u => 
          (u.email === credentials.identifier || u.username === credentials.identifier) && 
          u.password === credentials.password
        )
        if (user) {
          console.log('✅ User found in localStorage')
        }
      }
      
      if (!user) {
        throw new Error('Invalid email/username or password')
      }

      console.log('✅ Login successful for user:', { id: user.id, username: user.username })
      
      // Set authentication state immediately
      localStorage.setItem('skillforge_user', JSON.stringify(user))
      setUser(user)
      setIsAuthenticated(true)
      
      // Sync user profile from Supabase in background (optional)
      setTimeout(async () => {
        try {
          const profileData = await supabaseService.getUserProfile(user.id)
          if (profileData) {
            const mergedUser = { ...user, ...profileData }
            localStorage.setItem('skillforge_user', JSON.stringify(mergedUser))
            setUser(mergedUser)
            console.log('✅ User profile synced from Supabase')
          }
        } catch (err) {
          console.log('⚠️ Background profile sync failed (this is optional):', err.message)
          // This is optional - app works fine without Supabase sync
        }
      }, 1000)
      
      toast.success(`Welcome back, ${user.fullName || user.username}!`)
      return { success: true, user }
    } catch (error) {
      console.error('❌ Login failed:', error.message)
      setIsAuthenticated(false)
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
    try {
      // Update local user state first (always works)
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
      
      // Try to update in Supabase (optional)
      try {
        await supabaseService.updateUser(user.id, updates)
        console.log('✅ User updated in both local storage and Supabase')
      } catch (supabaseError) {
        console.log('⚠️ Supabase update failed (local update successful):', supabaseError.message)
      }
      
    } catch (error) {
      console.error('⚠️ Failed to update user:', error)
    }
  }

  // Google OAuth login/register
  const googleAuth = async (googleData, mode = 'login') => {
    try {
      setIsLoading(true)
      console.log('🔍 Google Auth called:', { email: googleData.email, mode })
      
      // Check if user exists
      let existingUser = null
      
      // Check Supabase first
      try {
        existingUser = await supabaseService.getUserByEmail(googleData.email)
        console.log('✅ Found user in Supabase:', !!existingUser)
      } catch (error) {
        console.log('⚠️ Supabase check failed, checking localStorage')
      }
      
      // Check localStorage if not found in Supabase
      if (!existingUser) {
        const users = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
        existingUser = users.find(u => u.email === googleData.email)
        console.log('✅ Found user in localStorage:', !!existingUser)
      }
      
      if (existingUser && mode === 'register') {
        // User exists, switch to login mode
        console.log('🔄 User exists, switching to login mode')
        mode = 'login'
      }
      
      let user = existingUser
      
      if (!existingUser) {
        // Create new user from Google data
        console.log('👤 Creating new user from Google data')
        
        // Generate username from email
        const baseUsername = googleData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
        let username = baseUsername
        
        // Ensure username is unique
        const existingUsers = JSON.parse(localStorage.getItem('skillforge_users') || '[]')
        let counter = 1
        while (existingUsers.find(u => u.username === username)) {
          username = `${baseUsername}${counter}`
          counter++
        }
        
        // Check wallet connection
        const existingWalletData = localStorage.getItem('skillforge_wallet_data')
        let walletInfo = null
        if (existingWalletData) {
          try {
            walletInfo = JSON.parse(existingWalletData)
          } catch (e) {
            localStorage.removeItem('skillforge_wallet_data')
          }
        }
        
        user = {
          id: `google_${googleData.sub}_${Date.now()}`,
          username,
          email: googleData.email,
          fullName: googleData.name,
          avatar: googleData.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          createdAt: new Date().toISOString(),
          totalEntries: 0,
          totalBadges: 0,
          learningStreak: 0,
          lastEntryDate: null,
          googleId: googleData.sub,
          emailVerified: googleData.email_verified,
          authProvider: 'google',
          walletConnected: !!walletInfo,
          hederaAccountId: walletInfo?.hederaAccountId || null,
          connectionType: walletInfo?.connectionType || null,
          preferences: {
            theme: 'system',
            notifications: true,
            publicProfile: true
          }
        }
        
        // Create user with reliable sync
        await reliableSync.createUser(user)
        
        // Send welcome email
        if (user.email) {
          realEmailService.sendWelcomeEmail(user)
        }
        
        // Clear temporary wallet data
        if (walletInfo) {
          localStorage.removeItem('skillforge_wallet_data')
        }
        
        toast.success(`Welcome to SkillForge, ${user.fullName}! 🎉`)
      } else {
        // Update existing user with latest Google data
        const updatedUser = {
          ...existingUser,
          fullName: googleData.name || existingUser.fullName,
          avatar: googleData.picture || existingUser.avatar,
          emailVerified: googleData.email_verified || existingUser.emailVerified,
          lastLoginAt: new Date().toISOString()
        }
        
        // Update in database
        await reliableSync.updateUser(updatedUser.id, {
          fullName: updatedUser.fullName,
          avatar: updatedUser.avatar,
          emailVerified: updatedUser.emailVerified,
          lastLoginAt: updatedUser.lastLoginAt
        })
        
        user = updatedUser
        toast.success(`Welcome back, ${user.fullName}! 🎉`)
      }
      
      // Set authentication state
      localStorage.setItem('skillforge_user', JSON.stringify(user))
      setUser(user)
      setIsAuthenticated(true)
      
      console.log('✅ Google authentication successful')
      return { 
        success: true, 
        user,
        isNewUser: !existingUser,
        needsWalletConnection: !user.walletConnected
      }
    } catch (error) {
      console.error('❌ Google authentication failed:', error)
      toast.error('Google sign-in failed. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    updateUser,
    googleAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}