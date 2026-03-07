# AlphaSeekers UI Design System v3 (Analytics Deck)

This document defines the layout system for all analytics pages in `alphaseekers3`. The goal is not to make every screen look identical. The goal is to make every analytics screen feel like it belongs to the same product, uses the same reading order, and reuses the same layout primitives.

This version keeps the existing token language and dark trading DNA, but adds the missing piece: a canonical page architecture for protected analytics routes.

---

## 1. Scope

This system applies to:

- `/options-data`
- `/options-time`
- `/gamma-dashboard`
- `/backtest`
- future analytics pages such as `/live0dte`

It should be implemented through the shared primitives already in the codebase:

- `MainAppShell`
- `DataPanel`
- `FilterBar`
- `ChartGrid`
- `StatusBar`

---

## 2. Redesign Thesis

Current analytics pages are functional, but most of them read as "toolbar + stacked cards". The redesign direction is:

- One page, one dominant analytical question.
- One dominant visual surface per page.
- Filters stay visible, but do not compete with charts.
- Context is established before the user sees raw panels.
- Supporting panels use a shared rhythm, spacing system, and header anatomy.
- Every analytics route follows one of a small number of approved page templates.

In practice, AlphaSeekers analytics pages should feel like an operator deck, not a form page and not a random grid of widgets.

---

## 3. Core Principles

- Dark-first, but never pure black.
- Dense by default, not cramped.
- Charts own the center of gravity.
- Numbers use tabular alignment everywhere.
- Positive, negative, warning, live, and neutral states always mean the same thing.
- Page structure must be predictable even when page content changes.
- Primary controls are left-aligned and grouped by purpose. They are never centered just for symmetry.

---

## 4. Visual Direction

AlphaSeekers should keep a financial "command deck" feel:

- Base surfaces are layered charcoal and graphite.
- Blue is for navigation, selected state, and active interaction.
- Amber is for analytical emphasis, section labels, and selected insight.
- Cyan is for secondary overlays or comparison signals.
- Positive and negative colors must remain reserved for market semantics and PnL semantics.

The visual hierarchy should come from contrast, spacing, and panel scale before it comes from glow effects.

---

## 5. Token Model

### Implemented Tokens

These are already present in the app and remain the base contract:

- Surface: `surface.primary`, `surface.secondary`, `surface.tertiary`, `surface.elevated`, `surface.overlay`
- Text: `text.primary`, `text.secondary`, `text.muted`
- Accent: `accent.blue`, `accent.amber`, `accent.cyan`
- State: `state.live`, `state.warning`, `state.critical`, `state.info`
- Financial: `positive`, `negative`, `neutral`
- Borders: `border.default`, `border.hover`, `border.active`, `border.strong`
- Motion: `motion.fast`, `motion.normal`, `motion.slow`, `motion.easing`
- Density: `density.control-h`, `density.gap`, `density.font`

### Required Layout Tokens

Add these tokens when the analytics layout refactor begins:

- `layout.page-padding-x`: 16px mobile, 20px tablet, 24px desktop
- `layout.page-padding-y`: 12px mobile, 16px desktop
- `layout.section-gap`: 12px
- `layout.panel-gap`: 12px
- `layout.hero-min-h`: 420px
- `layout-support-min-h`: 280px
- `layout-rail-w`: 300px
- `layout-metric-h`: 68px
- `layout-sticky-top`: 56px

### Typography

- Keep `Inter` for UI copy until a broader brand typography change is made.
- Keep `JetBrains Mono` for numbers, timestamps, Greeks, IV, OI, volume, PnL, and any quoted values.
- Titles should be short and sentence case.
- Labels inside toolbars can be uppercase only when they act like compact section tags.

---

## 6. Canonical Analytics Page Anatomy

Every analytics page should use the same top-down reading order.

```text
+---------------------------------------------------------------+
| A. Page Header                                                |
| title | thesis | market status | last update | page actions   |
+---------------------------------------------------------------+
| B. Sticky Context Bar                                         |
| primary filters | mode switches | compare toggle | actions    |
+---------------------------------------------------------------+
| C. Metric Strip                                               |
| 4-6 compact KPIs that summarize the current page state        |
+---------------------------------------------------------------+
| D. Analysis Canvas                                            |
| dominant chart or workbench + optional context rail           |
+---------------------------------------------------------------+
| E. Secondary Panels                                           |
| supporting charts, tables, details, logs, legends             |
+---------------------------------------------------------------+
| F. Footer Status                                              |
| app-level status bar from MainAppShell                        |
+---------------------------------------------------------------+
```

### A. Page Header

Required content:

- page title
- one-line analytical thesis or subtitle
- route-level status such as live, delayed, theoretical, replay, market closed
- optional right-side actions such as export, reset view, save preset

