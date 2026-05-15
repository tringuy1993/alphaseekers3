# Next.js May 2026 Security Release — Patch Runbook (alphaseekers3)

| | |
|---|---|
| **Status** | ✅ Complete (2026-05-14) — Phase 5 deploy gated pending PR review · see §10 Outcome |
| **Created** | 2026-05-14 |
| **Reference** | <https://vercel.com/changelog/next-js-may-2026-security-release> |
| **Current** | `next@14.2.35`, `react@18.2.0`, `react-dom@18.2.0` |
| **Target** | `next@15.5.18`, `react@^19.2.6`, `react-dom@^19.2.6` |
| **Effort** | **Major upgrade** — Next 14 → 15 *and* React 18 → 19. Plan ~0.5–2 days incl. testing. |
| **Risk** | Medium–High (two coordinated major bumps; Mantine/ECharts/Storybook fallout likely) |

> **Why this is the bigger of the two project patches:** the May 2026 advisory states that
> **every 13.x and 14.x release is affected and there is no patched 14.x line.** The only
> supported fix for this app is a major-version upgrade. `next@14.2.35` cannot be made safe
> with a patch bump.

---

## 1. The release

A coordinated release of **13 advisories** (one is the upstream React **CVE-2026-23870**).
Fixed versions:

- **Next 13.x / 14.x** — *all versions affected* → upgrade to **15.5.18** or 16.2.6
- Next 15.x ≤ 15.5.17 → 15.5.18 · Next 16.x ≤ 16.2.5 → 16.2.6
- **React `react-server-dom-*`** — 19.2.x ≤ 19.2.5 → **19.2.6** (also 19.0.x→19.0.6, 19.1.x→19.1.7)

Categories: 5× middleware/proxy auth-bypass, 3× DoS, 1× SSRF, 2× cache-poisoning, 2× XSS.
Vercel's guidance: **patching is the only complete mitigation** — WAF rules do not reliably block these.

We target **15.5.18** (one major jump, smaller blast radius). 16.2.6 is the alternative if you'd
rather absorb both majors at once — if so, also bump `@next/*` packages to `^16` and require Node 20+.

## 2. Applicability to alphaseekers3

Audited 2026-05-14. ✅ exploitable today · ⚠️ conditional · ⓥ affected by version, no exploitable
usage in current code · — not applicable.

| Advisory (severity) | Verdict | Notes |
|---|---|---|
| App Router segment-prefetch auth bypass ×2 (High) | ⓥ | `middleware.ts` enforces CORS-origin + a root redirect, **not** authorization. The `redirectToLogin()` helper (`middleware.ts:12-27`) is **dead code** — never called. Route auth is client-side (`app/authentication/RequireAuth.tsx`). A bypass skips the CORS 400, not a login gate. |
| Dynamic route parameter injection bypass (High) | ⓥ | Same as above — middleware is not an auth gate. |
| Pages Router i18n default-locale bypass (High) | — | App Router; no Next i18n. |
| Middleware redirects can be cache-poisoned (Low) | ✅ | `middleware.ts:49-52` issues `/` → `/options-data`. |
| **DoS in React Server Components — CVE-2026-23870 (High)** | ✅ | App Router renders RSC by default. |
| **DoS via the Image Optimization API (Moderate)** | ✅ | `next/image` used in `app/music/GenreImages.tsx` + `app/(protected)/profile/UserAvatarFile.tsx`; `next.config.mjs:64-79` allows `firebasestorage.googleapis.com` and `icon-library.com`. |
| DoS via connection exhaustion / Cache Components (High) | — | Cache Components / PPR not used. |
| SSRF via WebSocket upgrades (High) | — | No WS server. The only `upgrade` match (`lib/database/database.ts:13`) is IndexedDB `onupgradeneeded`. No custom server. |
| Cache poisoning in RSC responses ×2 (Moderate/Low) | ⚠️ | Depends on Cloudflare cache rules in front of the app (deployed behind Nginx + Cloudflare per `ASFrontend_DEPLOYMENT.md`). Review cache config. |
| XSS via CSP nonces (Moderate) | — | No CSP nonce in use. |
| XSS in beforeInteractive scripts (Moderate) | — | No `next/script`. |

> **Important:** every advisory above is fixed by the *same single action* — the version upgrade.
> The "Verdict" column describes current exploitability given current code; it is **not** a reason
> to defer or partially apply.

## 3. Pre-flight (Phase 0)

