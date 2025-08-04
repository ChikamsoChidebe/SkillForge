import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Trophy,
  Play,
  FileText,
  HelpCircle
} from 'lucide-react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import QuizComponent from './QuizComponent'
import { courseService } from '@/api/courseService'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const CourseContentViewer = ({ courseId, moduleId, lessonId, onLessonComplete, onProgressUpdate }) => {
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [currentModule, setCurrentModule] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [userProgress, setUserProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQuiz, setShowQuiz] = useState(false)

  useEffect(() => {
    loadCourseContent()
  }, [courseId, moduleId, lessonId])

  const loadCourseContent = async () => {
    try {
      setLoading(true)
      const courseData = await courseService.getCourseById(courseId)
      setCourse(courseData)

      // Find current module and lesson
      const module = courseData.modules.find(m => m.id === parseInt(moduleId))
      const lesson = module?.lessons.find(l => l.id === parseInt(lessonId))

      setCurrentModule(module)
      setCurrentLesson(lesson)

      if (user) {
        const progress = await courseService.getUserProgress(user.id, courseId)
        setUserProgress(progress)
      }
    } catch (error) {
      toast.error('Failed to load course content')
      console.error(error)
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

  const handleMarkComplete = async () => {
    if (!user || !currentModule || !currentLesson) return

    // If it's a quiz lesson, show quiz instead of marking complete
    if (currentLesson.type === 'quiz') {
      setShowQuiz(true)
      return
    }

    try {
      await courseService.updateLessonProgress(
        user.id, 
        courseId, 
        currentModule.id, 
        currentLesson.id, 
        true
      )
      
      // Reload progress
      const progress = await courseService.getUserProgress(user.id, courseId)
      setUserProgress(progress)
      
      toast.success('Lesson completed! 🎉')
      
      if (onLessonComplete) {
        onLessonComplete(currentModule.id, currentLesson.id)
      }
      
      if (onProgressUpdate) {
        onProgressUpdate()
      }
    } catch (error) {
      toast.error('Failed to update progress')
      console.error(error)
    }
  }

  const handleQuizComplete = async (moduleId, lessonId, passed) => {
    setShowQuiz(false)
    
    if (passed) {
      // Reload progress
      const progress = await courseService.getUserProgress(user.id, courseId)
      setUserProgress(progress)
      
      if (onLessonComplete) {
        onLessonComplete(moduleId, lessonId)
      }
      
      if (onProgressUpdate) {
        onProgressUpdate()
      }
    }
  }

  const getNextLesson = () => {
    if (!course || !currentModule || !currentLesson) return null

    const currentModuleIndex = course.modules.findIndex(m => m.id === currentModule.id)
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id)

    // Next lesson in current module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      return {
        moduleId: currentModule.id,
        lessonId: currentModule.lessons[currentLessonIndex + 1].id,
        lesson: currentModule.lessons[currentLessonIndex + 1]
      }
    }

    // First lesson of next module
    if (currentModuleIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentModuleIndex + 1]
      return {
        moduleId: nextModule.id,
        lessonId: nextModule.lessons[0].id,
        lesson: nextModule.lessons[0]
      }
    }

    return null
  }

  const getPreviousLesson = () => {
    if (!course || !currentModule || !currentLesson) return null

    const currentModuleIndex = course.modules.findIndex(m => m.id === currentModule.id)
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id)

    // Previous lesson in current module
    if (currentLessonIndex > 0) {
      return {
        moduleId: currentModule.id,
        lessonId: currentModule.lessons[currentLessonIndex - 1].id,
        lesson: currentModule.lessons[currentLessonIndex - 1]
      }
    }

    // Last lesson of previous module
    if (currentModuleIndex > 0) {
      const prevModule = course.modules[currentModuleIndex - 1]
      const lastLesson = prevModule.lessons[prevModule.lessons.length - 1]
      return {
        moduleId: prevModule.id,
        lessonId: lastLesson.id,
        lesson: lastLesson
      }
    }

    return null
  }

  const renderLessonContent = () => {
    if (!currentLesson) return null

    // Convert markdown-like content to JSX
    const formatContent = (content) => {
      return content
        .split('\n')
        .map((line, index) => {
          // Headers
          if (line.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{line.substring(2)}</h1>
          }
          if (line.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-8">{line.substring(3)}</h2>
          }
          if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">{line.substring(4)}</h3>
          }

          // Code blocks
          if (line.startsWith('```')) {
            return <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto"></div>
          }

          // Lists
          if (line.startsWith('- ')) {
            return <li key={index} className="text-gray-700 dark:text-gray-300 mb-2">{line.substring(2)}</li>
          }

          // Bold text
          if (line.includes('**')) {
            const parts = line.split('**')
            return (
              <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {parts.map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </p>
            )
          }

          // Regular paragraphs
          if (line.trim()) {
            return <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{line}</p>
          }

          return <br key={index} />
        })
    }

    return (
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {formatContent(currentLesson.content)}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!course || !currentModule || !currentLesson) {
    return (
      <Card className="p-8 text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Content not found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The requested lesson could not be found.
        </p>
      </Card>
    )
  }

  const nextLesson = getNextLesson()
  const previousLesson = getPreviousLesson()
  const isCompleted = isLessonCompleted(currentModule.id, currentLesson.id)

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{course.title}</span>
                <ChevronRight className="w-4 h-4" />
                <span>{currentModule.title}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {currentLesson.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  {currentLesson.type === 'text' ? (
                    <FileText className="w-4 h-4" />
                  ) : currentLesson.type === 'quiz' ? (
                    <HelpCircle className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span className="capitalize">{currentLesson.type}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentLesson.duration}</span>
                </div>
                {currentLesson.type === 'quiz' && (
                  <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>{currentLesson.questions?.length || 0} questions</span>
                  </div>
                )}
              </div>
            </div>
            
            {user && (
              <div className="flex items-center space-x-3">
                {isCompleted ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleMarkComplete}
                    className={`flex items-center space-x-2 ${
                      currentLesson.type === 'quiz' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : ''
                    }`}
                  >
                    {currentLesson.type === 'quiz' ? (
                      <>
                        <HelpCircle className="w-4 h-4" />
                        <span>Take Quiz</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Lesson Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8">
          {currentLesson.type === 'quiz' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Quiz: {currentLesson.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Test your knowledge with {currentLesson.questions?.length || 0} questions. 
                You need 70% or higher to pass and proceed to the next lesson.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>{currentLesson.questions?.length || 0} Questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>5 min limit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>70% to pass</span>
                </div>
              </div>
              <Button
                onClick={() => setShowQuiz(true)}
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Start Quiz
              </Button>
            </div>
          ) : (
            renderLessonContent()
          )}
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              {previousLesson ? (
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `/courses/${courseId}/module/${previousLesson.moduleId}/lesson/${previousLesson.lessonId}`}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Previous</div>
                    <div className="font-medium">{previousLesson.lesson.title}</div>
                  </div>
                </Button>
              ) : (
                <div></div>
              )}
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Lesson {currentModule.lessons.findIndex(l => l.id === currentLesson.id) + 1} of {currentModule.lessons.length}
              </div>
            </div>

            <div>
              {nextLesson ? (
                <Button
                  onClick={() => window.location.href = `/courses/${courseId}/module/${nextLesson.moduleId}/lesson/${nextLesson.lessonId}`}
                  className="flex items-center space-x-2"
                >
                  <div className="text-right">
                    <div className="text-xs text-white/80">Next</div>
                    <div className="font-medium">{nextLesson.lesson.title}</div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex items-center space-x-2 text-green-600">
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">Course Complete!</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quiz Modal */}
      {showQuiz && currentLesson.type === 'quiz' && (
        <QuizComponent
          courseId={courseId}
          moduleId={currentModule.id}
          lesson={currentLesson}
          onQuizComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  )
}

export default CourseContentViewer