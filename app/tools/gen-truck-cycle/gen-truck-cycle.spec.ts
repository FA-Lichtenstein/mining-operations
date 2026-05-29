import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { bundleSha256 } from './emit.js';
import { generateTruckCycleSeed } from './generator.js';
import { loadScenarioConfig } from './load-config.js';
import { seedOutputDir } from './paths.js';
import { validateGeneration } from './validate.js';

import golden from './golden-hashes.json' with { type: 'json' };

const SCENARIOS = ['truck_shovel', 'scraper_train'] as const;

describe('gen-truck-cycle', () => {
  for (const scenarioId of SCENARIOS) {
    describe(scenarioId, () => {
      it('produces deterministic bundle hash', () => {
        const config = loadScenarioConfig(scenarioId);
        const a = bundleSha256(generateTruckCycleSeed(config));
        const b = bundleSha256(generateTruckCycleSeed(config));
        expect(a).toBe(b);
        expect(a).toBe(golden[scenarioId]);
      });

      it('passes validation rules', () => {
        const result = generateTruckCycleSeed(loadScenarioConfig(scenarioId));
        const errors = validateGeneration(result);
        expect(errors, errors.join('\n')).toEqual([]);
      });

      it('matches checked-in seed files when present', () => {
        const result = generateTruckCycleSeed(loadScenarioConfig(scenarioId));
        const dir = seedOutputDir(scenarioId);
        const hash = bundleSha256(result);
        const onDisk = readFileSync(join(dir, 'config.json'), 'utf8');
        expect(onDisk.length).toBeGreaterThan(0);
        expect(hash).toBe(golden[scenarioId]);
      });
    });
  }
});
