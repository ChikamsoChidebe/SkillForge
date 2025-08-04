// Demo data initialization for SkillForge platform
export const initializeDemoData = () => {
  // Initialize demo users for leaderboard
  const demoUsers = [
    {
      id: 'demo-user-1',
      username: 'alex_dev',
      fullName: 'Alex Chen',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      createdAt: '2023-08-15T00:00:00Z'
    },
    {
      id: 'demo-user-2',
      username: 'sarah_data',
      fullName: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      createdAt: '2023-07-20T00:00:00Z'
    },
    {
      id: 'demo-user-3',
      username: 'mike_blockchain',
      fullName: 'Mike Rodriguez',
      email: 'mike@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: '2023-09-10T00:00:00Z'
    },
    {
      id: 'demo-user-4',
      username: 'emma_design',
      fullName: 'Emma Wilson',
      email: 'emma@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      createdAt: '2023-10-05T00:00:00Z'
    },
    {
      id: 'demo-user-5',
      username: 'david_js',
      fullName: 'David Kim',
      email: 'david@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      createdAt: '2023-11-15T00:00:00Z'
    }
  ]

  // Initialize demo forum posts
  const demoForumPosts = [
    {
      id: 'demo-post-1',
      title: 'Best practices for React component organization?',
      content: 'I\'m working on a large React project and struggling with how to organize my components. What are some best practices you\'ve found helpful for structuring React applications?',
      author: {
        id: 'demo-user-1',
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        reputation: 1250,
        badges: ['React Expert', 'Top Contributor']
      },
      category: 'react',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      views: 45,
      likes: 12,
      replies: 8,
      tags: ['react', 'architecture', 'best-practices'],
      isPinned: false,
      isLocked: false
    },
    {
      id: 'demo-post-2',
      title: 'Machine Learning career transition advice',
      content: 'I\'m a software developer with 3 years of experience looking to transition into machine learning. What courses would you recommend, and what should I focus on first?',
      author: {
        id: 'demo-user-2',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        reputation: 890,
        badges: ['Career Changer']
      },
      category: 'career',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      views: 67,
      likes: 18,
      replies: 15,
      tags: ['career', 'machine-learning', 'transition'],
      isPinned: true,
      isLocked: false
    },
    {
      id: 'demo-post-3',
      title: 'Hedera vs Ethereum for DApp development',
      content: 'I\'m starting a new DApp project and considering Hedera Hashgraph vs Ethereum. What are the main advantages and disadvantages of each platform?',
      author: {
        id: 'demo-user-3',
        name: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        reputation: 2100,
        badges: ['Blockchain Expert', 'Top Contributor', 'Hedera Developer']
      },
      category: 'blockchain',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      views: 89,
      likes: 23,
      replies: 12,
      tags: ['hedera', 'ethereum', 'dapp', 'comparison'],
      isPinned: false,
      isLocked: false
    }
  ]

  // Check if demo data already exists
  const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]')
  const existingPosts = JSON.parse(localStorage.getItem('forum_posts') || '[]')

  // Only add demo data if no real data exists
  if (existingUsers.length === 0) {
    localStorage.setItem('registered_users', JSON.stringify(demoUsers))
    console.log('✅ Demo users initialized')
  }

  if (existingPosts.length === 0) {
    localStorage.setItem('forum_posts', JSON.stringify(demoForumPosts))
    console.log('✅ Demo forum posts initialized')
  }

  // Initialize demo course enrollments
  const demoEnrollments = [
    {
      id: 'enrollment-1',
      user_id: 'demo-user-1',
      course_id: 'react-fundamentals',
      enrolled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 75,
      status: 'active'
    },
    {
      id: 'enrollment-2',
      user_id: 'demo-user-2',
      course_id: 'python-data-science',
      enrolled_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 100,
      status: 'completed'
    },
    {
      id: 'enrollment-3',
      user_id: 'demo-user-3',
      course_id: 'blockchain-development',
      enrolled_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 45,
      status: 'active'
    }
  ]

  const existingEnrollments = JSON.parse(localStorage.getItem('course_enrollments') || '[]')
  if (existingEnrollments.length === 0) {
    localStorage.setItem('course_enrollments', JSON.stringify(demoEnrollments))
    console.log('✅ Demo course enrollments initialized')
  }

  return {
    users: demoUsers,
    posts: demoForumPosts,
    enrollments: demoEnrollments
  }
}

// Clear all demo data
export const clearDemoData = () => {
  localStorage.removeItem('registered_users')
  localStorage.removeItem('forum_posts')
  localStorage.removeItem('course_enrollments')
  console.log('🗑️ Demo data cleared')
}

// Reset demo data
export const resetDemoData = () => {
  clearDemoData()
  initializeDemoData()
  console.log('🔄 Demo data reset')
}