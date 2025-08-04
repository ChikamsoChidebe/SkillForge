import { supabase, supabaseService } from './supabaseClient'

// Sample forum data for development
const SAMPLE_CATEGORIES = [
  {
    id: 'general',
    name: 'General Discussion',
    description: 'General discussions about learning and development',
    icon: '💬',
    color: 'blue',
    postCount: 156,
    lastActivity: '2024-01-15T10:30:00Z'
  },
  {
    id: 'react',
    name: 'React & Frontend',
    description: 'Discussions about React, JavaScript, and frontend development',
    icon: '⚛️',
    color: 'cyan',
    postCount: 89,
    lastActivity: '2024-01-15T09:15:00Z'
  },
  {
    id: 'python',
    name: 'Python & Data Science',
    description: 'Python programming, data science, and machine learning discussions',
    icon: '🐍',
    color: 'green',
    postCount: 67,
    lastActivity: '2024-01-15T08:45:00Z'
  },
  {
    id: 'blockchain',
    name: 'Blockchain & Web3',
    description: 'Blockchain development, DApps, and cryptocurrency discussions',
    icon: '⛓️',
    color: 'purple',
    postCount: 43,
    lastActivity: '2024-01-15T07:20:00Z'
  },
  {
    id: 'career',
    name: 'Career & Jobs',
    description: 'Career advice, job opportunities, and professional development',
    icon: '💼',
    color: 'orange',
    postCount: 78,
    lastActivity: '2024-01-15T11:00:00Z'
  },
  {
    id: 'help',
    name: 'Help & Support',
    description: 'Get help with courses, technical issues, and platform questions',
    icon: '🆘',
    color: 'red',
    postCount: 34,
    lastActivity: '2024-01-15T06:30:00Z'
  }
]

const SAMPLE_POSTS = [
  {
    id: 'post-1',
    title: 'Best practices for React component organization?',
    content: 'I\'m working on a large React project and struggling with how to organize my components. What are some best practices you\'ve found helpful for structuring React applications?',
    author: {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      reputation: 1250,
      badges: ['React Expert', 'Top Contributor']
    },
    category: 'react',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    views: 45,
    likes: 12,
    replies: 8,
    tags: ['react', 'architecture', 'best-practices'],
    isPinned: false,
    isLocked: false
  },
  {
    id: 'post-2',
    title: 'Machine Learning career transition advice',
    content: 'I\'m a software developer with 3 years of experience looking to transition into machine learning. What courses would you recommend, and what should I focus on first?',
    author: {
      id: 'user-2',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      reputation: 890,
      badges: ['Career Changer']
    },
    category: 'career',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    views: 67,
    likes: 18,
    replies: 15,
    tags: ['career', 'machine-learning', 'transition'],
    isPinned: true,
    isLocked: false
  },
  {
    id: 'post-3',
    title: 'Hedera vs Ethereum for DApp development',
    content: 'I\'m starting a new DApp project and considering Hedera Hashgraph vs Ethereum. What are the main advantages and disadvantages of each platform?',
    author: {
      id: 'user-3',
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      reputation: 2100,
      badges: ['Blockchain Expert', 'Top Contributor', 'Hedera Developer']
    },
    category: 'blockchain',
    createdAt: '2024-01-15T08:45:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
    views: 89,
    likes: 23,
    replies: 12,
    tags: ['hedera', 'ethereum', 'dapp', 'comparison'],
    isPinned: false,
    isLocked: false
  }
]

const SAMPLE_REPLIES = [
  {
    id: 'reply-1',
    postId: 'post-1',
    content: 'I recommend following the atomic design methodology. Start with atoms (basic components), then molecules (combinations), organisms (complex components), templates, and pages. This creates a clear hierarchy.',
    author: {
      id: 'user-4',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      reputation: 1800,
      badges: ['React Expert', 'UI/UX Designer']
    },
    createdAt: '2024-01-15T10:45:00Z',
    updatedAt: '2024-01-15T10:45:00Z',
    likes: 8,
    parentReplyId: null
  },
  {
    id: 'reply-2',
    postId: 'post-1',
    content: 'Great suggestion! I also like to separate components by feature rather than by type. So instead of having all buttons in one folder, I group related components together.',
    author: {
      id: 'user-5',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      reputation: 950,
      badges: ['Frontend Developer']
    },
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    likes: 5,
    parentReplyId: 'reply-1'
  }
]

