import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom'
import { Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { authApi } from '../../api/auth'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const token = searchParams.get('token')
  const emailFromState = (location.state as { email?: string })?.email

  const [verifying, setVerifying] = useState(!!token)
  const [verified, setVerified] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendEmail, setResendEmail] = useState(emailFromState || '')

  useEffect(() => {
    if (!token) return

    const verify = async () => {
      try {
        await authApi.verifyEmail(token)
        setVerified(true)
        setTimeout(() => navigate('/onboarding'), 2000)
      } catch (err) {
        setVerifyError(err instanceof Error ? err.message : 'Verification failed.')
      } finally {
        setVerifying(false)
      }
    }

    verify()
  }, [token, navigate])

  const handleResend = async () => {
    if (!resendEmail) return
    setResending(true)
    try {
      await authApi.resendVerification(resendEmail)
      setResendSuccess(true)
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : 'Could not resend email.')
    } finally {
      setResending(false)
    }
  }

  // Token in URL — verifying
  if (token) {
    return (
      <AuthLayout title="Verifying your email" subtitle="Just a moment...">
        <div className="flex flex-col items-center gap-6 py-4">
          {verifying && (
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner size="xl" />
              <p className="text-gray-500 text-sm">Confirming your email address...</p>
            </div>
          )}

          {verified && (
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-lg">Email verified!</h3>
                <p className="text-gray-500 text-sm mt-1">Redirecting you to onboarding...</p>
              </div>
            </div>
          )}

          {verifyError && (
            <div className="flex flex-col items-center gap-4 animate-fade-in w-full">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle size={32} className="text-red-500" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 text-lg">Verification failed</h3>
                <p className="text-red-500 text-sm mt-1">{verifyError}</p>
              </div>
              <p className="text-gray-500 text-sm text-center">
                This link may have expired. Request a new one below.
              </p>
              <Link to="/verify-email">
                <Button variant="secondary">Request new link</Button>
              </Link>
            </div>
          )}
        </div>
      </AuthLayout>
    )
  }

  // No token — show "check your email" state
  return (
    <AuthLayout title="Check your email" subtitle="We sent you a verification link">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center">
          <Mail size={36} className="text-purple-600" />
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm leading-relaxed">
            We sent a verification link to{' '}
            {resendEmail ? (
              <span className="font-semibold text-gray-800">{resendEmail}</span>
            ) : (
              'your email'
            )}
            . Click the link to activate your account.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Check your spam folder if you don't see it.
          </p>
        </div>

        {resendSuccess ? (
          <div className="w-full bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700">New verification email sent!</p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            {!emailFromState && (
              <input
                type="email"
                placeholder="Enter your email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-purple-400 transition-all duration-200"
              />
            )}
            <Button
              variant="secondary"
              fullWidth
              loading={resending}
              onClick={handleResend}
              disabled={!resendEmail}
            >
              <RefreshCw size={16} />
              Resend verification email
            </Button>
          </div>
        )}

        <Link
          to="/login"
          className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  )
}
