import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const FAQ_SECTIONS = [
  {
    section: 'Getting Started',
    items: [
      {
        q: "Is Apex really free?",
        a: "Yes \u2014 joining, creating your profile, and browsing are all completely free. There are no hidden fees or required credit cards to get started. Apex Premium is an optional paid upgrade that unlocks unlimited AI-powered search, read receipts, profile view notifications, relocation match alerts, and priority placement in daily curated drops. Premium is $19.99/month or $149.88/year (billed annually).",
      },
      {
        q: "Who can join Apex?",
        a: "Apex is open to anyone 18 years of age or older who is genuinely seeking a serious relationship. We particularly serve college students, recent graduates, and young professionals at competitive universities and leading companies. That said, ambition, authenticity, and good character matter more to us than any specific institution or employer.",
      },
      {
        q: "How do I create a profile?",
        a: "Click \u201cJoin free\u201d and register with your email. You\u2019ll be walked through a profile builder that captures your education, career, location, values, relationship goals, and a few Hinge-style prompts. We recommend taking 15\u201320 minutes to complete your full profile \u2014 more complete profiles see significantly higher connection rates. Once your profile is submitted, it goes through a brief review before becoming visible to other members.",
      },
      {
        q: "Is there an approval process?",
        a: "Yes. Every profile is reviewed by our team before it goes live. This typically takes under 24 hours. We review for completeness, authenticity, and community standards compliance. Profiles that appear fake, incomplete, or that violate our Community Guidelines will not be approved.",
      },
    ],
  },
  {
    section: 'Verification',
    items: [
      {
        q: "How does verification work?",
        a: "Apex offers three layers of verification. Email verification is mandatory for all accounts and confirms you\u2019re a real person with a valid email address. Student verification allows members with .edu email addresses to instantly earn a Verified Student badge. Identity verification is an optional step where you submit a government-issued photo ID to earn the Apex Verified badge, which is prominently displayed on your profile and search results.",
      },
      {
        q: "Is my ID stored securely?",
        a: "Government ID documents submitted for identity verification are processed through a secure, encrypted pipeline. We do not store raw ID images on our servers after verification is complete. A verification status record is retained in your account. See our Privacy Policy and Security page for full technical details.",
      },
      {
        q: "What if I don't have a .edu email?",
        a: "You can still join Apex and have a fully visible profile without school verification. The Verified Student badge is an optional additional credential for members who can confirm enrollment. Non-student members frequently connect with student and graduate members \u2014 the badge is a signal, not a requirement.",
      },
    ],
  },
  {
    section: 'Matching & Search',
    items: [
      {
        q: "How does the matching algorithm work?",
        a: "Apex does not use infinite swiping. Instead, you receive a daily curated drop of profiles selected based on compatibility signals: shared values, education alignment, career stage, relationship intent, and location (both current and future). Our AI search also allows you to describe who you\u2019re looking for in plain English \u2014 \u201cHarvard grad moving to NYC who runs and wants something serious\u201d \u2014 and we\u2019ll surface relevant profiles.",
      },
      {
        q: "Can I use Apex if I'm relocating?",
        a: "Absolutely \u2014 relocation-aware matching is one of our core differentiators. Add your future city and planned move date to your profile, and our algorithm will match you with people already in that city or planning the same move. A Chicago \u2192 NYC move doesn\u2019t have to mean starting your dating life from zero.",
      },
      {
        q: "What is the daily curated drop?",
        a: "Each day, Apex surfaces a small set of highly compatible profiles specifically selected for you. Rather than an endless swipe queue, you get a focused set of meaningful recommendations. Free members receive up to 3 profiles per day. Premium members receive priority placement in other members\u2019 drops and have access to unlimited AI-powered search.",
      },
    ],
  },
  {
    section: 'Privacy & Safety',
    items: [
      {
        q: "Is my data private?",
        a: "Yes. We never sell your personal data to third parties. Your profile is only visible to verified Apex members \u2014 it cannot be found via search engines. All data is encrypted in transit (TLS 1.3) and at rest. See our Privacy Policy for the complete picture of what we collect, why, and how long we keep it.",
      },
      {
        q: "How do I report someone?",
        a: "Every profile has a Report button accessible from the profile view. You can report for: fake profile, harassment, inappropriate content, underage user, or other. All reports are reviewed by our Trust & Safety team within 24 hours. For urgent safety concerns, email safety@tryapextoday.com.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings \u2192 Account \u2192 Delete Account. Confirm your password and your account will be scheduled for permanent deletion. Per our data retention policy, all personal data is permanently removed within 30 days. You will receive an email confirmation when deletion is complete. We do not retain your data in any marketing systems after deletion.",
      },
    ],
  },
]

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <div className="min-h-screen" style={{ background: '#0d0521' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/8">
        <Link to="/"><ApexLogo size={26} showText variant="white" /></Link>
        <Link to="/register" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-purple-700 transition-all hover:scale-[1.02]">
          Join free
        </Link>
      </nav>

      <div className="px-6 pt-8 md:px-12">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors">
          <ArrowLeft size={14} />Back to Apex
        </Link>
      </div>

      <section className="px-6 pt-12 pb-20 md:px-12">
        <div className="mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">Help Center</span>
            <h1 className="font-display text-4xl font-black text-white md:text-5xl leading-[1.06] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-white/50 mb-12">
              Everything you need to know about Apex. Can't find your answer?{' '}
              <a href="mailto:hello@tryapextoday.com" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                Email us
              </a>
              .
            </p>
          </motion.div>

          {FAQ_SECTIONS.map(({ section, items }) => (
            <div key={section} className="mb-10">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4">{section}</h2>
              <div className="flex flex-col gap-2">
                {items.map(({ q, a }) => {
                  const key = `${section}-${q}`
                  const open = openItem === key
                  return (
                    <div key={q} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden">
                      <button
                        onClick={() => setOpenItem(open ? null : key)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-sm font-semibold text-white pr-4">{q}</span>
                        <motion.span
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex-shrink-0 text-purple-400"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
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
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-6 py-8 md:px-12">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
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
