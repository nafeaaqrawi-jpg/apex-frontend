import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const RIGHTS = [
  {
    title: "Right to Access",
    body: "You have the right to know what personal data Apex holds about you. Upon request, we will provide a copy of your personal data in a structured, machine-readable format.",
    how: "Email privacy@tryapextoday.com with subject: \u201cData Access Request\u201d",
  },
  {
    title: "Right to Delete",
    body: "You have the right to request deletion of your personal data. You can delete your account at any time via Settings \u2192 Account \u2192 Delete Account. Your data is permanently removed within 30 days.",
    how: "Use in-app account deletion, or email privacy@tryapextoday.com",
  },
  {
    title: "Right to Correct",
    body: "If any personal data we hold about you is inaccurate, you have the right to request correction. Most profile data can be updated directly in your account settings.",
    how: "Update via Settings, or email privacy@tryapextoday.com for account-level data",
  },
  {
    title: "Right to Data Portability",
    body: "You have the right to receive your personal data in a portable format so you can transfer it to another service. We will provide your data in JSON or CSV format upon request.",
    how: "Email privacy@tryapextoday.com with subject: \u201cData Portability Request\u201d",
  },
  {
    title: "Opt Out of Marketing",
    body: "You can opt out of marketing emails at any time by clicking the unsubscribe link in any Apex marketing email, or by updating your notification preferences in Settings.",
    how: "Use the unsubscribe link in any marketing email, or go to Settings \u2192 Notifications",
  },
  {
    title: "Opt Out of Analytics",
    body: "Apex uses Vercel Analytics for aggregate, privacy-preserving performance metrics. To opt out of analytics tracking, enable \u201cDo Not Track\u201d in your browser settings or use a privacy-focused browser extension.",
    how: "Enable Do Not Track in your browser, or use a privacy browser extension",
  },
  {
    title: "Right to Non-Discrimination",
    body: "Exercising your privacy rights will not result in denial of services, different prices, or different quality of service. We will not penalize you for asserting your rights.",
    how: "No action required \u2014 this right is automatic",
  },
]

const LEGAL_BASIS = [
  { region: "United States (CCPA/CPRA)", note: "California residents have additional rights under the CCPA/CPRA, including the right to opt out of the sale of personal information. Apex does not sell personal information." },
  { region: "European Union (GDPR)", note: "EU residents have rights including access, rectification, erasure, restriction, portability, and objection. Our legal basis for processing is contract performance and legitimate interest." },
  { region: "Washington State (MHMD Act)", note: "Washington residents have additional rights over consumer health data. See our Consumer Health Data Privacy Policy." },
  { region: "Colorado (CPA)", note: "Colorado residents have rights to access, delete, correct, and port personal data, and to opt out of targeted advertising. See our Colorado Safety Policy." },
]

export default function PrivacyChoicesPage() {
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
            <h1 className="font-display text-4xl font-black text-white md:text-5xl leading-[1.06] mb-4">
              Your Privacy Choices
            </h1>
            <p className="text-base leading-relaxed text-white/55 max-w-xl mb-2">
              You are in control of your data. Here is a complete overview of your privacy rights and how to exercise them.
            </p>
            <p className="text-sm text-white/35">Last updated: April 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-6 md:mx-12" />

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-4 mb-14">
            {RIGHTS.map(({ title, body, how }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"
              >
                <p className="text-sm font-bold text-white mb-2">{title}</p>
                <p className="text-xs leading-relaxed text-white/55 mb-3">{body}</p>
                <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-400 mb-0.5">How to exercise</p>
                  <p className="text-xs text-white/55">{how}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-5">Your Rights by Region</h2>
            <div className="flex flex-col gap-3">
              {LEGAL_BASIS.map(({ region, note }) => (
                <div key={region} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white mb-1">{region}</p>
                  <p className="text-xs leading-relaxed text-white/50">{note}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-2">Response Timelines</p>
            <p className="text-sm text-white/55">
              We will respond to all privacy rights requests within 45 days. In complex cases, we may extend this period by an additional 45 days with prior notice. We may request identity verification before processing requests involving account data.
            </p>
          </motion.div>
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
