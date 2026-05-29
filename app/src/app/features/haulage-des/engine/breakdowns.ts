import type { GenTruckCycleConfig } from '../../../shared/domain/haulage';
import { sampleExponentialHours } from './distributions';
import type { Rng } from './rng';

export type BreakdownInterval = { startMin: number; endMin: number };

export function scheduleBreakdownsForShift(
  config: GenTruckCycleConfig,
  rng: Rng,
  haulUnitIds: string[],
  shiftStartMin: number,
  shiftEndMin: number,
): Map<string, BreakdownInterval[]> {
  const map = new Map<string, BreakdownInterval[]>();
  const mtbf = config.cycle_distributions.breakdown_mtbf_hours;
  const mttr = config.cycle_distributions.breakdown_mttr_hours;
  const mttrMin = mttr * 60;

  for (const id of haulUnitIds) {
    const intervals: BreakdownInterval[] = [];
    let cursor = shiftStartMin + sampleExponentialHours(rng, mtbf) * 60;

    while (cursor < shiftEndMin) {
      const endMin = Math.min(cursor + mttrMin, shiftEndMin);
      intervals.push({ startMin: cursor, endMin });
      cursor += sampleExponentialHours(rng, mtbf) * 60 + mttrMin;
    }

    map.set(id, intervals);
  }

  return map;
}

export function activeBreakdown(
  intervals: BreakdownInterval[] | undefined,
  timeMin: number,
): BreakdownInterval | undefined {
  return intervals?.find((b) => timeMin >= b.startMin && timeMin < b.endMin);
}
