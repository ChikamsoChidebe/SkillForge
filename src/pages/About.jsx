import { motion } from 'framer-motion'
import { 
  Shield, 
  Trophy, 
  Zap, 
  Users, 
  BookOpen, 
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import { useAuth } from '@/contexts/AuthContext'

const About = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Every learning milestone is permanently stored on Hedera blockchain for immutable verification.'
    },
    {
      icon: Trophy,
      title: 'NFT Badges',
      description: 'Earn unique achievement badges as NFTs that prove your skills to employers and peers.'
    },
    {
      icon: Zap,
      title: 'AI-Powered Learning',
      description: 'Get personalized learning recommendations and coaching from our advanced AI system.'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: 'Access structured learning paths across multiple programming languages and technologies.'
    }
  ]

  const benefits = [
    'Immutable learning records that can\'t be faked',
    'Global verification through HashScan blockchain explorer',
    'NFT achievement badges with rarity system',
    'AI-powered personalized learning paths',
    'Progress tracking and analytics',
    'Mobile-first responsive design'
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500/40 to-purple-600/40 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-br from-cyan-500/40 to-blue-600/40 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-500/40 to-pink-600/40 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px'
          }} />
        </div>
        
        {/* Floating Shapes */}
        <div className="absolute top-32 left-1/4 w-8 h-8 bg-blue-500/60 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-purple-500/60 rotate-45 animate-bounce shadow-lg" style={{ animationDelay: '2s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-cyan-500/60 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '3s', animationDuration: '5s' }} />
      </div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
        
        {/* Hero Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-blue-300/50 dark:border-blue-600/50 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute top-20 right-20 w-32 h-32 border-2 border-purple-300/50 dark:border-purple-600/50 rounded-lg rotate-45 animate-pulse" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-cyan-400/40 to-blue-500/40 dark:from-cyan-600/40 dark:to-blue-700/40 rounded-full animate-pulse" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkillForge
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              The future of learning verification. Record your development journey on the blockchain 
              and earn verifiable badges that prove your skills to the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/dashboard')
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/badges')
                    }}
                    className="cursor-pointer"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Badges
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/auth?mode=register')
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/wallet-connect')
                    }}
                    className="cursor-pointer"
                  >
                    Connect Wallet
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SkillForge?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Revolutionary features that make your learning journey verifiable and rewarding
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Immutable Learning Records
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Your learning achievements are permanently recorded on the Hedera blockchain, 
                creating an unalterable record of your skills and progress that employers can trust.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <Award className="w-12 h-12" />
                  <div>
                    <h3 className="text-2xl font-bold">Achievement Unlocked!</h3>
                    <p className="opacity-90">Learning Master Badge</p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-2">Blockchain Verified</p>
                  <p className="font-mono text-xs opacity-75">
                    Transaction: 0.0.6478142@1640995200.123456789
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Verified Learning Journey?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of developers building verifiable skill records on the blockchain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/dashboard')
                      window.scrollTo(0, 0)
                    }}
                    className="relative z-20 px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 font-semibold border border-blue-200 rounded-lg transition-all duration-200 cursor-pointer shadow-lg"
                    style={{ pointerEvents: 'auto' }}
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      navigate('/courses')
                      window.scrollTo(0, 0)
                    }}
                    className="relative z-20 px-6 py-3 border border-white text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center shadow-lg"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explore Courses
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/auth?mode=register')
                      window.scrollTo(0, 0)
                    }}
                    className="relative z-20 px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 font-semibold border border-blue-200 rounded-lg transition-all duration-200 cursor-pointer shadow-lg"
                    style={{ pointerEvents: 'auto' }}
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => {
                      navigate('/wallet-connect')
                      window.scrollTo(0, 0)
                    }}
                    className="relative z-20 px-6 py-3 border border-white text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer shadow-lg"
                    style={{ pointerEvents: 'auto' }}
                  >
                    Connect Wallet
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default About