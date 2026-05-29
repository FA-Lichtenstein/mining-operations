/// <reference lib="webworker" />

import type { GenTruckCycleConfig } from '../../shared/domain/haulage';
import { runDesSimulation } from './engine/simulator';
import type { DesKpis, DesRunOptions } from './engine/types';

export type HaulageDesWorkerRequest = {
  type: 'run';
  config: GenTruckCycleConfig;
  options?: DesRunOptions;
};

export type HaulageDesWorkerProgress = {
  type: 'progress';
  pct: number;
};

export type HaulageDesWorkerComplete = {
  type: 'complete';
  kpis: DesKpis;
};

export type HaulageDesWorkerResponse = HaulageDesWorkerProgress | HaulageDesWorkerComplete;

addEventListener('message', (event: MessageEvent<HaulageDesWorkerRequest>) => {
  const msg = event.data;
  if (msg.type !== 'run') {
    return;
  }

  const result = runDesSimulation(msg.config, {
    ...msg.options,
    onProgress: (pct) => {
      const progress: HaulageDesWorkerProgress = { type: 'progress', pct };
      postMessage(progress);
    },
  });

  const complete: HaulageDesWorkerComplete = { type: 'complete', kpis: result.kpis };
  postMessage(complete);
});
