# Haulage DES Narrative Redesign Contract

This document is the acceptance contract for the next version of the haulage DES demo. It defines the story before behavior changes. The demo should be readable as an article even when the app is not open.

## Thesis

This demo tests whether a stochastic haulage model can expose queueing and utilisation trade-offs that a deterministic cycle spreadsheet hides.

## Target Reader

The primary reader is a mining technical-services or operational-planning reviewer who needs to judge whether the portfolio demo asks a credible mine-planning question. The secondary reader is a quantitative planning analyst who wants to see how the model maps mining concepts into a small browser simulation. [Source: `planning/ukwazi-services-summary.html`, sections 2.1, 2.6, and 5; `C:/Users/frans/.cursor/plans/haulage_synthesis_373169da.plan.md`, planning anchors.]

The reader should not need prior knowledge of the current app layout. The article must introduce the decision, define the model, run a baseline, compare a scenario, and close with limitations and site-data requirements. [Source: `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, PR 1 and target reader questions.]

## Decision Question

The decision question is: in a synthetic open-pit waste-haulage setting, does changing the haulage method and fleet configuration reduce queueing or improve throughput enough to deserve a closer site-data study? [Source: `docs/projects/haulage-des/brief.md`; `planning/ukwazi-services-summary.html`, section 2.6.]

This is a comparison of simulated operating behavior, not a recommendation to buy equipment or change a mine plan. [Source: `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, PR 1 non-claims.]

## Non-Goals And Non-Claims

- The demo is not an operational forecast. All site, fleet, and cycle inputs are synthetic. [Source: `docs/projects/haulage-des/brief.md`, assumptions; `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, PR 1 non-claims.]
- The demo is not a vendor benchmark for K-Tec or for truck-shovel systems. Any scraper-train parameters are illustrative. [Source: `docs/projects/haulage-des/brief.md`, assumptions; `planning/ukwazi-services-summary.html`, section 2.6.]
- The demo does not yet model unit cost, diesel, water, emissions, or contractor commercial terms. [Source: `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, PR 1 non-claims and out-of-scope list.]
- The demo has not been validated against dispatch, fleet-management, survey, reconciliation, or maintenance data. [Source: `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, PR 1 non-claims.]
- The demo does not claim that the current browser engine reproduces SME or Gorai formulas exactly. Those sources define concepts and sanity checks; the simulation article must state what is source-grounded and what is synthetic. [Source: `docs/projects/haulage-des/brief.md`, assumptions; `planning/source-sme-mining-reference-handbook-2020.html`, section 4; `planning/source-gorai-chatterjee-optimization-mines-2022.html`, sections 3 and 4.]

## Source-Grounded Claims

- Ukwazi presents itself as a South African mining advisory and operations-services company covering mining work from study through operational support. [Source: `planning/ukwazi-services-summary.html`, lead and section 2.]
- Ukwazi publishes operational site-services work that includes short-term mine planning, scheduling, sequencing, production-process optimisation, reconciliation, contractor or owner alignment, spatial performance measurement, and data-driven improvement. [Source: `planning/ukwazi-services-summary.html`, section 2.1, "Site services (operational)".]
- Ukwazi's portfolio fit includes operational technical services and quantitative decision support, so a haulage simulation is a plausible portfolio theme. [Source: `planning/ukwazi-services-summary.html`, section 5.]
- Ukwazi is associated in the planning source with K-Tec equipment distribution in sub-Saharan Africa, including ADT pull scrapers for dry mining and tailings or residue rehandling. [Source: `planning/ukwazi-services-summary.html`, section 2.6.]
- Discrete-event or agent-based simulation is an appropriate portfolio pattern for truck-shovel and scraper haulage bottlenecks because the work is event-driven and queue-dependent. [Source: `planning/ukwazi-services-summary.html`, section 5; `planning/angular-firebase-or-stack.html`, "DES / ABS" row.]
- Stochastic DES is appropriate for truck fleet estimation when deterministic planning hides waiting and queue effects. [Source: `planning/mining-or-real-world-examples.html`, case 01; online anchor if needed: Huayanca, Bujaico, and Delgado, "Application of DES for Truck Fleet Estimation at an Open-Pit Copper Mine in Peru", MDPI Applied Sciences 2023.]
- SME Ch 12 supports the demo's availability, utilisation, operating efficiency, haul-cycle, and match-factor vocabulary. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, chapter map and formula table.]
- SME defines operating efficiency as availability times utilisation under uniform conditions, and distinguishes availability from utilisation. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, sections 3, 4, and 5.]
- SME frames truck count or match factor as haul cycle time divided by loading time, with spares considered for breakdowns. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, sections 3, 4, and 5.]
- Gorai and Chatterjee Ch 10 provides the queueing context for shovel-truck fleet sizing, including finite truck populations, first-come-first-served queues, shovel utilisation, and queue cost trade-offs. [Source: `planning/source-gorai-chatterjee-optimization-mines-2022.html`, sections 3 and 4.]

## Synthetic Assumptions

- The site label `syn-pgm-bushveld-01` is synthetic and should remain visibly labelled as such. [Source: `docs/projects/haulage-des/brief.md`, demo site.]
- The first two modeled methods are `truck_shovel` and `scraper_train`; `ipcc` is not part of this article flow. [Source: `docs/projects/haulage-des/brief.md`, demo site; `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, out-of-scope list.]
- Cycle-time distributions, payloads, fleet counts, shift length, availability, utilisation, and breakdown behavior are illustrative inputs until replaced by site data. [Source: `docs/projects/haulage-des/brief.md`, assumptions; `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, target reader questions.]
- K-Tec scraper-train values are scenario hypotheses, not published vendor-performance claims. [Source: `docs/projects/haulage-des/brief.md`, assumptions; `planning/ukwazi-services-summary.html`, section 2.6.]
- Cost, diesel, water, emissions, road geometry, material suitability, and dispatch validation are deferred and must not appear as modeled outputs. [Source: `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, target reader questions and out-of-scope list.]

