import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  GraduationCap,
  LocateFixed,
  MapPin,
  SearchX,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'
import Button from '../../components/ui/Button'
import { searchApi } from '../../api/search'
import { matchesApi } from '../../api/matches'
import { usersApi } from '../../api/users'
import { AUTH_QUERY_KEY, useAuth } from '../../hooks/useAuth'
import type { DiscoverProfile, NearbyProfile } from '../../types'

const EXAMPLE_QUERIES = [
  'Verified person already in Chicago or moving there',
  'Michigan student with a job in Chicago',
  'ACT 34+ engineer serious about marriage',
  'Finance person who works in New York',
]

const gradients = [
  'from-purple-400 to-violet-500',
  'from-pink-400 to-rose-500',
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
]

function getGradient(name: string): string {
  return gradients[name.charCodeAt(0) % gradients.length]
}

// --- Skeleton card for loading state ---
function SkeletonCard() {
  const shimmer = (delay = 0) => (
    <motion.div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)' }}
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay }}
    />
  )
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex gap-4 p-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 relative overflow-hidden flex-shrink-0">{shimmer(0)}</div>
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-gray-100 rounded w-2/3 relative overflow-hidden">{shimmer(0.1)}</div>
          <div className="h-3 bg-gray-100 rounded w-1/2 relative overflow-hidden">{shimmer(0.2)}</div>
          <div className="h-3 bg-gray-100 rounded w-3/4 relative overflow-hidden">{shimmer(0.25)}</div>
          <div className="flex gap-1 mt-1">
            <div className="h-5 w-16 bg-gray-100 rounded-full relative overflow-hidden">{shimmer(0.3)}</div>
            <div className="h-5 w-12 bg-gray-100 rounded-full relative overflow-hidden">{shimmer(0.35)}</div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <div className="flex-1 h-8 bg-gray-100 rounded-xl relative overflow-hidden">{shimmer(0.15)}</div>
        <div className="flex-1 h-8 bg-gray-100 rounded-xl relative overflow-hidden">{shimmer(0.2)}</div>
      </div>
    </div>
  )
}

