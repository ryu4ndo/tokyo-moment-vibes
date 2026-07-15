-- Tokyo Moment Vibes — Supabase initial schema + RLS
-- Apply via: supabase db push  OR  Supabase SQL Editor

-- ── profiles ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar TEXT,
  mode TEXT NOT NULL DEFAULT 'local' CHECK (mode IN ('local', 'traveler')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ── favorites ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spot_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, spot_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select_own" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_own" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ── plans ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  plan_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select_own" ON public.plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "plans_insert_own" ON public.plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "plans_update_own" ON public.plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "plans_delete_own" ON public.plans
  FOR DELETE USING (auth.uid() = user_id);

-- ── ai_profiles ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  food_preferences JSONB NOT NULL DEFAULT '[]',
  budget TEXT,
  favorite_areas JSONB NOT NULL DEFAULT '[]',
  travel_style TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_profiles_select_own" ON public.ai_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ai_profiles_insert_own" ON public.ai_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ai_profiles_update_own" ON public.ai_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- ── owner_shops ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.owner_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  address TEXT,
  images JSONB NOT NULL DEFAULT '[]',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.owner_shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_shops_select_own" ON public.owner_shops
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "owner_shops_insert_own" ON public.owner_shops
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "owner_shops_update_own" ON public.owner_shops
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "owner_shops_delete_own" ON public.owner_shops
  FOR DELETE USING (auth.uid() = owner_id);

-- Public read for verified shops (consumer app)
CREATE POLICY "owner_shops_select_verified" ON public.owner_shops
  FOR SELECT USING (verified = TRUE);

-- ── auto-create profile on signup ──────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar, mode)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    COALESCE(NEW.raw_user_meta_data->>'mode', 'local')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.ai_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── updated_at trigger for ai_profiles ─────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ai_profiles_updated_at ON public.ai_profiles;
CREATE TRIGGER ai_profiles_updated_at
  BEFORE UPDATE ON public.ai_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
