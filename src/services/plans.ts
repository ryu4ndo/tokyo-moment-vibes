import type { Plan, PlanInsert } from '@/types/database';
import { getSupabase } from '@/lib/supabase/client';
import { parseSupabaseError, requireSupabase } from './errors';

export async function listPlans(userId: string): Promise<Plan[]> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb
    .from('plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw parseSupabaseError(error);
  return data ?? [];
}

export async function createPlan(userId: string, input: PlanInsert): Promise<Plan> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb
    .from('plans')
    .insert({ user_id: userId, title: input.title, plan_data: input.plan_data })
    .select()
    .single();
  if (error) throw parseSupabaseError(error);
  return data;
}

export async function updatePlan(
  userId: string,
  planId: string,
  patch: Partial<Pick<Plan, 'title' | 'plan_data'>>,
): Promise<Plan> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb
    .from('plans')
    .update(patch)
    .eq('id', planId)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw parseSupabaseError(error);
  return data;
}

export async function deletePlan(userId: string, planId: string): Promise<void> {
  const sb = requireSupabase(getSupabase());
  const { error } = await sb.from('plans').delete().eq('id', planId).eq('user_id', userId);
  if (error) throw parseSupabaseError(error);
}

export async function getPlan(userId: string, planId: string): Promise<Plan | null> {
  const sb = requireSupabase(getSupabase());
  const { data, error } = await sb
    .from('plans')
    .select('*')
    .eq('id', planId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw parseSupabaseError(error);
  return data;
}
