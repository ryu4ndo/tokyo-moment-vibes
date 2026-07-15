/** @deprecated Use @/services/auth — kept for owner/admin portal compatibility */
export {
  isSupabaseEnabled,
  signInWithGoogle,
  signInWithApple,
  signInWithEmail,
  signOut as signOutSupabase,
  onAuthStateChange,
  getSession,
} from '@/services/auth';
