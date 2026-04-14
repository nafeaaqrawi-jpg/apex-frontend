import { useState, useRef, useCallback, useEffect, type ReactNode, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Edit3,
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  Award,
  Target,
  CheckCircle,
  Camera,
  Save,
  X,
  ShieldCheck,
  Shield,
  Instagram,
  Twitter,
  Linkedin,
  Link2,
  Plus,
  Minus,
  Heart,
  ChevronRight,
  Crown,
  Trash2,
  MapPin,
  ImagePlus,
  Settings,
} from 'lucide-react'
import { z } from 'zod'
import AppLayout from '../../components/layout/AppLayout'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { Textarea } from '../../components/ui/Input'
import { useAuth, AUTH_QUERY_KEY } from '../../hooks/useAuth'
import { usersApi, uploadToCloudinary } from '../../api/users'
import type { UpdateProfilePayload } from '../../api/users'
import { postsApi } from '../../api/posts'
import { INTERESTS, VALUES } from '../../types'
import type { ProfileDetail, RelationshipGoal } from '../../types'

const RELATIONSHIP_GOALS: RelationshipGoal[] = ['Marriage', 'Long-term', 'Casual', 'Exploring']

const APEX_PROMPTS = [
  "The most underrated city to build a life in:",
  "My thesis in one sentence:",
  "Unpopular opinion in my field:",
  "The book that actually changed how I think:",
  "What I'm building right now:",
  "My 5-year plan, honestly:",
  "The city I'm seriously considering moving to:",
  "I'll always say yes to:",
  "What people get wrong about me:",
  "The thing I'm most proud of that I never talk about:",
  "I'm unreasonably good at:",
  "The last thing that genuinely surprised me:",
  "I talk about this way too much:",
  "The biggest risk I've taken:",
  "Green flag I look for immediately:",
  "My version of a perfect Saturday:",
  "The part of my career I don't post about:",
  "The conversation I keep having:",
  "I need someone who understands that:",
  "Two truths and a lie about my resume:",
]
const GOAL_LABELS: Record<RelationshipGoal, string> = {
  Marriage: 'Marriage',
  'Long-term': 'Long-term',
  Casual: 'Casual',
  Exploring: 'Exploring',
}

const MAX_VALUES = 5

const DRINKING_OPTIONS = ['Never', 'Rarely', 'Socially', 'Regularly']
const SMOKING_OPTIONS = ['Never', 'Occasionally', 'Regularly']
const CANNABIS_OPTIONS = ['Never', 'Occasionally', 'Regularly']
const KIDS_OPTIONS = ['Want kids', 'Open to kids', "Don't want kids", 'Not sure']
const POLITICS_OPTIONS = ['Liberal', 'Moderate', 'Conservative', 'Not political', 'Other']
const RELIGION_OPTIONS = ['Agnostic', 'Atheist', 'Buddhist', 'Christian', 'Hindu', 'Jewish', 'Muslim', 'Spiritual', 'Secular / Not religious', 'Other']
const SEXUALITY_OPTIONS = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Prefer not to say']
const HEIGHT_OPTIONS = ["4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\""]

// ---------------------------------------------------------------------------
// Zod schema — client-side validation before hitting the network
// ---------------------------------------------------------------------------
const profileSchema = z.object({
  bio: z.string().max(500, 'Bio must be 500 characters or fewer').optional(),
  headline: z.string().max(120, 'Headline is too long').optional(),
  currentRole: z.string().max(80, 'Current role is too long').optional(),
  company: z.string().max(80, 'Company is too long').optional(),
  locationLabel: z.string().max(80, 'Location is too long').optional(),
  workLocation: z.string().max(80, 'Work location is too long').optional(),
  futureLocation: z.string().max(80, 'Future location is too long').optional(),
  major: z.string().max(100, 'Major is too long').optional(),
  gpa: z
    .number()
    .min(0, 'GPA must be at least 0')
    .max(4.0, 'GPA cannot exceed 4.0')
    .optional(),
  sat: z
    .number()
    .int()
    .min(400, 'SAT must be at least 400')
    .max(1600, 'SAT cannot exceed 1600')
    .optional(),
  act: z
    .number()
    .int()
    .min(1, 'ACT must be at least 1')
    .max(36, 'ACT cannot exceed 36')
    .optional(),
  interests: z.array(z.string()).optional(),
  values: z
    .array(z.string())
    .max(MAX_VALUES, `Choose up to ${MAX_VALUES} values`)
    .optional(),
  relationshipGoal: z
    .enum(['Marriage', 'Long-term', 'Casual', 'Exploring'])
    .optional(),
  socialLinks: z
    .object({
      instagram: z.string().max(60).optional(),
      twitter: z.string().max(60).optional(),
      tiktok: z.string().max(60).optional(),
      linkedin: z.string().max(100).optional(),
    })
    .optional(),
})

type ProfileSchema = z.infer<typeof profileSchema>
type ValidationErrors = Partial<Record<keyof ProfileSchema, string>>

// ---------------------------------------------------------------------------
// Social link metadata
// ---------------------------------------------------------------------------
interface SocialMeta {
  key: 'instagram' | 'twitter' | 'tiktok' | 'linkedin'
  label: string
  placeholder: string
  prefix: string
  icon: ReactNode
  color: string
}

const SOCIALS: SocialMeta[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    placeholder: 'username',
    prefix: 'instagram.com/',
    icon: <Instagram size={16} />,
    color: 'text-pink-500',
  },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    placeholder: 'username',
    prefix: 'x.com/',
    icon: <Twitter size={16} />,
    color: 'text-sky-500',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    placeholder: 'username',
    prefix: 'tiktok.com/@',
    icon: <Link2 size={16} />,
    color: 'text-gray-900',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'username',
    prefix: 'linkedin.com/in/',
    icon: <Linkedin size={16} />,
    color: 'text-blue-600',
  },
]

// ---------------------------------------------------------------------------
// ID upload state
// ---------------------------------------------------------------------------
type IdUploadState = 'idle' | 'uploading' | 'done' | 'error'

// ---------------------------------------------------------------------------
function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) { setCount(0); return }
    const steps = 30
    const duration = 600
    let current = 0
    const interval = setInterval(() => {
      current += target / steps
      if (current >= target) { setCount(target); clearInterval(interval) }
      else { setCount(Math.floor(current)) }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [target])
  return <>{count}</>
}

