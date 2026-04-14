import { type ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApexLogo from '../ui/ApexLogo'

const TAGLINES = [
  'Finally, people worth your time.',
  'Where ambition meets authenticity.',
  'Your intellectual match is here.',
  'Built for people going places.',
]

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

// Pre-computed floating orb configs so they're stable across renders
const ORB_CONFIGS = [
  { size: 420, top: '-10%', right: '-15%', delay: 0, duration: 8 },
  { size: 360, bottom: '-15%', left: '-12%', delay: 2, duration: 10 },
  { size: 280, top: '35%', left: '50%', delay: 1, duration: 12 },
] as const

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const [taglineIdx, setTaglineIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIdx((i) => (i + 1) % TAGLINES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-purple-900 to-[#0d0620] flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {ORB_CONFIGS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              background: i === 0
                ? 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)'
                : i === 1
                ? 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 70%)',
              top: 'top' in orb ? orb.top : undefined,
              bottom: 'bottom' in orb ? orb.bottom : undefined,
              left: 'left' in orb ? orb.left : undefined,
              right: 'right' in orb ? orb.right : undefined,
            }}
            animate={{ scale: [1, 1.12, 0.96, 1.08, 1], opacity: [0.7, 1, 0.8, 1, 0.7] }}
            transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <ApexLogo size={40} showText={true} variant="white" />
          </Link>
          <div className="h-6 mt-3 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIdx}
                className="text-white/60 text-sm font-medium tracking-wide italic"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                {TAGLINES[taglineIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          className="bg-white/[0.97] rounded-3xl shadow-2xl shadow-black/40 px-8 pt-8 pb-10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent rounded-full" />
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {children}
        </motion.div>

        {/* Bottom text */}
        <p className="text-center text-white/30 text-xs mt-6 leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-white/50 underline underline-offset-2 cursor-pointer hover:text-white/70 transition-colors">Terms of Service</span>
          {' '}and{' '}
          <span className="text-white/50 underline underline-offset-2 cursor-pointer hover:text-white/70 transition-colors">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  )
}
