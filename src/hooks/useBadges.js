import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hederaClient } from '@/api/hederaClient'
import { userService } from '@/api/userService'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

export function useBadges() {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['badges', user?.id],
    queryFn: () => userService.getUserBadges(user.id),
    enabled: isAuthenticated && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useMintBadge() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ milestone, metadata }) => {
      try {
        // Mint NFT badge on Hedera
        const result = await hederaClient.mintBadge(milestone, metadata)
        
        // Update local storage to mark badge as claimed
        const badgeKey = `badge_${user.id}_${milestone}`
        localStorage.setItem(badgeKey, JSON.stringify({
          claimed: true,
          claimedAt: new Date().toISOString(),
          transactionId: result.transactionId
        }))
        
        return { ...result, milestone, metadata }
      } catch (error) {
        console.error('Failed to mint badge:', error)
        throw error
      }
    },
    onSuccess: (data) => {
      // Invalidate badges cache to refetch
      queryClient.invalidateQueries(['badges', user?.id])
      toast.success(`🎉 Badge claimed: ${data.metadata?.name || 'Achievement'}!`)
    },
    onError: (error) => {
      toast.error(`Failed to claim badge: ${error.message}`)
    },
  })
}

export function useCheckBadgeEligibility() {
  const { user } = useAuth()
  const { data: entries } = useQuery({ 
    queryKey: ['entries', user?.id],
    queryFn: () => userService.getUserEntries(user.id),
    enabled: !!user?.id
  })
  const { data: badges } = useBadges()

  const checkEligibility = () => {
    if (!entries || !badges) return []

    const entryCount = entries.length
    const eligibleBadges = badges.filter(badge => 
      !badge.unlocked && entryCount >= badge.milestone
    )

    return eligibleBadges
  }

  return {
    eligibleBadges: checkEligibility(),
    entryCount: entries?.length || 0
  }
}