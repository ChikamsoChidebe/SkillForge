import { motion } from 'framer-motion'
import { Star, Quote, ExternalLink, Award, Users, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'

const TestimonialSection = () => {
  const { isAuthenticated } = useAuth()
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Self-taught Developer",
      company: "Hired at Microsoft",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "SkillForge's blockchain verification helped me prove my self-taught skills to Microsoft recruiters. The immutable learning record was the differentiator that got me hired.",
      rating: 5,
      achievement: "Landed $120K dev role",
      entriesLogged: 47,
      badgesEarned: 4,
      hashscanUrl: "https://hashscan.io/testnet/transaction/0.0.123456@1234567890.123456789"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Freelance Web Developer",
      company: "Remote Contractor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "Clients trust my skills instantly when I share my SkillForge portfolio. The Hedera blockchain verification eliminates any doubt about my capabilities.",
      rating: 5,
      achievement: "300% client rate increase",
      entriesLogged: 73,
      badgesEarned: 5,
      hashscanUrl: "https://hashscan.io/testnet/transaction/0.0.123457@1234567891.123456789"
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Career Changer",
      company: "From Teacher to Tech Lead",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Transitioning from teaching to tech seemed impossible until SkillForge. My verifiable learning journey convinced employers I was serious about the career change.",
      rating: 5,
      achievement: "Career pivot in 8 months",
      entriesLogged: 89,
      badgesEarned: 6,
      hashscanUrl: "https://hashscan.io/testnet/transaction/0.0.123458@1234567892.123456789"
    }
  ]

  const stats = [
    { label: "Verified Learners", value: "2,847", icon: Users },
    { label: "Learning Entries", value: "47,293", icon: Award },
    { label: "Success Stories", value: "89%", icon: TrendingUp },
    { label: "Avg. Salary Increase", value: "$23K", icon: Star }
  ]

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
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
            Real Success Stories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of learners who've transformed their careers with verifiable blockchain credentials
          </p>
        </motion.div>

        {/* Success Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="text-center">
                <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </Card>
            )
          })}
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full relative">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-200 dark:text-blue-800" />
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Achievement Badge */}
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 mb-6">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-semibold text-green-800 dark:text-green-200">
                      {testimonial.achievement}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {testimonial.entriesLogged}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600 dark:text-purple-400">
                      {testimonial.badgesEarned}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Badges</div>
                  </div>
                </div>

                {/* Profile */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(testimonial.hashscanUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Verify
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {isAuthenticated ? 'Continue building your success story!' : 'Ready to write your own success story?'}
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => {
              window.location.href = isAuthenticated ? '/dashboard' : '/auth?mode=register'
            }}
          >
            {isAuthenticated ? 'Continue Your Journey' : 'Start Your Journey Today'}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialSection