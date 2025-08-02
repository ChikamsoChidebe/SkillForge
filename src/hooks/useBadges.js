import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hederaClient } from '@/api/hederaClient'
import { useApp } from '@/contexts/AppContext'
import toast from 'react-hot-toast'

export function useBadges() {
  const { isConnected } = useApp()

  return useQuery({
    queryKey: ['badges'],
    queryFn: () => hederaClient.getBadges(),
    enabled: isConnected,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useMintBadge() {
  const queryClient = useQueryClient()
  const { dispatch } = useApp()

  return useMutation({
    mutationFn: ({ milestone, metadata }) => 
      hederaClient.mintBadge(milestone, metadata),
    onSuccess: (data) => {
      // Update badges cache
      queryClient.setQueryData(['badges'], (old) => {
        if (!old) return []
        return old.map(badge => 
          badge.milestone === data.milestone 
            ? { ...badge, unlocked: true, unlockedAt: new Date().toISOString() }
            : badge
        )
      })

      dispatch({ type: 'ADD_BADGE', payload: data })
      toast.success(`🎉 Badge unlocked: ${data.metadata?.name || 'Achievement'}!`)
    },
    onError: (error) => {
      toast.error(`Failed to mint badge: ${error.message}`)
    },
  })
}

export function useCheckBadgeEligibility() {
  const { data: entries } = useQuery({ queryKey: ['entries'] })
  const { data: badges } = useQuery({ queryKey: ['badges'] })

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