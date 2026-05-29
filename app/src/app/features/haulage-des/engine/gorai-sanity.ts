import type { GenTruckCycleConfig } from '../../../shared/domain/haulage';
import { matchFactorNh } from './kpi';

/**
 * Closed-form Gorai Ch 10 / SME Ch 12 hint — explanatory sanity check only, not a second simulation.
 */
export type GoraiSanityHint = {
  implied_trucks_Nh: number;
  configured_haul_units: number;
  over_fleet_warning: boolean;
  note: string;
};

export function goraiFleetSanityHint(config: GenTruckCycleConfig): GoraiSanityHint {
  const d = config.cycle_distributions;
  const loadService = meanMinutes(d.queue_time_min) + meanMinutes(d.load_time_min);
  const haul = meanMinutes(d.haul_time_min);
  const dump = meanMinutes(d.dump_time_min);
  const emptyReturn = meanMinutes(d.return_time_min);
  const cycle = loadService + haul + dump + emptyReturn;
  const Nh = matchFactorNh(cycle, loadService);
  const implied = Math.max(1, Math.ceil(Nh));
  const over = config.fleet.haul_unit_count > implied * 1.5;

  return {
    implied_trucks_Nh: Math.round(Nh * 1000) / 1000,
    configured_haul_units: config.fleet.haul_unit_count,
    over_fleet_warning: over,
    note: 'Gorai/SME analytic fleet-sizing hint uses full cycle time; DES queueing is authoritative for congestion.',
  };
}

function meanMinutes(dist: GenTruckCycleConfig['cycle_distributions'][keyof GenTruckCycleConfig['cycle_distributions']]): number {
  if (typeof dist !== 'object' || !('dist' in dist)) {
    return 0;
  }
  if (dist.dist === 'triangular') {
    return (dist.min + dist.mode + dist.max) / 3;
  }
  if (dist.dist === 'normal') {
    return dist.mean;
  }
  if (dist.dist === 'exponential') {
    return dist.lambda <= 0 ? 0 : 1 / dist.lambda;
  }
  return 0;
}
