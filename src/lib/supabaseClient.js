export { getSupabase, isSupabaseEnabled, supabase } from './supabase/client';

export function mapSupabaseUser(user) {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  const providerRaw = user.app_metadata?.provider ?? meta.provider ?? 'email';
  return {
    id: user.id,
    email: user.email ?? null,
    name: meta.full_name ?? meta.name ?? user.email?.split('@')[0] ?? '',
    avatarUrl: meta.avatar_url ?? meta.picture ?? '',
    provider: providerRaw === 'google' ? 'google' : providerRaw === 'apple' ? 'apple' : 'email',
    role: meta.role ?? 'consumer',
    createdAt: user.created_at ? new Date(user.created_at).getTime() : Date.now(),
  };
}
