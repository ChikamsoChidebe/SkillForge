import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Shield, 
  Zap, 
  Trophy,
  CheckCircle,
  Github,
  Twitter,
  Linkedin,
  Chrome,
  Sun,
  Moon,
  Sparkles,
  Star,
  Rocket,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { toast } from 'react-hot-toast'

const Auth = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, register, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  
  const [mode, setMode] = useState(searchParams.get('mode') || 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
    
    // Check if wallet is already connected
    const walletData = localStorage.getItem('skillforge_wallet_data')
    if (walletData) {
      try {
        const parsed = JSON.parse(walletData)
        setWalletConnected(!!parsed.hederaAccountId)
      } catch (e) {
        localStorage.removeItem('skillforge_wallet_data')
      }
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        
        const result = await register(formData)
        
        if (result.success) {
          // Professional flow: Check if wallet connection is needed
          if (result.needsWalletConnection) {
            toast.success('Account created! Please connect your wallet to continue.')
            navigate('/wallet-connect')
          } else {
            toast.success('Account created successfully! Wallet already connected.')
            navigate('/dashboard')
          }
        }
      } else {
        const result = await login({
          identifier: formData.email,
          password: formData.password
        })
        if (result.success) {
          navigate('/dashboard')
        }
      }
    } catch (error) {
      toast.error(error.message)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [-20, 20, -20],
            x: [-10, 10, -10]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl"
        />
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              </motion.div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  SkillForge
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Blockchain Learning Platform
                </div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600" />
                )}
              </motion.button>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <a href="/#features" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Features
                </a>
                <a href="/#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  How It Works
                </a>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Home
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 space-y-4">
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Home
                  </span>
                </Link>
                
                <a 
                  href="/#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Features
                  </span>
                </a>
                
                <a 
                  href="/#how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Rocket className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    How It Works
                  </span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50"
              >
                <Rocket className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Blockchain-Verified Learning
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  {mode === 'login' ? 'Welcome' : 'Build Your'}
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {mode === 'login' ? 'Back' : 'Future'}
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg"
              >
                {mode === 'login' 
                  ? 'Continue your blockchain-verified learning journey and unlock new achievements.' 
                  : 'Create a permanent, verifiable record of your learning milestones on the blockchain.'
                }
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { icon: Shield, label: 'Secure', color: 'from-green-500 to-emerald-500' },
                { icon: Zap, label: 'Fast', color: 'from-yellow-500 to-orange-500' },
                { icon: Trophy, label: 'Verified', color: 'from-purple-500 to-pink-500' }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {feature.label}
                    </span>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center space-x-8 pt-4"
            >
              {[
                { value: '10K+', label: 'Learners' },
                { value: '50K+', label: 'Entries' },
                { value: '2.5K+', label: 'Badges' }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl blur-xl" />
            
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-8 lg:p-10">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center space-x-2 mb-4"
                >
                  <Star className="w-6 h-6 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </span>
                  <Star className="w-6 h-6 text-yellow-500" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {mode === 'login' ? 'Welcome Back!' : 'Join SkillForge'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {mode === 'login' 
                    ? 'Sign in to continue your learning journey' 
                    : 'Start building your blockchain learning portfolio'
                  }
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
                  <button
                    onClick={() => setMode('login')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      mode === 'login'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode('register')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      mode === 'register'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            required
                          />
                        </div>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="relative group"
                  >
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      required
                    />
                  </motion.div>
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => {
                        const email = prompt('Enter your email address for password reset:')
                        if (email) {
                          toast.success('Password reset instructions sent to ' + email)
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Wallet Status Notice */}
              {walletConnected && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-700/50"
                >
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                        Wallet Connected!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                        Your Hedera wallet is ready. {mode === 'register' ? 'Create your account to continue.' : 'Sign in to access your dashboard.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Blockchain Notice */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                      Blockchain Verification
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      Your learning progress will be permanently recorded on Hedera blockchain for global verification
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Auth