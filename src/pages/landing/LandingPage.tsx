import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Zap,
  Users,
  Lock,
  Star,
  MapPin,
  Briefcase,
  Heart,
} from 'lucide-react'

// ── Ticker data ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  '🎓 Harvard grad just joined',
  '🔗 Two Stanford engineers connected',
  '🏙️ 14 new profiles from Chicago',
  '✅ 300+ identity-verified members',
  '💼 Finance & tech professionals',
  '🌍 Active in 18+ cities',
  '🏆 Top university GPAs represented',
  '🔥 12 new connections made today',
  '🎯 Columbia pre-med joined today',
  '✈️ NYC → Chicago relocation match',
]

// ── Stat counter ─────────────────────────────────────────────────────────────
function StatCounter({ to, label, suffix = '' }: { to: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1800
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
      <div className="font-display text-4xl font-black text-white md:text-5xl">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-zinc-400">{label}</div>
    </div>
  )
}

// ── Feature card ─────────────────────────────────────────────────────────────
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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="group relative rounded-[24px] border border-white/8 bg-white/4 p-6 backdrop-blur-sm hover:border-purple-500/40 hover:bg-white/6 transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)' }}
      />
      <div className="relative">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400">
          {icon}
        </div>
        <h3 className="mb-2 text-[17px] font-bold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
      </div>
    </motion.div>
  )
}