function NearbyRadar({
  profiles,
  originLatitude,
  originLongitude,
  onSelect,
}: {
  profiles: DiscoverProfile[]
  originLatitude: number
  originLongitude: number
  onSelect: (profileId: string) => void
}) {
  const plotted = profiles.slice(0, 12)
  const maxDelta =
    plotted.reduce((max, profile) => {
      if (profile.latitude == null || profile.longitude == null) return max
      const latDelta = Math.abs(profile.latitude - originLatitude)
      const lonDelta = Math.abs(profile.longitude - originLongitude)
      return Math.max(max, latDelta, lonDelta)
    }, 0.02) || 0.02

  return (
    <div className="relative aspect-square overflow-hidden rounded-[28px] border border-gray-100 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.08),_transparent_55%),linear-gradient(180deg,#ffffff_0%,#f8f5ef_100%)]">
      {[20, 38, 56].map((ring) => (
        <div
          key={ring}
          className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-purple-200/80"
          style={{
            width: `${ring}%`,
            height: `${ring}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#111827] text-xs font-semibold text-white shadow-lg">
        You
      </div>

      {plotted.map((profile) => {
        if (profile.latitude == null || profile.longitude == null) return null

        const x = 50 + ((profile.longitude - originLongitude) / maxDelta) * 28
        const y = 50 - ((profile.latitude - originLatitude) / maxDelta) * 28

        return (
          <button
            key={profile.id}
            type="button"
            onClick={() => onSelect(profile.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
            style={{ left: `${Math.max(8, Math.min(92, x))}%`, top: `${Math.max(8, Math.min(92, y))}%` }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-purple-600 text-sm font-semibold text-white shadow-md">
              {profile.firstName[0]}
            </div>
            {profile.distanceMiles !== undefined && (
              <div className="mt-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-700 shadow-sm">
                {Math.round(profile.distanceMiles)} mi
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

// --- LinkedIn-style profile card ---
function SearchProfileCard({ profile }: { profile: DiscoverProfile }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [interested, setInterested] = useState(false)

  const { mutate: sendInterest, isPending } = useMutation({
    mutationFn: () => matchesApi.like(profile.id),
    onSuccess: (result) => {
      setInterested(true)
      if (result.matched) {
        queryClient.invalidateQueries({ queryKey: ['matches'] })
      }
    },
  })

  const bgGradient = getGradient(profile.firstName)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => navigate(`/user/${profile.id}`)}
        className="w-full text-left flex gap-4 p-4"
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {profile.profilePhotoUrl ? (
            <img
              src={profile.profilePhotoUrl}
              alt={profile.firstName}
              className="w-16 h-16 rounded-2xl object-cover"
              width={64}
              height={64}
            />
          ) : (
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${bgGradient} flex items-center justify-center`}>
              <span className="text-white text-2xl font-bold opacity-70">{profile.firstName[0]}</span>
            </div>
          )}
          {profile.idVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
              <ShieldCheck size={10} className="text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-bold text-gray-900 text-[15px] leading-tight">
              {profile.firstName} {profile.lastName ? profile.lastName.charAt(0) + '.' : ''}{profile.age ? `, ${profile.age}` : ''}
            </p>
            {profile.connectionDegree && (
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5">
                {profile.connectionDegree === 2 ? '2nd' : '3rd'}
              </span>
            )}
          </div>

          {profile.headline && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{profile.headline}</p>
          )}

          <div className="mt-1.5 space-y-0.5">
            {(profile.currentRole || profile.company) && (
              <div className="flex items-center gap-1 min-w-0">
                <Briefcase size={11} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 truncate">
                  {[profile.currentRole, profile.company].filter(Boolean).join(' · ')}
                </span>
              </div>
            )}
            {profile.college && (
              <div className="flex items-center gap-1 min-w-0">
                <GraduationCap size={11} className="text-purple-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 truncate">{profile.college.name}</span>
                {profile.schoolEmailVerified && (
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-1.5 py-0.5 flex-shrink-0">✓ Verified</span>
                )}
              </div>
            )}
            {(profile.locationLabel || profile.futureLocation) && (
              <div className="flex items-center gap-1 min-w-0">
                <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 truncate">
                  {profile.locationLabel}
                  {profile.futureLocation && profile.futureLocation !== profile.locationLabel && (
                    <span className="text-gray-400"> → {profile.futureLocation}</span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Credential badges */}
          {(profile.gpa || profile.sat || profile.act) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {profile.gpa && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                  <Award size={9} /> GPA {profile.gpa.toFixed(1)}
                </span>
              )}
              {profile.sat && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  SAT {profile.sat}
                </span>
              )}
              {profile.act && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                  ACT {profile.act}
                </span>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Action row */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          type="button"
          onClick={() => navigate(`/user/${profile.id}`)}
          className="flex-1 rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Profile
        </button>
        <motion.button
          whileTap={{ scale: 0.93 }}
          type="button"
          disabled={interested || isPending}
          onClick={() => sendInterest()}
          className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
            interested
              ? 'bg-gray-100 text-gray-400 cursor-default'
              : 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-sm hover:shadow-purple-200 hover:shadow-md'
          }`}
        >
          {isPending ? '...' : interested ? 'Sent ✓' : 'Connect'}
        </motion.button>
      </div>
    </motion.div>
  )
}

function projectNearbyPoint(
  viewerLatitude: number,
  viewerLongitude: number,
  profile: NearbyProfile,
  maxRadiusMiles: number
) {
  const milesPerLatDegree = 69
  const milesPerLonDegree = 54.6 * Math.cos((viewerLatitude * Math.PI) / 180)
  const deltaXMiles = (profile.longitude - viewerLongitude) * milesPerLonDegree
  const deltaYMiles = (profile.latitude - viewerLatitude) * milesPerLatDegree
  const clampedRadius = Math.max(maxRadiusMiles, 1)
  const x = 50 + (deltaXMiles / clampedRadius) * 36
  const y = 50 - (deltaYMiles / clampedRadius) * 36

  return {
    x: Math.min(92, Math.max(8, x)),
    y: Math.min(92, Math.max(8, y)),
  }
}

function NearbyRadarMap({
  profiles,
  viewerLatitude,
  viewerLongitude,
}: {
  profiles: NearbyProfile[]
  viewerLatitude: number
  viewerLongitude: number
}) {
  const visibleProfiles = profiles.slice(0, 8)
  const maxRadiusMiles = Math.max(...visibleProfiles.map((profile) => profile.distanceMiles), 10)

  return (
    <div className="rounded-[28px] bg-[#111827] p-4 text-white shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Proximity Map</p>
          <p className="mt-1 text-sm text-slate-300">People close to where you are right now.</p>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
          {visibleProfiles.length} nearby
        </div>
      </div>

      <div className="relative mt-4 aspect-square rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(148,163,184,0.22),_transparent_58%)]">
        <div className="absolute inset-[16%] rounded-full border border-white/10" />
        <div className="absolute inset-[30%] rounded-full border border-white/10" />
        <div className="absolute inset-[44%] rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.5)]" />

        {visibleProfiles.map((profile) => {
          const point = projectNearbyPoint(viewerLatitude, viewerLongitude, profile, maxRadiusMiles)

          return (
            <button
              key={profile.id}
              type="button"
              title={`${profile.firstName} • ${profile.distanceMiles.toFixed(1)} miles away`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              className="absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 bg-white shadow-lg transition-transform hover:scale-105"
            >
              {profile.profilePhotoUrl ? (
                <img
                  src={profile.profilePhotoUrl}
                  alt={profile.firstName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-gray-700">{profile.firstName[0]}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// --- Main page ---
export default function SearchPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [mode, setMode] = useState<'search' | 'nearby'>('search')
  const [inputValue, setInputValue] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [radiusMiles, setRadiusMiles] = useState(75)
  const [locationError, setLocationError] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  // Debounce input → trigger query after 500ms of silence
  useEffect(() => {
    if (inputValue.trim().length <= 2) {
      setDebouncedQuery('')
      return
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue.trim())
    }, 500)
    return () => clearTimeout(timer)
  }, [inputValue])

  const {
    data: results,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchApi.search(debouncedQuery),
    enabled: !!debouncedQuery && debouncedQuery.length > 2,
    staleTime: 1000 * 60,
  })

  const {
    data: nearbyResults,
    isLoading: isNearbyLoading,
    isError: isNearbyError,
    isFetching: isNearbyFetching,
    refetch: refetchNearby,
  } = useQuery({
    queryKey: ['nearby-search', radiusMiles],
    queryFn: () => searchApi.nearby(radiusMiles),
    enabled: mode === 'nearby' && user?.latitude != null && user?.longitude != null,
    staleTime: 1000 * 60,
  })

  const locationMutation = useMutation({
    mutationFn: async () => {
      setLocationError('')
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not available in this browser.')
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000,
        })
      })

      return usersApi.updateProfile({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, updated)
      queryClient.invalidateQueries({ queryKey: ['profile-detail'] })
      void refetchNearby()
    },
    onError: (err: Error) => {
      setLocationError(err.message)
    },
  })

  const { data: featuredProfiles } = useQuery({
    queryKey: ['discover'],
    queryFn: matchesApi.discover,
    staleTime: 1000 * 60 * 5,
    enabled: mode === 'search',
  })

  const handleExampleClick = useCallback((query: string) => {
    setInputValue(query)
    setMode('search')
  }, [])

  const isSearchActive = debouncedQuery.length > 2
  const showSkeletons = (isLoading || isFetching) && isSearchActive
  const hasResults = results && results.length > 0
  const isEmpty = isSearchActive && !isLoading && !isFetching && !isError && !hasResults
  const hasLocation = user?.latitude != null && user?.longitude != null
  const nearbyCards = nearbyResults ?? []
  const showNearbySkeletons = mode === 'nearby' && (isNearbyLoading || isNearbyFetching)

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 pb-28">
        <div className="bg-white border-b border-gray-100 px-5 pt-4 pb-5">
          <h1 className="text-xl font-bold text-gray-900">People</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Search by name, school, company, city, or just describe who you&apos;re looking for.
          </p>

          <div className="mt-4 inline-flex rounded-2xl bg-gray-100 p-1">
            {[
              { value: 'search' as const, label: 'Search' },
              { value: 'nearby' as const, label: 'Nearby Map' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setMode(tab.value)}
                className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  mode === tab.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mode === 'search' ? (
            <div className="relative mt-4">
              {/* Glow ring behind input */}
              <motion.div
                className="absolute -inset-1 rounded-2xl bg-purple-400/20 pointer-events-none"
                animate={searchFocused ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              />
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Sparkles size={20} className={`transition-colors duration-200 ${searchFocused ? 'text-purple-600' : 'text-purple-500'}`} />
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Woman in Michigan with a job lined up in Chicago..."
                  className="w-full rounded-2xl bg-gray-100 py-4 pl-12 pr-5 text-base text-gray-900 placeholder-gray-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  autoFocus
                />
              </div>
              <AnimatePresence>
                {inputValue.length > 0 && inputValue.trim().length <= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-y-0 right-4 flex items-center"
                  >
                    <span className="text-xs text-gray-400">Keep typing...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-[#f8f5ef] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Proximity mode</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Save your live coordinates, then see nearby profiles on the map and by distance.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  loading={locationMutation.isPending}
                  onClick={() => locationMutation.mutate()}
                >
                  <LocateFixed size={14} />
                  {hasLocation ? 'Refresh location' : 'Use my location'}
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[25, 50, 75, 150].map((radius) => (
                  <button
                    key={radius}
                    type="button"
                    onClick={() => setRadiusMiles(radius)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      radiusMiles === radius ? 'bg-[#111827] text-white' : 'bg-white text-gray-600'
                    }`}
                  >
                    {radius} mi
                  </button>
                ))}
              </div>

              {locationError && <p className="mt-3 text-xs font-medium text-red-500">{locationError}</p>}
            </div>
          )}
        </div>

        <div className="mx-auto max-w-md px-4 pt-5">
          {mode === 'search' ? (
            <>
              <AnimatePresence>
                {!isSearchActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Suggestion chips */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {EXAMPLE_QUERIES.map((query) => (
                        <button
                          key={query}
                          onClick={() => handleExampleClick(query)}
                          className="min-h-[40px] rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-150 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 active:scale-95"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={12} className="text-purple-400" />
                            {query}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Pre-populated profiles */}
                    {featuredProfiles && featuredProfiles.length > 0 && (
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Curated for you
                        </p>
                        <div className="flex flex-col gap-3">
                          {featuredProfiles.slice(0, 8).map((profile, index) => (
                            <motion.div
                              key={profile.id}
                              initial={{ opacity: 0, y: 14, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ delay: index * 0.06, type: 'spring', stiffness: 420, damping: 28 }}
                            >
                              <SearchProfileCard profile={profile} />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isSearchActive && !showSkeletons && hasResults && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
                  >
                    {results.length} {results.length === 1 ? 'match' : 'matches'} found
                  </motion.p>
                )}
              </AnimatePresence>

              {showSkeletons && (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {!showSkeletons && hasResults && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  {results.map((profile, index) => (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, y: 14, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.06, type: 'spring', stiffness: 420, damping: 28 }}
                    >
                      <SearchProfileCard profile={profile} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <AnimatePresence>
                {isEmpty && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center px-6 py-6 text-center"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                      <SearchX size={22} className="text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">No matches found</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      Try: &quot;Harvard girl who hikes&quot;
                    </p>
                    <button
                      onClick={() => setInputValue('')}
                      className="mt-3 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700 hover:underline underline-offset-2"
                    >
                      Clear search
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isSearchActive && isError && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center px-6 pt-16 text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                      <AlertCircle size={28} className="text-red-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Search unavailable</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">Couldn't search right now. Try again.</p>
                    <button
                      onClick={() => setDebouncedQuery('')}
                      className="mt-5 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700 hover:underline underline-offset-2"
                    >
                      Retry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="grid gap-4">
              {!hasLocation && !locationMutation.isPending && (
                <div className="rounded-[28px] border border-amber-100 bg-amber-50 px-5 py-4">
                  <p className="text-sm font-semibold text-amber-900">Location needed for the nearby map</p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-700">
                    Save your current coordinates to unlock distance-aware discovery and proximity connections.
                  </p>
                </div>
              )}

              {showNearbySkeletons && (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {hasLocation && nearbyCards.length > 0 && user?.latitude != null && user?.longitude != null && (
                <>
                  <div className="rounded-[30px] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Apex Map</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {nearbyCards.length} nearby {nearbyCards.length === 1 ? 'profile' : 'profiles'} inside {radiusMiles} miles.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <NearbyRadar
                        profiles={nearbyCards}
                        originLatitude={user.latitude}
                        originLongitude={user.longitude}
                        onSelect={(profileId) => navigate(`/user/${profileId}`)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {nearbyCards.map((profile, index) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.06, type: 'spring', stiffness: 420, damping: 28 }}
                      >
                        <SearchProfileCard profile={profile} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {hasLocation && !showNearbySkeletons && nearbyCards.length === 0 && !isNearbyError && (
                <div className="flex flex-col items-center justify-center px-6 pt-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                    <MapPin size={28} className="text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Nobody nearby yet</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Increase the radius or refresh your live location to widen the proximity map.
                  </p>
                </div>
              )}

              {hasLocation && isNearbyError && !showNearbySkeletons && (
                <div className="flex flex-col items-center justify-center px-6 pt-16 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                    <AlertCircle size={28} className="text-red-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Nearby map unavailable</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    We couldn't load nearby profiles right now.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
