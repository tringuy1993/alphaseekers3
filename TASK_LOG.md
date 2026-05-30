# Task Log - alphaseekers3 (Frontend)

This document tracks all tasks performed on the alphaseekers3 Next.js frontend. **Review this log before starting any new task.**

---

## Task History

### 2026-05-29

| Date | Time | Task | Status | Branch | Notes |
|------|------|------|--------|--------|-------|
| 2026-05-29 | 23:59 PDT | T4 options-data-flow intraday replay control | Complete | `main` | Added a Profile Time selector backed by the new snapshots API, passes `snapshot_minute` to expirations, strike ladder, and intraday GEX requests, displays selected profile times in market ET, and keeps live refresh only for the latest unpinned session. Verified focused prettier and `corepack yarn build`; full typecheck still fails on known pre-existing project-wide errors outside the touched files. |

### 2026-05-28

| Date | Time | Task | Status | Branch | Notes |
|------|------|------|--------|--------|-------|
| 2026-05-28 | 22:00 PDT | T2 protected Options Data Flow page | Complete | `main` | Added `/options-data-flow`, sidebar/auth config, options-flow API constants, `lightweight-charts@5.2.0`, live SWR refresh for latest sessions, and a strike ladder with baseline/adjusted lines plus signed flow histogram. Verified `yarn build` and local route compile at `http://localhost:3002/options-data-flow`. |

### 2026-05-14

