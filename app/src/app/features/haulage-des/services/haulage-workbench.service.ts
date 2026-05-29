import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { GenTruckCycleConfig } from '../../../shared/domain/haulage';
import { DesWorkerService } from '../des-worker.service';
import type { DesCycleRecord, DesKpis } from '../engine/types';
import {
  cloneConfig,
  configHash,
  HAULAGE_SCENARIOS,
  otherScenario,
  scaleHaulTimes,
  type HaulageScenarioId,
} from '../haulage-scenario';
import type { HaulageDesRunRecord, HaulageRunExport } from '../haulage-run.types';
import { kpisToBrief } from '../haulage-run.types';
import { HaulageRunStoreService } from './haulage-run-store.service';

export type SimPhase = 'queue' | 'load' | 'haul' | 'dump' | 'return' | 'idle';

export type CompareSlot = 'A' | 'B';

export type CompletedRun = {
  slot?: CompareSlot;
  config: GenTruckCycleConfig;
  kpis: DesKpis;
  cycles: DesCycleRecord[];
  runId: string;
  createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class HaulageWorkbenchService {
  private readonly http = inject(HttpClient);
  private readonly desWorker = inject(DesWorkerService);
  private readonly runStore = inject(HaulageRunStoreService);

  readonly scenarioId = signal<HaulageScenarioId>('truck_shovel');
  readonly config = signal<GenTruckCycleConfig | null>(null);
  readonly horizonShifts = signal(5);
  readonly running = signal(false);
  readonly progressPct = signal(0);
  readonly simPhase = signal<SimPhase>('idle');
  readonly runProgressQueuePreview = signal(0);
  readonly lastRun = signal<CompletedRun | null>(null);
  readonly compareA = signal<CompletedRun | null>(null);
  readonly compareB = signal<CompletedRun | null>(null);
  readonly loadError = signal<string | null>(null);
  readonly savedRuns = signal<HaulageDesRunRecord[]>([]);

  readonly scenarioMeta = computed(() => HAULAGE_SCENARIOS[this.scenarioId()]);
  readonly metadataLabels = computed(() => {
    const cfg = this.config();
    if (!cfg?.metadata) {
      return [];
    }
    return Object.entries(cfg.metadata).filter(([, v]) => v);
  });

  readonly compareDelta = computed(() => {
    const a = this.compareA();
    const b = this.compareB();
    if (!a || !b) {
      return null;
    }
    const rows: { label: string; a: number; b: number; delta: number; unit: string }[] = [
      mkRow('Throughput', a.kpis.tonnes_per_shift, b.kpis.tonnes_per_shift, 't/shift'),
      mkRow('Avg cycle', a.kpis.avg_cycle_time_min, b.kpis.avg_cycle_time_min, 'min'),
      mkRow('Loader queue wait', a.kpis.avg_loader_queue_wait_min, b.kpis.avg_loader_queue_wait_min, 'min'),
      mkRow('Dump queue wait', a.kpis.avg_dump_queue_wait_min, b.kpis.avg_dump_queue_wait_min, 'min'),
      mkRow('Recommended units Nh', a.kpis.recommended_haul_units_Nh, b.kpis.recommended_haul_units_Nh, ''),
      mkRow('Fleet match ratio', a.kpis.fleet_match_ratio, b.kpis.fleet_match_ratio, ''),
      mkRow('Haul utilisation', a.kpis.haul_unit_utilization_percent, b.kpis.haul_unit_utilization_percent, '%'),
    ];
    return rows;
  });

  async init(): Promise<void> {
    await this.loadScenario('truck_shovel');
    this.savedRuns.set(await this.runStore.listRuns());
  }

  async loadScenario(id: HaulageScenarioId): Promise<void> {
    this.loadError.set(null);
    this.scenarioId.set(id);
    try {
      const url = HAULAGE_SCENARIOS[id].configUrl;
      const cfg = await firstValueFrom(this.http.get<GenTruckCycleConfig>(url));
      this.config.set(cloneConfig(cfg));
    } catch {
      this.loadError.set('Failed to load scenario seed config.');
    }
  }

  patchFleetCount(count: number): void {
    const cfg = this.config();
    if (!cfg) {
      return;
    }
    const next = cloneConfig(cfg);
    next.fleet.haul_unit_count = Math.max(1, Math.round(count));
    this.config.set(next);
  }

  patchPayload(payload: number): void {
    const cfg = this.config();
    if (!cfg) {
      return;
    }
    const next = cloneConfig(cfg);
    next.fleet.payload_t = Math.max(1, Math.round(payload));
    this.config.set(next);
  }

  patchHaulDistance(km: number): void {
    const cfg = this.config();
    if (!cfg) {
      return;
    }
    const next = cloneConfig(cfg);
    scaleHaulTimes(next, Math.max(0.5, round2(km)));
    this.config.set(next);
  }

  patchSeed(seed: number): void {
    const cfg = this.config();
    if (!cfg) {
      return;
    }
    const next = cloneConfig(cfg);
    next.seed = Math.max(1, Math.round(seed));
    this.config.set(next);
  }

  resetToSeed(): void {
    void this.loadScenario(this.scenarioId());
    this.lastRun.set(null);
    this.progressPct.set(0);
    this.simPhase.set('idle');
    this.runProgressQueuePreview.set(0);
  }

  async cloneToOtherScenario(): Promise<void> {
    const cfg = this.config();
    if (!cfg) {
      return;
    }
    const target = otherScenario(this.scenarioId());
    const tuned = {
      haulKm: cfg.calibration.haul_distance_km,
      seed: cfg.seed,
      horizon: this.horizonShifts(),
    };
    await this.loadScenario(target);
    const next = this.config();
    if (!next) {
      return;
    }
    next.seed = tuned.seed + 1;
    scaleHaulTimes(next, tuned.haulKm);
    this.horizonShifts.set(tuned.horizon);
    this.config.set(cloneConfig(next));
  }

  saveCompareSlot(slot: CompareSlot): void {
    const run = this.lastRun();
    if (!run) {
      return;
    }
    const tagged = { ...run, slot };
    if (slot === 'A') {
      this.compareA.set(tagged);
    } else {
      this.compareB.set(tagged);
    }
  }

  runSimulation(): void {
    const cfg = this.config();
    if (!cfg || this.running()) {
      return;
    }
    this.running.set(true);
    this.progressPct.set(0);
    this.simPhase.set('queue');
    this.lastRun.set(null);

    const sub = this.desWorker
      .run(cfg, { shiftCount: this.horizonShifts(), progressEveryCycles: 20 })
      .subscribe({
        next: (ev) => {
          if (ev.kind === 'progress') {
            this.progressPct.set(ev.pct);
            this.simPhase.set(phaseFromProgress(ev.pct));
            this.runProgressQueuePreview.set(queuePreviewFromProgress(ev.pct, cfg.fleet.haul_unit_count));
          } else {
            const runId = crypto.randomUUID();
            const createdAt = new Date().toISOString();
            const completed: CompletedRun = {
              config: cloneConfig(cfg),
              kpis: ev.kpis,
              cycles: ev.cycles,
              runId,
              createdAt,
            };
            this.lastRun.set(completed);
            this.progressPct.set(100);
            this.simPhase.set('idle');
            this.runProgressQueuePreview.set(0);
            this.running.set(false);
            void this.persistRun(completed, 'complete');
          }
        },
        error: () => {
          this.running.set(false);
          this.simPhase.set('idle');
          this.loadError.set('Simulation worker error.');
        },
      });

    sub.add(() => {
      if (this.running()) {
        this.running.set(false);
      }
    });
  }

  exportLastRunJson(): void {
    const run = this.lastRun();
    if (!run) {
      return;
    }
    const record = this.toRunRecord(run, 'complete');
    const payload: HaulageRunExport = {
      version: 1,
      exportedAt: new Date().toISOString(),
      record,
    };
    downloadJson(payload, `haulage-des-${run.config.site.scenario_id}-${run.runId.slice(0, 8)}.json`);
  }

  async importRunJson(file: File): Promise<void> {
    let parsed: HaulageRunExport | HaulageDesRunRecord;
    try {
      const text = await file.text();
      parsed = JSON.parse(text) as HaulageRunExport | HaulageDesRunRecord;
    } catch {
      this.loadError.set('Invalid JSON import file.');
      return;
    }
    const record = 'record' in parsed ? parsed.record : parsed;
    if (!record.config) {
      this.loadError.set('Import file missing config.');
      return;
    }
    this.scenarioId.set(record.scenarioId);
    this.config.set(cloneConfig(record.config));
    if (record.desKpis && record.cycles) {
      this.lastRun.set({
        runId: record.runId,
        createdAt: record.createdAt,
        config: cloneConfig(record.config),
        kpis: record.desKpis,
        cycles: record.cycles,
      });
    }
    await this.runStore.putRun(record);
    this.savedRuns.set(await this.runStore.listRuns());
  }

  restoreSavedRun(record: HaulageDesRunRecord): void {
    if (!record.config || !record.desKpis) {
      return;
    }
    this.scenarioId.set(record.scenarioId);
    this.config.set(cloneConfig(record.config));
    this.lastRun.set({
      runId: record.runId,
      createdAt: record.createdAt,
      config: cloneConfig(record.config),
      kpis: record.desKpis,
      cycles: record.cycles ?? [],
    });
  }

  private async persistRun(run: CompletedRun, status: 'complete' | 'error'): Promise<void> {
    const record = this.toRunRecord(run, status);
    await this.runStore.putRun(record);
    this.savedRuns.set(await this.runStore.listRuns());
  }

  private toRunRecord(run: CompletedRun, status: 'complete' | 'error'): HaulageDesRunRecord {
    const cfg = run.config;
    return {
      runId: run.runId,
      mineId: cfg.site.mine_id,
      scenarioId: cfg.site.scenario_id as HaulageScenarioId,
      createdAt: run.createdAt,
      seed: cfg.seed,
      configHash: configHash(cfg),
      status,
      kpis: kpisToBrief(run.kpis, cfg.site.shift_hours),
      summaryRef: HAULAGE_SCENARIOS[cfg.site.scenario_id as HaulageScenarioId]?.configUrl.replace(
        'config.json',
        'cycles.csv',
      ),
      config: cfg,
      desKpis: run.kpis,
      cycles: run.cycles,
    };
  }
}

function phaseFromProgress(pct: number): SimPhase {
  if (pct < 15) {
    return 'queue';
  }
  if (pct < 35) {
    return 'load';
  }
  if (pct < 55) {
    return 'haul';
  }
  if (pct < 75) {
    return 'dump';
  }
  if (pct < 95) {
    return 'return';
  }
  return 'idle';
}

function queuePreviewFromProgress(pct: number, fleet: number): number {
  const wave = Math.sin((pct / 100) * Math.PI * 4);
  return Math.max(0, round2((fleet * 0.12 + wave * fleet * 0.08) * (pct / 100)));
}

function mkRow(label: string, a: number, b: number, unit: string) {
  return { label, a: round2(a), b: round2(b), delta: round2(b - a), unit };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
