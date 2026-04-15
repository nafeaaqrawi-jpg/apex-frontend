import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, ShieldCheck, Key, AlertTriangle } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const MEASURES = [
  {
    icon: <Lock size={18} />,
    title: "Data Encryption",
    body: "All data transmitted between your device and Apex servers is encrypted using TLS 1.3. Data stored in our databases is encrypted at rest using AES-256. This includes personal profile data, messages, and credentials.",
  },
  {
    icon: <Key size={18} />,
    title: "Authentication Security",
    body: "Passwords are hashed using bcrypt with a cost factor that makes brute-force attacks computationally infeasible. Authentication tokens are issued as short-lived JWTs stored in httpOnly cookies \u2014 inaccessible to JavaScript and immune to XSS attacks. We do not store passwords in plaintext anywhere.",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Rate Limiting & DDoS Protection",
    body: "All API endpoints are rate-limited to prevent brute-force attacks, credential stuffing, and denial-of-service attempts. Authentication endpoints have stricter limits. IP-based blocking is applied automatically to sources exhibiting attack patterns.",
  },
  {
    icon: <AlertTriangle size={18} />,
    title: "OWASP Compliance",
    body: "Apex is developed following the OWASP Top 10 security guidelines. We conduct regular reviews for injection vulnerabilities (SQL, XSS, CSRF), broken access control, insecure deserialization, and misconfigured security headers. Helmet.js is used to set appropriate HTTP security headers on every response.",
  },
]

const SECTIONS = [
  {
    title: "Third-Party Security",
    body: "Apex relies on industry-leading infrastructure providers: Neon (PostgreSQL database), Railway (backend hosting), Vercel (frontend hosting), and Cloudinary (image storage). Each provider maintains their own rigorous security certifications (SOC 2, ISO 27001). We conduct due diligence on all third-party vendors handling user data.",
  },
  {
    title: "ID Verification Security",
    body: "Government IDs submitted for identity verification are transmitted over TLS, processed by our secure verification pipeline, and not retained in raw form after verification is complete. A verification status record is stored in your account. We do not share ID images with third parties.",
  },
  {
    title: "Responsible Disclosure",
    body: "We welcome responsible disclosure of security vulnerabilities. If you believe you\u2019ve found a security issue in Apex, please email security@tryapextoday.com with a clear description of the vulnerability, steps to reproduce, and your contact information. Do not publicly disclose vulnerabilities before giving us a reasonable opportunity to respond (minimum 90 days). We will acknowledge your report within 48 hours and keep you informed of our progress.",
  },
  {
    title: "Data Minimization",
    body: "We collect only the data necessary to provide Apex\u2019s services. We do not collect sensitive health data, financial data, or location data beyond what you explicitly provide in your profile. We do not run third-party advertising trackers. See our Privacy Policy for a complete data inventory.",
  },
  {
    title: "Security Contact",
    body: "For all security-related inquiries, responsible disclosures, or to report an active vulnerability, contact security@tryapextoday.com. For general privacy concerns, use hello@tryapextoday.com.",
  },
]

export default function SecurityPage() {
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
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-4 block">Security</span>
            <h1 className="font-display text-4xl font-black text-white md:text-5xl leading-[1.06] mb-4">
              How We Protect Your Data
            </h1>
            <p className="text-base leading-relaxed text-white/55 max-w-xl mb-2">
              Security is not an afterthought at Apex. It is built into every layer of the product from day one.
            </p>
            <p className="text-sm text-white/35">Last updated: April 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-6 md:mx-12" />

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-14">
            {MEASURES.map(({ icon, title, body }, i) => (
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
