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

  const newConnectionCount = matches?.filter((m) => !m.lastMessage).length ?? 0
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
    <NavLink
      key={to}
      to={to}
      className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
    >
      {({ isActive }) => (
        <>
          {/* Sliding background pill */}
          {isActive && (
            <motion.div
              layoutId="nav-pill"
              className="absolute inset-0 rounded-xl bg-purple-50"
              transition={{ type: 'spring', stiffness: 500, damping: 38 }}
            />
          )}

          <motion.div
            className="relative z-10 p-1.5 rounded-xl"
            whileTap={{ scale: 0.78 }}
            transition={{ type: 'spring', stiffness: 600, damping: 20 }}
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.18, 0.95, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 0.38, times: [0, 0.25, 0.55, 0.75, 1] }}
              key={isActive ? 'active' : 'inactive'}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? 'text-purple-600' : 'text-gray-400'}
              />
            </motion.div>

            {/* Badge */}
            <AnimatePresence>
              {badge && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none"
                >
                  {badgeCount > 9 ? '9+' : badgeCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.span
            animate={{
              color: isActive ? '#7c3aed' : '#9ca3af',
              fontWeight: isActive ? 600 : 500,
            }}
            transition={{ duration: 0.18 }}
            className="text-[10px] relative z-10"
          >
            {label}
          </motion.span>
        </>
      )}
    </NavLink>
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-4 h-16">
        {leftItems.map(renderNavItem)}

        {/* Center — Apex logo button */}
        <NavLink
          to="/rizzassist"
          className="flex flex-col items-center gap-0.5 px-2 py-1"
        >
          {({ isActive }) => (
            <>
              <motion.div
                whileTap={{ scale: 0.82 }}
                transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-600 to-violet-600 shadow-lg shadow-purple-200'
                    : 'bg-gradient-to-br from-purple-500 to-violet-500 shadow-md shadow-purple-100'
                }`}
                animate={isActive ? { scale: [1, 1.12, 0.96, 1] } : {}}
                key={isActive ? 'center-active' : 'center-inactive'}
              >
                {/* Glow pulse ring when active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-purple-500 opacity-30"
                    animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
                <ApexLogo showText={false} size={26} variant="white" />
              </motion.div>
              <motion.span
                animate={{ color: isActive ? '#7c3aed' : '#9ca3af' }}
                transition={{ duration: 0.18 }}
                className="text-[10px] font-medium"
              >
                AI
              </motion.span>
            </>
          )}
        </NavLink>

        {rightItems.map(renderNavItem)}
      </div>
    </nav>
  )
}
