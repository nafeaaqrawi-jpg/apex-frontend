import apiClient from './axios'
import type { TelemetrySummary } from '../types'

export interface TelemetryEventPayload {
  eventType: string
  route?: string
  entityType?: string
  entityId?: string
  dwellMs?: number
  metadata?: Record<string, unknown>
}

export const telemetryApi = {
  track: async (payload: TelemetryEventPayload): Promise<void> => {
    await apiClient.post('/api/telemetry/events', payload)
  },

  getSummary: async (windowDays = 14): Promise<TelemetrySummary> => {
    const { data } = await apiClient.get('/api/telemetry/summary', {
      params: { windowDays },
    })
    return data
  },
}
