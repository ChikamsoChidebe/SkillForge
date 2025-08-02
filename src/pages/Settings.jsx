import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Bell, Shield, Palette, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import { useTheme } from '@/contexts/ThemeContext'
import { useApp } from '@/contexts/AppContext'
import toast from 'react-hot-toast'

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const { isConnected } = useApp()
  const [settings, setSettings] = useState({
    notifications: {
      badgeUnlocked: true,
      weeklyDigest: false,
      newFeatures: true
    },
    privacy: {
      publicProfile: true,
      showActivity: true,
      showBadges: true
    },
    preferences: {
      language: 'en',
      dateFormat: 'MMM dd, yyyy',
      theme: theme
    }
  })

  const handleSave = () => {
    localStorage.setItem('devchain_settings', JSON.stringify(settings))
    toast.success('Settings saved successfully!')
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, theme: newTheme }
    }))
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
        </div>
        <Card className="text-center py-12 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Connect your wallet to access settings.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/profile">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your DevChain experience
          </p>
        </div>

        {/* Theme Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      theme === themeOption
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">
                      {themeOption}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {key === 'badgeUnlocked' && 'Get notified when you unlock new badges'}
                    {key === 'weeklyDigest' && 'Receive weekly learning progress summaries'}
                    {key === 'newFeatures' && 'Stay updated on new DevChain features'}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, [key]: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Privacy</h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {key === 'publicProfile' && 'Allow others to view your profile'}
                    {key === 'showActivity' && 'Display your learning activity heatmap'}
                    {key === 'showBadges' && 'Show your earned badges publicly'}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, [key]: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings