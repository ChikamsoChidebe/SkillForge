import { motion } from 'framer-motion'
import { Lock, Calendar, Trophy } from 'lucide-react'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'

const BadgeTile = ({ badge, index = 0, onClick }) => {
  const { name, description, milestone, unlocked, unlockedAt, icon, rarity } = badge

  const rarityColors = {
    common: 'default',
    uncommon: 'success',
    rare: 'purple',
    legendary: 'warning'
  }

  const rarityGradients = {
    common: 'from-gray-400 to-gray-600',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={`relative overflow-hidden ${unlocked ? 'ring-2 ring-blue-500' : 'opacity-60'}`}>
        {/* Background gradient for unlocked badges */}
        {unlocked && (
          <div className={`absolute inset-0 bg-gradient-to-br ${rarityGradients[rarity]} opacity-5`} />
        )}

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <Badge variant={rarityColors[rarity]} size="sm">
              {rarity}
            </Badge>
            {!unlocked && <Lock className="w-4 h-4 text-gray-400" />}
          </div>

          <div className="text-center mb-4">
            <div className={`text-4xl mb-2 ${unlocked ? 'grayscale-0' : 'grayscale'}`}>
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Milestone:</span>
              <span className="font-medium">{milestone} entries</span>
            </div>

            {unlocked && unlockedAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Unlocked:</span>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {format(new Date(unlockedAt), 'MMM dd, yyyy')}
                </div>
              </div>
            )}

            {unlocked && (
              <div className="flex items-center justify-center pt-2">
                <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Achieved!
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default BadgeTile