# Haulage DES - 5-minute hiring-manager demo script

Use this as the 5-minute hiring-manager talk track for `/demo/haulage-des`. Start with the operating decision, then use the interface as evidence. Narration uses official roles only: **Technical Services superintendent** and **Quantitative Planning Analyst**. Demo site: **syn-pgm-bushveld-01**.

In-app **Presenter mode** and [`demo-checklist.md`](./demo-checklist.md) mirror this sequence. Keep them aligned with `app/src/app/features/haulage-des/content/haulage-demo-checklist.ts`.

## One-sentence opening

A Technical Services superintendent wants to know whether a different haulage method could reduce queueing or improve tonnes per shift enough to justify a real site-data study.

## 0:00-0:45 - Start With The Operational Question

Open with the decision before pointing to controls. The business question is not "can I run a dashboard"; it is whether the simulated operating pattern is promising enough to justify deeper data collection.

State the caveat immediately. The site, fleet inputs, cycle times, and KPIs are synthetic. This is a browser DES method demonstration, not operational advice, a vendor benchmark, or a production forecast.

## 0:45-1:30 - Explain Why Averages Are Not Enough

Use the notebook's spreadsheet framing. A fixed average cycle can estimate tonnes per shift, but it cannot show two haul units arriving at the loader together, dump congestion forming, or the loader sitting idle while every unit is elsewhere.

Define the missing behavior in plain terms: queues, constrained resources, idle time, and variation around cycle components.

## 1:30-2:30 - Define The DES Model

Explain DES before running it. The model advances from event to event: a haul unit requests the loader, waits FIFO if the resource is busy, loads, travels loaded, dumps or ejects, returns empty, and may be removed or restored by downtime.

Name the resources and outputs. The run reports throughput, full cycle time, loader and dump waits where modeled, loader idle time, availability, utilisation, operating efficiency, and the SME-style recommended haul-unit count.

## 2:30-3:30 - Run And Read The Baseline

Run the synthetic truck-shovel baseline. Read the result in this order: tonnes per shift, cycle time, queue waits, loader idle, availability, utilisation, and fleet match.

Keep the interpretation directional. The question is whether the simulated pattern is promising enough for deeper data work, not whether the synthetic number is a mine-plan answer.

## 3:30-4:15 - Compare The Scraper-Train Hypothesis

Save the baseline as Run A, clone to the scraper-train scenario, run again, and save the second result as Run B. Use the compare section to explain which metric moved and whether the movement helps the decision question.

Make the trade-off explicit: more tonnes and lower waits are helpful; higher utilisation only helps if queues do not explode. Road interaction, discharge constraints, material suitability, and commercial terms remain outside the model.

## 4:15-5:00 - Export And Close With Limitations

Export the JSON so the completed synthetic run can be attached to a memo or review note.

Close by narrowing the claim. The demo does not model unit cost, diesel, water, emissions, road geometry, material suitability, vendor performance, or dispatch-data validation. A real study would need dispatch timestamps, payloads, loader service times, dump delays, haul-road segments, downtime records, shift rules, and material checks.

## Known limitations to say out loud

- Synthetic site, fleet, payload, cycle-time, availability, utilisation, and downtime assumptions only.
- No operational forecast, vendor benchmark, unit-cost model, diesel model, water model, emissions model, road-geometry model, or material-suitability model.
- No calibration or validation against dispatch, survey, reconciliation, fleet-management, or maintenance data.
- The scraper-train case is an illustrative hypothesis, not a K-Tec performance claim.
