import type { GenTruckCycleConfig } from '../../../shared/domain/haulage';
import { activeBreakdown, scheduleBreakdownsForShift } from './breakdowns';
import { sampleDistribution } from './distributions';
import { EventQueue } from './event-queue';
import { createAccumulator, finalizeKpis, type KpiAccumulator } from './kpi';
import { mulberry32, type Rng } from './rng';
import type { DesCycleRecord, DesRunOptions, DesRunResult } from './types';

type LoaderSlot = { busyUntilMin: number; loaderId: string };

type InFlightCycle = {
  haul_unit_id: string;
  loader_id: string;
  shift_index: number;
  queue_wait_min: number;
  dump_queue_wait_min: number;
  spotting_min: number;
  load_min: number;
  haul_min: number;
  dump_min: number;
  return_min: number;
  payload_t: number;
};

export function runDesSimulation(
  config: GenTruckCycleConfig,
  options: DesRunOptions = {},
): DesRunResult {
  const rng = mulberry32(config.seed);
  const shiftCount = options.shiftCount ?? 1;
  const shiftMinutes = config.site.shift_hours * 60;
  const haulUnitIds = Array.from({ length: config.fleet.haul_unit_count }, (_, i) =>
    formatHaulUnitId(i + 1, config.fleet.operating_mode),
  );
  const loaderIds = Array.from({ length: config.fleet.loader_count }, (_, i) =>
    config.fleet.operating_mode === 'scraper_train'
      ? `train-${String(i + 1).padStart(2, '0')}`
      : `SH-${String(i + 1).padStart(2, '0')}`,
  );

  const acc = createAccumulator(shiftMinutes, config.fleet.loader_count, config.fleet.haul_unit_count);
  const progressEvery = options.progressEveryCycles ?? 50;
  let cyclesSinceProgress = 0;
  const meanCycle = sampleMeanCycleMin(config);
  const totalCyclesEstimate = Math.max(
    1,
    Math.floor((shiftMinutes * haulUnitIds.length) / (meanCycle || 30)) * shiftCount,
  );

  for (let shiftIdx = 0; shiftIdx < shiftCount; shiftIdx++) {
    const shiftStartMin = shiftIdx * shiftMinutes;
    const shiftEndMin = shiftStartMin + shiftMinutes;
    simulateShift({
      config,
      rng,
      shiftIdx,
      shiftStartMin,
      shiftEndMin,
      haulUnitIds,
      loaderIds,
      acc,
      onCycleComplete: () => {
        cyclesSinceProgress++;
        if (options.onProgress && cyclesSinceProgress >= progressEvery) {
          cyclesSinceProgress = 0;
          const pct = Math.min(99, Math.round((acc.cycles.length / totalCyclesEstimate) * 100));
          options.onProgress(pct);
        }
      },
    });
  }

  if (options.onProgress) {
    options.onProgress(100);
  }

  const kpis = finalizeKpis(acc, {
    scenario_id: config.site.scenario_id,
    mine_id: config.site.mine_id,
    seed: config.seed,
    shifts_simulated: shiftCount,
    haul_unit_count: config.fleet.haul_unit_count,
  });

  return { config, kpis, cycles: acc.cycles };
}

