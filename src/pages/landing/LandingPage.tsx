import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Lock,
  MapPin,
  ShieldCheck,
  Star,
  Zap,
  Quote,
  X,
  Check,
  Heart,
} from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

// ── Ticker items ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  '🎓 Harvard \'25 just joined — Pre-med',
  '🔗 Two Stanford engineers connected',
  '🏙️ 14 new profiles from NYC this week',
  '✅ 2,400+ identity-verified members',
  '💼 McKinsey analyst seeking long-term',
  '🌍 Match made: Chicago → NYC move',
  '🏆 3.9 GPA · Georgetown Law hopeful',
  '🔥 18 new connections made today',
  '🎯 Columbia pre-med joined — Moving to Boston',
  '✈️ NYC → SF relocation match made',
  '📚 MIT \'25 thesis complete — Now dating',
  '⭐ Wharton MBA seeking serious relationship',
]

// ── Mock profiles for the preview section ────────────────────────────────────
const PREVIEW_PROFILES = [
  {
    name: 'Sofia C.',
    age: 24,
    school: 'Stanford',
    role: 'Pre-med → UCSF',
    gpa: '3.9',
    values: ['Ambition', 'Curiosity'],
    verified: true,
    schoolVerified: true,
    location: 'Bay Area → NYC',
    photoId: '1529626455594-4ff0802cfb7e',
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
    photoId: '1472099645785-5658abf4ff4e',
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
    location: 'Boston → SF',
    photoId: '1494790108377-be9c29b29330',
  },
]

// ── Comparison data ───────────────────────────────────────────────────────────
const COMPARISON_ROWS = [
  { label: 'Discovery', others: 'Infinite swipe', apex: 'Daily curated drop' },
  { label: 'Profiles', others: 'Photos + bio', apex: 'Education, career, values, GPA' },
  { label: 'First contact', others: '"Hey"', apex: 'Intro note required' },
  { label: 'Trust', others: 'Anonymous', apex: 'ID + school verified' },
  { label: 'Intent', others: 'Anyone', apex: 'Relationship-focused' },
]

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "I had a real conversation on the first match. That's never happened on Tinder.",
    name: 'Ethan K.',
    school: 'Georgetown \'24',
  },
  {
    quote: "The first app where I didn't feel like a profile photo. They actually read my bio.",
    name: 'Priya M.',
    school: 'MIT \'25',
  },
  {
    quote: "Met my girlfriend 4 months ago. We both had 'future location: NYC.' The app knew.",
    name: 'James L.',
    school: 'Harvard \'23',
  },
]

// ── Stat counter ──────────────────────────────────────────────────────────────
function StatCounter({ to, label, suffix = '', prefix = '' }: { to: number; label: string; suffix?: string; prefix?: string }) {
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
      <div className="font-display text-4xl font-black text-gray-900 md:text-5xl">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-gray-500">{label}</div>
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  body,
  delay = 0,
}: {
  icon: React.ReactNode
  title: string
  body: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className="group rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-200"
    >
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
        {icon}
      </div>
      <h3 className="mb-2 text-[15px] font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{body}</p>
    </motion.div>
  )
}

