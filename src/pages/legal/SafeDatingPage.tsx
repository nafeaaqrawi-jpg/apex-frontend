import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Phone, AlertTriangle, Heart, Eye, MessageCircle } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const TIPS = [
  {
    icon: <Eye size={20} />,
    title: "Verify before you meet",
    body: "Look for the Apex Verified badge and school verification on a profile. Do a quick reverse image search on profile photos. Video call before a first date if you\u2019re unsure.",
  },
  {
    icon: <MessageCircle size={20} />,
    title: "Keep early conversations on Apex",
    body: "Stay on the Apex platform until you\u2019re comfortable with someone. Be cautious of anyone who pushes immediately to move off-app or share personal contact info right away.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Meet in public first",
    body: "Always meet in a well-populated public place for a first date. Coffee shops, restaurants, and public parks are ideal. Don\u2019t let anyone pressure you to change location plans.",
  },
  {
    icon: <Heart size={20} />,
    title: "Tell someone your plans",
    body: "Let a trusted friend or family member know where you\u2019re going, who you\u2019re meeting, and when you expect to be back. Share your live location with them during the date.",
  },
  {
    icon: <AlertTriangle size={20} />,
    title: "Trust your instincts",
    body: "If something feels off, it probably is. You are never obligated to continue a date or conversation that makes you uncomfortable. Leave any situation that feels unsafe.",
  },
  {
    icon: <Phone size={20} />,
    title: "Have an exit plan",
    body: "Arrange your own transportation. Don\u2019t accept rides from someone you\u2019ve just met. Have a friend ready to call with a check-in. Code words with friends can help signal you need an out.",
  },
]

const RESOURCES = [
  { name: "National Domestic Violence Hotline", contact: "1-800-799-7233 | thehotline.org" },
  { name: "RAINN Sexual Assault Hotline", contact: "1-800-656-4673 | rainn.org" },
  { name: "Crisis Text Line", contact: "Text HOME to 741741" },
  { name: "National Center for Missing & Exploited Children", contact: "1-800-843-5678 | missingkids.org" },
  { name: "FBI Internet Crime Complaint Center", contact: "ic3.gov" },
  { name: "Emergency Services", contact: "911" },
]

export default function SafeDatingPage() {
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
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">Safety</span>
            <h1 className="font-display text-4xl font-black text-white md:text-5xl leading-[1.06] mb-4">
              Safe Dating Tips
            </h1>
            <p className="text-base leading-relaxed text-white/55 max-w-xl mb-4">
              Your safety is our highest priority. Apex is built with trust and verification at its core \u2014 but no technology replaces good judgment. Read these tips before your first date.
            </p>
            <p className="text-sm text-white/35">Last updated: April 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-6 md:mx-12" />

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TIPS.map(({ icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  {icon}
                </div>
                <p className="text-sm font-bold text-white mb-1.5">{title}</p>
                <p className="text-xs leading-relaxed text-white/50">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#0f0826' }} className="border-y border-white/[0.06] px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6">Emergency Resources</h2>
          <div className="flex flex-col gap-3">
            {RESOURCES.map(({ name, contact }) => (
              <div key={name} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm font-semibold text-white">{name}</p>
                <p className="text-sm text-purple-400 font-mono">{contact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4">Report to Apex</h2>
          <p className="text-sm leading-relaxed text-white/55 mb-4">
            If you encounter behavior on Apex that concerns you, use the in-app report button on any profile or message. Our Trust & Safety team reviews every report within 24 hours. For urgent matters, email us directly.
          </p>
          <a
            href="mailto:safety@tryapextoday.com"
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2.5 text-sm font-semibold text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            safety@tryapextoday.com
          </a>
        </div>
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
