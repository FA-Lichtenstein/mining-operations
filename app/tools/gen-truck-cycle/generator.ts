import { sampleDistribution, sampleExponentialHours } from './distributions.js';
import { mulberry32 } from './rng.js';
import type {
  CycleRecord,
  FleetEvent,
  FleetShiftSnapshot,
  GenTruckCycleConfig,
  GenerationResult,
} from './types.js';

const ROOT_CAUSES = ['tyre', 'hydraulic', 'engine', 'electrical', 'brake'] as const;
const MATERIALS: CycleRecord['material'][] = ['waste', 'waste', 'waste', 'low_grade'];

export function generateTruckCycleSeed(config: GenTruckCycleConfig): GenerationResult {
  const rng = mulberry32(config.seed);
  const cycles: CycleRecord[] = [];
  const fleetEvents: FleetEvent[] = [];
  const snapshots: FleetShiftSnapshot[] = [];

  const shiftMinutes = config.site.shift_hours * 60;
  const haulUnitIds = Array.from({ length: config.fleet.haul_unit_count }, (_, i) =>
    formatHaulUnitId(i + 1),
  );
  const loaderIds = Array.from({ length: config.fleet.loader_count }, (_, i) =>
    config.fleet.operating_mode === 'scraper_train'
      ? `train-${String(i + 1).padStart(2, '0')}`
      : `SH-${String(i + 1).padStart(2, '0')}`,
  );

  let cycleCounter = 0;
  let eventCounter = 0;
  const baseMs = Date.parse('2026-01-01T06:00:00.000Z');

  for (let shiftIdx = 0; shiftIdx < config.site.simulation_days; shiftIdx++) {
    const shiftStartMs = baseMs + shiftIdx * 24 * 60 * 60 * 1000;
    const shiftEndMs = shiftStartMs + shiftMinutes * 60 * 1000;
    const shiftDate = new Date(shiftStartMs).toISOString().slice(0, 10);
    const shiftId = `${shiftDate}-${shiftIdx % 2 === 0 ? 'D' : 'N'}`;

    const breakdownSchedule = scheduleBreakdowns(
      config,
      rng,
      haulUnitIds,
      shiftStartMs,
      shiftEndMs,
      () => `E${String(++eventCounter).padStart(4, '0')}`,
      fleetEvents,
    );

    let shiftTons = 0;
    const trucksDownDuringShift = new Set<string>();
    const target = config.calibration.daily_tonnage_target_t;
    const shiftTonnageCap = target * 1.02;

    for (const truckId of haulUnitIds) {
      if (shiftTons >= shiftTonnageCap) {
        break;
      }

      let cursorMs = shiftStartMs + Math.floor(rng() * 15) * 60 * 1000;
      let loaderCursor = 0;

      while (cursorMs < shiftEndMs && shiftTons < shiftTonnageCap) {
        const activeBreakdown = breakdownSchedule.get(truckId)?.find(
          (b) => cursorMs >= b.startMs && cursorMs < b.endMs,
        );
        if (activeBreakdown) {
          cursorMs = activeBreakdown.endMs;
          trucksDownDuringShift.add(truckId);
          continue;
        }

        const queueMin = sampleDistribution(config.cycle_distributions.queue_time_min, rng);
        const loadMin = sampleDistribution(config.cycle_distributions.load_time_min, rng);
        const haulMin = sampleDistribution(config.cycle_distributions.haul_time_min, rng);
        const dumpMin = sampleDistribution(config.cycle_distributions.dump_time_min, rng);
        const returnMin = sampleDistribution(config.cycle_distributions.return_time_min, rng);

        const cycleDurationMs = (queueMin + loadMin + haulMin + dumpMin + returnMin) * 60 * 1000;
        if (cursorMs + cycleDurationMs > shiftEndMs) {
          break;
        }

        const payloadScale =
          config.fleet.operating_mode === 'scraper_train' ? 0.92 + rng() * 0.06 : 0.94 + rng() * 0.08;
        const payload_t = round3(config.fleet.payload_t * payloadScale);
        const shovel_id = loaderIds[loaderCursor % loaderIds.length]!;
        loaderCursor++;

        cycles.push({
          cycle_id: `C${String(++cycleCounter).padStart(5, '0')}`,
          scenario_id: config.site.scenario_id,
          truck_id: truckId,
          shovel_id,
          load_zone: config.zones.load_zone,
          dump_zone: config.zones.dump_zone,
          timestamp_utc: new Date(cursorMs).toISOString().replace('.000', ''),
          load_min: round3(loadMin),
          haul_min: round3(haulMin),
          dump_min: round3(dumpMin),
          queue_min: round3(queueMin),
          return_min: round3(returnMin),
          payload_t,
          material: MATERIALS[Math.floor(rng() * MATERIALS.length)]!,
        });

        shiftTons += payload_t;
        cursorMs += cycleDurationMs;

        const nextBreakdown = breakdownSchedule
          .get(truckId)
          ?.find((b) => b.startMs > cursorMs - cycleDurationMs && b.startMs < cursorMs);
        if (nextBreakdown && cursorMs >= nextBreakdown.startMs) {
          cursorMs = nextBreakdown.endMs;
          trucksDownDuringShift.add(truckId);
        }
      }
    }

    const trucksDown = new Set<string>();
    for (const ev of fleetEvents) {
      if (ev.event_type === 'breakdown' && ev.start_utc.startsWith(shiftDate)) {
        trucksDown.add(ev.truck_id);
      }
    }
    const trucksDownCount = Math.max(trucksDown.size, trucksDownDuringShift.size);
    const trucksAvailable = config.fleet.haul_unit_count - trucksDownCount;
    const shiftCycles = cycles.filter((c) => {
      const t = Date.parse(c.timestamp_utc);
      return t >= shiftStartMs && t < shiftEndMs;
    });
    const actualTons = Math.round(shiftCycles.reduce((s, c) => s + c.payload_t, 0));

    snapshots.push({
      shift_id: shiftId,
      trucks_total: config.fleet.haul_unit_count,
      trucks_available: Math.max(0, trucksAvailable),
      trucks_down: trucksDownCount,
      shovels_active: config.fleet.loader_count,
      backlog_tons: Math.round(Math.max(0, target - actualTons) * 0.15),
      shift_tons_actual: actualTons,
      shift_tons_target: Math.round(target),
    });
  }

  cycles.sort((a, b) => {
    const t = a.timestamp_utc.localeCompare(b.timestamp_utc);
    if (t !== 0) return t;
    return a.truck_id.localeCompare(b.truck_id) || a.cycle_id.localeCompare(b.cycle_id);
  });

  return {
    config,
    cycles,
    fleetEvents,
    fleetState: {
      mine_id: config.site.mine_id,
      scenario_id: config.site.scenario_id,
      generator_version: config.version,
      snapshots,
    },
  };
}

