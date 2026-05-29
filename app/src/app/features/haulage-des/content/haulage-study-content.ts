/**
 * In-app Background / Study copy for haulage-des.
 * Keep aligned with docs/projects/haulage-des/narrative-redesign.md.
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
    id: 'decision',
    title: 'The decision',
    paragraphs: [
      'A Technical Services superintendent has a practical question before asking for a larger study: in a synthetic open-pit waste-haulage setting, would a different haulage method reduce waiting or improve tonnes per shift enough to deserve closer site-data work?',
      'K-Tec is relevant here because Ukwazi is associated in the planning sources with K-Tec equipment distribution as well as mining advisory and operational technical services. The demo therefore compares a familiar truck-shovel baseline with an illustrative scraper-train scenario, but it does not recommend a vendor or a mine plan.',
    ],
    citationIds: ['brief02', 'ukwazi'],
  },
  {
    id: 'naive-spreadsheet',
    title: 'The naive spreadsheet',
    paragraphs: [
      'The simple spreadsheet answer starts with one average cycle time. Add average load time, loaded travel, dump or eject time, and empty return; divide the shift by that fixed cycle; multiply by payload and fleet count. It is quick, clear, and often useful for a first pass.',
      'The weakness is that one average cycle does not show interaction. Two haul units can arrive at the loader together, the dump can become the temporary bottleneck, or the loader can sit idle because the fleet is delayed elsewhere. Gorai and Chatterjee frame this as a shovel-truck queueing problem, which is exactly the behavior a fixed-average spreadsheet hides.',
    ],
    citationIds: ['sme', 'gorai'],
  },
  {
    id: 'des-model',
    title: 'The DES model',
    paragraphs: [
      'DES means discrete-event simulation. Instead of recalculating the whole pit every second, the model jumps from one event time to the next: a haul unit asks for the loader, loading starts, loading ends, loaded travel ends, dumping or ejecting ends, a unit returns empty, or a breakdown and repair changes availability.',
      'The entities are the haul units moving through the cycle. The constrained resources are the loader or shovel, the dump or eject point when modeled, and the available haul fleet. If a resource is busy, the arriving haul unit waits in a FIFO queue, meaning first in, first out.',
      'Each run samples synthetic load, travel, dump, return, and downtime behavior around seeded assumptions, then stops at the shift horizon. The random draws are not real dispatch variability; they are a controlled way to ask how queueing and utilisation respond when average inputs are allowed to vary.',
    ],
    citationIds: ['brief02', 'sme', 'gorai'],
  },
  {
    id: 'reading-a-run',
    title: 'Reading a run',
    paragraphs: [
      'Start with tonnes per shift. It is the completed payload moved before the synthetic shift ends, so it answers the throughput question. Average haul cycle time then explains how long completed cycles took from loader request through load, loaded travel, dump or eject, and empty return.',
      'Queue wait shows time lost before constrained resources. Loader queue wait points to over-fleeting or uneven arrivals at the shovel; dump queue wait points to congestion at the discharge end. Loader idle percent tells the opposite story: the loader was available, but haul units were not ready to load.',
      'Availability and utilisation should be read separately. Availability is the share of scheduled time equipment is ready for work; utilisation is the share of available time spent productively. The SME operating-efficiency idea, E = A x U, is useful because a fleet can be mechanically available and still poorly used.',
    ],
    citationIds: ['sme', 'gorai'],
  },
  {
    id: 'comparing-scraper-train',
    title: 'Comparing scraper train',
    paragraphs: [
      'The scraper-train case should be read as a hypothesis, not as a benchmark. To justify a closer study, it would need to move the right direction on the operating question: higher tonnes per shift, lower queue wait, better loader use, or a fleet match that reduces idle time without creating a new bottleneck.',
      'A better-looking DES run would still need field checks. Smaller payloads, more frequent cycles, extra road interaction, material suitability, contractor terms, and discharge constraints could offset queue gains. The comparison is useful because it names those trade-offs before anyone treats the scenario as advice.',
    ],
    citationIds: ['ukwazi', 'brief02'],
  },
  {
    id: 'limitations',
    title: 'Limitations',
    paragraphs: [
      'The site label, fleet counts, payloads, cycle distributions, availability, utilisation, and breakdown behavior are synthetic. The run can teach the modeling method, but it is not an operational forecast and has not been validated against dispatch, survey, reconciliation, fleet-management, or maintenance data.',
      'The demo does not contain a unit-cost model, diesel model, water model, emissions model, road-geometry model, or material-suitability model. Those omissions matter because a real scraper-train decision could turn on cost, fuel, water, grade, underfoot conditions, and operating rules rather than queue time alone.',
      'This is not vendor advice for K-Tec or a benchmark against truck-shovel systems. Treat the output as a source-grounded browser simulation that helps frame the next site-data questions, not as a recommendation to change equipment or production plans.',
    ],
    citationIds: ['brief02', 'ukwazi'],
  },
];
