# Haulage DES — 5-minute demo script outline (role-based)

Narration uses official roles only. Demo site: **syn-pgm-bushveld-01**.

In-app **Presenter mode** on `/demo/haulage-des` mirrors this outline (checkboxes, localStorage).
Source: `app/src/app/features/haulage-des/content/haulage-demo-checklist.ts` — keep in sync when editing.

Manual checkbox version for interviews: [demo-checklist.md](./demo-checklist.md).

## 0:00–0:45 — Open and orient

- Start at portfolio gallery; open **Truck-shovel vs K-Tec scraper DES**
- **Quantitative Planning Analyst** frames the question the **Technical Services superintendent** asked: scraper trains vs truck-shovel on a 12 Mt/a waste push
- Open **Background / Study**; walk load–haul–dump anatomy on panel B schematic
- Confirm `syn-pgm-bushveld-01` label and synthetic-data disclaimer

## 0:45–1:30 — Baseline scenario

- Panel A: select **truck_shovel** fleet from `gen-truck-cycle` seed (e.g. 18×218 t)
- Confirm synthetic mine label `syn-pgm-bushveld-01`

## 1:30–2:30 — Run truck-shovel DES

- Run multi-shift DES in Web Worker
- Highlight throughput, average cycle time, queue wait, match factor N<sub>h</sub> vs SME-style band in panel D
- Panel C: queue depth and throughput time series

## 2:30–3:30 — Compare scraper train

- Clone scenario → **scraper_train**; re-run
- Side-by-side KPI delta: tonnes/shift, queueing, utilisation — analyst narrates trade-offs for the superintendent
- Use compare bar for A/B deltas and saved runs

## 3:30–4:15 — Stretch framing (optional)

- If IPCC stretch is enabled: note T4 fixed-charge / queuing sidebar trade-off
- Otherwise: stochastic queues vs deterministic cycle spreadsheets (**Background / Study** section)

## 4:15–5:00 — Export and close

- Export both runs as JSON; show in-session compare list
- **Quantitative Planning Analyst** states synthetic-data limitations and recommended follow-up checks for the **Technical Services superintendent** (panel D)
- Return to gallery or About for repository context
