import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { authApi } from '../../api/auth'
import { AUTH_QUERY_KEY } from '../../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unverifiedEmail, setUnverifiedEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setUnverifiedEmail('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      const { user } = await authApi.login({ email, password })
      queryClient.setQueryData(AUTH_QUERY_KEY, user)

      if (!user.isProfileComplete) {
        navigate('/onboarding')
      } else {
        navigate('/discover')
      }
    } catch (err) {
      const apiErr = err as Error & { code?: string }
      if (apiErr.code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(email)
        setError('Your email isn\'t verified yet. Check your inbox or resend below.')
      } else {
        setError(apiErr.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Good to see you again.">
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Input
          label="Email"
          type="email"
          placeholder="you@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={16} />}
          autoComplete="email"
          autoFocus
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          autoComplete="current-password"
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="-mt-1"
            >
              <p className="text-xs text-red-500 font-medium mb-2">{error}</p>
              {unverifiedEmail && (
                <Link
                  to="/verify-email"
                  state={{ email: unverifiedEmail }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors underline underline-offset-2"
                >
                  <Mail size={12} />
                  Resend verification email
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end -mt-1">
          <Link
            to="/forgot-password"
            className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg">
          Enter Apex
        </Button>

        <p className="text-center text-sm text-gray-500 mt-2">
          New here?{' '}
          <Link
            to="/register"
            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            Join Apex
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  )
}
