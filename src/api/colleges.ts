import apiClient from './axios'
import type { College } from '../types'

export const collegesApi = {
  search: async (q: string): Promise<College[]> => {
    if (!q.trim()) return []
    const { data } = await apiClient.get(`/api/colleges/search?q=${encodeURIComponent(q)}`)
    return data
  },
}