// ── Main landing page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [tickerOffset, setTickerOffset] = useState(0)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animFrame: number
    let pos = 0
    const speed = 0.5
    function step() {
      pos += speed
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

  const statsRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true })

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
        style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0) 100%)' }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg shadow-purple-900/40">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">Apex</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black hover:bg-zinc-100 transition-colors shadow-lg"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-5 pt-24 pb-12 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/12 blur-[120px]" />
          <div className="absolute left-1/4 top-2/3 h-[300px] w-[300px] rounded-full bg-violet-800/10 blur-[80px]" />
        </div>

        <div ref={heroRef} className="relative max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300"
          >
            <Star size={10} className="fill-purple-400 text-purple-400" />
            Now live across top universities
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl font-black leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            Built for people
            <br />
            <span
              className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent"
            >
              going places.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 md:text-xl"
          >
            The first dating platform that takes ambition seriously.
            Connect with verified, high-achieving people who match your drive — not just your location.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-7 py-3.5 text-base font-bold text-white shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all hover:shadow-[0_0_60px_rgba(124,58,237,0.5)] hover:scale-[1.02]"
            >
              Create your profile
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-base font-semibold text-zinc-300 transition-all hover:border-white/30 hover:text-white"
            >
              Sign in
            </Link>
          </motion.div>

          {/* Social proof micro */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-5 text-xs text-zinc-500"
          >
            Free to join · No credit card required · Verified profiles only
          </motion.p>
        </div>

        {/* Ticker strip */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/6 bg-white/3 py-3 backdrop-blur-sm">
          <div
            ref={tickerRef}
            className="flex gap-8 whitespace-nowrap"
            style={{ transform: `translateX(-${tickerOffset}px)`, willChange: 'transform' }}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="text-xs font-medium text-zinc-400">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/6 bg-white/3 py-16">
        <div ref={statsRef} className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-8 md:grid-cols-4">
          <StatCounter to={1200} suffix="+" label="Verified profiles" />
          <StatCounter to={40} suffix="+" label="Universities represented" />
          <StatCounter to={18} suffix="+" label="Cities active" />
          <StatCounter to={94} suffix="%" label="Say it beats other apps" />
        </div>
      </section>

      {/* ── Who it's for ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="mb-4 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">Who it&apos;s for</span>
        </div>
        <h2 className="mb-16 text-center font-display text-3xl font-black text-white md:text-5xl">
          Apex is for people who
          <br />
          <span className="text-zinc-400">want more than a swipe.</span>
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            delay={0}
            icon={<GraduationCap size={20} />}
            title="Top students & graduates"
            body="College-verified profiles with real credentials. GPA, SAT, ACT — showcase what you've built, not just how you look."
          />
          <FeatureCard
            delay={0.08}
            icon={<Briefcase size={20} />}
            title="Ambitious professionals"
            body="Finance, tech, law, medicine — connect with someone who matches your career drive and life trajectory."
          />
          <FeatureCard
            delay={0.16}
            icon={<MapPin size={20} />}
            title="Relocating & planning ahead"
            body="Moving to a new city? Meet people already there or making the same move. Relocation-aware matching built in."
          />
          <FeatureCard
            delay={0.24}
            icon={<ShieldCheck size={20} />}
            title="Identity-verified members"
            body="Every member can verify their identity via photo ID. No catfishes. No bots. Just real, accountable people."
          />
          <FeatureCard
            delay={0.32}
            icon={<Heart size={20} />}
            title="Serious about connection"
            body="Built for long-term and marriage-track relationships. Not another app to feel lonely on."
          />
          <FeatureCard
            delay={0.4}
            icon={<Zap size={20} />}
            title="Strength & lifestyle"
            body="Track your gym stats, showcase your strength, link your social presence. A full picture of who you are."
          />
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="border-y border-white/6 bg-white/3 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-4 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">How it works</span>
          </div>
          <h2 className="mb-16 text-center font-display text-3xl font-black text-white md:text-5xl">
            Three steps to your
            <br />
            <span className="text-zinc-400">intellectual match.</span>
          </h2>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Build your full profile',
                body: 'Add your education, career, interests, prompts, and credentials. Your profile should feel like a LinkedIn and Instagram had a very attractive child.',
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col"
              >
                <div className="mb-4 font-display text-6xl font-black text-white/8">{step}</div>
                <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The standard ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="mb-4 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">The standard</span>
        </div>
        <h2 className="mb-4 text-center font-display text-3xl font-black text-white md:text-5xl">
          Curated, not crowdsourced.
        </h2>
        <p className="mx-auto mb-14 max-w-2xl text-center text-base leading-relaxed text-zinc-400">
          We don&apos;t want everyone. We want the right people — verified, ambitious, and ready for something real. Every profile goes through our credibility layer before becoming visible.
        </p>

        <div className="mx-auto max-w-2xl rounded-[28px] border border-white/10 bg-white/4 p-8">
          {[
            { label: 'Email verification', desc: 'Every account verified by email before accessing the app' },
            { label: 'Photo verification', desc: 'Real selfie required during profile setup — no stolen photos' },
            { label: 'ID verification (optional)', desc: 'Submit a government ID for the Apex Verified badge' },
            { label: 'School email verification', desc: 'Use a .edu email to unlock your Verified Student badge automatically' },
            { label: 'Credential showcase', desc: 'GPA, SAT, ACT, career, strength stats — own your achievements' },
          ].map(({ label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`flex items-start gap-4 ${i > 0 ? 'mt-5 pt-5 border-t border-white/6' : ''}`}
            >
              <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <h2 className="font-display text-4xl font-black text-white md:text-6xl">
            Your person is
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              already here.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-zinc-400">
            Stop settling for apps built for everyone. Apex is built for people who take their future seriously — and who want a partner that does too.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all hover:shadow-[0_0_60px_rgba(124,58,237,0.5)] hover:scale-[1.02]"
            >
              Join Apex — it&apos;s free
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="text-zinc-400 underline underline-offset-2 hover:text-white">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-zinc-400 underline underline-offset-2 hover:text-white">Privacy Policy</Link>.
          </p>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/6 bg-white/2 px-6 py-12 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg shadow-purple-900/40">
                  <Sparkles size={15} className="text-white" />
                </div>
                <span className="text-lg font-black tracking-tight text-white">Apex</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Where ambition meets authenticity. Built for people who want a partner that keeps up.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Product</p>
                <div className="flex flex-col gap-3 text-sm text-zinc-400">
                  <Link to="/register" className="hover:text-white transition-colors">Get started</Link>
                  <Link to="/login" className="hover:text-white transition-colors">Sign in</Link>
                  <Link to="/about" className="hover:text-white transition-colors">About</Link>
                </div>
              </div>
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Support</p>
                <div className="flex flex-col gap-3 text-sm text-zinc-400">
                  <a href="mailto:hello@apex-match.com" className="hover:text-white transition-colors">Contact us</a>
                  <Link to="/community-guidelines" className="hover:text-white transition-colors">Community guidelines</Link>
                </div>
              </div>
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Legal</p>
                <div className="flex flex-col gap-3 text-sm text-zinc-400">
                  <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                  <Link to="/community-guidelines" className="hover:text-white transition-colors">Community Guidelines</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/6 pt-6 sm:flex-row">
            <p className="text-xs text-zinc-600">© 2026 Apex. All rights reserved.</p>
            <div className="flex items-center gap-1 text-xs text-zinc-600">
              <Lock size={10} />
              <span>apex-match.com · SSL secured</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
