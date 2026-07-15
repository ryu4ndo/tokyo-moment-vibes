-- Tokyo Moment Vibes platform schema
-- Run: npm run db:migrate

CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  spot_id TEXT,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  photos JSONB DEFAULT '[]',
  videos JSONB DEFAULT '[]',
  menu JSONB DEFAULT '[]',
  price_range TEXT,
  hours JSONB DEFAULT '{}',
  address TEXT,
  area TEXT,
  phone TEXT,
  instagram TEXT,
  website TEXT,
  status TEXT DEFAULT 'pending',
  featured BOOLEAN DEFAULT FALSE,
  sponsored BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  category TEXT,
  updated_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

CREATE TABLE IF NOT EXISTS business_events (
  id TEXT PRIMARY KEY,
  business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title_ja TEXT,
  title_en TEXT,
  description_ja TEXT,
  description_en TEXT,
  start_date TEXT,
  end_date TEXT,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  label_ja TEXT,
  label_en TEXT,
  discount_percent INT,
  free_item TEXT,
  start_date TEXT,
  end_date TEXT,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
  author TEXT,
  rating INT,
  text TEXT,
  reply TEXT,
  created_at BIGINT
);

CREATE TABLE IF NOT EXISTS platform_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title_ja TEXT,
  title_en TEXT,
  area TEXT,
  start_date TEXT,
  end_date TEXT,
  show_on_today BOOLEAN DEFAULT TRUE,
  show_on_vibes BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  description_ja TEXT,
  description_en TEXT
);

CREATE TABLE IF NOT EXISTS featured_collections (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title_ja TEXT,
  title_en TEXT,
  description_ja TEXT,
  description_en TEXT,
  spot_ids JSONB DEFAULT '[]',
  season TEXT,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS ads (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  label_ja TEXT,
  label_en TEXT,
  spot_id TEXT,
  business_id TEXT,
  area TEXT,
  active BOOLEAN DEFAULT TRUE,
  is_sponsored BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS ai_priority (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  event_boost INT DEFAULT 15,
  sponsor_boost INT DEFAULT 20,
  local_boost INT DEFAULT 10,
  new_store_boost INT DEFAULT 12,
  trending_boost INT DEFAULT 8
);

CREATE TABLE IF NOT EXISTS platform_users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'consumer',
  status TEXT DEFAULT 'active',
  created_at BIGINT
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  email TEXT,
  subject TEXT,
  body TEXT,
  status TEXT DEFAULT 'open',
  created_at BIGINT
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  created_at BIGINT
);

CREATE TABLE IF NOT EXISTS user_snapshots (
  user_id TEXT PRIMARY KEY,
  snapshot JSONB NOT NULL,
  updated_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

INSERT INTO ai_priority (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
