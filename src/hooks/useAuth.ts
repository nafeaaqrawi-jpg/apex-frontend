import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth'
import type { User } from '../types'

export const AUTH_QUERY_KEY = ['auth', 'me']

export function useAuth() {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.me,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  const isAuthenticated = !!user && !error

  const invalidateAuth = () => {
    queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
  }

  const clearAuth = () => {
    queryClient.setQueryData(AUTH_QUERY_KEY, null)
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY })
  }

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated,
    invalidateAuth,
    clearAuth,
  }
}
