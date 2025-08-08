import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet, 
  Activity, 
  Send, 
  Download,
  Settings,
  Shield,
  TrendingUp,
  Award,
  ExternalLink,
  Plus,
  RefreshCw
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import WalletStatus from '@/components/molecules/WalletStatus'
import BlockchainTransactionLog from '@/components/organisms/BlockchainTransactionLog'
import { useWallet } from '@/hooks/useWallet'
import { useAuth } from '@/contexts/AuthContext'
import { walletService } from '@/services/walletService'
import { userActivityService } from '@/services/userActivityService'
import toast from 'react-hot-toast'

const WalletDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { 
    isConnected, 
    accountId, 
    balance, 
    loading,
    loadBalance,
    transferHbar 
  } = useWallet()
  
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transferData, setTransferData] = useState({
    recipient: '',
    amount: ''
  })
  const [userActivity, setUserActivity] = useState({
    learningEntries: [],
    badges: [],
    totalEntries: 0,
    totalBadges: 0
  })
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({ title: '', description: '', category: 'learning' })
  const [walletInitialized, setWalletInitialized] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const loadUserActivity = () => {
    const currentAccountId = accountId || '0.0.6478142'
    const activity = userActivityService.getUserActivity(currentAccountId)
    console.log('📊 Loaded activity:', activity)
    setUserActivity(activity)
  }

  useEffect(() => {
    console.log('🔍 WalletDashboard - User:', !!user, 'isConnected:', isConnected)
    
    const initializeWallet = async () => {
      const currentAccountId = accountId || '0.0.6478142'
      
      if (!isConnected && !walletInitialized) {
        if (user) {
          // Authenticated user without wallet - create default connection
          console.log('🔗 Creating default wallet connection for authenticated user')
          setWalletInitialized(true)
          try {
            await walletService.connectManualAccount(currentAccountId)
          } catch (error) {
            console.error('Failed to create default connection:', error)
            setWalletInitialized(false)
            navigate('/wallet-connect')
            return
          }
        } else {
          // Unauthenticated user - redirect to connect
          console.log('🔍 Redirecting unauthenticated user to wallet-connect')
          navigate('/wallet-connect')
          return
        }
      }
      
      // Always load user activity
      loadUserActivity()
    }
    
    initializeWallet()
  }, [user, isConnected, navigate, walletInitialized, accountId])

  // Auto-refresh every 5 seconds to ensure data is current
  useEffect(() => {
    const interval = setInterval(() => {
      loadUserActivity()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [accountId])

  // Listen for user activity changes to auto-refresh
  useEffect(() => {
    const handleActivityChange = () => {
      console.log('🔄 Activity changed, refreshing wallet dashboard')
      setTimeout(() => loadUserActivity(), 100) // Small delay to ensure data is saved
    }

    window.addEventListener('userActivityChanged', handleActivityChange)
    window.addEventListener('storage', handleActivityChange)
    
    // Also listen for focus events to refresh when returning to page
    window.addEventListener('focus', handleActivityChange)
    
    return () => {
      window.removeEventListener('userActivityChanged', handleActivityChange)
      window.removeEventListener('storage', handleActivityChange)
      window.removeEventListener('focus', handleActivityChange)
    }
  }, [accountId])

  const handleTransfer = async (e) => {
    e.preventDefault()
    
    try {
      await transferHbar(transferData.recipient, parseFloat(transferData.amount))
      setShowTransferModal(false)
      setTransferData({ recipient: '', amount: '' })
    } catch (error) {
      console.error('Transfer failed:', error)
    }
  }

  const handleAddEntry = async () => {
    if (!newEntry.title.trim()) return
    
    try {
      const entryAccountId = accountId || '0.0.6478142'
      userActivityService.addLearningEntry(entryAccountId, newEntry)
      
      // Force immediate refresh
      loadUserActivity()
      
      setNewEntry({ title: '', description: '', category: 'learning' })
      setShowAddEntry(false)
      toast.success('Learning entry added successfully!')
    } catch (error) {
      console.error('Failed to add entry:', error)
      toast.error('Failed to add learning entry')
    }
  }

  const quickActions = [
    {
      icon: Send,
      title: 'Send HBAR',
      description: 'Transfer HBAR to another account',
      action: () => setShowTransferModal(true),
      color: 'blue'
    },
    {
      icon: Award,
      title: 'View Badges',
      description: 'See your NFT badge collection',
      action: () => navigate('/badge-gallery'),
      color: 'green'
    },
    {
      icon: Plus,
      title: 'Add Entry',
      description: 'Record new learning milestone',
      action: () => setShowAddEntry(true),
      color: 'purple'
    },
    {
      icon: ExternalLink,
      title: 'HashScan',
      description: 'View account on blockchain explorer',
      action: () => window.open(`https://hashscan.io/testnet/account/${accountId}`, '_blank'),
      color: 'orange'
    }
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Connect your Hedera wallet to access blockchain features.
          </p>
          <Button onClick={() => navigate('/wallet-connect')}>
            Connect Wallet
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Wallet Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your Hedera wallet and blockchain activities
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              loadUserActivity()
              toast.success('Data refreshed!')
            }}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/settings')}
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      {/* Wallet Status */}
      <WalletStatus onDisconnect={() => navigate('/wallet-connect')} />

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  HBAR Balance
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Available balance
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadBalance}
              disabled={loading}
            >
              <TrendingUp className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {balance?.hbar || '0.0'} HBAR
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ≈ ${((parseFloat(balance?.hbar || 0) * 0.05).toFixed(2))} USD
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                NFT Badges
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Earned achievements
              </p>
            </div>
          </div>
          
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {userActivity.totalBadges}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/badge-gallery')}
            className="w-full"
          >
            View Collection
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Security Score
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Wallet security
              </p>
            </div>
          </div>
          
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            100%
          </div>
          
          <div className="text-sm text-green-600 dark:text-green-400">
            Fully Secured
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 group"
                  onClick={action.action}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 bg-${action.color}-100 dark:bg-${action.color}-900/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {action.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Learning Activity
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Entries */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Learning Entries ({userActivity.totalEntries})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {userActivity.learningEntries.length > 0 ? (
                userActivity.learningEntries.slice(-5).reverse().map((entry) => (
                  <div key={entry.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {entry.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.description || 'No description'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No learning entries yet. Add your first entry!
                </div>
              )}
            </div>
          </Card>

          {/* Badges */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              NFT Badges ({userActivity.totalBadges})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {userActivity.badges.length > 0 ? (
                userActivity.badges.slice(-5).reverse().map((badge) => (
                  <div key={badge.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {badge.title}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                        badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        badge.rarity === 'uncommon' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {badge.rarity}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {badge.description}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(badge.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No badges earned yet. Complete learning entries to earn badges!
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Transaction Log */}
      <BlockchainTransactionLog userId={user?.id || 'demo'} accountId={accountId || '0.0.6478142'} />

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Send HBAR
            </h3>
            
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Account ID
                </label>
                <input
                  type="text"
                  value={transferData.recipient}
                  onChange={(e) => setTransferData(prev => ({ ...prev, recipient: e.target.value }))}
                  placeholder="0.0.12345"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (HBAR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={transferData.amount}
                  onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="10.00"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Sending...' : 'Send HBAR'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Add Learning Entry
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entry Title
                </label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What did you learn?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newEntry.description}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your learning experience..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newEntry.category}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="learning">Learning</option>
                  <option value="project">Project</option>
                  <option value="skill">Skill</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddEntry(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddEntry}
                  disabled={!newEntry.title.trim()}
                  className="flex-1"
                >
                  Add Entry
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default WalletDashboard