import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Search, 
  Plus, 
  TrendingUp, 
  Clock, 
  Users, 
  Heart,
  MessageSquare,
  Eye,
  Pin,
  Lock,
  Filter,
  ArrowUp,
  Award,
  User,
  Calendar
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import { forumService } from '@/api/forumService'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const Community = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [trendingPosts, setTrendingPosts] = useState([])
  const [forumStats, setForumStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [showNewPostModal, setShowNewPostModal] = useState(false)

  useEffect(() => {
    loadForumData()
  }, [selectedCategory, sortBy])

  const loadForumData = async () => {
    try {
      setLoading(true)
      const [categoriesData, postsData, trendingData, statsData] = await Promise.all([
        forumService.getCategories(),
        forumService.getPosts(selectedCategory, { sortBy, search: searchQuery }),
        forumService.getTrendingPosts(),
        forumService.getForumStats()
      ])
      
      setCategories(categoriesData)
      setPosts(postsData.posts)
      setTrendingPosts(trendingData)
      setForumStats(statsData)
    } catch (error) {
      toast.error('Failed to load forum data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadForumData()
      return
    }

    try {
      setLoading(true)
      const searchResults = await forumService.searchPosts(searchQuery, {
        category: selectedCategory,
        sortBy
      })
      setPosts(searchResults.posts)
    } catch (error) {
      toast.error('Search failed')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      general: '💬',
      react: '⚛️',
      python: '🐍',
      blockchain: '⛓️',
      career: '💼',
      help: '🆘'
    }
    return iconMap[categoryId] || '📝'
  }

  const getCategoryColor = (categoryId) => {
    const colorMap = {
      general: 'blue',
      react: 'cyan',
      python: 'green',
      blockchain: 'purple',
      career: 'orange',
      help: 'red'
    }
    return colorMap[categoryId] || 'gray'
  }

  const PostCard = ({ post }) => {
    const categoryColor = getCategoryColor(post.category)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start space-x-4">
            {/* Author Avatar */}
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full flex-shrink-0"
            />
            
            {/* Post Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                    {post.author.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                  {post.author.badges && post.author.badges.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {post.author.badges.slice(0, 2).map((badge, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs rounded-full"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {post.isPinned && (
                    <Pin className="w-4 h-4 text-blue-500" />
                  )}
                  {post.isLocked && (
                    <Lock className="w-4 h-4 text-gray-500" />
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    categoryColor === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                    categoryColor === 'cyan' ? 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300' :
                    categoryColor === 'green' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                    categoryColor === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' :
                    categoryColor === 'orange' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' :
                    'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}>
                    {categories.find(c => c.id === post.category)?.name || post.category}
                  </span>
                </div>
              </div>
              
              {/* Title */}
              <Link to={`/community/post/${post.id}`}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </Link>
              
              {/* Content Preview */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {post.content}
              </p>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 4).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replies}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views}</span>
                  </div>
                </div>
                
                <Link to={`/community/post/${post.id}`}>
                  <Button variant="outline" size="sm">
                    View Discussion
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  const CategoryCard = ({ category }) => {
    const isSelected = selectedCategory === category.id
    const color = getCategoryColor(category.id)
    
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedCategory(isSelected ? '' : category.id)}
        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
          isSelected
            ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20`
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{category.icon}</span>
            <h3 className={`font-semibold ${
              isSelected ? `text-${color}-700 dark:text-${color}-300` : 'text-gray-900 dark:text-gray-100'
            }`}>
              {category.name}
            </h3>
          </div>
          <span className={`text-sm font-medium ${
            isSelected ? `text-${color}-600 dark:text-${color}-400` : 'text-gray-500 dark:text-gray-400'
          }`}>
            {category.postCount}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {category.description}
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last activity: {formatTimeAgo(category.lastActivity)}
        </div>
      </motion.button>
    )
  }

  const NewPostModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
      title: '',
      content: '',
      category: '',
      tags: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!user) {
        toast.error('Please login to create posts')
        return
      }

      try {
        setSubmitting(true)
        const postData = {
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }
        
        await forumService.createPost(user.id, postData)
        toast.success('Post created successfully!')
        onClose()
        loadForumData()
      } catch (error) {
        toast.error('Failed to create post')
        console.error(error)
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Create New Post
              </h2>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="What's your question or topic?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={8}
                  placeholder="Describe your question or share your thoughts..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="react, javascript, help (comma separated)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Post'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Community Forum
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Connect with fellow learners, ask questions, share knowledge, and grow together. 
          Join discussions across various topics and skill levels.
        </p>
      </motion.div>

      {/* Forum Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {forumStats.totalPosts || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {forumStats.totalReplies || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Replies</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {forumStats.totalUsers || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Members</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {forumStats.totalCategories || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Categories
              </h2>
              <div className="space-y-3">
                {categories.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Trending Posts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Trending
                </h2>
              </div>
              <div className="space-y-3">
                {trendingPosts.slice(0, 5).map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/community/post/${post.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{post.likes} likes</span>
                          <span>•</span>
                          <span>{post.replies} replies</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button onClick={handleSearch}>
                    Search
                  </Button>
                </div>

                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="mostReplies">Most Replies</option>
                    <option value="oldest">Oldest First</option>
                  </select>

                  <Button
                    onClick={() => setShowNewPostModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Post</span>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Posts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <Card key={index} className="p-6 animate-pulse">
                    <div className="flex space-x-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-3">
                        <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                        <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-full"></div>
                        <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedCategory 
                    ? `No posts in this category yet. Be the first to start a discussion!`
                    : `No posts match your search. Try different keywords or create a new post.`
                  }
                </p>
                <Button onClick={() => setShowNewPostModal(true)}>
                  Create First Post
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <NewPostModal onClose={() => setShowNewPostModal(false)} />
      )}
    </div>
  )
}

export default Community