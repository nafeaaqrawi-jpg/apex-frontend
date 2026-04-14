import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'

interface LegalLayoutProps {
  title: string
  effectiveDate?: string
  children: React.ReactNode
}

export default function LegalLayout({ title, effectiveDate, children }: LegalLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-white/6 bg-[#09090b]/95 backdrop-blur-sm px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 hover:bg-white/12 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} className="text-zinc-300" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-violet-700">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-sm font-black text-white">Apex</span>
          </Link>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-zinc-500">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/community-guidelines" className="hover:text-white transition-colors">Community Guidelines</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-5 py-10 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {effectiveDate && (
            <p className="mt-1 text-sm text-zinc-500">Effective Date: {effectiveDate}</p>
          )}
        </div>

        <div className="prose-legal">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/6 px-5 py-6">
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-5 text-xs text-zinc-600">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/community-guidelines" className="hover:text-white transition-colors">Community Guidelines</Link>
          <a href="mailto:hello@apex-match.com" className="hover:text-white transition-colors">Contact</a>
        </div>
        <p className="mt-3 text-center text-xs text-zinc-700">© 2026 Apex. All rights reserved.</p>
      </div>
    </div>
  )
}
