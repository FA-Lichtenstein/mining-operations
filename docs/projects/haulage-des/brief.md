# Haulage DES — project brief (PR 1)

## Problem

A **Technical Services superintendent** asks whether adding K-Tec scraper trains can reduce unit cost on a 12 Mt/a waste-stripping push without starving ore feed. Conventional truck-shovel cycles dominate the pit; contractor haulage is common in the Bushveld. The **Quantitative Planning Analyst** needs a defensible discrete-event simulation (DES) comparison — cycle times, queueing, match factor, tonnes per shift — not a vendor brochure.

## Demo site

- **Mine ID:** `syn-pgm-bushveld-01` (fully synthetic PGM Bushveld context)
- **MVP scenarios (later PRs):** `truck_shovel`, `scraper_train`
- **Stretch:** `ipcc` (T4 fixed-charge / sidebar framing)

## Role-based personas (no fictional names)

| Role | Responsibility in the demo |
|------|------------------------------|
| Technical Services superintendent | Poses the haulage trade-off question; reviews KPI summary and follow-up checks |
| Quantitative Planning Analyst | Configures scenarios, runs DES, compares runs, exports evidence for decision memos |

## MVP acceptance (target state — PR 3–6)

- Workbench at `/demo/haulage-des` with panels A–D (controls, D3 schematic, ECharts queues, KPI / explainer)
- Web Worker DES with deterministic seeds from `gen-truck-cycle`
- In-session A/B compare (truck-shovel vs scraper-train), optional IndexedDB save, JSON export
- Synthetic-data and illustrative K-Tec labelling visible in UI

## Assumptions (illustrative)

- Fleet and cycle parameters in seeds are synthetic, not operational forecasts
- K-Tec scraper parameters are labelled illustrative, not vendor benchmarks
- Gorai / SME material supports explainers and sanity checks, not a parallel analytic engine

## PR 1 scope (this document)

Shell only: gallery route, four-panel workbench placeholders, thin docs. No generator, DES engine, or chart libraries yet.

## References

- Portfolio brief: `planning/portfolio-shortlist-briefs.html#brief-02`
- Synthesis plan: haulage DES 6-PR roadmap (PR 1–6)
