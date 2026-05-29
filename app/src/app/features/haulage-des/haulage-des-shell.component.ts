/** PR2 seeds: `assets/seeds/syn-pgm-bushveld-01/gen-truck-cycle/v1.0.0-truck_shovel` | `…-scraper_train`. */
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkbenchLayoutComponent } from '../../shared/workbench-layout/workbench-layout.component';
import { DesWorkerService } from './des-worker.service';

@Component({
  selector: 'app-haulage-des-shell',
  standalone: true,
  imports: [WorkbenchLayoutComponent, RouterLink],
  template: `
    <nav class="demo-nav">
      <a routerLink="/">← Gallery</a>
    </nav>

    <app-workbench-layout
      title="Haulage discrete-event simulation"
      subtitle="syn-pgm-bushveld-01 · truck-shovel vs scraper-train (DES engine PR 3; workbench PR 4)"
      controlsLabel="Panel A — Scenario & fleet controls"
      simulationLabel="Panel B — Load–haul–dump schematic"
      chartsLabel="Panel C — Queue & throughput charts"
      metricsLabel="Panel D — KPI cards & superintendent summary"
    >
      <p workbenchControls>
        Placeholder: scenario picker, seed selector, fleet and shift controls, run / reset /
        clone (PR 4).
        <button type="button" class="smoke-run" (click)="smokeRun()" [disabled]="smokeBusy()">
          Smoke-run DES worker
        </button>
        @if (smokeKpis()) {
          <span class="smoke-kpis">
            {{ smokeKpis()!.tonnes_per_shift }} t/shift ·
            {{ smokeKpis()!.avg_queue_wait_min }} min queue ·
            {{ smokeKpis()!.cycles_completed }} cycles
          </span>
        }
      </p>
      <p workbenchSimulation>
        Placeholder: D3 haul-cycle map with entity movement and queue state (PR 4).
      </p>
      <p workbenchCharts>
        Placeholder: ECharts queue depth, throughput, and cycle-time views (PR 4).
      </p>
      <p workbenchMetrics>
        Placeholder: throughput, match factor, queue wait, cycle anatomy explainer, role-based
        superintendent summary (PR 4–5).
      </p>
    </app-workbench-layout>
  `,
  styles: `
    .demo-nav {
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    .smoke-run {
      display: block;
      margin-top: 0.5rem;
    }
    .smoke-kpis {
      display: block;
      margin-top: 0.35rem;
      font-size: 0.85rem;
      color: var(--text-muted, #555);
    }
  `,
})
export class HaulageDesShellComponent {
  private readonly desWorker = inject(DesWorkerService);
  protected readonly smokeBusy = signal(false);
  protected readonly smokeKpis = signal<{
    tonnes_per_shift: number;
    avg_queue_wait_min: number;
    cycles_completed: number;
  } | null>(null);

  smokeRun(): void {
    this.smokeBusy.set(true);
    this.smokeKpis.set(null);
    fetch('/assets/seeds/syn-pgm-bushveld-01/gen-truck-cycle/v1.0.0-truck_shovel/config.json')
      .then((r) => r.json())
      .then((config) => {
        this.desWorker.run(config, { shiftCount: 1, progressEveryCycles: 25 }).subscribe({
          next: (ev) => {
            if (ev.kind === 'complete') {
              this.smokeKpis.set({
                tonnes_per_shift: ev.kpis.tonnes_per_shift,
                avg_queue_wait_min: ev.kpis.avg_queue_wait_min,
                cycles_completed: ev.kpis.cycles_completed,
              });
              this.smokeBusy.set(false);
            }
          },
          error: () => this.smokeBusy.set(false),
        });
      })
      .catch(() => this.smokeBusy.set(false));
  }
}
