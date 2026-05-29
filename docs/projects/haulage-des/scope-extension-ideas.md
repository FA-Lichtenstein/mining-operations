# Haulage DES Scope Extension Ideas

This file is the consolidated future-scope list from the six rescue PR reviews. None of the items below were implemented in the rescue series; each needs a separate follow-up PR with its own acceptance checks.

## Source Grounding And Review Workflow

- Add a reviewer checklist derived from `narrative-redesign.md` so future content, engine, UI, and demo-readiness reviews use the same acceptance contract. Provenance: PR 1, PR 6.
- Add a source-claim trace table that maps each user-visible domain claim to `narrative-redesign.md` and the underlying planning source. Provenance: PR 1, PR 3.
- Add a demo-readiness rubric that checks whether the first minute explains the operational decision before any controls or charts are discussed. Provenance: PR 1.

## Simulation Evidence And Data Contracts

- Emit event-level loader and dump queue occupancy snapshots so the optional schematic can show actual simulated state instead of a progress animation preview. Provenance: PR 2, PR 4.
- Introduce a versioned export schema that renames legacy brief fields such as `queueWait_min` and `matchFactor` to explicit loader-wait and recommended-haul-unit names without breaking old imports. Provenance: PR 2, PR 5.
- Add a compact KPI glossary or reference card for DES, FIFO queue, loader wait, dump wait, availability, utilisation, operating efficiency, recommended haul units N_h, and fleet match ratio. Provenance: PR 2, PR 3.

## Presenter And Notebook Experience

- Turn Presenter mode into a read-only narrative walkthrough with rehearsal checkboxes behind an optional practice toggle. Provenance: PR 3.
- Evaluate modal side sheets for Study and Presenter panels on wider screens while preserving inner-only scrolling. Provenance: PR 4.
- Add a route-local table of contents for problem, controls, results, comparison, limitations, and export sections. Provenance: PR 4.
- Add a comparison explainer panel that expands the directional KPI summary into a short worked example for hiring-manager demos. Provenance: PR 5.

## Regression And Accessibility Gates

- Add chart-level visual tests for the loader queue chart, throughput target line, and cycle-time histogram after ECharts changes. Provenance: PR 5.
- Add a rehearsal-mode e2e path that opens Presenter mode and verifies the talk track still mirrors `demo-script-outline.md`. Provenance: PR 6.
- Add lightweight accessibility checks around the notebook route so the decision question, run controls, compare section, and limitations remain discoverable by role and heading. Provenance: PR 6.

## Demo Pack Output

- Generate a small demo pack that bundles an exported run JSON with a one-page superintendent memo after site-data fields and versioned export names are settled. Provenance: PR 6.

## Deliberately Still Out Of Scope

The rescue series did not implement unit-cost, diesel, water, emissions, road-geometry, material-suitability, vendor-performance, IPCC, dispatch-validation, Firebase/Auth, or server-compute scope.