function scheduleBreakdowns(
  config: GenTruckCycleConfig,
  rng: () => number,
  truckIds: string[],
  shiftStartMs: number,
  shiftEndMs: number,
  nextEventId: () => string,
  fleetEvents: FleetEvent[],
): Map<string, { startMs: number; endMs: number }[]> {
  const map = new Map<string, { startMs: number; endMs: number }[]>();
  const mtbf = config.cycle_distributions.breakdown_mtbf_hours;
  const mttr = config.cycle_distributions.breakdown_mttr_hours;
  const mttrMs = mttr * 60 * 60 * 1000;

  for (const truckId of truckIds) {
    const intervals: { startMs: number; endMs: number }[] = [];
    let cursor = shiftStartMs + sampleExponentialHours(rng, mtbf) * 60 * 60 * 1000;

    while (cursor < shiftEndMs) {
      const endMs = Math.min(cursor + mttrMs, shiftEndMs);
      intervals.push({ startMs: cursor, endMs });
      const root = ROOT_CAUSES[Math.floor(rng() * ROOT_CAUSES.length)]!;
      fleetEvents.push({
        event_id: nextEventId(),
        truck_id: truckId,
        event_type: 'breakdown',
        start_utc: new Date(cursor).toISOString().replace('.000', ''),
        end_utc: new Date(endMs).toISOString().replace('.000', ''),
        duration_h: round3((endMs - cursor) / (60 * 60 * 1000)),
        root_cause: root,
      });
      cursor += sampleExponentialHours(rng, mtbf) * 60 * 60 * 1000 + mttrMs;
    }

    map.set(truckId, intervals);
  }

  fleetEvents.sort(
    (a, b) => a.start_utc.localeCompare(b.start_utc) || a.truck_id.localeCompare(b.truck_id),
  );

  return map;
}

function formatHaulUnitId(index: number): string {
  return `T${String(index).padStart(2, '0')}`;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
