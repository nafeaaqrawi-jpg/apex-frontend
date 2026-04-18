import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const SECTIONS = [
  {
    title: "Applicability",
    body: "This Consumer Health Data Privacy Policy applies to residents of Washington State under the My Health MY Data Act (MHMD Act, SB 1155), effective March 31, 2024. It describes how Apex may process consumer health data, your rights regarding that data, and how to exercise those rights.",
  },
  {
    title: "What Is Consumer Health Data?",
    body: "Under the MHMD Act, \u201cconsumer health data\u201d means personal information that is linked or reasonably linkable to a consumer and that identifies a consumer\u2019s past, present, or future physical or mental health status. This includes a broad range of categories such as health conditions, medical history, reproductive health information, and more.",
  },
  {
    title: "What Health-Adjacent Data Apex Collects",
    body: "Apex does not operate as a health platform and does not intentionally collect medical or clinical health information. The only potentially health-adjacent data we may collect is information that you voluntarily include in your profile, such as fitness activities, gym habits, or general wellness preferences. This information is provided solely by you, is visible on your profile to other members per your privacy settings, and is not used for health-related purposes by Apex.",
  },
  {
    title: "What We Do Not Collect",
    items: [
      "Medical records or clinical health data",
      "Reproductive or fertility information",
      "Prescription or medication data",
      "Mental health diagnoses or treatment records",
      "Precise geolocation derived from health-related activities",
      "Genetic data",
      "Biometric identifiers for the purpose of health monitoring",
    ],
  },
  {
    title: "How We Use Health-Adjacent Data",
    body: "Any health-adjacent information you voluntarily include in your profile (such as \u201cI run 30 miles a week\u201d or \u201cI\u2019m a fitness enthusiast\u201d) is used exclusively to represent you to other members and to inform compatibility matching. This data is not sold, licensed, or shared with health insurers, employers, pharmaceutical companies, or data brokers.",
  },
  {
    title: "Your Rights (Washington Residents)",
    items: [
      "Right to know what consumer health data we have collected about you",
      "Right to access a copy of your consumer health data",
      "Right to delete your consumer health data",
      "Right to withdraw consent for collection or sharing",
      "Right not to be discriminated against for exercising these rights",
    ],
  },
  {
    title: "How to Exercise Your Rights",
    body: "To exercise any of the rights listed above, email privacy@tryapextoday.com from the email address associated with your Apex account. Include \u201cWashington Health Data Request\u201d in the subject line. We will respond within 45 days as required by the MHMD Act. We may need to verify your identity before processing your request.",
  },
  {
    title: "No Geofencing",
    body: "Apex does not use geofencing or location-based technology to collect health data near sensitive locations (medical facilities, pharmacies, reproductive health clinics, etc.) as prohibited by the MHMD Act.",
  },
  {
    title: "Contact",
    body: "For questions about this policy or our data practices, contact privacy@tryapextoday.com.",
  },
]

export default function ConsumerHealthDataPage() {
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
            <h1 className="font-display text-3xl font-black text-white md:text-4xl leading-[1.1] mb-4">
              Consumer Health Data Privacy Policy
            </h1>
            <p className="text-sm text-white/35">Last updated: April 2026 \u00b7 Effective: March 31, 2024</p>
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
              transition={{ duration: 0.45, delay: i * 0.04 }}
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
