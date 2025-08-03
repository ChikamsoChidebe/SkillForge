import { useQuery } from '@tanstack/react-query'
import { userService } from '@/api/userService'
import { useAuth } from '@/contexts/AuthContext'

export function useEntries() {
  const { user, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['entries', user?.id],
    queryFn: () => userService.getUserEntries(user.id),
    enabled: isAuthenticated && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}