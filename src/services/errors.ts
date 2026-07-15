import type { AuthError, User } from '@supabase/supabase-js';
import { ServiceError } from '@/types/api';

export function parseSupabaseError(error: AuthError | { message: string; code?: string } | null): ServiceError {
  if (!error) return new ServiceError('Unknown error', 'UNKNOWN');

  const message = error.message ?? 'Request failed';
  const code = 'code' in error ? error.code : undefined;

  if (code === 'PGRST116') return new ServiceError(message, 'NOT_FOUND', error);
  if (message.toLowerCase().includes('jwt') || message.toLowerCase().includes('auth')) {
    return new ServiceError(message, 'AUTH', error);
  }
  if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
    return new ServiceError(message, 'NETWORK', error);
  }
  return new ServiceError(message, 'UNKNOWN', error);
}

export function requireSupabase<T>(client: T | null): T {
  if (!client) {
    throw new ServiceError('Supabase is not configured', 'SUPABASE_DISABLED');
  }
  return client;
}

export function mapUser(user: User) {
  const meta = user.user_metadata ?? {};
  const providerRaw = user.app_metadata?.provider ?? meta.provider ?? 'email';
  let provider: 'google' | 'apple' | 'email' = 'email';
  if (providerRaw === 'google') provider = 'google';
  else if (providerRaw === 'apple') provider = 'apple';

  const role = (meta.role as 'consumer' | 'owner' | 'admin' | undefined) ?? 'consumer';

  return {
    id: user.id,
    email: user.email ?? null,
    name: (meta.full_name as string) ?? (meta.name as string) ?? user.email?.split('@')[0] ?? '',
    avatarUrl: (meta.avatar_url as string) ?? (meta.picture as string) ?? '',
    provider,
    role,
    createdAt: user.created_at ? new Date(user.created_at).getTime() : Date.now(),
  };
}
