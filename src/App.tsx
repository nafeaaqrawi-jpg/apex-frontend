import { Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { useAuth } from './hooks/useAuth'
import { FullPageSpinner } from './components/ui/LoadingSpinner'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Onboarding
import OnboardingPage from './pages/onboarding/OnboardingPage'

// App pages
import DiscoverPage from './pages/app/DiscoverPage'
import MatchesPage from './pages/app/MatchesPage'
import ChatPage from './pages/app/ChatPage'
import ProfilePage from './pages/app/ProfilePage'
import SearchPage from './pages/app/SearchPage'
import UserProfilePage from './pages/app/UserProfilePage'
import RizzAssistPage from './pages/app/RizzAssistPage'
import PremiumPage from './pages/app/PremiumPage'
import SettingsPage from './pages/app/SettingsPage'
import AgentsPage from './pages/app/AgentsPage'

// Legal pages
import TermsPage from './pages/legal/TermsPage'
import PrivacyPage from './pages/legal/PrivacyPage'
import CommunityGuidelinesPage from './pages/legal/CommunityGuidelinesPage'

// Landing / marketing
import LandingPage from './pages/landing/LandingPage'
import AboutPage from './pages/landing/AboutPage'
import CareersPage from './pages/landing/CareersPage'
import MembersPage from './pages/landing/MembersPage'
import PremiumFeaturesPage from './pages/landing/PremiumFeaturesPage'

// Resource / legal pages
import FAQPage from './pages/legal/FAQPage'
import SafeDatingPage from './pages/legal/SafeDatingPage'
import TrustSafetyPage from './pages/legal/TrustSafetyPage'
import PressPage from './pages/legal/PressPage'
import SecurityPage from './pages/legal/SecurityPage'
import CookiePolicyPage from './pages/legal/CookiePolicyPage'
import AccessibilityPage from './pages/legal/AccessibilityPage'
import HowWeConnectPage from './pages/legal/HowWeConnectPage'
import ConsumerHealthDataPage from './pages/legal/ConsumerHealthDataPage'
import PrivacyChoicesPage from './pages/legal/PrivacyChoicesPage'
import ColoradoSafetyPage from './pages/legal/ColoradoSafetyPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <FullPageSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) return <FullPageSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.isProfileComplete) return <Navigate to="/discover" replace />
  return <>{children}</>
}

function RootRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) return <FullPageSpinner />
  if (!isAuthenticated) return <LandingPage />
  if (!user?.isProfileComplete) return <Navigate to="/onboarding" replace />
  return <Navigate to="/discover" replace />
}

export default function App() {
  return (
    <>
      <Routes>
      {/* Root */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <OnboardingRoute>
            <OnboardingPage />
          </OnboardingRoute>
        }
      />

      {/* Protected app routes */}
      <Route
        path="/discover"
        element={
          <ProtectedRoute>
            <DiscoverPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rizzassist"
        element={
          <ProtectedRoute>
            <RizzAssistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agents"
        element={
          <ProtectedRoute>
            <AgentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <MatchesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:matchId"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/premium"
        element={
          <ProtectedRoute>
            <PremiumPage />
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Public marketing routes */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/members" element={<MembersPage />} />
      <Route path="/premium-features" element={<PremiumFeaturesPage />} />
      <Route path="/how-we-connect" element={<HowWeConnectPage />} />
      <Route path="/press" element={<PressPage />} />

      {/* Legal — public routes */}
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/safe-dating" element={<SafeDatingPage />} />
      <Route path="/trust-safety" element={<TrustSafetyPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      <Route path="/consumer-health-data" element={<ConsumerHealthDataPage />} />
      <Route path="/privacy-choices" element={<PrivacyChoicesPage />} />
      <Route path="/colorado-safety" element={<ColoradoSafetyPage />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </>
  )
}
