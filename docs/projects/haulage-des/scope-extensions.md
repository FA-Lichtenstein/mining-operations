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
