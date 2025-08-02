import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BookOpen, FileText, Tag } from 'lucide-react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { useAuth } from '@/contexts/AuthContext'
import { userService } from '@/api/userService'
import { toast } from 'react-hot-toast'

const LogEntryForm = ({ onSuccess }) => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tutorial',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = [
    { value: 'tutorial', label: 'Tutorial', icon: BookOpen },
    { value: 'project', label: 'Project', icon: FileText },
    { value: 'course', label: 'Course', icon: BookOpen },
    { value: 'workshop', label: 'Workshop', icon: Tag },
    { value: 'certification', label: 'Certification', icon: Calendar }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await userService.recordEntry(user.id, formData)
      toast.success('Learning entry recorded successfully!')
      setFormData({
        title: '',
        description: '',
        category: 'tutorial',
        date: new Date().toISOString().split('T')[0]
      })
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to record entry. Please try again.')
      console.error('Failed to record entry:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What did you learn?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          placeholder="Describe your learning experience, challenges faced, and key takeaways..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess?.()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
          disabled={!formData.title || !formData.description}
        >
          Record Entry
        </Button>
      </div>
    </form>
  )
}

export default LogEntryForm