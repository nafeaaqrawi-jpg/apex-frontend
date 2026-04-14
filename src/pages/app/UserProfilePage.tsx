import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { X as XIcon } from 'lucide-react'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
  Instagram,
  Linkedin,
  MapPin,
  MessageSquare,
  Music2,
  Pause,
  Play,
  ShieldCheck,
  Twitter,
  Volume2,
  X,
} from 'lucide-react'
import ConnectionNoteModal from '../../components/profile/ConnectionNoteModal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { matchesApi } from '../../api/matches'
import { usersApi } from '../../api/users'
import { useAuth } from '../../hooks/useAuth'
import type { PublicProfile } from '../../types'
import type { Experience, Education, SimilarUser } from '../../api/users'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(
  startDate?: string | null,
  endDate?: string | null,
  isCurrent?: boolean,
): string {
  if (!startDate) return ''
  const start = new Date(startDate + '-01')
  const end = isCurrent ? new Date() : endDate ? new Date(endDate + '-01') : new Date()
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  if (months <= 0) return ''
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (years === 0) return `${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`
  if (remainingMonths === 0) return `${years} yr${years !== 1 ? 's' : ''}`
  return `${years} yr${years !== 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const GOAL_LABELS: Record<string, string> = {
  MARRIAGE: 'Looking for marriage',
  LONGTERM: 'Long-term relationship',
  CASUAL: 'Casual dating',
  EXPLORING: 'Open to exploring',
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SocialRow({
  href,
  label,
  icon,
  value,
}: {
  href: string
  label: string
  icon: ReactNode
  value: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-gray-700 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </a>
  )
}

function VoiceNotePlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      void audio.play()
    }
    setPlaying(!playing)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="mx-4 mb-3 flex items-center gap-3 rounded-2xl bg-purple-50 px-4 py-3">
      <button
        onClick={toggle}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm transition-all hover:bg-purple-700 active:scale-90"
      >
        {playing ? <Pause size={15} /> : <Play size={15} />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-purple-500">Voice note</span>
          <span className="text-[11px] text-purple-400">{duration > 0 ? formatTime(duration) : '—'}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-purple-200">
          <div
            className="h-full rounded-full bg-purple-500 transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={(e) => {
          const a = e.currentTarget
          if (a.duration) setProgress(a.currentTime / a.duration)
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); setProgress(0) }}
      />
    </div>
  )
}

function PromptCard({
  label,
  answer,
  photoUrl,
  voiceUrl,
  onLike,
  likeDisabled,
}: {
  label: string
  answer: string
  photoUrl?: string | null
  voiceUrl?: string | null
  onLike: () => void
  likeDisabled: boolean
}) {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
      {/* Purple accent bar on left */}
      <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-purple-400 to-violet-500" />

      {/* Text content */}
      <div className="px-5 pt-5 pb-4 pl-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">{label}</p>
        <p className="mt-2 font-display text-[22px] font-bold leading-snug text-gray-900">{answer}</p>
      </div>

      {/* Voice note */}
      {voiceUrl && (
        <VoiceNotePlayer url={voiceUrl} />
      )}

      {/* Photo (if attached) */}
      {photoUrl && (
        <div className="relative mx-4 mb-4 overflow-hidden rounded-[16px]" style={{ height: 200 }}>
          <img
            src={photoUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
      )}

      <button
        onClick={onLike}
        disabled={likeDisabled}
        aria-label="Like this answer"
        className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-30 active:scale-90"
      >
        <Heart size={16} />
      </button>
    </div>
  )
}

// Map known companies/schools to their domain for logo lookup
const COMPANY_DOMAINS: Record<string, string> = {
  // Finance
  'Goldman Sachs': 'goldmansachs.com',
  'JPMorgan Chase': 'jpmorganchase.com',
  'JPMorgan': 'jpmorgan.com',
  'J.P. Morgan': 'jpmorgan.com',
  'Morgan Stanley': 'morganstanley.com',
  'BlackRock': 'blackrock.com',
  'Citadel': 'citadel.com',
  'Jane Street': 'janestreet.com',
  'Bridgewater Associates': 'bridgewater.com',
  'Bridgewater': 'bridgewater.com',
  'General Atlantic': 'generalatlantic.com',
  'D.E. Shaw': 'deshaw.com',
  'Two Sigma': 'twosigma.com',
  'Andreessen Horowitz': 'a16z.com',
  // Tech
  'Google': 'google.com',
  'Google DeepMind': 'deepmind.com',
  'DeepMind': 'deepmind.com',
  'Apple': 'apple.com',
  'Microsoft': 'microsoft.com',
  'Meta': 'meta.com',
  'Amazon': 'amazon.com',
  'Netflix': 'netflix.com',
  'Stripe': 'stripe.com',
  'OpenAI': 'openai.com',
  'Anthropic': 'anthropic.com',
  'SpaceX': 'spacex.com',
  'Tesla': 'tesla.com',
  'NVIDIA': 'nvidia.com',
  'Nvidia': 'nvidia.com',
  'Airbnb': 'airbnb.com',
  'Uber': 'uber.com',
  'Spotify': 'spotify.com',
  'Palantir': 'palantir.com',
  // Consulting
  'McKinsey & Company': 'mckinsey.com',
  'McKinsey': 'mckinsey.com',
  'Boston Consulting Group': 'bcg.com',
  'BCG': 'bcg.com',
  'Bain & Company': 'bain.com',
  'Deloitte': 'deloitte.com',
  'PwC': 'pwc.com',
  'KPMG': 'kpmg.com',
  'Ernst & Young': 'ey.com',
  // Law
  'Kirkland & Ellis': 'kirkland.com',
  'Paul, Weiss, Rifkind, Wharton & Garrison': 'paulweiss.com',
  'Sullivan & Cromwell': 'sullcrom.com',
  'Skadden': 'skadden.com',
  // Media / Other
  'A24': 'a24films.com',
  'The New York Times': 'nytimes.com',
  'GE Aerospace': 'ge.com',
  'GE': 'ge.com',
  // Government / Non-profit
  'ACLU': 'aclu.org',
  'Council on Foreign Relations': 'cfr.org',
  'United Nations': 'un.org',
  'International Monetary Fund': 'imf.org',
  'IMF': 'imf.org',
  'NASA Jet Propulsion Laboratory': 'jpl.nasa.gov',
  'Brookings Institution': 'brookings.edu',
  'Brookings': 'brookings.edu',
  // Academia / Research
  'Stanford Medicine': 'stanford.edu',
  'UCSF': 'ucsf.edu',
  'Columbia University': 'columbia.edu',
  'Columbia Lab': 'columbia.edu',
  'Princeton University': 'princeton.edu',
  'Princeton Neuroscience Institute': 'princeton.edu',
  'Harvard Kennedy School': 'harvard.edu',
  'Yale Law School': 'yale.edu',
  'Duke University Hospital': 'duke.edu',
  'Emory Healthcare': 'emory.edu',
  'NYU': 'nyu.edu',
}

const UNIVERSITY_DOMAINS: Record<string, string> = {
  'Stanford University': 'stanford.edu',
  'Harvard University': 'harvard.edu',
  'Massachusetts Institute of Technology': 'mit.edu',
  'MIT': 'mit.edu',
  'Yale University': 'yale.edu',
  'Princeton University': 'princeton.edu',
  'Columbia University': 'columbia.edu',
  'Duke University': 'duke.edu',
  'Duke University - Fuqua School of Business': 'duke.edu',
  'Cornell University': 'cornell.edu',
  'Northwestern University': 'northwestern.edu',
  'Georgetown University': 'georgetown.edu',
  'University of Michigan': 'umich.edu',
  'University of Michigan - Stephen M. Ross School of Business': 'umich.edu',
  'University of Pennsylvania': 'upenn.edu',
  'Brown University': 'brown.edu',
  'Dartmouth College': 'dartmouth.edu',
  'Johns Hopkins University': 'jhu.edu',
  'University of Chicago': 'uchicago.edu',
  'Vanderbilt University': 'vanderbilt.edu',
  'Rice University': 'rice.edu',
  'Notre Dame': 'nd.edu',
  'University of Notre Dame': 'nd.edu',
  'Emory University': 'emory.edu',
  'Washington University in St. Louis': 'wustl.edu',
  'Carnegie Mellon University': 'cmu.edu',
  'UCLA': 'ucla.edu',
  'University of California, Los Angeles': 'ucla.edu',
  'UC Berkeley': 'berkeley.edu',
  'University of California, Berkeley': 'berkeley.edu',
  'NYU': 'nyu.edu',
  'New York University': 'nyu.edu',
  'Boston University': 'bu.edu',
  'Tufts University': 'tufts.edu',
  'Wake Forest University': 'wfu.edu',
  'Tulane University': 'tulane.edu',
  'University of Southern California': 'usc.edu',
  'University of Virginia': 'virginia.edu',
  'University of North Carolina': 'unc.edu',
  'UNC': 'unc.edu',
  'University of Texas at Austin': 'utexas.edu',
  'The University of Texas at Austin': 'utexas.edu',
  'California Institute of Technology': 'caltech.edu',
  'Caltech': 'caltech.edu',
  'Northeastern University': 'northeastern.edu',
  'University of Florida': 'ufl.edu',
  'Penn State': 'psu.edu',
  'Pennsylvania State University': 'psu.edu',
  'Purdue University': 'purdue.edu',
  'University of Wisconsin': 'wisc.edu',
  'Georgia Tech': 'gatech.edu',
  'Georgia Institute of Technology': 'gatech.edu',
  'Ohio State University': 'osu.edu',
}

function resolveCompanyDomain(company: string): string | null {
  if (COMPANY_DOMAINS[company]) return COMPANY_DOMAINS[company]
  // Fuzzy: check if the company name contains a known key or vice versa
  const lower = company.toLowerCase()
  for (const [name, domain] of Object.entries(COMPANY_DOMAINS)) {
    if (lower.includes(name.toLowerCase()) || name.toLowerCase().includes(lower)) {
      return domain
    }
  }
  return null
}

function resolveUniversityDomain(institution: string): string | null {
  if (UNIVERSITY_DOMAINS[institution]) return UNIVERSITY_DOMAINS[institution]
  const lower = institution.toLowerCase()
  for (const [name, domain] of Object.entries(UNIVERSITY_DOMAINS)) {
    if (lower.includes(name.toLowerCase()) || name.toLowerCase().includes(lower)) {
      return domain
    }
  }
  return null
}

function CompanyLogo({ company, size = 44 }: { company: string; size?: number }) {
  const [clearbitFailed, setClearbitFailed] = useState(false)
  const [googleFailed, setGoogleFailed] = useState(false)
  const domain = resolveCompanyDomain(company)
  const initial = company.charAt(0).toUpperCase()

  if (!domain) {
    return (
      <div
        className="shrink-0 flex items-center justify-center rounded-xl bg-[#1a3460] text-white font-bold shadow-sm"
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        {initial}
      </div>
    )
  }

  if (!clearbitFailed) {
    return (
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={company}
        onError={() => setClearbitFailed(true)}
        className="shrink-0 rounded-xl object-contain bg-white border border-gray-100 shadow-sm p-1"
        style={{ width: size, height: size }}
      />
    )
  }

  if (!googleFailed) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
        alt={company}
        onError={() => setGoogleFailed(true)}
        className="shrink-0 rounded-xl object-contain bg-white border border-gray-100 shadow-sm p-1.5"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-xl bg-[#1a3460] text-white font-bold shadow-sm"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initial}
    </div>
  )
}

function UniversityLogo({ institution, size = 44 }: { institution: string; size?: number }) {
  const [clearbitFailed, setClearbitFailed] = useState(false)
  const [googleFailed, setGoogleFailed] = useState(false)
  const domain = resolveUniversityDomain(institution)

  if (!domain) {
    return (
      <div
        className="shrink-0 flex items-center justify-center rounded-xl bg-[#1e3a5f] shadow-sm"
        style={{ width: size, height: size }}
      >
        <GraduationCap size={size * 0.45} className="text-white" />
      </div>
    )
  }

  if (!clearbitFailed) {
    return (
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={institution}
        onError={() => setClearbitFailed(true)}
        className="shrink-0 rounded-xl object-contain bg-white border border-gray-100 shadow-sm p-1"
        style={{ width: size, height: size }}
      />
    )
  }

  if (!googleFailed) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
        alt={institution}
        onError={() => setGoogleFailed(true)}
        className="shrink-0 rounded-xl object-contain bg-white border border-gray-100 shadow-sm p-1.5"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-xl bg-[#1e3a5f] shadow-sm"
      style={{ width: size, height: size }}
    >
      <GraduationCap size={size * 0.45} className="text-white" />
    </div>
  )
}

function ExperienceItem({ exp, isLast }: { exp: Experience; isLast: boolean }) {
  const dateRange = [
    formatDate(exp.startDate),
    exp.isCurrent ? 'Present' : formatDate(exp.endDate),
  ]
    .filter(Boolean)
    .join(' – ')
  const duration = formatDuration(exp.startDate, exp.endDate, exp.isCurrent)

  return (
    <div>
      <div className="flex gap-3.5">
        <CompanyLogo company={exp.company} size={48} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-snug text-gray-900">{exp.role}</p>
          <p className="mt-0.5 text-sm text-gray-500">
            {exp.company}
            {exp.employmentType ? ` · ${exp.employmentType}` : ''}
          </p>
          {(dateRange || duration) && (
            <p className="mt-0.5 text-xs text-gray-400">
              {dateRange}
              {duration ? ` · ${duration}` : ''}
            </p>
          )}
          {exp.location && <p className="mt-0.5 text-xs text-gray-400">{exp.location}</p>}
          {exp.description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{exp.description}</p>
          )}
        </div>
      </div>
      {!isLast && <div className="mt-5 border-t border-gray-100" />}
    </div>
  )
}

function EducationItem({ edu, isLast }: { edu: Education; isLast: boolean }) {
  const yearRange = [edu.startYear, edu.endYear].filter(Boolean).join(' – ')

  return (
    <div>
      <div className="flex gap-3.5">
        <UniversityLogo institution={edu.institution} size={48} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-snug text-gray-900">{edu.institution}</p>
          {(edu.degree || edu.fieldOfStudy) && (
            <p className="mt-0.5 text-sm text-gray-500">
              {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
            </p>
          )}
          {yearRange && <p className="mt-0.5 text-xs text-gray-400">{yearRange}</p>}
          {edu.activities && (
            <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
              {edu.activities}
            </p>
          )}
          {edu.description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{edu.description}</p>
          )}
        </div>
      </div>
      {!isLast && <div className="mt-5 border-t border-gray-100" />}
    </div>
  )
}

function SimilarPersonCard({
  person,
  onExpress,
  disabled,
}: {
  person: SimilarUser
  onExpress: (id: string) => void
  disabled: boolean
}) {
  return (
    <div className="flex w-40 shrink-0 flex-col items-center rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
      {person.profilePhotoUrl ? (
        <img
          src={person.profilePhotoUrl}
          alt={`${person.firstName} ${person.lastName}`}
          className="h-16 w-16 rounded-full object-cover"
          width={64}
          height={64}
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-500">
          {person.firstName.charAt(0)}
        </div>
      )}
      <p className="mt-3 text-center text-sm font-semibold text-gray-900 leading-tight">
        {person.firstName}
      </p>
      {person.college && (
        <p className="mt-0.5 line-clamp-1 text-center text-xs text-gray-400">{person.college.name}</p>
      )}
      {(person.currentRole || person.company) && (
        <p className="mt-0.5 line-clamp-1 text-center text-xs text-gray-400">
          {[person.currentRole, person.company].filter(Boolean).join(' · ')}
        </p>
      )}
      <button
        onClick={() => onExpress(person.id)}
        disabled={disabled}
        className="mt-3 w-full rounded-full bg-purple-600 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
      >
        Express Interest
      </button>
    </div>
  )
}

function AudioPlayer({ url, label }: { url: string; label: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  function toggle() {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      void el.play()
      setPlaying(true)
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
      <audio ref={audioRef} src={url} onEnded={() => setPlaying(false)} />
      <Volume2 size={16} className="shrink-0 text-gray-400" />
      <p className="flex-1 text-sm text-gray-600">{label}</p>
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Play'}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-700"
      >
        <Play size={14} className={playing ? 'opacity-50' : ''} />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null)

  const matchId = searchParams.get('matchId')

  const { data: profile, isLoading, isError } = useQuery<PublicProfile>({
    queryKey: ['user-profile', userId],
    queryFn: () => usersApi.getUserProfile(userId!),
    enabled: !!userId,
  })

  const { data: experiences } = useQuery<Experience[]>({
    queryKey: ['user-experiences', userId],
    queryFn: () => usersApi.getExperiences(userId!),
    enabled: !!userId,
  })

  const { data: education } = useQuery<Education[]>({
    queryKey: ['user-education', userId],
    queryFn: () => usersApi.getEducation(userId!),
    enabled: !!userId,
  })

  const { data: similarUsers } = useQuery<SimilarUser[]>({
    queryKey: ['user-similar', userId],
    queryFn: () => usersApi.getSimilarUsers(userId!),
    enabled: !!userId,
  })

  type CompatibilityBreakdown = {
    goals: number
    interests: number
    values: number
    location: number
    lifestyle: number
    behavioral: number
    social: number
    safety: number
    boost: number
  }
  type CompatibilityData = { score: number; breakdown: CompatibilityBreakdown } | null

  const { data: compatibilityData } = useQuery<CompatibilityData>({
    queryKey: ['compatibility', userId],
    queryFn: async (): Promise<CompatibilityData> => {
      const res = await fetch(`/api/connections/score/${userId!}`, { credentials: 'include' })
      const json = await res.json() as { success: boolean; data?: { score: number; breakdown: Record<string, number> } }
      if (!json.success || !json.data) return null
      return {
        score: json.data.score,
        breakdown: json.data.breakdown as unknown as CompatibilityBreakdown,
      }
    },
    enabled: !!userId && userId !== user?.id,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (userId && user?.id && userId !== user.id) {
      void usersApi.recordProfileView(userId).catch(() => {
        /* silent */
      })
    }
  }, [userId, user?.id])

  const connectMutation = useMutation({
    mutationFn: (introMessage?: string) => matchesApi.like(userId!, introMessage),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      queryClient.invalidateQueries({ queryKey: ['discover'] })
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] })

      if (result.matched && result.match?.id) {
        navigate(`/chat/${result.match.id}`)
        return
      }

      setNoteModalOpen(false)
    },
  })

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <GraduationCap size={28} className="text-gray-400" />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">Profile unavailable</p>
          <p className="mt-1 text-sm text-gray-500">This profile couldn&apos;t be loaded right now.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          Go back
        </button>
      </div>
    )
  }

  const fullName = `${profile.firstName} ${profile.lastName}`
  const matched = Boolean(matchId) || profile.connection?.status === 'MATCHED'
  const incomingNote = Boolean(
    profile.connection?.status === 'LIKED' &&
      profile.connection?.introMessage &&
      profile.connection.introMessageSenderId !== user?.id,
  )
  const sentLike =
    profile.connection?.status === 'LIKED' && profile.connection.introMessageSenderId === user?.id

  // Fields that exist on PublicProfile but may not be declared in the type yet
  const profileAny = profile as PublicProfile & {
    namePronunciationUrl?: string | null
    voicePromptUrl?: string | null
    voicePromptQuestion?: string | null
    prompts?: Array<{ question: string; answer: string; photoUrl?: string | null }> | null
    religion?: string | null
    sexuality?: string | null
    ethnicity?: string | null
    birthCity?: string | null
    height?: string | null
    drinking?: string | null
    smoking?: string | null
    wantsKids?: string | null
    politicalViews?: string | null
  }

  // Use real prompts if the user has set them, otherwise fall back to auto-generated
  const prompts: Array<{ label: string; answer: string; photoUrl?: string | null }> = []

  if (profileAny.prompts && profileAny.prompts.length > 0) {
    // Real user-selected prompts
    for (const p of profileAny.prompts) {
      prompts.push({ label: p.question, answer: p.answer, photoUrl: p.photoUrl })
    }
  } else {
    // Auto-generated fallback
    if (profile.bio) prompts.push({ label: 'About me', answer: profile.bio })
    if (profile.values && profile.values.length > 0)
      prompts.push({ label: 'Something I value', answer: profile.values[0] })
    if (profile.relationshipGoal)
      prompts.push({ label: 'Here for', answer: GOAL_LABELS[profile.relationshipGoal] ?? profile.relationshipGoal })
  }

  const posts = profile.posts ?? []
  const firstPost = posts[0] ?? null
  const secondPost = posts[1] ?? null
  const remainingPosts = posts.slice(2)

  const hasExperiences = experiences && experiences.length > 0
  const hasEducation = education && education.length > 0
  const hasSimilar = similarUsers && similarUsers.length > 0
  const hasCredentials = profile.gpa || profile.sat || profile.act || profile.idVerified
  const hasSocials =
    profile.socialLinks &&
    (profile.socialLinks.instagram ||
      profile.socialLinks.twitter ||
      profile.socialLinks.tiktok ||
      profile.socialLinks.linkedin)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
      className="min-h-screen bg-white pb-24"
    >
      {/* Photo lightbox overlay */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute right-4 top-safe top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close"
            >
              <XIcon size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={lightboxPhoto}
              alt=""
              className="max-h-screen max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-md">

        {/* ── 1. First photo block ───────────────────────────────────────────── */}
        <div className="relative px-4 pt-4">
          {/* Back button — absolute over photo */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Verified badge — absolute top-right */}
          {profile.idVerified && (
            <div className="absolute right-6 top-6 z-10 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
              <ShieldCheck size={12} />
              Verified
            </div>
          )}

          {profile.profilePhotoUrl ? (
            <img
              src={profile.profilePhotoUrl}
              alt={fullName}
              className="aspect-[4/5] w-full rounded-[24px] object-cover"
              width={500}
              height={625}
            />
          ) : (
            <div className="aspect-[4/5] w-full rounded-[24px] bg-gray-100 flex items-center justify-center">
              <span className="font-display text-7xl font-bold text-gray-300">
                {profile.firstName.charAt(0)}
              </span>
            </div>
          )}

          {/* Name overlay */}
          <div className="absolute bottom-6 left-8 right-8">
            <div
              className="font-display text-4xl font-bold text-white"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}
            >
              {profile.firstName}{' '}
              <span className="text-3xl font-light text-white/80">{profile.age}</span>
            </div>
            {profile.headline && (
              <p
                className="mt-1 text-sm text-white/85"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
              >
                {profile.headline}
              </p>
            )}
          </div>
        </div>

        {/* ── 2. Identity chips ─────────────────────────────────────────────── */}
        {(profile.college || profile.currentRole || profile.locationLabel) && (
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4">
            {profile.college && (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                <GraduationCap size={12} className="text-gray-400" />
                {profile.college.name}
              </span>
            )}
            {profile.major && !profile.currentRole && (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                <BookOpen size={12} className="text-gray-400" />
                {profile.major}
              </span>
            )}
            {(profile.currentRole || profile.company) && (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                <Briefcase size={12} className="text-gray-400" />
                {[profile.currentRole, profile.company].filter(Boolean).join(' at ')}
              </span>
            )}
            {profile.locationLabel && (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                <MapPin size={12} className="text-gray-400" />
                {profile.locationLabel}
              </span>
            )}
            {profile.futureLocation && (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
                <ArrowRight size={12} className="text-gray-400" />
                Moving to {profile.futureLocation}
              </span>
            )}
          </div>
        )}

        {/* ── Compatibility score ─────────────────────────────────────────── */}
        {compatibilityData && userId !== user?.id && (
          <div className="mt-3 px-4">
            <div className="rounded-[20px] bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-300">Compatibility</p>
                <span className="font-display text-3xl font-bold text-white">{Math.round(compatibilityData.score * 100)}%</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Goals', value: compatibilityData.breakdown.goals, max: 20 },
                  { label: 'Interests', value: compatibilityData.breakdown.interests, max: 15 },
                  { label: 'Values', value: compatibilityData.breakdown.values, max: 15 },
                  { label: 'Location', value: compatibilityData.breakdown.location, max: 10 },
                  { label: 'Lifestyle', value: compatibilityData.breakdown.lifestyle, max: 5 },
                  { label: 'Connection', value: compatibilityData.breakdown.social, max: 10 },
                ].map(({ label, value, max }, index) => {
                  const pct = (value / max) * 100
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-20 text-xs font-medium text-purple-300 flex-shrink-0">{label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-purple-400"
                          initial={{ width: '0%' }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-white/60 w-8 text-right">{value}/{max}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── About / Lifestyle card ────────────────────────────────────────────── */}
        {(profileAny.height || profileAny.religion || profileAny.ethnicity || profileAny.drinking || profileAny.wantsKids || profileAny.birthCity || profileAny.smoking || profileAny.politicalViews || profileAny.sexuality) && (
          <div className="mt-3 px-4">
            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">About</p>
              <div className="flex flex-wrap gap-2">
                {profileAny.height && (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
                    📏 {profileAny.height}
                  </span>
                )}
                {profileAny.religion && (
                  <span className="flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700">
                    🙏 {profileAny.religion}
                  </span>
                )}
                {profileAny.ethnicity && (
                  <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
                    {profileAny.ethnicity}
                  </span>
                )}
                {profileAny.birthCity && (
                  <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
                    🌍 Born in {profileAny.birthCity}
                  </span>
                )}
                {profileAny.drinking && profileAny.drinking !== 'Never' && (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
                    🍷 Drinks {profileAny.drinking.toLowerCase()}
                  </span>
                )}
                {profileAny.drinking === 'Never' && (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
                    🚫 Doesn&apos;t drink
                  </span>
                )}
                {profileAny.wantsKids && (
                  <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
                    👶 {profileAny.wantsKids}
                  </span>
                )}
                {profileAny.smoking && profileAny.smoking !== 'Never' && (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
                    🚬 Smokes {profileAny.smoking.toLowerCase()}
                  </span>
                )}
                {profileAny.politicalViews && (
                  <span className="flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700">
                    🗳 {profileAny.politicalViews}
                  </span>
                )}
                {profileAny.sexuality && (
                  <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
                    {profileAny.sexuality}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Name pronunciation ─────────────────────────────────────────────── */}
        {profileAny.namePronunciationUrl && (
          <div className="mt-3 px-4">
            <AudioPlayer
              url={profileAny.namePronunciationUrl}
              label={`Hear how to say ${profile.firstName}'s name`}
            />
          </div>
        )}

        {/* ── 3. Hinge-style interleaved: prompt → photo strip → prompt → photo strip → prompt ── */}
        {prompts.length > 0 && (
          <div className="mt-3 px-4 space-y-3">
            {/* First prompt */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 * 0.06, duration: 0.22 }}
              className="rounded-[20px] overflow-hidden"
              style={{ background: 'white' }}
            >
              <PromptCard
                label={prompts[0].label}
                answer={prompts[0].answer}
                photoUrl={prompts[0].photoUrl ?? undefined}
                voiceUrl={(profileAny.prompts?.[0] as any)?.voiceUrl ?? undefined}
                onLike={() => connectMutation.mutate(undefined)}
                likeDisabled={connectMutation.isPending || sentLike || matched}
              />
            </motion.div>

            {/* Photo strip — first post or cropped profile photo */}
            {firstPost ? (
              <div>
                <img
                  src={firstPost.imageUrl}
                  alt={firstPost.caption ?? fullName}
                  className="aspect-[4/5] w-full rounded-[24px] object-cover"
                />
                {firstPost.caption && (
                  <p className="mt-2 px-1 text-sm leading-relaxed text-gray-500">{firstPost.caption}</p>
                )}
              </div>
            ) : profile.profilePhotoUrl ? (
              <div className="relative overflow-hidden rounded-[24px]" style={{ height: 220 }}>
                <img
                  src={profile.profilePhotoUrl}
                  alt={fullName}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    {profile.firstName} · {profile.age}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Second prompt */}
            {prompts.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 * 0.06, duration: 0.22 }}
                className="rounded-[20px] overflow-hidden"
                style={{ background: 'rgba(139,92,246,0.04)' }}
              >
                <PromptCard
                  label={prompts[1].label}
                  answer={prompts[1].answer}
                  photoUrl={prompts[1].photoUrl ?? undefined}
                  voiceUrl={(profileAny.prompts?.[1] as any)?.voiceUrl ?? undefined}
                  onLike={() => connectMutation.mutate(undefined)}
                  likeDisabled={connectMutation.isPending || sentLike || matched}
                />
              </motion.div>
            )}

            {/* Second photo strip — second post or a gradient brand card */}
            {secondPost ? (
              <div>
                <img
                  src={secondPost.imageUrl}
                  alt={secondPost.caption ?? fullName}
                  className="aspect-[4/5] w-full rounded-[24px] object-cover"
                />
                {secondPost.caption && (
                  <p className="mt-2 px-1 text-sm leading-relaxed text-gray-500">{secondPost.caption}</p>
                )}
              </div>
            ) : (prompts.length > 2 && userId === user?.id) ? (
              // Apex-branded interstitial card when no second photo
              <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900" style={{ height: 160 }}>
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.3) 0%, transparent 50%)' }}
                />
                <div className="relative flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-300">Apex</p>
                  <p className="font-display text-lg font-bold text-white leading-snug">
                    The top of the food chain.
                  </p>
                </div>
              </div>
            ) : null}

            {/* Third prompt */}
            {prompts.length > 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 * 0.06, duration: 0.22 }}
                className="rounded-[20px] overflow-hidden"
                style={{ background: 'rgba(251,191,36,0.06)' }}
              >
                <PromptCard
                  label={prompts[2].label}
                  answer={prompts[2].answer}
                  photoUrl={prompts[2].photoUrl ?? undefined}
                  voiceUrl={(profileAny.prompts?.[2] as any)?.voiceUrl ?? undefined}
                  onLike={() => connectMutation.mutate(undefined)}
                  likeDisabled={connectMutation.isPending || sentLike || matched}
                />
              </motion.div>
            )}

            {/* Fourth and fifth prompts */}
            {prompts.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3 * 0.06, duration: 0.22 }}
                className="rounded-[20px] overflow-hidden"
                style={{ background: 'white' }}
              >
                <PromptCard
                  label={prompts[3].label}
                  answer={prompts[3].answer}
                  photoUrl={prompts[3].photoUrl ?? undefined}
                  voiceUrl={(profileAny.prompts?.[3] as any)?.voiceUrl ?? undefined}
                  onLike={() => connectMutation.mutate(undefined)}
                  likeDisabled={connectMutation.isPending || sentLike || matched}
                />
              </motion.div>
            )}
            {prompts.length > 4 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4 * 0.06, duration: 0.22 }}
                className="rounded-[20px] overflow-hidden"
                style={{ background: 'rgba(139,92,246,0.04)' }}
              >
                <PromptCard
                  label={prompts[4].label}
                  answer={prompts[4].answer}
                  photoUrl={prompts[4].photoUrl ?? undefined}
                  voiceUrl={(profileAny.prompts?.[4] as any)?.voiceUrl ?? undefined}
                  onLike={() => connectMutation.mutate(undefined)}
                  likeDisabled={connectMutation.isPending || sentLike || matched}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* ── 5. Credentials card ───────────────────────────────────────────── */}
        {hasCredentials && (
          <div className="mt-3 px-4">
            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                Credentials
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  profile.gpa ? { key: 'gpa', content: `GPA ${profile.gpa.toFixed(2)}`, className: 'bg-amber-50', iconClass: 'text-amber-600', textClass: 'text-amber-800' } : null,
                  profile.sat ? { key: 'sat', content: `SAT ${profile.sat}`, className: 'bg-blue-50', iconClass: 'text-blue-600', textClass: 'text-blue-800' } : null,
                  profile.act ? { key: 'act', content: `ACT ${profile.act}`, className: 'bg-blue-50', iconClass: 'text-blue-600', textClass: 'text-blue-800' } : null,
                  profile.idVerified ? { key: 'verified', content: 'Apex Verified', className: 'bg-emerald-50', iconClass: 'text-emerald-600', textClass: 'text-emerald-800', isVerified: true } : null,
                ].filter(Boolean).map((pill, index) => {
                  if (!pill) return null
                  return (
                    <motion.div
                      key={pill.key}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.06, type: 'spring', stiffness: 320, damping: 22 }}
                      className={`flex items-center gap-2 rounded-full ${pill.className} px-4 py-2`}
                    >
                      {pill.isVerified ? (
                        <ShieldCheck size={13} className={pill.iconClass} />
                      ) : (
                        <Award size={13} className={pill.iconClass} />
                      )}
                      <span className={`text-sm font-semibold ${pill.textClass}`}>{pill.content}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── 6. Experience section ─────────────────────────────────────────── */}
        {hasExperiences && (
          <div className="mt-3 px-4">
            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-bold text-gray-900">Experience</p>
              <div className="space-y-4">
                {experiences.map((exp, i) => (
                  <ExperienceItem key={exp.id} exp={exp} isLast={i === experiences.length - 1} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 7. Education section ──────────────────────────────────────────── */}
        {hasEducation && (
          <div className="mt-3 px-4">
            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-bold text-gray-900">Education</p>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <EducationItem key={edu.id} edu={edu} isLast={i === education.length - 1} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 8. Interests + Values ─────────────────────────────────────────── */}
        {((profile.interests && profile.interests.length > 0) ||
          (profile.values && profile.values.length > 0)) && (
          <div className="mt-3 px-4">
            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              {profile.interests && profile.interests.length > 0 && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                    Interests
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {profile.values && profile.values.length > 0 && (
                <>
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 ${
                      profile.interests && profile.interests.length > 0 ? 'mt-4' : ''
                    }`}
                  >
                    Values
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.values.map((value) => (
                      <span
                        key={value}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}


        {/* ── Voice prompt ──────────────────────────────────────────────────── */}
        {profileAny.voicePromptUrl && (
          <div className="mt-3 px-4">
            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              {profileAny.voicePromptQuestion && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Voice prompt
                </p>
              )}
              {profileAny.voicePromptQuestion && (
                <p className="font-display mt-2 text-xl font-bold text-gray-900">
                  {profileAny.voicePromptQuestion}
                </p>
              )}
              <div className={profileAny.voicePromptQuestion ? 'mt-4' : ''}>
                <AudioPlayer url={profileAny.voicePromptUrl} label="Play voice prompt" />
              </div>
            </div>
          </div>
        )}

        {/* ── 10. Instagram-style posts grid ────────────────────────────────── */}
        {remainingPosts.length > 0 && (
          <div className="mt-3 px-4">
            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">Life updates</p>
                <p className="text-xs text-gray-400">{remainingPosts.length} posts</p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {remainingPosts.map((post) => (
                  <div key={post.id} className="overflow-hidden rounded-lg">
                    <img
                      src={post.imageUrl}
                      alt={post.caption ?? fullName}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 11. Socials ───────────────────────────────────────────────────── */}
        {hasSocials && profile.socialLinks && (
          <div className="mt-3 px-4">
            <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                Socials
              </p>
              <div className="space-y-2">
                {profile.socialLinks.instagram && (
                  <SocialRow
                    label="Instagram"
                    href={`https://instagram.com/${profile.socialLinks.instagram}`}
                    icon={<Instagram size={16} />}
                    value={`@${profile.socialLinks.instagram}`}
                  />
                )}
                {profile.socialLinks.twitter && (
                  <SocialRow
                    label="X"
                    href={`https://x.com/${profile.socialLinks.twitter}`}
                    icon={<Twitter size={16} />}
                    value={`@${profile.socialLinks.twitter}`}
                  />
                )}
                {profile.socialLinks.tiktok && (
                  <SocialRow
                    label="TikTok"
                    href={`https://tiktok.com/@${profile.socialLinks.tiktok}`}
                    icon={<Music2 size={16} />}
                    value={`@${profile.socialLinks.tiktok}`}
                  />
                )}
                {profile.socialLinks.linkedin && (
                  <SocialRow
                    label="LinkedIn"
                    href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                    icon={<Linkedin size={16} />}
                    value={profile.socialLinks.linkedin}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 12. Connection note (if present) ──────────────────────────────── */}
        {profile.connection?.introMessage && (
          <div className="mt-4 px-4">
            <div className="rounded-[20px] border border-purple-100 bg-purple-50 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-500">
                {incomingNote ? 'Their note to you' : 'Connection note'}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-purple-900">
                {profile.connection.introMessage}
              </p>
            </div>
          </div>
        )}

        {/* ── 13. Similar people ────────────────────────────────────────────── */}
        {hasSimilar && (
          <div className="mt-4">
            <p className="mb-3 px-4 text-sm font-bold text-gray-900">
              Similar to {profile.firstName}
            </p>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
              {similarUsers.map((person) => (
                <SimilarPersonCard
                  key={person.id}
                  person={person}
                  onExpress={(id) => navigate(`/profile/${id}`)}
                  disabled={false}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Fixed bottom bar ──────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent px-4 pb-8 pt-5">
        <div className="mx-auto max-w-md">
          {matched ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/chat/${matchId ?? profile.connection?.id ?? ''}`)}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-gray-900 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-gray-800"
            >
              <MessageSquare size={18} />
              Open Conversation
            </motion.button>
          ) : sentLike ? (
            <button
              disabled
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-gray-100 text-sm font-semibold text-gray-400 shadow-sm"
            >
              <Heart size={18} />
              Interest Sent
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setNoteModalOpen(true)}
                className="flex h-14 items-center justify-center gap-2 rounded-[18px] border border-gray-200 bg-white text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50"
              >
                <MessageSquare size={18} />
                Add Note
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => connectMutation.mutate(undefined)}
                disabled={connectMutation.isPending}
                className="flex h-14 items-center justify-center gap-2 rounded-[18px] bg-purple-600 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-purple-700 disabled:opacity-60"
              >
                <Heart size={18} />
                {connectMutation.isPending ? 'Sending…' : 'Express Interest'}
              </motion.button>
            </div>
          )}
        </div>
      </div>

      <ConnectionNoteModal
        isOpen={noteModalOpen}
        isLoading={connectMutation.isPending}
        profileName={profile.firstName}
        onClose={() => setNoteModalOpen(false)}
        onSend={(message) => connectMutation.mutate(message)}
      />
    </motion.div>
  )
}
