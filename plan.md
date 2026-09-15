# Build Plan — FDE Roadmap Tracker

## Sources and how they're used

- **`CLAUDE.md` is the spec of record** for tech stack, data model, seed
  content, feature list/order, and conventions. Where anything conflicts,
  `CLAUDE.md` wins.
- **`fde-roadmap-app.jsx` is a visual/UX template only.** It's a single-file
  prototype with its own invented data (18 weeks, per-day tasks, a "Today"
  tab) that doesn't match `CLAUDE.md`'s data model. We reuse its **look and
  component patterns** — dark slate/sky/amber theme, card layout, tab nav,
  checkbox/progress-bar/badge components, accordion week list — and rebuild
  them against `CLAUDE.md`'s actual 17-week, weekly-checkbox data model.

### Known mismatch to resolve (not carry over)

| In the JSX template | In `CLAUDE.md` (source of truth) |
|---|---|
| 18 weeks | **17 weeks** |
| Daily task grid for every week (126 days), "Today" tab | Only **weekly** checkboxes (course/practice/portfolio/deliverable) for weeks 5–17; **daily** granularity only exists for the **Python warm-up**, weeks 1–4 |
| `TYPE_META` day-type badges (course/practice/build/ship/...) | Not part of the spec — drop |
| In-memory `useState` only | Must persist to `localStorage` via `storage.ts` |

Decision: build the 17-week weekly model with the JSX's visual style. The
"Today"-tab concept and per-day task badges are dropped; the Python
Warm-up view absorbs the daily-checklist/streak UX from the template
(`streak`, day grid) since that's the one place `CLAUDE.md` actually wants
daily granularity.

## Tech stack

- React + TypeScript + Vite (`npm create vite@latest . -- --template react-ts`)
- Tailwind CSS (utility classes only, dark theme carried over from the
  template: `slate-950/900/800` surfaces, `sky-400/500` primary accent,
  `amber-400` highlight/current-item accent, `emerald-500` done/success)
- `lucide-react` for icons (already used in the template)
- No backend, no router, no state library — `localStorage` + a top-level
  `useState<AppState>`

## File structure

```
src/
  main.tsx
  App.tsx                     # tab state, loads AppState once, renders active view
  types.ts                    # interfaces from CLAUDE.md, verbatim
  seed.ts                     # getInitialState(): AppState, verbatim seed content
  storage.ts                  # load(), save(state), reset() — localStorage, JSON
  state.ts                    # update helpers (toggleWeekField, setSkillStatus,
                               #   toggleMilestone, addApplication, etc.) operating
                               #   on AppState, calling storage.save after each mutation
  lib/date.ts                 # diffDays, clamp, currentWeekFromStartDate
  components/
    Checkbox.tsx               # from template, tone prop (sky/amber/emerald)
    ProgressBar.tsx            # from template
    Badge.tsx                  # generic label badge (status chips, mock-type chips)
    TabNav.tsx                 # icon+label tab bar from template
    StatTile.tsx                # icon + big number + caption (dashboard quick counts)
    ConfirmButton.tsx          # two-step confirm, used by Settings reset
  views/
    Dashboard.tsx              # feature 1
    WeeklyPlan.tsx             # feature 2 (accordion of 17 weeks)
    PythonWarmup.tsx           # feature 3 (4x7 grid + streak)
    Skills.tsx                 # feature 4
    SideProjects.tsx           # feature 5
    JobApplications.tsx        # feature 6
    InterviewMocks.tsx         # feature 7
    PortfolioArtifacts.tsx     # feature 8
    Settings.tsx               # feature 9
index.css                      # Tailwind directives
```

## Data model & seed

- Port `AppState`, `Week`, `Skill`, `SideProjectMilestone`, `SideProject`,
  `PythonWarmupDay`, `JobApplication`, `InterviewMock`, `PortfolioArtifact`
  into `src/types.ts` exactly as specified in `CLAUDE.md`.
