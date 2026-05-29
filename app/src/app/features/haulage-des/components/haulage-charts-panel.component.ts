import { Component, computed, inject } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { echarts } from '../haulage-echarts';
import {
  buildCycleTimeHistogram,
  buildQueueDepthSeries,
  buildThroughputByShift,
} from '../haulage-chart-data';
import { HaulageWorkbenchService } from '../services/haulage-workbench.service';

@Component({
  selector: 'app-haulage-charts-panel',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  template: `
    @if (hasData()) {
      <div class="chart-grid">
        <div class="chart-cell">
          <h4>Queue depth proxy</h4>
          <div echarts [options]="queueOptions()" class="chart"></div>
        </div>
        <div class="chart-cell">
          <h4>Throughput by shift</h4>
          <div echarts [options]="throughputOptions()" class="chart"></div>
        </div>
        <div class="chart-cell full">
          <h4>Cycle time distribution</h4>
          <div echarts [options]="cycleHistOptions()" class="chart"></div>
        </div>
      </div>
    } @else {
      <p class="placeholder">Run DES to populate queue, throughput, and cycle-time charts.</p>
    }
  `,
  styles: `
    .chart-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }

    .chart-cell h4 {
      margin: 0 0 0.25rem;
      font-size: 0.78rem;
      color: var(--muted);
      font-weight: 500;
    }

    .chart {
      height: 180px;
      width: 100%;
    }

    .chart-cell.full {
      grid-column: 1 / -1;
    }

    .placeholder {
      margin: 0;
      color: var(--muted);
      font-size: 0.88rem;
    }

    @media (max-width: 700px) {
      .chart-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class HaulageChartsPanelComponent {
  private readonly wb = inject(HaulageWorkbenchService);

  protected readonly hasData = computed(() => (this.wb.lastRun()?.cycles.length ?? 0) > 0);

  protected readonly queueOptions = computed(() => {
    const run = this.wb.lastRun();
    if (!run?.cycles.length) {
      return {};
    }
    return buildQueueDepthSeries(run.cycles);
  });

  protected readonly throughputOptions = computed(() => {
    const run = this.wb.lastRun();
    const cfg = this.wb.config();
    if (!run?.cycles.length || !cfg) {
      return {};
    }
    return buildThroughputByShift(run.cycles, cfg.site.shift_hours);
  });

  protected readonly cycleHistOptions = computed(() => {
    const run = this.wb.lastRun();
    if (!run?.cycles.length) {
      return {};
    }
    return buildCycleTimeHistogram(run.cycles);
  });
}
