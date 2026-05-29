import type { GenTruckCycleConfig } from '../../../shared/domain/haulage';

export type CyclePhase =
  | 'queue_loader'
  | 'spotting'
  | 'load'
  | 'haul_loaded'
  | 'queue_dump'
  | 'dump'
  | 'return_empty'
  | 'down';

export type DesRunOptions = {
  /** Shifts to simulate (default 1). */
  shiftCount?: number;
  /** Report progress every N completed cycles (default 50). */
  progressEveryCycles?: number;
  onProgress?: (pct: number) => void;
};

export type DesCycleRecord = {
  haul_unit_id: string;
  loader_id: string;
  shift_index: number;
  /** Time spent in the loader FIFO queue. Kept as queue_wait_min for existing exports. */
  queue_wait_min: number;
  dump_queue_wait_min: number;
  spotting_min: number;
  load_min: number;
  haul_min: number;
  dump_min: number;
  return_min: number;
  payload_t: number;
};

export type DesKpis = {
  scenario_id: string;
  mine_id: string;
  seed: number;
  shifts_simulated: number;
  cycles_completed: number;
  tonnes_per_shift: number;
  avg_cycle_time_min: number;
  avg_haul_cycle_time_min: number;
  avg_queue_wait_min: number;
  avg_loader_queue_wait_min: number;
  avg_dump_queue_wait_min: number;
  avg_total_queue_wait_min: number;
  avg_loader_service_time_min: number;
  recommended_haul_units_Nh: number;
  loader_idle_percent: number;
  haul_unit_utilization_percent: number;
  match_factor_Nh: number;
  fleet_match_ratio: number;
  availability: number;
  utilization: number;
  operating_efficiency_E: number;
  availability_adjusted_throughput_t_per_shift: number;
  cost_index_placeholder: null;
  fuel_index_placeholder: null;
};

export type DesRunResult = {
  config: GenTruckCycleConfig;
  kpis: DesKpis;
  cycles: DesCycleRecord[];
};
