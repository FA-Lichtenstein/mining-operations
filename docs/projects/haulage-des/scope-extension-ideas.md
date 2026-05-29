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
