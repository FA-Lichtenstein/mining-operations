/**
 * 5-minute presenter checklist — mirrors docs/projects/haulage-des/demo-script-outline.md.
 */

export type DemoChecklistItem = {
  id: string;
  label: string;
};

export type DemoChecklistSection = {
  id: string;
  timeRange: string;
  title: string;
  items: DemoChecklistItem[];
};

export const HAULAGE_DEMO_CHECKLIST: DemoChecklistSection[] = [
  {
    id: 'open',
    timeRange: '0:00–0:45',
    title: 'Open and orient',
    items: [
      {
        id: 'open-gallery',
        label:
          'Start at portfolio gallery; open Truck-shovel vs K-Tec scraper DES',
      },
      {
        id: 'open-roles',
        label:
          'Quantitative Planning Analyst frames the Technical Services superintendent question: scraper trains vs truck-shovel on a 12 Mt/a waste push',
      },
      {
        id: 'open-study',
        label:
          'Open Background / Study; walk load–haul–dump anatomy (panel B schematic)',
      },
      {
        id: 'open-disclaimer',
        label: 'Confirm syn-pgm-bushveld-01 label and synthetic-data disclaimer',
      },
    ],
  },
  {
    id: 'baseline',
    timeRange: '0:45–1:30',
    title: 'Baseline scenario',
    items: [
      {
        id: 'baseline-truck',
        label:
          'Panel A: select truck_shovel fleet from gen-truck-cycle seed (e.g. 18×218 t)',
      },
      {
        id: 'baseline-label',
        label: 'Confirm synthetic mine label syn-pgm-bushveld-01',
      },
    ],
  },
  {
    id: 'run-truck',
    timeRange: '1:30–2:30',
    title: 'Run truck-shovel DES',
    items: [
      {
        id: 'run-worker',
        label: 'Run multi-shift DES in Web Worker',
      },
      {
        id: 'run-kpis',
        label:
          'Highlight throughput, avg cycle, loader queue wait, and full-cycle N_h recommendation in panel D',
      },
      {
        id: 'run-charts',
        label: 'Panel C: loader queue wait and throughput time series',
      },
    ],
  },
  {
    id: 'compare',
    timeRange: '2:30–3:30',
    title: 'Compare scraper train',
    items: [
      {
        id: 'compare-clone',
        label: 'Clone scenario → scraper_train; re-run',
      },
      {
        id: 'compare-delta',
        label:
          'Side-by-side KPI delta: tonnes/shift, queueing, utilisation — analyst narrates trade-offs for superintendent',
      },
      {
        id: 'compare-bar',
        label: 'Use compare bar for A/B deltas and saved runs',
      },
    ],
  },
  {
    id: 'stretch',
    timeRange: '3:30–4:15',
    title: 'Stretch framing (optional)',
    items: [
      {
        id: 'stretch-ipcc',
        label:
          'If IPCC stretch enabled: note T4 fixed-charge / queuing sidebar trade-off',
      },
      {
        id: 'stretch-stochastic',
        label:
          'Otherwise: stochastic queues vs deterministic cycle spreadsheets (Study section)',
      },
    ],
  },
  {
    id: 'close',
    timeRange: '4:15–5:00',
    title: 'Export and close',
    items: [
      {
        id: 'close-export',
        label: 'Export both runs as JSON; show in-session compare list',
      },
      {
        id: 'close-limitations',
        label:
          'Analyst states synthetic-data limitations and superintendent follow-up checks (panel D)',
      },
      {
        id: 'close-gallery',
        label: 'Return to gallery or About for repository context',
      },
    ],
  },
];

export const HAULAGE_CHECKLIST_ITEM_IDS: string[] = HAULAGE_DEMO_CHECKLIST.flatMap(
  (s) => s.items.map((i) => i.id),
);
