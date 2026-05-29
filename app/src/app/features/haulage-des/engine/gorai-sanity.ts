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
  const loaderCycle =
    d.load_time_min.dist === 'triangular'
      ? (d.load_time_min.min + d.load_time_min.mode + d.load_time_min.max) / 3
      : 5;
  const truckLoad =
    d.load_time_min.dist === 'triangular'
      ? d.load_time_min.mode
      : d.load_time_min.dist === 'normal'
        ? d.load_time_min.mean
        : 3;
  const Nh = matchFactorNh(loaderCycle, truckLoad);
  const implied = Math.max(1, Math.ceil(Nh));
  const over = config.fleet.haul_unit_count > implied * 1.5;

  return {
    implied_trucks_Nh: Math.round(Nh * 1000) / 1000,
    configured_haul_units: config.fleet.haul_unit_count,
    over_fleet_warning: over,
    note: 'Gorai/SME analytic match-factor hint — DES queueing is authoritative for congestion.',
  };
}
