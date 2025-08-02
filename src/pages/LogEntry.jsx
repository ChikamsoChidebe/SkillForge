import { motion } from 'framer-motion'
import { BookOpen, ArrowLeft, Lightbulb, Target, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import LogEntryForm from '@/components/organisms/LogEntryForm'
import { useApp } from '@/contexts/AppContext'

const LogEntry = () => {
  const { isConnected } = useApp()

  const tips = [
    {
      icon: Target,
      title: 'Be Specific',
      description: 'Include specific technologies, concepts, or skills you learned. This helps build a detailed record of your progress.'
    },
    {
      icon: Lightbulb,
      title: 'Include Challenges',
      description: 'Mention any obstacles you overcame or problems you solved. This demonstrates your problem-solving abilities.'
    },
    {
      icon: Clock,
      title: 'Regular Updates',
      description: 'Log your learning regularly to build a comprehensive timeline of your development journey.'
    }
  ]

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need to connect your Hedera wallet to record learning milestones on the blockchain.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home Page
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Record Learning Milestone
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Document your learning journey and create permanent, verifiable proof of your progress on the Hedera blockchain.
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <LogEntryForm onSuccess={() => window.location.href = '/dashboard'} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Tips for Better Entries
                </h3>
              </div>
              
              <div className="space-y-4">
                {tips.map((tip, index) => {
                  const Icon = tip.icon
                  return (
                    <motion.div
                      key={tip.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {tip.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {tip.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* Example Entries */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Example Entries
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'React Hooks Deep Dive',
                    category: 'Tutorial',
                    description: 'Learned useState, useEffect, and custom hooks. Built a todo app to practice state management and side effects.',
                    icon: '📚'
                  },
                  {
                    title: 'Node.js Authentication System',
                    category: 'Project',
                    description: 'Implemented JWT authentication with bcrypt password hashing. Added role-based access control and session management.',
                    icon: '🚀'
                  },
                  {
                    title: 'AWS Solutions Architect',
                    category: 'Certification',
                    description: 'Passed AWS SAA-C03 exam. Studied VPC, EC2, S3, RDS, and Lambda. Practiced with hands-on labs and mock exams.',
                    icon: '🏆'
                  }
                ].map((example, index) => (
                  <motion.div
                    key={example.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{example.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                            {example.title}
                          </h4>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full flex-shrink-0">
                            {example.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          {example.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Blockchain Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Powered by Hedera
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Immutable blockchain storage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Low transaction fees</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Enterprise-grade security</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Global verification via HashScan</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default LogEntry