import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Shield, 
  Trophy, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Globe,
  Users,
  PlayIcon,
  UserPlusIcon
} from 'lucide-react'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import AuthModal from '@/components/organisms/AuthModal'
import { useAuth } from '@/contexts/AuthContext'

const Landing = () => {
  const { isAuthenticated, user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('register')
  const [activeStep, setActiveStep] = useState(0)

  const features = [
    {
      icon: Shield,
      title: 'Immutable Proof',
      description: 'Your learning milestones are permanently recorded on Hedera blockchain, providing tamper-proof evidence of your progress.'
    },
    {
      icon: Trophy,
      title: 'Achievement Badges',
      description: 'Unlock unique NFT badges as you reach learning milestones. Show off your achievements to employers and peers.'
    },
    {
      icon: Zap,
      title: 'Fast & Secure',
      description: 'Powered by Hedera\'s high-performance network with low fees and enterprise-grade security.'
    },
    {
      icon: Globe,
      title: 'Global Verification',
      description: 'Anyone can verify your learning achievements through HashScan, making your portfolio globally accessible.'
    }
  ]

  const stats = [
    { label: 'Learning Entries', value: '10,000+' },
    { label: 'Badges Earned', value: '2,500+' },
    { label: 'Active Learners', value: '1,200+' },
    { label: 'Verified Skills', value: '50+' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/blockchain.gif" 
            alt="Blockchain Animation"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/70 to-slate-900/80" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Prove Your Progress
              </span>
              <br />
              <span className="text-white text-4xl md:text-5xl drop-shadow-lg">
                on Hedera
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
              Build a verifiable learning portfolio that employers trust. Record milestones, earn NFT badges, showcase skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    setAuthMode('register')
                    setShowAuthModal(true)
                  }}
                >
                  <UserPlusIcon className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:border-white/50 shadow-lg"
                onClick={() => {
                  if (isAuthenticated) {
                    window.location.href = '/badges'
                  } else {
                    setAuthMode('login')
                    setShowAuthModal(true)
                  }
                }}
              >
                <Trophy className="w-5 h-5 mr-2" />
                {isAuthenticated ? 'View Badges' : 'Sign In'}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    {stat.value}
                  </div>
                  <div className="text-gray-200 drop-shadow-md">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Why Choose DevChain?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built on Hedera's enterprise-grade blockchain technology, DevChain provides 
              the most secure and efficient way to track and verify your learning journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card hover className="text-center h-full">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              How It Works
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Create Your Account',
                  description: 'Sign up for free and start building your verifiable learning portfolio on Hedera blockchain.',
                  icon: Shield,
                  action: 'Get Started'
                },
                {
                  step: '02',
                  title: 'Log Learning Milestones',
                  description: 'Record tutorials, courses, projects, and achievements. Each entry is permanently stored on Hedera.',
                  icon: BookOpen,
                  action: 'Add Entry'
                },
                {
                  step: '03',
                  title: 'Earn NFT Badges',
                  description: 'Unlock unique NFT badges as you reach milestones. These serve as verifiable proof of your skills.',
                  icon: Trophy,
                  action: 'View Badges'
                },
                {
                  step: '04',
                  title: 'Share & Verify',
                  description: 'Share your achievements with employers, peers, or on social media. Anyone can verify them on HashScan.',
                  icon: Globe,
                  action: 'View HashScan'
                }
              ].map((step, index) => {
                const Icon = step.icon
                const isActive = activeStep === index
                
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className={`relative flex items-start space-x-6 p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                      isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setActiveStep(index)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {isActive ? <Icon className="w-8 h-8" /> : step.step}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                      
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4"
                        >
                          {index === 0 && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!isAuthenticated) {
                                  setAuthMode('register')
                                  setShowAuthModal(true)
                                }
                              }}
                            >
                              {isAuthenticated ? '✅ Account Created' : step.action}
                            </Button>
                          )}
                          {index === 1 && (
                            <Link to={isAuthenticated ? '/log-entry' : '#'} onClick={(e) => {
                              if (!isAuthenticated) {
                                e.preventDefault()
                                setAuthMode('register')
                                setShowAuthModal(true)
                              }
                            }}>
                              <Button size="sm">
                                <BookOpen className="w-4 h-4 mr-2" />
                                {step.action}
                              </Button>
                            </Link>
                          )}
                          {index === 2 && (
                            <Link to={isAuthenticated ? '/badges' : '#'} onClick={(e) => {
                              if (!isAuthenticated) {
                                e.preventDefault()
                                setAuthMode('register')
                                setShowAuthModal(true)
                              }
                            }}>
                              <Button size="sm">
                                <Trophy className="w-4 h-4 mr-2" />
                                {step.action}
                              </Button>
                            </Link>
                          )}
                          {index === 3 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open('https://hashscan.io/testnet', '_blank')
                              }}
                            >
                              <Globe className="w-4 h-4 mr-2" />
                              {step.action}
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </div>
                    
                    {index < 3 && (
                      <div className="absolute -bottom-6 left-8 w-0.5 h-12 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600" />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are building verifiable skill portfolios on the blockchain.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/log-entry">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Add Learning Entry
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 py-4"
                    onClick={() => {
                      setAuthMode('register')
                      setShowAuthModal(true)
                    }}
                  >
                    <UserPlusIcon className="w-5 h-5 mr-2" />
                    Get Started Free
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                    onClick={() => {
                      setAuthMode('login')
                      setShowAuthModal(true)
                    }}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
            
            {isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg inline-block"
              >
                <p className="text-white">
                  Welcome back, <span className="font-semibold">{user.fullName}</span>! 🎉
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  )
}

export default Landing