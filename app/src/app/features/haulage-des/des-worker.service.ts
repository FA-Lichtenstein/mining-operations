import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import type { GenTruckCycleConfig } from '../../shared/domain/haulage';
import type { DesCycleRecord, DesKpis, DesRunOptions } from './engine/types';
import type {
  HaulageDesWorkerRequest,
  HaulageDesWorkerResponse,
} from './haulage-des.worker';

export type DesWorkerRunEvent =
  | { kind: 'progress'; pct: number }
  | { kind: 'complete'; kpis: DesKpis; cycles: DesCycleRecord[] };

@Injectable({ providedIn: 'root' })
export class DesWorkerService implements OnDestroy {
  private worker: Worker | null = null;

  ngOnDestroy(): void {
    this.terminate();
  }

  run(config: GenTruckCycleConfig, options?: DesRunOptions): Observable<DesWorkerRunEvent> {
    const subject = new Subject<DesWorkerRunEvent>();
    this.terminate();

    const worker = new Worker(new URL('./haulage-des.worker', import.meta.url), { type: 'module' });
    this.worker = worker;

    worker.onmessage = (event: MessageEvent<HaulageDesWorkerResponse>) => {
      const msg = event.data;
      if (msg.type === 'progress') {
        subject.next({ kind: 'progress', pct: msg.pct });
      } else if (msg.type === 'complete') {
        subject.next({ kind: 'complete', kpis: msg.kpis, cycles: msg.cycles });
        subject.complete();
        this.terminate();
      }
    };

    worker.onerror = (err) => {
      subject.error(err);
      this.terminate();
    };

    const request: HaulageDesWorkerRequest = { type: 'run', config, options };
    worker.postMessage(request);

    return subject.asObservable();
  }

  terminate(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}
