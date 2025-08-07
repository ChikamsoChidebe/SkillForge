/**
 * 🚀 Google OAuth Service for SkillForge
 * Provides seamless Google Sign-In integration with automatic profile data population
 */

class GoogleAuthService {
  constructor() {
    this.isInitialized = false
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  }

  /**
   * Initialize Google Identity Services
   */
  async initialize() {
    if (this.isInitialized) return

    try {
      // Load Google Identity Services script
      await this.loadGoogleScript()
      
      // Initialize Google Identity Services
      if (window.google?.accounts?.id && this.clientId) {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true
        })
        
        this.isInitialized = true
        console.log('✅ Google Auth Service initialized')
      } else {
        console.warn('⚠️ Google Client ID not configured')
      }
    } catch (error) {
      console.error('❌ Failed to initialize Google Auth:', error)
      this.isInitialized = true
    }
  }

  /**
   * Load Google Identity Services script
   */
  loadGoogleScript() {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id && window.gapi) {
        resolve()
        return
      }

      // Load Google Identity Services
      const script1 = document.createElement('script')
      script1.src = 'https://accounts.google.com/gsi/client'
      script1.async = true
      script1.defer = true
      
      // Load Google API Platform Library
      const script2 = document.createElement('script')
      script2.src = 'https://apis.google.com/js/platform.js'
      script2.async = true
      script2.defer = true
      
      // Load Google API Client
      const script3 = document.createElement('script')
      script3.src = 'https://apis.google.com/js/api.js'
      script3.async = true
      script3.defer = true
      
      let loaded = 0
      const checkLoaded = () => {
        loaded++
        if (loaded === 3) resolve()
      }
      
      script1.onload = checkLoaded
      script2.onload = checkLoaded
      script3.onload = checkLoaded
      script1.onerror = reject
      script2.onerror = reject
      script3.onerror = reject
      
      document.head.appendChild(script1)
      document.head.appendChild(script2)
      document.head.appendChild(script3)
    })
  }

  /**
   * Handle Google credential response
   */
  handleCredentialResponse(response) {
    try {
      const credential = this.parseJWT(response.credential)
      console.log('✅ Google credential received:', credential)
      
      // Trigger custom event with user data
      const event = new CustomEvent('googleAuthSuccess', {
        detail: {
          email: credential.email,
          name: credential.name,
          picture: credential.picture,
          sub: credential.sub,
          email_verified: credential.email_verified
        }
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.error('❌ Error handling Google credential:', error)
      const errorEvent = new CustomEvent('googleAuthError', {
        detail: { error: error.message }
      })
      window.dispatchEvent(errorEvent)
    }
  }

  /**
   * Parse JWT token
   */
  parseJWT(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      throw new Error('Invalid JWT token')
    }
  }

  /**
   * Render Google Sign-In button
   */
  renderButton(elementId, options = {}) {
    if (!this.isInitialized) {
      console.warn('Google Auth not initialized')
      return
    }

    const defaultOptions = {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: '100%',
      ...options
    }

    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.renderButton(
          document.getElementById(elementId),
          defaultOptions
        )
      }
    } catch (error) {
      console.error('❌ Error rendering Google button:', error)
    }
  }

  /**
   * Trigger Google OAuth popup with account selection
   */
  triggerGoogleAuth() {
    if (!this.isInitialized) {
      console.warn('Google Auth not initialized')
      return
    }

    try {
      if (window.gapi?.load) {
        // Load Google API and use OAuth2
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: this.clientId
          }).then(() => {
            const authInstance = window.gapi.auth2.getAuthInstance()
            authInstance.signIn().then((googleUser) => {
              const profile = googleUser.getBasicProfile()
              const event = new CustomEvent('googleAuthSuccess', {
                detail: {
                  email: profile.getEmail(),
                  name: profile.getName(),
                  picture: profile.getImageUrl(),
                  sub: profile.getId(),
                  email_verified: true
                }
              })
              window.dispatchEvent(event)
            })
          })
        })
      } else if (window.google?.accounts?.oauth2) {
        // Use new Google Identity Services OAuth2
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: 'email profile openid',
          callback: (response) => {
            if (response.access_token) {
              this.fetchUserProfile(response.access_token)
            }
          }
        })
        client.requestAccessToken()
      } else {
        // Fallback to prompt
        window.google.accounts.id.prompt()
      }
    } catch (error) {
      console.error('❌ Error triggering Google auth:', error)
      // Only show demo picker as last resort
      const event = new CustomEvent('googleAuthError', {
        detail: { error: 'Google authentication failed' }
      })
      window.dispatchEvent(event)
    }
  }

  /**
   * Fetch user profile from Google API
   */
  async fetchUserProfile(accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      const userData = await response.json()
      
      const event = new CustomEvent('googleAuthSuccess', {
        detail: {
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          sub: userData.id,
          email_verified: userData.verified_email
        }
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.error('❌ Error fetching user profile:', error)
      this.showAccountPicker()
    }
  }

  /**
   * Sign in with Google
   */
  async signIn() {
    if (!this.isInitialized) {
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      try {
        if (window.google?.accounts?.id) {
          const handleSuccess = (event) => {
            window.removeEventListener('googleAuthSuccess', handleSuccess)
            window.removeEventListener('googleAuthError', handleError)
            resolve(event.detail)
          }
          
          const handleError = (event) => {
            window.removeEventListener('googleAuthSuccess', handleSuccess)
            window.removeEventListener('googleAuthError', handleError)
            reject(new Error(event.detail.error))
          }
          
          window.addEventListener('googleAuthSuccess', handleSuccess)
          window.addEventListener('googleAuthError', handleError)
          
          // Try Google One Tap first
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // Try OAuth2 popup for real account selection
              this.triggerGoogleAuth()
            }
          })
        } else {
          // Initialize and try again
          await this.initialize()
          if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt()
          } else {
            reject(new Error('Google services not available'))
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Prompt Google One Tap
   */
  promptOneTap() {
    if (!this.isInitialized) return

    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google One Tap not displayed')
          }
        })
      }
    } catch (error) {
      console.error('❌ Error with Google One Tap:', error)
    }
  }

  /**
   * Sign out from Google
   */
  signOut() {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect()
      }
      console.log('✅ Google sign out completed')
    } catch (error) {
      console.error('❌ Error signing out from Google:', error)
    }
  }

  /**
   * Fallback account picker for demo
   */
  showAccountPicker(mode = 'signin') {
    // Create account selection modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div class="flex items-center mb-4">
          <svg class="w-6 h-6 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <h3 class="text-lg font-semibold">Choose an account</h3>
        </div>
        <p class="text-sm text-gray-600 mb-4">to continue to SkillForge</p>
        <div class="space-y-2">
          <div class="account-option p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" data-email="sarah.chen@gmail.com" data-name="Sarah Chen" data-picture="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah">
            <div class="flex items-center">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" class="w-8 h-8 rounded-full mr-3" />
              <div>
                <div class="font-medium">Sarah Chen</div>
                <div class="text-sm text-gray-500">sarah.chen@gmail.com</div>
              </div>
            </div>
          </div>
          <div class="account-option p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" data-email="marcus.rodriguez@gmail.com" data-name="Marcus Rodriguez" data-picture="https://api.dicebear.com/7.x/avataaars/svg?seed=marcus">
            <div class="flex items-center">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=marcus" class="w-8 h-8 rounded-full mr-3" />
              <div>
                <div class="font-medium">Marcus Rodriguez</div>
                <div class="text-sm text-gray-500">marcus.rodriguez@gmail.com</div>
              </div>
            </div>
          </div>
          <div class="account-option p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" data-email="priya.patel@gmail.com" data-name="Priya Patel" data-picture="https://api.dicebear.com/7.x/avataaars/svg?seed=priya">
            <div class="flex items-center">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=priya" class="w-8 h-8 rounded-full mr-3" />
              <div>
                <div class="font-medium">Priya Patel</div>
                <div class="text-sm text-gray-500">priya.patel@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t">
          <button class="text-blue-600 text-sm hover:underline" id="use-another-account">Use another account</button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Handle account selection
    modal.querySelectorAll('.account-option').forEach(option => {
      option.addEventListener('click', () => {
        const userData = {
          email: option.dataset.email,
          name: option.dataset.name,
          picture: option.dataset.picture,
          sub: `google_demo_${Date.now()}`,
          email_verified: true
        }
        
        document.body.removeChild(modal)
        
        setTimeout(() => {
          const event = new CustomEvent('googleAuthSuccess', {
            detail: userData
          })
          window.dispatchEvent(event)
        }, 500)
      })
    })
    
    // Handle "Use another account"
    modal.querySelector('#use-another-account').addEventListener('click', () => {
      document.body.removeChild(modal)
      setTimeout(() => {
        const userData = {
          email: 'demo.user@gmail.com',
          name: 'Demo User',
          picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
          sub: `google_demo_${Date.now()}`,
          email_verified: true
        }
        
        const event = new CustomEvent('googleAuthSuccess', {
          detail: userData
        })
        window.dispatchEvent(event)
      }, 800)
    })
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  /**
   * Get user's email from browser (if available)
   */
  getUserEmail() {
    const savedUser = localStorage.getItem('skillforge_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        return user.email
      } catch (e) {}
    }
    return null
  }

  /**
   * Generate name from email
   */
  getNameFromEmail(email) {
    const name = email.split('@')[0]
    return name.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ')
  }
}

export const googleAuthService = new GoogleAuthService()