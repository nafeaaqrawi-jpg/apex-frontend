import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  Mail,
  Lock,
  Bell,
  Eye,
  BadgeCheck,
  Cpu,
  Trash2,
  LogOut,
  Shield,
  FileText,
  Users,
  X,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { authApi } from '../../api/auth'

// ---------------------------------------------------------------------------
// localStorage helpers (mirrored from ProfilePage)
// ---------------------------------------------------------------------------
const LS_NOTIF_KEY = 'apex_notif_enabled'
const LS_VISIBILITY_KEY = 'apex_visibility_enabled'
const LS_BADGE_KEY = 'apex_badge_enabled'

function readBoolPref(key: string, defaultVal = true): boolean {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? defaultVal : raw === 'true'
  } catch {
    return defaultVal
  }
}

function writeBoolPref(key: string, val: boolean): void {
  try {
    localStorage.setItem(key, String(val))
  } catch {
    /* noop */
  }
}

// ---------------------------------------------------------------------------
// SettingsPage
// ---------------------------------------------------------------------------
export default function SettingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // ── Settings toggles ──────────────────────────────────────────────────────
  const [notifEnabled, setNotifEnabled] = useState(() => readBoolPref(LS_NOTIF_KEY))
  const [visibilityEnabled, setVisibilityEnabled] = useState(() => readBoolPref(LS_VISIBILITY_KEY))
  const [badgeEnabled, setBadgeEnabled] = useState(() => readBoolPref(LS_BADGE_KEY))
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const toggleNotif = useCallback(() => {
    setNotifEnabled((prev) => {
      writeBoolPref(LS_NOTIF_KEY, !prev)
      return !prev
    })
  }, [])

  const toggleVisibility = useCallback(() => {
    setVisibilityEnabled((prev) => {
      writeBoolPref(LS_VISIBILITY_KEY, !prev)
      return !prev
    })
  }, [])

  const toggleBadge = useCallback(() => {
    setBadgeEnabled((prev) => {
      writeBoolPref(LS_BADGE_KEY, !prev)
      return !prev
    })
  }, [])

  // ── Mutation: logout ──────────────────────────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      queryClient.clear()
      navigate('/login')
    },
  })

  if (!user) return null

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="px-5 pt-4 pb-10"
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage your account</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-1">
              Intelligence
            </p>
            <div className="rounded-[20px] border border-gray-100 bg-white shadow-sm">
              <button
                onClick={() => navigate('/agents')}
                className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Cpu size={16} className="text-violet-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Apex Council</p>
                    <p className="text-xs text-gray-400 mt-0.5">Research, planning, and implementation agents</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            </div>
          </div>

          {/* ── Account section ─────────────────────────────────────────── */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-1">
              Account
            </p>
            <div className="rounded-[20px] border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">

              {/* Email — read-only */}
              <div className="flex items-center justify-between py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                  Read-only
                </span>
              </div>

              {/* Change password */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-gray-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-900">Change password</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </motion.button>

              {/* Notification preferences */}
              <div className="flex items-center justify-between py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-gray-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-900">Notifications</p>
                </div>
                <ToggleSwitch enabled={notifEnabled} onToggle={toggleNotif} />
              </div>

            </div>
          </div>

          {/* ── Privacy section ─────────────────────────────────────────── */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-1">
              Privacy
            </p>
            <div className="rounded-[20px] border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">

              {/* Visibility on Discover */}
              <div className="flex items-center justify-between py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <Eye size={16} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Discoverable</p>
                    <p className="text-xs text-gray-400 mt-0.5">Show my profile on Discover</p>
                  </div>
                </div>
                <ToggleSwitch enabled={visibilityEnabled} onToggle={toggleVisibility} />
              </div>

              {/* Show verified badge */}
              <div className="flex items-center justify-between py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <BadgeCheck size={16} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Verified badge</p>
                    <p className="text-xs text-gray-400 mt-0.5">Show on your public profile</p>
                  </div>
                </div>
                <ToggleSwitch enabled={badgeEnabled} onToggle={toggleBadge} />
              </div>

            </div>
          </div>

          {/* ── Legal section ────────────────────────────────────────────── */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-1">
              Legal
            </p>
            <div className="rounded-[20px] border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">
              <button
                onClick={() => navigate('/terms')}
                className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-gray-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-900">Terms of Service</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
              <button
                onClick={() => navigate('/privacy')}
                className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-gray-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-900">Privacy Policy</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
              <button
                onClick={() => navigate('/community-guidelines')}
                className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-gray-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-900">Community Guidelines</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </button>
            </div>
          </div>

          {/* ── Danger zone ─────────────────────────────────────────────── */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-1">
              Danger zone
            </p>
            <div className="rounded-[20px] border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">

              {/* Delete account */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeleteDialog(true)}
                className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-red-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Trash2 size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-500">Delete account</p>
                </div>
                <ChevronRight size={16} className="text-red-300" />
              </motion.button>

              {/* Sign out */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
                className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-red-50 transition-colors disabled:opacity-60 text-left"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-500">
                    {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                  </p>
                </div>
                {logoutMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-red-200 border-t-red-400 rounded-full animate-spin" />
                ) : (
                  <ChevronRight size={16} className="text-red-300" />
                )}
              </motion.button>

            </div>
          </div>

          {/* Member since */}
          <p className="text-center text-xs text-gray-300 pb-2">
            Member since{' '}
            {new Date(user.createdAt).toLocaleDateString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </p>

        </div>
      </motion.div>

      {/* ── Change Password Modal ──────────────────────────────────────────── */}
      <ChangePasswordModal
        email={user.email}
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* ── Delete Account Dialog ──────────────────────────────────────────── */}
      <DeleteAccountDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </AppLayout>
  )
}

// ---------------------------------------------------------------------------
// ToggleSwitch
// ---------------------------------------------------------------------------
interface ToggleSwitchProps {
  enabled: boolean
  onToggle: () => void
}

function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
        enabled ? 'bg-purple-600' : 'bg-gray-200'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 35 }}
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm ${
          enabled ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// ChangePasswordModal — bottom sheet
// ---------------------------------------------------------------------------
interface ChangePasswordModalProps {
  email: string
  isOpen: boolean
  onClose: () => void
}

function ChangePasswordModal({ email, isOpen, onClose }: ChangePasswordModalProps) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSend = useCallback(async () => {
    setSending(true)
    setError('')
    try {
      await authApi.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong — please try again.')
    } finally {
      setSending(false)
    }
  }, [email])

  const handleClose = useCallback(() => {
    onClose()
    setTimeout(() => {
      setSent(false)
      setError('')
    }, 300)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="pwd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Sheet */}
          <motion.div
            key="pwd-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-5 pt-5 pb-10 max-w-md mx-auto shadow-2xl"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Change password</h3>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center gap-4 py-4"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Reset link sent</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Check <span className="font-medium text-gray-700">{email}</span> for a link to
                    set your new password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-500 leading-relaxed">
                  We'll send a secure reset link to{' '}
                  <span className="font-medium text-gray-700">{email}</span>. Use it to set a new
                  password.
                </p>

                {error && (
                  <p className="text-xs text-red-500 font-medium">{error}</p>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={sending}
                  onClick={handleSend}
                >
                  <Mail size={15} />
                  Send reset link
                </Button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// DeleteAccountDialog — confirmation bottom sheet
// ---------------------------------------------------------------------------
interface DeleteAccountDialogProps {
  isOpen: boolean
  onClose: () => void
}

function DeleteAccountDialog({ isOpen, onClose }: DeleteAccountDialogProps) {
  const [confirmed, setConfirmed] = useState(false)

  const handleClose = useCallback(() => {
    onClose()
    setTimeout(() => setConfirmed(false), 300)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="del-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Sheet */}
          <motion.div
            key="del-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-5 pt-5 pb-10 max-w-md mx-auto shadow-2xl"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-500" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Delete your account?</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  This will permanently delete your profile, matches, and messages. This action
                  cannot be undone.
                </p>
              </div>

              {!confirmed ? (
                <div className="w-full flex flex-col gap-3 mt-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setConfirmed(true)}
                    className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold text-sm transition-colors"
                  >
                    Yes, delete my account
                  </motion.button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors"
                  >
                    Keep my account
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center gap-3 mt-2"
                >
                  <p className="text-xs text-gray-400 leading-relaxed text-center">
                    Account deletion is not yet available — our team will reach out to you within
                    24 hours to process your request.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors py-1"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
