import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const COOKIE_TYPES = [
  {
    type: "Strictly Necessary",
    purpose: "Required for the platform to function",
    canOptOut: false,
    examples: [
      "Authentication session cookie (keeps you logged in)",
      "CSRF protection token",
      "Security and fraud prevention identifiers",
    ],
  },
  {
    type: "Analytics & Performance",
    purpose: "Help us understand how members use Apex",
    canOptOut: true,
    examples: [
      "Vercel Analytics (page views, performance metrics, no personal data sold)",
      "Error monitoring identifiers",
    ],
  },
]

const SECTIONS = [
  {
    title: "What Are Cookies?",
    body: "Cookies are small text files placed on your device by websites you visit. They are widely used to make websites function efficiently and to provide reporting information. Cookies set by Apex are called \u201cfirst-party cookies.\u201d Cookies set by third parties are called \u201cthird-party cookies.\u201d",
  },
  {
    title: "What We Don't Use",
    body: "Apex does not use third-party advertising cookies. We do not run Facebook Pixel, Google Ads trackers, or any behavioral advertising technology. We do not sell data derived from cookie tracking to data brokers or advertisers. Our analytics are limited to aggregate performance metrics.",
  },
  {
    title: "Cookie Duration",
    body: "Authentication session cookies expire after 7 days of inactivity by default, or immediately upon logout. Analytics cookies are session-scoped or expire within 90 days.",
  },
  {
    title: "How to Control Cookies",
    body: "You can control and delete cookies through your browser settings. Most browsers allow you to refuse all cookies, accept only certain cookies, or delete existing cookies. Note that disabling strictly necessary cookies will prevent you from logging in to Apex. For analytics cookies, you can opt out by enabling \u201cDo Not Track\u201d in your browser or by using our privacy choices page.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Cookie Policy from time to time. We will notify registered members of material changes via email. Continued use of Apex after changes are posted constitutes your acceptance of the updated policy.",
  },
  {
    title: "Contact",
    body: "If you have questions about our use of cookies, email hello@tryapextoday.com.",
  },
]

export default function CookiePolicyPage() {
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
        <div className="mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">Legal</span>
            <h1 className="font-display text-4xl font-black text-white md:text-5xl leading-[1.06] mb-4">Cookie Policy</h1>
            <p className="text-sm text-white/35">Last updated: April 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-6 md:mx-12" />

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-2xl flex flex-col gap-10">

          {/* Cookie table */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-5">Cookies We Use</h2>
            <div className="flex flex-col gap-4">
              {COOKIE_TYPES.map(({ type, purpose, canOptOut, examples }) => (
                <div key={type} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-white">{type}</p>
                    <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${canOptOut ? 'bg-yellow-500/15 text-yellow-400' : 'bg-purple-500/15 text-purple-400'}`}>
                      {canOptOut ? 'Can opt out' : 'Required'}
                    </span>
                  </div>
                  <p className="text-xs text-white/45 mb-3">{purpose}</p>
                  <ul className="flex flex-col gap-1.5">
                    {examples.map((ex) => (
                      <li key={ex} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-white/25" />
                        <span className="text-xs text-white/45">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {SECTIONS.map(({ title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-3">{title}</h2>
              <p className="text-sm leading-relaxed text-white/60">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-6 py-8 md:px-12">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
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
