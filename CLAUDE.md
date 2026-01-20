# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANT:** Before starting any new task, review the [Task Log](./TASK_LOG.md) to understand recent changes and pending work. Update the log when starting and completing tasks.

## Workflow Rules

- **Update TASK_LOG.md** when starting (In Progress) and completing tasks (Complete)
- **Never commit directly to `main`** - create a feature branch: `git checkout -b feature/<description>`
- Run `npm test` before committing (runs prettier, lint, typecheck, jest)

## Project Overview

Next.js 14 frontend for Alpha-Seekers financial options analytics platform. Visualizes Greek exposures (gamma, delta, vanna) for options traders.

**Data Flow:** `asbackend (Django API) → alphaseekers3 (this project) → User Browser`

**Parent Project:** See [Alpha-Seeker-Projects](../CLAUDE.md) for database schema and overall architecture.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm test             # Full suite: prettier, lint, typecheck, jest
npm run typecheck    # TypeScript only
npm run lint         # ESLint + Stylelint
npm run jest         # Jest only
npm run jest:watch   # Jest watch mode
npm run storybook    # Storybook on port 6006
npm run analyze      # Bundle analysis
```

## Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **UI:** Mantine 7 with PostCSS
- **State:** Zustand (`store/`)
- **Charts:** ECharts via echarts-for-react
- **Auth:** Firebase Authentication
- **Data Fetching:** SWR with custom hooks (`lib/fetchdata/`)

### Key Patterns

**Data Fetching:** Use the custom SWR hook that handles Firebase auth tokens automatically:
```typescript
import useCustomSWR from '@/lib/fetchdata/fetch-custom';
import { GREEK_EXPO_URL } from '@/lib/fetchdata/apiURLs';

const { data, isLoading, isError } = useCustomSWR(GREEK_EXPO_URL, { ticker: 'SPX' });
```

**Zustand Stores:** Backtesting state is in `store/BTOrders/`. Stores follow the pattern:
```typescript
// store/example.ts
export const useExampleStore = create<State & Actions>((set) => ({ ... }));
```

**Chart Components:** All ECharts components are in `components/ECharts/` organized by feature (ToS, Live0DTE, BackTest, GammaDashboard).

### Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/options-data` | Yes | Main options dashboard |
| `/backtest` | Yes | Options backtesting |
| `/options-time` | Yes | Time-series Greek analysis |
| `/gamma-dashboard` | Yes | SpotGamma-style gamma charts |
| `/live0dte` | No | Public live 0DTE data |
| `/music` | No | Music guessing game |

Route authorization is defined in `config/site.ts` via `authorizedLinksList`.

### API Endpoints

All endpoints defined in `lib/fetchdata/apiURLs.ts`. Key endpoint groups:
- **Greek Exposure:** `GREEK_EXPO_URL`, `THEO_URL`, `THEOVANNA_URL`
- **Live Data:** `LIVE_URL`, `LIVE_OTM_URL`, `LIVE_EXPO_GREEK_URL`
- **Backtesting:** `BACKTEST_URL`, `BACKTEST_OPT_CHAIN`, `BACKTEST_TRACK_ORDER`
- **Gamma Dashboard:** `GAMMA_DASHBOARD_TIME_SERIES_URL`, `GAMMA_DASHBOARD_HEATMAP_URL`, `GAMMA_DASHBOARD_LEVELS_URL`

## Environment Setup

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_FIREBASE_*` - Firebase client config

### Switching Environments

```bash
./switch-env.sh dev     # Use localhost:8000
./switch-env.sh prod    # Use alpha-seekers.com
./switch-env.sh status  # Check current
```

**Always switch to prod before `npm run build` for deployment.**

## Development Notes

### Running with Local Backend
1. Start Django: `cd ../asbackend && python manage.py runserver`
2. Start frontend: `npm run dev`

### Common Issues
- **CORS errors:** Backend needs frontend URL in CORS_ALLOWED_ORIGINS
- **Auth errors:** Firebase config must match between frontend and backend
- **API 404s:** Verify NEXT_PUBLIC_API_URL in .env.local
