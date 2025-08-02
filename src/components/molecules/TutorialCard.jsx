import { motion } from 'framer-motion'
import { Calendar, ExternalLink, Hash, BookOpen } from 'lucide-react'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import { hederaClient } from '@/api/hederaClient'

const TutorialCard = ({ entry, index = 0 }) => {
  const { title, description, date, category, txHash, timestamp } = entry

  const handleViewOnHashScan = () => {
    window.open(hederaClient.getHashScanUrl(txHash), '_blank')
  }

  const categoryColors = {
    tutorial: 'primary',
    project: 'success',
    course: 'purple',
    workshop: 'warning',
    default: 'default'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card hover className="group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <Badge variant={categoryColors[category] || categoryColors.default}>
              {category}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(date), 'MMM dd, yyyy')}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Hash className="w-3 h-3 mr-1" />
            <span className="font-mono truncate max-w-32">
              {txHash}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleViewOnHashScan}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            HashScan
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default TutorialCard