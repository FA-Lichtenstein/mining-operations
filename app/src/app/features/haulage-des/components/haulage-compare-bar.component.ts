import { DecimalPipe, SlicePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { HaulageWorkbenchService } from '../services/haulage-workbench.service';

@Component({
  selector: 'app-haulage-compare-bar',
  standalone: true,
  imports: [DecimalPipe, SlicePipe],
  template: `
    <section class="compare-bar" aria-label="Compare runs and persistence">
      <div class="compare-actions">
        <button
          type="button"
          class="btn sm"
          data-testid="haulage-save-a"
          (click)="wb.saveCompareSlot('A')"
          [disabled]="!wb.lastRun()"
        >
          Save as A
        </button>
        <button
          type="button"
          class="btn sm"
          data-testid="haulage-save-b"
          (click)="wb.saveCompareSlot('B')"
          [disabled]="!wb.lastRun()"
        >
          Save as B
        </button>
        <button
          type="button"
          class="btn sm"
          data-testid="haulage-export-json"
          (click)="wb.exportLastRunJson()"
          [disabled]="!wb.lastRun()"
        >
          Export JSON
        </button>
        <label class="btn sm import-label">
          Import JSON
          <input type="file" accept="application/json" (change)="onImport($event)" hidden />
        </label>
      </div>

      @if (wb.compareDelta(); as rows) {
        <table class="delta-table">
          <thead>
            <tr>
              <th>KPI</th>
              <th>Run A</th>
              <th>Run B</th>
              <th>Δ (B−A)</th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track row.label) {
              <tr>
                <td>{{ row.label }}</td>
                <td>{{ row.a | number: '1.1-1' }}{{ row.unit }}</td>
                <td>{{ row.b | number: '1.1-1' }}{{ row.unit }}</td>
                <td
                  [class.improved]="row.tone === 'improved'"
                  [class.worse]="row.tone === 'worse'"
                  [class.context]="row.tone === 'context'"
                  [title]="row.reading"
                >
                  {{ row.delta > 0 ? '+' : '' }}{{ row.delta | number: '1.1-1' }}{{ row.unit }}
                </td>
              </tr>
            }
          </tbody>
        </table>
        <p class="compare-summary">{{ compareInterpretation() }}</p>
        <p class="compare-hint">
          Run A: {{ wb.compareA()?.config?.site?.scenario_id }} · Run B:
          {{ wb.compareB()?.config?.site?.scenario_id }}
        </p>
      } @else {
        <p class="compare-hint">Save two completed runs as A and B to compare KPI deltas in-session.</p>
      }

      @if (wb.savedRuns().length) {
        <details class="saved-runs">
          <summary>IndexedDB saved runs ({{ wb.savedRuns().length }})</summary>
          <ul>
            @for (r of wb.savedRuns(); track r.runId) {
              <li>
                <button type="button" class="linkish" (click)="wb.restoreSavedRun(r)">
                  {{ r.scenarioId }} · {{ r.createdAt | slice: 0 : 16 }} ·
                  {{ r.kpis.throughput_tpd }} t/d
                </button>
              </li>
            }
          </ul>
        </details>
      }
    </section>
  `,
  styles: `
    .compare-bar {
      margin: 1rem 0;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-elevated);
    }

    .compare-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-bottom: 0.5rem;
    }

    .btn.sm {
      padding: 0.3rem 0.6rem;
      font-size: 0.8rem;
    }

    .import-label {
      cursor: pointer;
    }

    .delta-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }

    .delta-table th,
    .delta-table td {
      padding: 0.3rem 0.45rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }

    .delta-table th {
      color: var(--muted);
      font-weight: 500;
    }

    .improved {
      color: #7ed4a0;
    }

    .worse {
      color: #e88;
    }

    .context {
      color: var(--muted);
    }

    .compare-summary {
      margin: 0.55rem 0 0;
      font-size: 0.86rem;
      line-height: 1.45;
    }

    .compare-hint {
      margin: 0.35rem 0 0;
      font-size: 0.78rem;
      color: var(--muted);
    }

    .saved-runs {
      margin-top: 0.5rem;
      font-size: 0.82rem;
    }

    .saved-runs ul {
      margin: 0.25rem 0 0;
      padding: 0;
      list-style: none;
    }

    .linkish {
      background: none;
      border: none;
      color: var(--accent);
      cursor: pointer;
      padding: 0.15rem 0;
      font-size: inherit;
    }
  `,
})
export class HaulageCompareBarComponent {
  protected readonly wb = inject(HaulageWorkbenchService);
  protected readonly compareInterpretation = computed(() => {
    const rows = this.wb.compareDelta();
    const a = this.wb.compareA();
    const b = this.wb.compareB();
    if (!rows || !a || !b) {
      return '';
    }

    const throughput = rows.find((row) => row.label === 'Throughput');
    const loaderWait = rows.find((row) => row.label === 'Loader queue wait');
    const utilisation = rows.find((row) => row.label === 'Haul utilisation');
    const throughputText = throughput
      ? describeDelta(throughput.delta, 't/shift', 'more tonnes', 'fewer tonnes')
      : 'an unknown throughput change';
    const queueText = loaderWait
      ? describeDelta(loaderWait.delta, 'min/cycle', 'more loader waiting', 'less loader waiting')
      : 'an unknown loader-wait change';
    const utilisationText = utilisation
      ? describeDelta(utilisation.delta, 'percentage points', 'higher haul utilisation', 'lower haul utilisation')
      : 'an unknown utilisation change';

    return `Compared with Run A (${a.config.site.scenario_id}), Run B (${b.config.site.scenario_id}) produced ${throughputText}, ${queueText}, and ${utilisationText}. Run B improves the trade-off only where tonnes rise or waits fall; higher utilisation is useful only when queues do not explode. Cost, diesel, water, material suitability, and vendor performance remain unknown.`;
  });

  onImport(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      void this.wb.importRunJson(file);
    }
    input.value = '';
  }
}

function describeDelta(delta: number, unit: string, positiveLabel: string, negativeLabel: string): string {
  if (delta === 0) {
    return `no change in ${positiveLabel.replace('more ', '').replace('higher ', '')}`;
  }
  const label = delta > 0 ? positiveLabel : negativeLabel;
  return `${Math.abs(delta).toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit} ${label}`;
}
