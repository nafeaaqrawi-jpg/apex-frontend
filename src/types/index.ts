export type Gender = 'Man' | 'Woman' | 'Non-binary' | 'Prefer not to say'

export interface College {
  id: string
  name: string
  state?: string | null
  tier: string
  emailDomain?: string | null
}

export interface UserPost {
  id: string
  userId: string
  imageUrl: string
  caption?: string | null
  locationTag?: string | null
  createdAt: string
}

export interface ProfileStats {
  connectionCount: number
  postCount: number
}

export interface ConnectionState {
  id: string
  status: 'LIKED' | 'MATCHED' | 'UNMATCHED'
  introMessage?: string | null
  introMessageSenderId?: string | null
  matchScore?: number | null
  createdAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  age: number
  dateOfBirth?: string
  gender?: Gender
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
  relationshipGoal?: 'Marriage' | 'Long-term' | 'Casual' | 'Exploring'
  interests?: string[]
  values?: string[]
  socialLinks?: { instagram?: string; twitter?: string; tiktok?: string; linkedin?: string }
  latitude?: number
  longitude?: number
  collegeId?: string
  college?: College | null
  profilePhotoUrl?: string
  greekOrganization?: string
  greekOrganizationType?: 'FRATERNITY' | 'SORORITY' | 'CO-ED'
  idPhotoUrl?: string
  isEmailVerified: boolean
  isIdVerified: boolean
  isProfileComplete: boolean
  createdAt: string
}

export interface ProfileDetail extends User {
  posts: UserPost[]
  stats: ProfileStats
  connection?: ConnectionState | null
}

export interface Match {
  id: string
  userId?: string
  matchedUserId?: string
  matchedUser: User
  createdAt: string
  introMessage?: string | null
  introMessageSenderId?: string | null
  matchScore?: number | null
  lastMessage?: Message
}

export interface Message {
  id: string
  matchId: string
  senderId: string
  content: string
  messageType?: string
  mediaUrl?: string | null
  createdAt: string
  read?: boolean
}

export interface DiscoverProfile {
  id: string
  firstName: string
  lastName: string
  age: number
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
  profilePhotoUrl?: string
  idVerified?: boolean
  latitude?: number | null
  longitude?: number | null
  distanceMiles?: number
  college?: College | null
  matchScore?: number | null
  connectionDegree?: 2 | 3 | null
  greekOrganization?: string
  greekOrganizationType?: string
  schoolEmailVerified?: boolean
}

export interface NearbyProfile extends DiscoverProfile {
  latitude: number
  longitude: number
  distanceMiles: number
}

export interface PublicProfile {
  id: string
  firstName: string
  lastName: string
  age: number
  gender?: string
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
  profilePhotoUrl?: string
  idVerified: boolean
  schoolEmailVerified?: boolean
  college?: College | null
  socialLinks?: { instagram?: string; twitter?: string; tiktok?: string; linkedin?: string }
  createdAt: string
  posts: UserPost[]
  stats: ProfileStats
  connection?: ConnectionState | null
  strengthStats?: {
    bench?: number | null
    squat?: number | null
    deadlift?: number | null
    pullUps?: number | null
    pushUps?: number | null
    videoUrl?: string | null
  } | null
}

export interface ProfileViewer {
  id: string
  viewedAt: string
  viewer: {
    id: string
    firstName: string
    lastName: string
    profilePhotoUrl: string | null
    college: { name: string } | null
    currentRole: string | null
    idVerified: boolean
  }
}

export interface ApiError {
  message: string
  statusCode?: number
}

export type RelationshipGoal = 'Marriage' | 'Long-term' | 'Casual' | 'Exploring'

export const INTERESTS = [
  'Reading',
  'Fitness',
  'Travel',
  'Music',
  'Art',
  'Cooking',
  'Gaming',
  'Hiking',
  'Photography',
  'Film',
  'Startups',
  'Finance',
  'Sports',
  'Yoga',
  'Volunteering',
  'Fashion',
  'Science',
  'Politics',
  'Philosophy',
  'Languages',
] as const

export type Interest = (typeof INTERESTS)[number]

export const VALUES = [
  'Ambition',
  'Loyalty',
  'Curiosity',
  'Kindness',
  'Humor',
  'Integrity',
  'Faith',
  'Family',
  'Adventure',
  'Creativity',
  'Growth',
  'Independence',
  'Empathy',
  'Health',
  'Success',
] as const

export type Value = (typeof VALUES)[number]

export interface AgentSourceLink {
  label: string
  url: string
}

export interface AgentRosterMember {
  key: string
  displayName: string
  roleLabel: string
  accent: string
  summary: string
  focusAreas: string[]
  sourceLinks: AgentSourceLink[]
  seedTakeaways: string[]
}

export interface AgentChannelRecord {
  id: string
  key: string
  title: string
  description?: string | null
  metadata?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface AgentMessage {
  id: string
  channelId: string
  speakerType: 'founder' | 'agent' | 'system'
  agentKey?: string | null
  displayName: string
  roleLabel?: string | null
  content: string
  metadata?: Record<string, unknown> | null
  createdAt: string
}

export interface AgentArtifact {
  id: string
  channelId: string
  artifactType: 'implementation_plan' | 'research_digest' | string
  title: string
  summary: string
  content: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface AgentChannelSnapshot {
  channel: AgentChannelRecord
  roster: AgentRosterMember[]
  messages: AgentMessage[]
  artifacts: AgentArtifact[]
}

export interface TelemetrySummary {
  windowDays: number
  totalEvents: number
  pageViews: number
  topRoutes: Array<{ route: string; count: number }>
  topEventTypes: Array<{ eventType: string; count: number }>
  lastActiveAt: string | null
}
