import apiClient from './axios'

export type RizzAssistIntent = 'open' | 'reply' | 'recover'
export type RizzAssistTone = 'playful' | 'confident' | 'warm'
export type RizzAssistAudience = 'woman' | 'man' | 'any'
export type RizzPersona =
  | 'nerdy'
  | 'goth'
  | 'consultant'
  | 'investment_banker'
  | 'swe'
  | 'creative'
  | 'athlete'
export type RizzBoundary = 'clean' | 'light_flirty' | 'bold'
export type RizzGoal = 'flirt' | 'build_rapport' | 'set_up_date'
export type RizzChatRole = 'user' | 'assistant'

export interface RizzChatMessage {
  role: RizzChatRole
  content: string
}

export interface RizzSignalContext {
  college?: string
  currentLocation?: string
  workLocation?: string
  futureLocation?: string
  currentRole?: string
  company?: string
  verified?: boolean
  gpa?: number
  sat?: number
  act?: number
}

export interface RizzAssistPayload {
  message: string
  intent: RizzAssistIntent
  tone: RizzAssistTone
  audience: RizzAssistAudience
}

export interface RizzChatPayload {
  message: string
  history?: RizzChatMessage[]
  intent: RizzAssistIntent
  tone: RizzAssistTone
  audience: RizzAssistAudience
  persona?: RizzPersona
  goal?: RizzGoal
  boundary?: RizzBoundary
  profileSignals?: RizzSignalContext
}

export interface RizzAssistReply {
  reply: string
  read: string
  response: string
}

export interface RizzAssistResponse {
  coach: string
  openers: string[]
  likelyReplies: RizzAssistReply[]
  caution: string
}

export interface RizzChatResponse extends RizzAssistResponse {
  persona: RizzPersona
  personaLabel: string
  followUps: string[]
  recovery: string[]
  avoid: string[]
  confidence: number
}

export const rizzAssistApi = {
  respond: async (payload: RizzAssistPayload): Promise<RizzAssistResponse> => {
    const { data } = await apiClient.post('/api/rizzassist/respond', payload)
    return data
  },

  chat: async (payload: RizzChatPayload): Promise<RizzChatResponse> => {
    const { data } = await apiClient.post('/api/rizzassist/chat', payload)
    return data
  },
}