class ForumService {
  // Get all forum categories
  async getCategories() {
    try {
      // In production, this would fetch from database
      return SAMPLE_CATEGORIES
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  // Get posts by category with pagination and filtering
  async getPosts(categoryId, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'recent', search = '' } = options
      
      let posts = []
      
      // Try to get posts from localStorage first (for demo mode)
      const localPosts = JSON.parse(localStorage.getItem('forum_posts') || '[]')
      posts = [...SAMPLE_POSTS, ...localPosts]
      
      // Filter by category
      posts = posts.filter(post => 
        !categoryId || post.category === categoryId
      )

      // Apply search filter
      if (search) {
        const searchTerm = search.toLowerCase()
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }

      // Apply sorting
      switch (sortBy) {
        case 'popular':
          posts.sort((a, b) => (b.likes + b.replies) - (a.likes + a.replies))
          break
        case 'mostReplies':
          posts.sort((a, b) => b.replies - a.replies)
          break
        case 'oldest':
          posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          break
        case 'recent':
        default:
          posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      }

      // Apply pagination
      const startIndex = (page - 1) * limit
      const paginatedPosts = posts.slice(startIndex, startIndex + limit)

      return {
        posts: paginatedPosts,
        totalCount: posts.length,
        currentPage: page,
        totalPages: Math.ceil(posts.length / limit),
        hasNextPage: page < Math.ceil(posts.length / limit),
        hasPrevPage: page > 1
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  // Get single post with replies
  async getPostById(postId) {
    try {
      const post = SAMPLE_POSTS.find(p => p.id === postId)
      if (!post) {
        throw new Error('Post not found')
      }

      // Get replies for this post
      const replies = SAMPLE_REPLIES
        .filter(reply => reply.postId === postId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

      // Build reply tree (nested replies)
      const replyTree = this.buildReplyTree(replies)

      return {
        ...post,
        replies: replyTree
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      throw error
    }
  }

  // Build nested reply structure
  buildReplyTree(replies) {
    const replyMap = new Map()
    const rootReplies = []

    // First pass: create map of all replies
    replies.forEach(reply => {
      replyMap.set(reply.id, { ...reply, children: [] })
    })

    // Second pass: build tree structure
    replies.forEach(reply => {
      const replyNode = replyMap.get(reply.id)
      if (reply.parentReplyId) {
        const parent = replyMap.get(reply.parentReplyId)
        if (parent) {
          parent.children.push(replyNode)
        }
      } else {
        rootReplies.push(replyNode)
      }
    })

    return rootReplies
  }

  // Create new post
  async createPost(userId, postData) {
    try {
      const newPost = {
        id: `post-${Date.now()}`,
        title: postData.title,
        content: postData.content,
        author: {
          id: userId,
          name: 'Current User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          reputation: 100,
          badges: ['New Member']
        },
        category: postData.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        replies: 0,
        tags: postData.tags || [],
        isPinned: false,
        isLocked: false
      }
      
      if (!supabase) {
        // Use localStorage for demo mode
        const posts = JSON.parse(localStorage.getItem('forum_posts') || '[]')
        posts.unshift(newPost)
        localStorage.setItem('forum_posts', JSON.stringify(posts))
        return newPost
      }

      try {
        const dbPostData = {
          user_id: userId,
          category_id: postData.category,
          title: postData.title,
          content: postData.content,
          tags: postData.tags || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        const data = await supabaseService.createForumPost(dbPostData)
        return { ...newPost, ...data }
      } catch (error) {
        console.error('Supabase forum post creation failed, using localStorage:', error)
        const posts = JSON.parse(localStorage.getItem('forum_posts') || '[]')
        posts.unshift(newPost)
        localStorage.setItem('forum_posts', JSON.stringify(posts))
        return newPost
      }
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  // Create reply to post
  async createReply(userId, postId, replyData) {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .insert({
          user_id: userId,
          post_id: postId,
          parent_reply_id: replyData.parentReplyId || null,
          content: replyData.content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Update post reply count and last activity
      await supabase
        .from('forum_posts')
        .update({
          reply_count: supabase.raw('reply_count + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)

      return data
    } catch (error) {
      console.error('Error creating reply:', error)
      throw error
    }
  }

  // Like/unlike post
  async togglePostLike(userId, postId) {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('forum_post_likes')
        .select('*')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .single()

      if (existingLike) {
        // Unlike
        await supabase
          .from('forum_post_likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId)

        await supabase
          .from('forum_posts')
          .update({ like_count: supabase.raw('like_count - 1') })
          .eq('id', postId)

        return { liked: false }
      } else {
        // Like
        await supabase
          .from('forum_post_likes')
          .insert({
            user_id: userId,
            post_id: postId,
            created_at: new Date().toISOString()
          })

        await supabase
          .from('forum_posts')
          .update({ like_count: supabase.raw('like_count + 1') })
          .eq('id', postId)

        return { liked: true }
      }
    } catch (error) {
      console.error('Error toggling post like:', error)
      throw error
    }
  }

  // Like/unlike reply
  async toggleReplyLike(userId, replyId) {
    try {
      const { data: existingLike } = await supabase
        .from('forum_reply_likes')
        .select('*')
        .eq('user_id', userId)
        .eq('reply_id', replyId)
        .single()

      if (existingLike) {
        await supabase
          .from('forum_reply_likes')
          .delete()
          .eq('user_id', userId)
          .eq('reply_id', replyId)

        await supabase
          .from('forum_replies')
          .update({ like_count: supabase.raw('like_count - 1') })
          .eq('id', replyId)

        return { liked: false }
      } else {
        await supabase
          .from('forum_reply_likes')
          .insert({
            user_id: userId,
            reply_id: replyId,
            created_at: new Date().toISOString()
          })

        await supabase
          .from('forum_replies')
          .update({ like_count: supabase.raw('like_count + 1') })
          .eq('id', replyId)

        return { liked: true }
      }
    } catch (error) {
      console.error('Error toggling reply like:', error)
      throw error
    }
  }

  // Get user's posts
  async getUserPosts(userId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options

      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching user posts:', error)
      throw error
    }
  }

  // Search posts across all categories
  async searchPosts(query, options = {}) {
    try {
      const { category, sortBy = 'relevance', page = 1, limit = 10 } = options

      // This is a simplified search - in production you'd use full-text search
      let posts = SAMPLE_POSTS

      if (category) {
        posts = posts.filter(post => post.category === category)
      }

      const searchTerm = query.toLowerCase()
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        post.author.name.toLowerCase().includes(searchTerm)
      )

      // Apply sorting
      switch (sortBy) {
        case 'recent':
          posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'popular':
          posts.sort((a, b) => (b.likes + b.replies) - (a.likes + a.replies))
          break
        case 'relevance':
        default:
          // Simple relevance scoring based on title matches
          posts.sort((a, b) => {
            const aScore = a.title.toLowerCase().includes(searchTerm) ? 2 : 1
            const bScore = b.title.toLowerCase().includes(searchTerm) ? 2 : 1
            return bScore - aScore
          })
      }

      const startIndex = (page - 1) * limit
      const paginatedPosts = posts.slice(startIndex, startIndex + limit)

      return {
        posts: paginatedPosts,
        totalCount: posts.length,
        query,
        currentPage: page,
        totalPages: Math.ceil(posts.length / limit)
      }
    } catch (error) {
      console.error('Error searching posts:', error)
      throw error
    }
  }

  // Get trending posts
  async getTrendingPosts(limit = 5) {
    try {
      const posts = [...SAMPLE_POSTS]
        .sort((a, b) => {
          // Simple trending algorithm based on recent activity and engagement
          const aScore = (a.likes * 2 + a.replies * 3 + a.views) / 
                        ((Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60) + 1)
          const bScore = (b.likes * 2 + b.replies * 3 + b.views) / 
                        ((Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60) + 1)
          return bScore - aScore
        })
        .slice(0, limit)

      return posts
    } catch (error) {
      console.error('Error fetching trending posts:', error)
      throw error
    }
  }

  // Get forum statistics
  async getForumStats() {
    try {
      const totalPosts = SAMPLE_POSTS.length
      const totalReplies = SAMPLE_REPLIES.length
      const totalUsers = new Set([
        ...SAMPLE_POSTS.map(p => p.author.id),
        ...SAMPLE_REPLIES.map(r => r.author.id)
      ]).size

      const categoryStats = SAMPLE_CATEGORIES.map(category => ({
        ...category,
        postCount: SAMPLE_POSTS.filter(p => p.category === category.id).length
      }))

      return {
        totalPosts,
        totalReplies,
        totalUsers,
        totalCategories: SAMPLE_CATEGORIES.length,
        categoryStats,
        recentActivity: SAMPLE_POSTS.slice(0, 5)
      }
    } catch (error) {
      console.error('Error fetching forum stats:', error)
      throw error
    }
  }

  // Report post/reply
  async reportContent(userId, contentType, contentId, reason) {
    try {
      const { data, error } = await supabase
        .from('forum_reports')
        .insert({
          reporter_id: userId,
          content_type: contentType, // 'post' or 'reply'
          content_id: contentId,
          reason,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error reporting content:', error)
      throw error
    }
  }
}

export const forumService = new ForumService()