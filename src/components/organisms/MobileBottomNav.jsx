import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Bot, 
  Trophy, 
  User, 
  LogIn,
  BookOpen,
  UserPlus,
  Wallet,
  Info
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const MobileBottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // Hide on specific pages
  const hiddenRoutes = isAuthenticated ? ['/auth', '/wallet-connect', '/'] : []
  const hiddenStartsWith = ['/courses/', '/lesson']
  
  if (hiddenRoutes.includes(location.pathname) || 
      hiddenStartsWith.some(route => location.pathname.startsWith(route) && location.pathname !== '/courses')) {
    return null
  }

  const authenticatedNavItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', activeRoutes: ['/dashboard'] },
    { icon: Bot, label: 'AI Coach', path: '/ai-coach', activeRoutes: ['/ai-coach'] },
    { icon: Trophy, label: 'Badges', path: '/badge-gallery', activeRoutes: ['/badge-gallery', '/badges'] },
    { icon: BookOpen, label: 'Courses', path: '/courses', activeRoutes: ['/courses'] },
    { icon: User, label: 'Profile', path: '/profile', activeRoutes: ['/profile', '/settings'] }
  ]

  const unauthenticatedNavItems = [
    { icon: Home, label: 'Home', path: '/', activeRoutes: ['/'] },
    { icon: Info, label: 'About', path: '/about', activeRoutes: ['/about'] },
    { icon: LogIn, label: 'Sign In', path: '/auth?mode=login', activeRoutes: ['/auth'] },
    { icon: Wallet, label: 'Connect', path: '/wallet-connect', activeRoutes: ['/wallet-connect'] }
  ]

  const navItems = isAuthenticated ? authenticatedNavItems : unauthenticatedNavItems

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-gray-900/20 pointer-events-none" />
      
      <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center justify-around px-1 py-1">
          {navItems.map((item, index) => {
            const isActive = item.activeRoutes.some(route => 
              location.pathname === route || location.pathname.startsWith(route + '/')
            )
            const Icon = item.icon
            
            return (
              <motion.button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                }`}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`relative ${isActive ? 'transform -translate-y-0.5' : ''}`}>
                  <Icon 
                    size={22} 
                    className={`transition-all duration-300 ${
                      isActive ? 'scale-110 drop-shadow-sm' : 'scale-100'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full shadow-sm"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 scale-105 font-semibold' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileBottomNav