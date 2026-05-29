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

## Demo checklist

Manual 5-minute verification: [`../docs/projects/haulage-des/demo-checklist.md`](../docs/projects/haulage-des/demo-checklist.md)

See repo root [`README.md`](../README.md) for Firebase Hosting stub and full context.
