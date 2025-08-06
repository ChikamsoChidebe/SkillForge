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
  // Create user with improved error handling
  async createUser(userData) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured - using local storage only')
      return userData
    }

    try {
      // Validate required fields
      if (!userData.id || !userData.username || !userData.email || !userData.password) {
        throw new Error('Missing required user fields')
      }

      // Clean and validate data
      const cleanUser = {
        id: userData.id.toString(),
        username: userData.username.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        full_name: userData.fullName || userData.username,
        total_entries: 0,
        total_badges: 0,
        learning_streak: 0
      }
      
      console.log('📤 Creating user in Supabase:', {
        id: cleanUser.id,
        username: cleanUser.username,
        email: cleanUser.email
      })
      
      const { data, error } = await supabase
        .from('users')
        .insert([cleanUser])
        .select()
      
      if (error) {
        console.error('❌ Supabase insert error:', error)
        // Don't throw - continue with local storage
        return userData
      }
      
      console.log('✅ User created in Supabase successfully')
      return { ...userData, ...data[0] }
    } catch (error) {
      console.error('⚠️ Supabase create user failed:', error.message)
      // Return original data to continue with local storage
      return userData
    }
  },

  // Get user by email with better error handling
  async getUserByEmail(email) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - user doesn't exist
          return null
        }
        console.error('❌ Supabase get user error:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('⚠️ Supabase getUserByEmail failed:', error.message)
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
      if (updates.totalEntries !== undefined) allowedUpdates.total_entries = updates.totalEntries
      if (updates.totalBadges !== undefined) allowedUpdates.total_badges = updates.totalBadges
      if (updates.learningStreak !== undefined) allowedUpdates.learning_streak = updates.learningStreak
      // Skip last_entry_date if column doesn't exist
      // if (updates.lastEntryDate) allowedUpdates.last_entry_date = updates.lastEntryDate
      
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

  // Get full user profile with stats
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        // Map database fields to frontend format
        return {
          ...data,
          totalEntries: data.total_entries || 0,
          totalBadges: data.total_badges || 0,
          learningStreak: data.learning_streak || 0,
          lastEntryDate: data.last_entry_date
        }
      }
      
      return null
    } catch (error) {
      console.error('Supabase get user profile error:', error)
      return null
    }
  },

  // Create entry with better error handling
  async createEntry(entryData) {
    if (!supabase) {
      console.warn('⚠️ Supabase not configured - using local storage only')
      return entryData
    }

    try {
      // Create user first if doesn't exist
      if (entryData.userId) {
        const existingUser = await this.getUserByEmail('temp@temp.com')
        if (!existingUser) {
          await this.createUser({
            id: entryData.userId,
            username: 'temp_user',
            email: 'temp@temp.com',
            password: 'temp123',
            fullName: 'Temp User'
          })
        }
      }

      const dbEntry = {
        id: entryData.id,
        userid: entryData.userId || 'demo_user_1',
        title: entryData.title,
        description: entryData.description,
        category: entryData.category,
        date: entryData.date
      }
      
      const { data, error } = await supabase
        .from('entries')
        .insert([dbEntry])
        .select()
      
      if (error) {
        console.error('❌ Supabase insert error:', error)
        return entryData // Continue with local storage
      }
      
      console.log('✅ Entry created in Supabase')
      return {
        ...entryData,
        id: data[0].id,
        createdAt: data[0].createdat || new Date().toISOString()
      }
    } catch (error) {
      console.error('⚠️ Supabase create entry failed:', error.message)
      return entryData // Continue with local storage
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

// Test Supabase connection and initialize
if (supabase) {
  supabaseService.initializeTables().catch(err => {
    console.warn('⚠️ Supabase initialization failed:', err.message)
    console.log('💡 Run the database_schema_complete.sql file in your Supabase SQL Editor')
  })
} else {
  console.warn('⚠️ Supabase not configured - using local storage only')
  console.log('💡 Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env file')
}