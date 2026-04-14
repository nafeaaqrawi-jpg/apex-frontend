import type { User } from '../types'

// Raw backend shape — uses different field names than the frontend User type:
//   verified        → isEmailVerified
//   idVerified      → isIdVerified
//   onboardingComplete → isProfileComplete
type RawUser = Omit<User, 'isEmailVerified' | 'isIdVerified' | 'isProfileComplete'> & {
  verified?: boolean
  idVerified?: boolean
  onboardingComplete?: boolean
  isEmailVerified?: boolean
  isIdVerified?: boolean
  isProfileComplete?: boolean
}

export function mapUser(raw: RawUser): User {
  return {
    ...raw,
    isEmailVerified: raw.verified ?? raw.isEmailVerified ?? false,
    isIdVerified: raw.idVerified ?? raw.isIdVerified ?? false,
    isProfileComplete: raw.onboardingComplete ?? raw.isProfileComplete ?? false,
  }
}