## Model Contract

The model should be described as a finite-horizon discrete-event simulation of haul units cycling through loading, loaded travel, dumping or ejecting, empty return, breakdown, and repair. [Source: `C:/Users/frans/.cursor/plans/haulage_synthesis_373169da.plan.md`, PR 3.]

The modeled resources should be explicit. At minimum, the article should name haul units, loader or shovel capacity, dump or eject capacity when modeled, and any repair or downtime state. [Source: `C:/Users/frans/.cursor/plans/haulage_synthesis_373169da.plan.md`, PR 3; `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 10.8 source summary.]

Queues should be named as FIFO queues unless later code proves a different discipline. Loader waiting and dump waiting should not be blended unless the app clearly labels the aggregate. [Source: `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 10.6.4 and 10.8 source summary; `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, PR 2 guidance.]

Randomness should be explained as sampled cycle components or availability events around synthetic averages, not as real dispatch variability. [Source: `docs/projects/haulage-des/brief.md`, assumptions; `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 2 and Ch 10 source summary.]

## Model Events

- Shift starts and initializes available haul units and resources. [Source: `C:/Users/frans/.cursor/plans/haulage_synthesis_373169da.plan.md`, PR 3.]
- A haul unit requests the loader or shovel. If the resource is busy, the unit joins a FIFO queue. [Source: `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 10.6.4 and 10.8 source summary.]
- Loading starts when a loader slot is free. Loading ends after the sampled service time. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 source summary; `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 10.8 source summary.]
- Loaded travel starts after loading and ends after the sampled loaded-haul time. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 haul-cycle and speed-derating source summary.]
- Dumping or ejecting starts when the dump resource is available and ends after the sampled dump or eject time. [Source: `C:/Users/frans/.cursor/plans/haulage_synthesis_373169da.plan.md`, PR 3.]
- Empty return starts after dump or eject and ends when the haul unit returns to the loader request point. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 haul-cycle source summary.]
- Breakdown and repair events remove a haul unit from service and later return it to the available fleet. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 and Ch 22 availability source summary; `C:/Users/frans/.cursor/plans/haulage_synthesis_373169da.plan.md`, PR 3.]
- Shift ends and completed cycles are aggregated into KPIs. [Source: `C:/Users/frans/.cursor/plans/haulage_synthesis_373169da.plan.md`, PR 3.]

## KPI Contract

