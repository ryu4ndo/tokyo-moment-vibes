import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const url = import.meta.env.VITE_SUPABASE_URL ?? '';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const isSupabaseEnabled = Boolean(url && anonKey);

export type TypedSupabaseClient = SupabaseClient<Database>;

let client: TypedSupabaseClient | null = null;

export function getSupabase(): TypedSupabaseClient | null {
  if (!isSupabaseEnabled) return null;
  if (!client) {
    client = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    });
  }
  return client;
}

/** @deprecated Use getSupabase() — kept for legacy imports */
export const supabase = getSupabase();
