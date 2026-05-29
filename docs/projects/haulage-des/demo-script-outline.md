# Haulage DES — 5-minute demo script outline (role-based)

Narration uses official roles only. Demo site: **syn-pgm-bushveld-01**.

## 0:00–0:45 — Open and orient

- Start at portfolio gallery; open **Truck-shovel vs K-Tec scraper DES**
- **Quantitative Planning Analyst** frames the question the **Technical Services superintendent** asked: scraper trains vs truck-shovel on a 12 Mt/a waste push
- Expand panel D placeholder / future explainer; walk load–haul–dump anatomy on panel B (when implemented)

## 0:45–1:30 — Baseline scenario

- Panel A: select default **truck_shovel** fleet (e.g. 18×218 t) from `gen-truck-cycle` seed (PR 2+)
- Confirm synthetic mine label `syn-pgm-bushveld-01` and disclaimer

## 1:30–2:30 — Run truck-shovel DES

- Run multi-shift DES in Web Worker (PR 3–4)
- Highlight throughput, average cycle time, queue wait, match factor vs SME-style target band in panel D

## 2:30–3:30 — Compare scraper train

- Clone scenario → **scraper_train**; re-run
- Side-by-side KPI delta: tonnes/shift, queueing, utilisation — analyst narrates trade-offs for the superintendent

## 3:30–4:15 — Stretch framing (optional)

- If IPCC stretch is enabled: note T4 fixed-charge / queuing sidebar trade-off
- Otherwise: brief note on stochastic queues vs deterministic cycle spreadsheets

## 4:15–5:00 — Export and close

- Export both runs as JSON; show in-session compare list (PR 4)
- **Quantitative Planning Analyst** states synthetic-data limitations and recommended follow-up checks for the **Technical Services superintendent**
- Return to gallery or About for repository / CV context
