/** PR2 seeds: `assets/seeds/syn-pgm-bushveld-01/gen-truck-cycle/v1.0.0-truck_shovel` | `…-scraper_train`. */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkbenchLayoutComponent } from '../../shared/workbench-layout/workbench-layout.component';

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
      subtitle="syn-pgm-bushveld-01 · truck-shovel vs scraper-train (shell — DES in PR 3–4)"
      controlsLabel="Panel A — Scenario & fleet controls"
      simulationLabel="Panel B — Load–haul–dump schematic"
      chartsLabel="Panel C — Queue & throughput charts"
      metricsLabel="Panel D — KPI cards & superintendent summary"
    >
      <p workbenchControls>
        Placeholder: scenario picker, seed selector, fleet and shift controls, run / reset /
        clone (PR 4).
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
  `,
})
export class HaulageDesShellComponent {}
