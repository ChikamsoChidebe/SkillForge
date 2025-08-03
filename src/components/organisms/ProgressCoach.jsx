import { motion } from 'framer-motion'
import { Target, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const ProgressCoach = ({ stats, nextBadge, onAddEntry }) => {
  const getProgressTips = () => {
    const { totalEntries, completionRate } = stats
    
    if (totalEntries === 0) {
      return {
        title: "🚀 Ready to start your journey?",
        message: "Record your first learning milestone to unlock your First Steps badge!",
        action: "Add Your First Entry",
        urgency: "high"
      }
    }
    
    if (totalEntries < 5) {
      return {
        title: "🔥 Keep the momentum going!",
        message: `You're ${5 - totalEntries} entries away from your Learning Streak badge. Try logging a tutorial or project today!`,
        action: "Continue Learning",
        urgency: "medium"
      }
    }
    
    if (totalEntries < 10) {
      return {
        title: "🏗️ Building knowledge!",
        message: `${10 - totalEntries} more entries to become a Knowledge Builder. Consider documenting a recent course or workshop.`,
        action: "Add Recent Learning",
        urgency: "medium"
      }
    }
    
    if (completionRate < 50) {
      return {
        title: "📈 You're making great progress!",
        message: "Keep logging your learning activities to unlock more prestigious badges and showcase your dedication.",
        action: "Log More Activities",
        urgency: "low"
      }
    }
    
    return {
      title: "👑 Learning Master!",
      message: "You're doing amazing! Keep documenting your journey to inspire others and build your professional portfolio.",
      action: "Share Your Success",
      urgency: "low"
    }
  }

  const tip = getProgressTips()
  const progressToNext = nextBadge ? Math.round((stats.totalEntries / nextBadge.milestone) * 100) : 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6"
    >
      <Card className={`border-l-4 ${
        tip.urgency === 'high' ? 'border-l-green-500 bg-green-50 dark:bg-green-900/20' :
        tip.urgency === 'medium' ? 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20' :
        'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className={`w-5 h-5 ${
                tip.urgency === 'high' ? 'text-green-600' :
                tip.urgency === 'medium' ? 'text-blue-600' :
                'text-purple-600'
              }`} />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {tip.title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {tip.message}
            </p>
            
            {nextBadge && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress to {nextBadge.name}</span>
                  <span>{stats.totalEntries}/{nextBadge.milestone}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      tip.urgency === 'high' ? 'bg-green-500' :
                      tip.urgency === 'medium' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={onAddEntry}
            className="ml-4 flex-shrink-0"
          >
            {tip.action}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default ProgressCoach