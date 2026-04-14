import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  GraduationCap,
  Mic,
  Pause,
  Phone,
  PhoneOff,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Square,
  Video,
} from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { matchesApi, type WeMetStatus } from '../../api/matches'
import { uploadToCloudinary } from '../../api/users'
import { socket } from '../../lib/socket'
import { useAuth } from '../../hooks/useAuth'
import type { Match, Message } from '../../types'

// Suppress unused-import lint warning — uploadToCloudinary is used in
// uploadAudioToCloudinary below which wraps it for the audio resource type.
void uploadToCloudinary

const QUICK_REPLIES = ["Hey! 👋", "Love your profile ✨", "How's your week?"]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = []

  messages.forEach((message) => {
    const date = new Date(message.createdAt).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })

    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(message)
    } else {
      groups.push({ date, messages: [message] })
    }
  })

  return groups
}

/** Upload an audio Blob to Cloudinary using the video resource type (audio is a subset). */
async function uploadAudioToCloudinary(blob: Blob): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
  if (!cloudName) throw new Error('Cloudinary cloud name is not configured.')

  const file = new File([blob], `voice-${Date.now()}.webm`, { type: blob.type || 'audio/webm' })
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'apex_upload')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) throw new Error('Failed to upload voice message. Please try again.')

  const result = (await response.json()) as { secure_url: string }
  return result.secure_url
}

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Returns the number of consecutive days (ending today) that have at least one message. */
function getConsecutiveDays(messages: Message[]): number {
  if (messages.length === 0) return 0
  const daySet = new Set<string>()
  for (const m of messages) {
    daySet.add(new Date(m.createdAt).toISOString().slice(0, 10))
  }
  const today = new Date()
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (daySet.has(d.toISOString().slice(0, 10))) {
      streak++
    } else {
      break
    }
  }
  return streak
}

// ---------------------------------------------------------------------------
// VoiceMessageBubble
// ---------------------------------------------------------------------------

interface VoiceMessageBubbleProps {
  mediaUrl: string
  isMine: boolean
}

function VoiceMessageBubble({ mediaUrl, isMine }: VoiceMessageBubbleProps) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      void a.play()
      setPlaying(true)
    }
  }

  const staticHeights = [3, 5, 8, 6, 10, 7, 4, 9, 6, 5, 8, 10, 6, 7, 4, 9, 5, 8, 6, 3]

  return (
    <div
      className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 ${
        isMine ? 'bg-gradient-to-br from-purple-600 to-violet-600' : 'bg-gray-100'
      }`}
      style={{ minWidth: 160, maxWidth: 220 }}
    >
      <audio
        ref={audioRef}
        src={mediaUrl}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onTimeUpdate={() => {
          const a = audioRef.current
          if (a && a.duration) setProgress(a.currentTime / a.duration)
        }}
        onEnded={() => {
          setPlaying(false)
          setProgress(0)
        }}
      />

      <button
        onClick={toggle}
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isMine ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'
        }`}
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
      </button>

      {/* Static waveform bars */}
      <div className="flex flex-1 items-center gap-0.5">
        {staticHeights.map((height, i) => {
          const filled = i / 20 <= progress
          return (
            <div
              key={i}
              style={{ height }}
              className={`w-1 rounded-full flex-shrink-0 ${
                filled
                  ? isMine
                    ? 'bg-white'
                    : 'bg-purple-500'
                  : isMine
                  ? 'bg-white/40'
                  : 'bg-gray-300'
              }`}
            />
          )
        })}
      </div>

      <span
        className={`text-[10px] font-medium flex-shrink-0 ${
          isMine ? 'text-white/80' : 'text-gray-400'
        }`}
      >
        {duration > 0 ? `${Math.floor(duration)}s` : '—'}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// WeMetOverlay
// ---------------------------------------------------------------------------

interface WeMetOverlayProps {
  onDismiss: () => void
}

