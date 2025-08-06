import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, Shield, CheckCircle, ArrowRight, ExternalLink, User } from 'lucide-react'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { toast } from 'react-hot-toast'

const WalletConnect = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { connectWallet, isLoading } = useApp()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualAccountId, setManualAccountId] = useState('')

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      const walletData = await connectWallet()
      updateUser({ 
        ...user, 
        walletConnected: true,
        hederaAccountId: walletData.accountId 
      })
      toast.success('Wallet connected successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Wallet connection failed:', error)
      toast.error('Wallet connection failed. Try manual input or demo mode.')
      setShowManualInput(true)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleManualConnect = () => {
    if (!manualAccountId.trim()) {
      toast.error('Please enter a valid Hedera Account ID')
      return
    }
    
    // Validate account ID format (0.0.xxxxx)
    const accountIdRegex = /^0\.0\.[0-9]+$/
    if (!accountIdRegex.test(manualAccountId.trim())) {
      toast.error('Invalid format. Use format: 0.0.12345')
      return
    }
    
    updateUser({ 
      ...user, 
      walletConnected: true,
      hederaAccountId: manualAccountId.trim(),
      connectionType: 'manual'
    })
    toast.success('Account connected successfully!')
    navigate('/dashboard')
  }

  const handleSkip = () => {
    updateUser({ ...user, walletConnected: false })
    toast.success('Continuing in demo mode')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Connect your Hedera wallet to record your learning milestones on the blockchain and earn verifiable NFT badges.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Blockchain verification of learning progress
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Secure and permanent record storage
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {!showManualInput ? (
              <>
                <Button
                  onClick={handleConnectWallet}
                  loading={isConnecting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 text-lg font-semibold"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Hedera Wallet
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowManualInput(true)}
                  className="w-full"
                >
                  <User className="w-5 h-5 mr-2" />
                  Enter Account ID Manually
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hedera Account ID
                  </label>
                  <input
                    type="text"
                    value={manualAccountId}
                    onChange={(e) => setManualAccountId(e.target.value)}
                    placeholder="0.0.12345"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter your Hedera testnet account ID (format: 0.0.xxxxx)
                  </p>
                </div>
                
                <Button
                  onClick={handleManualConnect}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 text-lg font-semibold"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Connect Account
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowManualInput(false)}
                  className="w-full"
                >
                  Back to Wallet Connect
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              onClick={handleSkip}
              className="w-full text-gray-600 dark:text-gray-400"
            >
              Continue in Demo Mode
            </Button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              <strong>Professional Tip:</strong> Manual account input is perfect for hackathon demos and judges who want to test instantly without wallet setup.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link 
              to="/dashboard" 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              Skip for now →
            </Link>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <a
            href="https://portal.hedera.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Don't have a Hedera wallet? Get one here
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default WalletConnect