import apiClient from './axios'
import type { AgentArtifact, AgentChannelRecord, AgentChannelSnapshot } from '../types'

export interface EnsureAgentChannelPayload {
  key?: string
  title?: string
  description?: string
}

export interface AgentMessagePayload {
  speakerType?: 'founder' | 'agent' | 'system'
  agentKey?: string
  displayName?: string
  roleLabel?: string
  content: string
}

export interface CompileArtifactPayload {
  artifactType?: 'implementation_plan' | 'research_digest'
}

export const agentsApi = {
  ensureChannel: async (payload: EnsureAgentChannelPayload): Promise<AgentChannelRecord> => {
    const { data } = await apiClient.post('/api/agents/channels', payload)
    return data
  },

  getChannel: async (key: string): Promise<AgentChannelSnapshot> => {
    const { data } = await apiClient.get(`/api/agents/channels/${key}`)
    return data
  },

  postMessage: async (key: string, payload: AgentMessagePayload): Promise<AgentChannelSnapshot> => {
    const { data } = await apiClient.post(`/api/agents/channels/${key}/messages`, payload)
    return data
  },

  compileArtifact: async (key: string, payload: CompileArtifactPayload): Promise<AgentArtifact> => {
    const { data } = await apiClient.post(`/api/agents/channels/${key}/compile`, payload)
    return data
  },

  listArtifacts: async (key?: string): Promise<AgentArtifact[]> => {
    const { data } = await apiClient.get('/api/agents/artifacts', {
      params: key ? { key } : undefined,
    })
    return data
  },
}
