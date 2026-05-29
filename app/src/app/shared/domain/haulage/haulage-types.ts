/** Shared haulage config shapes — keep aligned with `app/tools/gen-truck-cycle/types.ts`. */

export type TriangularDist = {
  dist: 'triangular';
  min: number;
  mode: number;
  max: number;
};

export type NormalDist = {
  dist: 'normal';
  mean: number;
  sd: number;
};

export type ExponentialDist = {
  dist: 'exponential';
  lambda: number;
};

export type DistributionSpec = TriangularDist | NormalDist | ExponentialDist;

export type CycleDistributions = {
  load_time_min: DistributionSpec;
  haul_time_min: DistributionSpec;
  dump_time_min: DistributionSpec;
  queue_time_min: DistributionSpec;
  return_time_min: DistributionSpec;
  breakdown_mtbf_hours: number;
  breakdown_mttr_hours: number;
};

export type GenTruckCycleConfig = {
  generator_id: 'gen-truck-cycle';
  version: '1.0.0';
  seed: number;
  site: {
    mine_id: string;
    scenario_id: string;
    shift_hours: number;
    simulation_days: number;
  };
  fleet: {
    haul_unit_class: string;
    haul_unit_count: number;
    payload_t: number;
    loader_count: number;
    operating_mode: string;
    train_size?: number;
  };
  zones: {
    load_zone: string;
    dump_zone: string;
  };
  calibration: {
    throughput_prior_ref: string;
    daily_tonnage_target_t: number;
    network_edge_ref?: string;
    haul_distance_km: number;
  };
  cycle_distributions: CycleDistributions;
  metadata?: Record<string, string | undefined>;
};