// Component
// ---------------------------------------------------------------------------
export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const idInputRef = useRef<HTMLInputElement>(null)
  const postInputRef = useRef<HTMLInputElement>(null)

  // ── UI state ──────────────────────────────────────────────────────────────
  const [editing, setEditing] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoUploadError, setPhotoUploadError] = useState('')
  const [idUploadState, setIdUploadState] = useState<IdUploadState>('idle')
  const [idUploadError, setIdUploadError] = useState('')
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [showSavedToast, setShowSavedToast] = useState(false)

  // ── Edit form state ───────────────────────────────────────────────────────
  const [editBio, setEditBio] = useState('')
  const [editHeadline, setEditHeadline] = useState('')
  const [editCurrentRole, setEditCurrentRole] = useState('')
  const [editCompany, setEditCompany] = useState('')
  const [editLocationLabel, setEditLocationLabel] = useState('')
  const [editWorkLocation, setEditWorkLocation] = useState('')
  const [editFutureLocation, setEditFutureLocation] = useState('')
  const [editMajor, setEditMajor] = useState('')
  const [editGreekOrg, setEditGreekOrg] = useState('')
  const [editGreekOrgType, setEditGreekOrgType] = useState<'FRATERNITY' | 'SORORITY' | 'CO-ED' | ''>('')
  const [editGpa, setEditGpa] = useState('')
  const [editSat, setEditSat] = useState('')
  const [editAct, setEditAct] = useState('')
  const [editGoal, setEditGoal] = useState<RelationshipGoal | ''>('')
  const [editInterests, setEditInterests] = useState<string[]>([])
  const [editValues, setEditValues] = useState<string[]>([])
  const [editSocials, setEditSocials] = useState({
    instagram: '',
    twitter: '',
    tiktok: '',
    linkedin: '',
  })
  const [editPrompts, setEditPrompts] = useState<Array<{ question: string; answer: string }>>([])
  const [showPromptPicker, setShowPromptPicker] = useState(false)

  // ── Lifestyle form state ──────────────────────────────────────────────────
  const [form, setForm] = useState<{
    religion?: string
    height?: string
    drinking?: string
    smoking?: string
    cannabis?: string
    wantsKids?: string
    politicalViews?: string
    birthCity?: string
    sexuality?: string
  }>({})

  // ── Strength stats state ──────────────────────────────────────────────────
  const [strengthForm, setStrengthForm] = useState<{
    bench: string
    squat: string
    deadlift: string
    pullUps: string
    pushUps: string
    videoUrl: string
  }>({ bench: '', squat: '', deadlift: '', pullUps: '', pushUps: '', videoUrl: '' })

  const [postCaption, setPostCaption] = useState('')
  const [postLocationTag, setPostLocationTag] = useState('')
  const [postFile, setPostFile] = useState<File | null>(null)
  const [postPreview, setPostPreview] = useState<string | null>(null)
  const [postError, setPostError] = useState('')

  const { data: profileDetail } = useQuery<ProfileDetail>({
    queryKey: ['profile-detail'],
    queryFn: usersApi.getProfile,
    enabled: !!user,
    staleTime: 1000 * 30,
  })

  // ── Mutation: update profile ──────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => usersApi.updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, updated)
      queryClient.invalidateQueries({ queryKey: ['profile-detail'] })
      queryClient.invalidateQueries({ queryKey: ['user-profile', updated.id] })
      setEditing(false)
      setValidationErrors({})
      setShowSavedToast(true)
      setTimeout(() => setShowSavedToast(false), 1500)
    },
    onError: (err: Error) => {
      // Surface server errors without crashing — toast-less because we show
      // inline error in the save button area instead
      setValidationErrors({ bio: err.message })
    },
  })

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!postFile) {
        throw new Error('Choose a photo before posting.')
      }
      const imageUrl = await uploadToCloudinary(postFile)
      return postsApi.createPost({
        imageUrl,
        caption: postCaption || undefined,
        locationTag: postLocationTag || undefined,
      })
    },
    onSuccess: () => {
      setPostCaption('')
      setPostLocationTag('')
      setPostFile(null)
      setPostPreview(null)
      setPostError('')
      queryClient.invalidateQueries({ queryKey: ['profile-detail'] })
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['user-profile', user.id] })
      }
    },
    onError: (err: Error) => {
      setPostError(err.message)
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postsApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-detail'] })
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['user-profile', user.id] })
      }
    },
  })

  // ── Handlers ──────────────────────────────────────────────────────────────
  const startEditing = useCallback(() => {
    const source = profileDetail ?? user
    if (!source) return
    setEditBio(source.bio ?? '')
    setEditHeadline(source.headline ?? '')
    setEditCurrentRole(source.currentRole ?? '')
    setEditCompany(source.company ?? '')
    setEditLocationLabel(source.locationLabel ?? '')
    setEditWorkLocation(source.workLocation ?? '')
    setEditFutureLocation(source.futureLocation ?? '')
    setEditMajor(source.major ?? '')
    setEditGreekOrg(source.greekOrganization ?? '')
    setEditGreekOrgType((source.greekOrganizationType as 'FRATERNITY' | 'SORORITY' | 'CO-ED') ?? '')
    setEditGpa(source.gpa?.toString() ?? '')
    setEditSat(source.sat?.toString() ?? '')
    setEditAct(source.act?.toString() ?? '')
    setEditGoal((source.relationshipGoal as RelationshipGoal) ?? '')
    setEditInterests(source.interests ?? [])
    setEditValues(source.values ?? [])
    setEditSocials({
      instagram: source.socialLinks?.instagram ?? '',
      twitter: source.socialLinks?.twitter ?? '',
      tiktok: source.socialLinks?.tiktok ?? '',
      linkedin: source.socialLinks?.linkedin ?? '',
    })
    const sourceWithPrompts = source as typeof source & {
      prompts?: Array<{ question: string; answer: string }> | null
      religion?: string | null
      height?: string | null
      drinking?: string | null
      smoking?: string | null
      cannabis?: string | null
      wantsKids?: string | null
      politicalViews?: string | null
      birthCity?: string | null
      sexuality?: string | null
    }
    setEditPrompts(sourceWithPrompts.prompts ?? [])
    setForm({
      religion: sourceWithPrompts.religion ?? undefined,
      height: sourceWithPrompts.height ?? undefined,
      drinking: sourceWithPrompts.drinking ?? undefined,
      smoking: sourceWithPrompts.smoking ?? undefined,
      cannabis: sourceWithPrompts.cannabis ?? undefined,
      wantsKids: sourceWithPrompts.wantsKids ?? undefined,
      politicalViews: sourceWithPrompts.politicalViews ?? undefined,
      birthCity: sourceWithPrompts.birthCity ?? undefined,
      sexuality: sourceWithPrompts.sexuality ?? undefined,
    })
    const ss = (sourceWithPrompts as unknown as { strengthStats?: { bench?: number; squat?: number; deadlift?: number; pullUps?: number; pushUps?: number; videoUrl?: string } }).strengthStats
    setStrengthForm({
      bench: ss?.bench?.toString() ?? '',
      squat: ss?.squat?.toString() ?? '',
      deadlift: ss?.deadlift?.toString() ?? '',
      pullUps: ss?.pullUps?.toString() ?? '',
      pushUps: ss?.pushUps?.toString() ?? '',
      videoUrl: ss?.videoUrl ?? '',
    })
    setShowPromptPicker(false)
    setValidationErrors({})
    setEditing(true)
  }, [profileDetail, user])

  const cancelEditing = useCallback(() => {
    setEditing(false)
    setValidationErrors({})
  }, [])

  const handleSave = useCallback(() => {
    const gpaNum = editGpa ? parseFloat(editGpa) : undefined
    const satNum = editSat ? parseInt(editSat, 10) : undefined
    const actNum = editAct ? parseInt(editAct, 10) : undefined

    // Client-side validation
    const result = profileSchema.safeParse({
      bio: editBio || undefined,
      headline: editHeadline || undefined,
      currentRole: editCurrentRole || undefined,
      company: editCompany || undefined,
      locationLabel: editLocationLabel || undefined,
      workLocation: editWorkLocation || undefined,
      futureLocation: editFutureLocation || undefined,
      major: editMajor || undefined,
      gpa: gpaNum,
      sat: satNum,
      act: actNum,
      interests: editInterests.length ? editInterests : undefined,
      values: editValues.length ? editValues : undefined,
      relationshipGoal: editGoal || undefined,
      socialLinks: {
        instagram: editSocials.instagram || undefined,
        twitter: editSocials.twitter || undefined,
        tiktok: editSocials.tiktok || undefined,
        linkedin: editSocials.linkedin || undefined,
      },
    })

    if (!result.success) {
      const errors: ValidationErrors = {}
      result.error.issues.forEach((e) => {
        const key = e.path[0] as keyof ValidationErrors
        if (key) errors[key] = e.message
      })
      setValidationErrors(errors)
      return
    }

    const payload: UpdateProfilePayload = {
      bio: editBio || undefined,
      headline: editHeadline || undefined,
      currentRole: editCurrentRole || undefined,
      company: editCompany || undefined,
      locationLabel: editLocationLabel || undefined,
      workLocation: editWorkLocation || undefined,
      futureLocation: editFutureLocation || undefined,
      major: editMajor || undefined,
      greekOrganization: editGreekOrg || undefined,
      greekOrganizationType: (editGreekOrgType as 'FRATERNITY' | 'SORORITY' | 'CO-ED') || undefined,
      gpa: gpaNum,
      sat: satNum,
      act: actNum,
      interests: editInterests.length ? editInterests : undefined,
      values: editValues.length ? editValues : undefined,
      relationshipGoal: editGoal || undefined,
      socialLinks: {
        instagram: editSocials.instagram || undefined,
        twitter: editSocials.twitter || undefined,
        tiktok: editSocials.tiktok || undefined,
        linkedin: editSocials.linkedin || undefined,
      },
      prompts: editPrompts.length ? editPrompts : undefined,
      religion: form.religion,
      height: form.height,
      drinking: form.drinking,
      smoking: form.smoking,
      cannabis: form.cannabis,
      wantsKids: form.wantsKids,
      politicalViews: form.politicalViews,
      birthCity: form.birthCity,
      sexuality: form.sexuality,
      strengthStats: (strengthForm.bench || strengthForm.squat || strengthForm.deadlift || strengthForm.pullUps || strengthForm.pushUps || strengthForm.videoUrl) ? {
        bench: strengthForm.bench ? Number(strengthForm.bench) : undefined,
        squat: strengthForm.squat ? Number(strengthForm.squat) : undefined,
        deadlift: strengthForm.deadlift ? Number(strengthForm.deadlift) : undefined,
        pullUps: strengthForm.pullUps ? Number(strengthForm.pullUps) : undefined,
        pushUps: strengthForm.pushUps ? Number(strengthForm.pushUps) : undefined,
        videoUrl: strengthForm.videoUrl || undefined,
      } : undefined,
    }

    updateMutation.mutate(payload)
  }, [
    editBio,
    editHeadline,
    editCurrentRole,
    editCompany,
    editLocationLabel,
    editWorkLocation,
    editFutureLocation,
    editMajor,
    editGreekOrg,
    editGreekOrgType,
    editGpa,
    editSat,
    editAct,
    editGoal,
    editInterests,
    editValues,
    editSocials,
    editPrompts,
    form,
    updateMutation,
  ])

  const handlePhotoChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setUploadingPhoto(true)
      setPhotoUploadError('')
      try {
        const url = await uploadToCloudinary(file)
        const updated = await usersApi.updateProfile({ profilePhotoUrl: url })
        queryClient.setQueryData(AUTH_QUERY_KEY, updated)
      } catch (err) {
        setPhotoUploadError(err instanceof Error ? err.message : 'Photo upload failed — please try again.')
      } finally {
        setUploadingPhoto(false)
        // Reset so same file can be re-selected
        e.target.value = ''
      }
    },
    [queryClient]
  )

  const handleIdUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setIdUploadState('uploading')
      setIdUploadError('')
      try {
        const url = await uploadToCloudinary(file)
        const updated = await usersApi.verifyIdentity({ idPhotoUrl: url })
        queryClient.setQueryData(AUTH_QUERY_KEY, updated)
        queryClient.invalidateQueries({ queryKey: ['profile-detail'] })
        queryClient.invalidateQueries({ queryKey: ['user-profile', updated.id] })
        setIdUploadState('done')
      } catch (err) {
        setIdUploadState('error')
        setIdUploadError(err instanceof Error ? err.message : 'Verification failed.')
      } finally {
        e.target.value = ''
      }
    },
    [queryClient]
  )

  const handlePostSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setPostError('Post photo must be under 10MB.')
      return
    }
    setPostFile(file)
    setPostPreview(URL.createObjectURL(file))
    setPostError('')
    e.target.value = ''
  }, [])

  const toggleInterest = useCallback((interest: string) => {
    setEditInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }, [])

  const toggleValue = useCallback((value: string) => {
    setEditValues((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value)
      if (prev.length >= MAX_VALUES) return prev
      return [...prev, value]
    })
  }, [])

  const updateSocial = useCallback(
    (key: keyof typeof editSocials, val: string) => {
      setEditSocials((prev) => ({ ...prev, [key]: val }))
    },
    []
  )

  if (!user) return null

  const displayProfile = profileDetail ?? user
  const fullName = `${user.firstName} ${user.lastName}`
  const isSaving = updateMutation.isPending
  const serverError = updateMutation.isError ? updateMutation.error?.message : undefined
  const profileStats = profileDetail?.stats
  const profilePosts = profileDetail?.posts ?? []

  // Profile completion ring (0–100)
  const dp = displayProfile as typeof displayProfile & {
    prompts?: Array<{ question: string; answer: string }> | null
    religion?: string | null
    height?: string | null
    drinking?: string | null
    smoking?: string | null
    cannabis?: string | null
    wantsKids?: string | null
    politicalViews?: string | null
  }
  const lifestyleCount = [dp.religion, dp.height, dp.drinking, dp.smoking, dp.cannabis, dp.wantsKids, dp.politicalViews].filter(Boolean).length
  const promptCount = dp.prompts?.length ?? 0
  const completionPct = Math.round(
    (dp.profilePhotoUrl ? 20 : 0) +
    (dp.bio ? 15 : 0) +
    (promptCount >= 1 ? 20 : 0) +
    (promptCount >= 3 ? 10 : 0) +
    (lifestyleCount >= 3 ? 20 : 0) +
    15 // name always present
  )

  // Determine the most impactful missing field for the actionable suggestion
  const completionSuggestion: string | null = (() => {
    if (!dp.profilePhotoUrl) return 'Add a profile photo to reach ' + Math.min(100, completionPct + 20) + '%'
    if (!dp.bio) return 'Add your bio to reach ' + Math.min(100, completionPct + 15) + '%'
    if (promptCount < 1) return 'Answer a prompt to reach ' + Math.min(100, completionPct + 20) + '%'
    if (promptCount < 3) return 'Add ' + (3 - promptCount) + ' more prompt' + (3 - promptCount !== 1 ? 's' : '') + ' to reach ' + Math.min(100, completionPct + 10) + '%'
    if (lifestyleCount < 3) return 'Add lifestyle info to reach ' + Math.min(100, completionPct + 20) + '%'
    if (!dp.headline) return 'Add a headline — your one-liner for first impressions'
    return null
  })()
  const ringRadius = 64
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference * (1 - completionPct / 100)

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-gradient-to-br from-gray-50 via-white to-purple-50/20 min-h-screen pb-10"
      >
        <div className="px-5 pt-4">
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Your Profile</h1>
            <p className="text-xs text-gray-400 mt-0.5">Your first impression matters</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/settings')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Settings"
            >
              <Settings size={17} className="text-gray-600" />
            </button>
            <AnimatePresence mode="wait">
              {!editing ? (
                <motion.div
                  key="edit-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button variant="secondary" size="sm" onClick={startEditing}>
                    <Edit3 size={14} />
                    Edit
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="action-btns"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="flex gap-2"
                >
                  <Button variant="ghost" size="sm" onClick={cancelEditing} disabled={isSaving}>
                    <X size={14} />
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" loading={isSaving} onClick={handleSave}>
                    <Save size={14} />
                    Save
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Premium banner ──────────────────────────────────────────────── */}
        {(() => {
          const profileUser = user as typeof user & { isPremium?: boolean }
          return !profileUser?.isPremium ? (
            <button
              onClick={() => navigate('/premium')}
              className="-mx-0 mb-4 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-900 via-violet-800 to-purple-900 px-4 py-3 text-left shadow-sm"
            >
              <Crown size={18} className="flex-shrink-0 text-amber-400" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">Upgrade to Apex Premium</p>
                <p className="text-xs text-purple-300">See viewers, unlock search, message anyone</p>
              </div>
              <ChevronRight size={16} className="flex-shrink-0 text-white/40" />
            </button>
          ) : null
        })()}

        {/* ── Avatar + name ───────────────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-8">
          {/* Avatar with completion ring + upload button */}
          <div className="relative mb-4">
            {/* Completion ring SVG */}
            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              className="absolute -inset-[14px] -z-0"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle cx="70" cy="70" r={ringRadius} fill="none" stroke="#e9d5ff" strokeWidth="4" />
              <motion.circle
                cx="70"
                cy="70"
                r={ringRadius}
                fill="none"
                stroke="#9333ea"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                initial={{ strokeDashoffset: ringCircumference }}
                animate={{ strokeDashoffset: ringOffset }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
            {/* Completion % label */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              {completionPct}%
            </div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Avatar
                src={user.profilePhotoUrl}
                name={fullName}
                size="xl"
                className="!w-28 !h-28 ring-4 ring-purple-100"
              />
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => photoInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-1 -right-1 w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-purple-700 transition-colors disabled:opacity-60"
              aria-label="Change profile photo"
            >
              {uploadingPhoto ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Camera size={15} className="text-white" />
              )}
            </motion.button>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              aria-hidden
            />
          </div>

          {photoUploadError && (
            <p className="text-xs text-red-500 font-medium mt-1 text-center max-w-[200px]">
              {photoUploadError}
            </p>
          )}

          <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
          {user.age > 0 && <p className="text-sm text-gray-500 mt-0.5">{user.age} years old</p>}

          {/* Badges row */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {user.isEmailVerified && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0, type: 'spring', stiffness: 500, damping: 28 }}
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                <CheckCircle size={11} />
                Email verified
              </motion.span>
            )}
            {user.isIdVerified && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.08, type: 'spring', stiffness: 500, damping: 28 }}
                className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                <ShieldCheck size={11} />
                ID verified
              </motion.span>
            )}
            {!user.isEmailVerified && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0, type: 'spring', stiffness: 500, damping: 28 }}
                className="flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                Email unverified
              </motion.span>
            )}
          </div>
        </div>

        {/* ── Profile completion progress bar ────────────────────────────── */}
        {completionPct < 100 && (
          <div className="mb-5 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">Profile strength</span>
              <span className="text-xs font-bold text-purple-600">{completionPct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            {completionSuggestion && (
              <p className="mt-2 text-xs text-gray-500">{completionSuggestion}</p>
            )}
          </div>
        )}

        {/* ── Server error banner ─────────────────────────────────────────── */}
        <div className="mb-5 rounded-[28px] bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#312e81] px-5 py-5 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Profile Identity</p>
          <h3 className="mt-3 text-xl font-bold">
            {displayProfile.headline ||
              (displayProfile.currentRole && displayProfile.company
                ? `${displayProfile.currentRole} at ${displayProfile.company}`
                : displayProfile.currentRole || 'Shape how you are remembered.')}
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {displayProfile.currentRole && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85">
                <Briefcase size={13} />
                {displayProfile.currentRole}
              </span>
            )}
            {displayProfile.company && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85">
                <Building2 size={13} />
                {displayProfile.company}
              </span>
            )}
            {displayProfile.locationLabel && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85">
                <MapPin size={13} />
                {displayProfile.locationLabel}
              </span>
            )}
            {displayProfile.workLocation && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85">
                <Building2 size={13} />
                Works in {displayProfile.workLocation}
              </span>
            )}
            {displayProfile.futureLocation && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85">
                <ChevronRight size={13} />
                Moving to {displayProfile.futureLocation}
              </span>
            )}
          </div>
          {profileStats && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Connections</p>
                <p className="mt-1 text-2xl font-semibold">
                  <CountUp target={profileStats.connectionCount} />
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Posts</p>
                <p className="mt-1 text-2xl font-semibold">
                  <CountUp target={profileStats.postCount} />
                </p>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-4 flex items-start gap-2"
            >
              <X size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{serverError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Profile sections ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* College */}
          {displayProfile.college && (
            <div className="card p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">
                  College
                </p>
                <p className="font-semibold text-gray-900">{displayProfile.college.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {displayProfile.college.state} · {displayProfile.college.tier}
                </p>
              </div>
            </div>
          )}

          <SectionCard label="Professional Snapshot">
            {editing ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    placeholder="Building something thoughtful, ambitious, and real"
                    className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      Current role
                    </label>
                    <input
                      type="text"
                      value={editCurrentRole}
                      onChange={(e) => setEditCurrentRole(e.target.value)}
                      placeholder="Founder"
                      className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      Company
                    </label>
                    <input
                      type="text"
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      placeholder="Apex"
                      className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Current area
                  </label>
                  <input
                    type="text"
                    value={editLocationLabel}
                    onChange={(e) => setEditLocationLabel(e.target.value)}
                    placeholder="Ann Arbor, MI"
                    className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      Work location
                    </label>
                    <input
                      type="text"
                      value={editWorkLocation}
                      onChange={(e) => setEditWorkLocation(e.target.value)}
                      placeholder="Chicago, IL"
                      className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      Moving to
                    </label>
                    <input
                      type="text"
                      value={editFutureLocation}
                      onChange={(e) => setEditFutureLocation(e.target.value)}
                      placeholder="Chicago, IL"
                      className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            ) : displayProfile.headline ||
              displayProfile.currentRole ||
              displayProfile.company ||
              displayProfile.locationLabel ||
              displayProfile.workLocation ||
              displayProfile.futureLocation ? (
              <div className="flex flex-col gap-3">
                {displayProfile.headline && (
                  <p className="text-sm leading-relaxed text-gray-700">{displayProfile.headline}</p>
                )}
                {displayProfile.currentRole && (
                  <div className="flex items-center gap-2.5">
                    <Briefcase size={15} className="text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {[displayProfile.currentRole, displayProfile.company].filter(Boolean).join(' at ')}
                    </span>
                  </div>
                )}
                {displayProfile.locationLabel && (
                  <div className="flex items-center gap-2.5">
                    <MapPin size={15} className="text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Current area: {displayProfile.locationLabel}</span>
                  </div>
                )}
                {displayProfile.workLocation && (
                  <div className="flex items-center gap-2.5">
                    <Building2 size={15} className="text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Work location: {displayProfile.workLocation}</span>
                  </div>
                )}
                {displayProfile.futureLocation && (
                  <div className="flex items-center gap-2.5">
                    <ChevronRight size={15} className="text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Moving to: {displayProfile.futureLocation}</span>
                  </div>
                )}
              </div>
            ) : (
              <EmptyFieldPrompt>
                Add your current area, work city, and next move so people can find you based on where life is actually headed.
              </EmptyFieldPrompt>
            )}
          </SectionCard>

          {/* About */}
          <SectionCard label="About">
            {editing ? (
              <div className="flex flex-col gap-1.5">
                <Textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell people what makes you, you..."
                  rows={4}
                  maxLength={500}
                  className="bg-gray-50"
                />
                <div className="flex justify-between">
                  {validationErrors.bio ? (
                    <p className="text-xs text-red-500">{validationErrors.bio}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-gray-400">{editBio.length}/500</p>
                </div>
              </div>
            ) : displayProfile.bio ? (
              <p className="text-sm text-gray-700 leading-relaxed">{displayProfile.bio}</p>
            ) : (
              <EmptyFieldPrompt>Share what makes you, you — bio helps you stand out.</EmptyFieldPrompt>
            )}
          </SectionCard>

          {/* Academics */}
          <SectionCard label="Academics">
            {editing ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Major
                  </label>
                  <input
                    type="text"
                    value={editMajor}
                    onChange={(e) => setEditMajor(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Greek Life (optional)</label>
                  <div className="flex gap-2">
                    {(['FRATERNITY', 'SORORITY', 'CO-ED'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEditGreekOrgType(editGreekOrgType === type ? '' : type)}
                        className={`flex-1 rounded-xl py-2 text-xs font-semibold border transition-all ${
                          editGreekOrgType === type
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-400'
                        }`}
                      >
                        {type === 'FRATERNITY' ? '🏛️ Frat' : type === 'SORORITY' ? '💜 Sorority' : '⚡ Co-ed'}
                      </button>
                    ))}
                  </div>
                  {editGreekOrgType && (
                    <input
                      type="text"
                      value={editGreekOrg}
                      onChange={(e) => setEditGreekOrg(e.target.value)}
                      placeholder="e.g. Sigma Chi, Kappa Kappa Gamma..."
                      className="w-full rounded-2xl bg-gray-100 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      GPA
                    </label>
                    <input
                      type="number"
                      value={editGpa}
                      onChange={(e) => setEditGpa(e.target.value)}
                      placeholder="3.8"
                      min="0"
                      max="4.0"
                      step="0.01"
                      className={`w-full bg-gray-50 rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        validationErrors.gpa ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {validationErrors.gpa && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.gpa}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      SAT
                    </label>
                    <input
                      type="number"
                      value={editSat}
                      onChange={(e) => setEditSat(e.target.value)}
                      placeholder="1540"
                      min="400"
                      max="1600"
                      className={`w-full bg-gray-50 rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        validationErrors.sat ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {validationErrors.sat && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.sat}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      ACT
                    </label>
                    <input
                      type="number"
                      value={editAct}
                      onChange={(e) => setEditAct(e.target.value)}
                      placeholder="34"
                      min="1"
                      max="36"
                      className={`w-full bg-gray-50 rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        validationErrors.act ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {validationErrors.act && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.act}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {displayProfile.major && (
                  <div className="flex items-center gap-2.5">
                    <BookOpen size={15} className="text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{displayProfile.major}</span>
                  </div>
                )}
                {displayProfile.greekOrganization && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{displayProfile.greekOrganizationType === 'FRATERNITY' ? '🏛️' : '💜'}</span>
                    <span className="text-sm font-medium text-gray-700">{displayProfile.greekOrganization}</span>
                  </div>
                )}
                {displayProfile.gpa && (
                  <div className="flex items-center gap-2.5">
                    <Award size={15} className="text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">GPA {displayProfile.gpa.toFixed(2)}</span>
                  </div>
                )}
                {displayProfile.sat && (
                  <div className="flex items-center gap-2.5">
                    <Award size={15} className="text-amber-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">SAT {displayProfile.sat}</span>
                  </div>
                )}
                {displayProfile.act && (
                  <div className="flex items-center gap-2.5">
                    <Award size={15} className="text-sky-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">ACT {displayProfile.act}</span>
                  </div>
                )}
                {!displayProfile.major && !displayProfile.gpa && !displayProfile.sat && !displayProfile.act && (
                  <EmptyFieldPrompt>Add your academics to attract like-minded people.</EmptyFieldPrompt>
                )}
              </div>
            )}
          </SectionCard>

          {/* Looking for */}
          <SectionCard label="Looking for">
            {editing ? (
              <div className="grid grid-cols-2 gap-2">
                {RELATIONSHIP_GOALS.map((goal) => (
                  <motion.button
                    key={goal}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setEditGoal(goal)}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      editGoal === goal
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                    }`}
                  >
                    {GOAL_LABELS[goal]}
                  </motion.button>
                ))}
              </div>
            ) : displayProfile.relationshipGoal ? (
              <div className="flex items-center gap-2.5">
                <Target size={15} className="text-purple-400 flex-shrink-0" />
                <span className="text-sm text-gray-700">{displayProfile.relationshipGoal}</span>
              </div>
            ) : (
              <EmptyFieldPrompt>Let people know what you're here for.</EmptyFieldPrompt>
            )}
          </SectionCard>

          {/* Interests */}
          <SectionCard label="Interests">
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <motion.button
                    key={interest}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      editInterests.includes(interest)
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {editInterests.includes(interest) ? (
                      <Minus size={11} className="flex-shrink-0" />
                    ) : (
                      <Plus size={11} className="flex-shrink-0" />
                    )}
                    {interest}
                  </motion.button>
                ))}
              </div>
            ) : displayProfile.interests && displayProfile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayProfile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-purple-50 text-purple-700 text-sm font-medium px-3 py-1.5 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyFieldPrompt>Add interests to spark instant conversation starters.</EmptyFieldPrompt>
            )}
          </SectionCard>

          {/* Values */}
          <SectionCard
            label="Core Values"
            hint={editing ? `Choose up to ${MAX_VALUES}` : undefined}
          >
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {VALUES.map((value) => {
                  const selected = editValues.includes(value)
                  const atMax = editValues.length >= MAX_VALUES && !selected
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleValue(value)}
                      disabled={atMax}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all disabled:opacity-40 ${
                        selected
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {selected ? (
                        <Heart size={11} className="flex-shrink-0 fill-white" />
                      ) : (
                        <Plus size={11} className="flex-shrink-0" />
                      )}
                      {value}
                    </motion.button>
                  )
                })}
                {validationErrors.values && (
                  <p className="w-full text-xs text-red-500 mt-1">{validationErrors.values}</p>
                )}
              </div>
            ) : displayProfile.values && displayProfile.values.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayProfile.values.map((value) => (
                  <span
                    key={value}
                    className="bg-violet-50 text-violet-700 text-sm font-medium px-3 py-1.5 rounded-full"
                  >
                    {value}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyFieldPrompt>Share your core values — they signal real compatibility.</EmptyFieldPrompt>
            )}
          </SectionCard>

          {/* Lifestyle */}
          <SectionCard label="Lifestyle">
            {editing ? (
              <div className="space-y-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">Lifestyle</p>

                {/* Height */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Height</label>
                  <select
                    value={form.height ?? ''}
                    onChange={e => setForm(f => ({ ...f, height: e.target.value || undefined }))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-purple-400 focus:outline-none"
                  >
                    <option value="">Select height</option>
                    {HEIGHT_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                {/* Drinking */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Drinking</label>
                  <div className="flex flex-wrap gap-2">
                    {DRINKING_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, drinking: f.drinking === opt ? undefined : opt }))}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
                          form.drinking === opt
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smoking */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Smoking</label>
                  <div className="flex flex-wrap gap-2">
                    {SMOKING_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, smoking: f.smoking === opt ? undefined : opt }))}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
                          form.smoking === opt
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cannabis */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cannabis</label>
                  <div className="flex flex-wrap gap-2">
                    {CANNABIS_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, cannabis: f.cannabis === opt ? undefined : opt }))}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
                          form.cannabis === opt
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wants kids */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kids</label>
                  <div className="flex flex-wrap gap-2">
                    {KIDS_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, wantsKids: f.wantsKids === opt ? undefined : opt }))}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
                          form.wantsKids === opt
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Religion */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Religion</label>
                  <div className="flex flex-wrap gap-2">
                    {RELIGION_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, religion: f.religion === opt ? undefined : opt }))}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
                          form.religion === opt
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Political views */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Political views</label>
                  <div className="flex flex-wrap gap-2">
                    {POLITICS_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, politicalViews: f.politicalViews === opt ? undefined : opt }))}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
                          form.politicalViews === opt
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sexuality */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sexuality</label>
                  <div className="flex flex-wrap gap-2">
                    {SEXUALITY_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, sexuality: f.sexuality === opt ? undefined : opt }))}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
                          form.sexuality === opt
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Birth city */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Birth city</label>
                  <input
                    type="text"
                    value={form.birthCity ?? ''}
                    onChange={e => setForm(f => ({ ...f, birthCity: e.target.value || undefined }))}
                    placeholder="e.g. Dubai, UAE"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              (() => {
                const dp = displayProfile as typeof displayProfile & {
                  religion?: string | null
                  height?: string | null
                  drinking?: string | null
                  smoking?: string | null
                  cannabis?: string | null
                  wantsKids?: string | null
                  politicalViews?: string | null
                  birthCity?: string | null
                  sexuality?: string | null
                }
                const hasAny = dp.height || dp.religion || dp.drinking || dp.smoking || dp.cannabis || dp.wantsKids || dp.politicalViews || dp.birthCity || dp.sexuality
                if (!hasAny) {
                  return <EmptyFieldPrompt>Add your lifestyle details — they spark real conversations.</EmptyFieldPrompt>
                }
                return (
                  <div className="flex flex-wrap gap-2">
                    {dp.height && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700">
                        📏 {dp.height}
                      </span>
                    )}
                    {dp.religion && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700">
                        🙏 {dp.religion}
                      </span>
                    )}
                    {dp.drinking && dp.drinking !== 'Never' && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700">
                        🍷 Drinks {dp.drinking.toLowerCase()}
                      </span>
                    )}
                    {dp.drinking === 'Never' && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700">
                        🚫 Doesn&apos;t drink
                      </span>
                    )}
                    {dp.smoking && dp.smoking !== 'Never' && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700">
                        🚬 Smokes {dp.smoking.toLowerCase()}
                      </span>
                    )}
                    {dp.wantsKids && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700">
                        👶 {dp.wantsKids}
                      </span>
                    )}
                    {dp.politicalViews && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700">
                        🗳 {dp.politicalViews}
                      </span>
                    )}
                    {dp.sexuality && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700">
                        {dp.sexuality}
                      </span>
                    )}
                    {dp.birthCity && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700">
                        🌍 Born in {dp.birthCity}
                      </span>
                    )}
                  </div>
                )
              })()
            )}
          </SectionCard>

          {/* Strength showcase */}
          <SectionCard label="Strength">
            {editing ? (
              <div className="space-y-4">
                <p className="text-xs text-gray-400">Showcase your lifts. All weights in lbs. Add a video link to verify.</p>
                <div className="grid grid-cols-2 gap-3">
                  {([['bench', '🏋️ Bench Press'], ['squat', '🦵 Squat'], ['deadlift', '⚡ Deadlift']] as const).map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-400">
                        <input
                          type="number"
                          value={strengthForm[key]}
                          onChange={(e) => setStrengthForm(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder="lbs"
                          className="flex-1 bg-transparent py-2.5 px-3 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
                        />
                        <span className="pr-3 text-xs text-gray-400">lbs</span>
                      </div>
                    </div>
                  ))}
                  {([['pullUps', '💪 Pull-ups'], ['pushUps', '🤸 Push-ups']] as const).map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-400">
                        <input
                          type="number"
                          value={strengthForm[key]}
                          onChange={(e) => setStrengthForm(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder="reps"
                          className="flex-1 bg-transparent py-2.5 px-3 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
                        />
                        <span className="pr-3 text-xs text-gray-400">reps</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">🎥 Proof video URL (optional)</label>
                  <input
                    type="url"
                    value={strengthForm.videoUrl}
                    onChange={(e) => setStrengthForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="YouTube, Instagram, TikTok link..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
            ) : (() => {
              const ss = (displayProfile as unknown as { strengthStats?: { bench?: number; squat?: number; deadlift?: number; pullUps?: number; pushUps?: number; videoUrl?: string } }).strengthStats
              if (!ss || (!ss.bench && !ss.squat && !ss.deadlift && !ss.pullUps && !ss.pushUps)) {
                return <EmptyFieldPrompt>Add your lifts — bench, squat, deadlift, pull-ups, push-ups.</EmptyFieldPrompt>
              }
              return (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {ss.bench && (
                      <div className="flex flex-col items-center bg-gray-50 rounded-xl py-3 px-2 border border-gray-100">
                        <span className="text-lg font-bold text-gray-900">{ss.bench}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">lbs</span>
                        <span className="text-xs text-gray-600 mt-0.5">Bench</span>
                      </div>
                    )}
                    {ss.squat && (
                      <div className="flex flex-col items-center bg-gray-50 rounded-xl py-3 px-2 border border-gray-100">
                        <span className="text-lg font-bold text-gray-900">{ss.squat}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">lbs</span>
                        <span className="text-xs text-gray-600 mt-0.5">Squat</span>
                      </div>
                    )}
                    {ss.deadlift && (
                      <div className="flex flex-col items-center bg-gray-50 rounded-xl py-3 px-2 border border-gray-100">
                        <span className="text-lg font-bold text-gray-900">{ss.deadlift}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">lbs</span>
                        <span className="text-xs text-gray-600 mt-0.5">Deadlift</span>
                      </div>
                    )}
                    {ss.pullUps && (
                      <div className="flex flex-col items-center bg-gray-50 rounded-xl py-3 px-2 border border-gray-100">
                        <span className="text-lg font-bold text-gray-900">{ss.pullUps}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">reps</span>
                        <span className="text-xs text-gray-600 mt-0.5">Pull-ups</span>
                      </div>
                    )}
                    {ss.pushUps && (
                      <div className="flex flex-col items-center bg-gray-50 rounded-xl py-3 px-2 border border-gray-100">
                        <span className="text-lg font-bold text-gray-900">{ss.pushUps}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">reps</span>
                        <span className="text-xs text-gray-600 mt-0.5">Push-ups</span>
                      </div>
                    )}
                  </div>
                  {ss.videoUrl && (
                    <a
                      href={ss.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-purple-600 font-medium hover:text-purple-700"
                    >
                      🎥 Watch proof video
                    </a>
                  )}
                </div>
              )
            })()}
          </SectionCard>

          {/* Social links */}
          <SectionCard label="Social Links">
            {editing ? (
              <div className="flex flex-col gap-3">
                {SOCIALS.map(({ key, label, placeholder, prefix, icon, color }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      {label}
                    </label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
                      <div className={`pl-3 pr-2 flex items-center gap-1.5 ${color} flex-shrink-0`}>
                        {icon}
                        <span className="text-xs text-gray-400 select-none">{prefix}</span>
                      </div>
                      <input
                        type="text"
                        value={editSocials[key]}
                        onChange={(e) => updateSocial(key, e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent py-3 pr-4 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400 min-w-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {/* View mode: show filled socials as clickable links */}
                {(() => {
                  const links = SOCIALS.filter(({ key }) => !!displayProfile.socialLinks?.[key])
                  if (links.length === 0) {
                    return (
                      <EmptyFieldPrompt>
                        Add your socials so matches can find you easily.
                      </EmptyFieldPrompt>
                    )
                  }
                  return (
                    <div className="flex flex-wrap gap-3">
                      {links.map(({ key, label, prefix, icon, color }) => {
                        const username = displayProfile.socialLinks?.[key]
                        const url = `https://${prefix}${username}`
                        return (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 ${color} bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2 text-sm font-medium transition-colors`}
                          >
                            {icon}
                            <span className="text-gray-700">@{username}</span>
                          </a>
                        )
                      })}
                    </div>
                  )
                })()}
              </div>
            )}
          </SectionCard>

          {/* Prompts */}
          <SectionCard label="Your Prompts" hint="Up to 5 answers that show who you actually are.">
            {editing ? (
              <div>
                <div className="space-y-3">
                  {editPrompts.map((p, i) => (
                    <div key={i} className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-gradient-to-b from-purple-400 to-violet-500" />
                      <div className="pl-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">{p.question}</p>
                        <textarea
                          value={p.answer}
                          onChange={(e) => {
                            const updated = [...editPrompts]
                            updated[i] = { ...updated[i], answer: e.target.value }
                            setEditPrompts(updated)
                          }}
                          placeholder="Your answer..."
                          rows={2}
                          maxLength={300}
                          className="mt-2 w-full resize-none bg-transparent text-base font-semibold text-gray-900 placeholder-gray-300 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditPrompts(editPrompts.filter((_, idx) => idx !== i))}
                        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {editPrompts.length < 5 && (
                  <div className="mt-3">
                    {showPromptPicker ? (
                      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">Choose a prompt</p>
                          <button type="button" onClick={() => setShowPromptPicker(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                          {APEX_PROMPTS.filter(q => !editPrompts.find(p => p.question === q)).map(q => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => {
                                setEditPrompts([...editPrompts, { question: q, answer: '' }])
                                setShowPromptPicker(false)
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowPromptPicker(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-3 text-sm font-semibold text-gray-400 transition-colors hover:border-purple-300 hover:text-purple-500"
                      >
                        <Plus size={16} />
                        Add a prompt
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (() => {
              const displayWithPrompts = displayProfile as typeof displayProfile & { prompts?: Array<{ question: string; answer: string }> | null }
              const prompts = displayWithPrompts.prompts
              if (!prompts || prompts.length === 0) {
                return <EmptyFieldPrompt>Add up to 5 prompts to show who you actually are beyond the resume.</EmptyFieldPrompt>
              }
              return (
                <div className="space-y-3">
                  {prompts.map((p, i) => (
                    <div key={i} className="relative rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-gradient-to-b from-purple-400 to-violet-500" />
                      <div className="pl-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">{p.question}</p>
                        <p className="mt-1.5 text-sm font-semibold text-gray-900 leading-relaxed">{p.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </SectionCard>

          <SectionCard label="Profile Moments" hint="Instagram energy, curated intentionally">
            <div className="flex flex-col gap-4">
              <input
                ref={postInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePostSelect}
                className="hidden"
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={() => postInputRef.current?.click()}
                className={`flex items-center gap-3 rounded-3xl border border-dashed px-4 py-4 text-left transition-all ${
                  postPreview
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">
                  <ImagePlus size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {postPreview ? 'Change post photo' : 'Add a new profile moment'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Share a polished image that adds context to who you are.
                  </p>
                </div>
              </button>

              {postPreview && (
                <div className="overflow-hidden rounded-[26px] bg-gray-100">
                  <img src={postPreview} alt="Post preview" className="aspect-[4/5] w-full object-cover" />
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Caption
                  </label>
                  <Textarea
                    value={postCaption}
                    onChange={(e) => setPostCaption(e.target.value.slice(0, 280))}
                    rows={3}
                    placeholder="What does this moment say about you?"
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Location tag
                  </label>
                  <input
                    type="text"
                    value={postLocationTag}
                    onChange={(e) => setPostLocationTag(e.target.value)}
                    placeholder="SoHo, NYC"
                    className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={createPostMutation.isPending}
                    disabled={!postFile}
                    onClick={() => createPostMutation.mutate()}
                  >
                    <ImagePlus size={15} />
                    Publish Moment
                  </Button>
                </div>
              </div>

              {postError && <p className="text-xs text-red-500">{postError}</p>}

              {profilePosts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {profilePosts.map((post) => (
                    <div key={post.id} className="overflow-hidden rounded-[24px] bg-gray-50">
                      <img src={post.imageUrl} alt={post.caption ?? 'Profile post'} className="aspect-square w-full object-cover" />
                      <div className="px-3 py-3">
                        {post.locationTag && (
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            {post.locationTag}
                          </p>
                        )}
                        {post.caption && (
                          <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-gray-700">{post.caption}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => deletePostMutation.mutate(post.id)}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-500 transition-colors hover:text-red-600"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyFieldPrompt>
                  Add a few polished moments so your profile feels like a person, not just a résumé.
                </EmptyFieldPrompt>
              )}
            </div>
          </SectionCard>

          {/* ID Verification */}
          <div className="card p-5">
            {user.isIdVerified ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={22} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Identity Verified</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Your verified badge is shown on your profile.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                  <Shield size={24} className="text-gray-400" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">Verify your identity</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-xs">
                  Upload a government ID to confirm you are 18+ and earn the verified badge.
                </p>

                <AnimatePresence mode="wait">
                  {idUploadState === 'uploading' && (
                    <motion.div
                      key="uploading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-sm text-gray-500"
                    >
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
                      Uploading securely...
                    </motion.div>
                  )}

                  {idUploadState === 'done' && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 text-sm text-emerald-600 font-medium"
                    >
                      <CheckCircle size={16} />
                      18+ identity verified
                    </motion.div>
                  )}

                  {idUploadState === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <p className="text-sm text-red-500">{idUploadError || 'Upload failed — please try again.'}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIdUploadState('idle')
                          idInputRef.current?.click()
                        }}
                      >
                        Retry
                      </Button>
                    </motion.div>
                  )}

                  {idUploadState === 'idle' && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => idInputRef.current?.click()}
                      >
                        <ShieldCheck size={15} />
                        Upload Photo ID
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  ref={idInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleIdUpload}
                  className="hidden"
                  aria-hidden
                />

                <p className="text-xs text-gray-400 mt-3">
                  Your ID is encrypted, never shown to other users, and only used for 18+ verification.
                </p>
              </div>
            )}
          </div>

          {/* Save button (also at bottom for long pages) */}
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSaving}
                  onClick={handleSave}
                  className="mt-2"
                >
                  <Save size={16} />
                  Save Changes
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
        </div>
      </motion.div>

      {/* ── Saved toast ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold text-white shadow-lg"
          >
            Saved ✓
          </motion.div>
        )}
      </AnimatePresence>

    </AppLayout>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SectionCardProps {
  label: string
  hint?: string
  children: ReactNode
}

function SectionCard({ label, hint, children }: SectionCardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">{label}</p>
        {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function EmptyFieldPrompt({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-gray-400 italic leading-relaxed">{children}</p>
  )
}

