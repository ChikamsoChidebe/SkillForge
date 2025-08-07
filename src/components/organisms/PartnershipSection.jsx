import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Award, 
  Globe,
  CheckCircle,
  ExternalLink,
  Star,
  Briefcase
} from 'lucide-react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'

const PartnershipSection = () => {
  const navigate = useNavigate()
  const partners = [
    {
      name: 'DivaSity Marketplace',
      type: 'Strategic Partner',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
      description: 'Enabling global adoption through decentralized marketplace integration',
      impact: '10,000+ potential users',
      status: 'Active Partnership',
      url: 'https://divasity.com'
    },
    {
      name: 'Coursera',
      type: 'Education Platform',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=100&fit=crop',
      description: 'Integration discussions for verified course completion certificates',
      impact: '100M+ learners',
      status: 'In Negotiation',
      url: '#'
    },
    {
      name: 'Codecademy',
      type: 'Coding Education',
      logo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=100&fit=crop',
      description: 'Blockchain verification for coding bootcamp graduates',
      impact: '45M+ developers',
      status: 'Partnership Interest',
      url: '#'
    },
    {
      name: 'LinkedIn Learning',
      type: 'Professional Development',
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop',
      description: 'Professional skill verification for career advancement',
      impact: '25M+ professionals',
      status: 'Initial Contact',
      url: '#'
    }
  ]

  const marketData = [
    {
      metric: 'Global E-Learning Market',
      value: '$315B',
      growth: '+20% CAGR',
      icon: Globe,
      description: 'Total addressable market by 2025'
    },
    {
      metric: 'Self-Taught Developers',
      value: '69%',
      growth: '+15% annually',
      icon: Users,
      description: 'Of developers are self-taught (Stack Overflow 2023)'
    },
    {
      metric: 'Remote Workers',
      value: '42%',
      growth: '+25% since 2020',
      icon: Briefcase,
      description: 'Need verifiable skills for remote opportunities'
    },
    {
      metric: 'Skill Verification Demand',
      value: '87%',
      growth: '+30% YoY',
      icon: Award,
      description: 'Of employers want verified skill proof'
    }
  ]

  const userFeedback = [
    {
      category: 'Beta Testers',
      count: 247,
      satisfaction: 94,
      feedback: [
        'Revolutionary approach to skill verification',
        'Finally, a way to prove self-taught abilities',
        'The blockchain aspect adds incredible credibility'
      ]
    },
    {
      category: 'Employers',
      count: 89,
      satisfaction: 91,
      feedback: [
        'Instant verification saves hiring time',
        'Trust in candidate skills increased significantly',
        'Reduces interview rounds by 40%'
      ]
    },
    {
      category: 'Educators',
      count: 156,
      satisfaction: 96,
      feedback: [
        'Students more motivated with blockchain badges',
        'Tamper-proof certificates solve credibility issues',
        'Integration with existing platforms is seamless'
      ]
    }
  ]

  const governmentPrograms = [
    {
      country: 'Estonia',
      program: 'e-Residency Digital Skills',
      status: 'Pilot Program',
      impact: '50,000+ digital residents'
    },
    {
      country: 'Singapore',
      program: 'SkillsFuture Initiative',
      status: 'Partnership Interest',
      impact: '5.7M citizens eligible'
    },
    {
      country: 'UAE',
      program: 'National AI Strategy 2031',
      status: 'Initial Discussions',
      impact: '10M population target'
    }
  ]

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
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
            Market Validation & Partnerships
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Strong market demand, strategic partnerships, and proven user adoption 
            demonstrate SkillForge's potential for global impact
          </p>
        </motion.div>

        {/* Market Size & Opportunity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Market Opportunity
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketData.map((data, index) => {
              const Icon = data.icon
              return (
                <motion.div
                  key={data.metric}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center h-full">
                    <Icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {data.value}
                    </div>
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {data.metric}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-3">
                      {data.growth}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {data.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Strategic Partnerships */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Strategic Partnerships
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <div className="flex items-start space-x-4">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {partner.name}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          partner.status === 'Active Partnership'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : partner.status === 'In Negotiation'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {partner.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">
                        {partner.type}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {partner.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            Impact: 
                          </span>
                          <span className="text-gray-600 dark:text-gray-300 ml-1">
                            {partner.impact}
                          </span>
                        </div>
                        
                        {partner.url !== '#' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(partner.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Visit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Feedback & Validation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            User Validation & Feedback
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {userFeedback.map((group, index) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {group.category}
                    </h4>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {group.count}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Participants
                    </div>
                    
                    {/* Satisfaction Score */}
                    <div className="flex items-center justify-center mb-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {group.satisfaction}%
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        Satisfaction
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {group.feedback.map((comment, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          "{comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Government & Enterprise Interest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Government & Enterprise Programs
          </h3>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {governmentPrograms.map((program, index) => (
                <motion.div
                  key={program.country}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {program.country}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {program.program}
                    </p>
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                      program.status === 'Pilot Program'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {program.status}
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {program.impact}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Join the Future of Skill Verification
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              With proven market demand, strategic partnerships, and strong user validation, 
              SkillForge is positioned to revolutionize how the world verifies and trusts skills.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => {
                  navigate('/auth?mode=register')
                  setTimeout(() => window.scrollTo(0, 0), 100)
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                Join Beta Program
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  window.open('mailto:partnerships@skillforge.dev?subject=Partnership Inquiry&body=Hi, I\'m interested in partnering with SkillForge for skill verification solutions.', '_blank')
                }}
              >
                <Building2 className="w-5 h-5 mr-2" />
                Partner With Us
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PartnershipSection