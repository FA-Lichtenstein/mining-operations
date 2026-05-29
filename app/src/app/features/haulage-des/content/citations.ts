/** Planning-source citations for haulage-des study copy. */

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
    detail: 'Availability, utilisation, haul cycle, and fleet-match vocabulary',
    planningPath: 'planning/source-sme-mining-reference-handbook-2020.html',
  },
  gorai: {
    id: 'gorai',
    shortLabel: 'Gorai 2022',
    detail: 'Shovel-truck queueing, FIFO waits, and fleet-sizing context',
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
    detail: 'Mining advisory, operational site services, and K-Tec context',
    planningPath: 'planning/ukwazi-services-summary.html',
  },
  brief02: {
    id: 'brief02',
    shortLabel: 'Brief #02',
    detail: 'Synthetic site, assumptions, non-claims, and narrative contract',
    planningPath: 'planning/portfolio-shortlist-briefs.html#brief-02',
  },
};
