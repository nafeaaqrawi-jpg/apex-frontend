import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const STATS = [
  { value: '2,400+', label: 'Verified members' },
  { value: '47+', label: 'Universities represented' },
  { value: '84%', label: 'Report higher quality matches vs. other apps' },
  { value: '$10-50M', label: 'Target acquisition valuation' },
]

const FAST_FACTS = [
  'Founded: 2025',
  'Headquarters: Remote-first',
  'Category: Premium dating / social discovery',
  'Target audience: College students, recent graduates, ambitious young professionals',
  'Funding: Pre-Series A',
  'Business model: Freemium (free base tier + Apex Premium subscription)',
  'Technology: AI-powered compatibility matching and natural language search',
  'Compliance: CCPA, GDPR, COPPA (18+ enforcement)',
]

export default function PressPage() {
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

      <section className="px-6 pt-12 pb-8 md:px-12">
        <div className="mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">Press</span>
            <h1 className="font-display text-4xl font-black text-white md:text-5xl leading-[1.06] mb-4">
              Press Resources
            </h1>
            <p className="text-base leading-relaxed text-white/55 max-w-xl mb-2">
              For media inquiries, interview requests, or brand asset access, contact our founder directly.
            </p>
            <p className="text-sm text-white/35">Last updated: April 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-6 md:mx-12" />

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl flex flex-col gap-14">

          {/* Press contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-5">Press Contact</h2>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
              <p className="text-base font-bold text-white mb-1">Nafea Aqrawi</p>
              <p className="text-sm text-white/50 mb-4">Founder & CEO, Apex</p>
              <a
                href="mailto:nafea@tryapextoday.com?subject=Press Inquiry"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.02]"
              >
                nafea@tryapextoday.com
                <ArrowRight size={14} />
              </a>
              <p className="mt-3 text-xs text-white/30">We respond to all press inquiries within 48 hours.</p>
            </div>
          </motion.div>

          {/* About Apex */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4">About Apex</h2>
            <p className="text-sm leading-relaxed text-white/60 mb-4">
              Apex is a premium dating platform built for intellectually ambitious adults. Founded in 2025, Apex takes the opposite approach from mainstream dating apps: instead of infinite swiping and anonymous profiles, Apex requires real credentials, offers a curated daily drop of compatible matches, and mandates a thoughtful intro note before any connection is made.
            </p>
            <p className="text-sm leading-relaxed text-white/60">
              Apex is built with acquisition in mind. The platform\u2019s target is a $10\u201350M acquisition by Match Group, IAC, or a comparable strategic buyer within 12 months \u2014 comparable to The League\u2019s $29.9M exit to Match Group in 2022. Apex\u2019s differentiation lies in trust infrastructure (verification layers), AI-powered natural language search, and relocation-aware matching \u2014 features not offered at this depth by any comparable platform.
            </p>
          </motion.div>

          {/* Founder bio */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4">Founder</h2>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
              <p className="text-base font-bold text-white mb-1">Nafea Aqrawi</p>
              <p className="text-sm text-white/50 mb-3">Founder & CEO</p>
              <p className="text-sm leading-relaxed text-white/60">
                Nafea Aqrawi is the founder and CEO of Apex. He built Apex after observing a gap in the dating app market: platforms built for volume rather than quality, for engagement rather than relationships. Apex is his response \u2014 a premium, credential-verified platform targeting the fastest-growing segment of the dating market: educated, ambitious young adults who want something real.
              </p>
            </div>
          </motion.div>

          {/* Key stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-5">Key Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                  <p className="font-display text-3xl font-black text-white mb-1">{value}</p>
                  <p className="text-xs text-white/45">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Fast facts */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4">Fast Facts</h2>
            <div className="flex flex-col gap-2">
              {FAST_FACTS.map((fact) => (
                <div key={fact} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                  <span className="text-sm text-white/60">{fact}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Brand assets */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4">Brand Assets</h2>
            <p className="text-sm leading-relaxed text-white/60">
              Logo files, brand guidelines, product screenshots, and executive headshots are available upon request. Email{' '}
              <a href="mailto:nafea@tryapextoday.com" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                nafea@tryapextoday.com
              </a>{' '}
              with your publication and intended use. All brand assets may only be used in editorial contexts with prior approval.
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-6 py-8 md:px-12">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <p className="text-xs text-white/25">\u00a9 2026 Apex. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
