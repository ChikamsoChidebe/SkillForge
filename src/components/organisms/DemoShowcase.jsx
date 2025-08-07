import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ExternalLink,
  Award,
  Shield,
  Zap,
  Globe,
  Users,
  TrendingUp,
  CheckCircle
} from 'lucide-react'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const DemoShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      id: 'progress-timeline',
      title: 'Interactive Progress Timeline',
      description: 'Visual learning journey with blockchain verification',
      timestamp: '0:15',
      icon: TrendingUp,
      demo: 'Real-time progress tracking with Hedera timestamps'
    },
    {
      id: 'ai-assistant',
      title: 'AI Learning Coach',
      description: 'Personalized guidance and skill recommendations',
      timestamp: '0:45',
      icon: Users,
      demo: 'Smart recommendations based on learning patterns'
    },
    {
      id: 'nft-minting',
      title: 'Automated NFT Badge Minting',
      description: 'Instant badge creation at learning milestones',
      timestamp: '1:20',
      icon: Award,
      demo: 'Smart contract triggers automatic badge rewards'
    },
    {
      id: 'certificate-vault',
      title: 'Immutable Certificate Vault',
      description: 'Secure storage of all learning achievements',
      timestamp: '1:50',
      icon: Shield,
      demo: 'Tamper-proof certificate storage on Hedera'
    },
    {
      id: 'public-portfolio',
      title: 'Verifiable Public Portfolio',
      description: 'Share achievements with instant blockchain verification',
      timestamp: '2:25',
      icon: Globe,
      demo: 'One-click verification via HashScan integration'
    }
  ]

  const metrics = [
    { label: 'Demo Views', value: '12,847', change: '+23%' },
    { label: 'User Signups', value: '2,394', change: '+45%' },
    { label: 'Blockchain Verifications', value: '8,921', change: '+67%' },
    { label: 'Success Rate', value: '94.2%', change: '+12%' }
  ]

  const testimonialQuotes = [
    "The demo convinced me instantly - this is the future of skill verification",
    "Finally, a way to prove my self-taught abilities with blockchain backing",
    "The automated badge system is genius - gamification meets verification"
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            See SkillForge in Action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Watch our comprehensive demo showcasing blockchain-verified learning, automated NFT badges, 
            and the future of skill certification
          </p>
          
          {/* Demo Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.label}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {metric.change}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Demo Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-16"
        >
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg overflow-hidden">
              {/* Embedded YouTube Video */}
              {isPlaying ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/jvYQj1r9we0?autoplay=1&mute=0"
                  title="SkillForge Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <motion.div
                      className="mb-4"
                    >
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors"
                           onClick={() => setIsPlaying(true)}>
                        <Play className="w-8 h-8 ml-1" />
                      </div>
                    </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    SkillForge Complete Demo
                  </h3>
                  <p className="text-white/80 mb-4">
                    3:15 minutes • Professional narration • All features showcased
                  </p>
                  
                  {/* Feature Timeline */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {features.map((feature, index) => (
                      <button
                        key={feature.id}
                        onClick={() => setActiveFeature(index)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          activeFeature === index
                            ? 'bg-white text-blue-600'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {feature.timestamp}
                      </button>
                    ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => window.open('https://youtu.be/jvYQj1r9we0', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    YouTube
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>




      </div>
    </section>
  )
}

export default DemoShowcase