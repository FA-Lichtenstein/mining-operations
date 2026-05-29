import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { buildSuperintendentSummary } from '../haulage-superintendent-summary';
import type { HaulageScenarioId } from '../haulage-scenario';
import { HaulageWorkbenchService } from '../services/haulage-workbench.service';

@Component({
  selector: 'app-haulage-metrics-panel',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    @if (kpis(); as k) {
      <div class="kpi-grid">
        <article class="kpi-card" title="Completed payload moved during each synthetic shift.">
          <span class="kpi-label">Did material move?</span>
          <strong>{{ k.tonnes_per_shift | number: '1.0-0' }}</strong>
          <p>Tonnes per synthetic shift.</p>
        </article>
        <article class="kpi-card" title="Average completed load-haul-dump-return cycle time.">
          <span class="kpi-label">How long was a cycle?</span>
          <strong>{{ k.avg_cycle_time_min | number: '1.1-1' }} min</strong>
          <p>Full completed cycle, including modeled queue waits.</p>
        </article>
        <article class="kpi-card" title="Actual simulated wait before a haul unit enters loader service.">
          <span class="kpi-label">Did the loader queue?</span>
          <strong>{{ k.avg_loader_queue_wait_min | number: '1.2-2' }} min</strong>
          <p>Average FIFO wait at the load point.</p>
        </article>
        <article
          class="kpi-card"
          title="SME-style truck count: full haul cycle time divided by loader service time."
        >
          <span class="kpi-label">How many haul units fit?</span>
          <strong>{{ k.recommended_haul_units_Nh | number: '1.2-2' }}</strong>
          <p>N<sub>h</sub> uses full cycle time, not only loading time.</p>
        </article>
        <article
          class="kpi-card"
          title="Configured haul units divided by recommended haul units; values far above 1 can create queues."
        >
          <span class="kpi-label">Is the fleet matched?</span>
          <strong>{{ k.fleet_match_ratio | number: '1.2-2' }}</strong>
          <p>Above 1 is more fleet than the cycle-service match suggests.</p>
        </article>
        <article class="kpi-card" title="Share of scheduled time the haul fleet is mechanically ready.">
          <span class="kpi-label">Was the fleet available?</span>
          <strong>{{ k.availability | number: '1.2-2' }}</strong>
          <p>Availability is readiness, separate from productive use.</p>
        </article>
        <article class="kpi-card" title="Share of available haul-unit time spent in modeled productive activity.">
          <span class="kpi-label">Was available time used?</span>
          <strong>{{ k.haul_unit_utilization_percent | number: '1.0-0' }}%</strong>
          <p>High utilisation helps only if queues stay controlled.</p>
        </article>
        <article class="kpi-card" title="Operating efficiency, E = availability times utilisation.">
          <span class="kpi-label">What is E = A × U?</span>
          <strong>{{ k.operating_efficiency_E | number: '1.2-2' }}</strong>
          <p>Combines mechanical readiness with productive use.</p>
        </article>
      </div>

      <details class="anatomy">
        <summary>Cycle anatomy (illustrative)</summary>
        <p>
          Queue → spot/load → haul loaded → queue at dump → dump/eject → return empty. See
          <strong>Background / Study</strong> for N<sub>h</sub>, E = A×U, stochastic queues, and
          illustrative K-Tec hypotheses.
        </p>
      </details>

      @if (summary(); as s) {
        <section class="super-summary">
          <h4>Technical Services superintendent summary</h4>
          <p class="interpretation">{{ s.interpretation }}</p>
          <p class="bottleneck"><strong>Bottleneck:</strong> {{ s.bottleneck }}</p>
          <ul>
            @for (item of s.followUps; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        </section>
      }
    } @else {
      <p class="placeholder">KPI cards populate when a DES run completes.</p>
    }
  `,
  styles: `
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.4rem;
      margin-bottom: 0.65rem;
    }

    .kpi-card {
      padding: 0.45rem 0.55rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.2);
    }

    .kpi-label {
      display: block;
      font-size: 0.72rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .kpi-card strong {
      display: block;
      margin-top: 0.15rem;
      font-size: 1rem;
      color: var(--text);
    }

    .kpi-card p {
      margin: 0.2rem 0 0;
      font-size: 0.72rem;
      line-height: 1.35;
      color: var(--muted);
    }

    .anatomy {
      margin: 0.5rem 0;
      font-size: 0.85rem;
      color: var(--muted);
    }

    .anatomy summary {
      cursor: pointer;
      color: var(--accent);
      font-size: 0.82rem;
    }

    .super-summary {
      margin-top: 0.65rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border);
    }

    .super-summary h4 {
      margin: 0 0 0.35rem;
      font-size: 0.85rem;
      color: var(--accent);
    }

    .bottleneck {
      margin: 0 0 0.35rem;
      font-size: 0.88rem;
    }

    .interpretation {
      margin: 0 0 0.45rem;
      font-size: 0.9rem;
      line-height: 1.45;
    }

    .super-summary ul {
      margin: 0;
      padding-left: 1.1rem;
      font-size: 0.82rem;
      color: var(--muted);
    }

    .placeholder {
      margin: 0;
      color: var(--muted);
    }

    @media (max-width: 700px) {
      .kpi-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `,
})
export class HaulageMetricsPanelComponent {
  private readonly wb = inject(HaulageWorkbenchService);

  protected readonly kpis = computed(() => this.wb.lastRun()?.kpis ?? null);

  protected readonly summary = computed(() => {
    const k = this.kpis();
    const cfg = this.wb.config();
    if (!k || !cfg) {
      return null;
    }
    return buildSuperintendentSummary(k, cfg.site.scenario_id as HaulageScenarioId);
  });

}
