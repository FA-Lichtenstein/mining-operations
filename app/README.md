# Mining operations portfolio (Angular)

Angular 21 standalone SPA for the mining-operations demo portfolio.

## Commands

```bash
npm install
npm start              # ng serve → http://localhost:4200
npm run build          # production build → dist/portfolio/browser
npm run test:engine    # DES engine Vitest suite
npm run test:tools     # gen-truck-cycle golden-file tests
npm run test:e2e       # Playwright smoke (starts dev server if needed)
npm run gen:seeds      # regenerate assets/seeds/syn-pgm-bushveld-01/...
```

First Playwright run may require: `npx playwright install chromium`

## Structure

- `src/app/features/gallery` — demo gallery (`/`)
- `src/app/features/haulage-des` — haulage DES workbench (`/demo/haulage-des`)
- `src/app/features/demo-entry` — lazy demo routing and coming-soon previews
- `src/app/shared` — `WorkbenchLayout`, `NotebookLayout`, `SyntheticDataDisclaimer`
- `src/assets/catalog/demos.json` — catalog metadata
- `e2e/` — Playwright smoke tests (`playwright.config.ts`)

## Haulage demo rehearsal

Hiring-manager 5-minute talk track: [`../docs/projects/haulage-des/demo-script-outline.md`](../docs/projects/haulage-des/demo-script-outline.md)

The haulage route is a notebook-style narrative. Start the demo with the
operational question, then explain the DES model, run the synthetic truck-shovel
baseline, clone the scraper-train hypothesis, compare A/B KPI deltas, export
JSON, and close with limitations. The e2e smoke test asserts that the route
shows exactly one synthetic-data warning and covers the notebook flow.

Known limitations to state during rehearsal: all site and fleet assumptions are
synthetic; the run is not an operational forecast or vendor benchmark; and cost,
diesel, water, road geometry, material suitability, and dispatch validation are
outside the current model.

See repo root [`README.md`](../README.md) for Firebase Hosting stub and full context.
