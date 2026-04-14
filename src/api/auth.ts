import apiClient from './axios'
import { mapUser } from './utils'
import type { User } from '../types'

export interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/api/auth/register', payload)
    return data
  },

  login: async (payload: LoginPayload): Promise<{ user: User }> => {
    const { data } = await apiClient.post<{ user: User }>('/api/auth/login', payload)
    if (!data.user) throw new Error('Invalid response from server.')
    return { user: mapUser(data.user) }
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout')
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const { data } = await apiClient.get(`/api/auth/verify-email?token=${token}`)
    return data
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/api/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/api/auth/reset-password', { token, newPassword })
    return data
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/api/auth/resend-verification', { email })
    return data
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<{ user: User }>('/api/auth/me')
    if (!data.user) throw new Error('Invalid response from server.')
    return mapUser(data.user)
  },
}
