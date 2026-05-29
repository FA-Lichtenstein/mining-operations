import type { DesKpis } from './engine/types';
import type { HaulageScenarioId } from './haulage-scenario';

export type SuperintendentSummary = {
  interpretation: string;
  bottleneck: string;
  followUps: string[];
};

export function buildSuperintendentSummary(
  kpis: DesKpis,
  scenarioId: HaulageScenarioId,
): SuperintendentSummary {
  const followUps: string[] = [];
  let bottleneck = 'Balanced loader–haul fleet (illustrative DES).';

  if (kpis.avg_loader_queue_wait_min >= 4) {
    bottleneck = 'Loader queue — haul units waiting at the shovel/train load point.';
    followUps.push(
      'Next field check: compare modeled loader waits with dispatch timestamps before changing fleet size.',
    );
    followUps.push(
      'Next field check: confirm the contractor shift calendar matches the synthetic shift length.',
    );
  } else if (kpis.fleet_match_ratio < 0.9) {
    bottleneck = 'Haul fleet below full-cycle recommendation — loader idle risk.';
    followUps.push('Next field check: measure full cycle time and loader service time before changing truck count.');
  } else if (kpis.haul_unit_utilization_percent < 55) {
    bottleneck = 'Haul fleet under-utilised — excess idle time between cycles.';
    followUps.push('Next field check: verify whether current fleet count exceeds the loader-matching need.');
  } else if (kpis.loader_idle_percent > 35) {
    bottleneck = 'Loader idle — haul fleet may be undersized for the push rate.';
    followUps.push('Next field check: validate payload and haul distance assumptions against survey and dispatch data.');
  }

  if (scenarioId === 'scraper_train') {
    followUps.push(
      'Next field check: confirm berm dump geometry and push-dump rules; cost, diesel, and water remain deferred.',
    );
  } else {
    followUps.push(
      'Next field check: reconcile the synthetic payload and fleet count with the contractor fleet register.',
    );
  }

  followUps.push(
    'Limitation: all figures are synthetic for syn-pgm-bushveld-01, not vendor benchmarks or production forecasts.',
  );

  return {
    interpretation: `This synthetic run suggests ${sentenceCase(bottleneck)} Read it as evidence for the next site-data check, not as an operating instruction.`,
    bottleneck,
    followUps,
  };
}

function sentenceCase(text: string): string {
  const trimmed = text.trim().replace(/[.]+$/, '');
  return `${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}.`;
}
