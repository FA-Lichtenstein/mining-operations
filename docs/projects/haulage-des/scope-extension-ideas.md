# Haulage DES Scope Extension Ideas

This file records proposed future scope only. Do not treat these notes as PR 1 acceptance work, and do not implement them without a follow-up PR.

## PR 1 Reviewer Notes (2026-05-29)

- Proposed future scope: turn the narrative contract into a reviewer checklist that later PRs can reuse during content, engine, and UI review.
- Proposed future scope: add a source-claim trace table after the article copy is written, mapping each user-visible claim to `narrative-redesign.md` and the underlying planning source.
- Proposed future scope: add a final demo-readiness rubric that checks whether the first minute explains the decision question before any dashboard controls appear.
- Proposed future scope: decide whether this file should merge into the existing `scope-extensions.md` backlog after the rescue series lands, so future scope has one canonical home.

## PR 2 Reviewer Notes (2026-05-29)

- Proposed future scope: add event-level queue occupancy snapshots so the schematic can show actual loader and dump queue lengths instead of an animation-only progress preview.
- Proposed future scope: add a small KPI glossary or tooltip layer that distinguishes loader queue wait, dump queue wait, recommended haul units N_h, and fleet match ratio without relying on panel text.
- Proposed future scope: decide whether exported brief fields should be renamed from legacy `queueWait_min` and `matchFactor` to PR 2's explicit loader-wait and recommended-unit terminology in a versioned export format.

## PR 3 Reviewer Notes (2026-05-29)

- Proposed future scope: add inline source markers inside study paragraphs so each visible citation sits directly beside the claim it supports instead of only at section level.
- Proposed future scope: turn the presenter walkthrough into a read-only narrative mode with optional rehearsal checkboxes hidden behind a practice toggle.
- Proposed future scope: add a short glossary card for DES, FIFO queue, availability, utilisation, fleet match ratio, and recommended haul units once the notebook UI flow has a stable article layout.

## PR 4 Reviewer Notes (2026-05-29)

- Proposed future scope: add a visual regression or e2e assertion that the haulage route shows exactly one visible synthetic-data warning near the top of the app shell.
- Proposed future scope: evaluate whether the Study and Presenter panels should become modal side sheets on wider screens, preserving inner-only scrolling without pushing the notebook article down.
- Proposed future scope: replace the optional cycle animation with event-level loader and dump queue snapshots once the simulator exposes real occupancy traces.
- Proposed future scope: add a short route-local table of contents after the notebook flow stabilizes, so hiring-manager reviewers can jump between problem, controls, results, comparison, and limitations.

## PR 5 Reviewer Notes (2026-05-29)

- Proposed future scope: add chart-level visual tests that verify the loader queue chart, throughput target line, and cycle-time histogram still render after future ECharts changes.
- Proposed future scope: add a versioned export field rename so legacy `queueWait_min` and `matchFactor` brief values can become explicit loader-wait and recommended-unit names without breaking existing imports.
- Proposed future scope: add a comparison explainer panel that expands the directional KPI summary into a short worked example for hiring-manager demos.

## PR 6 Reviewer Notes (2026-05-29)

- Proposed future scope: add a rehearsal-mode e2e path that opens Presenter mode and verifies its checklist still follows the hiring-manager talk track.
- Proposed future scope: add a lightweight accessibility check around the notebook route so future copy changes keep the decision question, run controls, compare section, and limitations discoverable by role and heading.
- Proposed future scope: add a small generated demo pack that bundles the exported JSON with a one-page superintendent memo once real site-data fields and versioned export names are settled.
