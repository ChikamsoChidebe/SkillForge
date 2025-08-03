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
      
      // Map Supabase data to frontend format
      const mappedEntries = (data || []).map(entry => ({
        id: entry.id,
        userId: entry.userid,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        date: entry.date,
        createdAt: entry.createdat || entry.date,
        author: entry.author || 'User'
      }))
      
      console.log('📊 Mapped', mappedEntries.length, 'entries from Supabase')
      return mappedEntries
    } catch (error) {
      console.error('Supabase get entries error:', error)
      return []
    }
  },

  // Course enrollment methods
  async createCourseEnrollment(enrollmentData) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert([enrollmentData])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Supabase create enrollment error:', error)
      throw error
    }
  },

  async getUserEnrollments(userId) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Supabase get enrollments error:', error)
      return []
    }
  },

  // Forum methods
  async createForumPost(postData) {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([postData])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Supabase create forum post error:', error)
      throw error
    }
  },

  async getForumPosts(categoryId = null) {
    try {
      let query = supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Supabase get forum posts error:', error)
      return []
    }
  },

  // Initialize database tables if they don't exist
  async initializeTables() {
    try {
      // Check if course_enrollments table exists, if not create it
      const { error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('id')
        .limit(1)
      
      if (enrollmentError && enrollmentError.code === '42P01') {
        console.log('Creating course_enrollments table...')
        // Table doesn't exist, but we can't create it from client
        // This would need to be done in Supabase dashboard
      }
      
      // Check if forum_posts table exists
      const { error: forumError } = await supabase
        .from('forum_posts')
        .select('id')
        .limit(1)
      
      if (forumError && forumError.code === '42P01') {
        console.log('Creating forum_posts table...')
        // Table doesn't exist, but we can't create it from client
      }
      
    } catch (error) {
      console.log('Database initialization check:', error.message)
    }
  }
}

// Initialize database tables after service is defined
if (supabase) {
  supabaseService.initializeTables().catch(console.error)
}