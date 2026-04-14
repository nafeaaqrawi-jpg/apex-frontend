import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { authApi } from '../../api/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title="Email sent!" subtitle="Check your inbox">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-fade-in">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm leading-relaxed">
              We've sent password reset instructions to{' '}
              <span className="font-semibold text-gray-800">{email}</span>.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              The link expires in 1 hour. Check your spam folder if you don't see it.
            </p>
          </div>
          <Link to="/login">
            <Button variant="secondary">
              <ArrowLeft size={16} />
              Back to sign in
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send a reset link"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={16} />}
          autoComplete="email"
          autoFocus
        />

        {error && (
          <p className="text-xs text-red-500 font-medium -mt-1">{error}</p>
        )}

        <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
          Send Reset Link
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mt-1"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </form>
    </AuthLayout>
  )
}
