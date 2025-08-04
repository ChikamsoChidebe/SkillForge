import { supabase } from './supabaseClient'

// Sample workshop data
const SAMPLE_WORKSHOPS = [
  {
    id: 'react-hooks-workshop',
    title: 'Advanced React Hooks Workshop',
    description: 'Deep dive into React hooks including custom hooks, useContext, useReducer, and performance optimization techniques.',
    instructor: 'Emma Thompson',
    instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    instructorBio: 'Senior React Developer at Meta with 8+ years experience. Author of "Modern React Patterns" book.',
    category: 'Frontend',
    level: 'Advanced',
    duration: '3 hours',
    price: 0,
    maxParticipants: 50,
    currentParticipants: 23,
    scheduledDate: '2024-02-15T14:00:00Z',
    timezone: 'UTC',
    status: 'upcoming',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    tags: ['React', 'Hooks', 'JavaScript', 'Performance'],
    agenda: [
      { time: '14:00-14:30', topic: 'Introduction and Setup', description: 'Welcome, introductions, and environment setup' },
      { time: '14:30-15:15', topic: 'Advanced Hook Patterns', description: 'useCallback, useMemo, and custom hooks' },
      { time: '15:15-15:30', topic: 'Break', description: 'Networking and Q&A' },
      { time: '15:30-16:15', topic: 'State Management with useReducer', description: 'Complex state management patterns' },
      { time: '16:15-17:00', topic: 'Performance Optimization', description: 'React.memo, lazy loading, and best practices' }
    ],
    prerequisites: ['Solid React fundamentals', 'Experience with useState and useEffect', 'JavaScript ES6+'],
    learningOutcomes: [
      'Master advanced React hook patterns',
      'Build custom hooks for reusable logic',
      'Optimize React app performance',
      'Implement complex state management',
      'Debug hook-related issues'
    ],
    materials: [
      'Workshop slides and code examples',
      'Practice exercises and solutions',
      'Resource links and further reading',
      'Recording of the session (available for 30 days)'
    ]
  },
  {
    id: 'python-ml-workshop',
    title: 'Machine Learning with Python Workshop',
    description: 'Hands-on workshop covering scikit-learn, model training, evaluation, and deployment. Build and deploy your first ML model.',
    instructor: 'Dr. James Wilson',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    instructorBio: 'Data Science Lead at Google. PhD in Machine Learning from Stanford. 10+ years in AI research.',
    category: 'Data Science',
    level: 'Intermediate',
    duration: '4 hours',
    price: 0,
    maxParticipants: 30,
    currentParticipants: 18,
    scheduledDate: '2024-02-20T16:00:00Z',
    timezone: 'UTC',
    status: 'upcoming',
    thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400',
    tags: ['Python', 'Machine Learning', 'Scikit-learn', 'Data Science'],
    agenda: [
      { time: '16:00-16:30', topic: 'ML Fundamentals Review', description: 'Quick review of ML concepts and terminology' },
      { time: '16:30-17:30', topic: 'Data Preprocessing', description: 'Cleaning, feature engineering, and preparation' },
      { time: '17:30-17:45', topic: 'Break', description: 'Networking and questions' },
      { time: '17:45-18:45', topic: 'Model Training & Evaluation', description: 'Training models and measuring performance' },
      { time: '18:45-20:00', topic: 'Model Deployment', description: 'Deploying models to production' }
    ],
    prerequisites: ['Python programming experience', 'Basic statistics knowledge', 'Pandas and NumPy familiarity'],
    learningOutcomes: [
      'Build end-to-end ML pipelines',
      'Evaluate model performance effectively',
      'Deploy models to production',
      'Handle real-world data challenges',
      'Choose appropriate algorithms'
    ],
    materials: [
      'Jupyter notebooks with exercises',
      'Sample datasets for practice',
      'Model deployment templates',
      'Workshop recording and slides'
    ]
  },
  {
    id: 'blockchain-dapp-workshop',
    title: 'Building DApps on Hedera Workshop',
    description: 'Comprehensive workshop on building decentralized applications using Hedera Hashgraph. From smart contracts to frontend integration.',
    instructor: 'Maria Garcia',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    instructorBio: 'Blockchain Architect at Hedera. Former Ethereum core developer. Expert in distributed systems.',
    category: 'Blockchain',
    level: 'Advanced',
    duration: '5 hours',
    price: 0,
    maxParticipants: 25,
    currentParticipants: 12,
    scheduledDate: '2024-02-25T13:00:00Z',
    timezone: 'UTC',
    status: 'upcoming',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    tags: ['Blockchain', 'Hedera', 'DApps', 'Smart Contracts', 'Web3'],
    agenda: [
      { time: '13:00-13:30', topic: 'Hedera Overview', description: 'Architecture, consensus, and advantages' },
      { time: '13:30-14:30', topic: 'Smart Contract Development', description: 'Writing and deploying smart contracts' },
      { time: '14:30-14:45', topic: 'Break', description: 'Networking break' },
      { time: '14:45-16:00', topic: 'Frontend Integration', description: 'Connecting React app to Hedera' },
      { time: '16:00-16:15', topic: 'Break', description: 'Short break' },
      { time: '16:15-18:00', topic: 'Building Complete DApp', description: 'End-to-end DApp development' }
    ],
    prerequisites: ['JavaScript/TypeScript proficiency', 'React experience', 'Basic blockchain knowledge'],
    learningOutcomes: [
      'Deploy smart contracts on Hedera',
      'Build full-stack DApps',
      'Integrate wallets and transactions',
      'Handle Hedera-specific features',
      'Deploy to production'
    ],
    materials: [
      'Complete DApp source code',
      'Smart contract templates',
      'Deployment scripts and guides',
      'Workshop recording and resources'
    ]
  }
]

