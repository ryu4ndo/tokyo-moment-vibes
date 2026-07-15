import pg from 'pg';

const { Pool } = pg;

let pool = null;

export function isDbEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!isDbEnabled()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

export async function query(text, params) {
  const p = getPool();
  if (!p) throw new Error('Database not configured');
  return p.query(text, params);
}
