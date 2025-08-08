import { useState, useEffect, useCallback } from 'react'
import { walletService } from '@/services/walletService'
import toast from 'react-hot-toast'

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [accountId, setAccountId] = useState(null)
  const [walletId, setWalletId] = useState(null)
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize wallet state
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = useCallback(async () => {
    try {
      const status = walletService.getConnectionStatus()
      console.log('🔍 useWallet checkConnection - status:', status)
      
      if (status.connected) {
        console.log('🔍 Setting wallet as connected:', status.accountId)
        setIsConnected(true)
        setAccountId(status.accountId)
        setWalletId(status.walletId)
        
        // Restore connection state in walletService
        await walletService.restoreConnection()
        
        // Load balance
        try {
          const balanceData = await walletService.getAccountBalance()
          setBalance(balanceData)
        } catch (balanceError) {
          console.log('Balance loading failed')
          setBalance({ hbar: '0.0', tokens: {} })
        }
      } else {
        console.log('🔍 No wallet connection found')
        setIsConnected(false)
        setAccountId(null)
        setWalletId(null)
        setBalance(null)
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error)
      setError(error.message)
    }
  }, [])

  const connect = useCallback(async (selectedWalletId) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await walletService.connectWallet(selectedWalletId)
      
      if (result.success) {
        setIsConnected(true)
        setAccountId(result.accountId)
        setWalletId(result.walletId)
        
        toast.success(`Connected to ${selectedWalletId} successfully!`)
        
        // Load balance after connection
        await loadBalance()
        
        return result
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setError(error.message)
      toast.error(`Failed to connect: ${error.message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      setLoading(true)
      
      const result = await walletService.disconnectWallet()
      
      if (result.success) {
        setIsConnected(false)
        setAccountId(null)
        setWalletId(null)
        setBalance(null)
        setError(null)
        
        toast.success('Wallet disconnected successfully')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setError(error.message)
      toast.error(`Failed to disconnect: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadBalance = useCallback(async () => {
    if (!isConnected) return
    
    try {
      const balanceData = await walletService.getAccountBalance()
      setBalance(balanceData)
    } catch (error) {
      console.error('Failed to load balance:', error)
      // Set mock balance for demo
      setBalance({ hbar: '100.0', tokens: {} })
    }
  }, [isConnected])

  const submitLearningEntry = useCallback(async (entryData) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }
    
    try {
      setLoading(true)
      
      const result = await walletService.submitLearningEntry({
        ...entryData,
        accountId
      })
      
      toast.success('Learning entry recorded on blockchain!')
      return result
      
    } catch (error) {
      setError(error.message)
      toast.error(`Failed to record entry: ${error.message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, accountId])

  const mintBadge = useCallback(async (badgeData) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }
    
    try {
      setLoading(true)
      
      const result = await walletService.mintBadge({
        ...badgeData,
        accountId
      })
      
      toast.success('NFT badge minted successfully!')
      return result
      
    } catch (error) {
      setError(error.message)
      toast.error(`Failed to mint badge: ${error.message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, accountId])

  const transferHbar = useCallback(async (toAccountId, amount) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }
    
    try {
      setLoading(true)
      
      const result = await walletService.transferHbar(toAccountId, amount)
      
      toast.success(`Transferred ${amount} HBAR successfully!`)
      
      // Reload balance after transfer
      await loadBalance()
      
      return result
      
    } catch (error) {
      setError(error.message)
      toast.error(`Transfer failed: ${error.message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, loadBalance])

  const getAvailableWallets = useCallback(async () => {
    try {
      return await walletService.getAvailableWallets()
    } catch (error) {
      console.error('Failed to get available wallets:', error)
      return []
    }
  }, [])

  // Auto-refresh balance every 30 seconds when connected
  useEffect(() => {
    if (!isConnected) return
    
    const interval = setInterval(() => {
      loadBalance()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [isConnected, loadBalance])

  return {
    // State
    isConnected,
    accountId,
    walletId,
    balance,
    loading,
    error,
    
    // Actions
    connect,
    disconnect,
    loadBalance,
    submitLearningEntry,
    mintBadge,
    transferHbar,
    getAvailableWallets,
    checkConnection,
    
    // Computed values
    connectionStatus: {
      connected: isConnected,
      accountId,
      walletId,
      balance
    }
  }
}

export default useWallet