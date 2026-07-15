import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { AppUser, SignInEmailInput, SignUpEmailInput } from '@/types/auth';
import { getSupabase, isSupabaseEnabled } from '@/lib/supabase/client';
import { mapUser, parseSupabaseError, requireSupabase } from './errors';

const REDIRECT_URL = typeof window !== 'undefined' ? window.location.origin : '';

export { isSupabaseEnabled };

export async function getSession(): Promise<AppUser | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.getSession();
  if (error) throw parseSupabaseError(error);
  return data.session?.user ? mapUser(data.session.user) : null;
}

export function onAuthStateChange(
  callback: (user: AppUser | null, event: AuthChangeEvent) => void,
): () => void {
  const sb = getSupabase();
  if (!sb) return () => {};

  const { data } = sb.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    callback(session?.user ? mapUser(session.user) : null, event);
  });

  return () => data.subscription.unsubscribe();
}

export async function signInWithGoogle(redirectTo = REDIRECT_URL): Promise<void> {
  const sb = requireSupabase(getSupabase());
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) throw parseSupabaseError(error);
}

/** Apple Sign In — requires Apple provider enabled in Supabase dashboard */
export async function signInWithApple(redirectTo = REDIRECT_URL): Promise<void> {
  const sb = requireSupabase(getSupabase());
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo },
  });
  if (error) throw parseSupabaseError(error);
}

export async function signInWithEmail({ email, password }: SignInEmailInput): Promise<AppUser> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw parseSupabaseError(error);
  if (!data.user) throw parseSupabaseError({ message: 'No user returned' });
  return mapUser(data.user);
}

export async function signUpWithEmail({ email, password, name }: SignUpEmailInput): Promise<AppUser> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: name ?? '', name: name ?? '' } },
  });
  if (error) throw parseSupabaseError(error);
  if (!data.user) throw parseSupabaseError({ message: 'No user returned' });
  return mapUser(data.user);
}

export async function signOut(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb.auth.signOut();
  if (error) throw parseSupabaseError(error);
}

export type AuthSubscription = { unsubscribe: () => void };