| Date | Time | Task | Status | Branch | Notes |
|------|------|------|--------|--------|-------|
| 2026-05-14 | - | Bump Storybook 7 → 10 for Next 15 + React 19 (working `yarn storybook` + build) | Complete | `chore/storybook-7-to-8` | Multi-major: **7.5.2 → 8.6.18 → 9.1.20 → 10.4.0** (Storybook enforces one major at a time; ran `npx storybook@N upgrade` three times). Used a `/tmp/yarnbin/yarn` PATH shim because `corepack enable` was blocked by EACCES on this server. **Critical at v10**: framework switched from `@storybook/nextjs` (webpack) → **`@storybook/nextjs-vite`** (Vite). This bypasses the `Cache.shutdown` webpack-hook incompatibility between `@storybook/builder-webpack5` and Next 15's bundled webpack that blocked v8 and v9 (`SB_BUILDER-WEBPACK5_0002: Cannot read properties of undefined (reading 'tap')`). Storybook automigrations consolidated essentials into core at v9: removed `@storybook/addon-essentials`, `@storybook/blocks`, `@storybook/react`; replaced by `@storybook/addon-docs@10.4.0`. Added `eslint-plugin-storybook@10.4.0` (with `plugin:storybook/recommended` added to `.eslintrc.cjs`). Bumped `storybook-dark-mode` ^3.0.1 → ^5.0.0 (v5 requires SB 10). Removed legacy `@storybook/addon-styling-webpack@^0.0.5` (nextjs-vite handles CSS/PostCSS natively). Config auto-migrated: `.storybook/main.ts` (framework + addons), `.storybook/preview.tsx` (`storybook/preview-api` consolidated import), `.eslintrc.cjs`. **Closes all SB-related peer warnings** from the May 2026 security upgrade. Remaining pre-existing peer: `embla-carousel-react@^7` wants React 16-18 (transitive via `@mantine/carousel@7.17.8` — Mantine, not Storybook). **Verified**: `yarn install` clean; `yarn storybook:build` ✓ Vite built in 6.61s, 1122 modules transformed, output in `storybook-static/`. Storybook is dev-only, not shipped to production. |
| 2026-05-14 | - | Migrate `next lint` → `eslint .` (Next 16 deprecation) | Complete | `chore/next-lint-to-eslint-cli` | Replaces `next lint && npm run lint:stylelint` → `eslint --ext .ts,.tsx app components lib store middleware.ts && npm run lint:stylelint`. Removes the "next lint is deprecated in Next 16" warning. Official codemod (`@next/codemod next-lint-to-eslint-cli`) **failed** — it invokes `@eslint/migrate-config` which produces a flat config using `require("eslint/config")`, an ESLint 9 API unavailable on this project's `eslint@8.57.1`. Bumping ESLint 8→9 would cascade (`@typescript-eslint/*` 6→8, `eslint-config-airbnb` has no ESLint-9 release, etc.) — out of scope for a deprecation fix. This change keeps `.eslintrc.cjs` legacy config + `eslint@8.57.1` and just swaps the CLI. **Side-effect**: `yarn lint` now reports ~8043 issues vs 811 with `next lint` — 7820 are `linebreak-style` (same pre-existing Airbnb-config CRLF/LF rule; `eslint` loads more rules from the existing `mantine` extends than `next lint` was applying). Suppressed by `next.config.mjs` `eslint.ignoreDuringBuilds: true` — no production impact. `.eslintignore` extended with `.next/` and `.yarn/`. Full flat-config + ESLint 9 migration deferred to a separate task. |
| 2026-05-14 | - | Patch May 2026 Next.js security advisory (13 CVEs) — major upgrade to Next 15.5.18 + React 19.2.6 | Complete | `feature/nextjs-may2026-security` | Patches all 13 advisories in Vercel's May 2026 coordinated release (5× middleware/proxy auth-bypass, 3× DoS incl. React **CVE-2026-23870**, 1× SSRF, 2× cache-poisoning, 2× XSS). Next 13.x/14.x get **no patch** — major upgrade is Vercel's only complete mitigation. **Bumps:** `next` 14.2.35→15.5.18 (exact); `react`/`react-dom` 18.2.0→^19.2.6; `@next/bundle-analyzer` ^14→^15.5.18; `@next/eslint-plugin-next` ^16→^15.5.18 (aligns to Next major); `@tabler/icons-react` ^2.46→^3.44.0 (v2 peer excluded React 19); `@types/react` →^19.2.14, **added** `@types/react-dom` ^19.2.3; `@testing-library/react` ^14→^16.3.2 + `@testing-library/dom` ^9→^10.4.1 (v14/v9 incompat with React 19). Removed stray committed `package-lock.json` (project is yarn@4). **Not bumped** (peer-deps verified compatible): `@mantine/*` (^7.4.x → 7.17.8, peer `^18 \|\| ^19`), `mantine-react-table` (already on 2.0.0-beta.9, highest v2 — the runbook's `@latest` would have *downgraded* it to v1.3.4/Mantine 6), `@emotion/react`, `echarts-for-react`. Storybook 7.x deferred (dev-only, expected `@storybook/nextjs`/`@storybook/blocks` peer warnings — follow-up to bump to Storybook 8). **Code changes: NONE** — exhaustive codebase scan found zero Next 15 / React 19 breaking-change patterns (no `next/headers` imports, no `propTypes`/`defaultProps`/`ReactDOM.render`/`useFormState`, no `react-dom/test-utils`, no `useRef()` no-arg, no `@next/font`, no `legacyBehavior`, no server-side `fetch()` in `app/`, no `forwardRef`). **Verified:** `yarn build` ✓ (Next 15.5.18, all 14 routes, 16 static pages, 35.2s); `yarn start` smoke ✓ (`/`→307 /options-data; `/about`/`/live0dte`/`/music`/`/options-data`/`/authentication/signin`→200; hostile `Origin`→400 via middleware; security headers all present); `yarn jest` runs (no tests exist — pre-existing); 334 TS errors + 811 lint errors are all **pre-existing** (suppressed by `next.config.mjs` `ignoreBuildErrors`+`ignoreDuringBuilds`, zero reference React/Next types or `@next/*` rules). Runbook: `docs/NEXTJS_MAY2026_SECURITY_PATCH.md`. Production deploy GATED pending PR review. Ref: <https://vercel.com/changelog/next-js-may-2026-security-release> |

---

### 2026-04-28

| Date | Time | Task | Status | Branch | Notes |
|------|------|------|--------|--------|-------|
| 2026-04-28 | - | Fix 60-min logout on /options-data — proactive token refresh | Complete | `fix/proactive-token-refresh` | `app/authentication/client-auth-provider.tsx`: swapped `onAuthStateChanged` → `onIdTokenChanged` so tenant.idToken tracks every silent refresh; added a `useEffect` that force-refreshes the ID token every 50 min and on `visibilitychange` (fixes laptop-sleep / backgrounded-tab class of bugs that reactive 401/403 retries had been chasing since Feb). `lib/fetchdata/auth-fetch-utils.ts`: changed `getToken` return type to a tagged `TokenResult` (`{ ok: true, token } \| { ok: false, reason: 'no-user' \| 'network' }`) so callers can distinguish exhausted-retry-on-network from real session expiry. `lib/fetchdata/fetch-custom.ts` and `fetch-custom-save.ts`: now throw a recoverable network error (lets SWR retry) instead of calling `handleSessionExpired` when force-refresh fails for transient reasons. Verified zero new type errors in touched files; prettier clean. |

---

### 2026-01-21

| Date | Time | Task | Status | Branch | Notes |
|------|------|------|--------|--------|-------|
| 2026-01-21 | - | Phase 3: Centralized Auth Config | Complete | `feature/auth-phase3` | Created lib/auth/config.ts with centralized auth settings |
| 2026-01-21 | - | Phase 2: Frontend Security Hardening | Complete | `feature/auth-security-hardening` | See details below |

#### Phase 2: Frontend Security Hardening (2026-01-21)

**Task 2.1: Remove token from localStorage**

*Files modified:*
- `app/authentication/context.tsx` - Added `TenantInfo` interface (without token) for safe localStorage storage
- `app/authentication/client-auth-provider.tsx` - Changed localStorage key from `'tenant'` to `'tenantInfo'`, only stores non-sensitive data

**Task 2.2: Add token refresh error handling**

*Files modified:*
- `lib/fetchdata/fetch-custom.ts` - Added `handleSessionExpired()` function, handles auth errors by redirecting to login
- `lib/fetchdata/fetch-custom-save.ts` - Same changes for IndexedDB-cached fetch hook

---

### 2026-01-16

| Date | Time | Task | Status | Branch | Notes |
|------|------|------|--------|--------|-------|
| 2026-01-16 | 19:00 | Deploy to production | Complete | `main` | Added switch-env.sh, built with prod env, restarted PM2 |
| 2026-01-16 | 18:00 | Fix critical dev mode issues | Complete | `fix/dev-mode-setup` | Fixed: apiURLs.ts (env var), next.config.mjs (comments, strictMode), middleware.ts (CORS typo, comments). Local testing passed. |
| 2026-01-16 | 16:45 | Create .env.example | Complete | - | Template for environment variables |
| 2026-01-16 | 16:35 | Create CLAUDE.md | Complete | - | Project instruction file for Claude Code |

---

## Pending Tasks

| Priority | Task | Added Date | Notes |
|----------|------|------------|-------|
| HIGH | Fix TypeScript errors (334 reported by `yarn typecheck` as of 2026-05-14) | 2026-01-16 | Mostly implicit `any` (TS7006/7031) in `components/ECharts/`, `components/Music/`, `lib/database/`, `store/Live0DTE/`, `theme.ts`. Suppressed by `next.config.mjs` `typescript.ignoreBuildErrors: true`. |
| LOW | Fix ESLint warnings (811 reports; ~786 are `linebreak-style` CRLF/LF config noise) | 2026-01-16 | Suppressed by `next.config.mjs` `eslint.ignoreDuringBuilds: true`. ~25 real code issues (`object-shorthand`, `dot-notation`, `no-use-before-define`, `no-unused-vars`). |
| LOW | Full flat-config migration + bump ESLint 8.57 → 9 | 2026-05-14 | Deferred from the `next lint` → `eslint .` migration (`chore/next-lint-to-eslint-cli`, 2026-05-14). The `@next/codemod next-lint-to-eslint-cli` codemod generates flat config using `require("eslint/config")` (ESLint 9 API). Bumping to ESLint 9 cascades: `@typescript-eslint/*` 6→8, `eslint-config-airbnb` has no ESLint-9 release (would need replacing), and other plugins. Do this when Next 16 actually requires it. |

---

## Notes

- **Latest entries go at the top** of each date section
- Always include the branch name for code changes
- Update parent [TASK_LOG.md](../docs/TASK_LOG.md) for high-level tracking
