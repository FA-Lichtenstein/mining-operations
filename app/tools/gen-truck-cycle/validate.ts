import type { GenerationResult } from './types.js';

const TONNAGE_BAND = 0.15;

export function validateGeneration(result: GenerationResult): string[] {
  const errors: string[] = [];

  for (const c of result.cycles) {
    if (c.load_min <= 0 || c.haul_min <= 0 || c.dump_min <= 0 || c.return_min <= 0) {
      errors.push(`${c.cycle_id}: phase times must be positive`);
    }
    if (c.queue_min < 0) {
      errors.push(`${c.cycle_id}: queue_min must be non-negative`);
    }
    if (c.payload_t <= 0 || c.payload_t > result.config.fleet.payload_t * 1.05) {
      errors.push(`${c.cycle_id}: payload_t out of range for fleet nominal`);
    }
  }

  for (const snap of result.fleetState.snapshots) {
    const target = snap.shift_tons_target;
    const actual = snap.shift_tons_actual;
    const breakdownHeavy = snap.trucks_down >= Math.ceil(snap.trucks_total * 0.25);
    const low = target * (1 - TONNAGE_BAND);
    const high = target * (1 + TONNAGE_BAND);
    if (!breakdownHeavy && (actual < low || actual > high)) {
      errors.push(
        `${snap.shift_id}: shift_tons_actual ${actual} outside ±15% of target ${target} (no major breakdowns)`,
      );
    }
  }

  if (result.cycles.length === 0) {
    errors.push('no cycles generated');
  }

  return errors;
}
