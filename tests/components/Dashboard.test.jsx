import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Dashboard from '../../src/pages/Dashboard'
import { AuthContext } from '../../src/contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'

// Mock Hedera client
vi.mock('../../src/api/supabaseClient', () => ({
  supabaseService: {
    getUserEntries: vi.fn().mockResolvedValue([
      {
        id: 1,
        title: 'Test Entry',
        description: 'Test Description',
        category: 'tutorial',
        date: '2024-01-01'
      }
    ]),
    getUserProfile: vi.fn().mockResolvedValue({
      totalEntries: 1,
      totalBadges: 1
    })
  }
}))

const mockUser = {
  id: 'test-user-id',
  fullName: 'Test User',
  email: 'test@example.com'
}

const renderWithAuth = (component) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true }}>
        {component}
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders dashboard header correctly', async () => {
    renderWithAuth(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Learning Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Track your progress and celebrate your achievements')).toBeInTheDocument()
    })
  })

  test('displays user statistics', async () => {
    renderWithAuth(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Total Entries')).toBeInTheDocument()
      expect(screen.getByText('Badges Earned')).toBeInTheDocument()
      expect(screen.getByText('Current Streak')).toBeInTheDocument()
    })
  })

  test('opens new entry modal when button clicked', async () => {
    renderWithAuth(<Dashboard />)
    
    await waitFor(() => {
      const newEntryButton = screen.getByText('New Entry')
      fireEvent.click(newEntryButton)
      expect(screen.getByText('Record Learning Milestone')).toBeInTheDocument()
    })
  })

  test('filters entries by search term', async () => {
    renderWithAuth(<Dashboard />)
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search entries...')
      fireEvent.change(searchInput, { target: { value: 'Test' } })
      expect(searchInput.value).toBe('Test')
    })
  })

  test('toggles filters visibility', async () => {
    renderWithAuth(<Dashboard />)
    
    await waitFor(() => {
      const filtersButton = screen.getByText('Filters')
      fireEvent.click(filtersButton)
      expect(screen.getByText('Category')).toBeInTheDocument()
    })
  })

  test('displays empty state when no entries', async () => {
    vi.mocked(require('../../src/api/supabaseClient').supabaseService.getUserEntries)
      .mockResolvedValueOnce([])
    
    renderWithAuth(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('No Entries Yet')).toBeInTheDocument()
      expect(screen.getByText('Add Your First Entry')).toBeInTheDocument()
    })
  })

  test('calculates streak correctly', async () => {
    const entriesWithStreak = [
      { id: 1, date: new Date().toISOString(), title: 'Today' },
      { id: 2, date: new Date(Date.now() - 86400000).toISOString(), title: 'Yesterday' }
    ]
    
    vi.mocked(require('../../src/api/supabaseClient').supabaseService.getUserEntries)
      .mockResolvedValueOnce(entriesWithStreak)
    
    renderWithAuth(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('2 days')).toBeInTheDocument()
    })
  })

  test('handles loading state', () => {
    renderWithAuth(<Dashboard />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('handles error state', async () => {
    vi.mocked(require('../../src/api/supabaseClient').supabaseService.getUserEntries)
      .mockRejectedValueOnce(new Error('Failed to load'))
    
    renderWithAuth(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to Load Entries')).toBeInTheDocument()
    })
  })
})