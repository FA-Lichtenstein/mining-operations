# Haulage DES - project brief

The source-grounded article contract lives in [`narrative-redesign.md`](./narrative-redesign.md). The rehearsable demo script lives in [`demo-script-outline.md`](./demo-script-outline.md).

## Problem

A **Technical Services superintendent** asks whether a different haulage method could reduce queueing or improve tonnes per shift enough to justify a real site-data study. Conventional truck-shovel cycles dominate the synthetic pit, and K-Tec scraper trains are treated as an illustrative hypothesis because of Ukwazi's published equipment context. The **Quantitative Planning Analyst** needs a defensible discrete-event simulation (DES) comparison — cycle times, queueing, fleet match, tonnes per shift — not a vendor brochure or a production forecast.

## Demo site

- **Mine ID:** `syn-pgm-bushveld-01` (fully synthetic PGM Bushveld context)
- **MVP scenarios:** `truck_shovel`, `scraper_train`
- **Deferred stretch:** `ipcc` (T4 fixed-charge / sidebar framing)

## Role-based personas (no fictional names)

| Role | Responsibility in the demo |
|------|------------------------------|
| Technical Services superintendent | Poses the haulage trade-off question; reviews KPI summary and follow-up checks |
| Quantitative Planning Analyst | Configures scenarios, runs DES, compares runs, exports evidence for decision memos |

## Current demo flow

- Notebook-style workbench at `/demo/haulage-des`: decision question, model explanation, baseline run, results interpretation, scenario comparison, limitations, and JSON export
- Web Worker DES with deterministic seeds from `gen-truck-cycle`
- In-session A/B compare (truck-shovel vs scraper-train), IndexedDB save, JSON export
- One global synthetic-data warning in the app shell, plus route-level caveats in the notebook copy
- Background/Study drawer and 5-minute presenter checklist for interview rehearsal
- Hiring-manager script: open with the operating question, define the DES model, run the baseline, clone the scraper-train hypothesis, compare directional KPI deltas, export JSON, and close with known limitations.

Future scope from the rescue review is consolidated in [`scope-extension-ideas.md`](./scope-extension-ideas.md).

## Assumptions (illustrative)

- Fleet and cycle parameters in seeds are synthetic, not operational forecasts
- K-Tec scraper parameters are labelled illustrative, not vendor benchmarks
- Gorai / SME material supports explainers and sanity checks, not a parallel analytic engine

## In-app study layer

Expanded background copy lives in the Angular app at
`app/src/app/features/haulage-des/content/haulage-study-content.ts` (problem, roles,
haul-cycle anatomy, match factor, stochastic queues, scraper hypotheses, synthetic limits).
The 5-minute presenter checklist mirrors `demo-script-outline.md` in
`content/haulage-demo-checklist.ts`. Keep these files aligned when editing this brief or the demo script.

## Known limitations

- No operational forecast: site, fleet, cycle, availability, utilisation, and downtime inputs are synthetic.
- No vendor benchmark: scraper-train values are illustrative hypotheses, not K-Tec performance claims.
- No unit-cost, diesel, water, emissions, road-geometry, or material-suitability model.
- No dispatch-data, survey, reconciliation, fleet-management, or maintenance validation.
- IPCC, PDF superintendent packs, Firebase deploy work, and source-claim trace tooling remain future scope.

## References

- Narrative redesign contract: [`narrative-redesign.md`](./narrative-redesign.md)
- Portfolio brief: `planning/portfolio-shortlist-briefs.html#brief-02`
- Synthesis plan: haulage DES 6-PR roadmap (PR 1–6)
