/**
 * In-app Background / Study copy for haulage-des (PR 5).
 * Keep aligned with docs/projects/haulage-des/brief.md — problem, roles, assumptions.
 */

export type StudySection = {
  id: string;
  title: string;
  paragraphs: string[];
  citationIds?: string[];
  listItems?: string[];
};

export const HAULAGE_STUDY_SECTIONS: StudySection[] = [
  {
    id: 'problem',
    title: 'Decision question (role-based)',
    paragraphs: [
      'A Technical Services superintendent asks whether adding K-Tec scraper trains can reduce unit cost on a 12 Mt/a waste-stripping push without starving ore feed. Conventional truck-shovel cycles dominate the pit; contractor haulage is common in the Bushveld PGM context.',
      'The Quantitative Planning Analyst configures scenarios, runs discrete-event simulation (DES), compares runs, and exports evidence for decision memos — cycle times, queueing, match factor, and tonnes per shift, not a vendor brochure.',
    ],
    citationIds: ['brief02', 'ukwazi'],
  },
  {
    id: 'anatomy',
    title: 'Haul-cycle anatomy',
    paragraphs: [
      'Each haul unit traverses a repeating load–haul–dump cycle: queue at the loader → spot and load → haul loaded along the pit haul road → queue at dump → dump or eject → return empty. Panel B schematic and seed distributions illustrate the same sequence for truck_shovel and scraper_train.',
    ],
    listItems: [
      'Loader and dump queue waits capture shovel/truck or train mismatch under stochastic arrivals.',
      'Loader idle percent rises when haul units are over-fleeted or blocked at dump.',
      'Completed cycles only feed KPI aggregates in panel D.',
    ],
    citationIds: ['sme', 'gorai'],
  },
  {
    id: 'match-efficiency',
    title: 'Match factor N_h and E = A × U',
    paragraphs: [
      'Recommended haul units N_h uses full average haul cycle time divided by average loader service time. The fleet match ratio then compares configured haul units with that recommendation; sustained overload still shows up in simulated loader and dump queue waits.',
      'Operating efficiency E = availability × utilisation on the shift calendar separates mechanical availability from time actually hauling. Availability answers “is the unit down?”; utilisation answers “when up, is it productive?” Panel D reports E alongside haul-unit utilisation percent.',
    ],
    citationIds: ['sme'],
  },
  {
    id: 'stochastic',
    title: 'Why stochastic queues matter',
    paragraphs: [
      'Deterministic cycle spreadsheets assume fixed load/haul/dump minutes and often ignore interaction at the shovel and dump. Real pits exhibit variability (spot time, payload, road conditions) and FIFO congestion when multiple haul units share one loader.',
      'This workbench uses seeded triangular/normal times from gen-truck-cycle and event-ordered DES queueing. Gorai Ch 10.8 analytic match-factor hints in the engine are explanatory sanity checks only — DES results are authoritative for congestion and throughput.',
    ],
    citationIds: ['gorai', 'sme'],
  },
  {
    id: 'scraper',
    title: 'Scraper suitability hypotheses (illustrative K-Tec)',
    paragraphs: [
      'The scraper_train scenario explores whether smaller, higher-frequency payloads and different spot geometry reduce queueing on long waste pushes. Parameters are synthetic and labelled illustrative — not vendor benchmarks or operational forecasts.',
    ],
    listItems: [
      'Hypothesis: lower unit payload with more cycles may improve loader match on certain bench geometries.',
      'Risk: additional handling and road interactions may offset queue gains — compare tonnes/shift and loader queue wait in panel C.',
      'Superintendent follow-ups in panel D should cite site geometry, contractor rates, and ore-feed constraints outside this demo.',
    ],
    citationIds: ['ukwazi', 'dunbar'],
  },
  {
    id: 'synthetic',
    title: 'Synthetic data limitations',
    paragraphs: [
      'Demo site syn-pgm-bushveld-01, fleet counts, and cycle distributions are fully synthetic. Outputs demonstrate DES method and portfolio UX — not operational advice, reserve statements, or K-Tec performance guarantees.',
      'JSON export preserves run metadata for analyst memos; validate any real decision against mine survey, OEM specs, and site shift rules before capital commitment.',
    ],
    citationIds: ['brief02', 'dunbar'],
  },
];
