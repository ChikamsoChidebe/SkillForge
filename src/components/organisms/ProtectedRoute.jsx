import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'
import Button from '@/components/atoms/Button'
import LoadingSpinner from '@/components/organisms/LoadingSpinner'
import { ShieldCheckIcon, UserPlusIcon } from '@heroicons/react/24/outline'

const ProtectedRoute = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  if (isLoading) {
    return (
      <div className="min-h-[400px]">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    if (fallback) {
      return fallback
    }

    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <ShieldCheckIcon className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Authentication Required
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Please sign in to access your learning dashboard and start tracking your progress on the blockchain.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => {
              setAuthMode('login')
              setShowAuthModal(true)
            }}
            size="lg"
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAuthMode('register')
              setShowAuthModal(true)
            }}
            size="lg"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Create Account
          </Button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </div>
    )
  }

  return children
}

export default ProtectedRoute