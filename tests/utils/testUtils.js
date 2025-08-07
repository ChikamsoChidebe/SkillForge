import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from '../../src/contexts/AuthContext'
import { AppContext } from '../../src/contexts/AppContext'

// Mock user data
export const mockUser = {
  id: 'test-user-id',
  fullName: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg'
}

// Mock auth context
export const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn()
}

// Mock app context
export const mockAppContext = {
  entries: [
    {
      id: 1,
      title: 'Test Entry 1',
      description: 'Test Description 1',
      category: 'tutorial',
      date: '2024-01-01'
    },
    {
      id: 2,
      title: 'Test Entry 2',
      description: 'Test Description 2',
      category: 'project',
      date: '2024-01-02'
    }
  ],
  badges: [
    {
      id: 1,
      name: 'First Steps',
      description: 'Recorded your first learning milestone',
      unlocked: true,
      rarity: 'common'
    }
  ],
  addEntry: vi.fn(),
  updateEntry: vi.fn(),
  deleteEntry: vi.fn()
}

// Custom render function with providers
export const renderWithProviders = (
  ui,
  {
    authContext = mockAuthContext,
    appContext = mockAppContext,
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthContext.Provider value={authContext}>
        <AppContext.Provider value={appContext}>
          {children}
        </AppContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock Hedera responses
export const mockHederaResponses = {
  createTopic: {
    success: true,
    topicId: '0.0.123456',
    transactionId: '0.0.123456@1234567890.123456789'
  },
  submitMessage: {
    success: true,
    transactionId: '0.0.123456@1234567890.123456789',
    status: 'SUCCESS'
  },
  createNFTToken: {
    success: true,
    tokenId: '0.0.789012',
    transactionId: '0.0.789012@1234567890.123456789'
  },
  mintNFT: {
    success: true,
    serialNumber: 1,
    transactionId: '0.0.789012@1234567890.123456789'
  }
}

// Mock Supabase responses
export const mockSupabaseResponses = {
  getUserEntries: [
    {
      id: 1,
      title: 'React Basics',
      description: 'Learned React fundamentals',
      category: 'tutorial',
      date: '2024-01-01',
      user_id: 'test-user-id'
    }
  ],
  getUserProfile: {
    id: 'test-user-id',
    fullName: 'Test User',
    email: 'test@example.com',
    totalEntries: 1,
    totalBadges: 1
  }
}

// Test data generators
export const generateMockEntry = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  title: 'Mock Entry',
  description: 'Mock Description',
  category: 'tutorial',
  date: new Date().toISOString(),
  user_id: 'test-user-id',
  ...overrides
})

export const generateMockBadge = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  name: 'Mock Badge',
  description: 'Mock Badge Description',
  rarity: 'common',
  unlocked: false,
  milestone: 1,
  ...overrides
})

// Async test helpers
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0))

export const mockAsyncOperation = (result, delay = 100) => 
  new Promise(resolve => setTimeout(() => resolve(result), delay))

// Form test helpers
export const fillForm = (form, data) => {
  Object.entries(data).forEach(([field, value]) => {
    const input = form.querySelector(`[name="${field}"]`)
    if (input) {
      fireEvent.change(input, { target: { value } })
    }
  })
}

export const submitForm = (form) => {
  fireEvent.submit(form)
}

// Local storage mocks
export const mockLocalStorage = () => {
  const store = {}
  
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    })
  }
}

// Network request mocks
export const mockFetch = (responses) => {
  global.fetch = vi.fn((url) => {
    const response = responses[url] || { ok: false, status: 404 }
    return Promise.resolve({
      ok: response.ok !== false,
      status: response.status || 200,
      json: () => Promise.resolve(response.data || response)
    })
  })
}

// Error boundary test helper
export const ErrorBoundary = ({ children }) => {
  try {
    return children
  } catch (error) {
    return <div data-testid="error-boundary">Something went wrong</div>
  }
}

// Performance testing helpers
export const measureRenderTime = (renderFn) => {
  const start = performance.now()
  const result = renderFn()
  const end = performance.now()
  
  return {
    result,
    renderTime: end - start
  }
}

// Accessibility testing helpers
export const checkAccessibility = async (container) => {
  const { axe } = await import('axe-core')
  const results = await axe.run(container)
  return results.violations
}