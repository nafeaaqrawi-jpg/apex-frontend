import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Upload,
  Search,
  Lock,
  Shield,
  ShieldCheck,
  Video,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import { collegesApi } from '../../api/colleges'
import { usersApi, uploadToCloudinary } from '../../api/users'
import { AUTH_QUERY_KEY } from '../../hooks/useAuth'
import { INTERESTS, VALUES } from '../../types'
import type { College, Gender } from '../../types'

// ─── Video upload helper ──────────────────────────────────────────────────────

async function uploadVideoToCloudinary(blob: Blob): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
  const formData = new FormData()
  formData.append('file', blob, 'verification.webm')
  formData.append('upload_preset', 'apex_upload')
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    { method: 'POST', body: formData }
  )
  if (!res.ok) throw new Error('Upload failed')
  const json = (await res.json()) as { secure_url: string }
  return json.secure_url
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 82 }, (_, i) => CURRENT_YEAR - 100 + i).reverse()

const GENDERS: Gender[] = ['Man', 'Woman', 'Non-binary', 'Prefer not to say']

const RELATIONSHIP_GOALS = [
  { value: 'Marriage', icon: '💍', label: 'Marriage', desc: 'Ready for forever' },
  { value: 'Long-term', icon: '🌱', label: 'Long-term', desc: 'Serious, committed relationship' },
  { value: 'Casual', icon: '☀️', label: 'Casual dating', desc: 'Keep it light and enjoyable' },
  { value: 'Exploring', icon: '🔭', label: 'Exploring', desc: 'Open to possibilities' },
] as const

const APEX_PROMPTS = [
  'The most interesting thing about me is...',
  "I'm looking for someone who...",
  'My ideal Sunday looks like...',
  "I'm weirdly competitive about...",
  'I geek out about...',
  'A controversial opinion I hold...',
  'The best trip I ever took...',
  "I'm currently obsessed with...",
  'Change my mind:',
  'My friends describe me as...',
  "I'm proud of...",
  'One thing I wish more people knew about me...',
  'The last book/show that changed my perspective...',
  'My philosophy on relationships:',
  'I feel most alive when...',
  'My green flags are...',
  "I'm a regular at...",
  'Two truths and a lie:',
  'The best way to get to know me is...',
  'I never shut up about...',
] as const

const HEIGHT_OPTIONS = [
  "Under 5'4\"",
  "5'4\"–5'7\"",
  "5'7\"–5'10\"",
  "5'10\"–6'1\"",
  "Over 6'1\"",
]
const DRINKING_OPTIONS = ['Never', 'Rarely', 'Socially', 'Often']
const SMOKING_OPTIONS = ['Non-smoker', 'Sometimes', 'Yes']
const CANNABIS_OPTIONS = ['Never', 'Sometimes', 'Yes']
const KIDS_OPTIONS = ['Yes', 'Maybe', 'No', 'Has kids']
const RELIGION_OPTIONS = [
  'Agnostic', 'Atheist', 'Buddhist', 'Catholic', 'Christian',
  'Hindu', 'Jewish', 'Muslim', 'Spiritual', 'Other',
]
const POLITICS_OPTIONS = ['Liberal', 'Moderate', 'Conservative', 'Non-political', 'Other']
const SEXUALITY_OPTIONS = ['Straight', 'Gay', 'Bisexual', 'Prefer not to say']

const BIO_SUGGESTIONS = [
  'I spend my weekends...',
  'My love language is...',
  'You should know that...',
]

// Steps 0 and 1 have no progress bar. Steps 2-10 map to progress 0→100%.
const PROGRESS_STEPS = 9 // steps 2 through 10 inclusive
function stepToProgress(step: number): number {
  if (step < 2) return 0
  return ((step - 2) / PROGRESS_STEPS) * 100
}

// ─── Shared animation variants ────────────────────────────────────────────────

