/** Experience mode stored in profiles.mode */
export type ProfileMode = 'local' | 'traveler';

export type AuthProvider = 'google' | 'apple' | 'email' | 'guest';

/** Mapped app user from Supabase auth.users */
export interface AppUser {
  id: string;
  email: string | null;
  name: string;
  avatarUrl: string;
  provider: AuthProvider;
  role: 'consumer' | 'owner' | 'admin';
  createdAt: number;
}

export interface AuthSession {
  user: AppUser;
  loggedInAt: number;
}

export interface SignInEmailInput {
  email: string;
  password: string;
}

export interface SignUpEmailInput extends SignInEmailInput {
  name?: string;
}
