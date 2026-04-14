import apiClient from './axios'
import { mapUser } from './utils'
import type { ProfileDetail, ProfileViewer, PublicProfile, User } from '../types'

export interface Experience {
  id: string
  userId: string
  company: string
  role: string
  employmentType?: string | null
  startDate?: string | null
  endDate?: string | null
  isCurrent: boolean
  location?: string | null
  description?: string | null
  displayOrder: number
}

export interface Education {
  id: string
  userId: string
  institution: string
  degree?: string | null
  fieldOfStudy?: string | null
  startYear?: number | null
  endYear?: number | null
  activities?: string | null
  description?: string | null
  displayOrder: number
}

export interface SimilarUser {
  id: string
  firstName: string
  lastName: string
  profilePhotoUrl: string | null
  college: { name: string } | null
  currentRole: string | null
  company: string | null
  idVerified: boolean
  headline: string | null
}

export interface UpdateProfilePayload {
  bio?: string
  headline?: string
  currentRole?: string
  company?: string
  locationLabel?: string
  workLocation?: string
  futureLocation?: string
  major?: string
  gpa?: number
  sat?: number
  act?: number
  relationshipGoal?: string
  interests?: string[]
  values?: string[]
  socialLinks?: {
    instagram?: string
    twitter?: string
    tiktok?: string
    linkedin?: string
  }
  latitude?: number
  longitude?: number
  collegeId?: string
  profilePhotoUrl?: string
  idPhotoUrl?: string
  prompts?: Array<{ question: string; answer: string }>
  religion?: string
  height?: string
  drinking?: string
  smoking?: string
  cannabis?: string
  wantsKids?: string
  politicalViews?: string
  birthCity?: string
  sexuality?: string
  greekOrganization?: string
  greekOrganizationType?: 'FRATERNITY' | 'SORORITY' | 'CO-ED'
  strengthStats?: {
    bench?: number
    squat?: number
    deadlift?: number
    pullUps?: number
    pushUps?: number
    videoUrl?: string
  } | null
}

// Keep legacy alias so any existing callers still compile
export type UpdateUserPayload = UpdateProfilePayload

export interface OnboardingPayload {
  firstName: string
  lastName: string
  dateOfBirth: string // YYYY-MM-DD
  gender: string
  bio: string
  headline?: string
  currentRole?: string
  company?: string
  locationLabel?: string
  workLocation?: string
  futureLocation?: string
  major: string
  gpa?: number
  sat?: number
  act?: number
  interests: string[]
  relationshipGoal: string
  collegeId: string
  profilePhotoUrl?: string
}

// Map frontend display values → backend enum values
const GENDER_MAP: Record<string, string> = {
  'Man': 'MAN',
  'Woman': 'WOMAN',
  'Non-binary': 'NON_BINARY',
  'Prefer not to say': 'PREFER_NOT_TO_SAY',
}

const GOAL_MAP: Record<string, string> = {
  'Long-term': 'LONGTERM',
  'Casual dating': 'CASUAL',
  'Casual': 'CASUAL',
  'Friendship': 'EXPLORING',
  'Not sure yet': 'EXPLORING',
  'Exploring': 'EXPLORING',
  'Marriage': 'MARRIAGE',
}


export const usersApi = {
  getProfile: async (): Promise<ProfileDetail> => {
    const { data } = await apiClient.get('/api/users/profile')
    return mapUser(data) as ProfileDetail
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const mapped = { ...payload }
    if (mapped.relationshipGoal) {
      mapped.relationshipGoal = GOAL_MAP[mapped.relationshipGoal] ?? mapped.relationshipGoal
    }
    const { data } = await apiClient.patch('/api/users/profile', mapped)
    return mapUser(data)
  },

  // Legacy alias
  updateMe: async (payload: UpdateProfilePayload): Promise<User> => {
    return usersApi.updateProfile(payload)
  },

  getUserProfile: async (userId: string): Promise<PublicProfile> => {
    const { data } = await apiClient.get(`/api/users/${userId}`)
    return data
  },

  recordProfileView: async (userId: string): Promise<void> => {
    await apiClient.post(`/api/users/${userId}/view`)
  },

  getProfileViewers: async (): Promise<ProfileViewer[]> => {
    const { data } = await apiClient.get('/api/users/me/viewers')
    return data
  },

  completeOnboarding: async (payload: OnboardingPayload): Promise<User> => {
    const mapped = {
      ...payload,
      gender: GENDER_MAP[payload.gender] ?? payload.gender,
      relationshipGoal: GOAL_MAP[payload.relationshipGoal] ?? payload.relationshipGoal,
    }
    const { data } = await apiClient.post('/api/users/onboarding', mapped)
    return mapUser(data)
  },

  verifyIdentity: async (payload: { idPhotoUrl?: string; verificationVideoUrl?: string }): Promise<User> => {
    const { data } = await apiClient.post('/api/users/profile/verify-id', payload)
    return mapUser(data)
  },

  getExperiences: async (userId: string): Promise<Experience[]> => {
    const { data } = await apiClient.get(`/api/users/${userId}/experiences`)
    return data
  },

  getEducation: async (userId: string): Promise<Education[]> => {
    const { data } = await apiClient.get(`/api/users/${userId}/education`)
    return data
  },

  getSimilarUsers: async (userId: string): Promise<SimilarUser[]> => {
    const { data } = await apiClient.get(`/api/users/${userId}/similar`)
    return data
  },
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'apex_upload')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    throw new Error('Failed to upload image. Please try again.')
  }

  const result = (await response.json()) as { secure_url: string }
  return result.secure_url
}
