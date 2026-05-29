# Haulage DES - 5-minute presenter walkthrough

Manual rehearsal before a live demo or interview. Role-based copy only (no fictional character names). Demo site: **syn-pgm-bushveld-01**.

In-app **Presenter mode** on `/demo/haulage-des` mirrors this walkthrough. Source of truth for presenter UI: `app/src/app/features/haulage-des/content/haulage-demo-checklist.ts`.

## Before you start

- [ ] `cd app && npm install && npm run build`
- [ ] `npm run test:engine` and `npm run test:tools` pass
- [ ] `npm run test:e2e` passes (or note environment blocker)
- [ ] `npm start` → [http://localhost:4200](http://localhost:4200)

## 0:00-0:45 - The decision

Start with the operational question, not the controls. A Technical Services superintendent wants to know whether a synthetic haulage change is promising enough to justify a real site-data study.

Explain why this belongs in the portfolio: Ukwazi does mining advisory and operational technical-services work, and the planning sources connect Ukwazi with K-Tec equipment. The scenario is therefore relevant, but it is not vendor advice.

- [ ] Say the decision question before pointing to the interface.
- [ ] State that `syn-pgm-bushveld-01` and the fleet inputs are synthetic.

## 0:45-1:30 - The naive spreadsheet

Describe the first-pass spreadsheet answer. It fixes average load, travel, dump, and return times, then turns those averages into a tonnes-per-shift estimate.

The problem is interaction. Averages do not show two trucks arriving at the shovel together, a dump point becoming congested, or a loader waiting because every haul unit is somewhere else.

- [ ] Define the fixed average cycle before mentioning simulation.
- [ ] Name queues and idle time as the missing behavior.

## 1:30-2:30 - The DES model

Now define DES. The model advances from event to event: a haul unit requests the loader, loading starts and ends, loaded travel ends, dumping or ejecting ends, the unit returns empty, or downtime changes the available fleet.

The entities are haul units. The resources are the loader or shovel, the dump or eject point when modeled, and available haul-unit time. When a resource is busy, arrivals wait in FIFO order.

The inputs are synthetic distributions and shift assumptions. Random draws vary cycle components around those assumptions so the run can expose congestion that the average spreadsheet cannot show.

- [ ] Walk through the load, haul, dump or eject, return loop.
- [ ] Clarify that randomness is synthetic, not dispatch validation.

## 2:30-3:30 - Reading a run

Interpret the truck-shovel baseline in order. Tonnes per shift answers throughput. Average cycle time explains the duration of completed cycles. Loader and dump queue waits, read with loader idle, show whether the constrained resources are being matched well.

Then separate availability from utilisation. Availability asks whether the equipment is ready; utilisation asks whether ready equipment is productively used. The point is not to chase one number, but to see the operating trade-off.

- [ ] Read throughput before queue and utilisation metrics.
- [ ] Explain availability and utilisation as different ideas.

## 3:30-4:15 - Comparing scraper train

Bring in the scraper-train scenario as a hypothesis. It would need to improve the decision metrics enough to earn a closer look: more tonnes, lower queue waits, better loader use, or a fleet match that reduces idle time.

Keep the risks visible. Smaller payloads, more frequent cycles, road interaction, discharge constraints, material suitability, and commercial terms could offset a cleaner-looking queue result.

- [ ] Describe what would have to improve before a real study is worthwhile.
- [ ] Say which risks are outside the current model before closing the comparison.

## 4:15-5:00 - Limitations

Close by narrowing the claim. This is a synthetic browser DES for explaining queueing and utilisation trade-offs. It is not an operational forecast, a unit-cost model, a diesel or water model, a validation study, or vendor advice.

The next real step would be site data: dispatch timestamps, payloads, loader service times, dump delays, road segments, downtime records, shift rules, and material checks.

- [ ] State the caveats in plain language.
- [ ] Name the site data needed before any real recommendation.

## Deferred (not in MVP)

- Unit-cost, diesel, water, emissions, road-geometry, material-suitability, validation, IPCC, PDF pack, and Firebase deploy scope.

## Related docs

- [brief.md](./brief.md)
- [demo-script-outline.md](./demo-script-outline.md)
- Repo README: build, `test:engine`, `test:tools`, `test:e2e`
