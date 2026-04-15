import { useEffect, useRef, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Cpu, Settings2 } from 'lucide-react'
import BottomNav from './BottomNav'
import ApexLogo from '../ui/ApexLogo'
import { telemetryApi } from '../../api/telemetry'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const lastTrackedPathRef = useRef<string | null>(null)

  useEffect(() => {
    const routeKey = `${location.pathname}${location.search}`
    if (lastTrackedPathRef.current === routeKey) {
      return
    }

    lastTrackedPathRef.current = routeKey
    void telemetryApi.track({
      eventType: 'page_view',
      route: location.pathname,
      metadata: location.search ? { search: location.search } : undefined,
    }).catch(() => {
      // Analytics should never block navigation.
    })
  }, [location.pathname, location.search])

  return (
    <div className="relative min-h-screen overflow-hidden text-[#161616]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-x-0 top-[-11rem] h-[24rem] bg-[radial-gradient(circle_at_top,_rgba(91,33,182,0.18),_transparent_60%)]" />
        <div className="absolute right-[-7rem] top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(15,118,110,0.14),_transparent_72%)]" />
        <div className="absolute left-[-7rem] bottom-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(180,83,9,0.12),_transparent_72%)]" />
        <div className="absolute inset-0 opacity-[0.05] apex-grid" />
      </div>

      <div className="sticky top-0 z-30 px-4 pb-2 pt-3">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-[30px] border border-white/70 bg-white/82 px-4 py-3 shadow-[0_18px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f5efe5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#6b5d4d]">
            <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
            Curated
          </div>
          <ApexLogo size={22} showText={true} />
          <div className="flex items-center gap-2">
            <NavLink
              to="/agents"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors ${
                  isActive ? 'bg-[#ede9fe] text-[#5b21b6]' : 'bg-[#f4f0ff] text-[#5b21b6]'
                }`
              }
            >
              <Cpu size={11} />
              Council
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  isActive ? 'bg-[#ede9fe] text-[#5b21b6]' : 'bg-[#f4f0ff] text-[#5b21b6]'
                }`
              }
              aria-label="Settings"
            >
              <Settings2 size={14} />
            </NavLink>
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
