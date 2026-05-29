/**
 * 5-minute presenter walkthrough.
 * Mirrors docs/projects/haulage-des/demo-checklist.md.
 */

export type DemoChecklistItem = {
  id: string;
  label: string;
};

export type DemoChecklistSection = {
  id: string;
  timeRange: string;
  title: string;
  paragraphs: string[];
  items: DemoChecklistItem[];
};

export const HAULAGE_DEMO_CHECKLIST: DemoChecklistSection[] = [
  {
    id: 'open',
    timeRange: '0:00–0:45',
    title: 'The decision',
    paragraphs: [
      'Start with the operational question, not the controls. A Technical Services superintendent wants to know whether a synthetic haulage change is promising enough to justify a real site-data study.',
      'Explain why this belongs in the portfolio: Ukwazi does mining advisory and operational technical-services work, and the planning sources connect Ukwazi with K-Tec equipment. The scenario is therefore relevant, but it is not vendor advice.',
    ],
    items: [
      {
        id: 'decision-question',
        label: 'Say the decision question before pointing to the interface.',
      },
      {
        id: 'decision-synthetic',
        label:
          'State that syn-pgm-bushveld-01 and the fleet inputs are synthetic.',
      },
    ],
  },
  {
    id: 'spreadsheet',
    timeRange: '0:45–1:30',
    title: 'The naive spreadsheet',
    paragraphs: [
      'Describe the first-pass spreadsheet answer. It fixes average load, travel, dump, and return times, then turns those averages into a tonnes-per-shift estimate.',
      'The problem is interaction. Averages do not show two trucks arriving at the shovel together, a dump point becoming congested, or a loader waiting because every haul unit is somewhere else.',
    ],
    items: [
      {
        id: 'spreadsheet-average',
        label: 'Define the fixed average cycle before mentioning simulation.',
      },
      {
        id: 'spreadsheet-queues',
        label: 'Name queues and idle time as the missing behavior.',
      },
    ],
  },
  {
    id: 'model',
    timeRange: '1:30–2:30',
    title: 'The DES model',
    paragraphs: [
      'Now define DES. The model advances from event to event: a haul unit requests the loader, loading starts and ends, loaded travel ends, dumping or ejecting ends, the unit returns empty, or downtime changes the available fleet.',
      'The entities are haul units. The resources are the loader or shovel, the dump or eject point when modeled, and available haul-unit time. When a resource is busy, arrivals wait in FIFO order.',
      'The inputs are synthetic distributions and shift assumptions. Random draws vary cycle components around those assumptions so the run can expose congestion that the average spreadsheet cannot show.',
    ],
    items: [
      {
        id: 'model-events',
        label: 'Walk through the load, haul, dump or eject, return loop.',
      },
      {
        id: 'model-randomness',
        label: 'Clarify that randomness is synthetic, not dispatch validation.',
      },
    ],
  },
  {
    id: 'read-run',
    timeRange: '2:30–3:30',
    title: 'Reading a run',
    paragraphs: [
      'Interpret the truck-shovel baseline in order. Tonnes per shift answers throughput. Average cycle time explains the duration of completed cycles. Loader and dump queue waits, read with loader idle, show whether the constrained resources are being matched well.',
      'Then separate availability from utilisation. Availability asks whether the equipment is ready; utilisation asks whether ready equipment is productively used. The point is not to chase one number, but to see the operating trade-off.',
    ],
    items: [
      {
        id: 'read-throughput',
        label: 'Read throughput before queue and utilisation metrics.',
      },
      {
        id: 'read-efficiency',
        label: 'Explain availability and utilisation as different ideas.',
      },
    ],
  },
  {
    id: 'compare',
    timeRange: '3:30–4:15',
    title: 'Comparing scraper train',
    paragraphs: [
      'Bring in the scraper-train scenario as a hypothesis. It would need to improve the decision metrics enough to earn a closer look: more tonnes, lower queue waits, better loader use, or a fleet match that reduces idle time.',
      'Keep the risks visible. Smaller payloads, more frequent cycles, road interaction, discharge constraints, material suitability, and commercial terms could offset a cleaner-looking queue result.',
    ],
    items: [
      {
        id: 'compare-direction',
        label:
          'Describe what would have to improve before a real study is worthwhile.',
      },
      {
        id: 'compare-risks',
        label:
          'Say which risks are outside the current model before closing the comparison.',
      },
    ],
  },
  {
    id: 'close',
    timeRange: '4:15–5:00',
    title: 'Limitations',
    paragraphs: [
      'Close by narrowing the claim. This is a synthetic browser DES for explaining queueing and utilisation trade-offs. It is not an operational forecast, a unit-cost model, a diesel or water model, a validation study, or vendor advice.',
      'The next real step would be site data: dispatch timestamps, payloads, loader service times, dump delays, road segments, downtime records, shift rules, and material checks.',
    ],
    items: [
      {
        id: 'close-limits',
        label: 'State the caveats in plain language.',
      },
      {
        id: 'close-next-data',
        label: 'Name the site data needed before any real recommendation.',
      },
    ],
  },
];

export const HAULAGE_CHECKLIST_ITEM_IDS: string[] = HAULAGE_DEMO_CHECKLIST.flatMap(
  (s) => s.items.map((i) => i.id),
);
