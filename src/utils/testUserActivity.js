import { userActivityService } from '../services/userActivityService'

// Test function to verify user activity service
export const testUserActivity = () => {
  const testAccountId = '0.0.6478142'
  
  console.log('🧪 Testing User Activity Service')
  
  // Clear existing data
  localStorage.removeItem('skillforge_user_activity')
  
  // Test 1: Get empty activity
  let activity = userActivityService.getUserActivity(testAccountId)
  console.log('📊 Initial activity:', activity)
  
  // Test 2: Add learning entry
  const entry1 = {
    title: 'React Hooks Test',
    description: 'Testing React hooks functionality',
    category: 'learning'
  }
  
  const addedEntry = userActivityService.addLearningEntry(testAccountId, entry1)
  console.log('✅ Added entry:', addedEntry)
  
  // Test 3: Check updated activity
  activity = userActivityService.getUserActivity(testAccountId)
  console.log('📊 Activity after 1 entry:', activity)
  
  // Test 4: Add more entries to trigger badges
  const entries = [
    { title: 'JavaScript ES6', description: 'Arrow functions and modules', category: 'learning' },
    { title: 'CSS Grid', description: 'Layout with CSS Grid', category: 'skill' },
    { title: 'API Integration', description: 'REST API calls', category: 'project' },
    { title: 'Testing', description: 'Unit testing with Jest', category: 'achievement' }
  ]
  
  entries.forEach(entry => {
    userActivityService.addLearningEntry(testAccountId, entry)
  })
  
  // Test 5: Check final activity
  activity = userActivityService.getUserActivity(testAccountId)
  console.log('📊 Final activity (should have badges):', activity)
  
  // Test 6: Get transactions
  const transactions = userActivityService.getTransactions(testAccountId)
  console.log('💳 Transactions:', transactions)
  
  return {
    activity,
    transactions,
    success: activity.totalEntries === 5 && activity.totalBadges >= 1
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  window.testUserActivity = testUserActivity
}