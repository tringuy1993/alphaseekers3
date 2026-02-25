# Frontend Interview Prep — Full Stack Developer Position

> Talking points and scripts derived from the **alphaseekers3** codebase (Next.js 14 / React / TypeScript).
> Each section maps directly to a requirement from the job description.

---

## 1. Modern JavaScript Framework (React) — Component Architecture

### Script

> "In my project Alpha-Seekers, I built a financial options analytics platform using **Next.js 14 with the App Router**. The frontend is organized around a clear separation of concerns:
>
> - **Route-based pages** live under `app/`, using Next.js route groups like `(protected)/` to enforce authentication at the layout level.
> - **Reusable UI components** are in `components/` — things like a themed ECharts wrapper, a custom date picker, a responsive app shell, and authentication forms.
> - **Business logic** is extracted into custom hooks and utility modules under `lib/` and `store/`.
>
> For example, the **Gamma Dashboard** page (`app/(protected)/gamma-dashboard/page.tsx`) demonstrates a complex, data-driven UI: it cascades four pieces of dependent state (ticker → available dates → selected date → chart data), uses multiple `useEffect` hooks to manage initialization and reset cycles, and renders three coordinated chart components — a bar chart of gamma levels by strike, a time-series line chart, and a heatmap — inside a responsive grid layout. Each chart component follows a **separation of rendering and configuration** — the React component handles data fetching and lifecycle, while a companion `_Opts.ts` file builds the entire ECharts option object from raw data. This separation keeps the rendering layer thin and makes the chart configuration independently testable."

### Key files to reference
- `app/(protected)/gamma-dashboard/page.tsx` — complex page with cascading state, conditional fetching, responsive grid
- `components/ECharts/GammaDashboard/` — chart components + option builders split into separate files
- `components/ECharts/EChartThemed.tsx` — theme-aware wrapper component (Mantine → ECharts integration)
- `components/MainShell/MainAppShell.tsx` — responsive app shell with collapsible sidebar, route-aware navbar

### Follow-up Q&A

**Q: How do you decide when to split a component?**
> "I follow the principle of single responsibility. In Alpha-Seekers, every ECharts visualization is two files: a React component that handles data fetching and loading states, and an options builder that transforms API data into chart configuration. The React component is maybe 30 lines; the options builder is pure logic, no React dependency, so it could be unit tested with plain Jest. I also split when I see reuse — `EChartThemed` is a wrapper that reads Mantine's color scheme and passes it as the ECharts theme prop, so every chart in the app automatically respects dark mode without duplicating that logic."

**Q: Client components vs server components — how did you handle that in Next.js 14?**
> "Most of my pages are `'use client'` because they're interactive dashboards that need browser APIs — SWR for real-time data, Zustand for state, Firebase auth for tokens. But the layout hierarchy uses server components where possible. The `app/(protected)/layout.tsx` wraps child pages in an auth check without needing client-side JS. I also had to solve a real Next.js 14 gotcha: `useSearchParams` must be wrapped in a `<Suspense>` boundary or the production build fails — I discovered that during deployment and fixed it in `client-auth-provider.tsx` by splitting the provider into an inner component wrapped in Suspense."

---

## 2. Front-End Development — HTML, CSS, JavaScript/TypeScript

### Script

> "The project uses **TypeScript** throughout. I define explicit types for API responses, store state, and component props — for example, the backtesting store has typed interfaces for `OrderState`, `State`, and `Actions` in `store/BTOrders/types.ts`, which makes the Zustand store type-safe and self-documenting.
>
> For styling, I use a combination of **Mantine's component library** (which provides accessible, theme-aware primitives like `AppShell`, `Tabs`, `SegmentedControl`, `Grid`) and **CSS Modules** for custom overrides (e.g., `MainAppShell.module.css`, `SideBar.module.css`). I also use PostCSS for any Mantine-specific transforms.
>
> One concrete example: the **options data table** (`DataTable.tsx`) uses `mantine-react-table` to render a full option chain with grouped columns (Calls / Strike / Puts), conditional cell styling based on delta (ITM vs OTM highlighting), range-slider filtering on strike price, sticky headers, and click handlers that support both single-click and ctrl+click to build multi-leg option orders. The cell rendering adapts to the user's dark/light theme using `useMantineColorScheme`."

