# mining-operations

Public portfolio of operations research applications in mine planning.

## Angular portfolio app

The interactive demo shell lives in [`app/`](app/). It uses **Angular 21** (standalone components, signals in catalog service) with a dark steel-blue theme distinct from integraldecision.com.

### Run locally

```bash
cd app
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200). From the repo root you can also use `npm start` (delegates to `app/`).

### Build and test

From `app/` (or use root scripts that delegate with `--prefix app`):

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build → `app/dist/portfolio/browser` |
| `npm run test:engine` | Vitest — DES engine unit tests |
| `npm run test:tools` | Vitest — `gen-truck-cycle` golden seeds |
| `npm run test:e2e` | Playwright smoke — gallery -> haulage notebook -> run -> compare -> export |
| `npm run gen:seeds` | Regenerate deterministic seed assets |

```bash
cd app
npm run build
npm run test:engine
npm run test:tools
npm run test:e2e   # installs Chromium via Playwright on first run
```

First-time e2e: `cd app && npx playwright install chromium`

### Routes

| Path | Purpose |
|------|---------|
| `/` | Demo gallery (`assets/catalog/demos.json`) |
| `/demo/haulage-des` | Haulage DES notebook demo (decision, model, run, compare, limitations) |
| `/demo/:demoId` | Coming-soon previews for other catalog entries |
| `/about` | Portfolio positioning and synthetic-data policy |

### Haulage DES docs

- [`docs/projects/haulage-des/brief.md`](docs/projects/haulage-des/brief.md)
- [`docs/projects/haulage-des/demo-script-outline.md`](docs/projects/haulage-des/demo-script-outline.md)
- [`docs/projects/haulage-des/demo-checklist.md`](docs/projects/haulage-des/demo-checklist.md) — 5-minute manual interview checklist

The 5-minute haulage talk track starts with the superintendent's operational
question: would a different haulage method reduce queueing or improve tonnes per
shift enough to justify a site-data study? The demo then explains why
fixed-average cycles miss queueing, defines the DES model, runs the synthetic
truck-shovel baseline, clones a scraper-train hypothesis, compares directional
KPI deltas, exports JSON, and closes with limitations. Known limitations:
synthetic inputs only; no operational forecast, vendor benchmark, unit-cost,
diesel, water, emissions, road-geometry, material-suitability, or
dispatch-validation model.

Planning acceptance contract: [`planning/portfolio-shortlist-briefs.html`](planning/portfolio-shortlist-briefs.html#brief-02).

### Deferred Firebase Hosting

Hosting config is stubbed at repo root for a future deploy (no Auth/Firestore in MVP):

- [`firebase.json`](firebase.json) — `public`: `app/dist/portfolio/browser`
- [`.firebaserc`](.firebaserc) — replace `REPLACE_WITH_FIREBASE_PROJECT_ID` before `firebase deploy`

```bash
cd app && npm run build
# firebase deploy   # when project id is configured
```
