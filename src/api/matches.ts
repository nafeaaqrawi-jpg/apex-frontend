import apiClient from './axios'
import type { Match, DiscoverProfile, Message, NearbyProfile } from '../types'

export interface WeMetStatus {
  myConfirmation: boolean
  otherConfirmed: boolean
  bothConfirmed: boolean
}

export const matchesApi = {
  discover: async (): Promise<DiscoverProfile[]> => {
    const { data } = await apiClient.get('/api/discover')
    return data
  },

  nearby: async (radiusMiles = 100): Promise<NearbyProfile[]> => {
    const { data } = await apiClient.get('/api/discover/nearby', {
      params: { radiusMiles },
    })
    return data
  },

  like: async (
    userId: string,
    introMessage?: string
  ): Promise<{ matched: boolean; match?: { id: string } }> => {
    const { data } = await apiClient.post(`/api/matches/like/${userId}`, {
      introMessage,
    })
    return data
  },

  getMatches: async (): Promise<Match[]> => {
    const { data } = await apiClient.get('/api/matches')
    return data
  },

  getMatch: async (matchId: string): Promise<Match> => {
    const { data } = await apiClient.get(`/api/matches/${matchId}`)
    return data
  },

  deleteMatch: async (matchId: string): Promise<void> => {
    await apiClient.delete(`/api/matches/${matchId}`)
  },

  getMessages: async (matchId: string): Promise<Message[]> => {
    const { data } = await apiClient.get(`/api/matches/${matchId}/messages`)
    return data
  },

  sendMessage: async (
    matchId: string,
    content: string,
    messageType?: string,
    mediaUrl?: string
  ): Promise<Message> => {
    const { data } = await apiClient.post(`/api/matches/${matchId}/messages`, {
      content,
      ...(messageType ? { messageType } : {}),
      ...(mediaUrl ? { mediaUrl } : {}),
    })
    return data
  },

  sendVoiceMessage: async (matchId: string, mediaUrl: string): Promise<Message> => {
    const { data } = await apiClient.post(`/api/matches/${matchId}/voice`, { mediaUrl })
    return data
  },

  getWeMetStatus: async (matchId: string): Promise<WeMetStatus> => {
    const { data } = await apiClient.get(`/api/matches/${matchId}/we-met`)
    return data
  },

  confirmWeMet: async (matchId: string): Promise<WeMetStatus> => {
    const { data } = await apiClient.post(`/api/matches/${matchId}/we-met`)
    return data
  },

  getPendingRequests: async (): Promise<Match[]> => {
    const { data } = await apiClient.get('/api/connections/requests')
    return data
  },

  getSentRequests: async (): Promise<Match[]> => {
    const { data } = await apiClient.get('/api/connections/sent')
    return data
  },

  unmatch: async (matchId: string): Promise<void> => {
    await apiClient.delete(`/api/matches/${matchId}`)
  },
}