- Tonnes per shift: completed payload moved during the synthetic shift. [Source: `C:/Users/frans/.cursor/plans/haulage_synthesis_373169da.plan.md`, PR 3.]
- Average haul cycle time: average time from a haul unit's loader request through loading, loaded travel, dump or eject, and empty return. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 source summary.]
- Queue wait: time a haul unit spends waiting for a constrained resource. The article should separate loader queue wait from dump queue wait if the engine exposes both. [Source: `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 10.6 and Ch 10.8 source summary; `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, PR 2 guidance.]
- Loader idle percent: share of modeled shift time when the loader is available but not loading. [Source: `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 10 shovel-utilisation source summary.]
- Haul-unit utilisation: share of available haul-unit time spent in productive modeled activity, distinct from mechanical availability. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 and Ch 22 source summary.]
- Availability-adjusted throughput: throughput interpreted with downtime or ready-time assumptions visible. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, E = A x U source summary.]
- Match factor or recommended haul units: should use full average haul cycle time divided by average loading service time if it claims SME-style truck count semantics. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Eq 12.27 source summary; `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, PR 2 guidance.]
- Scenario comparison deltas: should explain direction and trade-off, not only display bigger-or-smaller numbers. [Source: `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, target reader questions and PR 5 guidance.]

## Intended Article Sequence

1. **Problem**: Introduce the synthetic haulage decision and why an operational-planning reviewer would care. [Source: `docs/projects/haulage-des/brief.md`; `planning/ukwazi-services-summary.html`, sections 2.1, 2.6, and 5.]
2. **Why deterministic averages fail**: Show the naive cycle spreadsheet and explain that averages can hide waiting, starvation, and queue formation. [Source: `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 10 queueing source summary; `planning/mining-or-real-world-examples.html`, case 01.]
3. **DES model definition**: Define entities, resources, events, FIFO queues, random draws, availability, utilisation, and shift horizon before showing results. [Source: `planning/angular-firebase-or-stack.html`, DES / ABS row; `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 and Ch 22 source summary.]
4. **Baseline run**: Run the synthetic `truck_shovel` case and read tonnes per shift, cycle time, queue wait, loader idle time, availability, utilisation, and match-factor interpretation. [Source: `docs/projects/haulage-des/brief.md`; `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 source summary.]
5. **Scenario comparison**: Compare the baseline with the synthetic `scraper_train` case and describe which KPIs moved and what trade-off that implies. [Source: `docs/projects/haulage-des/brief.md`; `planning/ukwazi-services-summary.html`, K-Tec source summary.]
6. **What changed and why**: Explain whether the change came from service time, travel time, fleet size, queue wait, downtime, or loader idle time. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 source summary; `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 10 source summary.]
7. **Limitations**: Restate synthetic data, no operational forecast, no vendor benchmark, no cost/diesel/water model, and no dispatch-data validation. [Source: `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`, PR 1 non-claims.]
8. **Next site-data steps**: List the field data needed before a real study: cycle timestamps, dispatch events, shovel service times, dump delays, haul-road segments, payloads, availability records, and material-suitability checks. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 and Ch 22 source summary; `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Table 10.5 field-sample source summary.]

## Glossary

- **DES**: Discrete-event simulation; a model that advances from one event time to the next instead of recalculating every second. [Source: `planning/angular-firebase-or-stack.html`, DES / ABS row.]
- **Event**: A modeled change at a specific time, such as loading starting, loading ending, a truck joining a queue, a breakdown, or a repair completion. [Source: `C:/Users/frans/.cursor/plans/haulage_synthesis_373169da.plan.md`, PR 3.]
- **Resource**: A constrained asset that entities need before work can happen, such as a loader, dump point, or repair state. [Source: `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 10.8 shovel-truck source summary.]
- **FIFO queue**: A first-in, first-out waiting line; the first haul unit to arrive is the first served when the resource becomes available. [Source: `planning/source-gorai-chatterjee-optimization-mines-2022.html`, Ch 10.6.4 source summary.]
- **Availability**: The portion of scheduled time equipment is mechanically or electrically ready for work. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 and Ch 22 source summary.]
- **Utilisation**: The portion of available time equipment is operated at productive potential. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 and Ch 22 source summary.]
- **Match factor**: A fleet-sizing relationship between haul cycle time and loader service time; if the article uses SME-style semantics, it should be based on full cycle time divided by loading time. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Eq 12.27 source summary.]
- **Haul cycle**: The repeated load, travel loaded, dump or eject, and return-empty sequence for a haul unit. [Source: `planning/source-sme-mining-reference-handbook-2020.html`, Ch 12 source summary.]

## Source Map

- `docs/projects/haulage-des/brief.md`: current project problem, roles, synthetic site, MVP scenarios, and assumptions.
- `docs/projects/haulage-des/demo-script-outline.md`: old dashboard-first talk track that this contract supersedes.
- `C:/Users/frans/.cursor/plans/haulage_demo_rescue_01eec8d1.plan.md`: PR 1 scope, required thesis, required non-claims, article sections, and acceptance checks.
- `C:/Users/frans/.cursor/plans/haulage_synthesis_373169da.plan.md`: original haulage DES architecture, role-based convention, model events, and KPI list.
- `planning/source-sme-mining-reference-handbook-2020.html`: source for availability, utilisation, operating efficiency, haul cycle time, truck count, and match factor vocabulary.
- `planning/source-gorai-chatterjee-optimization-mines-2022.html`: source for shovel-truck queueing, finite fleet queue context, FIFO machine-repair framing, and field-sample fleet-sizing context.
- `planning/ukwazi-services-summary.html`: source for Ukwazi advisory and operational site-services context, K-Tec equipment distribution context, and DES portfolio fit.
- `planning/mining-or-real-world-examples.html`: local planning source for open-pit truck fleet DES and the deterministic-versus-stochastic planning anchor.
- `C:/repos/integraldecision/src/main/webapp/app/pages/learn/stpetersburg/stpetersburg.component.html`: writing reference for pacing: motivation, definitions, worked example, simulation, implications, and limitations.
