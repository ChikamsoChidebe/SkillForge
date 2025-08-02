import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Lock, 
  Unlock, 
  Star, 
  Filter,
  Search,
  Award,
  Target,
  Zap,
  Crown,
  Gift,
  Calendar,
  ExternalLink,
  Share2,
  Download
} from 'lucide-react'
import { format } from 'date-fns'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import BadgeTile from '@/components/molecules/BadgeTile'
import Modal from '@/components/molecules/Modal'
import { useBadges, useMintBadge, useCheckBadgeEligibility } from '@/hooks/useBadges'
import { useEntries } from '@/hooks/useEntries'
import { useApp } from '@/contexts/AppContext'
import toast from 'react-hot-toast'

const BadgeGallery = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'unlocked', 'locked'
  const [filterRarity, setFilterRarity] = useState('all')
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [claimableBadge, setClaimableBadge] = useState(null)

  const { isConnected } = useApp()
  const { data: badges = [], isLoading: badgesLoading } = useBadges()
  const { data: entries = [] } = useEntries()
  const { eligibleBadges, entryCount } = useCheckBadgeEligibility()
  const mintBadgeMutation = useMintBadge()

  // Filter badges
  const filteredBadges = useMemo(() => {
    let filtered = badges

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(badge =>
        badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(badge => 
        filterStatus === 'unlocked' ? badge.unlocked : !badge.unlocked
      )
    }

    // Rarity filter
    if (filterRarity !== 'all') {
      filtered = filtered.filter(badge => badge.rarity === filterRarity)
    }

    return filtered
  }, [badges, searchTerm, filterStatus, filterRarity])

  // Calculate statistics
  const stats = useMemo(() => {
    const unlockedBadges = badges.filter(badge => badge.unlocked)
    const totalBadges = badges.length
    const completionRate = totalBadges > 0 ? Math.round((unlockedBadges.length / totalBadges) * 100) : 0
    
    const rarityStats = badges.reduce((acc, badge) => {
      acc[badge.rarity] = (acc[badge.rarity] || 0) + (badge.unlocked ? 1 : 0)
      return acc
    }, {})

    return {
      unlocked: unlockedBadges.length,
      total: totalBadges,
      completionRate,
      eligible: eligibleBadges.length,
      rarityStats
    }
  }, [badges, eligibleBadges])

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge)
    setShowBadgeModal(true)
  }

  const handleClaimBadge = (badge) => {
    setClaimableBadge(badge)
    setShowClaimModal(true)
  }

  const confirmClaimBadge = async () => {
    if (!claimableBadge) return

    try {
      await mintBadgeMutation.mutateAsync({
        milestone: claimableBadge.milestone,
        metadata: {
          name: claimableBadge.name,
          description: claimableBadge.description,
          rarity: claimableBadge.rarity,
          icon: claimableBadge.icon
        }
      })
      
      setShowClaimModal(false)
      setClaimableBadge(null)
      toast.success(`🎉 ${claimableBadge.name} badge claimed!`)
    } catch (error) {
      toast.error(`Failed to claim badge: ${error.message}`)
    }
  }

  const handleShareBadge = (badge) => {
    if (navigator.share) {
      navigator.share({
        title: `I earned the ${badge.name} badge on DevChain!`,
        text: badge.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(
        `I earned the ${badge.name} badge on DevChain! ${badge.description} - ${window.location.href}`
      )
      toast.success('Badge details copied to clipboard!')
    }
  }

  const rarityColors = {
    common: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300' },
    uncommon: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300', border: 'border-green-300' },
    rare: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300' },
    legendary: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-300' }
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="text-center max-w-md">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Connect your wallet to view and claim your learning badges.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Badge Gallery
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Showcase your learning achievements with verifiable NFT badges earned through your development journey.
          </p>
        </motion.div>

        {/* Progress Ring */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative w-32 h-32 mx-auto mb-8"
        >
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 50 * (1 - stats.completionRate / 100)
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.completionRate}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Complete
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Badges Earned',
            value: `${stats.unlocked}/${stats.total}`,
            icon: Trophy,
            color: 'blue'
          },
          {
            label: 'Ready to Claim',
            value: stats.eligible,
            icon: Gift,
            color: 'green'
          },
          {
            label: 'Learning Entries',
            value: entryCount,
            icon: Target,
            color: 'purple'
          },
          {
            label: 'Completion Rate',
            value: `${stats.completionRate}%`,
            icon: Star,
            color: 'yellow'
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Eligible Badges Alert */}
      {eligibleBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  🎉 Congratulations! You have {eligibleBadges.length} badge{eligibleBadges.length > 1 ? 's' : ''} ready to claim!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You've reached new milestones. Claim your badges to add them to your collection.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {eligibleBadges.map(badge => (
              <Button
                key={badge.id}
                size="sm"
                onClick={() => handleClaimBadge(badge)}
                loading={mintBadgeMutation.isLoading}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Claim {badge.name}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Badges</option>
              <option value="unlocked">Unlocked</option>
              <option value="locked">Locked</option>
            </select>

            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Badges Grid */}
      {badgesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            </Card>
          ))}
        </div>
      ) : filteredBadges.length === 0 ? (
        <Card className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Badges Found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {badges.length === 0 
              ? 'Start learning to unlock your first badges!'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBadges.map((badge, index) => (
            <BadgeTile
              key={badge.id}
              badge={badge}
              index={index}
              onClick={() => handleBadgeClick(badge)}
            />
          ))}
        </div>
      )}

      {/* Badge Detail Modal */}
      <Modal
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        title="Badge Details"
        size="md"
      >
        {selectedBadge && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className={`text-6xl mb-4 ${selectedBadge.unlocked ? '' : 'grayscale'}`}>
                {selectedBadge.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {selectedBadge.name}
              </h2>
              <Badge variant={selectedBadge.rarity} size="lg">
                {selectedBadge.rarity.charAt(0).toUpperCase() + selectedBadge.rarity.slice(1)}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300">{selectedBadge.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Requirements</h3>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Complete {selectedBadge.milestone} learning entries
                  </span>
                </div>
              </div>

              {selectedBadge.unlocked && selectedBadge.unlockedAt && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Unlocked</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {format(new Date(selectedBadge.unlockedAt), 'MMMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  {selectedBadge.unlocked ? (
                    <>
                      <Button
                        variant="primary"
                        onClick={() => handleShareBadge(selectedBadge)}
                        className="flex-1"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Badge
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open('#', '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Chain
                      </Button>
                    </>
                  ) : (
                    <div className="flex-1 text-center py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Lock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {entryCount}/{selectedBadge.milestone} entries completed
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Claim Badge Modal */}
      <Modal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="Claim Badge"
        size="md"
      >
        {claimableBadge && (
          <div className="p-6">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                {claimableBadge.icon}
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {claimableBadge.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {claimableBadge.description}
              </p>
              <Badge variant={claimableBadge.rarity} size="lg">
                {claimableBadge.rarity.charAt(0).toUpperCase() + claimableBadge.rarity.slice(1)}
              </Badge>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    NFT Badge Minting
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This will mint a unique NFT badge on the Hedera network as permanent proof of your achievement. 
                    The badge will be associated with your wallet and can be verified by anyone.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowClaimModal(false)}
                className="flex-1"
                disabled={mintBadgeMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmClaimBadge}
                loading={mintBadgeMutation.isLoading}
                className="flex-1"
              >
                <Award className="w-4 h-4 mr-2" />
                Claim Badge
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default BadgeGallery