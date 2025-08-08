import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  Shield, 
  CheckCircle, 
  ExternalLink, 
  Smartphone,
  Monitor,
  Wifi,
  AlertCircle,
  Loader2
} from 'lucide-react'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import { walletService } from '@/services/walletService'
import toast from 'react-hot-toast'

const WalletSelector = ({ onConnect, onCancel }) => {
  const [availableWallets, setAvailableWallets] = useState([])
  const [connecting, setConnecting] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAvailableWallets()
  }, [])

  const loadAvailableWallets = async () => {
    try {
      setLoading(true)
      const wallets = await walletService.getAvailableWallets()
      setAvailableWallets(wallets)
    } catch (error) {
      console.error('Failed to load wallets:', error)
      toast.error('Failed to detect available wallets')
    } finally {
      setLoading(false)
    }
  }

  const handleWalletConnect = async (walletId) => {
    setConnecting(walletId)
    
    try {
      const result = await walletService.connectWallet(walletId)
      
      if (result.success) {
        toast.success(`Connected to ${walletId} successfully!`)
        onConnect(result)
      } else {
        toast.error(result.error || 'Connection failed')
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      toast.error(`Failed to connect: ${error.message}`)
    } finally {
      setConnecting(null)
    }
  }

  const getWalletIcon = (wallet) => {
    switch (wallet.id) {
      case 'hashpack':
        return '🔷'
      case 'blade':
        return '⚔️'
      case 'walletconnect':
        return '🔗'
      default:
        return '👛'
    }
  }

  const getWalletTypeIcon = (type) => {
    switch (type) {
      case 'extension':
        return Monitor
      case 'mobile':
        return Smartphone
      case 'walletconnect':
        return Wifi
      default:
        return Wallet
    }
  }

  const getInstallUrl = (walletId) => {
    switch (walletId) {
      case 'hashpack':
        return 'https://www.hashpack.app/download'
      case 'blade':
        return 'https://bladewallet.io/download'
      default:
        return 'https://hedera.com/wallets'
    }
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">
          Detecting available wallets...
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Connect Your Hedera Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Choose your preferred wallet to start recording learning milestones on the blockchain
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Shield,
            title: 'Secure',
            description: 'Your keys, your control'
          },
          {
            icon: CheckCircle,
            title: 'Verified',
            description: 'Blockchain-verified achievements'
          },
          {
            icon: ExternalLink,
            title: 'Portable',
            description: 'Use anywhere, anytime'
          }
        ].map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {benefit.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {benefit.description}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Wallet Options */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Available Wallets
        </h3>
        
        <AnimatePresence>
          {availableWallets.map((wallet, index) => {
            const TypeIcon = getWalletTypeIcon(wallet.type)
            const isConnecting = connecting === wallet.id
            
            return (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className={`p-4 cursor-pointer transition-all duration-200 ${
                  wallet.available 
                    ? 'hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600' 
                    : 'opacity-60 cursor-not-allowed'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {getWalletIcon(wallet)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {wallet.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <TypeIcon className="w-4 h-4" />
                            <span className="capitalize">{wallet.type}</span>
                            {wallet.available && (
                              <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-3 h-3" />
                                <span>Available</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {wallet.available ? (
                        <Button
                          onClick={() => handleWalletConnect(wallet.id)}
                          disabled={isConnecting}
                          className="min-w-[100px]"
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            'Connect'
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => window.open(getInstallUrl(wallet.id), '_blank')}
                          className="min-w-[100px]"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Install
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* No Wallets Found */}
      {availableWallets.length === 0 && (
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Wallets Detected
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Install a Hedera wallet to get started with blockchain verification
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.open('https://www.hashpack.app/download', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get HashPack
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://bladewallet.io/download', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get Blade Wallet
            </Button>
          </div>
        </Card>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Cancel
        </Button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <a
            href="https://hedera.com/wallets"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Learn about Hedera wallets →
          </a>
        </div>
      </div>
    </div>
  )
}

export default WalletSelector