import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Brain, 
  Zap, 
  Target,
  PieChart,
  LineChart,
  Calculator,
  Sparkles,
  Crown,
  Lock,
  Unlock,
  Play,
  Download,
  Share2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const FinancialModeling = () => {
  const { isAuthenticated } = useAuth()
  const [selectedModel, setSelectedModel] = useState('dcf')
  const [isGenerating, setIsGenerating] = useState(false)
  const [modelResults, setModelResults] = useState(null)

  const financialModels = [
    {
      id: 'dcf',
      name: 'DCF Valuation',
      description: 'AI-powered Discounted Cash Flow model with predictive analytics',
      icon: TrendingUp,
      premium: false,
      accuracy: '94%',
      timeToGenerate: '30s'
    },
    {
      id: 'monte-carlo',
      name: 'Monte Carlo Simulation',
      description: 'Risk assessment using advanced probability modeling',
      icon: BarChart3,
      premium: true,
      accuracy: '97%',
      timeToGenerate: '45s'
    },
    {
      id: 'portfolio-optimization',
      name: 'Portfolio Optimization',
      description: 'AI-driven asset allocation with real-time market data',
      icon: PieChart,
      premium: true,
      accuracy: '96%',
      timeToGenerate: '60s'
    },
    {
      id: 'credit-risk',
      name: 'Credit Risk Assessment',
      description: 'Machine learning credit scoring and default prediction',
      icon: Target,
      premium: false,
      accuracy: '92%',
      timeToGenerate: '25s'
    }
  ]

  const generateModel = async () => {
    setIsGenerating(true)
    
    // Simulate AI model generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockResults = {
      dcf: {
        fairValue: '$127.45',
        currentPrice: '$98.32',
        upside: '29.6%',
        confidence: '94%',
        keyMetrics: {
          'WACC': '8.2%',
          'Terminal Growth': '2.5%',
          'FCF Growth (5Y)': '12.3%'
        }
      },
      'monte-carlo': {
        expectedReturn: '14.2%',
        volatility: '18.7%',
        varAt95: '-12.4%',
        confidence: '97%',
        keyMetrics: {
          'Sharpe Ratio': '0.76',
          'Max Drawdown': '-15.2%',
          'Win Rate': '67%'
        }
      }
    }
    
    setModelResults(mockResults[selectedModel] || mockResults.dcf)
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Financial Modeling
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                FinanceAI
              </span>
              <br />
              <span className="text-gray-900 dark:text-white text-4xl md:text-5xl">
                Studio
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Build sophisticated financial models in minutes, not hours. Our AI analyzes market data, 
              generates predictions, and creates professional-grade financial models with blockchain verification.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-4"
                onClick={() => document.getElementById('models').scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Building Models
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Models Generated', value: '50K+', icon: Calculator },
              { label: 'Accuracy Rate', value: '96%', icon: Target },
              { label: 'Time Saved', value: '80%', icon: Zap },
              { label: 'Active Users', value: '2.5K+', icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Models Section */}
      <div id="models" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              AI Financial Models
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from our suite of AI-powered financial models, each trained on millions of data points
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {financialModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedModel === model.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <model.icon className="w-6 h-6 text-white" />
                      </div>
                      {model.premium && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                          <Crown className="w-3 h-3" />
                          <span>PRO</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {model.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {model.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Accuracy:</span>
                        <span className="font-semibold text-green-600">{model.accuracy}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Generation:</span>
                        <span className="font-semibold">{model.timeToGenerate}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Model Generator */}
          <Card className="max-w-4xl mx-auto">
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Generate AI Financial Model
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Selected: {financialModels.find(m => m.id === selectedModel)?.name}
                </p>
              </div>

              {!modelResults ? (
                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={generateModel}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-12 py-4"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        Generating Model...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Generate Model
                      </>
                    )}
                  </Button>
                  
                  {isGenerating && (
                    <div className="mt-6">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        AI is analyzing market data and building your model...
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {modelResults.fairValue || modelResults.expectedReturn}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedModel === 'dcf' ? 'Fair Value' : 'Expected Return'}
                      </div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {modelResults.upside || modelResults.volatility}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedModel === 'dcf' ? 'Upside Potential' : 'Volatility'}
                      </div>
                    </div>
                    
                    <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {modelResults.confidence}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        AI Confidence
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Key Metrics
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {Object.entries(modelResults.keyMetrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Model
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Results
                    </Button>
                    <Button onClick={() => setModelResults(null)}>
                      Generate New Model
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Blockchain-Verified Financial Models
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Every model generated is cryptographically signed and stored on Hedera blockchain for immutable verification and audit trails.
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-blue-200 text-sm">Verifiable</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Immutable</div>
                <div className="text-blue-200 text-sm">Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Instant</div>
                <div className="text-blue-200 text-sm">Verification</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default FinancialModeling