function simulateShift(ctx: {
  config: GenTruckCycleConfig;
  rng: Rng;
  shiftIdx: number;
  shiftStartMin: number;
  shiftEndMin: number;
  haulUnitIds: string[];
  loaderIds: string[];
  acc: KpiAccumulator;
  onCycleComplete: () => void;
}): void {
  const {
    config,
    rng,
    shiftIdx,
    shiftStartMin,
    shiftEndMin,
    haulUnitIds,
    loaderIds,
    acc,
    onCycleComplete,
  } = ctx;

  const dist = config.cycle_distributions;
  const breakdowns = scheduleBreakdownsForShift(
    config,
    rng,
    haulUnitIds,
    shiftStartMin,
    shiftEndMin,
  );

  const events = new EventQueue();
  const loaderQueue: string[] = [];
  const dumpQueue: string[] = [];
  const loaderJoinTimes = new Map<string, number>();
  const dumpJoinTimes = new Map<string, number>();
  const inFlight = new Map<string, InFlightCycle>();
  const loaders: LoaderSlot[] = loaderIds.map((loaderId) => ({
    loaderId,
    busyUntilMin: shiftStartMin,
  }));
  let dumpBusyUntilMin = shiftStartMin;
  const breakdownDeferred = new Set<string>();

  for (const id of haulUnitIds) {
    const stagger = Math.floor(rng() * 15);
    events.schedule(shiftStartMin + stagger, 'join_loader_queue', id);
  }

  const tryAssignLoaders = (now: number) => {
    const available = loaders
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => l.busyUntilMin <= now)
      .sort((a, b) => a.l.busyUntilMin - b.l.busyUntilMin || a.i - b.i);

    while (loaderQueue.length > 0 && available.length > 0) {
      const { l: slot } = available.shift()!;
      const haulId = loaderQueue.shift()!;
      const joinedAt = loaderJoinTimes.get(haulId) ?? now;
      const spottingMin = sampleDistribution(dist.queue_time_min, rng);
      const loadMin = sampleDistribution(dist.load_time_min, rng);

      const startLoad = Math.max(now, slot.busyUntilMin);
      const queueWait = Math.max(0, startLoad - joinedAt);
      const endLoad = startLoad + spottingMin + loadMin;
      slot.busyUntilMin = endLoad;

      const payloadScale =
        config.fleet.operating_mode === 'scraper_train'
          ? 0.92 + rng() * 0.06
          : 0.94 + rng() * 0.08;
      const payload_t = round3(config.fleet.payload_t * payloadScale);

      inFlight.set(haulId, {
        haul_unit_id: haulId,
        loader_id: slot.loaderId,
        shift_index: shiftIdx,
        queue_wait_min: round3(queueWait),
        dump_queue_wait_min: 0,
        spotting_min: round3(spottingMin),
        load_min: round3(loadMin),
        haul_min: 0,
        dump_min: 0,
        return_min: 0,
        payload_t,
      });

      events.schedule(endLoad, 'load_complete', haulId);
    }
  };

  const tryAssignDump = (now: number) => {
    while (dumpQueue.length > 0 && dumpBusyUntilMin <= now) {
      const haulId = dumpQueue.shift()!;
      const joinedAt = dumpJoinTimes.get(haulId) ?? now;
      const dumpQueueWait = Math.max(0, now - joinedAt);
      const dumpMin = sampleDistribution(dist.dump_time_min, rng);
      const start = Math.max(now, dumpBusyUntilMin);
      const end = start + dumpMin;
      dumpBusyUntilMin = end;

      const cycle = inFlight.get(haulId);
      if (cycle) {
        cycle.dump_queue_wait_min = round3(dumpQueueWait);
        cycle.dump_min = round3(dumpMin);
      }
      dumpJoinTimes.delete(haulId);
      events.schedule(end, 'dump_complete', haulId);
      now = end;
    }
  };

  while (events.peek()) {
    const ev = events.pop()!;
    if (ev.time >= shiftEndMin) {
      continue;
    }

    const bd = activeBreakdown(breakdowns.get(ev.haulUnitId), ev.time);
    if (bd && ev.kind !== 'breakdown_end') {
      if (!breakdownDeferred.has(ev.haulUnitId)) {
        breakdownDeferred.add(ev.haulUnitId);
        events.schedule(bd.endMin, 'breakdown_end', ev.haulUnitId);
      }
      continue;
    }

    switch (ev.kind) {
      case 'join_loader_queue': {
        loaderJoinTimes.set(ev.haulUnitId, ev.time);
        loaderQueue.push(ev.haulUnitId);
        tryAssignLoaders(ev.time);
        break;
      }
      case 'load_complete': {
        const haulMin = sampleDistribution(dist.haul_time_min, rng);
        const cycle = inFlight.get(ev.haulUnitId);
        if (cycle) {
          cycle.haul_min = round3(haulMin);
        }
        events.schedule(ev.time + haulMin, 'arrive_dump', ev.haulUnitId);
        tryAssignLoaders(ev.time);
        break;
      }
      case 'arrive_dump': {
        dumpJoinTimes.set(ev.haulUnitId, ev.time);
        dumpQueue.push(ev.haulUnitId);
        tryAssignDump(ev.time);
        break;
      }
      case 'dump_complete': {
        const returnMin = sampleDistribution(dist.return_time_min, rng);
        const cycle = inFlight.get(ev.haulUnitId);
        if (cycle) {
          cycle.return_min = round3(returnMin);
        }
        events.schedule(ev.time + returnMin, 'return_complete', ev.haulUnitId);
        tryAssignDump(ev.time);
        break;
      }
      case 'return_complete': {
        const cycle = inFlight.get(ev.haulUnitId);
        if (cycle) {
          acc.cycles.push({ ...cycle });
          acc.tonnes += cycle.payload_t;
          acc.loaderBusyMin += cycle.spotting_min + cycle.load_min;
          acc.haulBusyMin +=
            cycle.queue_wait_min +
            cycle.dump_queue_wait_min +
            cycle.spotting_min +
            cycle.load_min +
            cycle.haul_min +
            cycle.dump_min +
            cycle.return_min;
          inFlight.delete(ev.haulUnitId);
          onCycleComplete();
        }
        if (ev.time < shiftEndMin) {
          events.schedule(ev.time, 'join_loader_queue', ev.haulUnitId);
        }
        break;
      }
      case 'breakdown_end': {
        breakdownDeferred.delete(ev.haulUnitId);
        events.schedule(ev.time, 'join_loader_queue', ev.haulUnitId);
        break;
      }
    }
  }

  for (const intervals of breakdowns.values()) {
    for (const b of intervals) {
      const start = Math.max(b.startMin, shiftStartMin);
      const end = Math.min(b.endMin, shiftEndMin);
      if (end > start) {
        acc.haulDownMin += end - start;
      }
    }
  }
}

function formatHaulUnitId(index: number, mode: string): string {
  if (mode === 'scraper_train') {
    return `SC-${String(index).padStart(2, '0')}`;
  }
  return `T${String(index).padStart(2, '0')}`;
}

function sampleMeanCycleMin(config: GenTruckCycleConfig): number {
  const d = config.cycle_distributions;
  const tri = (t: { min: number; mode: number; max: number }) => (t.min + t.mode + t.max) / 3;
  const load =
    d.load_time_min.dist === 'triangular'
      ? tri(d.load_time_min)
      : d.load_time_min.dist === 'normal'
        ? d.load_time_min.mean
        : 3;
  const haul = d.haul_time_min.dist === 'normal' ? d.haul_time_min.mean : 10;
  const dump =
    d.dump_time_min.dist === 'triangular' ? tri(d.dump_time_min) : 2;
  const ret = d.return_time_min.dist === 'normal' ? d.return_time_min.mean : 10;
  return load + haul + dump + ret;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