### Key files to reference
- `store/BTOrders/types.ts` — TypeScript interfaces for options order state
- `app/(protected)/backtest/BTOptionChain/DataTable.tsx` — advanced table with conditional rendering, grouped columns, interactive cell clicks
- `components/MainShell/MainAppShell.module.css` — CSS Modules for layout
- `components/ECharts/GammaDashboard/EChartGamma_Heatmap_Opts.ts` — strongly typed data transformation function

### Follow-up Q&A

**Q: How do you handle theming across the app?**
> "Mantine provides a `MantineProvider` with a color scheme (dark/light). I built a `ThemeToggle` component that lets users switch. For charts specifically, I created `EChartThemed` — a wrapper that reads the current Mantine color scheme and passes it to ECharts as its theme, so bar colors, background colors, and axis labels all flip automatically. For the option chain data table, I read `colorScheme` and conditionally set cell backgrounds — ITM options get a blue tint, which changes shade between dark and light mode."

---

## 3. API Design and Integration with Back-End Services

### Script

> "Alpha-Seekers follows a clean **frontend → API → backend** architecture. The Django backend exposes RESTful endpoints, and I built a centralized API layer on the frontend:
>
> - **All endpoints** are defined as constants in `lib/fetchdata/apiURLs.ts` — grouped by feature (Greek Exposure, Backtesting, Live 0DTE, Gamma Dashboard). This single source of truth means renaming or versioning an endpoint is a one-file change.
> - **Data fetching** is handled by a custom SWR hook (`useCustomSWR` in `fetch-custom.ts`). It wraps `useSWR` with an Axios fetcher that automatically attaches Firebase auth tokens, handles 401/403 errors with a token-refresh-and-retry pattern, and gracefully expires sessions on double failures.
> - **The fetcher is reusable** — every protected page just calls `useCustomSWR(SOME_URL, params)` and gets back `{ data, isLoading, isError }`. There's no auth boilerplate in page components.
>
> For example, the Gamma Dashboard makes four different SWR calls — tickers, dates, expirations, and chart data — each with conditional keys (pass `null` as the URL to skip the call until dependencies are ready). This is SWR's built-in conditional fetching pattern and avoids waterfall requests."

### Key files to reference
- `lib/fetchdata/apiURLs.ts` — centralized API endpoint definitions (20+ endpoints)
- `lib/fetchdata/fetch-custom.ts` — custom SWR hook with Axios, auth headers, 401 retry logic
- `lib/fetchdata/auth-fetch-utils.ts` — token management with retry/backoff, session expiry handling
- `app/(protected)/gamma-dashboard/page.tsx` — multiple conditional SWR calls with cascading dependencies

### Follow-up Q&A

**Q: How do you handle API errors and retries?**
> "I built a layered retry strategy. At the token level, `getToken()` in `auth-fetch-utils.ts` retries transient Firebase errors (like `auth/network-request-failed`) up to 2 times with linear backoff. At the API call level, if the backend returns a 401 or 403, the Axios fetcher force-refreshes the token and retries the request once. If the retry also fails with an auth error, I call `handleSessionExpired()` which signs the user out of Firebase, clears localStorage, and redirects to the login page with a return URL so they land back where they were. This prevents cascading errors — before I added this, a single expired token would crash the entire dashboard because SWR would keep retrying with the same bad token."

**Q: Why SWR over React Query?**
> "SWR fit our use case well — it's lightweight, has built-in conditional fetching (pass null to pause), stale-while-revalidate semantics for real-time financial data (we set a 60-second refresh interval on the options dashboard), and deduplifies requests when multiple components use the same key. The API surface is minimal, which means less code to maintain."

---

## 4. Version Control (Git) — Branching, Change Tracking, Collaborative Workflows

### Script

