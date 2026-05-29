/** Planning-source citation chips for haulage-des study layer (PR 5). */

export type HaulageCitation = {
  id: string;
  shortLabel: string;
  detail: string;
  /** Repo-relative path under planning/ */
  planningPath: string;
};

const REPO =
  'https://github.com/FA-Lichtenstein/mining-operations/blob/main';

export function citationHref(c: HaulageCitation): string {
  return `${REPO}/${c.planningPath}`;
}

export const HAULAGE_CITATIONS: Record<string, HaulageCitation> = {
  sme: {
    id: 'sme',
    shortLabel: 'SME 2020',
    detail: 'Ch 12 — match factor N_h, E = A×U, fleet formulas',
    planningPath: 'planning/source-sme-mining-reference-handbook-2020.html',
  },
  gorai: {
    id: 'gorai',
    shortLabel: 'Gorai 2022',
    detail: 'Ch 10.8 — shovel-truck queuing; analytic sanity checks',
    planningPath: 'planning/source-gorai-chatterjee-optimization-mines-2022.html',
  },
  dunbar: {
    id: 'dunbar',
    shortLabel: 'Dunbar 2024',
    detail: 'Value chain — strip ratio, waste push, haul context',
    planningPath: 'planning/source-dunbar-how-mining-works-2024.html',
  },
  ukwazi: {
    id: 'ukwazi',
    shortLabel: 'Ukwazi anchor',
    detail: 'Portfolio T2/T4 themes; K-Tec scraper framing (illustrative)',
    planningPath: 'planning/ukwazi-services-summary.html',
  },
  brief02: {
    id: 'brief02',
    shortLabel: 'Brief #02',
    detail: 'Portfolio acceptance contract for haulage DES',
    planningPath: 'planning/portfolio-shortlist-briefs.html#brief-02',
  },
};
