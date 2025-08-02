import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hederaClient } from '@/api/hederaClient'
import { useApp } from '@/contexts/AppContext'
import toast from 'react-hot-toast'

export function useEntries() {
  const { isConnected } = useApp()

  return useQuery({
    queryKey: ['entries'],
    queryFn: () => hederaClient.getEntries(),
    enabled: isConnected,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useRecordEntry() {
  const queryClient = useQueryClient()
  const { dispatch } = useApp()

  return useMutation({
    mutationFn: (entryData) => hederaClient.recordEntry(entryData),
    onMutate: async (newEntry) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['entries'] })

      // Snapshot previous value
      const previousEntries = queryClient.getQueryData(['entries'])

      // Optimistically update
      const optimisticEntry = {
        id: Date.now().toString(),
        ...newEntry,
        txHash: 'pending...',
        timestamp: Date.now()
      }

      queryClient.setQueryData(['entries'], (old) => 
        old ? [optimisticEntry, ...old] : [optimisticEntry]
      )

      return { previousEntries }
    },
    onSuccess: (data) => {
      // Update the optimistic entry with real data
      queryClient.setQueryData(['entries'], (old) => {
        if (!old) return [data.entry]
        return old.map((entry, index) => 
          index === 0 ? { ...entry, ...data.entry, txHash: data.txHash } : entry
        )
      })

      dispatch({ type: 'ADD_ENTRY', payload: data.entry })
      toast.success('Learning milestone recorded on Hedera!')
    },
    onError: (error, newEntry, context) => {
      // Rollback optimistic update
      queryClient.setQueryData(['entries'], context.previousEntries)
      toast.error(`Failed to record entry: ${error.message}`)
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}