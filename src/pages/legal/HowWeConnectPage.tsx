import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Search, Heart, MapPin, Zap, GraduationCap, ShieldCheck } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const STEPS = [
  {
    number: '01',
    icon: <GraduationCap size={20} />,
    title: "Build a real profile",
    body: "Apex profiles go far beyond photos and a two-word bio. You\u2019ll share your education, GPA, career, current and future location, relationship intent, values, and Hinge-style prompts. We want the full picture of who you are \u2014 not a highlight reel.",
  },
  {
    number: '02',
    icon: <ShieldCheck size={20} />,
    title: "Get verified",
    body: "Email verification is required. School verification (via .edu email) and identity verification (via government ID) are optional but add credibility. Verified profiles are prioritized in search results and daily drops. The more verified you are, the more visible you become.",
  },
  {
    number: '03',
    icon: <Search size={20} />,
    title: "Search like a human",
    body: "Our AI-powered search understands plain English. Type \u201cHarvard law student moving to NYC who wants something serious\u201d and we\u2019ll surface matching profiles \u2014 not a list of keyword results, but genuinely compatible people. Free members get limited searches. Premium members get unlimited.",
  },
  {
    number: '04',
    icon: <Zap size={20} />,
    title: "Receive your daily drop",
    body: "Each day, Apex curates a small set of profiles specifically selected for you based on compatibility signals: shared values, education alignment, career stage, relationship intent, and location. There is no infinite swipe queue \u2014 just a focused, meaningful set of people worth your time.",
  },
  {
    number: '05',
    icon: <MapPin size={20} />,
    title: "Relocation-aware matching",
    body: "If you\u2019re moving \u2014 or open to moving \u2014 Apex factors that in. Add your future city and planned move date, and we\u2019ll match you with people already there or making the same transition. A Chicago \u2192 NYC move doesn\u2019t have to reset your dating life.",
  },
  {
    number: '06',
    icon: <Heart size={20} />,
    title: "Connect with intention",
    body: "No ghost-swiping. No hollow likes. To express interest in someone, you send a brief intro note with your connection request. Every connection starts with something real. When both people accept, a shared conversation thread opens and you can begin getting to know each other.",
  },
]

const SIGNALS = [
  'Education institution and graduation year',
  'Academic performance (GPA, if provided)',
  'Career stage and employer',
  'Current location and future location',
  'Relationship intent (serious, marriage-track, etc.)',
  'Shared values (selected from our curated list)',
  'Lifestyle compatibility (activity level, preferences)',
  'Verification level (ID verified, school verified)',
]

export default function HowWeConnectPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0d0521' }}>
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/8">
        <Link to="/"><ApexLogo size={26} showText variant="white" /></Link>
        <Link to="/register" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-purple-700 transition-all hover:scale-[1.02]">Join free</Link>
      </nav>

      <div className="px-6 pt-8 md:px-12">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors">
          <ArrowLeft size={14} />Back to Apex
        </Link>
      </div>

      <section className="px-6 pt-12 pb-8 md:px-12 text-center">
        <div className="mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">How It Works</span>
            <h1 className="font-display text-4xl font-black text-white md:text-5xl leading-[1.06] mb-4">
              How We Connect Daters
            </h1>
            <p className="text-base leading-relaxed text-white/55 max-w-lg mx-auto mb-2">
              Apex is not a swipe app. This is how we work \u2014 from profile creation to your first real conversation.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-6 md:mx-12" />

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-8">
            {STEPS.map(({ number, icon, title, body }, i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="flex gap-5"
              >
                <div className="flex-shrink-0">
                  <div className="font-display text-5xl font-black text-white/[0.06]">{number}</div>
                </div>
                <div className="pt-2">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                    {icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#0f0826' }} className="border-y border-white/[0.06] px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4">Compatibility Signals We Use</h2>
          <p className="text-sm text-white/55 mb-8">
            Our algorithm combines these signals to generate your daily curated drop and rank AI search results.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SIGNALS.map((signal) => (
              <div key={signal} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                <span className="text-sm text-white/60">{signal}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/30">
            We do not use engagement-maximizing mechanics (swipe streaks, super likes, boosts) that prioritize platform retention over member wellbeing.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md"
        >
          <h2 className="font-display text-3xl font-black text-white mb-4">Ready to try it?</h2>
          <p className="text-sm text-white/45 mb-8">Join free and experience a different kind of dating app.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.02]"
          >
            Get started free
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.06] px-6 py-8 md:px-12">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <p className="text-xs text-white/25">© 2026 Apex. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
