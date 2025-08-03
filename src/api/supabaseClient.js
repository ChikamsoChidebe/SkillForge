import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseKey
  })
}

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export const supabaseService = {
  // Create user
  async createUser(userData) {
    try {
      // Debug: Log what we're sending
      console.log('📤 Sending to Supabase:', {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        hasPassword: !!userData.password,
        passwordLength: userData.password?.length
      })
      
      // Minimal insert to bypass cache issues - only send essential fields
      const minimalUser = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password: userData.password || 'temp_password_123' // Fallback if missing
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert([minimalUser])
        .select()
      
      if (error) throw error
      
      console.log('✅ Supabase user created:', data[0])
      // Return full user data (Supabase will have defaults)
      return { ...userData, ...data[0] }
    } catch (error) {
      console.error('Supabase create user error:', error)
      throw error
    }
  },

  // Get user by email
  async getUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Supabase get user error:', error)
      return null
    }
  },

  // Update user (only essential fields)
  async updateUser(userId, updates) {
    try {
      // Only update fields that exist in database
      const allowedUpdates = {}
      if (updates.username) allowedUpdates.username = updates.username
      if (updates.email) allowedUpdates.email = updates.email
      if (updates.password) allowedUpdates.password = updates.password
      
      // Skip if no valid updates
      if (Object.keys(allowedUpdates).length === 0) {
        console.log('No valid database fields to update')
        return null
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(allowedUpdates)
        .eq('id', userId)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Supabase update user error:', error)
      throw error
    }
  },

  // Create entry
  async createEntry(entryData) {
    try {
      // Only use essential columns that exist in database
      const dbEntry = {
        id: entryData.id,
        userid: entryData.userId,
        title: entryData.title,
        description: entryData.description,
        category: entryData.category,
        date: entryData.date
      }
      
      const { data, error } = await supabase
        .from('entries')
        .insert([dbEntry])
        .select()
      
      if (error) throw error
      
      return {
        ...entryData,
        id: data[0].id,
        createdAt: data[0].createdat || new Date().toISOString()
      }
    } catch (error) {
      console.error('Supabase create entry error:', error)
      throw error
    }
  },

  // Get user entries
  async getUserEntries(userId) {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('userid', userId)
        .order('createdat', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Supabase get entries error:', error)
      return []
    }
  }
}