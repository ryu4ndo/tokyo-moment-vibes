import type { Favorite } from '@/types/database';
import { getSupabase } from '@/lib/supabase/client';
import { parseSupabaseError, requireSupabase } from './errors';

export async function listFavorites(userId: string): Promise<Favorite[]> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw parseSupabaseError(error);
  return data ?? [];
}

export async function addFavorite(userId: string, spotId: string): Promise<Favorite> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb
    .from('favorites')
    .upsert({ user_id: userId, spot_id: spotId }, { onConflict: 'user_id,spot_id' })
    .select()
    .single();
  if (error) throw parseSupabaseError(error);
  return data;
}

export async function removeFavorite(userId: string, spotId: string): Promise<void> {
  const sb = requireSupabase(getSupabase());
  const { error } = await sb.from('favorites').delete().eq('user_id', userId).eq('spot_id', spotId);
  if (error) throw parseSupabaseError(error);
}

export async function isFavorite(userId: string, spotId: string): Promise<boolean> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('spot_id', spotId)
    .maybeSingle();
  if (error) throw parseSupabaseError(error);
  return Boolean(data);
}
