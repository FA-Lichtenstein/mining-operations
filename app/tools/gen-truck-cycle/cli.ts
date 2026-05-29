import { readFileSync } from 'node:fs';
import { bundleSha256, writeSeedBundle } from './emit.js';
import { generateTruckCycleSeed } from './generator.js';
import { scenarioConfigPath, seedOutputDir } from './paths.js';
import type { GenTruckCycleConfig } from './types.js';
import { validateGeneration } from './validate.js';

const DEFAULT_SCENARIOS = ['truck_shovel', 'scraper_train'] as const;

function loadConfig(scenarioId: string): GenTruckCycleConfig {
  const raw = readFileSync(scenarioConfigPath(scenarioId), 'utf8');
  return JSON.parse(raw) as GenTruckCycleConfig;
}

function main(): void {
  const scenarios = process.argv.slice(2).length
    ? process.argv.slice(2)
    : [...DEFAULT_SCENARIOS];

  for (const scenarioId of scenarios) {
    const config = loadConfig(scenarioId);
    const result = generateTruckCycleSeed(config);
    const errors = validateGeneration(result);
    if (errors.length > 0) {
      console.error(`Validation failed for ${scenarioId}:`);
      for (const e of errors) {
        console.error(`  - ${e}`);
      }
      process.exitCode = 1;
      continue;
    }

    const outDir = seedOutputDir(scenarioId);
    writeSeedBundle(outDir, result);
    const hash = bundleSha256(result);
    console.log(`Wrote ${outDir}`);
    console.log(`  cycles: ${result.cycles.length}, events: ${result.fleetEvents.length}`);
    console.log(`  bundle sha256: ${hash}`);
  }

  if (process.exitCode === 1) {
    process.exit(1);
  }
}

main();
