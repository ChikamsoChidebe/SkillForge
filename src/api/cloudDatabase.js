// Cloud database service using MongoDB Atlas
const MONGODB_API_URL = import.meta.env.VITE_MONGODB_API_URL
const API_KEY = import.meta.env.VITE_MONGODB_API_KEY
const CLUSTER = import.meta.env.VITE_MONGODB_CLUSTER || 'Cluster0'

export const cloudDatabase = {
  // Create user in cloud
  async createUser(userData) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/action/insertOne`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        },
        body: JSON.stringify({
          collection: 'users',
          database: 'skillforge',
          dataSource: CLUSTER,
          document: {
            ...userData,
            createdAt: new Date(),
            syncedAt: new Date()
          }
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Failed to create user in cloud:', error)
      throw error
    }
  },

  // Get user by email
  async getUser(email) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/action/findOne`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        },
        body: JSON.stringify({
          collection: 'users',
          database: 'skillforge',
          dataSource: CLUSTER,
          filter: { email }
        })
      })
      const result = await response.json()
      return result.document
    } catch (error) {
      console.error('Failed to get user from cloud:', error)
      return null
    }
  },

  // Sync user entries to cloud
  async syncEntries(userId, entries) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/action/replaceOne`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        },
        body: JSON.stringify({
          collection: 'entries',
          database: 'skillforge',
          dataSource: CLUSTER,
          filter: { userId },
          replacement: {
            userId,
            entries,
            syncedAt: new Date()
          },
          upsert: true
        })
      })
      return await response.json()
    } catch (error) {
      console.error('Failed to sync entries:', error)
      throw error
    }
  },

  // Get user entries from cloud
  async getEntries(userId) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/action/findOne`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        },
        body: JSON.stringify({
          collection: 'entries',
          database: 'skillforge',
          dataSource: CLUSTER,
          filter: { userId }
        })
      })
      const result = await response.json()
      return result.document?.entries || []
    } catch (error) {
      console.error('Failed to get entries from cloud:', error)
      return []
    }
  }
}