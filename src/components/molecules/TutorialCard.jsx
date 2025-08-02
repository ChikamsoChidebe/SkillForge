import { motion } from 'framer-motion'
import { Calendar, ExternalLink, BookOpen } from 'lucide-react'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'

const TutorialCard = ({ entry, index }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      tutorial: 'blue',
      project: 'green',
      course: 'purple',
      workshop: 'orange',
      certification: 'red'
    }
    return colors[category] || 'gray'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-3">
          <Badge variant={getCategoryColor(entry.category)} size="sm">
            {entry.category}
          </Badge>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(entry.timestamp || entry.date)}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {entry.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {entry.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <BookOpen className="w-4 h-4 mr-1" />
            Learning Entry
          </div>
          
          {entry.transactionId && (
            <a
              href={`https://hashscan.io/testnet/transaction/${entry.transactionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Verify
            </a>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default TutorialCard