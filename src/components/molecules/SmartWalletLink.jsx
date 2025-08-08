import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const SmartWalletLink = ({ children, className, onClick }) => {
  const { user } = useAuth()
  
  // Authenticated users go to wallet dashboard, unauthenticated to wallet connect
  const targetRoute = user ? '/wallet-dashboard' : '/wallet-connect'
  
  return (
    <Link 
      to={targetRoute} 
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

export default SmartWalletLink