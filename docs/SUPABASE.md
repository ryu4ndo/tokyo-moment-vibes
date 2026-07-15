# Supabase Backend

Tokyo Moment Vibes uses Supabase for auth, user data, favorites, plans, and AI profiles.

## Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy **Project URL** and **anon key** to `.env`:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. Run the migration in **SQL Editor** or via CLI:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
4. Enable **Google** (and optionally **Apple**) under Authentication → Providers
5. Add redirect URL: `http://localhost:5173`

## Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User name, avatar, Local/Traveler mode |
| `favorites` | Saved spots (`spot_id`) |
| `plans` | AI-generated travel plans (JSON) |
| `ai_profiles` | Food prefs, budget, areas, travel style |
| `owner_shops` | Owner portal listings |

All tables use **Row Level Security** — users access only their own rows (`auth.uid()`).

## Architecture

```
src/
  lib/supabase/client.ts   # Typed Supabase client
  types/                   # TypeScript definitions
  services/                # auth, profile, favorites, plans, ai
  hooks/                   # useAuth, useProfile, useFavorites, usePlans
  contexts/AuthContext.jsx # Bridges services → existing UI
```

Without env vars, the app falls back to **mock auth** (localStorage) — no UI changes.

## Apple Sign In

Enable Apple provider in Supabase and configure Service ID + redirect URL in Apple Developer Console.
