import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const isSupabaseServerEnabled = Boolean(url && serviceKey);

export function getSupabaseAdmin() {
  if (!isSupabaseServerEnabled) return null;
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function verifySupabaseToken(authHeader) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  const meta = data.user.user_metadata ?? {};
  return {
    id: data.user.id,
    email: data.user.email,
    role: meta.role ?? 'consumer',
    name: meta.full_name ?? meta.name ?? '',
  };
}

export function requireRole(roles = []) {
  return async (req, res, next) => {
    if (!isSupabaseServerEnabled) return next();
    const user = await verifySupabaseToken(req.headers.authorization);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (roles.length && !roles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    req.authUser = user;
    next();
  };
}
