import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Circle, 
  Trophy, 
  Clock, 
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react'
import Card from '@/components/atoms/Card'
import { courseService } from '@/api/courseService'
import { useAuth } from '@/contexts/AuthContext'

const CourseProgress = ({ courseId, onProgressUpdate }) => {
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [userProgress, setUserProgress] = useState([])
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgressData()
  }, [courseId, user])

  const loadProgressData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Load course data
      const courseData = await courseService.getCourseById(courseId)
      setCourse(courseData)

      // Load user progress
      const progress = await courseService.getUserProgress(user.id, courseId)
      setUserProgress(progress)

      // Load enrollment data
      const enrollments = await courseService.getUserEnrollments(user.id)
      const userEnrollment = enrollments.find(e => e.course_id === courseId)
      setEnrollment(userEnrollment)

    } catch (error) {
      console.error('Error loading progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const isLessonCompleted = (moduleId, lessonId) => {
    return userProgress.some(p => 
      p.module_id === moduleId && 
      p.lesson_id === lessonId && 
      p.completed
    )
  }

  const getModuleProgress = (module) => {
    const completedLessons = module.lessons.filter(lesson => 
      isLessonCompleted(module.id, lesson.id)
    ).length
    return Math.round((completedLessons / module.lessons.length) * 100)
  }

  const getCourseProgress = () => {
    if (!course) return 0
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)
    const completedLessons = userProgress.filter(p => p.completed).length
    return Math.round((completedLessons / totalLessons) * 100)
  }

  const getEstimatedTimeRemaining = () => {
    if (!course) return '0 min'
    
    const incompleteLessons = []
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (!isLessonCompleted(module.id, lesson.id)) {
          incompleteLessons.push(lesson)
        }
      })
    })

    const totalMinutes = incompleteLessons.reduce((total, lesson) => {
      const duration = lesson.duration || '0 min'
      const minutes = parseInt(duration.match(/\d+/)?.[0] || 0)
      return total + minutes
    }, 0)

    if (totalMinutes < 60) {
      return `${totalMinutes} min`
    } else {
      const hours = Math.floor(totalMinutes / 60)
      const remainingMinutes = totalMinutes % 60
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
  }

  const getNextLesson = () => {
    if (!course) return null

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!isLessonCompleted(module.id, lesson.id)) {
          return { module, lesson }
        }
      }
    }
    return null
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (!course || !user) {
    return null
  }

  const courseProgress = getCourseProgress()
  const nextLesson = getNextLesson()
  const timeRemaining = getEstimatedTimeRemaining()

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Course Progress
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{timeRemaining} remaining</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-blue-600">
                {courseProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${courseProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {userProgress.filter(p => p.completed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {course.modules.reduce((total, module) => total + module.lessons.length, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Lessons</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {course.modules.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Modules</div>
            </div>
          </div>

          {courseProgress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200">
                    Congratulations! 🎉
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    You've completed the entire course!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Next Lesson */}
      {nextLesson && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Continue Learning
              </h3>
              <Target className="w-5 h-5 text-blue-500" />
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {nextLesson.lesson.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {nextLesson.module.title} • {nextLesson.lesson.duration}
                </p>
              </div>
              <button
                onClick={() => {
                  if (nextLesson.lesson.type === 'quiz') {
                    // Handle quiz
                  } else {
                    window.location.href = `/courses/${courseId}/module/${nextLesson.module.id}/lesson/${nextLesson.lesson.id}`
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Module Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Module Progress
          </h3>

          <div className="space-y-4">
            {course.modules.map((module, index) => {
              const moduleProgress = getModuleProgress(module)
              const completedLessons = module.lessons.filter(lesson => 
                isLessonCompleted(module.id, lesson.id)
              ).length

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    moduleProgress === 100 
                      ? 'bg-green-500 text-white' 
                      : moduleProgress > 0 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {moduleProgress === 100 ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {module.title}
                      </h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {completedLessons}/{module.lessons.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          moduleProgress === 100 
                            ? 'bg-green-500' 
                            : 'bg-blue-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${moduleProgress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </div>

                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {moduleProgress}%
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      </motion.div>

      {/* Learning Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Learning Statistics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(courseProgress)}%
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Course Completion
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {timeRemaining}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Time Remaining
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default CourseProgress