import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Camera,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
  Zap,
  Quote,
  Heart,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Twitter,
} from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

// ── Ticker items ───────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { text: "Pre-med just joined", badge: "H", color: "#A51C30" },
  { text: "Two engineers connected", badge: "S", color: "#8C1515" },
  { text: "14 new profiles from NYC", badge: "NYC", color: "#4B5563" },
  { text: "2,400+ verified members", badge: "\u2736", color: "#7C3AED" },
  { text: "Analyst \u00b7 Long-term only", badge: "M", color: "#1A1A1A" },
  { text: "Match: Chicago \u2192 NYC", badge: "\u2197", color: "#059669" },
  { text: "3.9 GPA \u00b7 Georgetown Law", badge: "GU", color: "#041E42" },
  { text: "18 new connections today", badge: "\u2736", color: "#7C3AED" },
  { text: "Pre-med \u00b7 Moving to Boston", badge: "CU", color: "#003DA5" },
  { text: "NYC \u2192 SF relocation match", badge: "\u2197", color: "#059669" },
  { text: "MIT '25 thesis complete", badge: "MIT", color: "#A31F34" },
  { text: "Wharton MBA \u00b7 Serious only", badge: "W", color: "#002147" },
]

// ── Mock profiles ──────────────────────────────────────────────────────────────
const PREVIEW_PROFILES = [
  {
    name: 'Sofia C.',
    age: 24,
    school: 'Stanford',
    role: 'Pre-med \u2192 UCSF',
    gpa: '3.9',
    values: ['Ambition', 'Curiosity'],
    verified: true,
    schoolVerified: true,
    location: 'Bay Area \u2192 NYC',
    photoId: '1529626455594-4ff0802cfb7e',
    prompts: [
      "The thing I\u2019m most proud of: Finishing my MCAT while working 30 hours a week. 520.",
      "A non-negotiable for me: Someone who has a plan \u2014 even if it changes.",
      "I\u2019m looking for: A partner I can grow with, not just someone to fill time with.",
    ],
  },
  {
    name: 'James P.',
    age: 25,
    school: 'Harvard',
    role: 'Goldman Sachs',
    gpa: '3.8',
    values: ['Integrity', 'Growth'],
    verified: true,
    schoolVerified: true,
    location: 'NYC',
    photoId: '1507003211169-0a1dd7228f2d',
    prompts: [
      "My love language is: Acts of service \u2014 I show up, I follow through.",
      "Unpopular opinion: Work-life balance is a myth. Work-life integration is what matters.",
      "On weekends you\u2019ll find me: At the climbing gym or reading something dense.",
    ],
  },
  {
    name: 'Priya S.',
    age: 23,
    school: 'MIT',
    role: 'ML Research',
    gpa: '3.95',
    values: ['Curiosity', 'Health'],
    verified: true,
    schoolVerified: true,
    location: 'Boston \u2192 SF',
    photoId: '1494790108377-be9c29b29330',
    prompts: [
      "Two truths and a lie: I\u2019ve published research, I run ultramarathons, I can\u2019t cook.",
      "What I\u2019m looking for: Depth. I want someone who gets excited explaining things.",
      "Moving to SF for: A research role at a top AI lab. Ask me about it.",
    ],
  },
]

// ── Comparison data ────────────────────────────────────────────────────────────
const COMPARISON_ROWS = [
  { label: 'Discovery', others: 'Infinite swipe', apex: 'Daily curated drop' },
  { label: 'Profiles', others: 'Photos + bio', apex: 'Education, career, values, GPA' },
  { label: 'First contact', others: '"Hey"', apex: 'Intro note required' },
  { label: 'Trust', others: 'Anonymous', apex: 'ID + school verified' },
  { label: 'Intent', others: 'Anyone', apex: 'Relationship-focused' },
]