> "I follow a disciplined Git workflow on this project. Looking at the commit history:
>
> - **Feature branches** like `feature/auth-phase3`, `feature/auth-security-hardening`, `fix/dev-mode-setup` — I never commit directly to `main`.
> - **Atomic, well-scoped commits** — each commit addresses one concern. For example, the auth security work was split into Phase 2 (remove token from localStorage, add error handling) and Phase 3 (centralize auth configuration), each on separate branches, each merged independently.
> - **Descriptive commit messages** using conventional commit prefixes: `feat:`, `fix:`, `security:`, `refactor:`, `docs:`. Examples: `'security: fix open redirect, add security headers, harden frontend'`, `'fix: prevent cascading auth/rendering failure on transient network errors'`.
> - I maintain a **TASK_LOG.md** that tracks every task with date, status, branch name, and files modified — which is essentially a manual change management ledger alongside Git.
>
> The project also demonstrates **PR-based workflow** — the early major features came through Pull Requests (#1 'Major Updates', #2 'Volume View')."

### Key evidence from git log
- Conventional commit messages: `feat:`, `fix:`, `security:`, `refactor:`, `docs:`
- Feature branch workflow: `feature/auth-phase3`, `fix/dev-mode-setup`
- PR-based development: commits `058f1f3` (#1), `d455d8a` (#2)
- `TASK_LOG.md` — manual change tracking with dates, branches, file lists

### Follow-up Q&A

**Q: How do you handle code reviews?**
> "For this project I'm the primary developer, but I've structured the workflow as if it were a team project — PRs, descriptive commit messages, task logging. When I do the security hardening work, I split it into phased branches specifically so each phase could be reviewed independently. The commit for 'centralize authentication configuration (Phase 3)' touched 4 files and consolidated scattered auth logic into a single `lib/auth/config.ts`. If a reviewer were looking at that PR, they'd see a clear before/after: magic strings and duplicated constants replaced by a single, typed config module."

---

## 5. Data Transformation and Visualization

### Script

> "A core part of Alpha-Seekers is transforming raw options data from the API into meaningful visualizations. I built an extensive charting layer using **ECharts** (via `echarts-for-react`):
>
> - **Greek Exposure Charts** (`EChartToS_Opts.tsx`): Transform raw option chain data into stacked bar charts showing call/put gamma exposure by strike price, with dynamic mark lines for key price levels (spot price, zero-gamma level).
> - **Gamma Heatmap** (`EChartGamma_Heatmap_Opts.ts`): Take time-series gamma data, filter strikes to ±5% of spot price, build a 2D matrix `[timeIndex, strikeIndex, gammaValue]`, calculate divergent color scales (red for negative, blue for positive), and overlay a spot-price mark line. This is a non-trivial data pipeline: filter → deduplicate → build lookup map → project onto grid → calculate color bounds.
> - **Utility functions** (`UtilECharts.ts`): Reusable helpers for number formatting (K/M/B suffixes), series creation, mark lines, min/max calculations, array-to-key-map transformations.
>
> The key pattern is that **all data transformation is pure functions** — no React, no side effects. The `_Opts.ts` files take raw data and return a complete ECharts option object. This makes them easy to test and easy to reason about."

### Key files to reference
- `components/ECharts/GammaDashboard/EChartGamma_Heatmap_Opts.ts` — matrix construction, color scales, filtering
- `components/ECharts/ToS/EChartToS_Opts.tsx` — multi-axis chart configuration
- `components/ECharts/UtilECharts.ts` — reusable data utilities (formatNumbers, create_series, markLine builders)
- `components/ECharts/DataEChart.ts` — data model transformations (GetModifiedToSData, GetAllModifiedToSData)

### Follow-up Q&A

**Q: How do you handle large datasets in the browser?**
> "Options data can be dense — thousands of strike prices across dozens of expirations. For the heatmap, I filter to ±5% of the spot price before building the matrix, which dramatically reduces the data volume. ECharts also supports `dataZoom` with both inside (scroll) and slider interactions, so users can zoom into specific time ranges without loading new data. For the main Greek exposure chart, we use SWR's refresh interval (60 seconds) so the dashboard stays current during market hours without hammering the API."

---

## 6. State Management

### Script

> "I use **Zustand** for client-side state management. Zustand was a deliberate choice over Redux — it's minimal boilerplate, doesn't require providers or context wrappers for every store, and plays well with TypeScript.
>
> The backtesting feature shows the most sophisticated state management. There are two interconnected stores:
>
> - `useBTSelectedLegsStore` — tracks up to 4 option legs selected from the data table, with a running price sum. The `addLegs` action enforces a max of 4 legs, and `setOrder` pushes the current legs to the order store.
> - `useBTOrderStore` — holds the finalized order with legs and computed cost.
>
> The interaction flow is: user ctrl+clicks cells in the option chain table → `addLegs` action adds to the selected legs store → user confirms → `setOrder` transfers to the order store → `BTOrderMonitor` component reads the order store and displays it.
>
> There are also stores for date picker state (`btDatePickerStore`), time slider state (`btTimePickerStore`), and Live 0DTE state — each is a small, focused Zustand store."

### Key files to reference
- `store/BTOrders/btSelectedLegStore.ts` — multi-leg options order store with derived state (price sum)
- `store/BTOrders/types.ts` — TypeScript types for the store
- `store/btDatePickerStore.ts`, `store/btTimePickerStore.ts` — simple UI state stores
- `store/Live0DTE/live0DTEStore.ts` — live data selection store

### Follow-up Q&A

**Q: Why Zustand over React Context for this?**
> "Context re-renders every consumer when any value changes. With Zustand, components subscribe to specific slices of state. In the backtesting flow, the `DataTable` only subscribes to `addLegs` and `removeAllLegs` — it doesn't re-render when the order monitor reads `legsPriceSum`. For a data-heavy dashboard where multiple charts and tables are on screen, this granular subscription model prevents unnecessary re-renders. Zustand also lets you read state outside of React — `setOrder` uses `useBTSelectedLegsStore.getState()` to cross-reference stores without needing a React component context."

---

## 7. Authentication & Security

### Script

> "Security was a major focus. I implemented a **multi-layered authentication system** using Firebase Authentication integrated with a Django backend:
>
> 1. **Auth Context Provider** (`client-auth-provider.tsx`): Uses `onAuthStateChanged` to track Firebase auth state. Maps Firebase user data to a `Tenant` type. Stores only non-sensitive info (name, email, photo) in localStorage — the token is never persisted, it's always fetched from Firebase's SDK at request time.
>
> 2. **Open Redirect Prevention** (`lib/auth/config.ts`): The `getSafeRedirect()` function validates redirect paths — it rejects anything that doesn't start with `/` or starts with `//` (protocol-relative URLs). This prevents attackers from crafting login URLs that redirect to malicious sites after authentication.
>
> 3. **CORS Middleware** (`middleware.ts`): Validates the `Origin` header against a whitelist (production domain or localhost in dev). Blocks cross-origin requests from unauthorized sources.
>
> 4. **Security Headers** via `next.config.mjs`: CSP, X-Frame-Options, and other headers to prevent XSS and clickjacking.
>
> 5. **Token Lifecycle** (`auth-fetch-utils.ts`): Tokens are cached in Firebase's SDK, refreshed only on 401/403, and transient errors (network failures) trigger retry with backoff rather than logging the user out."

### Key files to reference
- `app/authentication/client-auth-provider.tsx` — Firebase auth context with safe localStorage
- `lib/auth/config.ts` — centralized auth config with open-redirect prevention
- `lib/fetchdata/auth-fetch-utils.ts` — token retry with backoff, session expiry
- `middleware.ts` — CORS validation
- `components/Authentication/SignIn.tsx` — safe redirect after login

### Follow-up Q&A

**Q: How did you prevent the open redirect vulnerability?**
> "After login, the app redirects users to where they came from using a `redirect` query parameter. An attacker could craft a URL like `/signin?redirect=https://evil.com`. My `isValidRedirect` function checks that the path starts with `/` but not `//`, which blocks absolute URLs and protocol-relative URLs. This was caught during a security review I did of the auth flow."

---

## 8. Refactoring — Scripts to Modular, Maintainable Code

### Script

> "The git history shows clear refactoring progression. The initial codebase (commit `058f1f3`, ~5300 lines) was a working prototype. Over subsequent commits, I refactored it into a modular architecture:
>
> - **Auth centralization** (Phase 3, commit `cd5c34a`): Auth-related constants were scattered across `client-auth-provider.tsx`, `fetch-custom.ts`, `fetch-custom-save.ts`, and `config/site.ts`. I extracted everything into `lib/auth/config.ts` — route lists, storage keys, error codes, redirect helpers — then updated all consumers. This reduced duplication and created a single place to update when routes or auth behavior changes.
>
> - **Fetch utility extraction** (commit `650843a`): Token management, session handling, and auth headers were duplicated between `fetch-custom.ts` and `fetch-custom-save.ts`. I extracted shared logic into `auth-fetch-utils.ts` — `getToken`, `handleSessionExpired`, `authHeaders` — reducing the two fetch modules from ~90 lines each to ~55 lines each while adding retry logic.
>
> - **Chart component pattern**: Every chart follows the same pattern — a React component file + an options builder file. This wasn't the original structure; I established it with the Gamma Dashboard feature and it became the template for all charts."

### Key evidence from git log
- `cd5c34a refactor: centralize authentication configuration (Phase 3)` — 103 additions, 28 deletions across 4 files
- `650843a fix: fix auth session persistence` — created `auth-fetch-utils.ts`, refactored 2 existing files
- `components/ECharts/GammaDashboard/` — 7 files following consistent Component + Opts pattern

---

## 9. Error Handling & Resilience

### Script

> "I built multiple layers of error handling to prevent a single failure from crashing the dashboard:
>
> - **Global Error Boundary** (`app/error.tsx`): Next.js 14 error boundary that catches unhandled errors and shows a 'Try Again' button with a link to the home page.
> - **Auth Error Recovery**: The SWR fetcher distinguishes between auth errors (401/403) and other errors. Auth errors trigger token refresh and one retry. Only a double auth failure triggers session expiry. Transient Firebase errors (network failures) trigger retry with backoff rather than immediately logging the user out.
> - **Component-Level Resilience**: Chart components return early with loading states or 'no data' messages. The Gamma Dashboard shows a centered `<Loader>` while dates are loading, and each chart options builder returns a 'No data available' title if the data array is empty.
> - **Cascading Failure Prevention** (commit `4a09c57`): This was a real bug — a transient network error during token refresh would cause the auth provider to lose the user's session, which would cascade into all SWR hooks failing, which would crash the rendering. I fixed it by categorizing Firebase error codes into 'session expired' vs 'transient' and only expiring the session for permanent errors."

---

## 10. Complex Interactive Feature — Backtesting Options Orders

### Script

> "The **backtesting page** (`app/(protected)/backtest/`) is the most interactive feature in the app. It lets traders replay historical options data and simulate order placement:
>
> 1. **Date picker** with dual dates (trade date + expiration) managed via Zustand store
> 2. **Time slider** that scrubs through intraday data
> 3. **Option chain data table** with mantine-react-table — grouped by expiration, conditional ITM/OTM highlighting, range-slider filtering by strike price
> 4. **Click-to-build orders**: Single click selects one leg; Ctrl+click adds a leg (up to 4) for multi-leg strategies like spreads and iron condors
> 5. **Order monitor** reads the Zustand store and displays the assembled order with computed cost
> 6. **Charts** visualize the Greek exposure for the selected date/time
>
> This demonstrates my ability to build complex, interactive UIs with coordinated state across multiple components. The state flows through Zustand stores, keeping components decoupled — the data table doesn't know about the order monitor; they communicate through the shared store."

### Key files to reference
- `app/(protected)/backtest/page.tsx` — page orchestration with Tabs
- `app/(protected)/backtest/BTOptionChain/DataTable.tsx` — interactive table with click handlers
- `app/(protected)/backtest/BTOrder/BTOrderMonitor.tsx` — reads order from Zustand
- `app/(protected)/backtest/BTOrder/OrderEntry.tsx` — order entry form
- `store/BTOrders/btSelectedLegStore.ts` — multi-store coordination

---

## 11. Responsive Design & Accessibility

### Script

> "The app is responsive across desktop and mobile:
>
> - **Mantine AppShell** (`MainAppShell.tsx`): The sidebar collapses on mobile, the header uses `useHeadroom` to auto-hide on scroll, and the navbar uses `visibleFrom='sm'` for desktop nav links with a `Burger` menu on mobile.
> - **Responsive Grid** (`Grid.Col span={{ base: 12, lg: 4 }}`): The Gamma Dashboard uses Mantine's responsive grid — charts stack vertically on mobile and arrange side-by-side on desktop.
> - **Route-Aware Sidebar**: The sidebar only appears on pages that need it (options data, backtest, etc.), determined by checking the current path against `authorizedLinksList`. Public pages like the music game get full-width layouts."

---

## Summary: How This Project Maps to the Job Description

| Job Requirement | Alpha-Seekers Evidence |
|---|---|
| React framework, front-end development | Next.js 14, 20+ React components, App Router, Client/Server components |
| HTML, CSS, JavaScript/TypeScript | Mantine UI, CSS Modules, TypeScript throughout, styled data tables |
| Back-end integration (Flask ≈ Django) | 20+ API endpoints, custom SWR fetcher, auth-protected data pipeline |
| Data transformation & visualization | ECharts heatmaps, time series, bar charts; matrix computation, filtering |
| Version control (Git) | Feature branches, conventional commits, PR workflow, TASK_LOG.md |
| Unit tests & SQA | Jest + testing-library setup, Storybook for component development |
| Security | Firebase auth, open redirect prevention, CORS, security headers, token lifecycle |
| Refactoring prototypes → modular code | Auth centralization (3 phases), fetch utility extraction, chart component patterns |
| Collaboration & documentation | CLAUDE.md project guide, TASK_LOG.md change ledger, descriptive commits |
