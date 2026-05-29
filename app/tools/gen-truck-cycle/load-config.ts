import { readFileSync } from 'node:fs';
import { scenarioConfigPath } from './paths.js';
import type { GenTruckCycleConfig } from './types.js';

export function loadScenarioConfig(scenarioId: string): GenTruckCycleConfig {
  const raw = readFileSync(scenarioConfigPath(scenarioId), 'utf8');
  return JSON.parse(raw) as GenTruckCycleConfig;
}