// ── Testimonials ───────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "I had a real conversation on the first match. That's never happened on Tinder.",
    name: 'Ethan K.',
    school: "Georgetown '24",
    initials: 'EK',
  },
  {
    quote: "The first app where I didn't feel like a profile photo. They actually read my bio.",
    name: 'Priya M.',
    school: "MIT '25",
    initials: 'PM',
  },
  {
    quote: "Met my girlfriend 4 months ago. We both had 'future location: NYC.' The app knew.",
    name: 'James L.',
    school: "Harvard '23",
    initials: 'JL',
  },
  {
    quote: 'Worth every second of setup. Profile took 20 minutes, first real date happened in a week.',
    name: 'Aisha R.',
    school: "Wharton '24",
    initials: 'AR',
  },
]

// ── FAQ items ─────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Is Apex really free?",
    a: "Yes \u2014 joining, creating your profile, and browsing are all free. Premium unlocks additional features like unlimited AI search, read receipts, and relocation match alerts.",
  },
  {
    q: "How does verification work?",
    a: "Email verification is required for all members. You can optionally verify your student status with a .edu email, and your identity with a government-issued ID to earn the Apex Verified badge. Verified profiles are prioritized in search results.",
  },
  {
    q: "What makes Apex different from Hinge or Bumble?",
    a: "Apex is built around credentials and compatibility, not swipe volume. Every profile shows real education, career, and values data. Our AI search lets you describe exactly who you\u2019re looking for in plain English. And we require a thoughtful intro note before any connection is made \u2014 no cold likes.",
  },
  {
    q: "Who can join Apex?",
    a: "Apex is open to anyone 18+ who takes relationships seriously. We particularly serve college students, recent graduates, and young professionals \u2014 though ambition and authenticity matter more than any specific institution.",
  },
  {
    q: "How does the matching algorithm work?",
    a: "We surface your daily curated drop based on compatibility signals: shared values, education alignment, career stage, location (current and future), and stated relationship intent. There\u2019s no random swiping \u2014 every suggestion is meaningful.",
  },
  {
    q: "Can I use Apex if I\u2019m relocating?",
    a: "That\u2019s one of our signature features. Add your future city or planned move date, and we\u2019ll match you with people already there or making the same transition. A Chicago \u2192 NYC move shouldn\u2019t mean starting over.",
  },
  {
    q: "Is my data private?",
    a: "Absolutely. We never sell your data to third parties. Profile details are only visible to verified members. All data is encrypted in transit and at rest. You can read our full Privacy Policy for complete details.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Settings \u2192 Account \u2192 Delete Account. Your data is permanently removed within 30 days per our data retention policy. We don\u2019t hold your data hostage.",
  },
]

// ── Stat counter ───────────────────────────────────────────────────────────────
function StatCounter({
  to,
  label,
  suffix = '',
  dark = false,
}: {
  to: number
  label: string
  suffix?: string
  dark?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const steps = 40
    const increment = to / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= to) {
        setCount(to)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, to])

  return (
    <div ref={ref} className="text-center">
      <div className={`font-display text-4xl font-black md:text-5xl ${dark ? 'text-white' : 'text-gray-900'}`}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className={`mt-2 text-sm font-medium ${dark ? 'text-white/40' : 'text-gray-500'}`}>{label}</div>
    </div>
  )
}

