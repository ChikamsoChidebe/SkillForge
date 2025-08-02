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
  Users
} from 'lucide-react'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import { useApp } from '@/contexts/AppContext'

const Landing = () => {
  const { isConnected, connectWallet, isLoading } = useApp()

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
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900" />
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                DevChain
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              The future of learning verification. Record your development journey on the blockchain 
              and earn verifiable badges that prove your skills to the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {isConnected ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4"
                  onClick={connectWallet}
                  loading={isLoading}
                >
                  Connect Wallet & Start
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              
              <Link to="/badges">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Badges
                </Button>
              </Link>
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
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
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
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
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
            <div className="space-y-12">
              {[
                {
                  step: '01',
                  title: 'Connect Your Wallet',
                  description: 'Connect your Hedera wallet to start recording your learning journey securely on the blockchain.',
                  icon: Shield
                },
                {
                  step: '02',
                  title: 'Log Learning Milestones',
                  description: 'Record tutorials, courses, projects, and achievements. Each entry is permanently stored on Hedera.',
                  icon: BookOpen
                },
                {
                  step: '03',
                  title: 'Earn Badges',
                  description: 'Unlock unique NFT badges as you reach milestones. These serve as verifiable proof of your skills.',
                  icon: Trophy
                },
                {
                  step: '04',
                  title: 'Share & Verify',
                  description: 'Share your achievements with employers, peers, or on social media. Anyone can verify them on HashScan.',
                  icon: Users
                }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-8 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="flex-1">
                      <Card>
                        <div className="flex items-start gap-6">
                          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                            {item.step}
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
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
              Join thousands of developers who are already building their verifiable learning portfolio on DevChain.
            </p>
            
            {!isConnected && (
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-4"
                onClick={connectWallet}
                loading={isLoading}
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Landing