# Theme taxonomy (T1–T6)

Canonical portfolio themes derived from [ukwazi-services-summary.html](../ukwazi-services-summary.html) §5. Use these IDs in scorecards, method matrices, seed tags, and handover docs.

| ID | Theme | Description |
|----|-------|-------------|
| **T1** | Short/medium-term scheduling & sequencing | Pit pushbacks, strip/dragline blocks, underground production rings; optimisation under equipment and geotechnical constraints. |
| **T2** | DES/ABS simulation (haulage, equipment, contractors) | Truck-shovel vs scraper systems, haulage bottlenecks, contractor coordination, material handling alternatives. |
| **T3** | Production reconciliation & spatial KPIs | Survey-to-plan variance, spatial performance measurement, dashboards, transparency and accountability on site. |
| **T4** | Techno-economic trade-offs & transition timing | Method selection (IPCC vs trucking, open pit vs underground transition), feasibility-style trade-off models. |
| **T5** | Forecasting / MDP / capacity-constrained planning | Workforce/equipment planning analogues, fleet and crew sizing, capacity-constrained optimisation under uncertainty. |
| **T6** | Closure liability & risk-based financial modelling | Stochastic or scenario-based closure cost estimates, financial provisioning, sustainable mining and valuation work. |

## Suggested final portfolio mix

Lead with **one project each from T1, T2, and T3**, plus an optional **T4 or T6** brief for breadth.

---

## Scorecard columns

Each research HTML doc (and each idea in PR-19) should include a scorecard with these dimensions:

| Column | Scale | Notes |
|--------|-------|-------|
| Ukwazi fit | 1–5 | Maps to T1–T6 alignment with Quantitative Planning Analyst remit |
| CV proof | 1–5 | Existing demonstrable skills in CV / prior work |
| Angular+Firebase fit | 1–5 | Browser-feasible without Deswik/Whittle integration |
| Data feasibility | 1–5 | Public or synthetic data sufficient (see PR-07, PR-07b) |
| Differentiation | 1–5 | vs generic OR portfolio demos |
| Effort | S / M / L | Solo polished demo cost (S = small, M = medium, L = large) |

### 1–5 rubric (qualitative)

- **1** — Poor fit / no evidence / impractical
- **2** — Weak; significant gaps
- **3** — Adequate; workable with caveats
- **4** — Strong; clear path to demo
- **5** — Excellent; flagship candidate

---

## Composite scoring formula (PR-19)

Used in `portfolio-ideas-catalog.html` to rank seed ideas:

```
composite = (4×Ukwazi + 3×CV + 2×Stack + 2×Data + 2×Diff) / 13
           − effort_penalty
```

Where:

- **Ukwazi** = Ukwazi fit score (1–5)
- **CV** = CV proof score (1–5)
- **Stack** = Angular+Firebase fit score (1–5)
- **Data** = Data feasibility score (1–5)
- **Diff** = Differentiation score (1–5)

**Effort penalty:**

| Effort | Penalty |
|--------|---------|
| S | 0 |
| M | 0.3 |
| L | 0.6 |

**Keep threshold:** composite ≥ **3.5**, with at least one T1–T6 pillar covered.

**Example (composite only):** Ukwazi=4, CV=3, Stack=4, Data=3, Diff=4, Effort=M →  
`(4×4 + 3×3 + 2×4 + 2×3 + 2×4) / 13 − 0.3 ≈ 3.32` (below threshold).

PR-20 applies manual preference weights on top (e.g. boost T2 if simulation is priority).
