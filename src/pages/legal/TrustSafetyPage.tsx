import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const SECTIONS = [
  {
    title: "Our Commitment",
    body: "Apex is built on the premise that trust is the foundation of meaningful connection. Every policy, every verification step, and every enforcement decision we make is oriented toward protecting the integrity of our community. We take this responsibility seriously.",
  },
  {
    title: "Prohibited Behaviors",
    items: [
      "Harassment, threats, or intimidation of any kind",
      "Sharing explicit or non-consensual intimate images",
      "Catfishing, impersonation, or creating fake profiles",
      "Solicitation, scamming, or financial fraud",
      "Hate speech targeting race, religion, gender, sexuality, disability, or national origin",
      "Underage access \u2014 Apex is strictly 18+",
      "Sharing personal contact information of others without consent",
      "Commercial solicitation, spam, or multi-level marketing promotion",
    ],
  },
  {
    title: "How We Enforce",
    body: "All reported content is reviewed by a human member of our Trust & Safety team within 24 hours. Violations result in a range of actions depending on severity: formal warning, content removal, temporary suspension, or permanent ban. Accounts banned for severe violations (fraud, explicit content, harassment) are reported to relevant authorities where required by law.",
  },
  {
    title: "ID Verification",
    body: "Members who complete government ID verification receive the Apex Verified badge. This badge signals to other members that the person is who they claim to be. ID verification is optional for general membership but required for certain premium features. ID documents are processed through an encrypted pipeline and are not retained after verification is complete.",
  },
  {
    title: "Profile Review",
    body: "Every profile submitted to Apex is reviewed by our team before it becomes visible to other members. We check for authenticity, completeness, and compliance with our Community Guidelines. Profiles that appear fake, incomplete, or in violation of our standards are rejected with feedback on what needs to change.",
  },
  {
    title: "Response Times",
    items: [
      "General safety reports: reviewed within 24 hours",
      "Urgent safety concerns (imminent harm): escalated within 2 hours",
      "Account appeals: responded to within 72 hours",
      "Law enforcement requests: handled per our Law Enforcement Guidelines",
    ],
  },
  {
    title: "Appealing a Decision",
    body: "If your account has been suspended or content removed and you believe the decision was made in error, you may appeal by emailing appeals@tryapextoday.com. Include your account email and a brief description of why you believe the decision should be reconsidered. Our team will respond within 72 hours.",
  },
  {
    title: "Contact Trust & Safety",
    body: "For safety concerns, abuse reports, or law enforcement inquiries, contact us at safety@tryapextoday.com. Do not delay reporting behavior that creates an immediate risk \u2014 for emergencies, always contact local law enforcement first.",
  },
]

export default function TrustSafetyPage() {
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
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">Trust & Safety</span>
            <h1 className="font-display text-4xl font-black text-white md:text-5xl leading-[1.06] mb-4">
              How We Keep Apex Safe
            </h1>
            <p className="text-sm text-white/35">Last updated: April 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-6 md:mx-12" />

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-2xl flex flex-col gap-10">
          {SECTIONS.map(({ title, body, items }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-3">{title}</h2>
              {body && <p className="text-sm leading-relaxed text-white/60">{body}</p>}
              {items && (
                <ul className="flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                      <span className="text-sm text-white/60">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
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
