import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  Filter,
  Search,
  Video,
  Award,
  CheckCircle,
  AlertCircle,
  User,
  BookOpen,
  TrendingUp
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import { workshopService } from '@/api/workshopService'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const Workshops = () => {
  const { user } = useAuth()
  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    status: 'upcoming'
  })
  const [registeredWorkshops, setRegisteredWorkshops] = useState(new Set())
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)

  useEffect(() => {
    loadWorkshops()
    if (user) {
      loadUserRegistrations()
    }
  }, [filters, user])

  const loadWorkshops = async () => {
    try {
      setLoading(true)
      const data = await workshopService.getAllWorkshops(filters)
      setWorkshops(data)
    } catch (error) {
      toast.error('Failed to load workshops')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserRegistrations = async () => {
    try {
      const registrations = await workshopService.getUserRegistrations(user.id)
      const registeredIds = new Set(registrations.map(r => r.workshop_id))
      setRegisteredWorkshops(registeredIds)
    } catch (error) {
      console.error('Failed to load registrations:', error)
    }
  }

  const handleRegister = async (workshopId) => {
    if (!user) {
      toast.error('Please login to register for workshops')
      return
    }

    try {
      const result = await workshopService.registerForWorkshop(user.id, workshopId)
      if (result.success) {
        toast.success('Successfully registered for workshop!')
        setRegisteredWorkshops(prev => new Set([...prev, workshopId]))
        await loadWorkshops() // Reload to update participant count
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to register for workshop')
      console.error(error)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      level: '',
      status: 'upcoming'
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
      })
    }
  }

  const getWorkshopStatus = (workshop) => {
    const now = new Date()
    const workshopDate = new Date(workshop.scheduledDate)
    const availability = workshopService.isWorkshopAvailable(workshop)
    
    if (workshopDate < now) {
      return { status: 'completed', label: 'Completed', color: 'gray' }
    } else if (!availability.available) {
      return { status: 'full', label: availability.reason, color: 'red' }
    } else {
      return { status: 'available', label: 'Available', color: 'green' }
    }
  }

  const WorkshopCard = ({ workshop }) => {
    const isRegistered = registeredWorkshops.has(workshop.id)
    const { date, time } = formatDateTime(workshop.scheduledDate)
    const status = getWorkshopStatus(workshop)
    const spotsLeft = workshop.maxParticipants - workshop.currentParticipants

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="group"
      >
        <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Workshop Header */}
          <div className="relative overflow-hidden">
            <img
              src={workshop.thumbnail}
              alt={workshop.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                status.color === 'green' ? 'bg-green-500 text-white' :
                status.color === 'red' ? 'bg-red-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {status.label}
              </span>
            </div>

            {/* Level Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                workshop.level === 'Beginner' ? 'bg-green-500 text-white' :
                workshop.level === 'Intermediate' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {workshop.level}
              </span>
            </div>

            {/* Workshop Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{date.split(',')[0]}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{workshop.currentParticipants}/{workshop.maxParticipants}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workshop Content */}
          <div className="p-6">
            {/* Instructor */}
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={workshop.instructorAvatar}
                alt={workshop.instructor}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {workshop.instructor}
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 text-xs rounded-full">
                {workshop.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors">
              {workshop.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {workshop.description}
            </p>

            {/* Workshop Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{time} • {workshop.duration}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Online Workshop</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {workshop.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Spots Left */}
            {status.status === 'available' && spotsLeft <= 5 && (
              <div className="flex items-center space-x-2 mb-4 text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Only {spotsLeft} spots left!
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">
                FREE
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWorkshop(workshop)}
                >
                  Details
                </Button>
                
                {isRegistered ? (
                  <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Registered</span>
                  </div>
                ) : status.status === 'available' ? (
                  <Button
                    onClick={() => handleRegister(workshop.id)}
                    className="flex items-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Register</span>
                  </Button>
                ) : (
                  <Button disabled className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{status.label}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  const WorkshopDetailModal = ({ workshop, onClose }) => {
    if (!workshop) return null

    const { date, time } = formatDateTime(workshop.scheduledDate)
    const isRegistered = registeredWorkshops.has(workshop.id)
    const status = getWorkshopStatus(workshop)

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
          className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            <img
              src={workshop.thumbnail}
              alt={workshop.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h2 className="text-3xl font-bold mb-2">{workshop.title}</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={workshop.instructorAvatar}
                    alt={workshop.instructor}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{workshop.instructor}</span>
                </div>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {workshop.category}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  workshop.level === 'Beginner' ? 'bg-green-500' :
                  workshop.level === 'Intermediate' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}>
                  {workshop.level}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ×
            </button>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    About This Workshop
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {workshop.description}
                  </p>
                </div>

                {/* Instructor Bio */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    About the Instructor
                  </h3>
                  <div className="flex items-start space-x-4">
                    <img
                      src={workshop.instructorAvatar}
                      alt={workshop.instructor}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {workshop.instructor}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {workshop.instructorBio}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agenda */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Workshop Agenda
                  </h3>
                  <div className="space-y-3">
                    {workshop.agenda.map((item, index) => (
                      <div key={index} className="flex space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400 min-w-0 flex-shrink-0">
                          {item.time}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {item.topic}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prerequisites */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Prerequisites
                  </h3>
                  <div className="space-y-2">
                    {workshop.prerequisites.map((prerequisite, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{prerequisite}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    What You'll Learn
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {workshop.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Workshop Materials
                  </h3>
                  <div className="space-y-2">
                    {workshop.materials.map((material, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{material}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Workshop Details */}
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Workshop Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{date}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{time}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">{workshop.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {workshop.currentParticipants}/{workshop.maxParticipants} participants
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Video className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Online Workshop</span>
                    </div>
                  </div>
                </Card>

                {/* Registration */}
                <Card className="p-4">
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-green-600">FREE</div>
                    
                    {isRegistered ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">You're Registered!</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          You'll receive a reminder email before the workshop starts.
                        </p>
                      </div>
                    ) : status.status === 'available' ? (
                      <div className="space-y-3">
                        <Button
                          onClick={() => handleRegister(workshop.id)}
                          className="w-full flex items-center justify-center space-x-2"
                        >
                          <Calendar className="w-5 h-5" />
                          <span>Register Now</span>
                        </Button>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {workshop.maxParticipants - workshop.currentParticipants} spots remaining
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button disabled className="w-full flex items-center justify-center space-x-2">
                          <AlertCircle className="w-5 h-5" />
                          <span>{status.label}</span>
                        </Button>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          This workshop is no longer available for registration.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Tags */}
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {workshop.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
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
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Live Workshops
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Join expert-led workshops and learn from industry professionals. 
          Interactive sessions with hands-on exercises and Q&A.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search workshops..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="">All Workshops</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {workshopService.getWorkshopCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Levels</option>
                {workshopService.getWorkshopLevels().map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <Button
                onClick={clearFilters}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Clear</span>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Workshop Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Video className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{workshops.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Workshops</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {workshops.reduce((sum, workshop) => sum + workshop.currentParticipants, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Participants</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {new Set(workshops.map(w => w.instructor)).size}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Expert Instructors</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">100%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Free Workshops</div>
        </Card>
      </motion.div>

      {/* Workshops Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="p-6 animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-full"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : workshops.length === 0 ? (
          <Card className="p-12 text-center">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No workshops found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Workshop Detail Modal */}
      {selectedWorkshop && (
        <WorkshopDetailModal
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}
    </div>
  )
}

export default Workshops