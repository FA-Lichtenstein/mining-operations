/** Haulage DES workbench — panels A–D, compare, IndexedDB, JSON export (PR 4). */
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SyntheticDataDisclaimerComponent } from '../../shared/synthetic-data-disclaimer/synthetic-data-disclaimer.component';
import { WorkbenchLayoutComponent } from '../../shared/workbench-layout/workbench-layout.component';
import { HaulageChartsPanelComponent } from './components/haulage-charts-panel.component';
import { HaulageCompareBarComponent } from './components/haulage-compare-bar.component';
import { HaulageControlsPanelComponent } from './components/haulage-controls-panel.component';
import { HaulageMetricsPanelComponent } from './components/haulage-metrics-panel.component';
import { HaulageSimSchematicComponent } from './components/haulage-sim-schematic.component';
import { HaulageWorkbenchService } from './services/haulage-workbench.service';

@Component({
  selector: 'app-haulage-des-shell',
  standalone: true,
  imports: [
    WorkbenchLayoutComponent,
    RouterLink,
    SyntheticDataDisclaimerComponent,
    HaulageControlsPanelComponent,
    HaulageSimSchematicComponent,
    HaulageChartsPanelComponent,
    HaulageMetricsPanelComponent,
    HaulageCompareBarComponent,
  ],
  template: `
    <nav class="demo-nav">
      <a routerLink="/">← Gallery</a>
    </nav>

    <app-synthetic-data-disclaimer />

    <app-workbench-layout
      title="Haulage discrete-event simulation"
      subtitle="syn-pgm-bushveld-01 · truck-shovel vs K-Tec scraper train · role-based DES workbench"
      controlsLabel="Panel A — Scenario & fleet controls"
      simulationLabel="Panel B — Load–haul–dump schematic"
      chartsLabel="Panel C — Queue & throughput charts"
      metricsLabel="Panel D — KPI cards & superintendent summary"
    >
      <app-haulage-controls-panel workbenchControls />
      <app-haulage-sim-schematic workbenchSimulation />
      <app-haulage-charts-panel workbenchCharts />
      <app-haulage-metrics-panel workbenchMetrics />
    </app-workbench-layout>

    <app-haulage-compare-bar />
  `,
  styles: `
    .demo-nav {
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    app-synthetic-data-disclaimer {
      display: block;
      margin-bottom: 0.75rem;
    }
  `,
})
export class HaulageDesShellComponent implements OnInit {
  private readonly wb = inject(HaulageWorkbenchService);

  ngOnInit(): void {
    void this.wb.init();
  }
}
