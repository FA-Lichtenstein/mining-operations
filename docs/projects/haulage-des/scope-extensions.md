# Haulage DES — scope extensions (PR1 reviewer notes)

Ideas deferred beyond PR1 acceptance. **Not implemented** in this PR — capture for later PRs or stretch backlog.

## PR1 reviewer audit (2026-05-29)

- Shell, gallery, `/demo/haulage-des` four-panel workbench placeholders, shared layouts, disclaimer, `demos.json`, and role-based brief/docs meet PR1 plan acceptance.
- Root `npm run build` and `npm run test` pass; `provideHttpClient` present; no named fictional personas in new copy.
- Minor polish: aligned coming-soon `themeTags` in `demos.json` with `planning/portfolio-shortlist-briefs.html`; repo-root `.gitignore` excludes `app/node_modules`, `app/dist`, `app/.angular`.

## Suggested extensions (ideas only)

### Shell & catalog

- Add Vitest coverage for `DemoCatalogService` and route smoke tests (gallery → haulage-des shell).
- Gallery filter/sort by theme tag (T1–T6) and presentation mode.
- Document theme taxonomy in About or a small `/themes` reference page.

### Haulage-des UX (PR4+)

- Wire panel A controls to real scenario/seed selectors once `gen-truck-cycle` lands (PR2).
- Persistent “last scenario” in `sessionStorage` for demo reload continuity.
- Panel D superintendent summary component with role-based copy template (no names).

### Data & labelling

- In-app link from workbench footer to `docs/projects/haulage-des/brief.md` (or rendered study pane in PR5).
- Explicit K-Tec “illustrative parameters” chip in panel A when scraper_train is selected.

### Engineering hygiene

- Firebase Hosting stub and `firebase.json` (PR6) without Auth/Firestore.
- Playwright smoke: gallery card → haulage-des → four panel headings visible.
- ESLint/Prettier CI job at repo root invoking `app/` scripts.

### Cross-demo

- Cross-link from fleet-capacity-mdp (future) downtime events into haulage DES inputs (per planning brief cross-links).

## PR2 reviewer audit (2026-05-29)

- `app/tools/gen-truck-cycle` with Mulberry32, triangular/normal/exponential phases, `truck_shovel` + `scraper_train` scenarios; seeds at `app/src/assets/seeds/syn-pgm-bushveld-01/gen-truck-cycle/v1.0.0-{scenario}/`; `npm run gen:seeds` and `npm run test:tools` (Vitest golden hashes). K-Tec illustrative metadata on `scraper_train`; role-based `roles_note` only; no DES engine in PR2.
- `ipcc_conveyor.stub.json` deferred; `train_size` in config not yet consumed by generator logic.

## Suggested extensions after PR2 (ideas only)

### Seed consumption (PR3–4)

- Angular seed loader service: fetch `config.json` + CSV bundles from `assets/seeds/…/gen-truck-cycle/`.
- Panel A scenario selector (`truck_shovel` | `scraper_train`) wired to seed path suffix; show `metadata.ktec_parameters_label` / `fleet_parameters_label` chips.
- Pass parsed cycles into Web Worker DES kernel (queue + resource calendar) with deterministic replay from bundle `seed`.

### Generator

- Implement `ipcc_conveyor` scenario (stub exists); emit under `v1.0.0-ipcc_conveyor/`.
- Use `train_size` in scraper_train cycle semantics or drop from schema until used.
- Congestion / Weibull jam events on `network.graphml` edges (per synthetic-data-generator-spec stretch).
- CLI flag `--check` to fail CI when on-disk seeds drift from `golden-hashes.json` without rewrite.

### Tests & CI

- Commit `vitest.tools.config.ts` + `tsconfig.tools.json` if not already on branch; root or `app/` CI job running `npm run test:tools`.
- Golden-hash update workflow documented in tool README or haulage-des brief.

### Labelling & governance

- Replace any residual OEM-style `haul_unit_class` strings in future scenarios with `illustrative-*` taxonomy.
- Export bundle manifest (sha256 per file) alongside aggregate bundle hash for partial invalidation debugging.

## PR3 reviewer audit (2026-05-29)

- `app/src/app/features/haulage-des/engine/` — min-heap event queue, FIFO loader/dump resources, shift window, MTBF/MTTR breakdown deferral, cycle phases (queue/spot/load/haul/dump/return), KPI aggregation (tonnes/shift, cycle/queue stats, loader idle %, haul util %, SME-style N_h, E=A×U, availability-adjusted throughput, cost/fuel placeholders).
- `haulage-des.worker.ts` + `DesWorkerService` (module Worker, progress + complete messages); `load-seed-config.ts` and Vitest specs excluded from `tsconfig.app.json`.
- `npm run test:engine` (8 golden/behaviour tests), `npm run test:tools`, `ng build` pass; worker chunk `haulage-des-worker`; shell smoke button fetches `v1.0.0-truck_shovel/config.json`.
- Availability KPI uses scheduled breakdown downtime (not a constant 1.0); Gorai hint remains analytic-only.