// ── Feature card ───────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  body,
  delay = 0,
  dark = false,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  body: string
  delay?: number
  dark?: boolean
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 260, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 260, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    rotateX.set(-((e.clientY - rect.top - cy) / cy) * 6)
    rotateY.set(((e.clientX - rect.left - cx) / cx) * 6)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      className={
        dark
          ? 'group rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm hover:bg-white/[0.08] hover:border-purple-500/20 transition-all duration-200 cursor-pointer'
          : 'group rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-200 cursor-pointer'
      }
    >
      <div
        className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
          dark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'
        }`}
      >
        {icon}
      </div>
      <h3 className={`mb-2 text-[15px] font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${dark ? 'text-white/50' : 'text-gray-500'}`}>{body}</p>
    </motion.div>
  )
}

// ── Profile modal ─────────────────────────────────────────────────────────────
function ProfileModal({
  profile,
  onClose,
}: {
  profile: (typeof PREVIEW_PROFILES)[0]
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7, 4, 15, 0.85)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo */}
        <div className="relative h-72 bg-gray-100 overflow-hidden">
          <img
            src={`https://images.unsplash.com/photo-${profile.photoId}?w=400&h=320&fit=crop&crop=face`}
            alt={profile.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {profile.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-blue-700">
                <ShieldCheck size={9} className="text-blue-500" />
                ID Verified
              </span>
            )}
            {profile.schoolVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                <GraduationCap size={9} className="text-emerald-500" />
                {profile.school}
              </span>
            )}
          </div>
          {/* Name overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xl font-black text-white">
              {profile.name}, {profile.age}
            </p>
            <p className="text-sm text-white/75">{profile.role}</p>
          </div>
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Meta row */}
          <div className="flex items-center gap-2 mb-4">
            {profile.gpa && (
              <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-700">
                {profile.gpa} GPA
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              <MapPin size={9} />
              {profile.location}
            </span>
          </div>

          {/* Values */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {profile.values.map((v) => (
              <span key={v} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                {v}
              </span>
            ))}
          </div>

          {/* Prompts */}
          <div className="flex flex-col gap-3 mb-5">
            {profile.prompts.map((prompt, i) => {
              const [label, ...rest] = prompt.split(': ')
              return (
                <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5">
                  {rest.length > 0 ? (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-500 mb-1">{label}</p>
                      <p className="text-sm text-gray-800">{rest.join(': ')}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-800">{prompt}</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <Link
            to="/register"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:scale-[1.02]"
          >
            Join to Connect
            <ArrowRight size={14} />
          </Link>
          <p className="mt-2.5 text-center text-[10px] text-gray-400">
            Create a free account to send an intro note
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Feature preview modal ─────────────────────────────────────────────────────
function FeaturePreviewModal({
  title,
  body,
  icon,
  onClose,
}: {
  title: string
  body: string
  icon: React.ReactNode
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7, 4, 15, 0.85)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm rounded-[28px] border border-white/[0.08] shadow-2xl overflow-hidden"
        style={{ background: '#1a0845' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors z-10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="p-7">
          {/* Icon */}
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
            {icon}
          </div>
          <h3 className="font-display text-xl font-black text-white mb-2">{title}</h3>
          <p className="text-sm leading-relaxed text-white/55 mb-6">{body}</p>

          {/* In-app preview mockup */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 mb-6">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-purple-400 mb-3">App preview</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Your daily drop', value: '3 new curated profiles' },
                { label: 'Last active', value: 'Today' },
                { label: 'Compatibility', value: '94% match' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-white/[0.05] px-3 py-2">
                  <span className="text-[11px] text-white/40">{label}</span>
                  <span className="text-[11px] font-semibold text-white/80">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/register"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/50 transition-all hover:scale-[1.02]"
          >
            Start for free
            <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Profile preview card ───────────────────────────────────────────────────────
function ProfileCard({
  profile,
  delay = 0,
  onClick,
}: {
  profile: (typeof PREVIEW_PROFILES)[0]
  delay?: number
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 280, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 280, damping: 22 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const x = (e.clientX - rect.left - cx) / cx
    const y = (e.clientY - rect.top - cy) / cy
    rotateX.set(-y * 9)
    rotateY.set(x * 9)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.22, ease: 'easeOut' } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 1000 }}
      className="relative flex-shrink-0 w-64 rounded-[24px] border border-gray-100 bg-white shadow-lg shadow-gray-100/80 overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={`https://images.unsplash.com/photo-${profile.photoId}?w=300&h=220&fit=crop&crop=face`}
          alt={profile.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {profile.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-blue-700">
              <ShieldCheck size={9} className="text-blue-500" />
              ID Verified
            </span>
          )}
          {profile.schoolVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-emerald-700">
              <GraduationCap size={9} className="text-emerald-500" />
              {profile.school}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between mb-1">
          <p className="text-[15px] font-bold text-gray-900">
            {profile.name}, {profile.age}
          </p>
          {profile.gpa && (
            <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 rounded-full px-2 py-0.5">
              {profile.gpa} GPA
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-1">{profile.role}</p>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-3">
          <MapPin size={9} />
          {profile.location}
        </div>
        <div className="flex flex-wrap gap-1">
          {profile.values.map((v) => (
            <span key={v} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
              {v}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Testimonial carousel ───────────────────────────────────────────────────────
function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setDirection(1)
      setCurrent((c) => (c + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(id)
  }, [paused])

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const next = () => {
    setDirection(1)
    setCurrent((c) => (c + 1) % TESTIMONIALS.length)
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 90 : -90 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -90 : 90 }),
  }

  const t = TESTIMONIALS[current]

  return (
    <div
      className="relative mx-auto max-w-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.05] backdrop-blur-sm px-8 py-10 md:px-12 min-h-[200px] flex flex-col justify-between">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Quote size={28} className="mb-5 text-purple-400/60" />
            <p className="text-lg font-medium leading-relaxed text-white md:text-xl">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-violet-600 text-xs font-bold text-white flex-shrink-0">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-xs text-white/40">{t.school}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        <div className="flex gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-purple-400' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [tickerOffset, setTickerOffset] = useState(0)
  const [selectedProfile, setSelectedProfile] = useState<(typeof PREVIEW_PROFILES)[0] | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<{ title: string; body: string; icon: React.ReactNode } | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [heroSpot, setHeroSpot] = useState({ x: -999, y: -999 })
  const tickerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const heroInView = useInView(heroRef, { once: true })

  // Magnetic CTA motion values
  const ctaMagX = useMotionValue(0)
  const ctaMagY = useMotionValue(0)
  const ctaSpringX = useSpring(ctaMagX, { stiffness: 350, damping: 25 })
  const ctaSpringY = useSpring(ctaMagY, { stiffness: 350, damping: 25 })
  const ctaRef = useRef<HTMLDivElement>(null)

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ctaRef.current?.getBoundingClientRect()
    if (!rect) return
    ctaMagX.set(((e.clientX - rect.left) / rect.width - 0.5) * 14)
    ctaMagY.set(((e.clientY - rect.top) / rect.height - 0.5) * 8)
  }

  const handleCtaMouseLeave = () => {
    ctaMagX.set(0)
    ctaMagY.set(0)
  }

  // Nav scroll state
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Parallax on hero background orbs
  const { scrollY } = useScroll()
  const orb1Y = useTransform(scrollY, [0, 600], [0, 100])
  const orb2Y = useTransform(scrollY, [0, 600], [0, -70])

  // Ticker animation
  useEffect(() => {
    let animFrame: number
    let pos = 0
    function step() {
      pos += 0.45
      const el = tickerRef.current
      if (el) {
        const half = el.scrollWidth / 2
        if (pos >= half) pos = 0
        setTickerOffset(pos)
      }
      animFrame = requestAnimationFrame(step)
    }
    animFrame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animFrame)
  }, [])

  // Word stagger config
  const line1Words = ['Finally,', 'people']
  const line2Words = ['worth', 'your', 'time.']
  const wordVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.15 + i * 0.13, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0d0521' }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 md:px-10 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
            : 'bg-transparent border-b border-white/8'
        }`}
      >
        <Link to="/">
          <ApexLogo size={28} showText={true} variant={scrolled ? 'default' : 'white'} />
        </Link>

        <div
          className={`hidden md:flex items-center gap-6 text-sm font-semibold transition-colors ${
            scrolled ? 'text-gray-600' : 'text-white/75'
          }`}
        >
          <Link
            to="/about"
            className={`transition-colors ${scrolled ? 'hover:text-gray-900' : 'hover:text-white'}`}
          >
            About
          </Link>
          <Link
            to="/members"
            className={`transition-colors ${scrolled ? 'hover:text-gray-900' : 'hover:text-white'}`}
          >
            People
          </Link>
          <Link
            to="/premium-features"
            className={`transition-colors ${scrolled ? 'hover:text-gray-900' : 'hover:text-white'}`}
          >
            Premium
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/75 hover:text-white'
            }`}
          >
            Log in
          </Link>
          <Link
            to="/register"
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all hover:scale-[1.02] ${
              scrolled
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-200'
                : 'bg-white text-purple-700 shadow-lg shadow-white/10'
            }`}
          >
            Join free
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroSectionRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-5 pt-28 pb-20 text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0d0521 0%, #1a0845 30%, #3b1680 62%, #6d28d9 88%, #7c3aed 100%)' }}
        onMouseMove={(e) => {
          const rect = heroSectionRef.current?.getBoundingClientRect()
          if (rect) setHeroSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        }}
        onMouseLeave={() => setHeroSpot({ x: -999, y: -999 })}
      >
        {/* Parallax orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Mouse spotlight */}
          <div
            className="absolute pointer-events-none transition-opacity duration-500 rounded-full blur-[80px]"
            style={{
              width: 500,
              height: 500,
              left: heroSpot.x - 250,
              top: heroSpot.y - 250,
              background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)',
              opacity: heroSpot.x < -500 ? 0 : 1,
            }}
          />
          <motion.div
            style={{
              y: orb1Y,
              background: 'radial-gradient(circle, rgba(139,92,246,0.7) 0%, transparent 70%)',
            }}
            className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full blur-[100px]"
          />
          <motion.div
            style={{
              y: orb2Y,
              background: 'radial-gradient(circle, rgba(192,132,252,0.5) 0%, transparent 70%)',
            }}
            className="absolute top-1/3 -right-20 h-[500px] w-[500px] rounded-full blur-[90px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 -left-32 h-[350px] w-[350px] rounded-full blur-[70px]"
            style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.6) 0%, transparent 70%)' }}
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>

        <div ref={heroRef} className="relative max-w-4xl">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={
              heroInView
                ? {
                    opacity: 1,
                    y: [0, -4, 0],
                    transition: {
                      opacity: { duration: 0.4 },
                      y: { delay: 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' },
                    },
                  }
                : {}
            }
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Star size={10} className="fill-purple-400 text-purple-400" />
            </motion.span>
            Now live at top universities · Members accepted, not just registered
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-5xl font-black leading-[1.06] tracking-tight text-white md:text-7xl lg:text-[5.5rem]">
            <span className="block">
              {line1Words.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate={heroInView ? 'visible' : 'hidden'}
                  className="mr-[0.25em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {line2Words.map((word, i) => (
                <motion.span
                  key={word}
                  custom={line1Words.length + i}
                  variants={wordVariants}
                  initial="hidden"
                  animate={heroInView ? 'visible' : 'hidden'}
                  className={`mr-[0.2em] inline-block ${
                    word === 'time.'
                      ? 'bg-gradient-to-r from-purple-400 via-violet-300 to-purple-300 bg-clip-text text-transparent'
                      : ''
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.7 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/55 md:text-xl"
          >
            79% of Gen Z are burned out on dating apps. Apex is what comes next —
            verified real people, compatibility over chemistry, no swiping required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <motion.div
              ref={ctaRef}
              style={{ x: ctaSpringX, y: ctaSpringY }}
              onMouseMove={handleCtaMouseMove}
              onMouseLeave={handleCtaMouseLeave}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(255,255,255,0.2)',
                  '0 0 0 16px rgba(255,255,255,0)',
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              className="rounded-full"
            >
              <Link
                to="/register"
                className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-purple-700 shadow-xl shadow-white/10 transition-all hover:shadow-white/20 hover:scale-[1.02]"
              >
                Check your eligibility
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-7 py-3.5 text-base font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10"
            >
              Sign in
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="mt-4 text-xs text-white/28"
          >
            Join free · No credit card · Verified members only
          </motion.p>
        </div>

        {/* Ticker strip */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/8 bg-black/30 backdrop-blur-sm py-3">
          <div
            ref={tickerRef}
            className="flex gap-8 whitespace-nowrap"
            style={{ transform: `translateX(-${tickerOffset}px)`, willChange: 'transform' }}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-xs font-medium text-white/45 flex-shrink-0">
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white flex-shrink-0"
                  style={{ background: item.color }}
                >
                  {item.badge}
                </span>
                {item.text}
                <span className="mx-3 text-white/15">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── (dark) ───────────────────────────────────────────────── */}
      <section style={{ background: '#0f0826' }} className="border-y border-white/[0.06] py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-10 px-8 md:grid-cols-4"
        >
          <StatCounter to={2400} suffix="+" label="Verified members" dark />
          <StatCounter to={47} suffix="+" label="Universities represented" dark />
          <StatCounter to={84} suffix="%" label="Report better quality matches" dark />
          <StatCounter to={27} suffix="%" label="Of US marriages start on apps" dark />
        </motion.div>
      </section>

      {/* ── Profile preview ── (white) ────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ background: 'linear-gradient(180deg, #f5f0ff 0%, #ffffff 60%)' }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">
              Who you&apos;ll meet
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-4 text-center font-display text-3xl font-black text-gray-900 md:text-5xl"
          >
            This is what
            <br />
            <span className="text-gray-400">an Apex profile looks like.</span>
          </motion.h2>
          <p className="mx-auto mb-12 max-w-md text-center text-sm leading-relaxed text-gray-500">
            Not curated photos and a two-word bio. Real credentials, real ambition, real people.
          </p>

          <div className="flex gap-5 overflow-x-auto pb-4 justify-center flex-wrap md:flex-nowrap md:overflow-visible">
            {PREVIEW_PROFILES.map((profile, i) => (
              <ProfileCard key={profile.name} profile={profile} delay={i * 0.1} onClick={() => setSelectedProfile(profile)} />
            ))}
          </div>

          <AnimatePresence>
            {selectedProfile && (
              <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
            )}
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-xs text-gray-400"
          >
            Sample profiles shown for illustration. Real members are verified and curated.
          </motion.p>
        </div>
      </section>

      {/* ── Who it's for ── (dark) ────────────────────────────────────────── */}
      <section style={{ background: '#0d0a1e' }} className="py-24 border-y border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
              Who it&apos;s for
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-14 text-center font-display text-3xl font-black text-white md:text-5xl"
          >
            Apex is for people who
            <br />
            <span className="text-white/30">want more than a swipe.</span>
          </motion.h2>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: <GraduationCap size={20} />, title: "Top students & graduates", body: "College-verified profiles with real credentials. GPA, SAT, ACT \u2014 showcase what you\u2019ve built, not just how you look.", delay: 0 },
              { icon: <Briefcase size={20} />, title: "Ambitious professionals", body: "Finance, tech, law, medicine \u2014 connect with someone who matches your career drive and life trajectory.", delay: 0.07 },
              { icon: <MapPin size={20} />, title: "Relocating & planning ahead", body: "Moving to a new city? Meet people already there or making the same move. Relocation-aware matching built in.", delay: 0.14 },
              { icon: <ShieldCheck size={20} />, title: "Identity-verified members", body: "Every member can verify their identity via photo ID. No catfishes. No bots. Just real, accountable people.", delay: 0.21 },
              { icon: <Heart size={20} />, title: "Serious about connection", body: "Built for long-term and marriage-track relationships. Not another app to feel lonely on.", delay: 0.28 },
              { icon: <Zap size={20} />, title: "Strength & lifestyle", body: "Track your gym stats, showcase your strength, link your social presence. A full picture of who you are.", delay: 0.35 },
            ].map(({ icon, title, body, delay }) => (
              <FeatureCard
                key={title}
                dark
                delay={delay}
                icon={icon}
                title={title}
                body={body}
                onClick={() => setSelectedFeature({ title, body, icon })}
              />
            ))}
          </div>

          <AnimatePresence>
            {selectedFeature && (
              <FeaturePreviewModal
                title={selectedFeature.title}
                body={selectedFeature.body}
                icon={selectedFeature.icon}
                onClose={() => setSelectedFeature(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── How it works ── (white) ───────────────────────────────────────── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">How it works</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-14 text-center font-display text-3xl font-black text-gray-900 md:text-5xl"
          >
            Three steps to your
            <br />
            <span className="text-gray-400">intellectual match.</span>
          </motion.h2>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Build your full profile',
                body: "Add your education, career, interests, prompts, and credentials. Your profile should feel like a LinkedIn and Instagram had a very attractive child.",
              },
              {
                step: '02',
                title: 'Search like a human',
                body: '"Harvard girl who hikes and is moving to Chicago" — type exactly what you\'re looking for. Our AI finds them.',
              },
              {
                step: '03',
                title: 'Connect with intention',
                body: 'Send a note with your interest. No ghost-swiping. Every connection starts with something real.',
              },
            ].map(({ step, title, body }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: i * 0.1 }}
              >
                <div className="mb-3 font-display text-6xl font-black text-purple-100">{step}</div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ── (light gray) ─────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">
              The difference
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-12 text-center font-display text-3xl font-black text-gray-900 md:text-5xl"
          >
            This is not
            <br />
            <span className="text-gray-400">another dating app.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-2 gap-4 max-w-2xl mx-auto"
          >
            {/* Other apps column */}
            <div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-300 mb-6">Other apps</p>
              {COMPARISON_ROWS.map(({ label, others }, i) => (
                <div key={label} className={`py-3.5 ${i < COMPARISON_ROWS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-300 mb-0.5">{label}</p>
                  <p className="text-sm text-gray-400">{others}</p>
                </div>
              ))}
            </div>
            {/* Apex column */}
            <div className="rounded-[24px] bg-gradient-to-br from-purple-600 to-violet-700 p-6 shadow-xl shadow-purple-900/30">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-6">Apex ✦</p>
              {COMPARISON_ROWS.map(({ label, apex }, i) => (
                <div key={label} className={`py-3.5 ${i < COMPARISON_ROWS.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-white">{apex}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Verification standard ── (white) ─────────────────────────────── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">The standard</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-4 text-center font-display text-3xl font-black text-gray-900 md:text-5xl"
          >
            Curated, not crowdsourced.
          </motion.h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-base leading-relaxed text-gray-500">
            Every profile goes through our credibility layer before becoming visible.
          </p>

          <div className="mx-auto max-w-3xl grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: <Mail size={16} />, label: 'Email verification', desc: 'Every account confirmed by email before accessing the app' },
              { icon: <Camera size={16} />, label: 'Photo verification', desc: 'Real selfie required during setup — no stolen photos' },
              { icon: <ShieldCheck size={16} />, label: 'ID verification', desc: 'Submit a government ID for the Apex Verified badge' },
              { icon: <GraduationCap size={16} />, label: 'School email', desc: '.edu email instantly unlocks your Verified Student badge' },
              { icon: <Star size={16} />, label: 'Credential showcase', desc: 'GPA, SAT, ACT, career, strength — own your achievements' },
              { icon: <CheckCircle2 size={16} />, label: 'Curated acceptance', desc: 'Profiles reviewed before going live — quality over quantity' },
            ].map(({ icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border border-purple-100 bg-purple-50 p-5"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  {icon}
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
                <p className="text-xs leading-relaxed text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── (dark) ────────────────────────────────────────── */}
      <section style={{ background: '#07040f' }} className="py-24 px-6 border-y border-white/[0.05]">
        <div className="mb-3 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
            What members say
          </span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12 text-center font-display text-3xl font-black text-white md:text-4xl"
        >
          The contrast is real.
        </motion.h2>
        <TestimonialCarousel />
      </section>

      {/* ── FAQ ── (dark) ────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0614' }} className="py-24 px-6 border-y border-white/[0.05]">
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">FAQ</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-12 text-center font-display text-3xl font-black text-white md:text-4xl"
          >
            Questions, answered.
          </motion.h2>

          <div className="flex flex-col gap-2">
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-white pr-4">{q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 text-purple-400"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-white/55">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-white/35">
              Still have questions?{' '}
              <a href="mailto:hello@tryapextoday.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                Email us
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA banner ── (purple gradient) ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[80px]"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-2xl"
        >
          <h2 className="font-display text-4xl font-black text-white md:text-6xl leading-tight">
            {['Your', 'person', 'is', 'already', 'here.'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mr-[0.25em] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/80">
            Stop settling for apps built for everyone. Apex is built for people who take their future
            seriously.
          </p>
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(255,255,255,0.3)',
                '0 0 0 18px rgba(255,255,255,0)',
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
            className="mt-8 inline-block rounded-full"
          >
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-purple-700 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
            >
              Join Apex — it&apos;s free
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
          <p className="mt-4 text-xs text-white/60">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="underline underline-offset-2 hover:text-white">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </section>

      {/* ── Footer ── (dark) ─────────────────────────────────────────────── */}
      <footer style={{ background: '#0a0614' }} className="px-8 py-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-12 md:flex-row md:justify-between">
            <div className="max-w-xs">
              <ApexLogo size={32} showText={true} variant="white" />
              <p className="mt-4 text-sm leading-relaxed text-white/45">
                Where ambition meets authenticity. Built for people who want a partner that keeps up.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/45 transition-colors hover:border-white/30 hover:text-white"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/45 transition-colors hover:border-white/30 hover:text-white"
                >
                  <Twitter size={15} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">Product</p>
                <div className="flex flex-col gap-3">
                  <Link to="/register" className="text-sm text-white/55 transition-colors hover:text-white">Get started</Link>
                  <Link to="/login" className="text-sm text-white/55 transition-colors hover:text-white">Sign in</Link>
                  <Link to="/about" className="text-sm text-white/55 transition-colors hover:text-white">About</Link>
                  <Link to="/careers" className="text-sm text-white/55 transition-colors hover:text-white">Careers</Link>
                  <Link to="/how-we-connect" className="text-sm text-white/55 transition-colors hover:text-white">How We Connect</Link>
                </div>
              </div>
              <div>
                <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">Resources</p>
                <div className="flex flex-col gap-3">
                  <Link to="/safe-dating" className="text-sm text-white/55 transition-colors hover:text-white">Safe Dating Tips</Link>
                  <Link to="/faq" className="text-sm text-white/55 transition-colors hover:text-white">FAQ</Link>
                  <Link to="/trust-safety" className="text-sm text-white/55 transition-colors hover:text-white">Trust &amp; Safety</Link>
                  <Link to="/press" className="text-sm text-white/55 transition-colors hover:text-white">Press</Link>
                  <Link to="/security" className="text-sm text-white/55 transition-colors hover:text-white">Security</Link>
                </div>
              </div>
              <div>
                <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">Legal</p>
                <div className="flex flex-col gap-3">
                  <Link to="/terms" className="text-sm text-white/55 transition-colors hover:text-white">Terms of Service</Link>
                  <Link to="/privacy" className="text-sm text-white/55 transition-colors hover:text-white">Privacy Policy</Link>
                  <Link to="/cookie-policy" className="text-sm text-white/55 transition-colors hover:text-white">Cookie Policy</Link>
                  <Link to="/consumer-health-data" className="text-sm text-white/55 transition-colors hover:text-white">Consumer Health Data</Link>
                  <Link to="/privacy-choices" className="text-sm text-white/55 transition-colors hover:text-white">Your Privacy Choices</Link>
                  <Link to="/colorado-safety" className="text-sm text-white/55 transition-colors hover:text-white">Colorado Safety</Link>
                  <Link to="/accessibility" className="text-sm text-white/55 transition-colors hover:text-white">Accessibility</Link>
                </div>
              </div>
              <div>
                <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">Support</p>
                <div className="flex flex-col gap-3">
                  <a href="mailto:hello@tryapextoday.com" className="text-sm text-white/55 transition-colors hover:text-white">Contact us</a>
                  <Link to="/community-guidelines" className="text-sm text-white/55 transition-colors hover:text-white">Community Guidelines</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 sm:flex-row">
            <p className="text-xs text-white/25">© 2026 Apex. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link to="/privacy" className="text-xs text-white/35 transition-colors hover:text-white/70">Privacy</Link>
              <Link to="/terms" className="text-xs text-white/35 transition-colors hover:text-white/70">Terms</Link>
              <Link to="/cookie-policy" className="text-xs text-white/35 transition-colors hover:text-white/70">Cookies</Link>
              <Link to="/accessibility" className="text-xs text-white/35 transition-colors hover:text-white/70">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
