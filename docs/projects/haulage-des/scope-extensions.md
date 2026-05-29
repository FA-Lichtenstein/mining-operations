# Haulage DES — scope extensions

Holistic final review (2026-05-29). Six-PR synthesis on `main` (commits `7180198` … `3e2510e`). **Do not implement items below without a new PR** — this file is the prioritized backlog only.

## Synthesis plan acceptance (holistic)

| Area | Plan requirement | Status |
|------|------------------|--------|
| Personas | Role-based only (`Quantitative Planning Analyst`, `Technical Services superintendent`); no fictional names | Met — no `Naledi` or named personas in app/docs/seeds/tests |
| Demo site | `syn-pgm-bushveld-01` synthetic Bushveld PGM context | Met |
| MVP scenarios | `truck_shovel`, `scraper_train` | Met — seeds, panel A picker, clone/compare |
| IPCC | Stretch / schema stub only | Met as deferred (`ipcc_conveyor.stub.json`, checklist stretch step) |
| Compute | Browser Web Worker DES; local IndexedDB | Met |
| Export | JSON MVP; PDF stretch | Met — JSON export/import; no PDF |
| Labelling | Synthetic + illustrative K-Tec | Met — `metadata` labels in panel A, study copy, seeds |
| PR1 shell | Angular `app/`, gallery, `/demo/haulage-des`, layouts, thin brief | Met |
| PR2 generator | Deterministic `gen-truck-cycle`, golden Vitest | Met — `npm run gen:seeds`, `test:tools` |
| PR3 engine | Pure TS DES + worker, KPI tests | Met — `test:engine` (8 tests) |
| PR4 workbench | Panels A–D, compare, IndexedDB, JSON | Met |
| PR5 study | Background/study + presenter 5-min checklist | Met |
| PR6 readiness | Playwright smoke, Firebase stub, README/checklist | Met — `test:e2e` passes |

## PR audits (condensed)

- **PR1** — Portfolio shell, `demos.json`, role-based `docs/projects/haulage-des/brief.md`, four-panel haulage placeholder → live workbench route.
- **PR2** — `app/tools/gen-truck-cycle/` (Mulberry32, triangular/normal/exponential), both MVP scenarios under `assets/seeds/syn-pgm-bushveld-01/gen-truck-cycle/v1.0.0-{scenario}/`; `ipcc` stub only; `train_size` in config not consumed by generator logic.
- **PR3** — `engine/` (event queue, FIFO resources, shift, breakdown/repair, KPIs incl. N_h, E=A×U); `haulage-des.worker.ts` + `DesWorkerService`; Gorai analytic-only.
- **PR4** — Full workbench: D3 schematic, ECharts panels, compare A/B, IndexedDB `haulageDesRuns`, JSON export; worker returns `cycles` for charts.
- **PR5** — Study drawer + presenter teleprompter (`localStorage` checklist); citations to `planning/` sources; docs aligned with in-app content paths.
- **PR6** — `e2e/haulage-des-smoke.spec.ts`, `firebase.json` SPA hosting stub, `demo-checklist.md`, test IDs, loading/error/a11y basics on controls.

---

## Proposed scope extensions

Prioritized **open** backlog. Items marked **Done** were delivered in PR1–6 (listed once here to dedupe per-PR notes).

### Priority 1 — CI & regression gates

| # | Item | Status |
|---|------|--------|
| 1 | GitHub Actions: `build`, `test:engine`, `test:tools`, `test:e2e` (`CI=1`, cached Playwright browsers) | Open |
| 2 | `gen-truck-cycle --check` (fail CI when on-disk seeds drift from `golden-hashes.json` without rewrite) | Open |
| 3 | Vitest for `DemoCatalogService` + lightweight route/gallery unit smoke | Open |

### Priority 2 — Demo continuity & facilitator UX

| # | Item | Status |
|---|------|--------|
| 4 | `sessionStorage` last scenario + fleet/horizon sliders for reload continuity | Open |
| 5 | Extend Playwright: open Background/Study, tick presenter checkbox, assert IndexedDB saved-runs after run | Open |
| 6 | Deep-link `?study=<section>` or presenter section hash for rehearsal bookmarks | Open |
| 7 | Export presenter checklist progress as JSON for facilitator handoff | Open |

### Priority 3 — Simulation fidelity & stretch scenarios

| # | Item | Status |
|---|------|--------|
| 8 | Implement `ipcc_conveyor` scenario + panel A option (T4 stretch) | Open |
| 9 | Gorai analytic overlay chart (explain-only, not second simulator) | Open |
| 10 | Panel B animation from streamed DES cycle events (not progress-derived phase proxy); queue bar from rolling queue samples | Open |
| 11 | Deterministic-vs-stochastic toggle for explainers; multi-shift handover queues | Open |
| 12 | Replay/calibration check: compare worker output to `cycles.csv` from gen-truck-cycle | Open |
| 13 | Use or drop `train_size` in scraper_train generator semantics | Open |
| 14 | Separate dump-queue vs loader-queue wait in KPI cards | Open |
| 15 | Congestion / Weibull jam events on network edges (generator stretch) | Open |

### Priority 4 — Workbench & persistence polish

| # | Item | Status |
|---|------|--------|
| 16 | IndexedDB prune/delete-run UI; export compare pair as single JSON manifest | Open |
| 17 | Partial import restore when `cycles` omitted (KPI-only, chart placeholders) | Open |
| 18 | Gallery filter/sort by theme tag (T1–T6) and presentation mode | Open |
| 19 | Document theme taxonomy on About or `/themes` | Open |
| 20 | Render `brief.md` from repo fetch (optional) to avoid TS copy drift | Open |
| 21 | Footer link to GitHub `docs/projects/haulage-des/brief.md` alongside study drawer | Open |

### Priority 5 — Hosting, cross-demo, governance

| # | Item | Status |
|---|------|--------|
| 22 | `firebase deploy` in CI when project id secret available; preview channels per PR | Open |
| 23 | Cross-link fleet-capacity-mdp downtime → haulage DES inputs (future module) | Open |
| 24 | Bundle manifest (per-file sha256) for seed debugging | Open |
| 25 | Root ESLint/Prettier CI invoking `app/` scripts | Open |
| 26 | Contractor shift-calendar toggle; PDF superintendent pack (plan stretch) | Open |

### Delivered in PR1–6 (deduped — not open)

- Angular portfolio shell in `app/`, gallery, `/about`, workbench/notebook layouts, synthetic disclaimer.
- Thin haulage brief + demo script + manual `demo-checklist.md`.
- `gen-truck-cycle` for `truck_shovel` and `scraper_train`; golden-hash Vitest; illustrative K-Tec metadata.
- Pure DES engine + Web Worker; `test:engine` KPI/queue golden tests.
- Workbench panels A–D; in-session A/B compare; IndexedDB run history; JSON export/import.
- Study drawer + presenter mode with role-based copy and planning source citations.
- Playwright smoke (gallery → haulage-des → run → clone → compare → export).
- Firebase Hosting stub (`firebase.json`, `.firebaserc` placeholder) — no Auth/Firestore.
- Panel A scenario/seed wiring, `metadata` illustrative labels, `provideHttpClient`, repo `.gitignore` for `app/node_modules`, `dist`, Playwright artifacts.
- Worker `cycles` on complete for ECharts; `sim-busy` / `role="alert"` polish; README command table.