This section answers: "What am I looking at, and is it live?"

### B. Sticky Context Bar

This is the route-local control rail. It stays visible while the page scrolls.

Rules:

- Left aligned, never center aligned
- Group controls by purpose: context, view, actions
- Primary filters first: ticker, date, expiration, range, mode
- Secondary toggles next: overlay, benchmark, theoretical, playback mode
- Actions last: refresh, reset, export
- Max two visual rows on desktop
- On mobile, collapse into a single stacked rail

### C. Metric Strip

This is a row of compact KPI cards directly below the context bar.

Use it for values like:

- net gamma
- regime
- selected expiration
- range covered
- active playback timestamp
- current market bias

Rules:

- 4 to 6 items on desktop
- use short labels and mono values
- color only the number or delta cue, not the whole card
- if a page does not have meaningful KPIs yet, add 2 to 3 context tiles instead of skipping the strip entirely

### D. Analysis Canvas

This is the dominant area of the screen and must contain the page's primary chart or workbench.

Rules:

- Each page gets one clearly dominant panel
- Dominant panel minimum height: `layout.hero-min-h`
- Supporting rails can sit left or right, but must be visually subordinate
- Use asymmetric layouts when the content benefits from them

### E. Secondary Panels

This area contains supporting evidence:

- secondary charts
- tables
- legends
- notes
- logs
- order entry
- event markers

Rules:

- Secondary panels share a common header anatomy
- Prefer 2-up or 3-up grid rhythms
- Avoid deep nesting of cards inside cards
- Tabs are allowed only when the content is truly peer-level

---

## 7. Approved Analytics Templates

All analytics routes should map to one of these templates.

| Template | Best For | Layout |
|----------|----------|--------|
| `time-series-focus` | `options-data`, `options-time` | header -> sticky context bar -> metric strip -> full-width hero chart -> support grid |
| `market-map` | `gamma-dashboard`, future `live0dte` | header -> sticky context bar -> metric strip -> rail + hero split -> lower support panels |
| `workbench` | `backtest` | header -> sticky context bar -> replay metrics -> workbench split -> peer tabs for dense tools |

Do not invent route-specific layouts unless a new route genuinely breaks one of these three models.

---

## 8. Route-by-Route Layout Standard

### `/options-data`

Use the `time-series-focus` template.

- Header: "Options Data", subtitle explains selected range and theo/non-theo mode
- Sticky context bar: date range, greek, theo toggle
- Metric strip: range, greek, mode, underlying set count
- Hero panel: term structure
- Support panel: ES exposure
- Theo mode keeps the same page structure; only the hero/support content changes

Design note:

- Do not let theo mode collapse the page into a different mental model. The user should feel that they are still on the same route with a different lens.

### `/options-time`

Use the `time-series-focus` template.

- Header: "Options Time", subtitle describes ticker and greek context
- Sticky context bar: date range, greek, ticker
- Metric strip: ticker, greek, selected date span, latest timestamp
- Hero panel: expiration time-series chart
- Support row: reserve space for session summary, regime note, or benchmark comparison

Design note:

- This page currently behaves like a single chart with filters. That is too thin. It needs route-level context and a support row so the screen feels intentional rather than temporary.

### `/gamma-dashboard`

Use the `market-map` template.

- Header: "Gamma Dashboard", subtitle explains selected underlying, date, and expiration mode
- Sticky context bar: underlying, date, expiration mode, custom expiration
- Metric strip: net gamma, peak strike, selected expiration bucket, last saved snapshot
- Left rail: levels by strike
- Hero panel: heatmap
- Lower support panel: time series

Design note:

- This is the clearest example of a strong asymmetric layout. Keep the ladder narrow, let the heatmap dominate, and treat the time series as the explanatory follow-through.

### `/backtest`

Use the `workbench` template.

- Header: "Back Test", subtitle explains trade date, expiration, and replay mode
- Sticky context bar: date picker, replay slider, scenario actions
- Metric strip: PnL, delta, theta, fills, current replay time
- Upper workbench: order monitor plus active chart area
- Secondary workbench: peer-level tabs for charts vs option chain
- Order entry belongs inside the workbench, not above the primary analytical surface

Design note:

- Tabs are acceptable here because backtest is a dense tool workspace. They should switch the work area only. Global filters must remain outside the tab set.

### Future `/live0dte`

Use the `market-map` template.

- Header: live market status and alert severity must be explicit
- Sticky context bar: underlying, expiration bucket, trade mode
- Metric strip: current session exposure, signal bias, alert count, last tick
- Hero: live exposure map or primary signal chart
- Rail: alerts, flow ladder, trade queue, or watchlist

---

## 9. Shared Component Standards

### `MainAppShell`

