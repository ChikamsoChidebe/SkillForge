import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Filter,
  Search,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import { walletService } from '@/services/walletService'
import { userActivityService } from '@/services/userActivityService'
import { useAuth } from '@/contexts/AuthContext'

const BlockchainTransactionLog = ({ userId, accountId = '0.0.6478142' }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all') // all, learning, badges, transfers
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [userId, accountId])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      
      // Load real user transactions from activity service
      const currentAccountId = accountId || '0.0.6478142'
      const userTransactions = userActivityService.getTransactions(currentAccountId)
      console.log('📊 Loading transactions for:', currentAccountId, 'Found:', userTransactions.length)
      
      setTransactions(userTransactions)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type, status) => {
    if (status === 'PENDING') return Clock
    if (status === 'FAILED') return AlertCircle
    
    switch (type) {
      case 'learning_entry':
        return Activity
      case 'badge_mint':
        return CheckCircle
      case 'transfer':
        return ExternalLink
      default:
        return Activity
    }
  }

  const getTransactionColor = (type, status) => {
    if (status === 'PENDING') return 'yellow'
    if (status === 'FAILED') return 'red'
    
    switch (type) {
      case 'learning_entry':
        return 'blue'
      case 'badge_mint':
        return 'green'
      case 'transfer':
        return 'purple'
      default:
        return 'gray'
    }
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || 
      (filter === 'learning' && tx.type === 'learning_entry') ||
      (filter === 'badge' && tx.type === 'badge_mint') ||
      (filter === 'transfer' && tx.type === 'hbar_transfer')
    const matchesSearch = !searchTerm || 
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const openHashScan = (transactionId) => {
    // For demo purposes, link to account page since transaction IDs are simulated
    window.open(`https://hashscan.io/testnet/account/${accountId}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Blockchain Transaction Log
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All your blockchain activities verified on Hedera
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={loadTransactions}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="learning">Learning Entries</option>
              <option value="badge">NFT Badges</option>
              <option value="transfer">Transfers</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transaction List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <Card className="p-8 text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Transactions Found
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {transactions.length === 0 
                ? 'Start learning to see your blockchain activity here'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </Card>
        ) : (
          <AnimatePresence>
            {filteredTransactions.map((transaction, index) => {
              const Icon = getTransactionIcon(transaction.type, transaction.status)
              const color = getTransactionColor(transaction.type, transaction.status)
              
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-${color}-100 dark:bg-${color}-900/20 rounded-full flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                              {transaction.description}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.status === 'SUCCESS' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : transaction.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {transaction.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{format(new Date(transaction.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                            </div>
                            
                            <div className="font-mono text-xs">
                              Fee: {transaction.fee} HBAR
                            </div>
                            
                            {transaction.amount && (
                              <div className="font-medium">
                                {transaction.amount} HBAR
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openHashScan(transaction.id)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">HashScan</span>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {transactions.filter(tx => tx.type === 'learning_entry').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Learning Entries
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {transactions.filter(tx => tx.type === 'badge_mint').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                NFT Badges
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {transactions.filter(tx => tx.type === 'hbar_transfer').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Transfers
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {transactions.reduce((sum, tx) => sum + parseFloat(tx.fee || 0), 0).toFixed(4)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Fees (HBAR)
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default BlockchainTransactionLog