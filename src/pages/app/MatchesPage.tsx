import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Heart, GraduationCap, Compass, RefreshCw, Check, X, Eye, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../../components/layout/AppLayout'
import Avatar from '../../components/ui/Avatar'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Button from '../../components/ui/Button'
import { matchesApi } from '../../api/matches'
import { usersApi } from '../../api/users'
import { useAuth } from '../../hooks/useAuth'
import type { Match, ProfileViewer } from '../../types'

type Tab = 'connections' | 'requests' | 'pending' | 'viewers'

// Three days in milliseconds
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

function MatchCard({ match, onClick, currentUserId }: { match: Match; onClick: () => void; currentUserId: string }) {
  const user = match.matchedUser
  const fullName = `${user.firstName} ${user.lastName}`
  const previewText = match.lastMessage
    ? match.lastMessage.content
    : match.introMessage || 'Break the ice'

  // Unread: last message exists, was sent by the other person, and not yet read
  const isUnread =
    !!match.lastMessage &&
    match.lastMessage.senderId !== currentUserId &&
    !match.lastMessage.read

  return (
    <div className={`relative rounded-2xl ${isUnread ? 'pl-0.5' : ''}`}>
      {isUnread && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-purple-500" />
      )}
      <motion.button
        whileHover={{ x: 3, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={onClick}
        className={`group flex w-full items-center gap-4 rounded-2xl py-2 ${isUnread ? 'pl-3' : ''} text-left transition-colors ${
          isUnread ? 'bg-purple-50/40 hover:bg-purple-50/70' : 'hover:bg-gray-50'
        }`}
      >
        <div className="relative flex-shrink-0">
          <Avatar src={user.profilePhotoUrl} name={fullName} size="lg" />
          {isUnread && (
            <div className="absolute -top-0.5 -right-0.5">
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-400"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative h-2.5 w-2.5 rounded-full border-2 border-white bg-purple-500" />
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`truncate ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>
              {fullName}
            </h3>
            {match.lastMessage && (
              <span className="ml-2 flex-shrink-0 text-xs text-gray-400">
                {new Date(match.lastMessage.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          {user.college && (
            <div className="mt-0.5 flex items-center gap-1">
              <GraduationCap size={12} className="flex-shrink-0 text-purple-400" />
              <span className="truncate text-xs text-gray-500">{user.college.name}</span>
            </div>
          )}

          <p className={`mt-0.5 truncate text-sm ${isUnread ? 'font-medium text-gray-700' : 'text-gray-400'}`}>
            {previewText}
          </p>
        </div>

        <div className="flex-shrink-0 text-gray-300 transition-colors group-hover:text-purple-400">
          <MessageCircle size={20} />
        </div>
      </motion.button>
    </div>
  )
}

interface RequestCardProps {
  match: Match
  onAccept: () => void
  onPass: () => void
  acceptPending: boolean
  passPending: boolean
}

function RequestCard({ match, onAccept, onPass, acceptPending, passPending }: RequestCardProps) {
  const user = match.matchedUser
  const fullName = `${user.firstName} ${user.lastName}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <Avatar src={user.profilePhotoUrl} name={fullName} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900">{fullName}</h3>
          {user.college && (
            <div className="mt-0.5 flex items-center gap-1">
              <GraduationCap size={11} className="flex-shrink-0 text-purple-400" />
              <span className="truncate text-xs text-gray-500">{user.college.name}</span>
            </div>
          )}
        </div>
      </div>

      {match.introMessage && (
        <div className="mt-3 rounded-xl bg-purple-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-500">Their note</p>
          <p className="mt-1 text-sm leading-relaxed text-purple-900">"{match.introMessage}"</p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.03 }}
          onClick={onAccept}
          disabled={acceptPending || passPending}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-700 disabled:opacity-50 active:scale-95"
        >
          {acceptPending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Check size={15} />
          )}
          Accept
        </motion.button>
        <button
          onClick={onPass}
          disabled={acceptPending || passPending}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 disabled:opacity-50 active:scale-95"
        >
          {passPending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <X size={15} />
          )}
          Pass
        </button>
      </div>
    </motion.div>
  )
}

function PendingCard({ match, onWithdraw, withdrawPending }: {
  match: Match
  onWithdraw: () => void
  withdrawPending: boolean
}) {
  const user = match.matchedUser
  const fullName = `${user.firstName} ${user.lastName}`
  const sentAt = new Date(match.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <Avatar src={user.profilePhotoUrl} name={fullName} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900">{fullName}</h3>
          {user.college && (
            <div className="mt-0.5 flex items-center gap-1">
              <GraduationCap size={11} className="flex-shrink-0 text-purple-400" />
              <span className="truncate text-xs text-gray-500">{user.college.name}</span>
            </div>
          )}
          <p className="mt-0.5 text-xs text-gray-400">Interest sent · {sentAt}</p>
        </div>
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-purple-50">
          <Heart size={16} className="text-purple-500" />
        </div>
      </div>

      {match.introMessage && (
        <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Your note</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-700">"{match.introMessage}"</p>
        </div>
      )}

      <button
        onClick={onWithdraw}
        disabled={withdrawPending}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50 active:scale-95"
      >
        {withdrawPending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        ) : (
          <X size={15} />
        )}
        Withdraw interest
      </button>
    </motion.div>
  )
}

