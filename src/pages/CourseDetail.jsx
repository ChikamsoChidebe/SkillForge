import { useState, useEffect } from 'react'
import { useParams, useNavigate,Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  Lock,
  Award,
  ArrowLeft,
  Download,
  Share2,
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText,
  HelpCircle,
  Trophy
} from 'lucide-react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import QuizComponent from '@/components/organisms/QuizComponent'
import { courseService } from '@/api/courseService'
import { certificateService } from '@/api/certificateService'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [userProgress, setUserProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [activeModule, setActiveModule] = useState(null)
  const [currentQuiz, setCurrentQuiz] = useState(null)

  useEffect(() => {
    loadCourseData()
  }, [courseId, user])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      const courseData = await courseService.getCourseById(courseId)
      setCourse(courseData)

      if (user) {
        // Check if user is enrolled
        const enrollments = await courseService.getUserEnrollments(user.id)
        const userEnrollment = enrollments.find(e => e.course_id === courseId)
        setEnrollment(userEnrollment)

        if (userEnrollment) {
          // Load user progress
          const progress = await courseService.getUserProgress(user.id, courseId)
          setUserProgress(progress)
        }
      }
    } catch (error) {
      toast.error('Failed to load course')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll in courses')
      return
    }

    try {
      setEnrolling(true)
      const result = await courseService.enrollInCourse(user.id, courseId)
      if (result.success) {
        toast.success('Successfully enrolled in course!')
        await loadCourseData() // Reload to get enrollment data
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to enroll in course')
      console.error(error)
    } finally {
      setEnrolling(false)
    }
  }

  const handleLessonComplete = async (moduleId, lessonId) => {
    if (!user || !enrollment) return

    try {
      await courseService.updateLessonProgress(user.id, courseId, moduleId, lessonId, true)
      await loadCourseData() // Reload to update progress
      toast.success('Lesson completed!')
    } catch (error) {
      toast.error('Failed to update progress')
      console.error(error)
    }
  }

  const handleQuizComplete = async (moduleId, lessonId, passed) => {
    setCurrentQuiz(null)
    
    if (passed) {
      await loadCourseData() // Reload to update progress
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

  const handleGenerateCertificate = async () => {
    if (!user || !enrollment || getCourseProgress() < 100) return

    try {
      const certificate = await certificateService.generateCourseCompletionCertificate(
        user.id,
        courseId,
        course.title,
        {
          finalScore: 85, // This would be calculated from actual quiz scores
          duration: course.duration
        }
      )
      toast.success('Certificate generated successfully!')
      console.log('Certificate:', certificate)
    } catch (error) {
      toast.error('Failed to generate certificate')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-8"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <Card className="p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Course not found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/courses')}>
          Browse Courses
        </Button>
      </Card>
    )
  }

  const LessonItem = ({ lesson, moduleId, isLocked }) => {
    const completed = isLessonCompleted(moduleId, lesson.id)
    
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
          isLocked 
            ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
            : completed
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
        onClick={() => {
          if (!isLocked && enrollment) {
            if (lesson.type === 'quiz') {
              setCurrentQuiz({ ...lesson, moduleId })
            } else {
              navigate(`/courses/${courseId}/module/${moduleId}/lesson/${lesson.id}`)
            }
          }
        }}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isLocked
              ? 'bg-gray-300 dark:bg-gray-600'
              : completed
              ? 'bg-green-500 text-white'
              : lesson.type === 'video'
              ? 'bg-blue-500 text-white'
              : lesson.type === 'quiz'
              ? 'bg-purple-500 text-white'
              : lesson.type === 'text'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {isLocked ? (
              <Lock className="w-4 h-4" />
            ) : completed ? (
              <CheckCircle className="w-4 h-4" />
            ) : lesson.type === 'video' ? (
              <PlayCircle className="w-4 h-4" />
            ) : lesson.type === 'quiz' ? (
              <HelpCircle className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className={`font-medium ${
              isLocked ? 'text-gray-400' : 'text-gray-900 dark:text-gray-100'
            }`}>
              {lesson.title}
            </h4>
            <p className={`text-sm ${
              isLocked ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {lesson.type} • {lesson.duration}
            </p>
          </div>
        </div>
        
        {!isLocked && enrollment && (
          <div className="flex items-center space-x-2">
            {lesson.type === 'quiz' && !completed && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentQuiz({ ...lesson, moduleId })
                }}
                className="text-xs bg-purple-600 hover:bg-purple-700"
              >
                Take Quiz
              </Button>
            )}
            {lesson.type !== 'quiz' && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/courses/${courseId}/module/${moduleId}/lesson/${lesson.id}`)
                }}
                variant={completed ? "outline" : "primary"}
                className="text-xs"
              >
                {completed ? 'Review' : 'Start'}
              </Button>
            )}
            {completed && (
              <span className="text-green-600 text-sm font-medium">Completed</span>
            )}
          </div>
        )}
      </div>
    )
  }



  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate('/courses')}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Courses</span>
      </Button>

      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        
        <div className="relative p-8 lg:p-12 text-white">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                course.level === 'Beginner' ? 'bg-green-500' :
                course.level === 'Intermediate' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                {course.level}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 text-sm rounded-full">
                {course.category}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {course.title}
            </h1>
            
            <p className="text-xl text-gray-200 mb-6 max-w-3xl">
              {course.description}
            </p>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{course.instructor}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-5 h-5" />
                <span>{course.studentsCount} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-5 h-5" />
                <span>{course.duration}</span>
              </div>
            </div>

            {enrollment && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm">{getCourseProgress()}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCourseProgress()}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              {enrollment ? (
                <>
                  <Link to={`/courses/${course.id}/module/${course.modules[0]?.id}/lesson/${course.modules[0]?.lessons[0]?.id}`}>
                    <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                      <Play className="w-5 h-5" />
                      <span>Continue Learning</span>
                    </Button>
                  </Link>
                  {getCourseProgress() === 100 && (
                    <Button
                      onClick={handleGenerateCertificate}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
                    >
                      <Award className="w-5 h-5" />
                      <span>Get Certificate</span>
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>{enrolling ? 'Enrolling...' : 'Enroll Now - FREE'}</span>
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Modules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Course Content
              </h2>
              
              <div className="space-y-4">
                {course.modules.map((module, moduleIndex) => {
                  const isActive = activeModule === module.id
                  const progress = enrollment ? getModuleProgress(module) : 0
                  
                  return (
                    <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <button
                        onClick={() => setActiveModule(isActive ? null : module.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {isActive ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              Module {moduleIndex + 1}: {module.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {module.lessons.length} lessons • {module.duration}
                            </p>
                          </div>
                        </div>
                        
                        {enrollment && (
                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {progress}% complete
                            </div>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </button>
                      
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="p-4 space-y-3">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const isLocked = !enrollment && lessonIndex > 0 // First lesson free for preview
                              return (
                                <LessonItem
                                  key={lesson.id}
                                  lesson={lesson}
                                  moduleId={module.id}
                                  isLocked={isLocked}
                                />
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* Learning Outcomes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                What You'll Learn
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{outcome}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Prerequisites */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Prerequisites
              </h2>
              <div className="space-y-3">
                {course.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{prerequisite}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Course Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Modules</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{course.modules.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Lessons</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {course.modules.reduce((total, module) => total + module.lessons.length, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Level</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Students</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{course.studentsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{course.rating}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Instructor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Instructor
              </h3>
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {course.instructor}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Course Instructor
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Instructor
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Quiz Modal */}
      {currentQuiz && (
        <QuizComponent
          courseId={courseId}
          moduleId={currentQuiz.moduleId}
          lesson={currentQuiz}
          onQuizComplete={handleQuizComplete}
          onClose={() => setCurrentQuiz(null)}
        />
      )}
    </div>
  )
}

export default CourseDetail