# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANT:** Before starting any new task, review the [Task Log](./TASK_LOG.md) to understand recent changes and pending work. Update the log when starting and completing tasks.

## Workflow Rules

### Branch Strategy
- **Never commit directly to `main`** - always create a feature branch first
- Before making any code changes, create a branch: `git checkout -b feature/<description>`
- Test all changes locally before committing
- Merge to main only after testing is complete

### Code Quality
- Run `yarn test` before committing (runs prettier, lint, typecheck, jest)
- Fix all TypeScript errors - do not ignore them
- Fix all ESLint warnings - do not suppress them

## Project Overview

This is the Next.js 14 frontend for the Alpha-Seekers financial options analytics platform. It provides data visualization and backtesting interfaces for options traders.

**Data Flow:**
```
asbackend (Django API) → alphaseekers3 (this project) → User Browser
```

**Parent Project:** See [Alpha-Seeker-Projects](https://github.com/tringuy1993/Alpha-Seeker-Projects) for overall architecture.

## Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Run all tests (prettier, lint, typecheck, jest)
npm test

# Individual test commands
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint + Stylelint
npm run jest             # Run Jest tests
npm run jest:watch       # Run tests in watch mode

# Storybook
npm run storybook        # Start Storybook on port 6006
npm run storybook:build  # Build Storybook for production

# Bundle analysis
npm run analyze          # Analyze bundle size
```

## Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **UI Library:** Mantine 7 with PostCSS
- **State Management:** Zustand (stores in `store/`)
- **Charts:** ECharts via echarts-for-react
- **Authentication:** Firebase Authentication
- **Data Fetching:** SWR with custom utilities
- **Local Cache:** IndexedDB via Dexie

### Directory Structure

```
alphaseekers3/
├── app/                    # Next.js App Router pages
│   ├── (protected)/        # Auth-protected routes
│   │   ├── options-data/   # Main options dashboard
│   │   ├── backtest/       # Backtesting interface
│   │   ├── options-time/   # Time-series analysis
│   │   └── profile/        # User profile
│   ├── authentication/     # Login/signup pages
│   ├── live0dte/           # Public live 0DTE view
│   └── layout.tsx          # Root layout
├── components/             # Reusable React components
├── config/                 # App configuration
│   ├── site.ts             # Site config and routes
│   └── firebase-client-config.ts
├── lib/                    # Utilities
│   ├── fetchdata/          # API client and URLs
│   └── database/           # IndexedDB (Dexie)
├── store/                  # Zustand state stores
└── public/                 # Static assets
```

### Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/options-data` | Required | Main options data dashboard |
| `/backtest` | Required | Backtesting interface |
| `/options-time` | Required | Time-series Greek analysis |
| `/profile` | Required | User profile settings |
| `/live0dte` | Public | Live 0DTE data view |
| `/music` | Public | Music guessing game |
| `/authentication/*` | Public | Login/signup flows |

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_FIREBASE_*` - Firebase client configuration

See `.env.example` for the complete list.

## API Integration

API endpoints are defined in `lib/fetchdata/apiURLs.ts`. The base URL is configured via environment variable:

```typescript
// Uses NEXT_PUBLIC_API_URL from environment
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/';
```

## Development Notes

### Running with Local Backend
1. Start the Django backend: `cd ../asbackend && python manage.py runserver`
2. Set `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/` in `.env.local`
3. Start frontend: `yarn dev`

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with Email/Password provider
3. Copy client config to `.env.local`

### Common Issues
- **CORS errors:** Ensure backend has frontend URL in CORS_ALLOWED_ORIGINS
- **Auth errors:** Check Firebase config matches backend Firebase Admin config
- **API 404s:** Verify NEXT_PUBLIC_API_URL is set correctly
