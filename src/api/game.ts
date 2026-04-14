import apiClient from './axios'

export interface GameState {
  totalXP: number
  level: number
  currentStreak: number
  longestStreak: number
  progressToNext: number
  achievements: Array<{ id: string; label: string; xp: number; icon: string }>
}

export const gameApi = {
  getState: () => apiClient.get<GameState>('/api/game/state').then(r => r.data),
}
