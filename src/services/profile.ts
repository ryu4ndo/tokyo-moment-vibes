import type { Profile, ProfileMode, ProfileUpdate } from '@/types/database';
import { getSupabase } from '@/lib/supabase/client';
import { parseSupabaseError, requireSupabase } from './errors';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw parseSupabaseError(error);
  return data;
}

export async function upsertProfile(userId: string, patch: ProfileUpdate): Promise<Profile> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb
    .from('profiles')
    .upsert({ id: userId, ...patch })
    .select()
    .single();
  if (error) throw parseSupabaseError(error);
  return data;
}

export async function updateProfileMode(userId: string, mode: ProfileMode): Promise<Profile> {
  return upsertProfile(userId, { mode });
}

export async function ensureProfile(userId: string, defaults: ProfileUpdate = {}): Promise<Profile> {
  const existing = await fetchProfile(userId);
  if (existing) return existing;
  return upsertProfile(userId, { mode: 'local', ...defaults });
}
