import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { GenTruckCycleConfig } from '../../../shared/domain/haulage';

const SEED_ROOT = join(
  process.cwd(),
  'src/assets/seeds/syn-pgm-bushveld-01/gen-truck-cycle',
);

export function seedConfigPath(scenarioId: string): string {
  return join(SEED_ROOT, `v1.0.0-${scenarioId}`, 'config.json');
}

export function loadSeedConfig(scenarioId: string): GenTruckCycleConfig {
  const raw = readFileSync(seedConfigPath(scenarioId), 'utf8');
  return JSON.parse(raw) as GenTruckCycleConfig;
}
