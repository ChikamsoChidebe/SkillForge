import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Database, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Trash2,
  Info
} from 'lucide-react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import { supabase } from '@/api/supabaseClient'
import { resetDemoData, clearDemoData } from '@/utils/demoData'
import toast from 'react-hot-toast'

const SystemStatus = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    supabase: null,
    groq: null,
    hedera: null,
    localStorage: null
  })

  const checkSystemStatus = async () => {
    setLoading(true)
    const status = { ...systemStatus }

    // Check Supabase connection
    try {
      if (supabase) {
        const { data, error } = await supabase.from('users').select('id').limit(1)
        status.supabase = !error
      } else {
        status.supabase = false
      }
    } catch (error) {
      status.supabase = false
    }

    // Check Groq API
    status.groq = !!import.meta.env.VITE_GROQ_API_KEY

    // Check Hedera configuration
    status.hedera = !!(import.meta.env.VITE_HEDERA_ACCOUNT_ID && import.meta.env.VITE_HEDERA_PRIVATE_KEY)

    // Check localStorage
    try {
      localStorage.setItem('test', 'test')
      localStorage.removeItem('test')
      status.localStorage = true
    } catch (error) {
      status.localStorage = false
    }

    setSystemStatus(status)
    setLoading(false)
  }

  const handleResetDemoData = () => {
    try {
      resetDemoData()
      toast.success('Demo data reset successfully!')
    } catch (error) {
      toast.error('Failed to reset demo data')
    }
  }

  const handleClearDemoData = () => {
    try {
      clearDemoData()
      toast.success('Demo data cleared successfully!')
    } catch (error) {
      toast.error('Failed to clear demo data')
    }
  }

  const StatusIndicator = ({ status, label }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center space-x-2">
        {status === null ? (
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
        ) : status ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-xs font-medium ${
          status === null ? 'text-gray-500' :
          status ? 'text-green-600' : 'text-red-600'
        }`}>
          {status === null ? 'Checking...' : status ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                System Status
              </h2>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>

          {/* System Status */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Service Status
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={checkSystemStatus}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Check</span>
              </Button>
            </div>

            <div className="space-y-2">
              <StatusIndicator status={systemStatus.localStorage} label="Local Storage" />
              <StatusIndicator status={systemStatus.supabase} label="Supabase Database" />
              <StatusIndicator status={systemStatus.groq} label="Groq AI" />
              <StatusIndicator status={systemStatus.hedera} label="Hedera Blockchain" />
            </div>
          </div>

          {/* Demo Data Management */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Demo Data Management
            </h3>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">Demo Mode Active</p>
                  <p>The platform is running with sample data stored locally. This provides a full experience without requiring backend setup.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleResetDemoData}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Demo Data</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleClearDemoData}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </Button>
            </div>
          </div>

          {/* Platform Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Platform Information
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Version</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Mode</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {systemStatus.supabase ? 'Production' : 'Demo'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Storage</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {systemStatus.supabase ? 'Cloud + Local' : 'Local Only'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SystemStatus