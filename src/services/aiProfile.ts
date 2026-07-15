import type { AiProfile, AiProfileUpdate } from '@/types/database';
import { getSupabase } from '@/lib/supabase/client';
import { parseSupabaseError, requireSupabase } from './errors';

/** Supabase `ai_profiles` table — separate from OpenAI chat service */
export async function fetchAiProfile(userId: string): Promise<AiProfile | null> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb.from('ai_profiles').select('*').eq('user_id', userId).maybeSingle();
  if (error) throw parseSupabaseError(error);
  return data;
}

export async function upsertAiProfile(userId: string, patch: AiProfileUpdate): Promise<AiProfile> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb
    .from('ai_profiles')
    .upsert({ user_id: userId, ...patch }, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw parseSupabaseError(error);
  return data;
}

export async function ensureAiProfile(userId: string): Promise<AiProfile> {
  const existing = await fetchAiProfile(userId);
  if (existing) return existing;
  return upsertAiProfile(userId, {
    food_preferences: [],
    favorite_areas: [],
    budget: null,
    travel_style: null,
  });
}
