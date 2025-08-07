/**
 * 🚀 Google Sign-In Button Component
 * Professional Google OAuth integration with modern design
 */

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Chrome, Loader2 } from 'lucide-react'
import { googleAuthService } from '@/api/googleAuthService'
import { toast } from 'react-hot-toast'

const GoogleSignInButton = ({ 
  mode = 'signin', 
  onSuccess, 
  onError, 
  className = '',
  disabled = false,
  size = 'large'
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    // Initialize Google Auth in background
    googleAuthService.initialize().catch(console.error)
  }, [])

  const handleGoogleClick = async () => {
    if (disabled || isLoading) return
    
    setIsLoading(true)
    
    try {
      const result = await googleAuthService.signIn()
      if (result && onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      console.error('Google sign-in failed:', error)
      toast.error('Google sign-in failed. Please try again.')
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }



  const buttonText = mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'

  return (
    <div className={`relative ${className}`} ref={buttonRef}>
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={handleGoogleClick}
        disabled={disabled || isLoading}
        className="w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium text-sm sm:text-base text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md min-h-[48px] touch-manipulation"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Chrome className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
            <span className="truncate">{buttonText}</span>
          </>
        )}
      </motion.button>
    </div>
  )
}

export default GoogleSignInButton