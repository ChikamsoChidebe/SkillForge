import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Copy,
  LogOut,
  RefreshCw
} from 'lucide-react'
import Button from '@/components/atoms/Button'
import { walletService } from '@/services/walletService'
import toast from 'react-hot-toast'

const WalletStatus = ({ onDisconnect }) => {
  const [status, setStatus] = useState(null)
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadWalletStatus()
  }, [])

  const loadWalletStatus = async () => {
    try {
      const connectionStatus = walletService.getConnectionStatus()
      setStatus(connectionStatus)
      
      if (connectionStatus.connected) {
        await loadBalance()
      }
    } catch (error) {
      console.error('Failed to load wallet status:', error)
    }
  }

  const loadBalance = async () => {
    try {
      setLoading(true)
      const balanceData = await walletService.getAccountBalance()
      setBalance(balanceData)
    } catch (error) {
      console.error('Failed to load balance:', error)
      // Set mock balance for demo
      setBalance({ hbar: '100.0', tokens: {} })
    } finally {
      setLoading(false)
    }
  }

  const copyAccountId = () => {
    if (status?.accountId) {
      navigator.clipboard.writeText(status.accountId)
      toast.success('Account ID copied to clipboard!')
    }
  }

  const handleDisconnect = async () => {
    try {
      await walletService.disconnectWallet()
      setStatus({ connected: false })
      setBalance(null)
      onDisconnect?.()
      toast.success('Wallet disconnected successfully')
    } catch (error) {
      console.error('Disconnect failed:', error)
      toast.error('Failed to disconnect wallet')
    }
  }

  const openHashScan = () => {
    if (status?.accountId) {
      window.open(`https://hashscan.io/testnet/account/${status.accountId}`, '_blank')
    }
  }

  if (!status?.connected) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
              No Wallet Connected
            </h4>
            <p className="text-sm text-yellow-600 dark:text-yellow-300">
              Connect your Hedera wallet to enable blockchain features
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-green-800 dark:text-green-200">
                Wallet Connected
              </h4>
              <span className="px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                {status.walletId}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <code className="text-sm font-mono text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
                {status.accountId}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAccountId}
                className="p-1 h-auto text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            
            {balance && (
              <div className="flex items-center space-x-4 text-sm text-green-600 dark:text-green-400">
                <div className="flex items-center space-x-1">
                  <Wallet className="w-3 h-3" />
                  <span>{balance.hbar} HBAR</span>
                </div>
                {loading && (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                )}
              </div>
            )}
            
            <div className="text-xs text-green-500 dark:text-green-400 mt-1">
              Connected {new Date(status.connectedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={openHashScan}
            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            title="View on HashScan"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={loadBalance}
            disabled={loading}
            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            title="Refresh Balance"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            title="Disconnect Wallet"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default WalletStatus