import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOL_DIR = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(TOOL_DIR, '..', '..');

export const SCENARIOS_DIR = join(TOOL_DIR, 'scenarios');

export function seedOutputDir(scenarioId: string): string {
  return join(
    APP_ROOT,
    'src',
    'assets',
    'seeds',
    'syn-pgm-bushveld-01',
    'gen-truck-cycle',
    `v1.0.0-${scenarioId}`,
  );
}

export function scenarioConfigPath(scenarioId: string): string {
  return join(SCENARIOS_DIR, `${scenarioId}.json`);
}