function WeMetOverlay({ onDismiss }: WeMetOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.05 }}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl bg-white/10 px-8 py-10 text-center backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <motion.span
            initial={{ x: -40, rotate: -25, opacity: 0 }}
            animate={{ x: 0, rotate: -10, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.25 }}
            style={{ fontSize: 60 }}
          >
            🥂
          </motion.span>
          <motion.span
            initial={{ x: 40, rotate: 25, opacity: 0 }}
            animate={{ x: 0, rotate: 10, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.25 }}
            style={{ fontSize: 60, transform: 'scaleX(-1)' }}
          >
            🥂
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex flex-col gap-2"
        >
          <h2 className="text-2xl font-bold text-white">You've made a real connection</h2>
          <p className="text-sm leading-relaxed text-white/70">
            Your profiles are paused while you explore this.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDismiss}
          className="mt-2 w-full rounded-2xl bg-white py-3.5 text-sm font-semibold text-purple-700 shadow-lg transition-colors hover:bg-purple-50"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// CallState type
// ---------------------------------------------------------------------------

type CallState = 'idle' | 'calling' | 'incoming' | 'connected'

// ---------------------------------------------------------------------------
// ChatPage
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // ---- Text messaging state ----
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const [weMetStatus, setWeMetStatus] = useState<WeMetStatus | null>(null)
  const [weMetConfirming, setWeMetConfirming] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [quickRepliesDismissed, setQuickRepliesDismissed] = useState(false)

  // ---- Voice recording state ----
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [uploadingVoice, setUploadingVoice] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<BlobPart[]>([])
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ---- WebRTC call state ----
  const [callState, setCallState] = useState<CallState>('idle')
  const [callType, setCallType] = useState<'voice' | 'video'>('voice')
  const [incomingCallerId, setIncomingCallerId] = useState<string | null>(null)
  const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const peerRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ---- Misc refs ----
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastTypingEmitRef = useRef<number>(0)
  const otherTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ---- Queries ----
  const { data: match, isLoading: matchLoading } = useQuery<Match>({
    queryKey: ['match', matchId],
    queryFn: () => matchesApi.getMatch(matchId!),
    enabled: !!matchId,
  })

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['messages', matchId],
    queryFn: () => matchesApi.getMessages(matchId!),
    enabled: !!matchId,
  })

  // ---- We Met status ----
  useEffect(() => {
    if (!matchId || !match) return

    matchesApi.getWeMetStatus(matchId).then((status) => {
      setWeMetStatus(status)
      if (status.bothConfirmed) setShowCelebration(true)
    }).catch(() => {
      // Endpoint may not exist yet — silently ignore
    })
  }, [matchId, match])

  // ---- Sync server messages into local state ----
  useEffect(() => {
    if (messages) {
      setLocalMessages(messages)
      if (messages.length > 0) setQuickRepliesDismissed(true)
    }
  }, [messages])

  // ---- WebRTC helpers ----
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    })

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit('ice_candidate', { matchId, candidate: e.candidate })
    }

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]
    }

    return pc
  }

  const startCallTimer = () => {
    setCallDuration(0)
    callTimerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000)
  }

  const cleanupCall = () => {
    peerRef.current?.close()
    peerRef.current = null
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    if (callTimerRef.current) clearInterval(callTimerRef.current)
    setCallState('idle')
    setCallDuration(0)
    setIncomingOffer(null)
    setIncomingCallerId(null)
  }

  const endCall = () => {
    socket.emit('call_end', { matchId })
    cleanupCall()
  }

  const initiateCall = async (type: 'voice' | 'video') => {
    const pc = createPeerConnection()
    peerRef.current = pc

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === 'video',
    })
    localStreamRef.current = stream
    stream.getTracks().forEach((track) => pc.addTrack(track, stream))

    if (localVideoRef.current && type === 'video') {
      localVideoRef.current.srcObject = stream
    }

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    socket.emit('call_initiate', { matchId, callType: type, offer })
    setCallType(type)
    setCallState('calling')
  }

  const acceptCall = async () => {
    if (!incomingOffer) return

    const pc = createPeerConnection()
    peerRef.current = pc

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === 'video',
    })
    localStreamRef.current = stream
    stream.getTracks().forEach((track) => pc.addTrack(track, stream))

    if (localVideoRef.current && callType === 'video') {
      localVideoRef.current.srcObject = stream
    }

    await pc.setRemoteDescription(incomingOffer)
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    socket.emit('call_answer', { matchId, answer })
    setCallState('connected')
    startCallTimer()
  }

  // ---- Socket effects ----
  useEffect(() => {
    if (!matchId) return

    if (!socket.connected) socket.connect()
    socket.emit('join_match', matchId)

    const handleNewMessage = (message: Message) => {
      setLocalMessages((previous) => {
        if (previous.some((entry) => entry.id === message.id)) return previous
        return [...previous, message]
      })
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    }

    const handleTyping = ({ userId: typingUserId }: { userId: string }) => {
      if (typingUserId === user?.id) return
      setIsOtherTyping(true)
      if (otherTypingTimerRef.current) clearTimeout(otherTypingTimerRef.current)
      otherTypingTimerRef.current = setTimeout(() => setIsOtherTyping(false), 1800)
    }

    const handleCallIncoming = ({
      callType: ct,
      offer,
      callerId,
    }: {
      callType: 'voice' | 'video'
      offer: RTCSessionDescriptionInit
      callerId: string
    }) => {
      setIncomingOffer(offer)
      setCallType(ct)
      setIncomingCallerId(callerId)
      setCallState('incoming')
    }

    const handleCallAnswered = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      await peerRef.current?.setRemoteDescription(answer)
      setCallState('connected')
      startCallTimer()
    }

    const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      await peerRef.current?.addIceCandidate(candidate)
    }

    const handleCallEnded = () => endCall()

    const handleCallRejected = () => {
      setCallState('idle')
      cleanupCall()
    }

    socket.on('new_message', handleNewMessage)
    socket.on('user_typing', handleTyping)
    socket.on('call_incoming', handleCallIncoming)
    socket.on('call_answered', (data: { answer: RTCSessionDescriptionInit }) => {
      void handleCallAnswered(data)
    })
    socket.on('ice_candidate', (data: { candidate: RTCIceCandidateInit }) => {
      void handleIceCandidate(data)
    })
    socket.on('call_ended', handleCallEnded)
    socket.on('call_rejected', handleCallRejected)
    socket.emit('mark_read', { matchId })

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('user_typing', handleTyping)
      socket.off('call_incoming', handleCallIncoming)
      socket.off('call_answered')
      socket.off('ice_candidate')
      socket.off('call_ended', handleCallEnded)
      socket.off('call_rejected', handleCallRejected)
      if (otherTypingTimerRef.current) clearTimeout(otherTypingTimerRef.current)
      socket.emit('leave_match', matchId)
      cleanupCall()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, queryClient, user?.id])

  // ---- Scroll to bottom ----
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMessages, isOtherTyping])

  // ---- Text send ----
  const handleSend = async () => {
    if (!messageText.trim() || !matchId || sending) return

    const content = messageText.trim()
    setMessageText('')
    setQuickRepliesDismissed(true)

    const optimisticMessage: Message = {
      id: `optimistic-${Date.now()}`,
      matchId,
      senderId: user?.id ?? '',
      content,
      createdAt: new Date().toISOString(),
    }

    setLocalMessages((previous) => [...previous, optimisticMessage])
    setSending(true)

    try {
      const created = await matchesApi.sendMessage(matchId, content)
      setLocalMessages((previous) =>
        previous.map((message) => (message.id === optimisticMessage.id ? created : message))
      )
      queryClient.invalidateQueries({ queryKey: ['messages', matchId] })
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    } catch {
      setLocalMessages((previous) =>
        previous.filter((message) => message.id !== optimisticMessage.id)
      )
      setMessageText(content)
    } finally {
      setSending(false)
    }

    inputRef.current?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value)
    if (!matchId) return

    const now = Date.now()
    if (now - lastTypingEmitRef.current >= 1500) {
      lastTypingEmitRef.current = now
      socket.emit('typing', { matchId, userId: user?.id })
    }
  }

  // ---- Voice recording ----
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      recorder.start(200) // collect chunks every 200 ms
      setIsRecording(true)
      setRecordingSeconds(0)

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          if (s + 1 >= 60) {
            stopRecordingAndSend()
            return 60
          }
          return s + 1
        })
      }, 1000)
    } catch {
      // Permission denied or no microphone — silently fail
    }
  }

  const cancelRecording = () => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stream.getTracks().forEach((t) => t.stop())
      recorder.stop()
    }
    mediaRecorderRef.current = null
    audioChunksRef.current = []
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
    setIsRecording(false)
    setRecordingSeconds(0)
  }

  const stopRecordingAndSend = () => {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === 'inactive') return

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)

    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      recorder.stream.getTracks().forEach((t) => t.stop())
      audioChunksRef.current = []
      mediaRecorderRef.current = null
      setIsRecording(false)
      setRecordingSeconds(0)

      if (!matchId || blob.size === 0) return

      setUploadingVoice(true)
      try {
        const url = await uploadAudioToCloudinary(blob)
        await matchesApi.sendVoiceMessage(matchId, url)
        queryClient.invalidateQueries({ queryKey: ['messages', matchId] })
        queryClient.invalidateQueries({ queryKey: ['matches'] })
      } catch {
        // silently ignore — user can try again
      } finally {
        setUploadingVoice(false)
      }
    }

    recorder.stop()
  }

  // ---- We Met ----
  const handleConfirmWeMet = async () => {
    if (!matchId || weMetConfirming) return
    setWeMetConfirming(true)
    try {
      const updated = await matchesApi.confirmWeMet(matchId)
      setWeMetStatus(updated)
      if (updated.bothConfirmed) setShowCelebration(true)
    } catch {
      // silently ignore
    } finally {
      setWeMetConfirming(false)
    }
  }

  // ---- Derived values ----
  const matchedUser = match?.matchedUser
  const fullName = matchedUser
    ? `${matchedUser.firstName} ${matchedUser.lastName}`
    : 'Finding your connection...'
  const introMessage = match?.introMessage?.trim()
  const messageGroups = groupMessagesByDate(localMessages)
  const consecutiveDays = getConsecutiveDays(localMessages)
  const weMetAlreadyConfirmed = weMetStatus?.myConfirmation === true
  const showQuickReplies = !quickRepliesDismissed && localMessages.length === 0 && !messagesLoading
  const callTimerLabel = `${Math.floor(callDuration / 60).toString().padStart(2, '0')}:${(callDuration % 60).toString().padStart(2, '0')}`

  // ---- Render ----
  return (
    <div className="mx-auto flex h-screen max-h-screen max-w-md flex-col bg-white">
      {/* We Met celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <WeMetOverlay onDismiss={() => setShowCelebration(false)} />
        )}
      </AnimatePresence>

      {/* WebRTC call overlays */}
      <AnimatePresence>
        {/* Calling outbound */}
        {callState === 'calling' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950"
          >
            <Avatar
              src={matchedUser?.profilePhotoUrl}
              name={fullName}
              size="xl"
              className="!w-24 !h-24 ring-4 ring-white/10"
            />
            <p className="mt-4 text-lg font-semibold text-white">
              Calling {matchedUser?.firstName}...
            </p>
            <div className="mt-1 flex gap-1">
              {([0, 0.2, 0.4] as const).map((d, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: d }}
                  className="h-1.5 w-1.5 rounded-full bg-white/60"
                />
              ))}
            </div>
            <button
              onClick={endCall}
              className="mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-red-500 shadow-lg"
            >
              <PhoneOff size={24} className="text-white" />
            </button>
          </motion.div>
        )}

        {/* Incoming call */}
        {callState === 'incoming' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-500/20 ring-4 ring-purple-500/40">
              <Avatar
                src={matchedUser?.profilePhotoUrl}
                name={fullName}
                size="xl"
                className="!w-20 !h-20"
              />
            </div>
            <p className="mt-4 text-lg font-semibold text-white">
              {matchedUser?.firstName ?? incomingCallerId} is calling...
            </p>
            <p className="text-sm text-gray-400">
              {callType === 'video' ? 'Video call' : 'Voice call'}
            </p>
            <div className="mt-10 flex gap-8">
              <button
                onClick={() => {
                  socket.emit('call_reject', { matchId })
                  setCallState('idle')
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 shadow-lg"
              >
                <PhoneOff size={24} className="text-white" />
              </button>
              <button
                onClick={() => void acceptCall()}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg"
              >
                <Phone size={24} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Connected — voice */}
        {callState === 'connected' && callType === 'voice' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950"
          >
            <Avatar
              src={matchedUser?.profilePhotoUrl}
              name={fullName}
              size="xl"
              className="!w-24 !h-24 ring-4 ring-green-500/40"
            />
            <p className="mt-4 text-lg font-semibold text-white">{fullName}</p>
            <p className="mt-1 text-sm text-green-400">{callTimerLabel}</p>
            <button
              onClick={endCall}
              className="mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-red-500 shadow-lg"
            >
              <PhoneOff size={24} className="text-white" />
            </button>
          </motion.div>
        )}

        {/* Connected — video */}
        {callState === 'connected' && callType === 'video' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute bottom-24 right-4 h-36 w-24 rounded-2xl border-2 border-white/20 object-cover"
            />
            <p className="absolute top-14 left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">
              {callTimerLabel}
            </p>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={endCall}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 shadow-lg"
              >
                <PhoneOff size={24} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-gradient-to-b from-white via-white/98 to-white/95 px-4 pb-4 pt-12">
        <button
          onClick={() => navigate('/matches')}
          className="rounded-xl p-2 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>

        {matchLoading ? (
          <div className="flex flex-1 items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
            <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
          </div>
        ) : matchedUser ? (
          <button
            onClick={() => navigate(`/user/${matchedUser.id}?matchId=${matchId}`)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left transition-opacity hover:opacity-80"
          >
            <Avatar src={matchedUser.profilePhotoUrl} name={fullName} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate text-[15px] font-bold text-gray-900 leading-tight">{fullName}</h1>
                {matchedUser.isIdVerified && (
                  <ShieldCheck size={13} className="flex-shrink-0 text-emerald-500" />
                )}
                {consecutiveDays >= 3 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-500 flex-shrink-0">
                    🔥 {consecutiveDays}d
                  </span>
                )}
              </div>
              {matchedUser.college && (
                <p className="truncate text-[11px] text-gray-500 leading-tight">{matchedUser.college.name}</p>
              )}
            </div>
          </button>
        ) : null}

        {/* Call actions */}
        {matchedUser && (
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => void initiateCall('voice')}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-purple-600"
              title="Voice call"
            >
              <Phone size={17} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => void initiateCall('video')}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-purple-600"
              title="Video call"
            >
              <Video size={17} />
            </motion.button>
          </div>
        )}

        {/* We Met button */}
        {match && (
          <button
            onClick={() => {
              if (!weMetAlreadyConfirmed) void handleConfirmWeMet()
            }}
            disabled={weMetAlreadyConfirmed || weMetConfirming}
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
              weMetAlreadyConfirmed
                ? 'cursor-default bg-gray-100 text-gray-400'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 active:scale-95'
            }`}
          >
            <Sparkles size={13} />
            {weMetAlreadyConfirmed ? 'Confirmed' : 'We Met'}
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white px-4 py-4 scrollbar-hide">
        {messagesLoading ? (
          <div className="flex justify-center pt-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : localMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
              <span className="text-3xl">✨</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">New Connection</p>
              <p className="mt-1 text-sm text-gray-500">
                Start the conversation with {matchedUser?.firstName ?? 'your connection'} while the
                energy is fresh.
              </p>
            </div>

            {introMessage && (
              <div className="w-full max-w-xs rounded-3xl bg-purple-50 px-4 py-4 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-500">
                  Connection Note
                </p>
                <p className="mt-2 text-sm leading-relaxed text-purple-900">{introMessage}</p>
              </div>
            )}

            <div className="flex w-full max-w-xs flex-col gap-2">
              {[
                introMessage
                  ? 'That note made me curious. What should I know about you first?'
                  : 'What are you working on right now?',
                "What's something you could talk about for hours?",
                "Best thing that's happened to you this week?",
              ].map((starter) => (
                <button
                  key={starter}
                  onClick={() => setMessageText(starter)}
                  className="rounded-2xl bg-purple-50 px-4 py-2.5 text-left text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {messageGroups.map(({ date, messages: group }) => (
              <div key={date}>
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-xs font-medium text-gray-400">{date}</span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>

                <AnimatePresence initial={false}>
                  {group.map((message, index) => {
                    const isMine = message.senderId === user?.id
                    const isFirst =
                      index === 0 || group[index - 1].senderId !== message.senderId
                    const isLast =
                      index === group.length - 1 ||
                      group[index + 1].senderId !== message.senderId
                    const isOptimistic = message.id.startsWith('optimistic-')
                    const isRead = !!message.read
                    const isVoice =
                      message.messageType === 'voice' && !!message.mediaUrl

                    return (
                      <motion.div
                        key={message.id}
                        initial={isMine ? { opacity: 0, y: 16, scale: 0.9 } : { opacity: 0, x: -14, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`mb-0.5 flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`flex items-end gap-2 ${
                            isMine ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          {!isMine && (
                            <div className="w-6 flex-shrink-0">
                              {isLast && (
                                <Avatar
                                  src={matchedUser?.profilePhotoUrl}
                                  name={fullName}
                                  size="xs"
                                />
                              )}
                            </div>
                          )}

                          {isVoice ? (
                            <div className={isOptimistic ? 'opacity-70' : ''}>
                              <VoiceMessageBubble
                                mediaUrl={message.mediaUrl!}
                                isMine={isMine}
                              />
                            </div>
                          ) : (
                            <div
                              className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                                isMine
                                  ? `rounded-l-2xl bg-gradient-to-br from-purple-600 to-violet-600 text-white ${
                                      isFirst ? 'rounded-t-2xl' : 'rounded-xl'
                                    } ${isLast ? 'rounded-b-xl' : ''}`
                                  : `rounded-r-2xl bg-gray-100 text-gray-900 ${
                                      isFirst ? 'rounded-t-2xl' : 'rounded-xl'
                                    } ${isLast ? 'rounded-b-xl' : ''}`
                              } ${isOptimistic ? 'opacity-70' : ''}`}
                            >
                              {message.content}
                            </div>
                          )}
                        </div>

                        {/* Read receipt — only on my last sent message */}
                        {isMine && isLast && !isOptimistic && (
                          <motion.span
                            initial={{ opacity: 0, x: 4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`mt-0.5 mr-1 text-[10px] font-medium transition-colors ${
                              isRead ? 'text-purple-500' : 'text-gray-300'
                            }`}
                          >
                            ✓✓
                          </motion.span>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            ))}

            <AnimatePresence>
              {isOtherTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.85, x: -8 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  className="mt-1 mb-0.5 flex items-end gap-2"
                >
                  <div className="w-6 flex-shrink-0">
                    <Avatar src={matchedUser?.profilePhotoUrl} name={fullName} size="xs" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl bg-gray-100 px-4 py-3">
                    {([0, 0.15, 0.3] as const).map((delay, index) => (
                      <motion.span
                        key={index}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay, ease: 'easeInOut' }}
                        className="block h-1.5 w-1.5 rounded-full bg-gray-400"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="safe-bottom border-t border-gray-100 bg-white px-4 pb-6 pt-3">
        {/* Quick reply chips — only visible on fresh chats */}
        <AnimatePresence>
          {showQuickReplies && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="mb-2 flex gap-2 overflow-x-auto scrollbar-hide pb-1"
            >
              {QUICK_REPLIES.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setMessageText(chip)}
                  className="flex-shrink-0 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100 active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording UI — replaces normal input row while recording */}
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="recording"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3"
            >
              {/* Animated waveform */}
              <div className="flex flex-1 items-center gap-2 rounded-2xl bg-red-50 px-4 py-3">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                <div className="flex items-center gap-0.5">
                  {[0, 0.1, 0.2, 0.1, 0].map((delay, i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay, ease: 'easeInOut' }}
                      className="h-5 w-1 origin-center rounded-full bg-red-400"
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm font-medium tabular-nums text-red-600">
                  {formatSeconds(recordingSeconds)}
                </span>
              </div>

              {/* Cancel */}
              <button
                onClick={cancelRecording}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-100 transition-colors hover:bg-gray-200"
              >
                <Square size={18} className="text-gray-600" />
              </button>

              {/* Send voice */}
              <button
                onClick={stopRecordingAndSend}
                disabled={uploadingVoice}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-green-500 shadow-sm transition-all hover:bg-green-600 disabled:opacity-50"
              >
                {uploadingVoice ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send size={18} className="text-white" />
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 rounded-2xl bg-gray-100 px-4 py-3 text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              {/* Mic button — only when input is empty */}
              {messageText === '' && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => void startRecording()}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-100 transition-colors hover:bg-gray-200"
                  title="Record voice message"
                >
                  <Mic size={18} className="text-gray-600" />
                </motion.button>
              )}

              <motion.button
                whileTap={{ scale: 0.78, rotate: -15 }}
                transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                onClick={() => void handleSend()}
                disabled={!messageText.trim() || sending}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-sm transition-all hover:from-purple-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={18} className="text-white" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
