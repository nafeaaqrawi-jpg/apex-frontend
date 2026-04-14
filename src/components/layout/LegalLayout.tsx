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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur-sm px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} className="text-gray-600" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 shadow-sm shadow-purple-200">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-sm font-black text-gray-900">Apex</span>
          </Link>
        </div>
        <div className="hidden sm:flex items-center gap-5 text-xs font-medium text-gray-500">
          <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
          <Link to="/community-guidelines" className="hover:text-gray-900 transition-colors">Guidelines</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-5 py-10 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {effectiveDate && (
            <p className="mt-1 text-sm text-gray-500">Effective Date: {effectiveDate}</p>
          )}
        </div>
        {children}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-gray-50 px-5 py-6">
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-5 text-xs text-gray-500">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
          <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          <Link to="/community-guidelines" className="hover:text-gray-900 transition-colors">Community Guidelines</Link>
          <a href="mailto:hello@apex-social.com" className="hover:text-gray-900 transition-colors">Contact</a>
        </div>
        <p className="mt-3 text-center text-xs text-gray-400">© 2026 Apex. All rights reserved.</p>
      </div>
    </div>
  )
}
