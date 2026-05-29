# mining-operations

Public portfolio of operations research applications in mine planning.

## Angular portfolio app (PR 1)

The interactive demo shell lives in [`app/`](app/). It uses **Angular 21** (standalone components, signals in catalog service) with a dark steel-blue theme distinct from integraldecision.com.

### Run locally

```bash
cd app
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200). From the repo root you can also use `npm start` (delegates to `app/`).

### Build & test

```bash
cd app
npm run build
npm run test
```

### Routes

| Path | Purpose |
|------|---------|
| `/` | Demo gallery (`assets/catalog/demos.json`) |
| `/demo/haulage-des` | Haulage DES workbench shell (4 panels, placeholders) |
| `/demo/:demoId` | Coming-soon previews for other catalog entries |
| `/about` | Portfolio positioning and synthetic-data policy |

### Haulage DES docs

- [`docs/projects/haulage-des/brief.md`](docs/projects/haulage-des/brief.md)
- [`docs/projects/haulage-des/demo-script-outline.md`](docs/projects/haulage-des/demo-script-outline.md)

Planning acceptance contract: [`planning/portfolio-shortlist-briefs.html`](planning/portfolio-shortlist-briefs.html#brief-02).