- [ ] **Node version** ≥ 18.18.0 — `node -v`. Next 15 requires it.
- [ ] **Clean the working tree.** This project is currently on branch `feature/lint-cleanup`
      with uncommitted changes. Finish/commit/stash that work and return to a known-good `main`
      first — do **not** start the upgrade on top of unrelated WIP.
- [ ] **Baseline build** — confirm `yarn build` succeeds *before* changes (so any failure after is
      attributable to the upgrade).
- [ ] **Branch:** `git checkout main && git pull && git checkout -b feature/nextjs-may2026-security`
      (workflow rule: never commit to `main`).
- [ ] **Remove the stray `package-lock.json`.** This project is `packageManager: yarn@4.0.1` but has
      both lockfiles committed. Delete `package-lock.json`, keep `yarn.lock`. Use `yarn` for all
      commands below.

## 4. Remediation (Phase 1 — version bumps)

Edit `package.json` and run `yarn` (do not hand-edit `yarn.lock`):

```bash
# Core framework + React
yarn up next@15.5.18 react@^19.2.6 react-dom@^19.2.6

# Next tooling — match the major
yarn up @next/bundle-analyzer@^15 @next/eslint-plugin-next@^15

# React types
yarn up @types/react@^19 @types/react-dom@^19

# Mantine — older 7.x predates React 19 support; move every @mantine/* to its
# latest 7.x (or 8.x) release, plus the table + icon packages + emotion.
yarn up @mantine/core@latest @mantine/hooks@latest @mantine/dates@latest \
        @mantine/form@latest @mantine/carousel@latest mantine-react-table@latest \
        @tabler/icons-react@latest @emotion/react@latest
```

- `react` / `react-dom` **must** end at **≥ 19.2.6** to satisfy the React `react-server-dom-*`
  advisory. `next@15.5.18` ships the patched `react-server-dom-webpack` internally.
- `@storybook/nextjs@^7.x` may not fully support Next 15 — Storybook is dev-only and not shipped,
  so a Storybook 8 bump can be **deferred**; it does not block the security fix.

## 5. Remediation (Phase 2 — codemods)

```bash
npx @next/codemod@latest upgrade        # Next 15 codemods (async request APIs, etc.)
npx codemod@latest react/19/migration-recipe   # React 19 codemods
```

Review **every** change the codemods make before continuing.

## 6. Remediation (Phase 3 — manual fixes)

Known Next 14→15 / React 18→19 breakage to check:

- **Async request APIs** — `cookies()`, `headers()`, `params`, `searchParams` are now Promises.
  Check any server components in `app/(protected)/*/page.tsx`, `app/layout.tsx`,
  `app/(protected)/layout.tsx`. (Most pages here are `"use client"` — low exposure, but verify.)
- **`fetch` caching** — no longer cached by default in Next 15; GET route handlers no longer
  cached by default. Not heavily used here (SWR client-side), but confirm.
- **`middleware.ts`** — re-verify behavior on Next 15. This is also the natural moment to decide
  whether to wire up the dead `redirectToLogin()` for real server-side auth — *out of scope for
  the security patch*, track separately.
- **React 19** — removed: `propTypes`, `defaultProps` on function components, string refs, legacy
  context, `ReactDOM.render`. `useRef()` now requires an argument.
