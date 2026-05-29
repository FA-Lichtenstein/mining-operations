import type { GenTruckCycleConfig } from '../../shared/domain/haulage';
import type { DesCycleRecord, DesKpis } from './engine/types';
import type { HaulageScenarioId } from './haulage-scenario';

/** Brief #brief-02 IndexedDB `haulageDesRuns` record shape. */
export type HaulageRunStatus = 'running' | 'complete' | 'error';

export type HaulageRunKpisBrief = {
  throughput_tpd: number;
  avgCycle_min: number;
  queueWait_min: number;
  matchFactor: number;
  cost_index: number;
};

export type HaulageDesRunRecord = {
  runId: string;
  mineId: string;
  scenarioId: HaulageScenarioId;
  createdAt: string;
  seed: number;
  configHash: string;
  status: HaulageRunStatus;
  kpis: HaulageRunKpisBrief;
  summaryRef?: string;
  config?: GenTruckCycleConfig;
  desKpis?: DesKpis;
  cycles?: DesCycleRecord[];
};

export type HaulageRunExport = {
  version: 1;
  exportedAt: string;
  record: HaulageDesRunRecord;
};

export function kpisToBrief(kpis: DesKpis, shiftHours: number): HaulageRunKpisBrief {
  const shiftsPerDay = 24 / shiftHours;
  return {
    throughput_tpd: round1(kpis.tonnes_per_shift * shiftsPerDay),
    avgCycle_min: round2(kpis.avg_cycle_time_min),
    queueWait_min: round2(kpis.avg_queue_wait_min),
    matchFactor: round2(kpis.match_factor_Nh),
    cost_index: round2(kpis.cost_index_placeholder),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
