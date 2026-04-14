import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, GraduationCap, Heart, Target, Users, Zap } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const VALUES = [
  {
    icon: <GraduationCap size={20} />,
    title: 'Intellectual compatibility first',
    body: "We believe the most important attraction is intellectual. Apex surfaces credentials and achievements because we think ambition is one of the most attractive qualities a person can have.",
  },
  {
    icon: <Heart size={20} />,
    title: 'Depth over volume',
    body: "Swiping through 200 profiles a day is exhausting and dehumanizing. Apex is designed to slow down — curated matches, intentional connections, and an intro note before every like.",
  },
  {
    icon: <Target size={20} />,
    title: 'The full picture',
    body: "You're not just a face. You're your education, career, values, interests, gym stats, and where you're going. Apex profiles are built to show all of it.",
  },
  {
    icon: <Users size={20} />,
    title: 'Accountability',
    body: "Every Apex user is email-verified. Photo verification is required at signup. ID verification is available for the Apex Verified badge. No bots. No ghosts. Real people.",
  },
  {
    icon: <Zap size={20} />,
    title: 'Relocation-aware',
    body: "For ambitious people, the right person might be in a different city — or moving to the same one. Our search understands current location, work location, and future plans.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-gray-100 px-5 py-4 md:px-10">
        <Link to="/">
          <ApexLogo size={28} showText={true} variant="default" />
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
            Sign in
          </Link>
          <Link to="/register" className="rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-purple-200 hover:shadow-purple-300 transition-all">
            Get started
          </Link>
        </div>
      </nav>

      {/* Back link */}
      <div className="px-5 pt-5 md:px-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>

      {/* Hero */}
      <section className="relative px-5 pb-16 pt-10 text-center md:px-10 md:pt-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-purple-50 opacity-60 blur-[80px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-3xl"
        >
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.25em] text-purple-600">Our mission</span>
          <h1 className="font-display text-4xl font-black text-gray-900 md:text-6xl">
            Dating for people who
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              take their future seriously.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-500">
            Apex was built from a simple frustration: the best apps for meeting people are designed for mass-market entertainment, not genuine connection. We built something different.
          </p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="border-y border-gray-100 bg-gray-50 px-5 py-16 md:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-5 text-2xl font-bold text-gray-900 md:text-3xl">The problem we&apos;re solving</h2>
          <div className="space-y-4 text-base leading-relaxed text-gray-500">
            <p>
              The average person spends 5.2 hours per week on dating apps and rates their satisfaction with those apps lower every year. The apps are optimized for engagement — not for helping you find someone.
            </p>
            <p>
              For high-achieving people — students at top universities, young professionals with real careers, people who train hard, think deeply, and live intentionally — the mainstream apps are borderline insulting. You&apos;re reduced to a face and a first name.
            </p>
            <p>
              Apex is built on a different premise: the most important compatibility signals are intellectual, professional, and values-based. We surface all of them — credentials, career, interests, gym stats, relationship goals, where you live and where you&apos;re going.
            </p>
            <p>
              We&apos;re not building the biggest dating app. We&apos;re building the best one for a very specific kind of person. If that&apos;s you, you&apos;ll feel it immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-5xl px-5 py-20 md:px-10">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">What we believe</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                {icon}
              </div>
              <h3 className="mb-2 text-[15px] font-bold text-gray-900">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-br from-purple-600 to-violet-600 px-5 py-16 text-center md:px-10">
        <h2 className="font-display text-3xl font-black text-white md:text-5xl">
          Ready to meet your match?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-white/80">
          Join the platform built for driven people. Free to start.
        </p>
        <Link
          to="/register"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-purple-700 shadow-xl transition-all hover:scale-[1.02]"
        >
          Create your profile
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to="/">
            <ApexLogo size={22} showText={true} variant="default" />
          </Link>
          <div className="flex flex-wrap justify-center gap-5 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link to="/community-guidelines" className="hover:text-gray-900 transition-colors">Community Guidelines</Link>
            <a href="mailto:hello@apex-social.com" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-gray-400">© 2026 Apex</p>
        </div>
      </footer>
    </div>
  )
}