class WorkshopService {
  // Get all workshops with filtering
  async getAllWorkshops(filters = {}) {
    try {
      let workshops = [...SAMPLE_WORKSHOPS]
      
      // Apply filters
      if (filters.category) {
        workshops = workshops.filter(workshop => workshop.category === filters.category)
      }
      
      if (filters.level) {
        workshops = workshops.filter(workshop => workshop.level === filters.level)
      }
      
      if (filters.status) {
        workshops = workshops.filter(workshop => workshop.status === filters.status)
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        workshops = workshops.filter(workshop => 
          workshop.title.toLowerCase().includes(searchTerm) ||
          workshop.description.toLowerCase().includes(searchTerm) ||
          workshop.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }
      
      // Sort by date
      workshops.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      
      return workshops
    } catch (error) {
      console.error('Error fetching workshops:', error)
      throw error
    }
  }

  // Get single workshop by ID
  async getWorkshopById(workshopId) {
    try {
      const workshop = SAMPLE_WORKSHOPS.find(w => w.id === workshopId)
      if (!workshop) {
        throw new Error('Workshop not found')
      }
      return workshop
    } catch (error) {
      console.error('Error fetching workshop:', error)
      throw error
    }
  }

  // Register for workshop
  async registerForWorkshop(userId, workshopId) {
    try {
      // Check if already registered
      const { data: existingRegistration } = await supabase
        .from('workshop_registrations')
        .select('*')
        .eq('user_id', userId)
        .eq('workshop_id', workshopId)
        .single()

      if (existingRegistration) {
        return { success: false, message: 'Already registered for this workshop' }
      }

      // Check if workshop is full
      const workshop = await this.getWorkshopById(workshopId)
      if (workshop.currentParticipants >= workshop.maxParticipants) {
        return { success: false, message: 'Workshop is full' }
      }

      // Create registration
      const { data, error } = await supabase
        .from('workshop_registrations')
        .insert({
          user_id: userId,
          workshop_id: workshopId,
          registered_at: new Date().toISOString(),
          status: 'registered'
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, registration: data }
    } catch (error) {
      console.error('Error registering for workshop:', error)
      throw error
    }
  }

  // Get user's workshop registrations
  async getUserRegistrations(userId) {
    try {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .select('*')
        .eq('user_id', userId)
        .order('registered_at', { ascending: false })

      if (error) throw error

      // Enrich with workshop data
      const registrations = data.map(registration => {
        const workshop = SAMPLE_WORKSHOPS.find(w => w.id === registration.workshop_id)
        return {
          ...registration,
          workshop: workshop || null
        }
      })

      return registrations
    } catch (error) {
      console.error('Error fetching user registrations:', error)
      throw error
    }
  }

  // Mark workshop attendance
  async markAttendance(userId, workshopId, attended = true) {
    try {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .update({ 
          attended,
          attended_at: attended ? new Date().toISOString() : null
        })
        .eq('user_id', userId)
        .eq('workshop_id', workshopId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error marking attendance:', error)
      throw error
    }
  }

  // Get upcoming workshops
  async getUpcomingWorkshops(limit = 5) {
    try {
      const now = new Date().toISOString()
      const workshops = SAMPLE_WORKSHOPS
        .filter(workshop => workshop.scheduledDate > now)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
        .slice(0, limit)
      
      return workshops
    } catch (error) {
      console.error('Error fetching upcoming workshops:', error)
      throw error
    }
  }

  // Get workshop categories
  getWorkshopCategories() {
    return ['Frontend', 'Backend', 'Data Science', 'Blockchain', 'Mobile', 'DevOps', 'AI/ML']
  }

  // Get workshop levels
  getWorkshopLevels() {
    return ['Beginner', 'Intermediate', 'Advanced']
  }

  // Format workshop date/time
  formatWorkshopDateTime(dateString, timezone = 'UTC') {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      full: date.toLocaleString(),
      iso: dateString
    }
  }

  // Check if workshop is available for registration
  isWorkshopAvailable(workshop) {
    const now = new Date()
    const workshopDate = new Date(workshop.scheduledDate)
    const registrationDeadline = new Date(workshopDate.getTime() - 24 * 60 * 60 * 1000) // 24 hours before
    
    return {
      available: now < registrationDeadline && workshop.currentParticipants < workshop.maxParticipants,
      reason: now >= registrationDeadline ? 'Registration closed' : 
              workshop.currentParticipants >= workshop.maxParticipants ? 'Workshop full' : null
    }
  }
}

export const workshopService = new WorkshopService()