import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Code, Trophy, Sparkles } from 'lucide-react'

const PageLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => setIsLoading(false), 300)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    // Minimum loading time of 2 seconds
    const minLoadTime = setTimeout(() => {
      setProgress(100)
    }, 2000)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(minLoadTime)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>
              
              {/* Floating particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  initial={{
                    x: Math.random() * 1200,
                    y: Math.random() * 800,
                  }}
                  animate={{
                    x: Math.random() * 1200,
                    y: Math.random() * 800,
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
              {/* Logo Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="mb-8"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="w-24 h-24 mx-auto mb-4 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
                    <div className="relative w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Code className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Orbiting icons */}
                  {[Zap, Trophy, Sparkles].map((Icon, index) => (
                    <motion.div
                      key={index}
                      className="absolute w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        rotate: 360,
                        x: Math.cos((index * 120 * Math.PI) / 180) * 60 - 16,
                        y: Math.sin((index * 120 * Math.PI) / 180) * 60 - 16,
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: index * 0.5
                      }}
                    >
                      <Icon className="w-4 h-4 text-white/80" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Brand Name */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-6"
              >
                <h1 className="text-5xl font-bold text-white mb-2">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SkillForge
                  </span>
                </h1>
                <p className="text-white/80 text-lg">
                  Immutable Learning Milestone Tracker
                </p>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="w-80 mx-auto"
              >
                <div className="relative">
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-3 text-white/60 text-sm"
                  >
                    {progress < 30 && "Initializing blockchain connection..."}
                    {progress >= 30 && progress < 60 && "Loading your learning journey..."}
                    {progress >= 60 && progress < 90 && "Preparing your dashboard..."}
                    {progress >= 90 && "Almost ready!"}
                  </motion.div>
                </div>
              </motion.div>

              {/* Blockchain indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-8 flex justify-center space-x-6 text-white/60 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Hedera Network</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>AI Assistant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>NFT Badges</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isLoading && children}
    </>
  )
}

export default PageLoader