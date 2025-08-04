import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  Play,
  Grid3X3,
  List,
  TrendingUp,
  Award
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import { courseService } from '@/api/courseService'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const Courses = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    sortBy: 'rating'
  })
  const [enrolledCourses, setEnrolledCourses] = useState(new Set())

  useEffect(() => {
    loadCourses()
    if (user) {
      loadUserEnrollments()
    }
  }, [filters, user])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const data = await courseService.getAllCourses(filters)
      setCourses(data)
    } catch (error) {
      toast.error('Failed to load courses')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserEnrollments = async () => {
    try {
      const enrollments = await courseService.getUserEnrollments(user.id)
      const enrolledIds = new Set(enrollments.map(e => e.course_id))
      setEnrolledCourses(enrolledIds)
    } catch (error) {
      console.error('Failed to load enrollments:', error)
    }
  }

  const handleEnroll = async (courseId) => {
    if (!user) {
      toast.error('Please login to enroll in courses')
      return
    }

    try {
      const result = await courseService.enrollInCourse(user.id, courseId)
      if (result.success) {
        toast.success('Successfully enrolled in course!')
        // Force immediate UI update
        setEnrolledCourses(prev => {
          const newSet = new Set([...prev, courseId])
          return newSet
        })
        // Also reload enrollments
        setTimeout(() => loadUserEnrollments(), 100)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to enroll in course')
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
      sortBy: 'rating'
    })
  }

  const CourseCard = ({ course, isEnrolled }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Course Thumbnail */}
        <Link to={`/courses/${course.id}`}>
          <div className="relative overflow-hidden cursor-pointer">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                course.level === 'Beginner' ? 'bg-green-500 text-white' :
                course.level === 'Intermediate' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {course.level}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-white/90 text-gray-900 px-2 py-1 text-xs font-semibold rounded-full">
                {course.category}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{course.studentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Course Content */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={course.instructorAvatar}
              alt={course.instructor}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {course.instructor}
            </span>
          </div>

          <Link to={`/courses/${course.id}`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer">
              {course.title}
            </h3>
          </Link>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{course.modules.length} modules</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">
              FREE
            </div>
            {isEnrolled ? (
              <Link to={`/courses/${course.id}/module/${course.modules[0]?.id}/lesson/${course.modules[0]?.lessons[0]?.id}`}>
                <Button className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Continue</span>
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => handleEnroll(course.id)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Enroll Now</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )

  const CourseListItem = ({ course, isEnrolled }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group"
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start space-x-6">
          {/* Thumbnail */}
          <Link to={`/courses/${course.id}`}>
            <div className="relative flex-shrink-0 cursor-pointer">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-32 h-20 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Link to={`/courses/${course.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors cursor-pointer">
                    {course.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  by {course.instructor}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  course.level === 'Beginner' ? 'bg-green-500 text-white' :
                  course.level === 'Intermediate' ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {course.level}
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 text-xs rounded-full">
                  {course.category}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{course.studentsCount} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.modules.length} modules</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-xl font-bold text-green-600">
                  FREE
                </div>
                {isEnrolled ? (
                  <Link to={`/courses/${course.id}/module/${course.modules[0]?.id}/lesson/${course.modules[0]?.lessons[0]?.id}`}>
                    <Button className="flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Continue</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => handleEnroll(course.id)}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Enroll Now</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Course Catalog
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover comprehensive courses designed to accelerate your learning journey. 
          From beginner-friendly tutorials to advanced masterclasses.
        </p>
      </motion.div>

      {/* Filters and Search */}
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
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {courseService.getCourseCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                {courseService.getCourseLevels().map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="students">Most Popular</option>
                <option value="recent">Recently Added</option>
                <option value="alphabetical">A-Z</option>
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

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Course Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{courses.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {courses.reduce((sum, course) => sum + course.studentsCount, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {courses.length > 0 ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1) : '0.0'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">100%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Free Courses</div>
        </Card>
      </motion.div>

      {/* Courses Grid/List */}
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
        ) : courses.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {courses.map((course) => {
              const isEnrolled = enrolledCourses.has(course.id)
              return viewMode === 'grid' ? (
                <CourseCard key={course.id} course={course} isEnrolled={isEnrolled} />
              ) : (
                <CourseListItem key={course.id} course={course} isEnrolled={isEnrolled} />
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Courses