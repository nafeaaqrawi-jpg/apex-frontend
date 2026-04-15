import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, GraduationCap, ShieldCheck, MapPin, Star } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const PROFILES = [
  {
    name: 'Sofia C.',
    age: 24,
    school: 'Stanford',
    role: 'Pre-med \u2192 UCSF',
    gpa: '3.9',
    location: 'Bay Area \u2192 NYC',
    photoId: '1529626455594-4ff0802cfb7e',
    verified: true,
  },
  {
    name: 'James P.',
    age: 25,
    school: 'Harvard',
    role: 'Goldman Sachs Analyst',
    gpa: '3.8',
    location: 'NYC',
    photoId: '1507003211169-0a1dd7228f2d',
    verified: true,
  },
  {
    name: 'Priya S.',
    age: 23,
    school: 'MIT',
    role: 'ML Research',
    gpa: '3.95',
    location: 'Boston \u2192 SF',
    photoId: '1494790108377-be9c29b29330',
    verified: true,
  },
  {
    name: 'Marcus R.',
    age: 26,
    school: 'Wharton',
    role: 'Private Equity',
    gpa: '3.7',
    location: 'NYC',
    photoId: '1472099645785-5658abf4ff4e',
    verified: true,
  },
  {
    name: 'Aisha K.',
    age: 24,
    school: 'Georgetown',
    role: 'Georgetown Law \u201926',
    gpa: '3.85',
    location: 'DC \u2192 NYC',
    photoId: '1531746020798-e6953c6e8e04',
    verified: true,
  },
  {
    name: 'Tyler B.',
    age: 25,
    school: 'Columbia',
    role: 'Software Engineer',
    gpa: '3.6',
    location: 'NYC',
    photoId: '1500648767791-00dcc994a43e',
    verified: true,
  },
]

const STATS = [
  { value: '2,400+', label: 'Verified members' },
  { value: '47+', label: 'Universities represented' },
  { value: '84%', label: 'Report higher quality matches' },
  { value: '12', label: 'Avg. days to first connection' },
]

const SCHOOLS = [
  'Harvard', 'Stanford', 'MIT', 'Wharton', 'Columbia', 'Georgetown',
  'Yale', 'Princeton', 'Duke', 'UChicago', 'Northwestern', 'Cornell',
]

export default function MembersPage() {
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
          Join free
        </Link>
      </nav>

      {/* Back */}
      <div className="px-6 pt-8 md:px-12">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors">
          <ArrowLeft size={14} />
          Back to Apex
        </Link>
      </div>

      {/* Hero */}
      <section className="px-6 pt-12 pb-16 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 mb-6">
              <Star size={10} className="fill-purple-400 text-purple-400" />
              2,400+ verified members
            </span>
            <h1 className="font-display text-4xl font-black text-white md:text-6xl leading-[1.06] mb-5">
              The most ambitious people
              <br />
              <span className="text-white/30">you\u2019ve never met.</span>
            </h1>
            <p className="text-base leading-relaxed text-white/55 max-w-xl mx-auto mb-8">
              Every Apex member is verified, credentialed, and here for something real. This is who you\u2019ll connect with.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-900/50 transition-all hover:scale-[1.02]"
            >
              Apply to join
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#0f0826' }} className="border-y border-white/[0.06] py-12">
        <div className="mx-auto max-w-4xl grid grid-cols-2 gap-8 px-8 md:grid-cols-4">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="text-center"
            >
              <div className="font-display text-4xl font-black text-white">{value}</div>
              <div className="mt-1 text-sm text-white/40">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Profile grid */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">Sample profiles</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center font-display text-3xl font-black text-white md:text-4xl"
          >
            Who you\u2019ll find on Apex.
          </motion.h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {PROFILES.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-[24px] border border-white/[0.07] bg-white/[0.03] overflow-hidden"
              >
                <div className="relative h-56 bg-gray-800 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${p.photoId}?w=400&h=260&fit=crop&crop=face`}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {p.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-blue-700">
                        <ShieldCheck size={9} className="text-blue-500" />
                        ID Verified
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                      <GraduationCap size={9} className="text-emerald-500" />
                      {p.school}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="text-[15px] font-bold text-white">{p.name}, {p.age}</p>
                    {p.gpa && (
                      <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 rounded-full px-2 py-0.5">
                        {p.gpa} GPA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mb-1">{p.role}</p>
                  <div className="flex items-center gap-1 text-[10px] text-white/30">
                    <MapPin size={9} />
                    {p.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-white/25">
            Sample profiles shown for illustration. Real members are verified and curated.
          </p>
        </div>
      </section>

      {/* Schools */}
      <section style={{ background: '#0f0826' }} className="border-y border-white/[0.06] py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400 block mb-8">
            Universities represented
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {SCHOOLS.map((school) => (
              <span
                key={school}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/55"
              >
                {school}
              </span>
            ))}
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/30">
              +35 more
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md"
        >
          <h2 className="font-display text-3xl font-black text-white mb-4">
            Ready to join them?
          </h2>
          <p className="text-sm text-white/45 mb-8">
            It\u2019s free to join. Apply today and get access to the most curated member base in dating.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.02]"
          >
            Apply to join free
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
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
