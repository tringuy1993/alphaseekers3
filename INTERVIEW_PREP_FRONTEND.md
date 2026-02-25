# Frontend Interview Prep — Full Stack Developer Position

> Scripts and talking points derived from the **alphaseekers3** codebase (Next.js 14 / React / TypeScript).
> Every answer maps to a specific job requirement and references real code you can pull up on your laptop.
>
> **Format:** Each section has a **Script** (your 2-minute answer), **Code to Show** (file + line if they ask to see it), and **Follow-up Q&A** (anticipate the interviewer's next question).

---

## Table of Contents

1. [React Component Architecture](#1-react-component-architecture)
2. [TypeScript, HTML, CSS — Front-End Fundamentals](#2-typescript-html-css--front-end-fundamentals)
3. [State Management with Zustand](#3-state-management-with-zustand)
4. [Data Fetching & API Integration](#4-data-fetching--api-integration)
5. [Data Transformation & Visualization (ECharts)](#5-data-transformation--visualization-echarts)
6. [Authentication & Security Hardening](#6-authentication--security-hardening)
7. [Client-Side Caching & IndexedDB Data Pipeline](#7-client-side-caching--indexeddb-data-pipeline)
8. [Error Handling & Resilience](#8-error-handling--resilience)
9. [Refactoring Prototypes into Modular Code](#9-refactoring-prototypes-into-modular-code)
10. [Git Workflow, Version Control & Change Tracking](#10-git-workflow-version-control--change-tracking)
11. [Responsive Design & Layout Architecture](#11-responsive-design--layout-architecture)
12. [Complex Interactive Feature — Backtesting Engine](#12-complex-interactive-feature--backtesting-engine)
13. [Behavioral (STAR) Stories](#13-behavioral-star-stories)
14. [Bridging to Graph Databases (Neo4J)](#14-bridging-to-graph-databases-neo4j)
15. [Summary Mapping Table](#15-summary-mapping-table)

---

## 1. React Component Architecture

**Job requirement:** *"Contributing to the development of front-end applications using modern JavaScript frameworks such as React"*

### Script

> "I built Alpha-Seekers, a financial options analytics platform, using **Next.js 14 with the App Router**. The architecture follows three clear layers:
>
> **Route layer** — Pages live under `app/` using Next.js route groups. I use `(protected)/` as a route group to co-locate all authenticated pages under one layout that enforces auth checks. Public pages like `/live0dte` and `/music` sit outside this group and need no authentication.
>
> **Component layer** — Reusable components are in `components/`, organized by domain: `ECharts/` for all chart visualizations, `Authentication/` for login forms, `MainShell/` for the app's responsive shell. Each chart feature gets its own subdirectory — for example, `ECharts/GammaDashboard/` contains three chart components, three options-builder files, and a barrel export.
>
> **Logic layer** — Custom hooks, utility functions, and stores live in `lib/` and `store/`. Data fetching is a custom SWR hook in `lib/fetchdata/`. Auth configuration is centralized in `lib/auth/config.ts`. Zustand stores manage client state.
>
> The key architectural decision was **separating chart rendering from chart configuration**. Every ECharts component is two files: a React component (handles data fetching, loading, lifecycle) and a pure `_Opts.ts` function (transforms raw API data into a complete ECharts option object). This keeps components under 60 lines and makes the business logic independently testable."

### Code to Show

| What | File | Lines |
|------|------|-------|
| Route groups with auth | `app/(protected)/gamma-dashboard/page.tsx` | Full file — cascading state, conditional fetching, responsive grid |
| Chart component (thin) | `components/ECharts/GammaDashboard/EChartGammaLevels.tsx` | 18–56 — just fetching + loading + rendering |
| Options builder (pure logic) | `components/ECharts/GammaDashboard/EChartGamma_Levels_Opts.ts` | 13–112 — data filtering, strike mapping, series config |
| Theme-aware wrapper | `components/ECharts/EChartThemed.tsx` | Full file — 15-line wrapper bridging Mantine theme to ECharts |
| App shell | `components/MainShell/MainAppShell.tsx` | 34–87 — route-aware sidebar, responsive header |

### Follow-up Q&A

**Q: How do you decide when to split a component into smaller pieces?**
> "I follow single responsibility. If a component does data fetching AND data transformation AND rendering, I split them. In Alpha-Seekers, `EChartGammaLevels` fetches data and renders; `EChartGamma_Levels_Opts` transforms data. The opts file is a pure function — no React dependency — so I can test it with plain Jest, passing in mock data and asserting the returned option object. I also split when I see reuse: `EChartThemed` wraps ECharts with Mantine's dark/light theme, so every chart in the app gets theme support without duplicating that 3-line integration."

**Q: Client components vs server components in Next.js 14?**
> "Most of my pages are `'use client'` because they're interactive dashboards needing browser APIs — SWR for live data, Zustand for state, Firebase auth for tokens. But I use the layout hierarchy for server-side concerns. For example, the root `app/layout.tsx` is a server component that sets up MantineProvider and the auth provider wrapping.
>
> I also hit a real Next.js 14 production gotcha: `useSearchParams()` must be wrapped in `<Suspense>` or the static build fails with a hard error. I fixed this by splitting `AuthProvider` into an outer `Suspense` wrapper and an inner component that calls `useSearchParams`. That's commit `818d224`."

**Q: How do you handle code reuse across charts?**
> "I built a shared utility module `UtilECharts.ts` with helpers like `formatNumbers` (converts 1000000 to '1.0M'), `createXMarkLineData` (builds ECharts mark-line config from price data), `datasets` (creates ECharts dataset config from raw arrays), and `commonOptions` (shared tooltip, toolbox, and animation settings). Every chart opts file imports from this module rather than re-implementing formatting or mark-line logic."

---

## 2. TypeScript, HTML, CSS — Front-End Fundamentals

**Job requirement:** *"HTML, CSS, and/or JavaScript"*

### Script

> "The project uses **TypeScript** end-to-end. I define explicit types for API data, component props, and store shapes. For example, the backtesting store has typed interfaces in `store/BTOrders/types.ts`:
>
> ```typescript
> type OrderState = {
>   option_type: boolean;
>   price: number;
>   strike: number;
>   expiration: string;
>   delta?: number;
>   gamma?: number;
> };
>
> type State = { legs: OrderState[]; legsPriceSum: number };
> type Actions = { addLegs: (leg: OrderState) => void; removeAllLegs: () => void; setOrder: () => void };
> ```
>
> This makes the Zustand store completely type-safe — `addLegs` enforces the shape of every option leg at compile time.
>
> For the Gamma Dashboard charts, I define interfaces for every API response shape:
>
> ```typescript
> interface LevelsDataPoint {
>   strike_price: number;
>   spot_price: number;
>   call_gamma: number;
>   put_gamma: number;
>   total_gamma: number;
> }
> ```
>
> For styling, I combine **Mantine 7's component library** (accessible, theme-aware primitives like `AppShell`, `Tabs`, `SegmentedControl`, `Grid`) with **CSS Modules** for custom overrides. PostCSS handles Mantine-specific transforms. I don't use Tailwind — Mantine's props-based styling (`p="md"`, `mb="sm"`, `withBorder`) keeps styles co-located with components."

### Follow-up Q&A

**Q: How do you handle theming?**
> "Mantine provides a `MantineProvider` at the root with a `ColorSchemeScript`. Users toggle dark/light mode with a `ThemeToggle` component. For charts, I built `EChartThemed` — it reads `useMantineColorScheme()` and passes the scheme as the ECharts `theme` prop, so chart backgrounds, axis labels, and grid lines all flip automatically. No manual color switching per chart."

**Q: How do you handle responsive design?**
> "Mantine's Grid uses breakpoint-based spans: `<Grid.Col span={{ base: 12, lg: 4 }}>`. On mobile, all three Gamma Dashboard charts stack vertically; on desktop, the levels chart takes 1/3 width and the heatmap + time series take 2/3. The AppShell navbar collapses on mobile (`collapsed: { mobile: !opened }`), and the header auto-hides on scroll using `useHeadroom`."

---

## 3. State Management with Zustand

**Job requirement:** *"Translate complex requirements into robust, maintainable software solutions"*

### Script

> "I use **Zustand** for client-side state management. I chose it over Redux for its minimal boilerplate and over React Context for its granular subscription model — Context re-renders every consumer on any change, while Zustand lets components subscribe to specific slices.
>
> The backtesting feature demonstrates the most complex state management. There are two interconnected stores:
>
> ```typescript
> // store/BTOrders/btSelectedLegStore.ts
> export const useBTSelectedLegsStore = create<State & Actions>((set) => ({
>   legs: [],
>   legsPriceSum: 0,
>   addLegs: (addedLeg) => {
>     set((state) => {
>       if (state.legs.length < 4) {  // Max 4 legs (iron condor)
>         const newLegs = [...state.legs, addedLeg];
>         const newSum = newLegs.reduce((acc, leg) => acc + leg.price, 0);
>         return { legs: newLegs, legsPriceSum: newSum };
>       }
>       return state;  // Silently reject if at capacity
>     });
>   },
>   setOrder: () => {
>     const allLegs = useBTSelectedLegsStore.getState().legs;
>     const sum = useBTSelectedLegsStore.getState().legsPriceSum;
>     useBTOrderStore.setState({ order: { legs: allLegs, orderCost: Number(sum.toFixed(2)) } });
>   },
> }));
> ```
>
> Key design decisions:
> - **Derived state** (legsPriceSum) is computed on every `addLegs` call, not in a selector, because it's needed synchronously.
> - **Cross-store communication**: `setOrder()` reads one store's state and writes to another using `getState()` — Zustand allows this without React context.
> - **Business rule enforcement**: Max 4 legs is enforced in the store, not the UI, so no matter how the action is dispatched, the invariant holds."

### Follow-up Q&A

**Q: Why not use Redux Toolkit?**
> "For this project, Redux would be over-engineering. I have 5 small stores, each under 30 lines. Zustand stores are just functions — no action types, no reducers, no providers. The `useBTDatePickerStore` is literally 6 lines. Redux Toolkit is great for large teams with complex middleware needs, but for a small team where each store is focused on one concern, Zustand's simplicity wins."

**Q: How do you test stores that depend on each other?**
> "Since Zustand stores are plain JavaScript, I can import them in tests and call actions directly: `useBTSelectedLegsStore.getState().addLegs(mockLeg)`, then assert on `useBTOrderStore.getState().order`. No React rendering needed. The stores are pure state machines."

---

## 4. Data Fetching & API Integration

**Job requirement:** *"API design and integration with databases and external services"*

### Script

> "Alpha-Seekers follows a clean frontend-to-API architecture. The Django backend exposes RESTful endpoints, and I built a centralized API integration layer:
>
> **Endpoint registry** — All 20+ endpoints live in `lib/fetchdata/apiURLs.ts`, grouped by feature: Greek Exposure, Backtesting, Live 0DTE, Gamma Dashboard. Renaming or versioning an endpoint is a single-file change.
>
> **Custom SWR hook** — `useCustomSWR` in `fetch-custom.ts` wraps `useSWR` with:
> 1. An Axios fetcher that automatically attaches Firebase auth tokens via `authHeaders(token)`
> 2. A **token-refresh-and-retry** pattern: on 401/403, it force-refreshes the token and retries once
> 3. Graceful session expiry on double failure — clears state, signs out, redirects to login with return URL
>
> ```typescript
> // Usage — this is all a page component needs:
> const { data, isLoading } = useCustomSWR(GAMMA_DASHBOARD_LEVELS_URL, params, { refreshInterval: 60000 });
> ```
>
> **Conditional fetching** — The Gamma Dashboard makes four cascading SWR calls: tickers -> dates -> expirations -> chart data. Each depends on the previous one. I use SWR's built-in conditional fetching — pass `null` as the URL to pause the request:
>
> ```typescript
> const { data: expData } = useCustomSWR(
>   selectedDate ? GAMMA_DASHBOARD_EXPIRATIONS_URL : null,  // null = don't fetch yet
>   selectedDate ? { und_symbol: ticker, date: selectedDate } : {}
> );
> ```
>
> This eliminates waterfall requests and prevents fetching with incomplete parameters."

### Code to Show

| What | File |
|------|------|
| Full custom SWR hook | `lib/fetchdata/fetch-custom.ts` — 73 lines total |
| Endpoint registry | `lib/fetchdata/apiURLs.ts` — 20+ endpoints organized by feature |
| Conditional fetching | `app/(protected)/gamma-dashboard/page.tsx:34-58` |

### Follow-up Q&A

**Q: Why SWR over React Query?**
> "SWR was the right fit for our use case: lightweight, stale-while-revalidate semantics ideal for financial data (data can be stale for up to 60 seconds), built-in deduplication (multiple components can call the same endpoint without duplicate requests), and conditional fetching by passing null. The API surface is small — `useSWR` with a custom fetcher is essentially the whole library. React Query has more features (mutations, optimistic updates, infinite queries), but we don't need them — our mutations go through a separate Axios POST, not through the data cache."

**Q: How do you handle the authentication header without repeating it everywhere?**
> "The token management is centralized in `auth-fetch-utils.ts`. The `getToken(forceRefresh)` function wraps `Auth.currentUser.getIdToken()` with retry logic for transient errors and session expiry detection. The `authHeaders(token)` function builds the `Authorization: Bearer` header. The SWR fetcher calls these utilities — page components never see tokens or headers. If I need to add a new auth-related header (like a CSRF token), I change one file."

---

## 5. Data Transformation & Visualization (ECharts)

**Job requirement:** *"Rendering graph-based data in alternative visual or structured representations to support analytical workflows"*

### Script

> "Data visualization is the core of Alpha-Seekers. I built an extensive charting layer using **ECharts** with three categories of visualizations:
>
> **1. Gamma Heatmap** (`EChartGamma_Heatmap_Opts.ts`) — The most complex transformation. Raw data arrives as an array of `{ saved_datetime, strike_price, spot_price, total_gamma }`. I transform it into a 2D matrix:
>
> ```
> Raw data -> filter strikes to +/-5% of spot -> extract unique timestamps & strikes
> -> build a Map<string, number> keyed by 'datetime-strike' -> project onto [timeIdx, strikeIdx, gamma]
> -> calculate divergent color bounds -> overlay spot price markLine
> ```
>
> The result is a heatmap where x-axis is time, y-axis is strike price, and color intensity represents gamma exposure — red for negative, blue for positive. The `visualMap` component uses a custom 11-stop divergent color scale centered on zero.
>
> **2. Greek Exposure Bar Chart** (`EChartToS_Opts.tsx`) — Stacked overlapping bars (call, put, total) by strike price, with dynamic mark lines at the current price and open price. Uses ECharts' dataset feature to separate data from visual encoding.
>
> **3. Live 0DTE Time Series** (`EChart0DTE_ExpoGreek_Opts.ts`) — Dual-axis line chart: total notional on the right y-axis, call/put notional on the left, time on x. The axis colors match the series colors for visual clarity.
>
> The key pattern across all charts: **data transformation is pure functions**. No React, no side effects. I can test any `_Opts.ts` file by passing mock data and asserting on the returned JSON structure."

### Code to Show

| What | File | Key Lines |
|------|------|-----------|
| Matrix construction & divergent color scale | `EChartGamma_Heatmap_Opts.ts` | 46–68 (Map to matrix), 109–132 (visualMap) |
| Multi-axis chart with overlapping bars | `EChartToS_Opts.tsx` | 12–174 (datasets, series, mark lines, dataZoom) |
| Dual-axis line chart | `EChart0DTE_ExpoGreek_Opts.ts` | 58–137 (dual yAxis with color-matched series) |
| Shared utilities | `UtilECharts.ts` | `formatNumbers` (K/M/B), `createXMarkLineData`, `commonOptions` |

### Follow-up Q&A

**Q: How do you handle large datasets in the browser?**
> "Three strategies: (1) **Server-side filtering** — the API returns only the data needed for the selected date/ticker/expiration. (2) **Client-side range filtering** — for the heatmap, I filter to +/-5% of spot price before building the matrix, which typically reduces 3000+ strikes to ~300. (3) **Interactive zooming** — every chart has `dataZoom` with both `inside` (scroll/pinch) and `slider` controls, so users explore without requesting new data. The options dashboard also refreshes on a 60-second `refreshInterval` via SWR, so data stays current during market hours."

**Q: Why ECharts over D3 or Recharts?**
> "ECharts supports the specific chart types we need — heatmaps, dual-axis line/bar combinations, overlapping bar series, interactive data zoom, mark lines — all declaratively via a JSON options object. D3 would give more control but requires imperative DOM manipulation that's harder to integrate with React's declarative model. Recharts is simpler but doesn't support heatmaps or the level of axis customization we need (dual axes with color-matched labels, shared toolbox with brush selection)."

---

## 6. Authentication & Security Hardening

**Job requirement:** *"Secure development practices"*

### Script

> "Security was a multi-phase effort tracked in TASK_LOG.md. I implemented a layered authentication system using Firebase Authentication integrated with a Django backend:
>
> **Phase 1: Token management** — The `AuthProvider` (`client-auth-provider.tsx`) uses Firebase's `onAuthStateChanged` listener. When a user signs in, I map the Firebase response to a typed `Tenant` object. The ID token is held in React state (memory only) — never persisted to localStorage. Only non-sensitive info (name, email, photo) goes to localStorage under the key `tenantInfo`.
>
> **Phase 2: Security hardening** — I fixed three categories of vulnerabilities:
> - **Open redirect**: After login, the app redirects users via a `redirect` query parameter. An attacker could craft `/signin?redirect=https://evil.com`. I wrote `isValidRedirect()` that rejects any path not starting with `/` or starting with `//` (protocol-relative URLs).
> - **Security headers** via `next.config.mjs`: HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, strict Referrer-Policy, and Permissions-Policy blocking camera/mic/geolocation.
> - **CORS middleware** (`middleware.ts`): Validates the `Origin` header against a whitelist — production domain in prod, localhost in dev.
>
> **Phase 3: Centralized config** — Auth settings were scattered across 4 files. I extracted everything into `lib/auth/config.ts`: route lists, storage keys, error codes, helper functions. Now adding a new protected route is a single-line change."

### Code to Show

| What | File |
|------|------|
| Open redirect prevention | `lib/auth/config.ts:83-92` — `isValidRedirect`, `getSafeRedirect` |
| Token never in localStorage | `client-auth-provider.tsx:88-97` — `TenantInfo` without token |
| Security headers | `next.config.mjs` — `headers()` function |
| CORS middleware | `middleware.ts:32-84` |
| Token refresh with retry | `lib/fetchdata/auth-fetch-utils.ts:31-67` |

### Follow-up Q&A

**Q: Walk me through the token refresh flow.**
> "When a page makes an API call, the SWR fetcher calls `getToken(false)` — this returns the cached Firebase token without a network call. If the API returns 401 or 403, the fetcher calls `getToken(true)` to force-refresh from Firebase, then retries the request once. If the retry also fails with an auth error, `handleSessionExpired()` signs out, clears localStorage, and redirects to `/authentication/signin?redirect=/current-page`. The user logs back in and lands right where they were.
>
> At the token layer, `getToken()` handles transient Firebase errors like `auth/network-request-failed` by retrying up to 2 times with linear backoff (1s, 2s). It only triggers session expiry for permanent errors like `auth/user-token-expired` or `auth/user-disabled`. This prevents a brief WiFi dropout from logging the user out."

**Q: How did you discover the open redirect vulnerability?**
> "I did a security review of the auth flow by tracing every place user input reaches the redirect. The sign-in page reads `searchParams.get('redirect')` and passes it to `router.push()`. Without validation, an attacker could send a phishing email with a link like `alpha-seekers.com/signin?redirect=https://evil.com/fake-login`. After the user enters real credentials, they'd be redirected to the attacker's site. The fix is 2 lines — check `path.startsWith('/') && !path.startsWith('//')` — but it closes a real OWASP Top 10 vulnerability."

---

## 7. Client-Side Caching & IndexedDB Data Pipeline

**Job requirement:** *"Data pipelines"*

### Script

> "For the Live 0DTE feature, the dataset is large — thousands of rows of options volume data per day. Fetching the full dataset on every page load would be slow and expensive. I built a **client-side caching layer** using Dexie (an IndexedDB wrapper):
>
> ```typescript
> // config/database-config.ts
> const database = new Dexie('alpha-seeker-database');
> database.version(1).stores({
>   volumeTable: 'saved_datetime_ms, uticker, uticker_last_price, data_details',
> });
> ```
>
> The data pipeline in `fetch-custom-save.ts` works like this:
>
> 1. **Check IndexedDB** — Is there cached data? Does the date and ticker match the current request?
> 2. **If match**: Query the server for just the *count* (`check_length: true`). If the count matches IndexedDB row count, serve from cache. If the server has more data, fetch only the delta (records newer than the last cached `saved_datetime_ms`) and merge via `bulkPut`.
> 3. **If no match**: Clear the cache (`truncateVolumeTable`), fetch the full dataset, bulk-insert into IndexedDB.
>
> This means after the first load, subsequent page visits are instant — the app reads from IndexedDB and only fetches incremental updates. It's essentially a **write-through cache with delta synchronization**."

### Code to Show

| What | File |
|------|------|
| Dexie schema | `config/database-config.ts` — full file |
| Cache-check pipeline | `lib/fetchdata/fetch-custom-save.ts:29-99` |
| Delta fetch logic | `fetch-custom-save.ts:57-72` — fetches only new records |

### Follow-up Q&A

**Q: How does this relate to data pipeline work in the job description?**
> "It's the same fundamental pattern as any data pipeline: source -> transform -> store -> serve. Here the source is a REST API, the store is IndexedDB, and the 'transform' is the delta-sync logic. In a server-side pipeline with Neo4J, I'd apply the same thinking — version tracking to detect what's changed, incremental processing to avoid re-fetching everything, and a clear data flow: ingest -> transform -> load."

**Q: How do you handle schema changes?**
> "Dexie uses versioned schemas. If I need to add a column, I bump `database.version(2).stores(...)` and Dexie handles the migration automatically on the client side. For breaking changes, I clear the cache. Since this is a cache (not a primary data store), losing it is a performance hit, not data loss."

---

## 8. Error Handling & Resilience

**Job requirement:** *"Robust, maintainable software solutions"*

### Script

> "I built multiple layers of error handling after encountering real production failures:
>
> **Layer 1 — Auth error recovery** (commit `650843a`): The SWR fetcher distinguishes auth errors (401/403) from other errors. Auth errors trigger token refresh and one retry. Only a double auth failure expires the session. Before this fix, a single expired token would crash every chart on the dashboard because SWR retried with the same bad token in an infinite loop.
>
> **Layer 2 — Transient error resilience** (commit `4a09c57`): After a laptop sleep, the Firebase SDK throws `auth/network-request-failed` when trying to refresh a token. My original code treated all token errors as 'session expired' and logged the user out. I categorized Firebase errors into two buckets:
>
> ```typescript
> // Permanent — session is dead, sign out
> SESSION_EXPIRED_ERROR_CODES = ['auth/user-token-expired', 'auth/user-disabled', 'auth/invalid-user-token'];
>
> // Transient — retry with backoff
> TRANSIENT_ERROR_CODES = ['auth/network-request-failed', 'auth/too-many-requests'];
> ```
>
> Transient errors retry up to 2 times with linear backoff (1s, 2s) before giving up.
>
> **Layer 3 — Component-level guards**: Chart components return early with loading states or 'No data available' messages. Every `_Opts.ts` function checks for empty data at the top and returns a fallback title. The Gamma Dashboard wraps all charts in a loader while dates are being fetched."

### Follow-up Q&A

**Q: Tell me about a bug that was hard to debug.**
> "The cascading auth failure bug (commit `4a09c57`) was the hardest. Users would open their laptop after sleep and the entire dashboard would be blank — no error, no loading indicator, just nothing. The root cause chain was: sleep -> WiFi reconnects -> Firebase token expired -> `getIdToken(true)` throws `network-request-failed` -> auth provider catches any error as session expiry -> signs user out -> all SWR hooks get null tokens -> all API calls fail -> render guards show nothing. The fix was adding error categorization and retry logic, but finding the root cause required tracing through 4 layers: Firebase SDK -> auth-fetch-utils -> fetch-custom -> SWR -> React component."

---

## 9. Refactoring Prototypes into Modular Code

**Job requirement:** *"Refactor existing scripts and prototype code into modular, reusable, and maintainable software components"*

### Script

> "The git history shows a clear refactoring arc. The initial prototype (commit `058f1f3`) was a working monolith. I systematically broke it into modules:
>
> **Auth centralization (3 phases)**:
> - Phase 1: Auth tokens were stored in localStorage in plain text. I moved them to memory-only React state.
> - Phase 2: Error handling was duplicated between `fetch-custom.ts` and `fetch-custom-save.ts`. I extracted shared logic into `auth-fetch-utils.ts` — 3 exported functions (`getToken`, `handleSessionExpired`, `authHeaders`) used by both fetchers.
> - Phase 3: Auth constants were scattered across 4 files (client-auth-provider, both fetch hooks, config/site). I created `lib/auth/config.ts` as a single source of truth: route lists, storage keys, error codes, helper functions. The original files now import from this module.
>
> **Chart component pattern**: Early charts had data fetching, data transformation, and rendering all in one component. I established the Component + Opts pattern with the Gamma Dashboard feature, then retroactively applied it to older charts. Now every chart is two files, each under 60 lines.
>
> **Fetch utility consolidation**: The two fetch hooks (standard + IndexedDB-cached) had duplicated auth logic. After extraction, each went from ~90 lines to ~55 lines with better error handling."

### Key Evidence from Git

| Commit | Change |
|--------|--------|
| `cd5c34a` | `refactor: centralize authentication configuration (Phase 3)` — 103 additions, 28 deletions, 4 files |
| `650843a` | Created `auth-fetch-utils.ts`, refactored both fetch modules |
| `f5bec8e` | `security: implement frontend auth security improvements (Phase 2)` — removed token from localStorage |
| `6c181e1` | `feat: add Gamma Dashboard` — established Component + Opts pattern |

### Follow-up Q&A

**Q: How do you decide what to refactor vs. rewrite?**
> "I refactor when the existing structure is sound but the code is scattered or duplicated. The auth centralization was a refactor — the logic was correct, it was just in 4 places instead of 1. I'd rewrite when the fundamental design is wrong — like if the auth flow had been synchronous instead of async, that would need a rewrite. In practice, I follow the 'rule of three': the first time I duplicate something, I note it; the second time, I extract it."

---

## 10. Git Workflow, Version Control & Change Tracking

**Job requirement:** *"Proficiency with version control systems (Git), including branching strategies, change tracking, and collaborative development workflows"*

### Script

> "I follow a disciplined Git workflow on this project:
>
> **Branching strategy**: Feature branches like `feature/auth-phase3`, `feature/auth-security-hardening`, `fix/dev-mode-setup`. I never commit directly to `main`. Each branch is scoped to one logical change.
>
> **Conventional commits**: Every commit uses a prefix — `feat:`, `fix:`, `security:`, `refactor:`, `docs:`. Examples:
> - `security: fix open redirect, add security headers, harden frontend`
> - `fix: prevent cascading auth/rendering failure on transient network errors`
> - `refactor: centralize authentication configuration (Phase 3)`
>
> **Atomic commits**: The auth security work was 3 phases, each on its own branch. Phase 2 had two sub-tasks (remove token from localStorage, add error handling) committed separately so each could be reviewed independently.
>
> **Change tracking**: I maintain `TASK_LOG.md` as a manual change ledger — date, time, task description, status, branch name, files modified. This supplements Git history with human-readable context about *why* changes were made.
>
> **PR-based workflow**: Major features came through Pull Requests — `#1 Major Updates`, `#2 Volume View`."

### Follow-up Q&A

**Q: How would you handle merge conflicts in a team environment?**
> "I'd first pull the latest main, then rebase my feature branch onto it to get conflicts early. For this project, the auth centralization was specifically designed to minimize future conflicts — by putting all auth config in one file, two developers working on different auth features would conflict in one predictable file rather than in scattered locations. That's a structural approach to conflict prevention."

**Q: How do you track changes across evolving document versions?** *(directly from job description)*
> "In Alpha-Seekers I use `TASK_LOG.md` to track every change with date, branch, and affected files — essentially a manual changelog. In a graph-database context, I'd track document versions as nodes with `SUPERSEDES` or `VERSION_OF` relationships, storing diffs as properties on the edge. The same mental model applies: track what changed, when, and why."

---

## 11. Responsive Design & Layout Architecture

### Script

> "The app uses Mantine's `AppShell` component for a responsive layout:
>
> ```typescript
> <AppShell
>   header={{ height: 60, collapsed: !pinned }}
>   navbar={
>     pathWithSideNavBar
>       ? { width: '60px', breakpoint: 'sm', collapsed: { mobile: !opened } }
>       : { width: '60px', breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }
>   }
> >
> ```
>
> **Route-aware sidebar**: The sidebar only appears on pages that need it (options data, backtest, gamma dashboard). I check `authorizedLinksList.includes(currentPath)` — if the user is on a public page like `/music`, the sidebar collapses entirely on desktop.
>
> **Auto-hiding header**: `useHeadroom({ fixedAt: 120 })` hides the header on scroll to maximize chart real estate, then reveals it when the user scrolls up.
>
> **Responsive charts**: The Gamma Dashboard uses `<Grid.Col span={{ base: 12, lg: 4 }}>` — on mobile, charts stack. On large screens, the levels bar chart gets 1/3 width and the heatmap + time series get 2/3."

---

## 12. Complex Interactive Feature — Backtesting Engine

**Job requirement:** *"Translate complex requirements into effective software solutions"*

### Script

> "The backtesting page is the most complex feature — it lets traders replay historical options data and simulate multi-leg order placement:
>
> 1. **Dual date picker** — Trade date + expiration date, managed via Zustand (`btDatePickerStore`)
> 2. **Time slider** — Scrubs through intraday data snapshots
> 3. **Option chain data table** — Built with `mantine-react-table`, featuring grouped columns (Calls | Strike | Puts), conditional ITM/OTM cell highlighting, and range-slider filtering by strike
> 4. **Click-to-build orders** — Click selects one leg; Ctrl+click adds a leg (up to 4) for multi-leg strategies like spreads and iron condors
> 5. **Order monitor** — Reads the Zustand order store and displays the assembled order with computed net cost
> 6. **Greek exposure charts** — Visualize gamma/delta/vanna for the selected date/time
>
> The architecture uses **Tabs** (`Mantine Tabs`) to switch between the chart view and the option chain + order entry view. State flows through Zustand stores, so the data table doesn't know about the order monitor — they communicate through the shared `useBTSelectedLegsStore`. This decoupling means I could replace the data table implementation without touching the order logic."

---

## 13. Behavioral (STAR) Stories

### Story 1: Debugging a Production Failure

**S:** Users reported the Alpha-Seekers dashboard going completely blank after their laptop woke from sleep.

**T:** I needed to diagnose why a transient network interruption was crashing the entire application.

**A:** I traced the error through 4 layers: Firebase SDK -> token refresh -> SWR fetcher -> React render guards. I discovered that `getIdToken(true)` was throwing `auth/network-request-failed` (transient), but the error handler treated ALL token errors as permanent, signing the user out. I categorized Firebase error codes into two groups (permanent vs transient), added retry with backoff for transient errors, and added null guards in render components.

**R:** Users can now close their laptops for hours, reopen, and the dashboard recovers automatically. The fix is in commit `4a09c57` and the retry logic in `auth-fetch-utils.ts:38-58`.

---

### Story 2: Security-First Refactoring

**S:** During a self-directed security review of the auth flow, I found that ID tokens were stored in `localStorage` (accessible to any XSS attack) and the redirect parameter was not validated (open redirect vulnerability).

**T:** Harden the authentication without breaking existing users.

**A:** I split the work into 3 phased PRs. Phase 1: Moved the token to memory-only React state. Phase 2: Added `isValidRedirect()` to prevent open redirects, strengthened password validation, and added security headers. Phase 3: Centralized all auth config into one module so future developers wouldn't scatter security-critical constants.

**R:** Eliminated 2 OWASP Top 10 vulnerabilities (XSS via localStorage token, open redirect), added 6 security headers, and reduced auth-related code duplication by ~40%. Tracked in TASK_LOG.md across 3 branches.

---

### Story 3: Building a Complex Data Visualization from Scratch

**S:** I wanted to add a SpotGamma-style gamma dashboard to visualize options market maker positioning.

**T:** Build three coordinated visualizations (levels chart, heatmap, time series) with filtering, date selection, and auto-refresh.

**A:** I designed the page with cascading SWR calls (ticker -> dates -> expirations -> data), so each filter change triggers the minimum necessary re-fetches. The heatmap required a non-trivial data pipeline: raw API data -> filter to +/-5% of spot -> build a Map for O(1) lookups -> project onto a 2D matrix -> calculate divergent color bounds. I separated each chart's rendering (React component) from its configuration (pure TypeScript function) for testability.

**R:** Delivered the full feature in commit `6c181e1` — 7 new files, all following the established Component + Opts pattern. The auto-refresh (60s interval) keeps the dashboard live during market hours, and the data filtering keeps render performance fast even with thousands of data points.

---

### Story 4: Building a Client-Side Caching Pipeline

**S:** The Live 0DTE page fetched thousands of rows of intraday volume data on every page load, making it slow for repeat visits during market hours.

**T:** Reduce load times for returning users without sacrificing data freshness.

**A:** I built a client-side caching layer using Dexie (IndexedDB wrapper). The pipeline checks local cache first, validates with a server-side count, and fetches only the delta (new records since the last cached timestamp). On cache miss or ticker change, it clears and refills from scratch.

**R:** After first load, subsequent visits are near-instant — IndexedDB reads are sub-millisecond. During active trading hours, only incremental updates are fetched. The pattern in `fetch-custom-save.ts` demonstrates the same source -> transform -> store -> serve model used in server-side data pipelines.

---

## 14. Bridging to Graph Databases (Neo4J)

*The job requires Neo4J experience. Here's how to connect your frontend data work to graph concepts.*

### Script for "Tell me about your experience with data modeling"

> "While my recent project uses relational data (PostgreSQL on the backend), the data transformations I do on the frontend are very similar to graph operations:
>
> - **The options chain is fundamentally a graph**: Each option contract is a node with properties (strike, expiration, greeks). Contracts are connected to underlying assets via relationships. The 'gamma exposure by strike' chart is essentially an aggregation across all nodes connected to a specific underlying, grouped by a property (strike price) — which maps directly to a Cypher query like `MATCH (o:Option)-[:FOR]->(u:Underlying) WHERE u.symbol = 'SPX' RETURN o.strike, sum(o.gamma)`.
>
> - **The heatmap data transformation** I do in `EChartGamma_Heatmap_Opts.ts` — building a Map keyed by `datetime-strike`, projecting into a matrix — is the same pattern as aggregating graph nodes along two dimensions and rendering them as a grid.
>
> - **Version tracking** in my `TASK_LOG.md` and the delta-sync in my IndexedDB cache map directly to the job's 'diffing and comparing document versions' requirement. In a graph model, I'd represent each document version as a node with `NEXT_VERSION` edges, and store diffs as edge properties.
>
> I'm eager to apply these data modeling instincts directly in Neo4J. I understand Cypher fundamentals and have studied graph data modeling patterns — I can ramp up quickly."

---

## 15. Summary Mapping Table

| Job Requirement | Alpha-Seekers Evidence | Key File |
|---|---|---|
| **React/Angular framework** | Next.js 14, 30+ components, App Router, route groups | `app/(protected)/gamma-dashboard/page.tsx` |
| **HTML, CSS, JavaScript/TypeScript** | Mantine UI, CSS Modules, TypeScript types throughout | `store/BTOrders/types.ts` |
| **Back-end integration (Flask ~ Django)** | 20+ API endpoints, custom SWR fetcher, auth pipeline | `lib/fetchdata/fetch-custom.ts` |
| **Data transformation** | Heatmap matrix, bar chart series, format utilities | `EChartGamma_Heatmap_Opts.ts` |
| **Data visualization** | 11 chart opts files, 3 chart types (bar, line, heatmap) | `components/ECharts/` |
| **Version control (Git)** | Feature branches, conventional commits, TASK_LOG.md | Git history |
| **SQA / Unit tests** | Jest + testing-library setup, pure-function opts are testable | `package.json` scripts |
| **Security** | Open redirect fix, CORS, security headers, token lifecycle | `lib/auth/config.ts` |
| **Refactoring** | 3-phase auth centralization, fetch utility extraction | Commits `f5bec8e`, `cd5c34a` |
| **Data pipelines** | IndexedDB cache with delta sync | `fetch-custom-save.ts` |
| **Collaborative workflows** | PR-based dev, descriptive commits, documentation | CLAUDE.md, TASK_LOG.md |
| **Graph data (bridgeable)** | Options chain = graph aggregation, version tracking | See Section 14 |
