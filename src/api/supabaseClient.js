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
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
      
      if (error) throw error
      return data[0]
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

  // Update user
  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
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
      const { data, error } = await supabase
        .from('entries')
        .insert([entryData])
        .select()
      
      if (error) throw error
      return data[0]
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
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Supabase get entries error:', error)
      return []
    }
  }
}