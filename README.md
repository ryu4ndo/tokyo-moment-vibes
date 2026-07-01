# Tokyo Moment Vibes

**Find Your Tokyo Moment.**

Lifestyle AI app for discovering authentic Tokyo experiences — for international travelers and Japanese users rediscovering their city.

> 開発再開時は `PROJECT_STATUS.md` と `PROJECT_RULES.md` を先に読んでください。

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env — add OPENAI_API_KEY at minimum
npm run dev
```

| URL | Service |
|-----|---------|
| http://localhost:5173 | Vite client (auto-increments if port busy) |
| http://localhost:3001 | Express API |

**開発は `npm run dev` 1本で起動します**（client + server を同時起動）。  
古い dev サーバーが残っている場合は先に停止してください。

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes (for AI) | Plan generation, chat, text intent |
| `VITE_GOOGLE_MAPS_API_KEY` | No | Interactive Google Maps |
| `GOOGLE_PLACES_API_KEY` | No | Live photos, hours, reviews |
| `PORT` | No | API server port (default `3001`) |

## Folder Structure

```
src/
├── api/              # API route constants
├── assets/
├── components/       # Shared UI + layout (AppHeader, BottomNav, NeonButton…)
├── contexts/         # AppStateContext (language, experience, companion, mood, location, time)
├── data/             # Static data (spots, vibes, moods, companions)
├── features/
│   ├── chat/         # AIChat
│   ├── plan/         # PlanDetail, PlanTimeline, Map, generateTokyoPlans
│   ├── vibes/        # VibeDetail, VibeCard, filters
│   └── spots/        # SpotCard, BookmarkButton, ReserveLinks
├── hooks/            # usePlanGeneration, etc.
├── locales/          # i18n (JA/EN)
├── pages/            # HomePage, VibesPage, PlanPage, FoodPage, SavedPage
├── services/         # API clients (OpenAI, Places, Chat, Reservation)
├── styles/           # Tailwind entry (index.css)
└── utils/            # formatters, displayUtils, spotLookup
server/               # Express API proxy
```

## Main Features

| Feature | Description |
|---------|-------------|
| 🇯🇵 / 🌍 Language | JA/EN toggle with cultural copy |
| 🏠 / ✈️ Experience | Local vs Traveler mode |
| 👥 Companion | Solo / Couple / Friends / Family / Business / Backpacker |
| ✨ VIBES | Mood-based discovery grid + detail |
| 🤖 AI Plans | OpenAI + local fallback |
| 📍 Places | Google Places with local data fallback |
| 📅 Reserve | Tabelog, Hot Pepper, TableCheck, OpenTable links |
| 💬 AI Chat | Natural language plan regeneration |
| ❤️ Saved | Favorites in localStorage |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/generate-plan` | AI plan generation |
| POST | `/api/plan-from-text` | Natural language → plans |
| POST | `/api/chat` | AI assistant + plan updates |
| POST | `/api/places/search` | Place search |
| GET | `/api/places/details` | Place details |
| GET | `/api/health` | Health check |

## Development Flow

```bash
npm run dev      # Start client + API
npm run build    # Production build
npm run lint     # ESLint
npm run start    # Production API (after build)
npm run preview  # Build + start
```

## Tech Stack

React 19 · Vite 8 · Tailwind v4 · Framer Motion · Express · OpenAI API

## Docs

- [PROJECT_STATUS.md](./PROJECT_STATUS.md) — progress, roadmap, next steps
- [PROJECT_RULES.md](./PROJECT_RULES.md) — brand, design, architecture rules
