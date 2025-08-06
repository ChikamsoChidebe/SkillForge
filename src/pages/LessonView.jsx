import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/atoms/Button'
import CourseContentViewer from '@/components/organisms/CourseContentViewer'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const LessonView = () => {
  const { courseId, moduleId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access course content')
      navigate('/auth')
      return
    }
  }, [isAuthenticated, navigate])

  const handleLessonComplete = (completedModuleId, completedLessonId) => {
    // Handle lesson completion
    console.log('Lesson completed:', completedModuleId, completedLessonId)
  }

  const handleProgressUpdate = () => {
    // Handle progress update
    console.log('Progress updated')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Back Button - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 sm:mb-6"
        >
          <Button
            variant="outline"
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex items-center space-x-2 text-sm sm:text-base py-2 px-3 sm:py-2.5 sm:px-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Course</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </motion.div>

        {/* Course Content Viewer */}
        <CourseContentViewer
          courseId={courseId}
          moduleId={moduleId}
          lessonId={lessonId}
          onLessonComplete={handleLessonComplete}
          onProgressUpdate={handleProgressUpdate}
        />
      </div>
    </div>
  )
}

export default LessonView