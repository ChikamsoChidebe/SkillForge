import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import BadgeNotification from './BadgeNotification'
import { courseService } from '@/api/courseService'
import { useAuth } from '@/contexts/AuthContext'

const BadgeNotificationManager = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!user) return

    // Listen for new badges
    const checkForNewBadges = async () => {
      try {
        const badges = await courseService.getUserBadges(user.id)
        const recentBadges = badges.filter(badge => {
          const earnedTime = new Date(badge.earned_at).getTime()
          const now = new Date().getTime()
          return now - earnedTime < 10000 // Show badges earned in last 10 seconds
        })

        recentBadges.forEach(badge => {
          if (!notifications.find(n => n.id === badge.id)) {
            setNotifications(prev => [...prev, badge])
          }
        })
      } catch (error) {
        console.error('Error checking for new badges:', error)
      }
    }

    const interval = setInterval(checkForNewBadges, 2000)
    return () => clearInterval(interval)
  }, [user, notifications])

  const handleCloseNotification = (badgeId) => {
    setNotifications(prev => prev.filter(n => n.id !== badgeId))
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      <AnimatePresence>
        {notifications.map(badge => (
          <BadgeNotification
            key={badge.id}
            badge={badge}
            onClose={() => handleCloseNotification(badge.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default BadgeNotificationManager