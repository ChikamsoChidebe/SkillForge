import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Sparkles } from 'lucide-react'
import Button from '@/components/atoms/Button'

const BadgeNotification = ({ badge, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500'
      case 'rare': return 'from-purple-400 to-pink-500'
      case 'uncommon': return 'from-blue-400 to-cyan-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityBg = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
      case 'rare': return 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
      case 'uncommon': return 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
      default: return 'bg-gray-50 dark:bg-gray-800'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className={`${getRarityBg(badge.rarity)} rounded-2xl p-6 shadow-2xl border-2 border-opacity-20 ${
            badge.rarity === 'legendary' ? 'border-yellow-300' :
            badge.rarity === 'rare' ? 'border-purple-300' :
            badge.rarity === 'uncommon' ? 'border-blue-300' :
            'border-gray-300'
          }`}>
            {/* Sparkle Effects */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Badge Icon with Glow */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="relative mb-4"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} flex items-center justify-center mx-auto shadow-lg`}>
                  <span className="text-2xl">{badge.icon}</span>
                </div>
                <motion.div
                  className={`absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} opacity-30 mx-auto`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Badge Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">
                    Badge Earned!
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {badge.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {badge.description}
                </p>

                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  badge.rarity === 'rare' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                  badge.rarity === 'uncommon' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {badge.rarity.toUpperCase()}
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4"
              >
                <Button
                  size="sm"
                  onClick={handleClose}
                  className="bg-white/20 hover:bg-white/30 text-gray-800 dark:text-gray-200 border border-white/30"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Awesome!
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BadgeNotification