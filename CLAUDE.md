# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint check
```

There is no test suite.

## Architecture

PecinoGP is a MotoGP fan/analysis website in Spanish. Built with Next.js App Router + TypeScript, styled with Tailwind CSS 4 and shadcn/ui components.

### Directory layout

- `app/` — Next.js App Router pages and API routes
- `All/components/` — Shared components (reusable across pages); `All/components/ui/` holds shadcn/ui primitives
- `lib/` — Services and data utilities
- `data/` — Local JSON storage (`polls.json`, `questions.json`, `voted-ips.json`)
- `hooks/` — Custom React hooks

Route-specific components live in `app/[route]/components/`.

### Key services (`lib/`)

- **`lib/races.ts`** — Hardcoded race calendar for the current season. Update `races[]` entries and `endDate` (ISO `YYYY-MM-DD`) each season. `getRacesWithStatus()` auto-derives `completed / next / upcoming` from today's date — no other logic needed.
- **`lib/motogp-service.ts`** — Proxy for `motogp.pulselive.com` standings API. Season/category UUIDs are hardcoded for the current season; update them when the season changes.
- **`lib/youtube-service.ts`** / **`lib/youtube-data.ts`** — YouTube Data API v3 wrapper with dual-key rotation (`NEXT_PUBLIC_YOUTUBE_API_KEY` → `NEXT_PUBLIC_YOUTUBE_API_KEY_2`) for quota management, plus fallback cached data.

### API routes (`app/api/`)

- `/api/standings` — MotoGP standings proxy (15-min server cache)
- `/api/live` — YouTube live stream detection
- `/api/polls`, `/api/questions`, `/api/vote` — Poll/Q&A, backed by **Neon Postgres** (`DATABASE_URL`), tables `questions` and `votes`. The files in `data/` are legacy and unused. Poll options are hardcoded in `app/api/polls/route.ts`: to close a poll and open a new one, bump its `id` so vote counts restart while old votes stay in the DB as history.
  - `GET /api/questions` also deletes questions older than `QUESTIONS_TTL_DAYS` (default 30), always keeping the `QUESTIONS_KEEP_LAST` most recent (default 5) so the feed is never empty.
  - `DELETE /api/questions?id=N` removes one question; requires header `x-admin-token` matching `ADMIN_TOKEN`. Unset `ADMIN_TOKEN` disables deletion entirely.

### Data flow

Pages fetch external data client-side via the internal API routes (not directly from third parties). The home page (`app/page.tsx`) fetches YouTube, live status, and MotoGP standings on the client using `useEffect`. Most other pages are Server Components.

### Component conventions

- Add `"use client"` only when the component uses state, effects, or browser APIs.
- Shared reusable components → `All/components/`
- Page-scoped components → `app/[route]/components/`
- New shadcn/ui primitives → `All/components/ui/` (add via `npx shadcn@latest add <component>`)

### Notable config

- TypeScript build errors are **ignored** (`next.config.mjs`: `typescript.ignoreBuildErrors: true`). TypeScript is used for DX only — type errors won't break the build.
- Images are unoptimized (`images.unoptimized: true`).
- Path alias `@/` resolves to the repository root.

### Environment variables

```
NEXT_PUBLIC_YOUTUBE_API_KEY       # Primary YouTube Data API key
NEXT_PUBLIC_YOUTUBE_API_KEY_2     # Fallback YouTube key (quota rotation)
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID    # PecinoGP YouTube channel ID
DATABASE_URL                      # Neon Postgres (polls, votes, questions)
ADMIN_TOKEN                       # Enables manual question deletion (admin mode)
QUESTIONS_TTL_DAYS                # Optional, default 30
QUESTIONS_KEEP_LAST               # Optional, default 5
```

MotoGP API credentials are also stored in `.env.local`.
