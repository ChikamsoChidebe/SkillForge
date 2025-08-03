// Analytics and tracking utilities
export const analytics = {
  // Track user events
  track(event, properties = {}) {
    if (typeof window !== 'undefined') {
      console.log('Analytics:', event, properties)
      // In production, integrate with Google Analytics, Mixpanel, etc.
    }
  },

  // Track page views
  pageView(path) {
    this.track('page_view', { path })
  },

  // Track user actions
  trackUserAction(action, details = {}) {
    this.track('user_action', { action, ...details })
  },

  // Track learning milestones
  trackLearningMilestone(milestone, data = {}) {
    this.track('learning_milestone', { milestone, ...data })
  },

  // Track badge unlocks
  trackBadgeUnlock(badgeId, badgeName) {
    this.track('badge_unlock', { badgeId, badgeName })
  }
}

// Performance monitoring
export const performance = {
  // Measure page load time
  measurePageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
      analytics.track('page_load_time', { loadTime })
    }
  },

  // Measure API response times
  measureApiCall(endpoint, startTime) {
    const endTime = Date.now()
    const duration = endTime - startTime
    analytics.track('api_call', { endpoint, duration })
  }
}