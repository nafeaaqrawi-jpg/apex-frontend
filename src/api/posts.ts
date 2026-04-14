import apiClient from './axios'
import type { UserPost } from '../types'

export interface CreatePostPayload {
  imageUrl: string
  caption?: string
  locationTag?: string
}

export const postsApi = {
  getMyPosts: async (): Promise<UserPost[]> => {
    const { data } = await apiClient.get('/api/posts/me')
    return data
  },

  createPost: async (payload: CreatePostPayload): Promise<UserPost> => {
    const { data } = await apiClient.post('/api/posts', payload)
    return data
  },

  deletePost: async (postId: string): Promise<UserPost> => {
    const { data } = await apiClient.delete(`/api/posts/${postId}`)
    return data
  },
}
