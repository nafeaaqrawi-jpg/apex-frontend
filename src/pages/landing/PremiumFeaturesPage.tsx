import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Star, Zap } from 'lucide-react'
import ApexLogo from '../../components/ui/ApexLogo'

const FREE_FEATURES = [
  'Browse verified profiles',
  'Daily curated drop (3 profiles)',
  'Send intro notes (5 per week)',
  'Basic keyword search',
  'AI coach (limited)',
  'Email + school verification',
]

const PREMIUM_FEATURES = [
  'Unlimited intro notes',
  'Read receipts on every message',
  'See who viewed your profile',
  'Unlimited AI-powered search',
  'Priority placement in daily drops',
  'Relocation match alerts',
  'Advanced filters (GPA, career, values)',
  'Early access to new features',
]

const PLANS = [
  { period: 'Monthly', price: '$19.99', per: '/month', savings: null },
  { period: 'Annual', price: '$12.49', per: '/month', savings: 'Save 38%', highlight: true },
]

export default function PremiumFeaturesPage() {
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
      <section className="px-6 pt-12 pb-16 md:px-12 text-center">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-300 mb-6">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              Apex Premium
            </span>
            <h1 className="font-display text-4xl font-black text-white md:text-6xl leading-[1.06] mb-5">
              For people serious about
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                finding the right person.
              </span>
            </h1>
            <p className="text-base leading-relaxed text-white/55 max-w-lg mx-auto">
              Free gets you in the door. Premium gives you every tool to find your person — faster, smarter, and with zero limits.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-2 gap-4">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30 mb-1">Free</p>
              <p className="text-2xl font-black text-white mb-6">$0</p>
              <div className="flex flex-col gap-3">
                {FREE_FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check size={13} className="mt-0.5 flex-shrink-0 text-white/30" />
                    <span className="text-sm text-white/45">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="mt-8 flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Get started free
              </Link>
            </motion.div>

            {/* Premium */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.07 }}
              className="rounded-[24px] bg-gradient-to-br from-amber-400 to-yellow-500 p-6 shadow-2xl shadow-yellow-900/30"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Zap size={12} className="text-amber-900/60" />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-900/60">Premium</p>
              </div>
              <p className="text-2xl font-black text-amber-900 mb-6">$19.99<span className="text-sm font-medium">/mo</span></p>
              <div className="flex flex-col gap-3">
                {PREMIUM_FEATURES.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check size={13} className="mt-0.5 flex-shrink-0 text-amber-800" />
                    <span className="text-sm font-medium text-amber-900">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-amber-900 py-3 text-sm font-bold text-yellow-300 transition-all hover:scale-[1.02]"
              >
                Upgrade to Premium
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing plans */}
      <section style={{ background: '#0f0826' }} className="border-y border-white/[0.06] py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400 block mb-3">Pricing</span>
          <h2 className="font-display text-3xl font-black text-white mb-12">Simple, honest pricing.</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PLANS.map(({ period, price, per, savings, highlight }) => (
              <motion.div
                key={period}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className={`relative rounded-[24px] p-6 text-left ${
                  highlight
                    ? 'border-2 border-purple-500 bg-purple-500/10'
                    : 'border border-white/[0.08] bg-white/[0.03]'
                }`}
              >
                {savings && (
                  <span className="absolute -top-3 left-4 rounded-full bg-purple-500 px-3 py-0.5 text-[10px] font-bold text-white">
                    {savings}
                  </span>
                )}
                <p className="text-sm font-bold text-white/60 mb-1">{period}</p>
                <p className="font-display text-4xl font-black text-white">
                  {price}
                  <span className="text-base font-medium text-white/40">{per}</span>
                </p>
                {period === 'Annual' && (
                  <p className="text-xs text-white/35 mt-1">Billed $149.88/year</p>
                )}
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-xs text-white/30">
            Cancel anytime. No hidden fees. Secure payment via Stripe.
          </p>
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
          <h2 className="font-display text-3xl font-black text-white mb-4">Start free. Upgrade when ready.</h2>
          <p className="text-sm text-white/45 mb-8">
            Create your profile for free and upgrade to Premium anytime from your settings.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.02]"
          >
            Get started free
            <ArrowRight size={16} />
          </Link>
        </motion.div>
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
