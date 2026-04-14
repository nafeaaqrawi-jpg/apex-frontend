import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { authApi } from '../../api/auth'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setFieldErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!form.firstName.trim()) errors.firstName = 'First name is required'
    if (!form.lastName.trim()) errors.lastName = 'Last name is required'
    if (!form.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'Please enter a valid email'
    if (!form.password) errors.password = 'Password is required'
    else if (form.password.length < 8)
      errors.password = 'Password must be at least 8 characters'
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    try {
      await authApi.register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      })
      navigate('/verify-email', { state: { email: form.email } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Join Apex"
      subtitle="Where intellectual curiosity meets genuine connection."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            placeholder="Alex"
            value={form.firstName}
            onChange={update('firstName')}
            error={fieldErrors.firstName}
            autoComplete="given-name"
            autoFocus
            leftIcon={<User size={16} />}
          />
          <Input
            label="Last name"
            placeholder="Chen"
            value={form.lastName}
            onChange={update('lastName')}
            error={fieldErrors.lastName}
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update('email')}
          error={fieldErrors.email}
          leftIcon={<Mail size={16} />}
          autoComplete="email"
          hint="Use your .edu email to unlock a Verified Student badge"
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={update('password')}
          error={fieldErrors.password}
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
          autoComplete="new-password"
        />

        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}

        <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
          Join Apex
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already a member?{' '}
          <Link
            to="/login"
            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            Enter Apex
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