- Port the 17-week table, 19 skills, 2 side projects (with real milestone
  labels), 28 Python warm-up rows, and 9 pre-seeded portfolio artifact rows
  into `src/seed.ts`'s `getInitialState()`, using the exact content given
  in `CLAUDE.md` (not the JSX's invented 18-week text).
- `jobApplications`, `interviewMocks` start as `[]`.

## `storage.ts` / `state.ts` contract

- `storage.ts`: `STORAGE_KEY` constant, `loadState(): AppState` (returns
  `getInitialState()` if nothing in `localStorage` or JSON parse fails),
  `saveState(state: AppState): void`, `resetState(): AppState` (clears key,
  returns fresh seed).
- `state.ts`: pure `(state, ...args) => AppState` reducers for every
  mutation (week checkbox toggle, week notes edit, skill status cycle,
  milestone toggle, python warmup day toggle, add/update/remove job
  application, add/remove interview mock, update portfolio artifact,
  set start date). `App.tsx` wraps each call: `setState(next); saveState(next)`.
- Text-field mutations (notes, URLs) debounce the `saveState` call
  (~400ms); everything else (checkboxes/selects) saves synchronously,
  per `CLAUDE.md`.

## Derived values (reuse template's math, recompute against 17 weeks)

- `currentWeek = clamp(Math.ceil((diffDays(startDate, today) + 1) / 7), 1, 17)`
- Overall progress % = completed week-checkbox count (4 per week × 17 =
  68 max) / 68 — mirrors the template's `overallPct` but against weekly
  checkboxes instead of days.
- Python warm-up streak = consecutive `done` days counting back from
  today's computed warm-up day (only meaningful during weeks 1–4;
  template's `streak` logic adapts directly).
- Skills done / 19, applications count, mocks count, side-project
  milestones done/total — same shape as the template's dashboard tiles.

## Build order (matches `CLAUDE.md` §"Features to build")

Status legend: `[ ]` not started, `[x]` done. Each step's entry gets a
one-line note appended when completed (what was built, any deviation).
Each step is built end-to-end (code + commit + push) before the next
starts — treat this file as the single handoff artifact between build
sessions.

- [x] **Step 1 — Scaffold.** Vite React-TS app, Tailwind config,
  `lucide-react`, base layout (header + tab nav + content) styled per
  the template.
  Built by scaffolding into a temp dir (`npm create vite@latest . --template react-ts`
  needed `--overwrite` for a non-empty dir, not `--force`; scaffolded to a
  temp dir and merged instead to avoid any risk to existing files), then
  installed Tailwind CSS v4 via `@tailwindcss/vite` + `lucide-react`.
  Deviation: the auto-installed `vite@8.3.0` uses a rolldown bundler
  requiring Node ≥20.19/22.12 and failed to build on this machine's Node
  20.17 (missing native binding); downgraded to `vite@6.4.3` +
  `@vitejs/plugin-react@4.7.0`, a stable pairing that builds and runs
  cleanly on this Node version. `App.tsx` now renders the dark
  slate-950/900/800 + sky/amber themed header, current-week placeholder,
  and a 9-tab nav bar (Dashboard/Weekly Plan/Python Warm-up/Skills/Side
  Projects/Applications/Interview Mocks/Portfolio/Settings) with a
  per-tab "coming in Step N" placeholder content area; `npm run dev` and
  `npm run build` both verified working.
- [x] **Step 2 — Data layer.** `types.ts`, `seed.ts`, `storage.ts`,
  `state.ts`.
  Built all five data-layer files (`types.ts`, `seed.ts`, `storage.ts`,
  `state.ts`, `lib/date.ts`) with the verbatim 17-week/19-skill/2-side-project
  seed content from `CLAUDE.md`; `state.ts` reducers are pure (no
  `saveState` calls) per the contract, and job-application/interview-mock
  `id`s are generated with `crypto.randomUUID()` (with a `Date.now()`-based
  fallback). Portfolio artifact ids are slugified labels (e.g. "Flagship
  repo" → `flagship-repo`) since `CLAUDE.md` didn't specify an id format,
  just that it be stable. `npx tsc -b` passes clean. Not wired into
  `App.tsx` yet — that's a later step.
- [x] **Step 3 — Dashboard.** Progress bar, current-week indicator,
  quick-count tiles (`StatTile`, `ProgressBar` from template),
  start-date prompt if unset, route-overview strip (17 circles instead
  of 18, no day dots).
  Wired `App.tsx` to `loadState()` on mount into a top-level `useState`,
  added an `updateState(updater)` helper that applies a pure `state.ts`
  reducer and calls `saveState` synchronously, and passed `state`/
  `updateState` down to `Dashboard` via props. Built
  `src/components/Checkbox.tsx` (sky/amber/emerald tone prop),
  `ProgressBar.tsx`, and `StatTile.tsx` (icon + value + caption) ported
  from the JSX template's look. `src/views/Dashboard.tsx` implements the
  unset-`startDate` prompt inline (date input + button calling
  `state.ts`'s `setStartDate` reducer, since Settings doesn't exist
  yet), the 68-checkbox overall progress bar, current-week indicator via
  `currentWeekFromStartDate`, four `StatTile` quick counts (skills done/19,
  applications sent, mocks completed, side-project milestones done/total),
  and a 17-circle route-overview strip (emerald = all 4 week checkboxes
  done, amber = current week, slate = other) with a `title` tooltip per
  circle; circles are inert (no navigation) since Weekly Plan doesn't
  exist until Step 4. `App.tsx`'s header current-week badge now reads
  live from state instead of the "--/set start date" placeholder.
  `npx tsc -b` and `npm run build` both pass clean; verified via the Vite
  dev server (module transforms returned 200 with no compile errors) that
  the Dashboard tab renders the start-date prompt on first load (no
  persisted state yet), then stopped the dev server.
- [x] **Step 4 — Weekly Plan.** Accordion list styled after the
  template's Route view (timeline rail + numbered circles), current
  week auto-expanded, 4 checkboxes per week, notes textarea,
  side-project note row, Python warm-up topic + link for weeks 1–4.
  Built `src/views/WeeklyPlan.tsx`: single-expand accordion (only one
  week open at a time, mirroring the template's `expandedWeek` state)
  defaulting to the current week via `currentWeekFromStartDate`, with a
  timeline rail and numbered circles (emerald when all 4 checkboxes
  done, amber border for the current week). Each expanded card shows a
  `dl` of course/practice/portfolio/interview/deliverable text, the
  amber-highlighted `sideProjectNote` row when present (weeks 3–4
  only), the four `courseDone`/`practiceDone`/`portfolioDone`/
  `deliverableDone` checkboxes wired to `state.ts`'s `toggleWeekField`
  via `updateState` (synchronous save), and a notes textarea. The
  collapsed-row header shows a small `checkedCount/4` indicator using
  both `ProgressBar` and text, reusing `Checkbox`/`ProgressBar` from
  `src/components/` with no new shared components needed. The notes
  textarea is its own small internal component (`WeekNotesField`)
  holding local state for instant keystroke feedback, with a
  `useRef`-based ~400ms debounce before calling `state.ts`'s
  `setWeekNotes`/`updateState`, flushed via cleanup on unmount. For the
  Python warm-up link on weeks 1–4: wired real click-to-switch-tab —
  `App.tsx` already owned `setActiveTab`, so it was trivial to pass
  down as an `onNavigate` prop to `WeeklyPlan`, which the "see Python
  Warm-up tab" button calls with `'python-warmup'` (falls back to a
  static label if `onNavigate` isn't supplied). Wired into `App.tsx`'s
  weekly-plan tab slot, replacing the placeholder. `npx tsc -b` and
  `npm run build` both pass clean. Verified with a Playwright smoke
  script against the dev server (no project run-skill existed, so
  `playwright` was installed ad hoc into the scratchpad dir and
  chromium fetched via `npx playwright install chromium`): confirmed
  all 17 week headers render, toggling the Week 10 course checkbox and
  typing into its notes textarea produced no console errors, and both
  the checkbox state and notes text persisted correctly across a full
  page reload (round-tripping through `localStorage`); also confirmed
  the Python warm-up tab-switch link on Week 1 correctly activates the
  "Python Warm-up" tab. Dev server stopped afterward.
- [x] **Step 5 — Python Warm-up.** 4×7 grid or grouped checklist,
  streak counter (template's `Flame` stat), visually recede after week
  4 but keep data.
  Built `src/views/PythonWarmup.tsx` as a literal 4×7 grid (an
  `overflow-x-auto` table: 4 rows for weeks 1–4, columns D1–D7, each cell
  a `Checkbox` wired to `state.ts`'s existing `togglePythonWarmupDay` via
  `updateState`) rather than a grouped checklist, since a real grid was
  no fussier to build and matches `CLAUDE.md`'s wording more directly;
  the current warm-up week's row gets a subtle amber tint. Extended
  `src/lib/date.ts` with `WARMUP_TOTAL_DAYS`, `currentWarmupDayIndex`
  (daily-granularity analog of `currentWeekFromStartDate`, clamped to
  1–28) and `warmupIndexToWeekDay`, rather than duplicating day-index
  math inline in the view. The streak counter (`Flame` `StatTile`, tone
  amber) walks backward day-by-day from `currentWarmupDayIndex` through
  `state.pythonWarmup`, stopping at the first not-done day, mirroring
  the template's `streak`/`dayKey` walk-back but anchored on the 28-day
  warm-up range instead of the template's whole-roadmap day index. Two
  more `StatTile`s show total days completed (x/28) and the current
  warm-up week. De-emphasis: when `currentWeekFromStartDate > 4`, a
  muted banner ("Week 4 has passed — this section is for reference...")
  appears above the grid and the grid itself gets `opacity-70` — data
  stays fully visible and checkboxes remain clickable, nothing is
  hidden or deleted. Wired into `App.tsx`'s python-warmup tab slot,
  replacing the placeholder. `npx tsc -b` and `npm run build` both pass
  clean. Verified with a Playwright smoke script against the dev
  server: confirmed all 4 week rows and all 28 checkboxes render with
  correct topics, toggling checkboxes produced no console/page errors,
  and the streak counter behaved correctly (0 → 4 after marking a
  4-day run done from a simulated start date, → 2 after un-marking a
  middle day, confirming the backward-walk-and-break logic). Dev
  server stopped afterward.
- [x] **Step 6 — Skills.** Cards styled after template's Skills tab;
  status chip cycles not_started → in_progress → done; "stop learning
  when" shown as a highlighted quote line (template's italic bordered
  `<p>`).
  Built `src/views/Skills.tsx` as a 2-column card grid mirroring the
  template exactly: each card has a name/status-chip header row, the
  `primaryCourse` in muted text, and `stopLearningWhen` as an italic,
  sky-bordered `<p>` quote. Status control is a single cycling chip
  button (not a `<select>`) wired to `state.ts`'s existing
  `cycleSkillStatus` via `updateState` (synchronous save, no debounce)
  — chose cycling over a dropdown since it matches the template's UX
  and `cycleSkillStatus` was already built for it in Step 2; the chip's
  `aria-label` announces the current status for accessibility since the
  visible label only shows the current state, not that it's a control
  with more states. No new shared component added (single-use markup,
  no duplication elsewhere) per the no-premature-abstraction convention.
  Wired into `App.tsx`'s skills tab slot, replacing the placeholder.
  `npx tsc -b` and `npm run build` both pass clean. Verified with a
  Playwright smoke script against the dev server: all 19 skill cards
  render, clicking the status chip cycled "Not started" → "In progress"
  → "Done" correctly, and the change persisted across a full page
  reload with zero console errors. Dev server stopped afterward.
- [ ] **Step 7 — Side Projects.** Two cards with milestone checklists +
  progress bars, same layout as template's Side Projects tab.
- [ ] **Step 8 — Job Applications.** Add form + table/list, status
  `<select>`, sort by date desc, the "Applications typically start
  Week 11" notice gated on `currentWeek < 11` (per `CLAUDE.md`, not the
  template's 12).
- [ ] **Step 9 — Interview Mocks.** Add form + log list + running
  counts by type.
- [ ] **Step 10 — Portfolio Artifacts.** Checklist with editable URL
  inputs, styled after template's Portfolio tab.
- [ ] **Step 11 — Settings.** Start-date picker, two-step "reset all
  data" button (`ConfirmButton`) that calls `resetState()` and reloads.
- [ ] **Step 12 — Persistence correctness pass.** Verify every mutation
  round-trips through `localStorage` (manual check: toggle things,
  reload page, confirm state survives); verify first-load-with-no-key
  seeds correctly.

## Handoff protocol for each step

Each step is executed by a fresh agent with no memory of prior steps. On
entry, that agent must: read this `plan.md` in full, read `CLAUDE.md`,
find the first `[ ]` step, and inspect the current repo state (it cannot
trust the plan's prose alone — verify what actually exists on disk before
building on it). On exit, it must: flip that step's checkbox to `[x]` and
append a one-line implementation note, `git add` the relevant files
(never `git add -A`/`.`), commit with a message describing the step, and
`git push` to `origin main`. Do not start the next step in the same
agent run.

## Explicit non-goals (carried from `CLAUDE.md`)

No accounts/backend/cloud sync, no drag-and-drop, no notifications/
reminders/calendar integration, no test suite, no routing library.
