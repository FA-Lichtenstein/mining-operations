export type { Rng } from './rng.js';

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
    /** truck_shovel | scraper_train | ipcc_conveyor */
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
  metadata?: {
    data_classification?: string;
    fleet_parameters_label?: string;
    ktec_parameters_label?: string;
    roles_note?: string;
    operating_mode_note?: string;
  };
};

export type CycleRecord = {
  cycle_id: string;
  scenario_id: string;
  truck_id: string;
  shovel_id: string;
  load_zone: string;
  dump_zone: string;
  timestamp_utc: string;
  load_min: number;
  haul_min: number;
  dump_min: number;
  queue_min: number;
  return_min: number;
  payload_t: number;
  material: 'ore' | 'waste' | 'low_grade';
};

export type FleetEvent = {
  event_id: string;
  truck_id: string;
  event_type: 'breakdown' | 'repair_complete';
  start_utc: string;
  end_utc: string;
  duration_h: number;
  root_cause: string;
};

export type FleetShiftSnapshot = {
  shift_id: string;
  trucks_total: number;
  trucks_available: number;
  trucks_down: number;
  shovels_active: number;
  backlog_tons: number;
  shift_tons_actual: number;
  shift_tons_target: number;
};

export type GenerationResult = {
  config: GenTruckCycleConfig;
  cycles: CycleRecord[];
  fleetEvents: FleetEvent[];
  fleetState: {
    mine_id: string;
    scenario_id: string;
    generator_version: string;
    snapshots: FleetShiftSnapshot[];
  };
};
