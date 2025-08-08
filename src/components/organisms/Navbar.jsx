import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  BookOpen, 
  Trophy, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Wallet,
  LogOut,
  Brain,
  Video,
  MessageCircle,
  Award,
  Info,
  TrendingUp
} from 'lucide-react'
import Button from '@/components/atoms/Button'
import SmartWalletLink from '@/components/molecules/SmartWalletLink'
import { useApp } from '@/contexts/AppContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { isConnected, connectWallet, disconnectWallet, isLoading } = useApp()
  const { theme, toggleTheme } = useTheme()
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  const publicNavigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'FinanceAI', href: '/financial-modeling', icon: TrendingUp },
    { name: 'Connect Wallet', href: '/wallet-connect', icon: Wallet },
  ]
  
  const privateNavigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BookOpen },
    { name: 'Wallet', href: 'smart-wallet', icon: Wallet, isSmartWallet: true },
    { name: 'Badges', href: '/badges', icon: Award },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'AI Coach', href: '/ai-coach', icon: Brain },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Profile', href: '/profile', icon: User },
  ]
  
  const navigation = isAuthenticated ? privateNavigation : publicNavigation

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-2 lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">SF</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillForge
            </span>
          </Link>

          {/* Desktop Navigation - Centered with flex-1 */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-1">
              {navigation.map((item) => {
              const Icon = item.icon
              
              if (item.href.startsWith('#')) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                )
              }
              
              if (item.isSmartWallet) {
                return (
                  <SmartWalletLink
                    key={item.name}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/wallet-dashboard') || isActive('/wallet-connect')
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </SmartWalletLink>
                )
              }
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
              })}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-lg">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.fullName || user.username}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold ${user.avatar ? 'hidden' : 'flex'}`}
                  >
                    {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {user.username || user.fullName}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="hidden sm:flex"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/auth?mode=login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button 
                    variant="primary" 
                    size="sm"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-[9998] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Modern Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-xl lg:hidden z-[9999]"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {navigation.map((item, index) => {
                  const Icon = item.icon
                  
                  if (item.href.startsWith('#')) {
                    return (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors">
                          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.name}</span>
                      </motion.a>
                    )
                  }
                  
                  if (item.isSmartWallet) {
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <SmartWalletLink
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 p-4 rounded-xl transition-colors group ${
                            isActive('/wallet-dashboard') || isActive('/wallet-connect')
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                              : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg shadow-sm flex items-center justify-center transition-colors ${
                            isActive('/wallet-dashboard') || isActive('/wallet-connect')
                              ? 'bg-white/20'
                              : 'bg-white dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isActive('/wallet-dashboard') || isActive('/wallet-connect')
                                ? 'text-white'
                                : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`} />
                          </div>
                          <span className={`font-medium ${
                            isActive('/wallet-dashboard') || isActive('/wallet-connect')
                              ? 'text-white'
                              : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }`}>{item.name}</span>
                        </SmartWalletLink>
                      </motion.div>
                    )
                  }
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 p-4 rounded-xl transition-colors group ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg shadow-sm flex items-center justify-center transition-colors ${
                          isActive(item.href)
                            ? 'bg-white/20'
                            : 'bg-white dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isActive(item.href)
                              ? 'text-white'
                              : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }`} />
                        </div>
                        <span className={`font-medium ${
                          isActive(item.href)
                            ? 'text-white'
                            : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`}>{item.name}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
              
              {/* Bottom Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                {/* Theme Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="w-full justify-start p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </Button>
                </motion.div>

                {/* User Section */}
                {isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.fullName || user.username}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold ${user.avatar ? 'hidden' : 'flex'}`}
                      >
                        {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {user.username || user.fullName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex space-x-3"
                  >
                    <Link to="/auth?mode=login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                      <Button variant="ghost" className="w-full justify-center py-3">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth?mode=register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                      <Button className="w-full justify-center py-3 bg-gradient-to-r from-blue-500 to-purple-500">
                        Get Started
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      

    </nav>
  )
}

export default Navbar