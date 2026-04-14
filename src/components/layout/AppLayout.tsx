import type { ReactNode } from 'react'
import BottomNav from './BottomNav'
import ApexLogo from '../ui/ApexLogo'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Global top bar with Apex logo */}
      <div className="sticky top-0 z-30 flex items-center justify-center bg-white/95 backdrop-blur-sm border-b border-gray-100/80 py-3">
        <ApexLogo size={22} showText={true} />
      </div>
      <main className="flex-1 max-w-md mx-auto w-full pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