## Suggested extensions after PR3 (ideas only)

### Engine & seeds

- Browser `SeedConfigService` loading `config.json` from `assets/seeds/…` (replace shell `fetch` + align panel A with scenario suffix).
- Replay/compare against `cycles.csv` from gen-truck-cycle for calibration drift checks.
- Multi-shift runs with shift handover queues; optional deterministic-vs-stochastic toggle for explainers.
- Track dump-queue wait separately from loader-queue wait in KPI cards.

### Worker & UI (PR4)

- Wire panel A scenario picker to both scenarios; show `metadata.ktec_parameters_label` / `fleet_parameters_label` chips.
- Stream cycle events from worker for D3 panel B animation; ECharts queue depth from time-series buffers.
- IndexedDB run history + JSON export; in-session A/B compare table.

### Tests & CI

- Root/`app/` CI job: `test:engine`, `test:tools`, `build`; document golden KPI update workflow when simulator semantics change.
- Property test: availability in (0,1] when MTBF finite; breakdown intervals never double-schedule `breakdown_end`.

## PR4 reviewer audit (2026-05-29)

- `/demo/haulage-des` workbench MVP: **Panel A** scenario picker (`truck_shovel` | `scraper_train`), fleet/payload/haul-distance/horizon/seed controls, Run / Reset / Clone; config loaded via `HttpClient` from `assets/seeds/…/gen-truck-cycle/`; `metadata` illustrative labels surfaced. **Panel B** D3 load–haul–dump schematic with phase animation and queue-depth proxy. **Panel C** ngx-echarts (tree-shaken core) queue rolling average, throughput-by-shift, cycle-time histogram from worker `cycles`. **Panel D** KPI cards, cycle anatomy explainer, role-based superintendent summary (no named personas).
- Compare bar: in-session A/B save, KPI delta table, JSON export/import (`HaulageRunExport` v1), IndexedDB `mining-portfolio` / `haulageDesRuns` auto-save on complete + restore list — matches brief-02 persistence sketch.
- Worker fix: `haulage-des.worker.ts` and `DesWorkerService` return `cycles` on `complete` (required for Panel C charts; was KPI-only in PR3 shell smoke).
- `d3`, `echarts`, `ngx-echarts@21` added; `npm run build`, `test:engine`, `test:tools` pass.
- Deferred to PR5+: in-app brief/study pane, Playwright smoke, sessionStorage last scenario, Gorai analytic overlay, IPCC scenario.

## Suggested extensions after PR4 (ideas only)

### Workbench UX

- Drive Panel B animation from streamed cycle events (not progress-derived phase proxy); tie queue bar to rolling DES queue samples.
- `sessionStorage` last scenario + fleet sliders for demo reload continuity.
- Footer link to `docs/projects/haulage-des/brief.md` or rendered study layer (PR5).

### Persistence & compare

- IndexedDB prune / delete-run UI; export compare pair as single JSON manifest.
- Partial restore when import omits `cycles` (KPI-only cards, charts placeholder).

### CI

- Root or `app/` workflow: `build`, `test:engine`, `test:tools`; Playwright gallery → haulage-des → run → compare → export.

## PR5 reviewer audit (2026-05-29)

- **Background / Study** drawer (`haulage-study-drawer`, `content/haulage-study-content.ts`): six sections (decision question, haul-cycle anatomy, N_h / E = A×U, stochastic queues, illustrative K-Tec hypotheses, synthetic limits); role-based copy only; citation chips link to `planning/` sources (SME, Gorai, Dunbar, Ukwazi, brief #02).
- **Presenter mode** (`haulage-presenter-panel`, `content/haulage-demo-checklist.ts`, `HaulagePresenterStateService`): 5-minute teleprompter with timed sections mirroring `demo-script-outline.md`; checkbox progress in `localStorage` (`haulage-des-presenter-checklist-v1`); reset + completion counter.
- **Context toolbar** above workbench toggles study vs presenter (mutually exclusive); panel D cycle anatomy points to **Background / Study**.
- Docs sync: `brief.md` documents in-app content paths; `demo-script-outline.md` aligned with checklist (no panel D placeholder copy).
- `npm run build` passes; PR4 workbench, compare, IndexedDB unchanged.
- Still deferred: Playwright smoke, `sessionStorage` last scenario, Gorai analytic overlay, IPCC scenario, workbench footer doc link (study toolbar replaces footer link).

## Suggested extensions after PR5 (ideas only)

### Study & presenter

- Deep-link `?study=match-efficiency` or presenter section hash for rehearsal bookmarks.
- Export presenter checklist progress as JSON for facilitator handoff.
- Render brief markdown from `docs/` via fetch (optional) instead of duplicated TS copy — keep single source if drift becomes painful.

### Workbench UX

- `sessionStorage` last scenario + fleet sliders for demo reload continuity.
- Footer link to repo `docs/projects/haulage-des/brief.md` on GitHub alongside in-app study drawer.

### CI

- Playwright: gallery → haulage-des → open study → presenter tick → run DES → export.
