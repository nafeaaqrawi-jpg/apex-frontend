import apiClient from './axios'
import type { DiscoverProfile } from '../types'

export const searchApi = {
  search: async (query: string): Promise<DiscoverProfile[]> => {
    const { data } = await apiClient.get<{ results: DiscoverProfile[] }>('/api/search', {
      params: { q: query },
    })
    // Backend returns { results: [...], total, filters } — extract the array
    return Array.isArray(data) ? data : (data as { results: DiscoverProfile[] }).results ?? []
  },

  nearby: async (radiusMiles = 75): Promise<DiscoverProfile[]> => {
    const { data } = await apiClient.get<{ results: DiscoverProfile[] }>('/api/search/nearby', {
      params: { radiusMiles },
    })
    return Array.isArray(data) ? data : (data as { results: DiscoverProfile[] }).results ?? []
  },
}
