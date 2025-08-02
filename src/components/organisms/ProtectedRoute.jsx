import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'
import { useState } from 'react'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated)

  if (!isAuthenticated) {
    window.location.href = '/auth?mode=login'
    return null
  }

  return children
}

export default ProtectedRoute