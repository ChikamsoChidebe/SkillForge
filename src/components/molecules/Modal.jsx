import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from '@/components/atoms/Button'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-[99999] overflow-y-auto"
          onClick={onClose}
        >
          <div className="w-full min-h-full sm:min-h-0 flex items-start sm:items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] sm:max-h-[90vh] flex flex-col my-2 sm:my-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white pr-4">
                  {title}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal