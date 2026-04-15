import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const COMMITMENTS = [
  {
    title: "Keyboard Navigation",
    body: "All interactive elements on Apex \u2014 buttons, links, form inputs, modals \u2014 are fully navigable via keyboard. Tab order follows a logical reading sequence. Focus states are visually distinct and meet minimum contrast ratios.",
  },
  {
    title: "Screen Reader Support",
    body: "We use semantic HTML elements and ARIA attributes to ensure compatibility with major screen readers including NVDA, JAWS, and VoiceOver. Images have descriptive alt text. Dynamic content changes are announced via ARIA live regions.",
  },
  {
    title: "Color Contrast",
    body: "Text and UI elements meet or exceed WCAG 2.1 AA color contrast requirements (minimum 4.5:1 for normal text, 3:1 for large text and UI components). We do not rely on color alone to convey information.",
  },
  {
    title: "Responsive Design",
    body: "Apex is fully functional at zoom levels up to 200% without horizontal scrolling on standard viewports. Text reflows appropriately and no functionality is lost at increased zoom levels.",
  },
  {
    title: "Form Accessibility",
    body: "All form inputs have visible, programmatically associated labels. Error messages are descriptive and linked to the relevant input field. Required fields are clearly indicated before the user submits a form.",
  },
  {
    title: "Motion & Animation",
    body: "Apex uses Framer Motion for interface animations. We respect the prefers-reduced-motion media query \u2014 users who have enabled \u201cReduce Motion\u201d on their operating system will see simplified animations or none at all.",
  },
]

const SECTIONS = [
  {
    title: "Our Standard",
    body: "Apex targets conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level. We conduct accessibility reviews during development and welcome feedback from users who encounter barriers.",
  },
  {
    title: "Known Limitations",
    body: "While we strive for full accessibility compliance, some areas of Apex are still being improved. User-generated content (profile photos, prompts) may not always have sufficient alternative text as this depends on member input. We are working on tools to prompt members to add descriptive content.",
  },
  {
    title: "Feedback & Contact",
    body: "If you encounter an accessibility barrier on Apex, we want to know. Email accessibility@tryapextoday.com with a description of the issue, the URL where you encountered it, and the assistive technology you are using. We will respond within 5 business days and work to address the issue in our next release cycle.",
  },
  {
    title: "Third-Party Content",
    body: "Apex may link to or embed content from third-party services. We are not responsible for the accessibility of third-party content but will seek to replace or supplement third-party tools that present significant accessibility barriers.",
  },
]

export default function AccessibilityPage() {
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
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">Accessibility</span>
            <h1 className="font-display text-4xl font-black text-white md:text-5xl leading-[1.06] mb-4">
              Accessibility Statement
            </h1>
            <p className="text-base leading-relaxed text-white/55 max-w-xl mb-2">
              Apex is committed to building a platform that is usable by everyone, including people with disabilities.
            </p>
            <p className="text-sm text-white/35">Last updated: April 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-6 md:mx-12" />

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-14">
            {COMMITMENTS.map(({ title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"
              >
                <p className="text-sm font-bold text-white mb-1.5">{title}</p>
                <p className="text-xs leading-relaxed text-white/50">{body}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-10">
            {SECTIONS.map(({ title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
              >
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-3">{title}</h2>
                <p className="text-sm leading-relaxed text-white/60">{body}</p>
              </motion.div>
            ))}
          </div>
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
