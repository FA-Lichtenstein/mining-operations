import type { DesKpis } from './engine/types';
import type { HaulageScenarioId } from './haulage-scenario';

export type SuperintendentSummary = {
  bottleneck: string;
  followUps: string[];
};

export function buildSuperintendentSummary(
  kpis: DesKpis,
  scenarioId: HaulageScenarioId,
): SuperintendentSummary {
  const followUps: string[] = [];
  let bottleneck = 'Balanced loader–haul fleet (illustrative DES).';

  if (kpis.avg_queue_wait_min >= 4) {
    bottleneck = 'Loader queue — haul units waiting at the shovel/train load point.';
    followUps.push(
      'Quantitative Planning Analyst: test +2 haul units or +1 loader in DES before field trial.',
    );
    followUps.push(
      'Technical Services superintendent: confirm contractor shift calendar matches 12 h synthetic shift.',
    );
  } else if (kpis.match_factor_Nh < 0.95) {
    bottleneck = 'Match factor below 1 — loading element is the limiting factor (SME Eq 12.27).';
    followUps.push('Review loader cycle time vs truck/scraper load time at the strip face.');
  } else if (kpis.haul_unit_utilization_percent < 55) {
    bottleneck = 'Haul fleet under-utilised — excess idle time between cycles.';
    followUps.push('Check whether fleet count exceeds optimal match for current loader count.');
  } else if (kpis.loader_idle_percent > 35) {
    bottleneck = 'Loader idle — haul fleet may be undersized for the push rate.';
    followUps.push('Validate payload and haul distance assumptions against site survey.');
  }

  if (scenarioId === 'scraper_train') {
    followUps.push(
      'Illustrative K-Tec train: confirm berm dump geometry and push-dump rules before comparing unit cost to truck-shovel.',
    );
  } else {
    followUps.push(
      'Truck-shovel baseline: reconcile synthetic 218 t payload with contractor fleet register (illustrative only).',
    );
  }

  followUps.push(
    'All figures are synthetic for syn-pgm-bushveld-01 — not OEM benchmarks or production forecasts.',
  );

  return { bottleneck, followUps };
}
