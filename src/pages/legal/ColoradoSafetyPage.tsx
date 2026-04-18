import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const RESOURCES = [
  { name: "Colorado Crisis Services", contact: "1-844-493-8255 | coloradocrisisservices.org" },
  { name: "National Domestic Violence Hotline", contact: "1-800-799-7233 | thehotline.org" },
  { name: "Colorado Legal Services", contact: "coloradolegalservices.org" },
  { name: "RAINN Sexual Assault Hotline", contact: "1-800-656-4673 | rainn.org" },
  { name: "Colorado Attorney General \u2014 Consumer Protection", contact: "coag.gov/consumer-protection" },
  { name: "Emergency Services", contact: "911" },
]

const SECTIONS = [
  {
    title: "Colorado Consumer Protection Act (CPA)",
    body: "Apex complies with the Colorado Privacy Act (CPA), effective July 1, 2023. Colorado residents have the right to: access personal data we hold about them; correct inaccurate personal data; delete personal data provided by or obtained about them; data portability; opt out of targeted advertising; opt out of the sale of personal data; opt out of automated decision-making in certain circumstances.",
  },
  {
    title: "How to Exercise Your Colorado Rights",
    body: "To exercise any of these rights, email privacy@tryapextoday.com with your request. Include \u201cColorado Privacy Request\u201d in the subject line. We will respond within 45 days as required by the CPA. We may request identity verification before processing your request. If we decline your request, you have the right to appeal our decision by emailing appeals@tryapextoday.com.",
  },
  {
    title: "No Sale of Personal Data",
    body: "Apex does not sell personal data as defined by the Colorado Privacy Act. We do not share your data with third parties for monetary compensation. Our analytics provider (Vercel Analytics) processes aggregate, anonymized performance metrics only and does not receive personal profiles or identifying information.",
  },
  {
    title: "No Targeted Advertising",
    body: "Apex does not use your personal data for targeted advertising by third parties. We do not operate a behavioral advertising system. No data you provide to Apex is used to serve you ads on other platforms.",
  },
  {
    title: "Dating Safety for Colorado Residents",
    body: "Colorado has specific resources and legal protections for online dating platform users. If you experience harassment, stalking, or any safety concern originating from a connection made on Apex, you are encouraged to report it both within the app and to local law enforcement. Colorado Revised Statutes \u00a7 18-3-602 covers stalking; \u00a7 18-9-111 covers harassment. Apex will cooperate fully with law enforcement requests made pursuant to legal process.",
  },
  {
    title: "Colorado Protective Orders",
    body: "If you have a restraining order or protective order against someone you believe may be attempting to contact you through Apex, contact safety@tryapextoday.com immediately. We will take prompt action, including account investigation and law enforcement notification if appropriate, upon receipt of supporting documentation.",
  },
  {
    title: "Age Verification",
    body: "Apex strictly enforces an 18+ age requirement. Colorado residents who encounter what appears to be an underage user are encouraged to report the profile immediately using the in-app report function or by emailing safety@tryapextoday.com.",
  },
]

export default function ColoradoSafetyPage() {
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
              Colorado Safety Policy
            </h1>
            <p className="text-base leading-relaxed text-white/55 max-w-xl mb-2">
              Information for Colorado residents regarding your privacy rights, safety resources, and how Apex complies with Colorado law.
            </p>
            <p className="text-sm text-white/35">Last updated: April 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-6 md:mx-12" />

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-2xl flex flex-col gap-10">
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

      <section style={{ background: '#0f0826' }} className="border-y border-white/[0.06] px-6 py-16 md:px-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6 flex items-center gap-2">
            <Phone size={12} />
            Colorado Safety Resources
          </h2>
          <div className="flex flex-col gap-3">
            {RESOURCES.map(({ name, contact }) => (
              <div key={name} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-sm text-purple-400 font-mono text-right">{contact}</p>
              </div>
            ))}
          </div>
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
