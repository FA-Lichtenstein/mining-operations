import type { DesCycleRecord, DesKpis } from './types';

/** SME-style fleet sizing: recommended haul units N_h = full haul cycle time / loader service time. */
export function matchFactorNh(haulCycleMin: number, loaderServiceMin: number): number {
  if (loaderServiceMin <= 0) {
    return 0;
  }
  return haulCycleMin / loaderServiceMin;
}

/** Operating efficiency E = A × U (SME Eq 12.14). */
export function operatingEfficiency(availability: number, utilization: number): number {
  return availability * utilization;
}

export type KpiAccumulator = {
  shiftMinutes: number;
  loaderCount: number;
  haulUnitCount: number;
  loaderBusyMin: number;
  haulBusyMin: number;
  haulDownMin: number;
  haulAvailableMin: number;
  tonnes: number;
  cycles: DesCycleRecord[];
};

export function createAccumulator(
  shiftMinutes: number,
  loaderCount: number,
  haulUnitCount: number,
): KpiAccumulator {
  return {
    shiftMinutes,
    loaderCount,
    haulUnitCount,
    loaderBusyMin: 0,
    haulBusyMin: 0,
    haulDownMin: 0,
    haulAvailableMin: shiftMinutes * haulUnitCount,
    tonnes: 0,
    cycles: [],
  };
}

export function finalizeKpis(
  acc: KpiAccumulator,
  meta: {
    scenario_id: string;
    mine_id: string;
    seed: number;
    shifts_simulated: number;
    haul_unit_count: number;
  },
): DesKpis {
  const cycles = acc.cycles;
  const n = cycles.length;
  const avgCycle =
    n === 0
      ? 0
      : cycles.reduce(
          (s, c) =>
            s +
            c.queue_wait_min +
            c.spotting_min +
            c.load_min +
            c.haul_min +
            c.dump_queue_wait_min +
            c.dump_min +
            c.return_min,
          0,
        ) / n;
  const avgLoaderQueue = n === 0 ? 0 : cycles.reduce((s, c) => s + c.queue_wait_min, 0) / n;
  const avgDumpQueue = n === 0 ? 0 : cycles.reduce((s, c) => s + c.dump_queue_wait_min, 0) / n;
  const avgTotalQueue = avgLoaderQueue + avgDumpQueue;
  const avgLoaderService =
    n === 0 ? 0 : cycles.reduce((s, c) => s + c.spotting_min + c.load_min, 0) / n;

  const loaderCapacityMin = acc.shiftMinutes * acc.loaderCount * meta.shifts_simulated;
  const loaderIdle =
    loaderCapacityMin <= 0 ? 100 : ((loaderCapacityMin - acc.loaderBusyMin) / loaderCapacityMin) * 100;

  const haulCapacityMin = acc.haulAvailableMin * meta.shifts_simulated;
  const haulUtil = haulCapacityMin <= 0 ? 0 : (acc.haulBusyMin / haulCapacityMin) * 100;

  const availability =
    haulCapacityMin <= 0
      ? 0
      : Math.max(0, Math.min(1, (haulCapacityMin - acc.haulDownMin) / haulCapacityMin));
  const utilization = haulUtil / 100;
  const E = operatingEfficiency(availability, utilization);

  const recommendedHaulUnits = matchFactorNh(avgCycle, avgLoaderService);
  const fleetMatch =
    meta.haul_unit_count <= 0 || recommendedHaulUnits <= 0
      ? 0
      : meta.haul_unit_count / recommendedHaulUnits;

  const tonnesPerShift = meta.shifts_simulated <= 0 ? 0 : acc.tonnes / meta.shifts_simulated;
  const availAdjusted = tonnesPerShift * availability;

  return {
    scenario_id: meta.scenario_id,
    mine_id: meta.mine_id,
    seed: meta.seed,
    shifts_simulated: meta.shifts_simulated,
    cycles_completed: n,
    tonnes_per_shift: round3(tonnesPerShift),
    avg_cycle_time_min: round3(avgCycle),
    avg_haul_cycle_time_min: round3(avgCycle),
    avg_queue_wait_min: round3(avgLoaderQueue),
    avg_loader_queue_wait_min: round3(avgLoaderQueue),
    avg_dump_queue_wait_min: round3(avgDumpQueue),
    avg_total_queue_wait_min: round3(avgTotalQueue),
    avg_loader_service_time_min: round3(avgLoaderService),
    recommended_haul_units_Nh: round3(recommendedHaulUnits),
    loader_idle_percent: round3(loaderIdle),
    haul_unit_utilization_percent: round3(haulUtil),
    match_factor_Nh: round3(recommendedHaulUnits),
    fleet_match_ratio: round3(fleetMatch),
    availability: round3(availability),
    utilization: round3(utilization),
    operating_efficiency_E: round3(E),
    availability_adjusted_throughput_t_per_shift: round3(availAdjusted),
    cost_index_placeholder: null,
    fuel_index_placeholder: null,
  };
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
