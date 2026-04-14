import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  Building2,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'
import ConnectionNoteModal from '../../components/profile/ConnectionNoteModal'
import { matchesApi } from '../../api/matches'
import { usersApi } from '../../api/users'
import { gameApi } from '../../api/game'
import type { DiscoverProfile, ProfileViewer } from '../../types'

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

interface ConfettiParticle {
  id: number
  tx: number
  ty: number
  rotate: number
  scale: number
  color: string
  size: number
  duration: number
  delay: number
}

const CONFETTI_COLORS = ['#7c3aed', '#a78bfa', '#f59e0b', '#ec4899', '#10b981', '#60a5fa', '#fff', '#f472b6'] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PASSED_IDS_KEY = 'apex_passed_ids'
const DAILY_DROP_KEY = 'apex_daily_drop'
const DAILY_ACTED_KEY = 'apex_daily_acted'
const DAILY_DROP_LIMIT = 10

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function loadDailyDrop(): { date: string; ids: string[] } | null {
  try {
    const raw = localStorage.getItem(DAILY_DROP_KEY)
    if (!raw) return null
    return JSON.parse(raw) as { date: string; ids: string[] }
  } catch {
    return null
  }
}

function saveDailyDrop(ids: string[]): void {
  try {
    localStorage.setItem(DAILY_DROP_KEY, JSON.stringify({ date: getTodayKey(), ids }))
  } catch { /* no-op */ }
}

