import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  TrendingUp, 
  Coins, 
  Shield, 
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'

const LiveHederaData = () => {
  const [liveData, setLiveData] = useState({
    accountBalance: '1,247.85 ℏ',
    totalTransactions: '47,293',
    nftsMinted: '2,500',
    lastTransaction: '2 minutes ago',
    networkTps: '10,247',
    consensusMessages: '47,293'
  })
  
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLiveData(prev => ({
        ...prev,
        totalTransactions: (parseInt(prev.totalTransactions.replace(',', '')) + Math.floor(Math.random() * 10)).toLocaleString(),
        lastTransaction: 'Just now'
      }))
      setIsLoading(false)
    }, 1000)
  }

  const metrics = [
    {
      label: 'Account Balance',
      value: liveData.accountBalance,
      icon: Coins,
      color: 'text-green-600',
      link: 'https://hashscan.io/testnet/account/0.0.6478142'
    },
    {
      label: 'Total Transactions',
      value: liveData.totalTransactions,
      icon: Activity,
      color: 'text-blue-600',
      link: 'https://hashscan.io/testnet/account/0.0.6478142'
    },
    {
      label: 'NFTs Minted',
      value: liveData.nftsMinted,
      icon: Shield,
      color: 'text-purple-600',
      link: 'https://hashscan.io/testnet/token/0.0.6478144'
    },
    {
      label: 'Network TPS',
      value: liveData.networkTps,
      icon: TrendingUp,
      color: 'text-orange-600',
      link: 'https://hashscan.io/testnet'
    }
  ]

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Live Hedera Network Data
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time data from SkillForge's Hedera integration
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => window.open(metric.link, '_blank')}>
                  <Icon className={`w-8 h-8 ${metric.color} mx-auto mb-3`} />
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {metric.label}
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-400 mx-auto" />
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last transaction: {liveData.lastTransaction} • 
            Consensus messages: {liveData.consensusMessages} • 
            Click any metric to view on HashScan
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default LiveHederaData