export default function MatchesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('connections')

  const { data: matches, isLoading, error, refetch } = useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: matchesApi.getMatches,
    staleTime: 1000 * 30,
  })

  const { data: requests, isLoading: requestsLoading } = useQuery<Match[]>({
    queryKey: ['pending-requests'],
    queryFn: matchesApi.getPendingRequests,
    staleTime: 1000 * 30,
  })

  const { data: viewers, isLoading: viewersLoading } = useQuery<ProfileViewer[]>({
    queryKey: ['profile-viewers'],
    queryFn: usersApi.getProfileViewers,
    staleTime: 1000 * 60,
    enabled: activeTab === 'viewers',
  })

  const { data: sentRequests, isLoading: sentLoading } = useQuery<Match[]>({
    queryKey: ['sent-requests'],
    queryFn: matchesApi.getSentRequests,
    staleTime: 1000 * 30,
    enabled: activeTab === 'pending',
  })

  const acceptMutation = useMutation({
    mutationFn: (userId: string) => matchesApi.like(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pending-requests'] })
      void queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })

  const passMutation = useMutation({
    mutationFn: (matchId: string) => matchesApi.unmatch(matchId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pending-requests'] })
    },
  })

  const withdrawMutation = useMutation({
    mutationFn: (matchId: string) => matchesApi.unmatch(matchId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sent-requests'] })
    },
  })

  // Guard against deleted accounts where matchedUser is null
  const validMatches = matches?.filter((m) => m.matchedUser != null) ?? []
  const newMatches = validMatches.filter((m) => !m.lastMessage)
  const conversations = [...validMatches.filter((m) => m.lastMessage)].sort(
    (a, b) =>
      new Date(b.lastMessage!.createdAt).getTime() -
      new Date(a.lastMessage!.createdAt).getTime()
  )

  // Recent new matches: matched within last 3 days with no messages yet — shown as "say hi" strip
  const recentNewMatches = newMatches.filter(
    (m) => Date.now() - new Date(m.createdAt).getTime() < THREE_DAYS_MS
  )

  const validRequests = requests?.filter((r) => r.matchedUser != null) ?? []
  const requestCount = validRequests.length

  const tabVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <AppLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-purple-50/20 min-h-screen pb-28">
        {/* Header */}
        <div className="bg-gradient-to-b from-purple-50/80 via-white to-white border-b border-gray-100/80 px-5 pt-5 pb-4">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Your Connections</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {matches && matches.length > 0
              ? `${matches.length} meaningful connection${matches.length !== 1 ? 's' : ''}`
              : 'Start discovering to find your first connection'}
          </p>
        </div>
      <div className="px-5 pt-4">

        {/* Tab switcher */}
        <div className="mb-5 flex gap-1 rounded-2xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('connections')}
            className={`relative flex-1 overflow-hidden rounded-xl py-2.5 text-sm transition-all ${
              activeTab === 'connections'
                ? 'bg-white text-purple-700 font-bold shadow-md shadow-purple-100/60 ring-1 ring-purple-200/60'
                : 'text-gray-500 font-medium'
            }`}
          >
            {activeTab === 'connections' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-white rounded-xl shadow-md shadow-purple-100/60 ring-1 ring-purple-200/60"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">Connections</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`relative flex-1 overflow-hidden items-center justify-center rounded-xl py-2.5 text-sm transition-all ${
              activeTab === 'requests'
                ? 'bg-white text-purple-700 font-bold shadow-md shadow-purple-100/60 ring-1 ring-purple-200/60'
                : 'text-gray-500 font-medium'
            }`}
          >
            {activeTab === 'requests' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-white rounded-xl shadow-md shadow-purple-100/60 ring-1 ring-purple-200/60"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">
              Requests
              {requestCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                  {requestCount > 9 ? '9+' : requestCount}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`relative flex-1 overflow-hidden items-center justify-center rounded-xl py-2.5 text-sm transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-purple-700 font-bold shadow-md shadow-purple-100/60 ring-1 ring-purple-200/60'
                : 'text-gray-500 font-medium'
            }`}
          >
            {activeTab === 'pending' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-white rounded-xl shadow-md shadow-purple-100/60 ring-1 ring-purple-200/60"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">Pending</span>
          </button>
          <button
            onClick={() => setActiveTab('viewers')}
            className={`relative flex-1 overflow-hidden items-center justify-center rounded-xl py-2.5 text-sm transition-all ${
              activeTab === 'viewers'
                ? 'bg-white text-purple-700 font-bold shadow-md shadow-purple-100/60 ring-1 ring-purple-200/60'
                : 'text-gray-500 font-medium'
            }`}
          >
            {activeTab === 'viewers' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-white rounded-xl shadow-md shadow-purple-100/60 ring-1 ring-purple-200/60"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">Viewers</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Connections tab */}
          {activeTab === 'connections' && (
            <motion.div
              key="connections"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18 }}
            >
              {isLoading ? (
                <div className="flex justify-center pt-16">
                  <LoadingSpinner size="xl" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center gap-4 pt-16 text-center">
                  <p className="text-sm text-gray-500">Couldn't load your connections right now.</p>
                  <Button variant="secondary" onClick={() => refetch()}>
                    <RefreshCw size={16} />
                    Try again
                  </Button>
                </div>
              ) : validMatches.length === 0 ? (
                <div className="flex flex-col items-center gap-6 px-6 pt-16 text-center">
                  <motion.div
                    className="flex h-24 w-24 items-center justify-center rounded-3xl bg-purple-50"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Heart size={40} className="text-purple-200" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Your first connection is out there</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      When you and someone both express interest, they'll appear here.
                    </p>
                  </div>
                  <Button variant="primary" onClick={() => navigate('/discover')}>
                    <Compass size={16} />
                    Start Discovering
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Recent new matches "Say hi" horizontal strip */}
                  {recentNewMatches.length > 0 && (
                    <div>
                      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Say hello
                      </h2>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {recentNewMatches.map((match, i) => {
                          const mu = match.matchedUser
                          const mName = `${mu.firstName} ${mu.lastName}`
                          return (
                            <motion.button
                              key={match.id}
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05, type: 'spring', stiffness: 380, damping: 24 }}
                              onClick={() => navigate(`/chat/${match.id}`)}
                              className="flex w-[88px] flex-shrink-0 flex-col items-center gap-1.5 rounded-2xl bg-purple-50 px-3 py-3 text-center transition-all hover:bg-purple-100 active:scale-95"
                            >
                              <motion.div
                                whileHover={{ scale: 1.06, y: -2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              >
                                <div className="relative">
                                  <Avatar src={mu.profilePhotoUrl} name={mName} size="lg" />
                                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-purple-500">
                                    <Heart size={8} className="text-white" fill="white" />
                                  </div>
                                </div>
                                <span className="text-[11px] font-semibold text-gray-700 leading-tight">
                                  {mu.firstName}
                                </span>
                                <span className="text-[10px] text-purple-600 font-medium">Say hi →</span>
                              </motion.div>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* New matches row (non-recent or when we want the full card view) */}
                  {newMatches.length > 0 && (
                    <div>
                      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        New Connections
                      </h2>
                      <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-hide">
                        {newMatches.map((match) => {
                          const matchUser = match.matchedUser
                          const matchFullName = `${matchUser.firstName} ${matchUser.lastName}`
                          return (
                            <button
                              key={match.id}
                              onClick={() => navigate(`/chat/${match.id}`)}
                              className="group flex w-[104px] flex-shrink-0 flex-col items-center gap-2 rounded-3xl bg-white p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                              <div className="relative">
                                <Avatar src={matchUser.profilePhotoUrl} name={matchFullName} size="xl" />
                                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-purple-500">
                                  <Heart size={10} className="text-white" fill="white" />
                                </div>
                              </div>
                              <span className="text-xs font-medium text-gray-700 transition-colors group-hover:text-purple-600">
                                {matchUser.firstName}
                              </span>
                              <p className="line-clamp-2 text-[11px] leading-relaxed text-gray-400">
                                {match.introMessage || 'Open the chat and start the conversation.'}
                              </p>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Conversations */}
                  {conversations.length > 0 && (
                    <div>
                      <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Messages
                      </h2>
                      <div className="-mx-1 flex flex-col">
                        {conversations.map((match, matchIdx) => (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: matchIdx * 0.06, duration: 0.25, ease: 'easeOut' }}
                          >
                            <MatchCard
                              match={match}
                              currentUserId={user?.id ?? ''}
                              onClick={() => navigate(`/chat/${match.id}`)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* If all connections have no messages, show them as list too */}
                  {newMatches.length > 0 && conversations.length === 0 && (
                    <div>
                      <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        All Connections
                      </h2>
                      <div className="-mx-1 flex flex-col">
                        {newMatches.map((match, matchIdx) => (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: matchIdx * 0.06, duration: 0.25, ease: 'easeOut' }}
                          >
                            <MatchCard
                              match={match}
                              currentUserId={user?.id ?? ''}
                              onClick={() => navigate(`/chat/${match.id}`)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Viewers tab */}
          {activeTab === 'viewers' && (
            <motion.div
              key="viewers"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18 }}
            >
              {viewersLoading ? (
                <div className="flex justify-center pt-16">
                  <LoadingSpinner size="xl" />
                </div>
              ) : !viewers || viewers.length === 0 ? (
                <div className="flex flex-col items-center gap-6 px-6 pt-16 text-center">
                  <motion.div
                    className="flex h-24 w-24 items-center justify-center rounded-3xl bg-purple-50"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Eye size={40} className="text-purple-200" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">No profile views yet</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      When someone views your profile, they'll appear here — like LinkedIn.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {viewers.length} {viewers.length === 1 ? 'person' : 'people'} viewed your profile
                  </p>
                  {viewers.map((entry) => {
                    const v = entry.viewer
                    const fullName = `${v.firstName} ${v.lastName}`
                    const timeAgo = (() => {
                      const diff = Date.now() - new Date(entry.viewedAt).getTime()
                      const mins = Math.floor(diff / 60000)
                      const hours = Math.floor(diff / 3600000)
                      const days = Math.floor(diff / 86400000)
                      if (days > 0) return `${days}d ago`
                      if (hours > 0) return `${hours}h ago`
                      return `${mins}m ago`
                    })()
                    return (
                      <motion.button
                        key={entry.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => navigate(`/user/${v.id}`)}
                        className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-50"
                      >
                        <Avatar src={v.profilePhotoUrl} name={fullName} size="lg" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{fullName}</h3>
                            {v.idVerified && <ShieldCheck size={13} className="flex-shrink-0 text-emerald-500" />}
                          </div>
                          {v.college && (
                            <div className="mt-0.5 flex items-center gap-1">
                              <GraduationCap size={11} className="flex-shrink-0 text-purple-400" />
                              <span className="truncate text-xs text-gray-500">{v.college.name}</span>
                            </div>
                          )}
                          {v.currentRole && (
                            <p className="mt-0.5 truncate text-xs text-gray-400">{v.currentRole}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="text-xs text-gray-400">{timeAgo}</span>
                          <div className="mt-1 flex justify-end">
                            <Eye size={15} className="text-gray-300" />
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Requests tab */}
          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18 }}
            >
              {requestsLoading ? (
                <div className="flex justify-center pt-16">
                  <LoadingSpinner size="xl" />
                </div>
              ) : validRequests.length === 0 ? (
                <div className="flex flex-col items-center gap-6 px-6 pt-16 text-center">
                  <motion.div
                    className="flex h-24 w-24 items-center justify-center rounded-3xl bg-purple-50"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Heart size={40} className="text-purple-200" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">No requests yet</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      When someone sends you interest, they'll appear here. A complete profile gets 3× more attention.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <AnimatePresence>
                    {validRequests.map((request) => (
                      <RequestCard
                        key={request.id}
                        match={request}
                        onAccept={() => acceptMutation.mutate(request.matchedUser.id)}
                        onPass={() => passMutation.mutate(request.id)}
                        acceptPending={acceptMutation.isPending && acceptMutation.variables === request.matchedUser.id}
                        passPending={passMutation.isPending && passMutation.variables === request.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {/* Pending tab — sent requests awaiting response */}
          {activeTab === 'pending' && (
            <motion.div
              key="pending"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18 }}
            >
              {sentLoading ? (
                <div className="flex justify-center pt-16"><LoadingSpinner size="xl" /></div>
              ) : !sentRequests || sentRequests.filter(r => r.matchedUser != null).length === 0 ? (
                <div className="flex flex-col items-center gap-6 px-6 pt-16 text-center">
                  <motion.div
                    className="flex h-24 w-24 items-center justify-center rounded-3xl bg-purple-50"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Heart size={40} className="text-purple-200" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Nothing pending</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      When you send interest to someone and they haven't responded yet, they'll show up here.
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-3">
                    {sentRequests.filter(r => r.matchedUser != null).map((match) => (
                      <PendingCard
                        key={match.id}
                        match={match}
                        onWithdraw={() => withdrawMutation.mutate(match.id)}
                        withdrawPending={withdrawMutation.isPending && withdrawMutation.variables === match.id}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </AppLayout>
  )
}
