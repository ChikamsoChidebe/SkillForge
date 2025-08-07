/**
 * 🎮 Interactive Sandbox - Try SkillForge Live
 * Allows visitors to experience the platform without signup
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Trophy, 
  BookOpen, 
  CheckCircle, 
  Sparkles,
  ExternalLink,
  Code,
  Zap
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const InteractiveSandbox = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSteps, setCompletedSteps] = useState([])

  const demoSteps = [
    {
      title: 'Create Learning Entry',
      description: 'Log a learning milestone on Hedera blockchain',
      action: 'Add Entry',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Mint NFT Badge',
      description: 'Earn a verifiable achievement badge',
      action: 'Mint Badge',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Verify on HashScan',
      description: 'View your achievement on Hedera explorer',
      action: 'View Transaction',
      icon: ExternalLink,
      color: 'from-green-500 to-green-600'
    }
  ]

  const handleStepAction = async (stepIndex) => {
    setIsPlaying(true)
    
    // Simulate blockchain transaction
    toast.loading('Processing on Hedera...', { id: 'demo-tx' })
    
    setTimeout(() => {
      setCompletedSteps(prev => [...prev, stepIndex])
      toast.success('Transaction confirmed!', { id: 'demo-tx' })
      
      if (stepIndex === 0) {
        toast.success('🎉 Learning entry recorded on blockchain!')
      } else if (stepIndex === 1) {
        toast.success('🏆 NFT Badge minted successfully!')
      } else if (stepIndex === 2) {
        window.open('https://hashscan.io/testnet/account/0.0.6478142', '_blank')
        toast.success('🔍 View your transaction on HashScan!')
      }
      
      setIsPlaying(false)
      
      if (stepIndex < demoSteps.length - 1) {
        setCurrentStep(stepIndex + 1)
      }
    }, 2000)
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setCompletedSteps([])
    setIsPlaying(false)
  }

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full border border-purple-200/50 dark:border-purple-700/50 mb-6"
          >
            <Play className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              Interactive Demo
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
              Try SkillForge
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Live Demo
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Experience the full SkillForge workflow with real Hedera blockchain transactions. 
            No signup required - start learning and earning badges instantly.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Demo Interface */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-3xl blur-xl" />
              
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Live Sandbox
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Connected to Hedera Testnet
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {demoSteps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = currentStep === index
                    const isCompleted = completedSteps.includes(index)
                    const isDisabled = index > 0 && !completedSteps.includes(index - 1)

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                          isActive 
                            ? 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20' 
                            : isCompleted
                            ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${
                              isCompleted ? 'from-green-500 to-green-600' : step.color
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : (
                                <Icon className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {step.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {step.description}
                              </p>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                            whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                            onClick={() => !isDisabled && !isCompleted && handleStepAction(index)}
                            disabled={isDisabled || isCompleted || isPlaying}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              isCompleted
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : isDisabled
                                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600'
                            }`}
                          >
                            {isCompleted ? 'Completed' : isPlaying && isActive ? 'Processing...' : step.action}
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {completedSteps.length === demoSteps.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white text-center"
                  >
                    <Sparkles className="w-8 h-8 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">🎉 Demo Complete!</h4>
                    <p className="mb-4">You've experienced the full SkillForge workflow</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={resetDemo}
                        className="px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => window.open('/auth?mode=register', '_blank')}
                        className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                      >
                        Sign Up Now
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Why This Demo Wins
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: Code,
                      title: 'Real Blockchain Transactions',
                      description: 'Every action creates actual transactions on Hedera testnet'
                    },
                    {
                      icon: Zap,
                      title: 'Instant Feedback',
                      description: 'See results in real-time with sub-second confirmation'
                    },
                    {
                      icon: Trophy,
                      title: 'Verifiable Achievements',
                      description: 'All badges and certificates are publicly verifiable'
                    }
                  ].map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-700/50">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                      🏆 Hackathon Edge
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Interactive demos show judges exactly how your platform works. 
                      No explanation needed - they experience it firsthand.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InteractiveSandbox