// ── Profile preview card ──────────────────────────────────────────────────────
function ProfileCard({
  profile,
  delay = 0,
}: {
  profile: (typeof PREVIEW_PROFILES)[0]
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative flex-shrink-0 w-64 rounded-[24px] border border-gray-100 bg-white shadow-lg shadow-gray-100/80 overflow-hidden"
    >
      {/* Photo */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={`https://images.unsplash.com/photo-${profile.photoId}?w=300&h=220&fit=crop&crop=face`}
          alt={profile.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Verified badges */}
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

      {/* Info */}
      <div className="p-4">
        <div className="flex items-baseline justify-between mb-1">
          <p className="text-[15px] font-bold text-gray-900">{profile.name}, {profile.age}</p>
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

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [tickerOffset, setTickerOffset] = useState(0)
  const tickerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true })

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

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 md:px-10 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <Link to="/">
          <ApexLogo size={28} showText={true} variant="default" />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
          <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
          <Link to="/register" className="hover:text-gray-900 transition-colors">People</Link>
          <Link to="/register" className="hover:text-gray-900 transition-colors">Premium</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-purple-200 hover:shadow-purple-300 transition-all hover:scale-[1.02]"
          >
            Apply to join
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-5 pt-28 pb-16 text-center">
        {/* Subtle background gradient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-purple-50 opacity-60 blur-[80px]" />
          <div className="absolute top-1/2 -right-20 h-[400px] w-[400px] rounded-full bg-violet-50 opacity-40 blur-[80px]" />
        </div>

        <div ref={heroRef} className="relative max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700"
          >
            <Star size={10} className="fill-purple-500 text-purple-500" />
            Now live at top universities · Members accepted, not just registered
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-display text-5xl font-black leading-[1.05] tracking-tight text-gray-900 md:text-7xl"
          >
            Finally, people
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-500 bg-clip-text text-transparent">
              worth your time.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500 md:text-xl"
          >
            79% of Gen Z are burned out on dating apps. Apex is what comes next —
            verified real people, compatibility over chemistry, no swiping required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300 hover:scale-[1.02]"
            >
              Check your eligibility
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
            >
              Sign in
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 text-xs text-gray-400"
          >
            Free to join · No credit card required · Verified profiles only
          </motion.p>
        </div>

        {/* Ticker strip */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-gray-100 bg-gray-50 py-3">
          <div
            ref={tickerRef}
            className="flex gap-8 whitespace-nowrap"
            style={{ transform: `translateX(-${tickerOffset}px)`, willChange: 'transform' }}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="text-xs font-medium text-gray-500">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-8 md:grid-cols-4">
          <StatCounter to={2400} suffix="+" label="Verified members" />
          <StatCounter to={47} suffix="+" label="Universities represented" />
          <StatCounter to={84} suffix="%" label="Report better quality matches" />
          <StatCounter to={27} suffix="%" label="Of US marriages start on apps" />
        </div>
      </section>

      {/* ── Profile preview ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-3 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">Who you&apos;ll meet</span>
        </div>
        <h2 className="mb-4 text-center font-display text-3xl font-black text-gray-900 md:text-5xl">
          This is what
          <br />
          <span className="text-gray-400">an Apex profile looks like.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-md text-center text-sm leading-relaxed text-gray-500">
          Not curated photos and a two-word bio. Real credentials, real ambition, real people.
        </p>

        {/* Scrollable card row */}
        <div className="flex gap-5 overflow-x-auto pb-4 justify-center flex-wrap md:flex-nowrap md:overflow-visible">
          {PREVIEW_PROFILES.map((profile, i) => (
            <ProfileCard key={profile.name} profile={profile} delay={i * 0.1} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-xs text-gray-400"
        >
          Sample profiles shown for illustration. Real members are verified and curated.
        </motion.p>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">Who it&apos;s for</span>
          </div>
          <h2 className="mb-14 text-center font-display text-3xl font-black text-gray-900 md:text-5xl">
            Apex is for people who
            <br />
            <span className="text-gray-400">want more than a swipe.</span>
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard delay={0} icon={<GraduationCap size={20} />} title="Top students & graduates"
              body="College-verified profiles with real credentials. GPA, SAT, ACT — showcase what you've built, not just how you look." />
            <FeatureCard delay={0.07} icon={<Briefcase size={20} />} title="Ambitious professionals"
              body="Finance, tech, law, medicine — connect with someone who matches your career drive and life trajectory." />
            <FeatureCard delay={0.14} icon={<MapPin size={20} />} title="Relocating & planning ahead"
              body="Moving to a new city? Meet people already there or making the same move. Relocation-aware matching built in." />
            <FeatureCard delay={0.21} icon={<ShieldCheck size={20} />} title="Identity-verified members"
              body="Every member can verify their identity via photo ID. No catfishes. No bots. Just real, accountable people." />
            <FeatureCard delay={0.28} icon={<Heart size={20} />} title="Serious about connection"
              body="Built for long-term and marriage-track relationships. Not another app to feel lonely on." />
            <FeatureCard delay={0.35} icon={<Zap size={20} />} title="Strength & lifestyle"
              body="Track your gym stats, showcase your strength, link your social presence. A full picture of who you are." />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-3 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">How it works</span>
        </div>
        <h2 className="mb-14 text-center font-display text-3xl font-black text-gray-900 md:text-5xl">
          Three steps to your
          <br />
          <span className="text-gray-400">intellectual match.</span>
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {[
            { step: '01', title: 'Build your full profile', body: "Add your education, career, interests, prompts, and credentials. Your profile should feel like a LinkedIn and Instagram had a very attractive child." },
            { step: '02', title: 'Search like a human', body: '"Harvard girl who hikes and is moving to Chicago" — type exactly what you\'re looking for. Our AI finds them.' },
            { step: '03', title: 'Connect with intention', body: "Send a note with your interest. No ghost-swiping. Every connection starts with something real." },
          ].map(({ step, title, body }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <div className="mb-3 font-display text-6xl font-black text-gray-100">{step}</div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">The difference</span>
          </div>
          <h2 className="mb-12 text-center font-display text-3xl font-black text-gray-900 md:text-5xl">
            This is not
            <br />
            <span className="text-gray-400">another dating app.</span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[24px] border border-gray-200 bg-white overflow-hidden shadow-sm"
          >
            {/* Header row */}
            <div className="grid grid-cols-3 border-b border-gray-100">
              <div className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400" />
              <div className="border-x border-gray-100 px-5 py-4 text-center text-xs font-semibold text-gray-400">
                Other apps
              </div>
              <div className="bg-purple-50 px-5 py-4 text-center text-xs font-bold text-purple-700 uppercase tracking-[0.15em]">
                Apex ✦
              </div>
            </div>

            {COMPARISON_ROWS.map(({ label, others, apex }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className={`grid grid-cols-3 ${i < COMPARISON_ROWS.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="px-5 py-4 text-sm font-semibold text-gray-700">{label}</div>
                <div className="border-x border-gray-100 px-5 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                    <X size={13} className="text-red-400 flex-shrink-0" />
                    {others}
                  </span>
                </div>
                <div className="bg-purple-50/50 px-5 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700">
                    <Check size={13} className="text-purple-500 flex-shrink-0" />
                    {apex}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Verification standard ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-3 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">The standard</span>
        </div>
        <h2 className="mb-4 text-center font-display text-3xl font-black text-gray-900 md:text-5xl">
          Curated, not crowdsourced.
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-base leading-relaxed text-gray-500">
          Every profile goes through our credibility layer before becoming visible.
        </p>

        <div className="mx-auto max-w-2xl rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm">
          {[
            { label: 'Email verification', desc: 'Every account verified by email before accessing the app' },
            { label: 'Photo verification', desc: 'Real selfie required during profile setup — no stolen photos' },
            { label: 'ID verification (optional)', desc: 'Submit a government ID for the Apex Verified badge' },
            { label: 'School email verification', desc: 'Use a .edu email to unlock your Verified Student badge automatically' },
            { label: 'Credential showcase', desc: 'GPA, SAT, ACT, career, strength stats — own your achievements' },
          ].map(({ label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className={`flex items-start gap-4 ${i > 0 ? 'mt-5 pt-5 border-t border-gray-100' : ''}`}
            >
              <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-600">What members say</span>
          </div>
          <h2 className="mb-14 text-center font-display text-3xl font-black text-gray-900 md:text-4xl">
            The contrast is real.
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, school }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="rounded-[20px] bg-white border border-gray-100 p-6 shadow-sm"
              >
                <Quote size={20} className="mb-4 text-purple-200" />
                <p className="text-sm leading-relaxed text-gray-700 font-medium">&ldquo;{quote}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-400">{school}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-gray-100 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/8 blur-[80px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-2xl"
        >
          <h2 className="font-display text-4xl font-black text-white md:text-6xl">
            Your person is
            <br />already here.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/80">
            Stop settling for apps built for everyone. Apex is built for people who take their future seriously.
          </p>
          <Link
            to="/register"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-purple-700 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
          >
            Apply to join Apex — it&apos;s free
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-4 text-xs text-white/60">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="underline underline-offset-2 hover:text-white">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-white">Privacy Policy</Link>.
          </p>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white px-6 py-12 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2">
                <ApexLogo size={28} showText={true} variant="default" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Where ambition meets authenticity. Built for people who want a partner that keeps up.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Product</p>
                <div className="flex flex-col gap-3 text-sm text-gray-500">
                  <Link to="/register" className="hover:text-gray-900 transition-colors">Get started</Link>
                  <Link to="/login" className="hover:text-gray-900 transition-colors">Sign in</Link>
                  <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
                </div>
              </div>
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Support</p>
                <div className="flex flex-col gap-3 text-sm text-gray-500">
                  <a href="mailto:hello@apex-social.com" className="hover:text-gray-900 transition-colors">Contact us</a>
                  <Link to="/community-guidelines" className="hover:text-gray-900 transition-colors">Community guidelines</Link>
                </div>
              </div>
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Legal</p>
                <div className="flex flex-col gap-3 text-sm text-gray-500">
                  <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
                  <Link to="/community-guidelines" className="hover:text-gray-900 transition-colors">Community Guidelines</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
            <p className="text-xs text-gray-400">© 2026 Apex. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Lock size={10} />
              <span>apex-social.com · SSL secured</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