- Global shell remains responsible for app nav and app-level footer status
- Analytics pages must add their own route header below the shell header
- The shell header should not become the only location where route context lives

### `DataPanel`

`DataPanel` remains the base panel primitive, but it needs a stricter contract.

Required behaviors:

- consistent header padding and height
- title, subtitle, status, and actions aligned in one header system
- support for sticky headers inside scrollable panels
- support for `variant='hero'|'elevated'|'default'` in the future
- optional footer area for legends, notes, or summary values

Usage rules:

- `hero` or elevated panels for primary charts only
- default panels for support content
- panel titles must describe the question being answered, not the chart library being used

### `FilterBar`

`FilterBar` should be upgraded from a centered two-row wrapper into a real layout primitive.

Required regions:

- `contextSlot`
- `viewSlot`
- `actionSlot`
- optional `summarySlot`

Usage rules:

- default alignment is left
- controls wrap in groups, not one-by-one
- each row should preserve logical grouping at tablet widths
- summary chips belong below filters when the active selection is complex

### `MetricStrip`

Create a shared `MetricStrip` component for all analytics routes.

Required behaviors:

- compact cards with fixed height
- mono values
- semantic tone support
- optional sparkline or delta glyph

### `ChartGrid`

- Use `ChartGrid` for support panels instead of ad hoc margin stacks
- Approved defaults:
  - desktop: 2 or 3 columns
  - tablet: 2 columns
  - mobile: 1 column

### `StatusBar`

- App footer status remains global
- Page-level status belongs in the route header and metric strip
- Do not overload the footer with route-specific state that should be visible near the charts

---

## 10. Layout Rules

### Spacing

- Vertical page rhythm is always `section-gap`
- Panel-to-panel rhythm is always `panel-gap`
- Avoid one-off `mt="sm"` stacking patterns when `ChartGrid` or page sections should handle spacing

### Alignment

- Left edges should line up across header, context bar, KPI strip, and content grid
- Controls should not float in the middle of wide layouts
- Titles, subtitles, and action groups should align to a shared baseline

### Panel Hierarchy

- Every page has exactly one primary panel
- Secondary panels must be visibly smaller or lower contrast than the primary panel
- If all panels look identical, hierarchy has failed

### Tabs

- Use tabs only for peer-level work areas
- Do not hide primary filters inside tabs
- Do not place tabs inside tabs on analytics pages

### Loading and Empty States

- Preserve page structure during loading
- Prefer skeleton panels over isolated center loaders
- Empty states should say what selection is missing and what the user can change

---

## 11. Responsive Rules

### Desktop `>= 1440px`

- Use full template layouts
- Keep rail widths stable
- Keep metric strip in one row

### Laptop `1200px - 1439px`

- Keep the same template
- Reduce rail width before collapsing layout
- Allow filter groups to wrap to a second row

### Tablet `768px - 1199px`

- Metric strip becomes 2-up
- Context bar becomes stacked
- Market-map rail collapses above the hero panel

### Mobile `< 768px`

- Single-column page flow
- Sticky context bar stays, but actions collapse aggressively
- Metric strip becomes stacked tiles
- Footer status shows only highest-priority items

---

## 12. Accessibility and Interaction

- Keyboard focus must remain visible on all controls
- Reduced motion support is required
- Hover cannot be the only state cue
- Color must not be the only status cue
- Numeric changes should not animate in a way that harms readability
- Sticky bars must not hide focused controls under the shell header

---

## 13. Required Changes to Current Implementation

These changes should happen before broad page-by-page redesign work:

1. Add a shared analytics page header component.
2. Add a shared metric strip component.
3. Upgrade `FilterBar` to left-aligned grouped slots.
4. Extend `DataPanel` with actions and optional footer support.
5. Refactor analytics pages to use template-based composition instead of ad hoc `Box mt="sm"` stacking.
6. Replace isolated page-level spinners with layout-preserving loading states.

---

## 14. Do / Don't

### Do

- Give each analytics route one dominant visual surface
- Keep controls visible and grouped by purpose
- Reuse the same header, KPI, and panel rhythms everywhere
- Let page templates differ by analytical need, not by arbitrary taste

### Don't

- Center filters on wide analytics screens
- Stack unrelated full-width cards forever down the page
- Treat every panel as equally important
- Use tabs as a substitute for layout hierarchy
- Change page structure drastically when a mode toggle is flipped

---

## 15. Changelog

| Date | Change |
|------|--------|
| 2026-03-07 | Reworked the design system into an analytics layout spec with canonical templates, route mappings, component standards, and migration requirements. |
| 2026-03-07 | Previous v2 token guidance retained as the visual foundation for the analytics deck. |
| 2026-03-05 | Initial design system created. |
