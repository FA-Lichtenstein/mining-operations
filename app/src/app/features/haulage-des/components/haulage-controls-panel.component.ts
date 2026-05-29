import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HAULAGE_SCENARIOS, type HaulageScenarioId } from '../haulage-scenario';
import { HaulageWorkbenchService } from '../services/haulage-workbench.service';

@Component({
  selector: 'app-haulage-controls-panel',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (wb.loadError()) {
      <p class="error">{{ wb.loadError() }}</p>
    }

    <fieldset class="field-group">
      <legend>Scenario</legend>
      <div class="scenario-row">
        @for (id of scenarioIds; track id) {
          <label class="radio-chip">
            <input
              type="radio"
              name="scenario"
              [value]="id"
              [checked]="wb.scenarioId() === id"
              (change)="selectScenario(id)"
            />
            {{ scenarios[id].label }}
          </label>
        }
      </div>
    </fieldset>

    @if (wb.config(); as cfg) {
      <div class="sliders">
        <label>
          Fleet count ({{ cfg.fleet.haul_unit_count }})
          <input
            type="range"
            min="2"
            max="30"
            [ngModel]="cfg.fleet.haul_unit_count"
            (ngModelChange)="wb.patchFleetCount($event)"
          />
        </label>
        <label>
          Payload (t) — {{ cfg.fleet.payload_t }}
          <input
            type="range"
            min="20"
            max="250"
            [ngModel]="cfg.fleet.payload_t"
            (ngModelChange)="wb.patchPayload($event)"
          />
        </label>
        <label>
          Haul distance (km) — {{ cfg.calibration.haul_distance_km }}
          <input
            type="range"
            min="1"
            max="8"
            step="0.1"
            [ngModel]="cfg.calibration.haul_distance_km"
            (ngModelChange)="wb.patchHaulDistance($event)"
          />
        </label>
        <label>
          Horizon (shifts) — {{ wb.horizonShifts() }}
          <input
            type="range"
            min="1"
            max="30"
            [ngModel]="wb.horizonShifts()"
            (ngModelChange)="wb.horizonShifts.set(+$event)"
          />
        </label>
        <label>
          RNG seed — {{ cfg.seed }}
          <input
            type="number"
            min="1"
            [ngModel]="cfg.seed"
            (ngModelChange)="wb.patchSeed(+$event)"
          />
        </label>
      </div>

      <p class="meta-line">
        <span class="tag">Synthetic</span>
        {{ cfg.fleet.haul_unit_class }} · {{ cfg.zones.load_zone }} → {{ cfg.zones.dump_zone }}
      </p>

      @for (entry of wb.metadataLabels(); track entry[0]) {
        <p class="meta-note">{{ entry[1] }}</p>
      }

      <div class="actions">
        <button type="button" class="btn primary" (click)="wb.runSimulation()" [disabled]="wb.running()">
          {{ wb.running() ? 'Running… ' + wb.progressPct() + '%' : 'Run DES' }}
        </button>
        <button type="button" class="btn" (click)="wb.resetToSeed()" [disabled]="wb.running()">Reset</button>
        <button type="button" class="btn" (click)="cloneOther()" [disabled]="wb.running()">
          Clone → {{ otherLabel }}
        </button>
      </div>
    }
  `,
  styles: `
    .field-group {
      border: none;
      padding: 0;
      margin: 0 0 0.75rem;
    }

    .field-group legend {
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent);
      margin-bottom: 0.35rem;
    }

    .scenario-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }

    .radio-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.55rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .sliders label {
      display: block;
      margin-bottom: 0.55rem;
      font-size: 0.85rem;
      color: var(--text);
    }

    .sliders input[type='range'] {
      width: 100%;
      margin-top: 0.2rem;
    }

    .sliders input[type='number'] {
      width: 5rem;
      margin-left: 0.35rem;
    }

    .meta-line {
      margin: 0.5rem 0 0.25rem;
      font-size: 0.82rem;
      color: var(--muted);
    }

    .meta-note {
      margin: 0.2rem 0;
      font-size: 0.78rem;
      color: var(--muted);
      font-style: italic;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.65rem;
    }

    .btn.primary {
      border-color: var(--accent);
      background: rgba(126, 184, 218, 0.22);
    }

    .error {
      color: var(--warn);
      font-size: 0.85rem;
    }
  `,
})
export class HaulageControlsPanelComponent {
  protected readonly wb = inject(HaulageWorkbenchService);
  protected readonly scenarios = HAULAGE_SCENARIOS;
  protected readonly scenarioIds = Object.keys(HAULAGE_SCENARIOS) as HaulageScenarioId[];

  protected get otherLabel(): string {
    const id = this.wb.scenarioId();
    const other = id === 'truck_shovel' ? 'scraper_train' : 'truck_shovel';
    return HAULAGE_SCENARIOS[other].shortLabel;
  }

  selectScenario(id: HaulageScenarioId): void {
    void this.wb.loadScenario(id);
  }

  cloneOther(): void {
    void this.wb.cloneToOtherScenario();
  }
}
