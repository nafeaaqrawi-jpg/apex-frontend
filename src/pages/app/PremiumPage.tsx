import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Crown, Eye, Search, Star, TrendingUp, Zap } from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'

const FEATURES = [
  {
    icon: Eye,
    title: 'See who viewed your profile',
    description: 'Know exactly who is looking — and when.',
    free: false,
  },
  {
    icon: Search,
    title: 'Unlimited AI search',
    description: 'No daily limits on natural language search.',
    free: false,
  },
  {
    icon: Star,
    title: 'Priority in discover feed',
    description: 'Your profile surfaces first to compatible people.',
    free: false,
  },
  {
    icon: TrendingUp,
    title: 'Full compatibility breakdown',
    description: 'See your match score and what drives it.',
    free: false,
  },
  {
    icon: Zap,
    title: 'Message anyone first',
    description: 'Send an intro to anyone, even before they express interest.',
    free: false,
  },
  {
    icon: Crown,
    title: 'Apex Premium badge',
    description: 'A signal of seriousness. Visible on your profile.',
    free: false,
  },
]

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '$7', period: '/mo', badge: undefined as string | undefined, popular: false },
  { id: 'annual', label: 'Annual', price: '$5', period: '/mo', badge: 'Save 29%' as string | undefined, popular: true },
]

export default function PremiumPage() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual')


  const handleUpgrade = () => {
    alert(`Payment coming soon — ${selectedPlan === 'annual' ? '$5/mo (Annual)' : '$7/mo (Monthly)'}. We'll notify you when billing goes live.`)
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white pb-32">
        {/* Hero */}
        <div className="relative overflow-hidden px-5 pt-6 pb-10 bg-gradient-to-br from-[#1a0533] via-[#2d0a5e] to-[#1a0533]">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(139,92,246,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(109,40,217,0.3) 0%, transparent 50%)' }}
          />
          <button
            onClick={() => navigate(-1)}
            className="relative mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="relative text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-1.5 mb-4"
            >
              <Crown size={14} className="text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Apex Premium</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-3xl font-bold text-white leading-tight"
            >
              The top of the<br />food chain.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 text-sm leading-relaxed text-white/60 max-w-xs mx-auto"
            >
              Less than a coffee. Built for people serious about what they're looking for.
            </motion.p>
          </div>
        </div>

        <div className="px-5 pt-6">
          {/* Plan selector */}
          <div className="grid grid-cols-2 gap-2 mb-8">
            {PLANS.map((plan) => (
              <motion.button
                key={plan.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPlan(plan.id as 'monthly' | 'annual')}
                className={`relative flex flex-col items-center rounded-2xl border-2 p-3 transition-all ${
                  selectedPlan === plan.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-purple-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    {plan.badge}
                  </span>
                )}
                <span className="text-[11px] font-semibold text-gray-500 mt-1">{plan.label}</span>
                <span className="text-xl font-bold text-gray-900 mt-1">{plan.price}</span>
                <span className="text-[10px] text-gray-400">{plan.period}</span>
              </motion.button>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            onClick={() => void handleUpgrade()}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 py-4 text-base font-bold text-white shadow-lg shadow-purple-200 transition-all hover:from-purple-700 hover:to-violet-700"
          >
            {`Upgrade — ${selectedPlan === 'monthly' ? '$7/mo' : '$5/mo (Annual)'}`}
          </motion.button>
          <p className="mt-2 text-center text-xs text-gray-400">Cancel anytime. No commitment.</p>

          {/* Features */}
          <div className="mt-8">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">What you unlock</p>
            <div className="space-y-3">
              {FEATURES.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 * idx, ease: 'easeOut' }}
                    className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50">
                      <Icon size={18} className="text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{feature.description}</p>
                    </div>
                    <Check size={16} className="mt-0.5 flex-shrink-0 text-purple-500" />
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-6 rounded-2xl bg-gray-50 px-5 py-4">
            <p className="text-xs font-semibold text-gray-900">"Within two weeks of upgrading I had three real conversations with people I'd been hoping to match with."</p>
            <p className="mt-1.5 text-xs text-gray-400">— Premium member, University of Michigan</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
