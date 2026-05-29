import { Component, input } from '@angular/core';

@Component({
  selector: 'app-workbench-layout',
  standalone: true,
  template: `
    <section class="workbench" [attr.aria-label]="title() ?? 'Simulation workbench'">
      @if (title()) {
        <header class="workbench-header">
          <h2>{{ title() }}</h2>
          @if (subtitle()) {
            <p>{{ subtitle() }}</p>
          }
        </header>
      }

      <div class="workbench-grid">
        <div class="panel slot-controls">
          <h3 class="slot-label">{{ controlsLabel() }}</h3>
          <div class="slot-body">
            <ng-content select="[workbenchControls]" />
          </div>
        </div>

        <div class="panel slot-simulation">
          <h3 class="slot-label">{{ simulationLabel() }}</h3>
          <div class="slot-body">
            <ng-content select="[workbenchSimulation]" />
          </div>
        </div>

        <div class="panel slot-charts">
          <h3 class="slot-label">{{ chartsLabel() }}</h3>
          <div class="slot-body">
            <ng-content select="[workbenchCharts]" />
          </div>
        </div>

        <div class="panel slot-metrics">
          <h3 class="slot-label">{{ metricsLabel() }}</h3>
          <div class="slot-body">
            <ng-content select="[workbenchMetrics]" />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .workbench {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .workbench-header h2 {
      margin: 0 0 0.25rem;
      font-size: 1.35rem;
      color: var(--accent);
    }

    .workbench-header p {
      margin: 0;
      color: var(--muted);
      font-size: 0.92rem;
    }

    .workbench-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .slot-label {
      margin: 0 0 0.5rem;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent);
    }

    .slot-body {
      min-height: 8rem;
      color: var(--muted);
      font-size: 0.9rem;
    }

    .panel {
      padding: 0.85rem 1rem;
    }

    @media (max-width: 900px) {
      .workbench-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class WorkbenchLayoutComponent {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly controlsLabel = input('Panel A — Controls');
  readonly simulationLabel = input('Panel B — Simulation');
  readonly chartsLabel = input('Panel C — Charts');
  readonly metricsLabel = input('Panel D — Metrics');
}