function loadDailyActed(): Set<string> {
  try {
    const raw = localStorage.getItem(DAILY_ACTED_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as { date: string; ids: string[] }
    if (parsed.date !== getTodayKey()) return new Set()
    return new Set(parsed.ids)
  } catch {
    return new Set()
  }
}

function saveDailyActed(id: string): void {
  try {
    const existing = loadDailyActed()
    existing.add(id)
    localStorage.setItem(DAILY_ACTED_KEY, JSON.stringify({ date: getTodayKey(), ids: Array.from(existing) }))
  } catch { /* no-op */ }
}

// ---------------------------------------------------------------------------
// Countdown timer component
// ---------------------------------------------------------------------------

function CountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const compute = useCallback(() => {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const diffMs = midnight.getTime() - now.getTime()
    const h = Math.floor(diffMs / 3_600_000)
    const m = Math.floor((diffMs % 3_600_000) / 60_000)
    const s = Math.floor((diffMs % 60_000) / 1_000)
    setTimeLeft(`${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`)
  }, [])

  useEffect(() => {
    compute()
    timerRef.current = setInterval(compute, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [compute])

  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <motion.div
        className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-purple-50"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Clock size={32} className="text-purple-400" />
      </motion.div>
      <h2 className="text-xl font-bold text-gray-900 mt-3">You've seen everyone for today</h2>
      <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
        New picks drop at midnight. Come back tomorrow — the right one might be in tomorrow's drop.
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-purple-50 px-5 py-2.5">
        <Clock size={14} className="text-purple-500" />
        <span className="font-mono text-sm font-semibold text-purple-700">{timeLeft}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Who Liked You row
// ---------------------------------------------------------------------------

function WhoLikedYouRow({ viewers }: { viewers: ProfileViewer[] }) {
  const navigate = useNavigate()
  if (viewers.length === 0) return null

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.22, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart size={15} className="text-purple-600" fill="#7c3aed" />
          </motion.div>
          <span className="text-sm font-bold text-gray-900">
            {viewers.length === 1 ? '1 person' : `${viewers.length} people`} liked you
          </span>
        </div>
        <span className="text-xs text-purple-600 font-medium">Tap to connect</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide">
        {viewers.map((v) => (
          <button
            key={v.id}
            onClick={() => navigate(`/user/${v.viewer.id}`)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className="relative">
              {v.viewer.profilePhotoUrl ? (
                <img
                  src={v.viewer.profilePhotoUrl}
                  alt="Profile"
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-purple-200"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-300 to-violet-500 flex items-center justify-center border-2 border-purple-200">
                  <Heart size={22} className="text-white" fill="white" />
                </div>
              )}
              {v.viewer.idVerified && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <ShieldCheck size={11} className="text-white" />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 font-medium max-w-[64px] truncate text-center">
              {v.viewer.college?.name?.split(' ')[0] ?? 'Member'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function loadPassedIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(PASSED_IDS_KEY)
    return raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set<string>()
  } catch {
    return new Set<string>()
  }
}

function savePassedId(id: string): void {
  try {
    const existing = loadPassedIds()
    existing.add(id)
    sessionStorage.setItem(PASSED_IDS_KEY, JSON.stringify(Array.from(existing)))
  } catch {
    // no-op
  }
}

function getSubheading(profile: DiscoverProfile): string | null {
  if (profile.headline) return profile.headline
  if (profile.currentRole && profile.company) return `${profile.currentRole} at ${profile.company}`
  return profile.currentRole ?? profile.major ?? null
}

// ---------------------------------------------------------------------------
// Feed card component
// ---------------------------------------------------------------------------

interface FeedCardProps {
  profile: DiscoverProfile
  acted: 'liked' | 'passed' | null
  pending: boolean
  onLike: () => void
  onPass: () => void
  onNote: () => void
}

function DiscoverFeedCard({ profile, acted, pending, onLike, onPass, onNote }: FeedCardProps) {
  const navigate = useNavigate()
  const [imgLoaded, setImgLoaded] = useState(false)
  const subheading = getSubheading(profile)

  return (
    <motion.div
      layout
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
    >
      {/* ── Full-bleed photo ── */}
      <div
        className="relative w-full cursor-pointer overflow-hidden"
        style={{ aspectRatio: '4/5' }}
        onClick={() => navigate(`/user/${profile.id}`)}
      >
        {/* Skeleton shimmer */}
        {!imgLoaded && profile.profilePhotoUrl && (
          <div className="absolute inset-0 overflow-hidden bg-gray-100">
            <motion.div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        {profile.profilePhotoUrl ? (
          <motion.img
            src={profile.profilePhotoUrl}
            alt={profile.firstName}
            className="h-full w-full object-cover"
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={imgLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-300 via-violet-400 to-indigo-500">
            <span className="select-none text-[120px] font-bold text-white/50">
              {profile.firstName[0]}
            </span>
          </div>
        )}

        {/* Dark gradient — heavier at bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

        {/* Top badges */}
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            {profile.idVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
                <ShieldCheck size={11} />
                Verified
              </span>
            )}
            {profile.matchScore != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-600/80 px-2.5 py-1 text-xs font-semibold text-white shadow backdrop-blur-sm">
                <Sparkles size={10} />
                {Math.round(profile.matchScore * 100)}% match
              </span>
            )}
            {profile.matchScore && profile.matchScore > 0.75 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 25 }}
                className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow backdrop-blur-sm"
              >
                🔥 Hot today
              </motion.span>
            )}
            {profile.greekOrganization && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                {profile.greekOrganizationType === 'FRATERNITY' ? '🏛️' : profile.greekOrganizationType === 'SORORITY' ? '💜' : '⚡'} {profile.greekOrganization}
              </span>
            )}
          </div>
          {profile.college && (
            <span className="rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {profile.college.name}
            </span>
          )}
        </div>

        {/* Bottom name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-5">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-[42px] font-black leading-none text-white drop-shadow-lg">
                  {profile.firstName}
                  <span className="ml-2 font-sans text-[26px] font-light text-white/80">{profile.age}</span>
                </h2>
                {profile.connectionDegree && (
                  <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
                    {profile.connectionDegree === 2 ? '2nd' : '3rd'}
                  </span>
                )}
              </div>
              {subheading && (
                <p className="mt-0.5 truncate text-sm text-white/75">{subheading}</p>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/user/${profile.id}`) }}
              className="flex flex-shrink-0 items-center gap-1 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
            >
              Full profile
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Acted overlay — shown briefly before card collapses */}
        <AnimatePresence>
          {acted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.22 }}
              className={`absolute inset-0 flex items-center justify-center ${
                acted === 'liked' ? 'bg-purple-900/55' : 'bg-gray-900/45'
              }`}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg ${
                  acted === 'liked' ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                {acted === 'liked' ? (
                  <>
                    <Heart size={16} fill="white" />
                    Interest Sent ✨
                  </>
                ) : (
                  <>
                    <X size={16} />
                    Passed
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Info + actions strip ── */}
      <div className="bg-white px-4 pt-3 pb-4">
        {/* Location / relocation pills */}
        {(profile.locationLabel || profile.workLocation || profile.futureLocation) && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {profile.locationLabel && (
              <span className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                <MapPin size={11} className="text-gray-400" />
                {profile.locationLabel}
              </span>
            )}
            {profile.workLocation && profile.workLocation !== profile.locationLabel && (
              <span className="inline-flex items-center gap-1 rounded-xl bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                <Building2 size={11} className="text-gray-400" />
                Works in {profile.workLocation}
              </span>
            )}
            {profile.futureLocation && (
              <span className="inline-flex items-center gap-1 rounded-xl bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                Moving to {profile.futureLocation}
              </span>
            )}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="mb-2.5 line-clamp-3 text-sm leading-relaxed text-gray-700">
            {profile.bio}
          </p>
        )}

        {/* Credentials */}
        {(profile.gpa || profile.sat || profile.act) && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {profile.gpa && (
              <span className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                <Award size={11} />
                GPA {profile.gpa.toFixed(2)}
              </span>
            )}
            {profile.sat && (
              <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                <Award size={11} />
                SAT {profile.sat}
              </span>
            )}
            {profile.act && (
              <span className="inline-flex items-center gap-1 rounded-xl bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                <Award size={11} />
                ACT {profile.act}
              </span>
            )}
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {profile.interests.slice(0, 5).map((interest) => (
              <span
                key={interest}
                className="rounded-xl bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          {/* Pass — satisfying flick */}
          <motion.button
            whileTap={{ scale: 0.78, rotate: -14, x: -3 }}
            whileHover={{ scale: 1.06 }}
            onClick={onPass}
            disabled={!!acted || pending}
            className="group flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-gray-200 bg-white text-gray-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
            style={{ width: '3.25rem', height: '3.25rem' }}
          >
            <X size={20} strokeWidth={2.5} />
          </motion.button>

          {/* Note */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.05 }}
            onClick={onNote}
            disabled={!!acted || pending}
            className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-100 transition hover:bg-gray-200 disabled:opacity-40"
            style={{ width: '3.25rem', height: '3.25rem' }}
            title="Send with a note"
          >
            <MessageSquare size={17} className="text-gray-500" />
          </motion.button>

          {/* Connect — the dopamine button */}
          <motion.button
            animate={!acted && !pending ? {
              boxShadow: [
                '0 4px 16px rgba(124,58,237,0.3)',
                '0 8px 36px rgba(124,58,237,0.7)',
                '0 4px 16px rgba(124,58,237,0.3)',
              ],
            } : {}}
            transition={!acted && !pending ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : {}}
            whileTap={{ scale: 0.91, y: 2 }}
            whileHover={{ scale: 1.04, boxShadow: '0 12px 48px rgba(124,58,237,0.75)' }}
            onClick={onLike}
            disabled={!!acted || pending}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 py-4 text-sm font-bold tracking-wide text-white disabled:opacity-40"
          >
            {pending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <motion.span
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Heart size={18} fill="white" stroke="none" />
                </motion.span>
                Connect
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Card separator — mimics Instagram's gray gap between posts */}
      <div className="h-2.5 bg-gray-100" />
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Skeleton feed card
// ---------------------------------------------------------------------------

function FeedSkeleton() {
  const shimmer = (delay = 0) => (
    <motion.div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)' }}
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay }}
    />
  )
  return (
    <div>
      <div className="aspect-[4/5] w-full bg-gray-100 relative overflow-hidden">{shimmer(0)}</div>
      <div className="bg-white px-4 pt-3 pb-4">
        <div className="mb-2 flex gap-2">
          <div className="h-6 w-20 rounded-xl bg-gray-100 relative overflow-hidden">{shimmer(0.1)}</div>
          <div className="h-6 w-24 rounded-xl bg-gray-100 relative overflow-hidden">{shimmer(0.15)}</div>
        </div>
        <div className="mb-1.5 h-4 w-3/4 rounded bg-gray-100 relative overflow-hidden">{shimmer(0.2)}</div>
        <div className="mb-3 h-4 w-1/2 rounded bg-gray-100 relative overflow-hidden">{shimmer(0.25)}</div>
        <div className="flex gap-2">
          <div className="h-12 flex-1 rounded-2xl bg-gray-100 relative overflow-hidden">{shimmer(0.3)}</div>
          <div className="h-12 w-12 rounded-2xl bg-gray-100 relative overflow-hidden">{shimmer(0.35)}</div>
          <div className="h-12 flex-1 rounded-2xl bg-gray-100 relative overflow-hidden">{shimmer(0.3)}</div>
        </div>
      </div>
      <div className="h-2.5 bg-gray-100 relative overflow-hidden">{shimmer(0.1)}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function DiscoverPage() {
  const queryClient = useQueryClient()

  // Track per-card state in parent for full control
  const [cardActed, setCardActed] = useState<Record<string, 'liked' | 'passed'>>({})
  const [cardPending, setCardPending] = useState<Record<string, boolean>>({})
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set())

  // Note modal
  const [noteProfile, setNoteProfile] = useState<DiscoverProfile | null>(null)
  const [sendingNote, setSendingNote] = useState(false)

  // XP / gamification
  const [xpToast, setXpToast] = useState<string | null>(null)
  const [challengeProgress, setChallengeProgress] = useState(0)

  // Match celebration
  const [likedMatch, setLikedMatch] = useState<string | null>(null)
  const [showMatch, setShowMatch] = useState(false)

  const { data: rawProfiles, isLoading, error, refetch } = useQuery<DiscoverProfile[]>({
    queryKey: ['discover'],
    queryFn: matchesApi.discover,
    staleTime: 1000 * 60 * 2,
  })

  const { data: viewers = [] } = useQuery<ProfileViewer[]>({
    queryKey: ['profileViewers'],
    queryFn: usersApi.getProfileViewers,
    staleTime: 1000 * 60 * 5,
  })

  const { data: gameState } = useQuery({
    queryKey: ['game-state'],
    queryFn: gameApi.getState,
    staleTime: 1000 * 60,
  })
  const streak = gameState?.currentStreak ?? 0
  const xpProgress = gameState?.progressToNext ?? 0

  const confettiParticles = useMemo<ConfettiParticle[]>(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2 + (i % 3) * 0.4
      const radius = 120 + (i % 5) * 40
      return {
        id: i,
        tx: Math.cos(angle) * radius * (0.8 + (i % 4) * 0.15),
        ty: Math.sin(angle) * radius * (0.8 + (i % 3) * 0.2) - 60,
        rotate: (i % 7) * 60 - 180,
        scale: 0.6 + (i % 4) * 0.25,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 8 + (i % 4) * 3,
        duration: 0.7 + (i % 5) * 0.12,
        delay: i * 0.025,
      }
    })
  }, [])

  // ── Daily drop: cap to DAILY_DROP_LIMIT profiles per day ──
  const todayDropProfiles = useMemo(() => {
    if (!rawProfiles) return []
    const alreadyActed = loadDailyActed()
    const filtered = rawProfiles.filter(
      (p) => !loadPassedIds().has(p.id) && !alreadyActed.has(p.id)
    )

    const saved = loadDailyDrop()
    if (saved && saved.date === getTodayKey()) {
      // Preserve order from today's saved drop, add only new profiles up to limit
      const savedSet = new Set(saved.ids)
      const inDrop = filtered.filter((p) => savedSet.has(p.id))
      const extra = filtered.filter((p) => !savedSet.has(p.id))
      const combined = [...inDrop, ...extra].slice(0, DAILY_DROP_LIMIT)
      saveDailyDrop(combined.map((p) => p.id))
      return combined
    }

    // Fresh day — pick first DAILY_DROP_LIMIT profiles
    const drop = filtered.slice(0, DAILY_DROP_LIMIT)
    saveDailyDrop(drop.map((p) => p.id))
    return drop
  }, [rawProfiles])

  // Feed = today's drop minus already removed
  const feedProfiles = todayDropProfiles.filter((p) => !removedIds.has(p.id))

  // Daily drop exhausted when feed is empty AND we had profiles today
  const dailyDropDone = !isLoading && !error && feedProfiles.length === 0 && todayDropProfiles.length > 0

  const handleMatchToast = (firstName: string) => {
    setLikedMatch(firstName)
    setShowMatch(true)
    queryClient.invalidateQueries({ queryKey: ['matches'] })
    setTimeout(() => {
      setShowMatch(false)
      setLikedMatch(null)
    }, 1400)
  }

  const removeCard = (id: string, delay: number) => {
    setTimeout(() => {
      setRemovedIds((prev) => new Set([...prev, id]))
    }, delay)
  }

  const handleLike = async (profileId: string, introMessage?: string) => {
    setCardPending((prev) => ({ ...prev, [profileId]: true }))
    try {
      const result = await matchesApi.like(profileId, introMessage)
      setCardActed((prev) => ({ ...prev, [profileId]: 'liked' }))
      saveDailyActed(profileId)
      setChallengeProgress(prev => Math.min(3, prev + 1))
      setXpToast('+10 XP')
      setTimeout(() => setXpToast(null), 1200)
      if (result.matched) {
        const matched = todayDropProfiles.find((p) => p.id === profileId)
        if (matched) handleMatchToast(matched.firstName)
      }
      removeCard(profileId, 650)
    } catch {
      // silently keep the card on failure
    } finally {
      setCardPending((prev) => ({ ...prev, [profileId]: false }))
    }
  }

  const handlePass = (profileId: string) => {
    savePassedId(profileId)
    saveDailyActed(profileId)
    setCardActed((prev) => ({ ...prev, [profileId]: 'passed' }))
    removeCard(profileId, 380)
  }

  const handleSendNote = async (introMessage?: string) => {
    if (!noteProfile) return
    setSendingNote(true)
    try {
      await handleLike(noteProfile.id, introMessage)
      setNoteProfile(null)
    } finally {
      setSendingNote(false)
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-100 pb-24">
        {/* ── Sticky minimal header ── */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-5 pb-3 pt-4">
            <div>
              <span className="text-base font-bold text-gray-900">Discover</span>
              {feedProfiles.length > 0 && (
                <span className="ml-2 text-xs font-medium text-gray-400">
                  {feedProfiles.length} of {DAILY_DROP_LIMIT} today
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <motion.div
                  key={streak}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                  className="flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-2.5 py-1"
                >
                  <span className="text-sm">🔥</span>
                  <span className="text-xs font-bold text-orange-600">{streak}</span>
                </motion.div>
              )}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50">
                <Sparkles size={15} className="text-purple-600" />
              </div>
            </div>
          </div>
          {/* XP progress bar */}
          <div className="h-0.5 bg-gray-100">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* ── Who Liked You row (above feed, transparent/free) ── */}
        {!isLoading && viewers.length > 0 && (
          <WhoLikedYouRow viewers={viewers} />
        )}

        {/* ── Feed ── */}
        {isLoading ? (
          <>
            <FeedSkeleton />
            <FeedSkeleton />
          </>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <X size={26} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Couldn't load profiles</h2>
              <p className="mt-1 text-sm text-gray-500">Try again in a moment.</p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        ) : dailyDropDone ? (
          <CountdownToMidnight />
        ) : feedProfiles.length === 0 ? (
          <div className="flex flex-col items-center gap-5 px-6 py-20 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-purple-50">
              <Sparkles size={36} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">No picks yet today</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Our algorithm is finding your best matches. Check back soon.
              </p>
            </div>
            <button
              onClick={() => {
                try { sessionStorage.removeItem(PASSED_IDS_KEY) } catch { /* no-op */ }
                setRemovedIds(new Set())
                setCardActed({})
                queryClient.invalidateQueries({ queryKey: ['discover'] })
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-purple-50 px-5 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        ) : (
          <LayoutGroup>
            {/* Daily Challenge */}
            <AnimatePresence>
              {challengeProgress < 3 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-0 mb-0 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Daily Challenge</p>
                        <p className="mt-0.5 text-sm font-semibold">Send interest to 3 people → +100 XP</p>
                      </div>
                      <p className="text-3xl font-black tabular-nums">{challengeProgress}<span className="text-lg font-medium opacity-60">/3</span></p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/30">
                      <motion.div
                        className="h-full rounded-full bg-white"
                        animate={{ width: `${(challengeProgress / 3) * 100}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {feedProfiles.map((profile, feedIndex) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: feedIndex * 0.07, duration: 0.3, ease: 'easeOut' }}
                >
                  <DiscoverFeedCard
                    profile={profile}
                    acted={cardActed[profile.id] ?? null}
                    pending={cardPending[profile.id] ?? false}
                    onLike={() => void handleLike(profile.id)}
                    onPass={() => handlePass(profile.id)}
                    onNote={() => setNoteProfile(profile)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </LayoutGroup>
        )}
      </div>

      {/* ── Connection note modal ── */}
      <ConnectionNoteModal
        isOpen={noteProfile !== null}
        isLoading={sendingNote}
        profileName={noteProfile?.firstName ?? 'this person'}
        onClose={() => setNoteProfile(null)}
        onSend={(message) => void handleSendNote(message)}
      />

      {/* XP toast */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full bg-purple-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-purple-500/30 pointer-events-none"
          >
            {xpToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── It's a Match fullscreen overlay ── */}
      <AnimatePresence>
        {showMatch && likedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900"
          >
            {/* Concentric ring pulses */}
            {([0, 0.15, 0.3] as const).map((delay, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2 border-white/20"
                style={{ width: 180, height: 180 }}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 1.2, delay, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.8 }}
              />
            ))}

            {/* Confetti particles */}
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-sm pointer-events-none"
                style={{ width: p.size, height: p.size, backgroundColor: p.color, left: '50%', top: '50%' }}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
                animate={{ x: p.tx, y: p.ty, opacity: 0, rotate: p.rotate, scale: p.scale }}
                transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
              />
            ))}

            {/* Main content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.06 }}
              className="flex flex-col items-center gap-4 px-8 text-center relative z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, delay: 0.2, repeat: 2 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10"
              >
                <Heart size={40} className="text-white" fill="white" />
              </motion.div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-300">
                New Connection
              </p>
              <h2 className="font-display text-4xl font-bold text-white">It's a Match!</h2>
              <p className="text-base text-white/70">
                You and {likedMatch} both expressed interest.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  )
}
