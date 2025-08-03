import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

const BlockchainStatus = ({ txHash, status, error }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (txHash && !txHash.startsWith('local_')) {
      // Auto-hide after 10 seconds for successful blockchain transactions
      const timer = setTimeout(() => setIsVisible(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [txHash])

  if (!isVisible || !txHash) return null

  const isBlockchain = !txHash.startsWith('local_')
  const isSuccess = status === 'SUCCESS' || status === 'LOCAL_SUCCESS'
  const isFallback = status === 'LOCAL_FALLBACK' || status === 'ERROR_FALLBACK'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg border ${
        isBlockchain && isSuccess
          ? 'bg-green-50 border-green-200 text-green-800'
          : isFallback
          ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {isBlockchain && isSuccess ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {isBlockchain && isSuccess
              ? '🎉 Recorded on Hedera Blockchain!'
              : isFallback
              ? '⚠️ Saved Locally (Blockchain Unavailable)'
              : '❌ Recording Failed'
            }
          </p>
          
          <p className="text-xs mt-1 opacity-75">
            {isBlockchain && isSuccess
              ? 'Your learning milestone is permanently verified'
              : isFallback
              ? 'Entry saved locally, will sync when blockchain is available'
              : error || 'Please try again later'
            }
          </p>
          
          {isBlockchain && isSuccess && (
            <a
              href={`https://hashscan.io/testnet/transaction/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-green-700 hover:text-green-900 mt-2"
            >
              View on HashScan
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </motion.div>
  )
}

export default BlockchainStatus