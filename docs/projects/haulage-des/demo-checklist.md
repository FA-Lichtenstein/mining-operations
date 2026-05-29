# Haulage DES — 5-minute interview demo checklist

Manual verification before a live demo or interview. Role-based copy only (no fictional character names). Demo site: **syn-pgm-bushveld-01**.

In-app **Presenter mode** on `/demo/haulage-des` mirrors this list. Source of truth for presenter UI: `app/src/app/features/haulage-des/content/haulage-demo-checklist.ts`.

## Before you start

- [ ] `cd app && npm install && npm run build`
- [ ] `npm run test:engine` and `npm run test:tools` pass
- [ ] `npm run test:e2e` passes (or note environment blocker)
- [ ] `npm start` → [http://localhost:4200](http://localhost:4200)

## 0:00–0:45 — Open and orient

- [ ] Portfolio gallery loads; **Truck-shovel vs K-Tec scraper DES** shows **Live**
- [ ] Open demo; workbench title and four panels (A–D) visible
- [ ] Synthetic-data disclaimer visible
- [ ] **Background / Study** opens; load–haul–dump anatomy readable on panel B
- [ ] **Presenter mode** opens with timed sections

## 0:45–1:30 — Baseline scenario

- [ ] Panel A: **Truck–shovel** scenario selected
- [ ] Seed metadata and **Synthetic** tag visible
- [ ] `syn-pgm-bushveld-01` appears in subtitle or meta line

## 1:30–2:30 — Run truck-shovel DES

- [ ] **Run DES** completes (Web Worker; progress if multi-shift)
- [ ] Panel D: KPI cards show tonnes/shift, cycle time, queue wait, match N<sub>h</sub>
- [ ] Panel C: queue / throughput charts render
- [ ] Panel D: **Technical Services superintendent** summary and follow-ups appear

## 2:30–3:30 — Compare scraper train

- [ ] **Clone → Scraper** (or truck) switches scenario and re-runs
- [ ] **Save as A** / **Save as B** after two runs; compare table shows Δ (B−A)
- [ ] Narrate trade-offs for superintendent (throughput vs queueing)

## 3:30–4:15 — Study layer (optional depth)

- [ ] Study drawer: match factor, E = A × U, stochastic queues, illustrative K-Tec notes
- [ ] Citation chips link to planning source pages (new tab)

## 4:15–5:00 — Export and close

- [ ] **Export JSON** downloads a haulage-des run file
- [ ] IndexedDB saved runs list updates after run (optional refresh restore)
- [ ] Return to gallery or **About** for portfolio context

## Deferred (not in MVP)

- IPCC scenario UI, Gorai analytic overlay, PDF superintendent pack, Firebase deploy

## Related docs

- [brief.md](./brief.md)
- [demo-script-outline.md](./demo-script-outline.md)
- Repo README: build, `test:engine`, `test:tools`, `test:e2e`
