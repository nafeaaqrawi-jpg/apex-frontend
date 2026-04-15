import type React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Compass, Heart, User, Sparkles, type LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { matchesApi } from '../../api/matches'
import ApexLogo from '../ui/ApexLogo'

export default function BottomNav() {
  const location = useLocation()

  const { data: matches } = useQuery({
    queryKey: ['matches'],
    queryFn: matchesApi.getMatches,
    staleTime: 1000 * 30,
  })

  const newConnectionCount = matches?.filter((match) => !match.lastMessage).length ?? 0
  const isOnMatchesOrChat =
    location.pathname.startsWith('/matches') || location.pathname.startsWith('/chat')
  const showBadge = newConnectionCount > 0 && !isOnMatchesOrChat

  interface NavItem {
    to: string
    icon: LucideIcon
    label: string
    badge: boolean
    badgeCount: number
  }

  const leftItems: NavItem[] = [
    { to: '/discover', icon: Compass, label: 'Discover', badge: false, badgeCount: 0 },
    { to: '/search', icon: Sparkles, label: 'Search', badge: false, badgeCount: 0 },
  ]

  const rightItems: NavItem[] = [
    { to: '/matches', icon: Heart, label: 'Connections', badge: showBadge, badgeCount: newConnectionCount },
    { to: '/profile', icon: User, label: 'Profile', badge: false, badgeCount: 0 },
  ]

  const renderNavItem = ({ to, icon: Icon, label, badge, badgeCount }: NavItem): React.ReactElement => (
    <NavLink key={to} to={to} className="relative flex flex-col items-center gap-1 px-2 py-1.5">
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="nav-pill"
              className="absolute inset-0 rounded-2xl bg-white/10"
              transition={{ type: 'spring', stiffness: 500, damping: 38 }}
            />
          )}

          <motion.div
            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl"
            whileTap={{ scale: 0.82 }}
            transition={{ type: 'spring', stiffness: 600, damping: 20 }}
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.18, 0.95, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 0.38, times: [0, 0.25, 0.55, 0.75, 1] }}
              key={isActive ? 'active' : 'inactive'}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.4 : 1.85}
                className={isActive ? 'text-white' : 'text-white/50'}
              />
            </motion.div>

            <AnimatePresence>
              {badge && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                  className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#b45309] px-1 text-[10px] font-bold leading-none text-white shadow-lg shadow-[#b45309]/35"
                >
                  {badgeCount > 9 ? '9+' : badgeCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.span
            animate={{
              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.58)',
              fontWeight: isActive ? 600 : 500,
            }}
            transition={{ duration: 0.18 }}
            className="relative z-10 text-[10px]"
          >
            {label}
          </motion.span>
        </>
      )}
    </NavLink>
  )

  return (
    <nav className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 safe-bottom">
      <div className="pointer-events-auto mx-auto grid h-[76px] max-w-md grid-cols-5 items-center rounded-[30px] border border-white/12 bg-[#171420]/94 px-2 shadow-[0_28px_80px_-34px_rgba(2,6,23,0.9)] backdrop-blur-xl">
        {leftItems.map(renderNavItem)}

        <NavLink to="/rizzassist" className="flex flex-col items-center gap-1 px-1 py-1.5">
          {({ isActive }) => (
            <>
              <motion.div
                whileTap={{ scale: 0.82 }}
                transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                className={`relative flex h-12 w-12 items-center justify-center rounded-[20px] ${
                  isActive
                    ? 'bg-[linear-gradient(135deg,#ffffff_0%,#dacbff_44%,#b45309_100%)] text-[#171420] shadow-lg shadow-[#b45309]/25'
                    : 'bg-[linear-gradient(135deg,#5b21b6_0%,#8b5cf6_58%,#b45309_100%)] text-white shadow-lg shadow-[#5b21b6]/25'
                }`}
                animate={isActive ? { scale: [1, 1.12, 0.96, 1] } : {}}
                key={isActive ? 'center-active' : 'center-inactive'}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-[20px] bg-[#b45309]"
                    animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
                <ApexLogo showText={false} size={26} variant={isActive ? 'default' : 'white'} />
              </motion.div>
              <motion.span
                animate={{ color: isActive ? '#f8f1e6' : 'rgba(255,255,255,0.58)' }}
                transition={{ duration: 0.18 }}
                className="text-[10px] font-medium"
              >
                Coach
              </motion.span>
            </>
          )}
        </NavLink>

        {rightItems.map(renderNavItem)}
      </div>
    </nav>
  )
}
