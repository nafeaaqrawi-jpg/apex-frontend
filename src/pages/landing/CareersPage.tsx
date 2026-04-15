import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, MapPin, Zap, ShieldCheck, Heart, Star } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const PERKS = [
  { icon: <Zap size={18} />, title: 'Equity from day one', body: "Meaningful founder-level equity. You're building this with us." },
  { icon: <MapPin size={18} />, title: 'Fully remote', body: 'Work from anywhere. We care about output, not office attendance.' },
  { icon: <Heart size={18} />, title: 'Health coverage', body: 'Full medical, dental, and vision. We take care of our people.' },
  { icon: <ShieldCheck size={18} />, title: 'Top-tier comp', body: '$140K\u2013$200K base depending on experience. Competitive by any standard.' },
]

const REQUIREMENTS = [
  '5+ years of professional software engineering experience',
  'Deep expertise in Node.js, TypeScript, and modern backend architecture',
  'Strong opinions about PostgreSQL, indexing, and query performance',
  'Experience with real-time systems (WebSockets, Socket.io, or similar)',
  'Track record of shipping production systems that people actually use',
  'Startup instincts — you optimize for speed without creating debt',
]

const NICE_TO_HAVE = [
  'Experience with React and full-stack ownership',
  'Familiarity with Drizzle ORM or similar query builders',
  'Background in consumer products (especially social or marketplace)',
  'Strong security instincts — you think about OWASP before someone asks',
  'Experience scaling from 0 → 100K users',
]

const ABOUT_ROLE = [
  "You will be the second engineer on a team building a category-defining premium dating platform. This isn't another swipe app — Apex is built around trust, credentials, and real compatibility.",
  "You'll own large parts of the product end-to-end: backend architecture, API design, database performance, real-time messaging, matching logic, and infrastructure. You'll work directly with the founder, move fast, and leave your fingerprints on everything.",
  "We're pre-Series A, growing fast, and building toward a Match Group acquisition at $10\u201350M. The engineering bar is high and the opportunity is real.",
]

export default function CareersPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0d0521' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/8">
        <Link to="/">
          <ApexLogo size={26} showText variant="white" />
        </Link>
        <Link
          to="/register"
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-purple-700 transition-all hover:scale-[1.02]"
        >
          Apply to join
        </Link>
      </nav>

      {/* Back link */}
      <div className="px-6 pt-8 md:px-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Apex
        </Link>
      </div>

      {/* Hero */}
      <section className="px-6 pt-12 pb-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 mb-6">
              <Star size={10} className="fill-purple-400 text-purple-400" />
              We're hiring
            </span>
            <h1 className="font-display text-4xl font-black text-white md:text-6xl leading-[1.06] mb-6">
              Founding Engineer
            </h1>
            <div className="flex flex-wrap gap-3 mb-8">
              {['Full-time', 'Remote', '$140K–$200K + Equity', 'Engineering'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href="mailto:nafea@tryapextoday.com?subject=Founding Engineer Application"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-900/50 transition-all hover:scale-[1.02] hover:shadow-purple-800/60"
            >
              Apply now
              <ArrowRight size={16} />
            </a>
            <p className="mt-3 text-xs text-white/30">
              Send your resume, GitHub, and a short note on what you'd build first.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-6 md:mx-12" />

      {/* Main content */}
      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl flex flex-col gap-16">

          {/* About the role */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6">
              About the role
            </h2>
            <div className="flex flex-col gap-4">
              {ABOUT_ROLE.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-white/65">
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          {/* What you'll do */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6">
              What you'll own
            </h2>
            <div className="flex flex-col gap-3">
              {[
                'Backend architecture: Node.js + Express + Drizzle ORM + Neon PostgreSQL',
                'Matching algorithm: compatibility scoring, relocation-aware ranking, daily curation logic',
                'Real-time systems: Socket.io messaging, presence, typing indicators',
                'AI integration: natural language search, coach features, embedding pipelines',
                'Auth and security: JWT, rate limiting, OWASP compliance',
                'Infrastructure: Railway deployments, Neon DB, Cloudinary, monitoring',
                'Performance: query optimization, caching strategy, sub-100ms API responses',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                  <p className="text-sm leading-relaxed text-white/65">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6">
              Requirements
            </h2>
            <div className="flex flex-col gap-3">
              {REQUIREMENTS.map((req, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/30" />
                  <p className="text-sm leading-relaxed text-white/65">{req}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Nice to have */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6">
              Nice to have
            </h2>
            <div className="flex flex-col gap-3">
              {NICE_TO_HAVE.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/20" />
                  <p className="text-sm leading-relaxed text-white/50">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Perks */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6">
              What you get
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PERKS.map(({ icon, title, body }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"
                >
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                    {icon}
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{title}</p>
                  <p className="text-xs leading-relaxed text-white/45">{body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stack */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6">
              The stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                'Node.js', 'TypeScript', 'Express', 'Drizzle ORM', 'Neon PostgreSQL',
                'Socket.io', 'React 18', 'Vite', 'Tailwind CSS', 'Framer Motion',
                'Railway', 'Vercel', 'Cloudinary', 'OpenAI API', 'Zod',
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/55"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-[24px] border border-purple-500/20 bg-purple-500/8 p-8 text-center"
          >
            <h3 className="font-display text-2xl font-black text-white mb-3">
              Ready to build something real?
            </h3>
            <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
              We move fast, we ship real things, and we're building toward an exit that rewards everyone who got here early.
            </p>
            <a
              href="mailto:nafea@tryapextoday.com?subject=Founding Engineer Application"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.02]"
            >
              Send your application
              <ArrowRight size={16} />
            </a>
            <p className="mt-4 text-xs text-white/25">
              nafea@tryapextoday.com · We read every application personally.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
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
