# Mining operations portfolio (Angular)

Angular 21 standalone SPA for the mining-operations demo portfolio.

## Commands

```bash
npm install
npm start      # ng serve → http://localhost:4200
npm run build  # production build
npm run test   # unit tests (Vitest)
```

## Structure

- `src/app/features/gallery` — demo gallery (`/`)
- `src/app/features/haulage-des` — haulage DES workbench shell (`/demo/haulage-des`)
- `src/app/features/demo-entry` — lazy demo routing and coming-soon previews
- `src/app/shared` — `WorkbenchLayout`, `NotebookLayout`, `SyntheticDataDisclaimer`
- `src/assets/catalog/demos.json` — catalog metadata

See repo root [`README.md`](../README.md) for full context.
