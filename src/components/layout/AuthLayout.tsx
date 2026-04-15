import { type ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Sparkles, GraduationCap } from 'lucide-react'
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

// Hinge-style: split title into chars and animate each
function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="font-display text-[2.1rem] leading-tight text-[#1a1620] overflow-hidden">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.25 + i * 0.025,
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </h1>
  )
}

// Pre-computed floating orb configs
const ORB_CONFIGS = [
  { size: 500, top: '-15%', right: '-20%', delay: 0, duration: 9 },
  { size: 400, bottom: '-18%', left: '-15%', delay: 2.5, duration: 11 },
  { size: 320, top: '30%', left: '45%', delay: 1.2, duration: 13 },
  { size: 200, top: '65%', right: '10%', delay: 3, duration: 8 },
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
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(145deg, #0e0b14 0%, #1c1029 38%, #3b1680 72%, #5b21b6 100%)' }}
    >
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {ORB_CONFIGS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              background: i === 0
                ? 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 68%)'
                : i === 1
                ? 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 68%)'
                : i === 2
                ? 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 68%)'
                : 'radial-gradient(circle, rgba(180,83,9,0.10) 0%, transparent 68%)',
              top: 'top' in orb ? orb.top : undefined,
              bottom: 'bottom' in orb ? orb.bottom : undefined,
              left: 'left' in orb ? orb.left : undefined,
              right: 'right' in orb ? orb.right : undefined,
            }}
            animate={{
              scale: [1, 1.14, 0.94, 1.08, 1],
              opacity: [0.6, 1, 0.7, 0.95, 0.6],
            }}
            transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Bottom glow */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-full"
          style={{ background: 'radial-gradient(ellipse at center bottom, rgba(91,33,182,0.35) 0%, transparent 70%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ApexLogo size={40} showText={true} variant="white" />
            </motion.div>
          </Link>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: <ShieldCheck size={11} />, label: 'Verified-first' },
              { icon: <GraduationCap size={11} />, label: 'Campus to city' },
              { icon: <Sparkles size={11} />, label: 'Curated daily' },
            ].map(({ icon, label }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white/70 backdrop-blur"
              >
                {icon}
                {label}
              </motion.span>
            ))}
          </div>

          <div className="h-6 mt-3 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIdx}
                className="text-white/60 text-xs font-medium tracking-widest uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.38, ease: 'easeInOut' }}
              >
                {TAGLINES[taglineIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          className="relative rounded-[28px] overflow-hidden"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          style={{
            boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)',
          }}
        >
          {/* Card inner */}
          <div className="bg-white/[0.97] px-8 pb-9 pt-7 backdrop-blur-sm">
            {/* Purple top accent */}
            <div className="absolute left-8 right-8 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

            <div className="mb-6">
              <AnimatedTitle text={title} />
              {subtitle && (
                <motion.p
                  className="mt-2 text-sm text-gray-400 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
            {children}
          </div>
        </motion.div>

        {/* Footer legal */}
        <motion.p
          className="mt-5 text-center text-[11px] leading-relaxed text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          By continuing, you agree to our{' '}
          <Link to="/terms" className="text-white/50 underline underline-offset-2 hover:text-white/70 transition-colors">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-white/50 underline underline-offset-2 hover:text-white/70 transition-colors">Privacy Policy</Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