- **ECharts** (`echarts-for-react`) — verify React 19 compatibility; bump if a render breaks.
- **Firebase** (v12) and **Zustand**/**SWR** — expected fine; verify at smoke-test.

## 7. Verification (Phase 4)

`next.config.mjs` sets `typescript.ignoreBuildErrors: true` **and** `eslint.ignoreDuringBuilds: true`,
so **`yarn build` will not surface type/lint regressions** — run those steps explicitly:

- [ ] `yarn install` — clean, no peer-dependency errors
- [ ] `yarn typecheck` — no *new* errors vs. the pre-upgrade baseline
- [ ] `yarn lint`
- [ ] `yarn jest` — all pass
- [ ] `yarn build` — succeeds
- [ ] `yarn dev` smoke test:
  - [ ] Firebase sign-in → redirected into a `(protected)` route
  - [ ] `/options-data`, `/backtest`, `/gamma-dashboard`, `/options-time` render; ECharts draw
  - [ ] `/` redirects to `/options-data`; disallowed `Origin` still gets a 400 (middleware)
  - [ ] `next/image` loads — profile avatar + `/music` genre images
  - [ ] Public routes `/about`, `/live0dte`, `/music` work unauthenticated

## 8. Deploy (Phase 5)

Per `ASFrontend_DEPLOYMENT.md` (PM2 + Nginx + Cloudflare):

```bash
./switch-env.sh prod
yarn build
pm2 reload <app>      # see ASFrontend_DEPLOYMENT.md for the process name
./switch-env.sh status
```

Then review **Cloudflare cache rules** for the app hostname (advisories #10–11, RSC cache
poisoning) — confirm RSC payloads (`?_rsc=` requests / `RSC` header) are not being cached
cross-user.

## 9. Wrap-up (Phase 6)

- [ ] Add a row to `TASK_LOG.md` (Date / Task / Status `Complete` / Branch / Notes).
- [ ] Open a PR — do not merge directly to `main`.

## Rollback

The upgrade is isolated to the feature branch. To abandon:

```bash
git checkout main
yarn install          # restores node_modules to the 14.x lockfile
```

If partially applied on the branch: `git restore package.json yarn.lock && yarn install`.

## Checklist (quick reference)

- [ ] Phase 0 — Node OK, tree clean, baseline build green, branch created, `package-lock.json` deleted
- [ ] Phase 1 — `next@15.5.18`, `react`/`react-dom` ≥ `19.2.6`, `@next/*`@^15, Mantine bumped
- [ ] Phase 2 — Next + React codemods applied and reviewed
- [ ] Phase 3 — async request APIs, middleware, React 19 removals checked
- [ ] Phase 4 — typecheck / lint / jest / build / smoke test all green
- [ ] Phase 5 — deployed; Cloudflare RSC cache rules reviewed
- [ ] Phase 6 — `TASK_LOG.md` updated, PR opened

---

## 10. Outcome (2026-05-14)

Executed on branch `feature/nextjs-may2026-security` off clean `main`. Phases 0–4 and 6 are complete in a single commit. **Phase 5 (production deploy) is gated** pending PR review and explicit go-ahead.

### What actually changed
**Package bumps** (`package.json`):
- `next`: `^14.2.35` → `15.5.18` (exact pin)
- `react`, `react-dom`: `18.2.0` → `^19.2.6`
- `@next/bundle-analyzer`: `^14.0.1` → `^15.5.18`
- `@next/eslint-plugin-next`: `^16.1.1` → `^15.5.18` (was mis-aligned to v16 on `main`; aligns to the Next major)
- `@tabler/icons-react`: `^2.46.0` → `^3.44.0` (v2 peer dep `react: "^16 || ^17 || ^18"` — excluded React 19)
- `@types/react`: `18.2.34` → `^19.2.14`
- `@types/react-dom`: **new** → `^19.2.3` (was missing from devDeps entirely; required by `@testing-library/react@16` peer)
- `@testing-library/react`: `^14.0.0` → `^16.3.2` (v14 hard-incompat with React 19)
- `@testing-library/dom`: `^9.3.3` → `^10.4.1` (`^10` is the `@testing-library/react@16` peer)

**Repo hygiene:**
- Removed `package-lock.json` (project is `packageManager: yarn@4.0.1`; dual-lockfile hazard).
- `next-env.d.ts` regenerated by Next 15 (3-line diff, auto-managed by Next).

### Deviations from the original plan (§4)
- **Mantine NOT bumped.** Runbook said "every `@mantine/*` to latest 7.x (or 8.x)." Verification: `@mantine/core@7.17.8` (what `^7.4.x` already resolved to on `main`) has peer `react: "^18.x || ^19.x"` — already React-19-compatible. `@mantine/core@latest` is now Mantine **9** (a two-major jump). Leaving Mantine ranges untouched.
- **`mantine-react-table` NOT bumped to `@latest`.** Runbook said `@latest`, but `mantine-react-table@latest` = `1.3.4`, which requires **Mantine 6** — would have *downgraded* the table and broken the project. The `latest` dist-tag is stuck on v1 because v2 never went stable (max is `2.0.0-beta.9`, which is what the existing `^2.0.0-alpha.10` range already resolves to). No newer v2 exists.
- **`@tabler/icons-react` bumped to v3, not just within v2.** v2.x peer dep excludes React 19. v3's peer is `react: ">= 16"` — works.
- **`@testing-library/*` bumped.** Runbook didn't flag this; v14 (current) is hard-incompat with React 19. `@testing-library/react@^16` + `@testing-library/dom@^10` are required to run any tests against React 19.
- **No code changes (Phases 2–3).** Runbook anticipated codemods + manual fixes. An exhaustive scan found **zero** patterns matching:
  - No `next/headers` imports anywhere — async request-API change is N/A.
  - No `propTypes`, `defaultProps`, `ReactDOM.render`, `useFormState`, `react-dom/test-utils`, `useRef()` no-arg.
  - No `@next/font` (uses `next/font` already), no `next/legacy/image`, no `legacyBehavior` `<Link>`, no `experimental.runtime`.
  - No server-side `fetch()` in `app/` — Next 15 fetch-cache default change is N/A.
  - No `forwardRef`.
  - All `params`/`searchParams` matches were user-defined component props or the `useSearchParams()` client hook (unchanged).

### Verification results (§7)
- **`yarn install`**: clean — only Storybook 7 peer warnings (`@storybook/nextjs`, `@storybook/blocks`, `@storybook/addon-essentials`). Deferred (dev-only, follow-up to Storybook 8).
- **`yarn build`** (clean `.next/`): ✓ Compiled successfully in 35.2s. All 14 routes built, 16/16 static pages generated. Middleware: 34.4 kB (was 26.7 kB). First Load JS shared: 102 kB (was 87.6 kB — ~14 kB heavier from React 19's surface; acceptable).
- **`yarn start` smoke**:
  - `/` → **307** → `/options-data` ✓ (middleware root redirect)
  - `/about`, `/live0dte`, `/music`, `/options-data`, `/authentication/signin` → **200** ✓
  - `/options-data` with hostile `Origin: https://evil.example.com` → **400** ✓ (middleware CORS gate works)
  - All security headers present: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `HSTS`, `Referrer-Policy`, etc.
  - Server log: clean, no errors.
- **`yarn jest`**: runs (0 tests in the project — pre-existing; the `@testing-library/*` bump is future-proofing).
- **`yarn typecheck`**: 334 errors — **all pre-existing**. 83% are `TS7006`/`TS7031` (implicit-any in user function signatures), the rest are user-code issues in `components/ECharts/`, `components/Music/audioplayer.tsx`, `lib/database/database.ts`, `theme.ts`, `store/Live0DTE/`. **Zero errors reference React or Next types.** Suppressed by `next.config.mjs` `typescript.ignoreBuildErrors: true` (with comment "TODO: Set to false after fixing existing TypeScript errors").
- **`yarn lint`**: 811 issues — **all pre-existing**. 786 (97%) are `linebreak-style` (Airbnb config wants CRLF on a Linux/LF project). ~25 are normal pre-existing code issues (`object-shorthand`, `dot-notation`, `no-use-before-define`, `no-unused-vars`). **Zero `@next/eslint-plugin-next` rule errors.** Suppressed by `next.config.mjs` `eslint.ignoreDuringBuilds: true`.
- **Note**: `next lint` now warns it is deprecated in Next 16. Migration codemod available: `npx @next/codemod@canary next-lint-to-eslint-cli .`. Added to pending tasks. Not blocking for 15.5.

### Browser smoke test (human, before Phase 5 deploy)
HTTP-level smoke passed, but these need a real browser:
- Firebase sign-in flow on `/authentication/signin` → redirect into a `(protected)` route
- `/options-data`, `/backtest`, `/gamma-dashboard`, `/options-time` render with ECharts drawing
- `mantine-react-table` data table renders + interacts on `/backtest` and `/options-data`
- `next/image` actually serves images on `/profile` (avatar) and `/music` (genre images)
- IndexedDB cache (`lib/database/database.ts`) read/write paths work
- `/profile` page works end-to-end

### Phase 5 deploy (gated)
After PR review/merge:
```bash
./switch-env.sh prod
yarn build
pm2 reload <app>          # process name per ASFrontend_DEPLOYMENT.md
./switch-env.sh status
```
Then **review Cloudflare cache rules** for the app hostname — confirm RSC payloads (requests with `?_rsc=` or `RSC` header) are not cached cross-user (advisories #10–11, cache poisoning in RSC responses).

### Rollback
Branch is isolated. To abandon: `git checkout main && yarn install` (restores Next 14 from `main`'s lockfile). The stashed `feature/lint-cleanup` WIP (design-system + TASK_LOG changes) is at `stash@{0}` — pop it back with `git checkout feature/lint-cleanup && git stash pop`.
