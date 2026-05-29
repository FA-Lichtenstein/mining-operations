import { describe, expect, it } from 'vitest';
import { goraiFleetSanityHint } from './gorai-sanity';
import { loadSeedConfig } from './load-seed-config';
import { matchFactorNh, operatingEfficiency } from './kpi';
import { runDesSimulation } from './simulator';

import golden from './golden-kpis.json' with { type: 'json' };

const SCENARIOS = ['truck_shovel', 'scraper_train'] as const;

describe('haulage DES engine', () => {
  describe('KPI formulas', () => {
    it('matchFactorNh = full haul cycle / loader service time', () => {
      expect(matchFactorNh(12, 4)).toBe(3);
      expect(matchFactorNh(0, 4)).toBe(0);
    });

    it('operatingEfficiency E = A × U', () => {
      expect(operatingEfficiency(0.9, 0.8)).toBeCloseTo(0.72);
      expect(operatingEfficiency(0, 0.8)).toBe(0);
    });
  });

  for (const scenarioId of SCENARIOS) {
    describe(scenarioId, () => {
      it('produces deterministic KPIs for seed config (1 shift)', () => {
        const config = loadSeedConfig(scenarioId);
        const a = runDesSimulation(config, { shiftCount: 1 }).kpis;
        const b = runDesSimulation(config, { shiftCount: 1 }).kpis;
        expect(a).toEqual(b);
        expect(a.cycles_completed).toBeGreaterThan(0);
        expect(a.tonnes_per_shift).toBeGreaterThan(0);
        expect(golden[scenarioId]).toBeDefined();
        expect(kpiFingerprint(a)).toBe(golden[scenarioId]);
      });

      it('Gorai sanity hint flags over-fleet truck_shovel only when applicable', () => {
        const config = loadSeedConfig(scenarioId);
        const hint = goraiFleetSanityHint(config);
        expect(hint.implied_trucks_Nh).toBeGreaterThan(0);
        expect(hint.configured_haul_units).toBe(config.fleet.haul_unit_count);
      });
    });
  }

  it('raises average queue wait when fleet is oversized vs loaders', () => {
    const base = loadSeedConfig('truck_shovel');
    const balanced = runDesSimulation(
      { ...base, seed: 4242, fleet: { ...base.fleet, haul_unit_count: 4 } },
      { shiftCount: 1 },
    ).kpis;
    const oversized = runDesSimulation(
      { ...base, seed: 4242, fleet: { ...base.fleet, haul_unit_count: 24 } },
      { shiftCount: 1 },
    ).kpis;
    expect(oversized.avg_loader_queue_wait_min).toBeGreaterThan(balanced.avg_loader_queue_wait_min);
    expect(oversized.loader_idle_percent).toBeLessThan(balanced.loader_idle_percent);
  });

  it('computes recommended haul units from full cycle time, not load-time ratio', () => {
    const config = loadSeedConfig('truck_shovel');
    const result = runDesSimulation(config, { shiftCount: 1 });
    const avgLoadMin =
      result.cycles.reduce((sum, cycle) => sum + cycle.load_min, 0) / result.cycles.length;
    const oldLoadOnlyRatio = result.kpis.avg_loader_service_time_min / avgLoadMin;

    expect(result.cycles.some((cycle) => cycle.dump_queue_wait_min > 0)).toBe(true);
    expect(result.kpis.recommended_haul_units_Nh).toBeCloseTo(
      result.kpis.avg_haul_cycle_time_min / result.kpis.avg_loader_service_time_min,
      3,
    );
    expect(result.kpis.recommended_haul_units_Nh).toBeGreaterThan(oldLoadOnlyRatio);
  });

  it('progress callback reaches 100', () => {
    const config = loadSeedConfig('scraper_train');
    const pcts: number[] = [];
    runDesSimulation(config, {
      shiftCount: 1,
      progressEveryCycles: 5,
      onProgress: (pct) => pcts.push(pct),
    });
    expect(pcts.length).toBeGreaterThan(0);
    expect(pcts[pcts.length - 1]).toBe(100);
  });
});

function kpiFingerprint(kpis: {
  tonnes_per_shift: number;
  avg_cycle_time_min: number;
  avg_queue_wait_min: number;
  avg_dump_queue_wait_min: number;
  recommended_haul_units_Nh: number;
  fleet_match_ratio: number;
  loader_idle_percent: number;
  haul_unit_utilization_percent: number;
  cycles_completed: number;
}): string {
  return [
    kpis.cycles_completed,
    kpis.tonnes_per_shift,
    kpis.avg_cycle_time_min,
    kpis.avg_queue_wait_min,
    kpis.avg_dump_queue_wait_min,
    kpis.loader_idle_percent,
    kpis.haul_unit_utilization_percent,
    kpis.recommended_haul_units_Nh,
    kpis.fleet_match_ratio,
  ].join('|');
}