const slideVariants = {
  enterForward: { x: 40, opacity: 0 },
  enterBackward: { x: -40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitForward: { x: -40, opacity: 0 },
  exitBackward: { x: 40, opacity: 0 },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SelectProps {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
  className?: string
}

function NativeSelect({ value, onChange, options, placeholder, className = '' }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full appearance-none bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${className}`}
    >
      <option value="" disabled className="text-gray-400 bg-gray-900">
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-gray-900 text-white">
          {o}
        </option>
      ))}
    </select>
  )
}

interface PillProps {
  label: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
  small?: boolean
}

function Pill({ label, selected, onClick, disabled = false, small = false }: PillProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full border font-medium transition-all duration-150 select-none
        ${small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'}
        ${
          selected
            ? 'bg-purple-700 border-purple-700 text-white shadow-sm'
            : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {label}
    </motion.button>
  )
}

interface MinimalInputProps {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  min?: string
  max?: string
  step?: string
  error?: string
  className?: string
}

function MinimalInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
  step,
  error,
  className = '',
}: MinimalInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>}
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full bg-transparent border-b-2 py-2.5 text-gray-900 text-sm placeholder-gray-400
          focus:outline-none transition-colors duration-200
          ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-purple-600'}
        `}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}

// ─── State shape ──────────────────────────────────────────────────────────────

interface PromptEntry {
  question: string
  answer: string
}

interface OnboardingState {
  // Step 0
  dobMonth: string
  dobDay: string
  dobYear: string
  // Step 2
  firstName: string
  lastName: string
  gender: string
  // Step 3
  profilePhotoUrl: string
  // Step 4
  bio: string
  headline: string
  // Step 5
  collegeId: string
  collegeName: string
  major: string
  gpa: string
  currentRole: string
  company: string
  sat: string
  act: string
  greekOrganizationType: '' | 'FRATERNITY' | 'SORORITY' | 'CO-ED'
  greekOrganization: string
  // Step 6
  prompts: PromptEntry[]
  // Step 7
  interests: string[]
  values: string[]
  // Step 8
  height: string
  drinking: string
  smoking: string
  cannabis: string
  wantsKids: string
  religion: string
  politicalViews: string
  sexuality: string
  lifestyleConsent: boolean
  // Step 9
  relationshipGoal: string
  // Step 10
  verificationVideoUrl: string
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [ageBlocked, setAgeBlocked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)

  const [state, setState] = useState<OnboardingState>({
    dobMonth: '', dobDay: '', dobYear: '',
    firstName: '', lastName: '', gender: '',
    profilePhotoUrl: '',
    bio: '', headline: '',
    collegeId: '', collegeName: '', major: '', gpa: '', currentRole: '', company: '', sat: '', act: '',
    greekOrganizationType: '', greekOrganization: '',
    prompts: [],
    interests: [], values: [],
    height: '', drinking: '', smoking: '', cannabis: '',
    wantsKids: '', religion: '', politicalViews: '', sexuality: '',
    lifestyleConsent: false,
    relationshipGoal: '',
    verificationVideoUrl: '',
  })

  function patch(updates: Partial<OnboardingState>) {
    setState((prev) => ({ ...prev, ...updates }))
  }

  function goForward() {
    setDirection('forward')
    setStep((s) => s + 1)
  }

  function goBack() {
    setDirection('backward')
    setStep((s) => s - 1)
  }

  // Build the dateOfBirth string from step 0 dropdowns
  function buildDob(): string {
    const monthIndex = MONTHS.indexOf(state.dobMonth) + 1
    const m = String(monthIndex).padStart(2, '0')
    const d = String(state.dobDay).padStart(2, '0')
    return `${state.dobYear}-${m}-${d}`
  }

  function computeAge(): number {
    if (!state.dobMonth || !state.dobDay || !state.dobYear) return 0
    const dob = new Date(buildDob())
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const mDiff = today.getMonth() - dob.getMonth()
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < dob.getDate())) age--
    return age
  }

  async function handleFinalSubmit(verificationVideoUrl: string) {
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const dobStr = buildDob()

      await usersApi.completeOnboarding({
        firstName: state.firstName,
        lastName: state.lastName,
        dateOfBirth: dobStr,
        gender: state.gender,
        bio: state.bio,
        headline: state.headline || undefined,
        currentRole: state.currentRole || undefined,
        company: state.company || undefined,
        major: state.major,
        gpa: state.gpa ? parseFloat(state.gpa) : undefined,
        sat: state.sat ? parseInt(state.sat, 10) : undefined,
        act: state.act ? parseInt(state.act, 10) : undefined,
        interests: state.interests,
        relationshipGoal: state.relationshipGoal,
        collegeId: state.collegeId,
        profilePhotoUrl: state.profilePhotoUrl || undefined,
      })

      await usersApi.updateProfile({
        prompts: state.prompts.length > 0 ? state.prompts : undefined,
        values: state.values.length > 0 ? state.values : undefined,
        religion: state.religion || undefined,
        height: state.height || undefined,
        drinking: state.drinking || undefined,
        smoking: state.smoking || undefined,
        cannabis: state.cannabis || undefined,
        wantsKids: state.wantsKids || undefined,
        politicalViews: state.politicalViews || undefined,
        sexuality: state.sexuality || undefined,
        greekOrganizationType: (state.greekOrganizationType as 'FRATERNITY' | 'SORORITY' | 'CO-ED') || undefined,
        greekOrganization: state.greekOrganization || undefined,
      })

      if (verificationVideoUrl) {
        await usersApi.verifyIdentity({ verificationVideoUrl })
      }

      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })

      setShowCelebration(true)
      setTimeout(() => navigate('/discover'), 1500)
    } catch {
      setSubmitError('Something went wrong — please try again.')
      setIsSubmitting(false)
    }
  }

  // Celebration overlay
  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-[#1a0a2e] flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="flex flex-col items-center gap-6 text-center px-8"
        >
          <div className="text-7xl">✨</div>
          <p className="text-4xl font-bold text-white tracking-tight">You're in.</p>
          <p className="text-purple-300 text-lg">Welcome to Apex.</p>
        </motion.div>
      </div>
    )
  }

  const isDark = step <= 1

  return (
    <div className={`min-h-screen w-full ${isDark ? 'bg-[#1a0a2e]' : 'bg-white'} flex flex-col`}>
      {/* Progress bar — only steps 2-10 */}
      {step >= 2 && (
        <div className="fixed top-0 left-0 right-0 z-30 h-0.5 bg-gray-100">
          <motion.div
            className="h-full bg-purple-600"
            animate={{ width: `${stepToProgress(step)}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* Back button — steps 2+ */}
      {step >= 2 && (
        <button
          onClick={goBack}
          className="fixed top-4 left-4 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            variants={slideVariants}
            initial={direction === 'forward' ? 'enterForward' : 'enterBackward'}
            animate="center"
            exit={direction === 'forward' ? 'exitForward' : 'exitBackward'}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="flex-1 flex flex-col min-h-screen"
          >
            {step === 0 && (
              <Step0AgeGate
                state={state}
                patch={patch}
                ageBlocked={ageBlocked}
                setAgeBlocked={setAgeBlocked}
                onContinue={() => {
                  const age = computeAge()
                  if (age < 18) {
                    setAgeBlocked(true)
                    return
                  }
                  goForward()
                }}
              />
            )}
            {step === 1 && <Step1Welcome onContinue={goForward} />}
            {step === 2 && (
              <Step2Identity state={state} patch={patch} onContinue={goForward} />
            )}
            {step === 3 && (
              <Step3Photo state={state} patch={patch} onContinue={goForward} />
            )}
            {step === 4 && (
              <Step4Story state={state} patch={patch} onContinue={goForward} />
            )}
            {step === 5 && (
              <Step5Credentials state={state} patch={patch} onContinue={goForward} />
            )}
            {step === 6 && (
              <Step6Prompts state={state} patch={patch} onContinue={goForward} />
            )}
            {step === 7 && (
              <Step7InterestsValues state={state} patch={patch} onContinue={goForward} />
            )}
            {step === 8 && (
              <Step8Lifestyle state={state} patch={patch} onContinue={goForward} />
            )}
            {step === 9 && (
              <Step9Goal state={state} patch={patch} onContinue={goForward} />
            )}
            {step === 10 && (
              <Step10Verification
                state={state}
                patch={patch}
                isSubmitting={isSubmitting}
                submitError={submitError}
                onSubmit={handleFinalSubmit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Step 0: Age Gate ─────────────────────────────────────────────────────────

interface Step0Props {
  state: OnboardingState
  patch: (u: Partial<OnboardingState>) => void
  ageBlocked: boolean
  setAgeBlocked: (v: boolean) => void
  onContinue: () => void
}

function Step0AgeGate({ state, patch, ageBlocked, setAgeBlocked: _setBlocked, onContinue }: Step0Props) {
  const [errors, setErrors] = useState({ month: '', day: '', year: '' })

  function validate(): boolean {
    const e = { month: '', day: '', year: '' }
    if (!state.dobMonth) e.month = 'Required'
    if (!state.dobDay) e.day = 'Required'
    if (!state.dobYear) e.year = 'Required'
    setErrors(e)
    return !e.month && !e.day && !e.year
  }

  function handleContinue() {
    if (!validate()) return
    onContinue()
  }

  if (ageBlocked) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-[#1a0a2e]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <Lock size={36} className="text-purple-300" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white mb-2">Access Restricted</p>
            <p className="text-purple-300 text-base leading-relaxed max-w-xs">
              Apex is for adults 18 and older.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col px-6 bg-[#1a0a2e]">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-10">
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-4xl font-bold tracking-tight text-white">apex</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-8"
        >
          <h1 className="text-3xl font-bold text-white text-center">How old are you?</h1>

          <div className="flex gap-3">
            {/* Month */}
            <div className="flex-[2] flex flex-col gap-1.5">
              <NativeSelect
                value={state.dobMonth}
                onChange={(v) => patch({ dobMonth: v })}
                options={MONTHS}
                placeholder="Month"
              />
              {errors.month && <p className="text-xs text-red-400">{errors.month}</p>}
            </div>
            {/* Day */}
            <div className="flex-1 flex flex-col gap-1.5">
              <NativeSelect
                value={state.dobDay}
                onChange={(v) => patch({ dobDay: v })}
                options={DAYS.map(String)}
                placeholder="Day"
              />
              {errors.day && <p className="text-xs text-red-400">{errors.day}</p>}
            </div>
            {/* Year */}
            <div className="flex-[1.5] flex flex-col gap-1.5">
              <NativeSelect
                value={state.dobYear}
                onChange={(v) => patch({ dobYear: v })}
                options={YEARS.map(String)}
                placeholder="Year"
              />
              {errors.year && <p className="text-xs text-red-400">{errors.year}</p>}
            </div>
          </div>

          <Button size="lg" fullWidth onClick={handleContinue}>
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Step 1: Welcome ──────────────────────────────────────────────────────────

interface Step1Props {
  onContinue: () => void
}

function Step1Welcome({ onContinue }: Step1Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-gradient-to-b from-[#1a0a2e] via-[#2d1254] to-[#1a0a2e]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8 max-w-sm"
      >
        <span className="text-5xl font-bold tracking-tight text-white">apex</span>

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-white leading-tight">
            You've been accepted.
          </h1>
          <p className="text-purple-300 text-base leading-relaxed">
            A curated network for intellectually exceptional people.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Button size="lg" onClick={onContinue}>
            Let's build your profile →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Step 2: Identity ─────────────────────────────────────────────────────────

interface StepProps {
  state: OnboardingState
  patch: (u: Partial<OnboardingState>) => void
  onContinue: () => void
}

function Step2Identity({ state, patch, onContinue }: StepProps) {
  const [errors, setErrors] = useState({ firstName: '', lastName: '', gender: '' })

  function validate(): boolean {
    const e = { firstName: '', lastName: '', gender: '' }
    if (!state.firstName.trim()) e.firstName = 'First name is required'
    if (!state.lastName.trim()) e.lastName = 'Last name is required'
    if (!state.gender) e.gender = 'Please select your gender'
    setErrors(e)
    return !e.firstName && !e.lastName && !e.gender
  }

  return (
    <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full">
      <div className="flex-1 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Who are you?</h1>
          <p className="text-sm text-gray-500">This is how you'll appear on Apex.</p>
        </div>

        <div className="flex flex-col gap-5">
          <MinimalInput
            label="First name"
            value={state.firstName}
            onChange={(v) => patch({ firstName: v })}
            placeholder="Your first name"
            error={errors.firstName}
          />
          <MinimalInput
            label="Last name"
            value={state.lastName}
            onChange={(v) => patch({ lastName: v })}
            placeholder="Your last name"
            error={errors.lastName}
          />

          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</label>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <Pill
                  key={g}
                  label={g}
                  selected={state.gender === g}
                  onClick={() => patch({ gender: g })}
                />
              ))}
            </div>
            {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
          </div>
        </div>
      </div>

      <Button size="lg" fullWidth onClick={() => validate() && onContinue()}>
        Continue
      </Button>
    </div>
  )
}

// ─── Step 3: Photo ────────────────────────────────────────────────────────────

function Step3Photo({ state, patch, onContinue }: StepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleFile(file: File) {
    setUploading(true)
    setUploadError('')
    try {
      const url = await uploadToCloudinary(file)
      patch({ profilePhotoUrl: url })
    } catch {
      setUploadError('Upload failed — please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full">
      {/* Skip */}
      <div className="flex justify-end mb-2">
        <button
          onClick={onContinue}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Skip for now
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Your first impression</h1>
          <p className="text-sm text-gray-500">Upload a photo that shows the real you.</p>
        </div>

        {state.profilePhotoUrl ? (
          <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
            <img
              src={state.profilePhotoUrl}
              alt="Profile preview"
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-200" />
            <button
              onClick={() => patch({ profilePhotoUrl: '' })}
              className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <motion.div
            whileTap={{ scale: 0.99 }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="w-full cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 hover:border-purple-400 transition-colors flex flex-col items-center justify-center gap-4 py-16 px-6 text-center bg-gray-50"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
                  <Upload size={22} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Tap to upload your photo</p>
                  <p className="text-xs text-gray-400 mt-1">or drag and drop — JPG, PNG, HEIC</p>
                </div>
              </>
            )}
          </motion.div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />

        {uploadError && <p className="text-xs text-red-500 text-center">{uploadError}</p>}
      </div>

      <Button
        size="lg"
        fullWidth
        disabled={uploading}
        onClick={onContinue}
      >
        Continue
      </Button>
    </div>
  )
}

// ─── Step 4: Story ────────────────────────────────────────────────────────────

function Step4Story({ state, patch, onContinue }: StepProps) {
  const [errors, setErrors] = useState({ bio: '' })
  const BIO_MAX = 300

  function appendSuggestion(text: string) {
    const current = state.bio
    const separator = current && !current.endsWith(' ') ? ' ' : ''
    const next = (current + separator + text).slice(0, BIO_MAX)
    patch({ bio: next })
  }

  function validate(): boolean {
    const e = { bio: '' }
    if (!state.bio.trim()) e.bio = 'Tell people a bit about yourself'
    setErrors(e)
    return !e.bio
  }

  return (
    <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Tell your story</h1>
          <p className="text-sm text-gray-500">What makes you worth knowing?</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bio</label>
          <div className="relative">
            <textarea
              value={state.bio}
              onChange={(e) => patch({ bio: e.target.value.slice(0, BIO_MAX) })}
              placeholder="What makes you interesting?"
              rows={5}
              className={`
                w-full resize-none bg-gray-50 rounded-xl border px-4 py-3.5 text-sm text-gray-900
                placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                ${errors.bio ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-100 focus:border-purple-400'}
              `}
            />
            <span
              className={`absolute bottom-3 right-3 text-xs ${
                state.bio.length >= BIO_MAX ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {state.bio.length}/{BIO_MAX}
            </span>
          </div>
          {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 mt-1">
            {BIO_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => appendSuggestion(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-100"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <MinimalInput
          label="Headline"
          value={state.headline}
          onChange={(v) => patch({ headline: v })}
          placeholder="e.g. VC-backed founder · CS @ Stanford"
        />
      </div>

      <Button size="lg" fullWidth onClick={() => validate() && onContinue()}>
        Continue
      </Button>
    </div>
  )
}

// ─── Step 5: Credentials ──────────────────────────────────────────────────────

function Step5Credentials({ state, patch, onContinue }: StepProps) {
  const [query, setQuery] = useState(state.collegeName)
  const [suggestions, setSuggestions] = useState<College[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [searching, setSearching] = useState(false)
  const [showScores, setShowScores] = useState(false)
  const [errors, setErrors] = useState({ college: '', major: '' })
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const searchColleges = useCallback(async (q: string) => {
    if (!q.trim()) { setSuggestions([]); return }
    setSearching(true)
    try {
      const results = await collegesApi.search(q)
      setSuggestions(results)
      setShowDropdown(true)
    } finally {
      setSearching(false)
    }
  }, [])

  function handleQueryChange(v: string) {
    setQuery(v)
    patch({ collegeName: v, collegeId: '' })
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchColleges(v), 350)
  }

  function selectCollege(c: College) {
    patch({ collegeId: c.id, collegeName: c.name })
    setQuery(c.name)
    setSuggestions([])
    setShowDropdown(false)
  }

  function validate(): boolean {
    const e = { college: '', major: '' }
    if (!state.major.trim()) e.major = 'Major or field of study is required'
    setErrors(e)
    return !e.college && !e.major
  }

  return (
    <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full overflow-y-auto">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Your background</h1>
          <p className="text-sm text-gray-500">Academic and professional credentials.</p>
        </div>

        {/* College search */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">College / University <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
          <p className="text-xs text-purple-600 -mt-0.5">Sign up with a .edu email to get a Verified Student badge</p>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              placeholder="Search your college..."
              className={`
                w-full bg-transparent border-b-2 py-2.5 text-gray-900 text-sm placeholder-gray-400
                pr-8 focus:outline-none transition-colors duration-200
                ${errors.college ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-purple-600'}
              `}
            />
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400">
              {searching ? (
                <div className="w-4 h-4 border border-purple-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={14} />
              )}
            </span>
          </div>
          {errors.college && <p className="text-xs text-red-500">{errors.college}</p>}

          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-20 bg-white rounded-xl shadow-lg border border-gray-100 mt-1 max-h-52 overflow-y-auto">
              {suggestions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectCollege(c)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-purple-50 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">{c.name}</span>
                  {c.state && <span className="text-xs text-gray-400">{c.state}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <MinimalInput
          label="Major"
          value={state.major}
          onChange={(v) => patch({ major: v })}
          placeholder="e.g. Computer Science"
          error={errors.major}
        />

        <MinimalInput
          label="GPA (optional)"
          value={state.gpa}
          onChange={(v) => patch({ gpa: v })}
          placeholder="e.g. 3.8"
          type="number"
          min="0"
          max="4.0"
          step="0.01"
        />

        <MinimalInput
          label="Current Role (optional)"
          value={state.currentRole}
          onChange={(v) => patch({ currentRole: v })}
          placeholder="e.g. Software Engineer"
        />

        <MinimalInput
          label="Company (optional)"
          value={state.company}
          onChange={(v) => patch({ company: v })}
          placeholder="e.g. Google"
        />

        {/* Collapsible academic scores */}
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowScores((s) => !s)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>Academic scores (optional)</span>
            {showScores ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <AnimatePresence>
            {showScores && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 flex flex-col gap-4">
                  <MinimalInput
                    label="SAT (400–1600)"
                    value={state.sat}
                    onChange={(v) => patch({ sat: v })}
                    placeholder="e.g. 1540"
                    type="number"
                    min="400"
                    max="1600"
                  />
                  <MinimalInput
                    label="ACT (1–36)"
                    value={state.act}
                    onChange={(v) => patch({ act: v })}
                    placeholder="e.g. 34"
                    type="number"
                    min="1"
                    max="36"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Greek Life */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Greek Life (optional)</label>
          <div className="flex gap-2">
            {([['Fraternity', 'FRATERNITY'], ['Sorority', 'SORORITY'], ['Co-ed', 'CO-ED']] as const).map(([label, value]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  state.greekOrganizationType === value
                    ? patch({ greekOrganizationType: '', greekOrganization: '' })
                    : patch({ greekOrganizationType: value })
                }
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold border transition-all ${
                  state.greekOrganizationType === value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {state.greekOrganizationType && (
            <input
              placeholder="e.g. Sigma Chi, Kappa Kappa Gamma..."
              value={state.greekOrganization}
              onChange={(e: ChangeEvent<HTMLInputElement>) => patch({ greekOrganization: e.target.value })}
              className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button size="lg" fullWidth onClick={() => validate() && onContinue()}>
          Continue
        </Button>
        <p className="text-center text-xs text-gray-400 mt-3">College is optional — add it anytime</p>
      </div>
    </div>
  )
}

// ─── Step 6: Prompts ──────────────────────────────────────────────────────────

function Step6Prompts({ state, patch, onContinue }: StepProps) {
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null)
  const [error, setError] = useState('')

  const selectedQuestions = state.prompts.map((p) => p.question)

  function togglePrompt(question: string) {
    const existing = state.prompts.find((p) => p.question === question)
    if (existing) {
      // deselect
      patch({ prompts: state.prompts.filter((p) => p.question !== question) })
      if (expandedPrompt === question) setExpandedPrompt(null)
    } else {
      if (state.prompts.length >= 3) return
      patch({ prompts: [...state.prompts, { question, answer: '' }] })
      setExpandedPrompt(question)
    }
  }

  function setAnswer(question: string, answer: string) {
    patch({
      prompts: state.prompts.map((p) =>
        p.question === question ? { ...p, answer } : p
      ),
    })
  }

  function validate(): boolean {
    if (state.prompts.length < 3) {
      setError('Please select and answer exactly 3 prompts.')
      return false
    }
    const incomplete = state.prompts.find((p) => p.answer.trim().length < 10)
    if (incomplete) {
      setError('Each answer must be at least 10 characters.')
      return false
    }
    setError('')
    return true
  }

  return (
    <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full overflow-y-auto">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Show your personality</h1>
          <p className="text-sm text-gray-500">
            Choose 3 prompts and write your answers.
            <span className="ml-1 font-medium text-purple-600">
              {state.prompts.length}/3 selected
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {APEX_PROMPTS.map((question) => {
            const isSelected = selectedQuestions.includes(question)
            const isExpanded = expandedPrompt === question
            const entry = state.prompts.find((p) => p.question === question)
            const canSelect = isSelected || state.prompts.length < 3

            return (
              <div
                key={question}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-100 bg-white'
                } ${!canSelect ? 'opacity-50' : ''}`}
              >
                <button
                  type="button"
                  disabled={!canSelect && !isSelected}
                  onClick={() => {
                    if (isSelected && isExpanded) {
                      setExpandedPrompt(null)
                    } else if (isSelected) {
                      setExpandedPrompt(question)
                    } else {
                      togglePrompt(question)
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                >
                  <span className="text-sm font-medium text-gray-800 flex-1 pr-3">{question}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); togglePrompt(question) }}
                        className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    )}
                    {isSelected ? (
                      isExpanded ? <ChevronUp size={15} className="text-purple-600" /> : <ChevronDown size={15} className="text-purple-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isSelected && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <textarea
                          value={entry?.answer ?? ''}
                          onChange={(e) => setAnswer(question, e.target.value)}
                          placeholder="Write your answer..."
                          rows={3}
                          className="w-full resize-none bg-white rounded-lg border border-purple-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {entry?.answer.length ?? 0} chars (min 10)
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      </div>

      <div className="mt-6">
        <Button size="lg" fullWidth onClick={() => validate() && onContinue()}>
          Continue
        </Button>
      </div>
    </div>
  )
}

// ─── Step 7: Interests + Values ───────────────────────────────────────────────

function Step7InterestsValues({ state, patch, onContinue }: StepProps) {
  const [error, setError] = useState('')

  function toggleInterest(item: string) {
    const next = state.interests.includes(item)
      ? state.interests.filter((i) => i !== item)
      : [...state.interests, item]
    patch({ interests: next })
  }

  function toggleValue(item: string) {
    const next = state.values.includes(item)
      ? state.values.filter((v) => v !== item)
      : [...state.values, item]
    patch({ values: next })
  }

  function validate(): boolean {
    if (state.interests.length < 3) {
      setError('Please select at least 3 interests.')
      return false
    }
    if (state.values.length < 3) {
      setError('Please select at least 3 values.')
      return false
    }
    setError('')
    return true
  }

  return (
    <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full overflow-y-auto">
      <div className="flex-1 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">What drives you?</h1>
          <p className="text-sm text-gray-500">Select at least 3 interests and 3 values.</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Interests</label>
            <span className="text-xs text-purple-600 font-medium">
              {state.interests.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((item) => (
              <Pill
                key={item}
                label={item}
                selected={state.interests.includes(item)}
                onClick={() => toggleInterest(item)}
                small
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Values</label>
            <span className="text-xs text-purple-600 font-medium">
              {state.values.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {VALUES.map((item) => (
              <Pill
                key={item}
                label={item}
                selected={state.values.includes(item)}
                onClick={() => toggleValue(item)}
                small
              />
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      </div>

      <div className="mt-6">
        <Button size="lg" fullWidth onClick={() => validate() && onContinue()}>
          Continue
        </Button>
      </div>
    </div>
  )
}

// ─── Step 8: Lifestyle ────────────────────────────────────────────────────────

interface LifestyleSectionProps {
  label: string
  options: string[]
  value: string
  onSelect: (v: string) => void
}

function LifestyleSection({ label, options, value, onSelect }: LifestyleSectionProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Pill
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => onSelect(value === opt ? '' : opt)}
            small
          />
        ))}
      </div>
    </div>
  )
}

function Step8Lifestyle({ state, patch, onContinue }: StepProps) {
  const [error, setError] = useState('')

  function validate(): boolean {
    if (!state.lifestyleConsent) {
      setError('Please confirm you understand how your data is used.')
      return false
    }
    setError('')
    return true
  }

  return (
    <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full overflow-y-auto">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Your lifestyle</h1>
          <p className="text-sm text-gray-500">All fields are optional — share what you're comfortable with.</p>
        </div>

        <LifestyleSection
          label="Height"
          options={HEIGHT_OPTIONS}
          value={state.height}
          onSelect={(v) => patch({ height: v })}
        />
        <LifestyleSection
          label="Drinking"
          options={DRINKING_OPTIONS}
          value={state.drinking}
          onSelect={(v) => patch({ drinking: v })}
        />
        <LifestyleSection
          label="Smoking"
          options={SMOKING_OPTIONS}
          value={state.smoking}
          onSelect={(v) => patch({ smoking: v })}
        />
        <LifestyleSection
          label="Cannabis"
          options={CANNABIS_OPTIONS}
          value={state.cannabis}
          onSelect={(v) => patch({ cannabis: v })}
        />
        <LifestyleSection
          label="Wants kids"
          options={KIDS_OPTIONS}
          value={state.wantsKids}
          onSelect={(v) => patch({ wantsKids: v })}
        />
        <LifestyleSection
          label="Religion"
          options={RELIGION_OPTIONS}
          value={state.religion}
          onSelect={(v) => patch({ religion: v })}
        />
        <LifestyleSection
          label="Politics"
          options={POLITICS_OPTIONS}
          value={state.politicalViews}
          onSelect={(v) => patch({ politicalViews: v })}
        />
        <LifestyleSection
          label="Sexuality"
          options={SEXUALITY_OPTIONS}
          value={state.sexuality}
          onSelect={(v) => patch({ sexuality: v })}
        />

        {/* GDPR consent */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex flex-col gap-3">
          <p className="text-xs text-amber-800 leading-relaxed">
            🔒 This information is only shown to people you match with and is never sold to third parties.
            You can update or remove it anytime in your profile settings.
          </p>
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button"
              onClick={() => patch({ lifestyleConsent: !state.lifestyleConsent })}
              className={`
                w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all
                ${state.lifestyleConsent
                  ? 'bg-purple-600 border-purple-600'
                  : 'bg-white border-gray-300'
                }
              `}
            >
              {state.lifestyleConsent && <Check size={12} className="text-white" />}
            </button>
            <span className="text-xs text-amber-900 font-medium">I understand</span>
          </label>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="mt-6">
        <Button size="lg" fullWidth onClick={() => validate() && onContinue()}>
          Continue
        </Button>
      </div>
    </div>
  )
}

// ─── Step 9: Relationship Goal ────────────────────────────────────────────────

function Step9Goal({ state, patch, onContinue }: StepProps) {
  const [error, setError] = useState('')

  function validate(): boolean {
    if (!state.relationshipGoal) {
      setError("Please select what you're looking for.")
      return false
    }
    setError('')
    return true
  }

  return (
    <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full">
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">What are you looking for?</h1>
          <p className="text-sm text-gray-500">Be honest — it helps us find the right people for you.</p>
        </div>

        <div className="flex flex-col gap-3">
          {RELATIONSHIP_GOALS.map(({ value, icon, label, desc }) => {
            const isSelected = state.relationshipGoal === value
            return (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => patch({ relationshipGoal: value })}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${isSelected
                    ? 'border-purple-600 bg-purple-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-purple-200 shadow-sm'
                  }
                `}
              >
                <span className="text-3xl">{icon}</span>
                <div>
                  <p className={`font-semibold text-sm ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                {isSelected && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      </div>

      <Button size="lg" fullWidth onClick={() => validate() && onContinue()}>
        Continue
      </Button>
    </div>
  )
}

// ─── Step 10: Video Verification + Final Submit ────────────────────────────────

type VerifyPhase = 'idle' | 'previewing' | 'countdown' | 'recording' | 'recorded' | 'uploading' | 'verified'

interface Step10Props {
  state: OnboardingState
  patch: (u: Partial<OnboardingState>) => void
  isSubmitting: boolean
  submitError: string
  onSubmit: (videoUrl: string) => Promise<void>
}

function Step10Verification({ state, patch, isSubmitting, submitError, onSubmit }: Step10Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const [phase, setPhase] = useState<VerifyPhase>('idle')
  const [countdown, setCountdown] = useState(5)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploadError, setUploadError] = useState('')

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
        videoRef.current.play()
      }
      setPhase('previewing')
    } catch {
      setUploadError('Camera access denied. You can skip verification.')
    }
  }

  function startRecording() {
    if (!streamRef.current) return
    chunksRef.current = []
    const mr = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' })
    mediaRecorderRef.current = mr

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setRecordedBlob(blob)
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      // Stop camera tracks
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      setPhase('recorded')
    }

    setPhase('countdown')
    setCountdown(5)

    let count = 5
    const interval = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(interval)
        mr.start()
        setPhase('recording')
        // Auto-stop after 5 seconds
        setTimeout(() => {
          if (mr.state === 'recording') mr.stop()
        }, 5000)
      }
    }, 1000)
  }

  function retake() {
    setRecordedBlob(null)
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl('') }
    setPhase('idle')
    setUploadError('')
  }

  async function sendVerification() {
    if (!recordedBlob) return
    setPhase('uploading')
    setUploadError('')
    try {
      const url = await uploadVideoToCloudinary(recordedBlob)
      patch({ verificationVideoUrl: url })
      setPhase('verified')
      // Submit immediately after verification
      await onSubmit(url)
    } catch {
      setUploadError('Upload failed — please retake or skip.')
      setPhase('recorded')
    }
  }

  async function skipAndSubmit() {
    await onSubmit('')
  }

  return (
    <div className="flex-1 flex flex-col px-6 pt-16 pb-8 max-w-md mx-auto w-full">
      {/* Skip always visible */}
      <div className="flex justify-end mb-2">
        <button
          onClick={skipAndSubmit}
          disabled={isSubmitting}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Finishing...' : 'Skip for now'}
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Get your verified badge</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Record a 5-second selfie clip. We verify you're real — then delete it immediately.
            We never store your video.
          </p>
        </div>

        {/* Phase: idle */}
        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 py-8"
          >
            <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center">
              <Video size={36} className="text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Quick selfie video</p>
              <p className="text-xs text-gray-400 mt-1">5 seconds · Camera only · Deleted after review</p>
            </div>
            {uploadError && <p className="text-xs text-red-500 text-center">{uploadError}</p>}
            <Button size="lg" onClick={startCamera}>
              Open Camera
            </Button>
          </motion.div>
        )}

        {/* Phase: previewing camera */}
        {(phase === 'previewing' || phase === 'countdown' || phase === 'recording') && (
          <div className="flex flex-col gap-4">
            <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '3/4' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover scale-x-[-1]"
                playsInline
                muted
              />
              {phase === 'countdown' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <motion.span
                    key={countdown}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="text-8xl font-bold text-white"
                  >
                    {countdown}
                  </motion.span>
                </div>
              )}
              {phase === 'recording' && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white text-xs font-medium">Recording</span>
                </div>
              )}
            </div>

            {phase === 'previewing' && (
              <Button size="lg" fullWidth onClick={startRecording}>
                Start Recording
              </Button>
            )}
          </div>
        )}

        {/* Phase: recorded — show preview */}
        {phase === 'recorded' && (
          <div className="flex flex-col gap-4">
            <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '3/4' }}>
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                controls
                playsInline
              />
            </div>
            {uploadError && <p className="text-xs text-red-500 text-center">{uploadError}</p>}
            <div className="flex gap-3">
              <Button variant="ghost" size="lg" onClick={retake} className="flex-1 flex items-center justify-center gap-2">
                <RotateCcw size={15} />
                Retake
              </Button>
              <Button size="lg" onClick={sendVerification} className="flex-1">
                Send for verification
              </Button>
            </div>
          </div>
        )}

        {/* Phase: uploading */}
        {phase === 'uploading' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-600">Uploading your video...</p>
          </div>
        )}

        {/* Phase: verified */}
        {phase === 'verified' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <ShieldCheck size={40} className="text-green-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">You're verified!</p>
              <p className="text-sm text-gray-500 mt-1">Your badge will appear on your profile.</p>
            </div>
          </motion.div>
        )}

        {submitError && (
          <p className="text-xs text-red-500 text-center">{submitError}</p>
        )}

        {/* Final submit — shown in idle/recorded states or always as fallback */}
        {(phase === 'idle' || phase === 'previewing') && (
          <div className="mt-auto">
            <Button
              size="lg"
              fullWidth
              loading={isSubmitting}
              variant="secondary"
              onClick={skipAndSubmit}
            >
              {isSubmitting ? 'Setting up your profile...' : 'Finish without verifying'}
            </Button>
          </div>
        )}
      </div>

      {/* Shield icon hint */}
      {phase === 'idle' && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Shield size={13} className="text-gray-300" />
          <p className="text-xs text-gray-400">Verified members get 3× more connections</p>
        </div>
      )}
    </div>
  )
}
