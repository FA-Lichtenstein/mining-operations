import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { GenerationResult } from './types.js';

const CYCLE_HEADER =
  'cycle_id,scenario_id,truck_id,shovel_id,load_zone,dump_zone,timestamp_utc,load_min,haul_min,dump_min,queue_min,return_min,payload_t,material';

const EVENT_HEADER = 'event_id,truck_id,event_type,start_utc,end_utc,duration_h,root_cause';

export function renderCyclesCsv(result: GenerationResult): string {
  const lines = result.cycles.map(
    (c) =>
      [
        c.cycle_id,
        c.scenario_id,
        c.truck_id,
        c.shovel_id,
        c.load_zone,
        c.dump_zone,
        c.timestamp_utc,
        fmt(c.load_min),
        fmt(c.haul_min),
        fmt(c.dump_min),
        fmt(c.queue_min),
        fmt(c.return_min),
        fmt(c.payload_t),
        c.material,
      ].join(','),
  );
  return [CYCLE_HEADER, ...lines].join('\n') + '\n';
}

export function renderFleetEventsCsv(result: GenerationResult): string {
  const lines = result.fleetEvents.map(
    (e) =>
      [
        e.event_id,
        e.truck_id,
        e.event_type,
        e.start_utc,
        e.end_utc,
        fmt(e.duration_h),
        e.root_cause,
      ].join(','),
  );
  return [EVENT_HEADER, ...lines].join('\n') + '\n';
}

export function renderFleetStateJson(result: GenerationResult): string {
  return JSON.stringify(result.fleetState, null, 2) + '\n';
}

export function renderConfigJson(result: GenerationResult): string {
  return JSON.stringify(result.config, null, 2) + '\n';
}

export function writeSeedBundle(outDir: string, result: GenerationResult): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'config.json'), renderConfigJson(result), 'utf8');
  writeFileSync(join(outDir, 'cycles.csv'), renderCyclesCsv(result), 'utf8');
  writeFileSync(join(outDir, 'fleet_events.csv'), renderFleetEventsCsv(result), 'utf8');
  writeFileSync(join(outDir, 'fleet_state.json'), renderFleetStateJson(result), 'utf8');
}

export function bundleSha256(result: GenerationResult): string {
  const payload =
    renderConfigJson(result) +
    renderCyclesCsv(result) +
    renderFleetEventsCsv(result) +
    renderFleetStateJson(result);
  return createHash('sha256').update(payload, 'utf8').digest('hex');
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(3);
}
