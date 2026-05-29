import type { GenTruckCycleConfig } from '../../shared/domain/haulage';

export type HaulageScenarioId = 'truck_shovel' | 'scraper_train';

export const HAULAGE_MINE_ID = 'syn-pgm-bushveld-01';

export const HAULAGE_SEED_VERSION = 'v1.0.0';

export const HAULAGE_SCENARIOS: Record<
  HaulageScenarioId,
  { label: string; shortLabel: string; configUrl: string }
> = {
  truck_shovel: {
    label: 'Truck–shovel',
    shortLabel: 'Truck',
    configUrl: `/assets/seeds/${HAULAGE_MINE_ID}/gen-truck-cycle/${HAULAGE_SEED_VERSION}-truck_shovel/config.json`,
  },
  scraper_train: {
    label: 'K-Tec scraper train',
    shortLabel: 'Scraper',
    configUrl: `/assets/seeds/${HAULAGE_MINE_ID}/gen-truck-cycle/${HAULAGE_SEED_VERSION}-scraper_train/config.json`,
  },
};

export function otherScenario(id: HaulageScenarioId): HaulageScenarioId {
  return id === 'truck_shovel' ? 'scraper_train' : 'truck_shovel';
}

export function cloneConfig(config: GenTruckCycleConfig): GenTruckCycleConfig {
  return structuredClone(config);
}

export function configHash(config: GenTruckCycleConfig): string {
  const key = JSON.stringify({
    scenario: config.site.scenario_id,
    seed: config.seed,
    fleet: config.fleet,
    haul_km: config.calibration.haul_distance_km,
  });
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  }
  return `h${(h >>> 0).toString(16)}`;
}

export function scaleHaulTimes(config: GenTruckCycleConfig, km: number): void {
  const base = config.calibration.haul_distance_km || 1;
  const ratio = km / base;
  const haul = config.cycle_distributions.haul_time_min;
  const ret = config.cycle_distributions.return_time_min;
  if (haul.dist === 'normal') {
    haul.mean = round2(haul.mean * ratio);
    haul.sd = round2(haul.sd * Math.sqrt(ratio));
  }
  if (ret.dist === 'normal') {
    ret.mean = round2(ret.mean * ratio);
    ret.sd = round2(ret.sd * Math.sqrt(ratio));
  }
  config.calibration.haul_distance_km = km;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
