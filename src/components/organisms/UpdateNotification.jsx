import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, X } from 'lucide-react'
import Button from '@/components/atoms/Button'

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
        
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowUpdate(true)
            }
          })
        })
      })
    }
  }, [])

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Update Available
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                A new version of DevChain is ready to install.
              </p>
            </div>
            <button
              onClick={() => setShowUpdate(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleUpdate}>
              <RefreshCw className="w-3 h-3 mr-1" />
              Update
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowUpdate(false)}
            >
              Later
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default UpdateNotification