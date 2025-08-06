import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from '@/contexts/AppContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { emailScheduler } from '@/utils/emailScheduler'
import { initializeDemoData } from '@/utils/demoData'
import Navbar from '@/components/organisms/Navbar'
import Sidebar from '@/components/organisms/Sidebar'
import Footer from '@/components/organisms/Footer'
import ProtectedRoute from '@/components/organisms/ProtectedRoute'
import ErrorBoundary from '@/components/organisms/ErrorBoundary'
import OfflineIndicator from '@/components/organisms/OfflineIndicator'
import UpdateNotification from '@/components/organisms/UpdateNotification'
import PageLoader from '@/components/organisms/PageLoader'
import Dashboard from '@/pages/Dashboard'
import LogEntry from '@/pages/LogEntry'
import BadgeGallery from '@/pages/BadgeGallery'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import TermsOfService from '@/pages/TermsOfService'
import Landing from '@/pages/Landing'
import Auth from '@/pages/Auth'
import WalletConnect from '@/pages/WalletConnect'
import AICoach from '@/pages/AICoach'
import Courses from '@/pages/Courses'
import CourseDetail from '@/pages/CourseDetail'
import LessonView from '@/pages/LessonView'
import Workshops from '@/pages/Workshops'
import Community from '@/pages/Community'
import Leaderboard from '@/pages/Leaderboard'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'
import ChatWidget from '@/components/organisms/ChatWidget'
import BadgeNotificationManager from '@/components/organisms/BadgeNotificationManager'
import MobileBottomNav from '@/components/organisms/MobileBottomNav'
import ScrollToTop from '@/components/organisms/ScrollToTop'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function AppContent() {
  const location = useLocation()
  const useSidebar = false // Set to true to use sidebar navigation
  
  return (
    <PageLoader>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors duration-300 flex">
        {useSidebar && location.pathname !== '/auth' && location.pathname !== '/wallet-connect' && <Sidebar />}
        
        <div className={`flex-1 flex flex-col ${useSidebar ? 'ml-0' : ''}`}>
          {!useSidebar && location.pathname !== '/auth' && location.pathname !== '/wallet-connect' && <Navbar />}
          
          <main className={`flex-1 ${useSidebar ? 'p-6' : ''} pb-20 md:pb-0`}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/wallet-connect" element={<WalletConnect />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/log-entry" element={<ProtectedRoute><LogEntry /></ProtectedRoute>} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/courses/:courseId/module/:moduleId/lesson/:lessonId" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/community" element={<Community />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/badge-gallery" element={<ProtectedRoute><BadgeGallery /></ProtectedRoute>} />
            <Route path="/badges" element={<ProtectedRoute><BadgeGallery /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/ai-coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </main>
          
          {!useSidebar && <Footer />}
        </div>
        
        <MobileBottomNav />
        <ChatWidget />
        <BadgeNotificationManager />
        <OfflineIndicator />
        <UpdateNotification />
        <Toaster
          position={useSidebar ? "top-center" : "top-right"}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </div>
    </PageLoader>
  )
}

function App() {
  React.useEffect(() => {
    emailScheduler.init()
    initializeDemoData() // Initialize demo data for better user experience
  }, [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>
              <Router>
                <ScrollToTop />
                <AppContent />
              </Router>
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App