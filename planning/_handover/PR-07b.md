# PR-07b — Synthetic data spec

## Inputs read

- `PR-07.md` — per-theme data packages, synthetic gaps, calibration anchors, PR-07b blocking PR-19
- `../open-data-apis-mining.html` — anchor files (`entities.csv`, `throughput_priors.json`, `benchmark_kpi.csv`, `closure_risk.csv`), theme gap table, T1–T6 package recommendations
- `PR-05.md` — clone cases #01–#12 requiring synthetic pit/haul/reconciliation seeds
- `PR-04.md` — Worker DES, GeoJSON maps, Storage/Firestore patterns
- `theme-taxonomy.md` — T1–T6 definitions, Data feasibility scorecard column
- `README-template.md` — row-ID protocol, handover format
- `../_template.html` — HTML/CSS skeleton
- `../index.html` — registry row `id="pr-07b"` updated to complete

## Key findings

- **Deliverable:** `synthetic-data-generator-spec.html` — three generators with JSON Schema samples, example configs, output column/GeoJSON specs, PR-07 calibration hook table, T1–T6 → generator → demo mapping, PR-05 case crosswalk, reference seed bundle layout, scorecard, Angular+Firebase sketch.
- **Generator IDs:** `gen-block-model` (blocks + precedence + GeoJSON), `gen-truck-cycle` (cycles + fleet events + MDP snapshots), `gen-plan-survey-var` (daily reconciliation + bench variance + survey polygons).
- **T1/T2/T3 primary mapping:** T1 → block model; T2 → truck cycle; T3 → plan-survey variance — matches PR-07 synthetic gap rows exactly.
- **T4/T5/T6:** T4 combines block + cycle (IPCC scenario via re-run with alternate dump zone); T5 uses `fleet_state.json`; T6 uses block site metadata + PR-07 `closure_risk.csv` (no fourth generator — MC draws stay in demo Worker).
- **Calibration:** Block tonnage capped to B1/ME Bulletin aggregates; cycle throughput from P2041 priors + network haul distance; variance μ/σ from `benchmark_kpi.csv` delta_pct and ME Bulletin bands.
- **Reference site:** `syn-pgm-bushveld-01` — PGM OP Limpopo hub aligned with PR-07 T1 package example; generators run block → truck → plan-survey (spatial dependency).
- **Demo module IDs (PR-19 seeds):** `pit-schedule-gantt`, `haulage-des`, `reconciliation-dashboard`, `ipcc-tradeoff-wsm`, `fleet-capacity-mdp`, `closure-liability-mc`.
- **Artifact scorecard:** Ukwazi 5, CV 2, Stack 5, Data 5, Diff 4, Effort M — unblocks PR-19 Data column for T1–T3 ideas.

## Open questions / risks

- **D1 extraction still manual:** Generators reference `entities.csv` row indices — PR-07 ETL milestone still required before real mine IDs bind.
- **Block model scale vs browser:** Cap 576 blocks (12×48) for map/Gantt performance; full-pit models not feasible in SPA.
- **T6 tailings bulk:** Global Tailings CSV request still on critical path for geo overlay — generator spec does not replace that anchor.
- **Schema versioning:** Column changes require generator semver bump + Firestore metadata migration.
- **MIP scheduling credibility:** Block/precedence seeds support toy heuristics only — pre-computed schedules may still be needed for T1 cases #13–#14 (PR-04 anti-pattern).

## Review fixes (2026-05-27)

- Added **PR-07 vs PR-07b** boundary table in deliverable HTML.
- Fixed **`reconciliation_daily.csv`** header typo (`surveyed_t` had leading space in example).
- Added **`scenario_id`** to truck-cycle config and `cycles.csv` for T4 IPCC dual-run paths.
- Added **post-generation validation** rules (tonnage conservation, throughput band, national variance check).
- Extended **calibration hooks** for `capacity_series.csv` (T5) and `commodity_macro.csv` (T4).
- Extended **PR-05 crosswalk** for cases #13–#19 (topology-only vs not seed targets).
- Documented **DES/block-model best-practice** alignment (cycle phases, precedence, stochastic segments).
- Added **optional extensions** section (truck state log, grade–tonnage coupling, congestion, CI golden files).

## Recommended next tasks

- **PR-19** — Score seed ideas using Data=5 for modules consuming these generators; tag `haulage-des`, `reconciliation-dashboard`, `ipcc-tradeoff-wsm`.
- **Implementation (optional)** — TypeScript CLI or Cloud Function implementing three generators + upload reference bundle for `syn-pgm-bushveld-01`.
- **PR-07 ETL** — D1 → `entities.csv`, P2041 → `benchmark_kpi.csv` so calibration refs resolve to real files.
- **PR-18** — Method ↔ theme matrix; add generator column citing IDs from this spec.
