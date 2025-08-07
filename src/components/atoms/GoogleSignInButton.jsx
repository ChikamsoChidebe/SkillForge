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
  const [isInitialized, setIsInitialized] = useState(false)
  const buttonRef = useRef(null)
  const googleButtonId = `google-signin-${Math.random().toString(36).substr(2, 9)}`

  useEffect(() => {
    initializeGoogleAuth()
    
    // Listen for Google auth events
    const handleGoogleSuccess = (event) => {
      setIsLoading(false)
      if (onSuccess) {
        onSuccess(event.detail)
      }
    }

    const handleGoogleError = (event) => {
      setIsLoading(false)
      toast.error('Google sign-in failed. Please try again.')
      if (onError) {
        onError(event.detail.error)
      }
    }

    window.addEventListener('googleAuthSuccess', handleGoogleSuccess)
    window.addEventListener('googleAuthError', handleGoogleError)

    return () => {
      window.removeEventListener('googleAuthSuccess', handleGoogleSuccess)
      window.removeEventListener('googleAuthError', handleGoogleError)
    }
  }, [onSuccess, onError])

  const initializeGoogleAuth = async () => {
    try {
      await googleAuthService.initialize()
      setIsInitialized(true)
      
      // Render Google button after a short delay
      setTimeout(() => {
        if (buttonRef.current) {
          googleAuthService.renderButton(googleButtonId, {
            theme: 'outline',
            size: size,
            text: mode === 'signin' ? 'signin_with' : 'signup_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: buttonRef.current.offsetWidth
          })
        }
      }, 100)
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error)
      setIsInitialized(true) // Allow fallback
    }
  }

  const handleFallbackClick = () => {
    if (disabled || isLoading) return
    
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      toast.error('Google OAuth not configured. Please add VITE_GOOGLE_CLIENT_ID to .env')
      return
    }
    
    setIsLoading(true)
    toast.loading('Opening Google Sign-In...', { id: 'google-auth' })
    
    // Trigger Google One Tap or prompt
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          toast.error('Google Sign-In not available')
        }
        setIsLoading(false)
        toast.dismiss('google-auth')
      })
    } else {
      toast.error('Google services not loaded')
      setIsLoading(false)
      toast.dismiss('google-auth')
    }
  }

  const buttonText = mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'

  return (
    <div className={`relative ${className}`} ref={buttonRef}>
      {/* Google's official button (hidden initially) */}
      <div 
        id={googleButtonId}
        className={`transition-opacity duration-300 ${
          isInitialized && !isLoading ? 'opacity-100' : 'opacity-0 absolute inset-0'
        }`}
        style={{ 
          pointerEvents: disabled || isLoading ? 'none' : 'auto'
        }}
      />
      
      {/* Fallback/Loading button */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={handleFallbackClick}
        disabled={disabled || isLoading}
        className={`
          w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4
          bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 
          rounded-xl font-medium text-sm sm:text-base text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 shadow-sm hover:shadow-md
          min-h-[48px] touch-manipulation
          ${(!isInitialized || isLoading) ? 'opacity-100' : 'opacity-0 absolute inset-0'}
        `}
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

      {/* Demo Badge for Hackathon */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
          DEMO
        </div>
      )}
    </div>
  )
}

export default GoogleSignInButton