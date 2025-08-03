import { createContext, useContext, useReducer, useEffect } from 'react'
import { hederaClient } from '@/api/hederaClient'

const AppContext = createContext()

const initialState = {
  user: null,
  isConnected: false,
  isLoading: false,
  entries: [],
  badges: [],
  modals: {
    newEntry: false,
    badgeDetails: false,
    walletConnect: false,
  },
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload, isConnected: !!action.payload }
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload }
    case 'ADD_ENTRY':
      return { ...state, entries: [action.payload, ...state.entries] }
    case 'SET_BADGES':
      return { ...state, badges: action.payload }
    case 'ADD_BADGE':
      return { ...state, badges: [...state.badges, action.payload] }
    case 'TOGGLE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.payload]: !state.modals[action.payload] }
      }
    case 'CLOSE_ALL_MODALS':
      return {
        ...state,
        modals: Object.keys(state.modals).reduce((acc, key) => ({ ...acc, [key]: false }), {})
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const connectWallet = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const user = await hederaClient.connectWallet()
      dispatch({ type: 'SET_USER', payload: user })
      localStorage.setItem('devchain_user', JSON.stringify(user))
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const disconnectWallet = () => {
    dispatch({ type: 'SET_USER', payload: null })
    localStorage.removeItem('devchain_user')
  }

  const toggleModal = (modalName) => {
    dispatch({ type: 'TOGGLE_MODAL', payload: modalName })
  }

  const closeAllModals = () => {
    dispatch({ type: 'CLOSE_ALL_MODALS' })
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('devchain_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: 'SET_USER', payload: user })
      } catch (error) {
        localStorage.removeItem('devchain_user')
      }
    }
  }, [])

  const addEntry = async (entryData) => {
    try {
      // Add to blockchain via Hedera
      const result = await hederaClient.addEntry(entryData)
      dispatch({ type: 'ADD_ENTRY', payload: { ...entryData, ...result } })
      return result
    } catch (error) {
      console.error('Failed to add entry to blockchain:', error)
      // Still add locally even if blockchain fails
      dispatch({ type: 'ADD_ENTRY', payload: entryData })
      throw error
    }
  }

  const value = {
    ...state,
    dispatch,
    connectWallet,
    disconnectWallet,
    addEntry,
    toggleModal,
    closeAllModals,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}