import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  BookOpen, 
  FileText, 
  Tag, 
  Save,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import { useRecordEntry } from '@/hooks/useEntries'
import toast from 'react-hot-toast'

const LogEntryForm = ({ onSuccess }) => {
  const [selectedCategory, setSelectedCategory] = useState('tutorial')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null

  const recordEntryMutation = useRecordEntry()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'tutorial'
    },
    mode: 'onChange'
  })

  const watchedValues = watch()

  const categories = [
    { value: 'tutorial', label: 'Tutorial', icon: '📚', color: 'blue' },
    { value: 'project', label: 'Project', icon: '🚀', color: 'green' },
    { value: 'course', label: 'Course', icon: '🎓', color: 'purple' },
    { value: 'workshop', label: 'Workshop', icon: '🛠️', color: 'orange' },
    { value: 'certification', label: 'Certification', icon: '🏆', color: 'yellow' },
    { value: 'book', label: 'Book', icon: '📖', color: 'indigo' },
    { value: 'video', label: 'Video', icon: '🎥', color: 'pink' },
    { value: 'practice', label: 'Practice', icon: '💪', color: 'teal' }
  ]

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setSubmitStatus(null)

      const entryData = {
        ...data,
        category: selectedCategory,
        timestamp: Date.now()
      }

      await recordEntryMutation.mutateAsync(entryData)
      
      setSubmitStatus('success')
      toast.success('Learning milestone recorded successfully!')
      
      // Reset form after successful submission
      setTimeout(() => {
        reset()
        setSelectedCategory('tutorial')
        onSuccess?.()
      }, 2000)

    } catch (error) {
      setSubmitStatus('error')
      toast.error(`Failed to record entry: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory)

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Tag className="w-4 h-4 inline mr-2" />
            Learning Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.value}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedCategory === category.value
                    ? `border-${category.color}-500 bg-${category.color}-50 dark:bg-${category.color}-900/20`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className={`text-xs font-medium ${
                  selectedCategory === category.value
                    ? `text-${category.color}-700 dark:text-${category.color}-300`
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {category.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div>
          <Input
            label={
              <span className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Title
              </span>
            }
            placeholder="e.g., React Hooks Deep Dive, Node.js Authentication System"
            error={errors.title?.message}
            {...register('title', {
              required: 'Title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters'
              },
              maxLength: {
                value: 100,
                message: 'Title must be less than 100 characters'
              }
            })}
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {watchedValues.title?.length || 0}/100 characters
          </div>
        </div>

        {/* Description Input */}
        <div>
          <Textarea
            label={
              <span className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Description
              </span>
            }
            placeholder="Describe what you learned, key concepts covered, challenges faced, and outcomes achieved..."
            rows={6}
            error={errors.description?.message}
            {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters'
              },
              maxLength: {
                value: 500,
                message: 'Description must be less than 500 characters'
              }
            })}
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {watchedValues.description?.length || 0}/500 characters
          </div>
        </div>

        {/* Date Input */}
        <div>
          <Input
            type="date"
            label={
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date Completed
              </span>
            }
            error={errors.date?.message}
            {...register('date', {
              required: 'Date is required',
              validate: (value) => {
                const selectedDate = new Date(value)
                const today = new Date()
                today.setHours(23, 59, 59, 999)
                
                if (selectedDate > today) {
                  return 'Date cannot be in the future'
                }
                
                const oneYearAgo = new Date()
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
                
                if (selectedDate < oneYearAgo) {
                  return 'Date cannot be more than a year ago'
                }
                
                return true
              }
            })}
          />
        </div>

        {/* Preview Card */}
        {watchedValues.title && watchedValues.description && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-6"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Preview
            </h3>
            <Card className="bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{selectedCategoryData?.icon}</span>
                  <Badge variant={selectedCategoryData?.color || 'default'}>
                    {selectedCategoryData?.label}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {watchedValues.date && format(new Date(watchedValues.date), 'MMM dd, yyyy')}
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {watchedValues.title}
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {watchedValues.description}
              </p>
            </Card>
          </motion.div>
        )}

        {/* Submit Status */}
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg flex items-center space-x-3 ${
              submitStatus === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}
          >
            {submitStatus === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <div>
              <div className="font-medium">
                {submitStatus === 'success' 
                  ? 'Entry Recorded Successfully!' 
                  : 'Failed to Record Entry'
                }
              </div>
              <div className="text-sm">
                {submitStatus === 'success'
                  ? 'Your learning milestone has been permanently recorded on Hedera blockchain.'
                  : 'Please check your connection and try again.'
                }
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting || submitStatus === 'success'}
            loading={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Recording on Hedera...
              </>
            ) : submitStatus === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Recorded Successfully
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Record Learning Milestone
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset()
              setSelectedCategory('tutorial')
              setSubmitStatus(null)
            }}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            Reset Form
          </Button>
        </div>

        {/* Blockchain Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Blockchain Recording
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your learning milestone will be permanently recorded on the Hedera network. 
                This creates immutable proof of your learning progress that can be verified by anyone.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LogEntryForm