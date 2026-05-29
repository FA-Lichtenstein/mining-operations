/** Haulage DES notebook route — article flow, controls, compare, IndexedDB, JSON export. */
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HaulageChartsPanelComponent } from './components/haulage-charts-panel.component';
import { HaulageCompareBarComponent } from './components/haulage-compare-bar.component';
import { HaulageContextToolbarComponent } from './components/haulage-context-toolbar.component';
import { HaulageControlsPanelComponent } from './components/haulage-controls-panel.component';
import { HaulageMetricsPanelComponent } from './components/haulage-metrics-panel.component';
import { HaulagePresenterPanelComponent } from './components/haulage-presenter-panel.component';
import { HaulageSimSchematicComponent } from './components/haulage-sim-schematic.component';
import { HaulageStudyDrawerComponent } from './components/haulage-study-drawer.component';
import { HaulageWorkbenchService } from './services/haulage-workbench.service';

@Component({
  selector: 'app-haulage-des-shell',
  standalone: true,
  imports: [
    RouterLink,
    HaulageControlsPanelComponent,
    HaulageSimSchematicComponent,
    HaulageChartsPanelComponent,
    HaulageMetricsPanelComponent,
    HaulageCompareBarComponent,
    HaulageContextToolbarComponent,
    HaulageStudyDrawerComponent,
    HaulagePresenterPanelComponent,
  ],
  template: `
    <nav class="demo-nav">
      <a routerLink="/">← Gallery</a>
    </nav>

    <app-haulage-context-toolbar
      [(studyOpen)]="studyOpen"
      [(presenterOpen)]="presenterOpen"
    />

    <app-haulage-study-drawer [open]="studyOpen()" (closed)="studyOpen.set(false)" />

    <app-haulage-presenter-panel
      [open]="presenterOpen()"
      (closed)="presenterOpen.set(false)"
    />

    <article
      class="haulage-notebook"
      [class.sim-busy]="wb.running()"
      aria-labelledby="haulage-notebook-title"
    >
      <header class="hero panel">
        <p class="eyebrow">Notebook demo · syn-pgm-bushveld-01</p>
        <h1 id="haulage-notebook-title">
          Would a different haulage method reduce queueing enough to justify a site-data study?
        </h1>
        <p class="hero-copy">
          This article walks from the operating question to a browser DES run, then compares
          the truck-shovel baseline with an illustrative K-Tec scraper-train scenario. The app
          uses synthetic inputs only, so the result is a modeling demonstration rather than
          operational advice.
        </p>
        <div class="hero-cards" aria-label="Route summary">
          <div>
            <span class="tag">Decision</span>
            <p>Expose queueing and utilisation trade-offs hidden by fixed-average cycles.</p>
          </div>
          <div>
            <span class="tag">Model</span>
            <p>Haul units request constrained resources, wait FIFO, cycle, and aggregate KPIs.</p>
          </div>
          <div>
            <span class="tag">Caveat</span>
            <p>No cost, diesel, water, vendor benchmark, or dispatch-data validation is modeled.</p>
          </div>
        </div>
      </header>

      <section class="article-section panel" aria-labelledby="problem-model-heading">
        <p class="section-kicker">1. Problem and model explanation</p>
        <h2 id="problem-model-heading">Why a deterministic cycle spreadsheet is not enough</h2>
        <p>
          A first-pass spreadsheet can multiply average cycle time, payload, fleet count, and
          shift length. It cannot show two haul units arriving at the loader together, dump
          congestion forming downstream, or the loader sitting idle while every unit is delayed
          elsewhere.
        </p>
        <p>
          The DES keeps the same operational vocabulary but changes the flow. A haul unit asks
          for the loader, waits if the resource is busy, loads, travels, dumps or ejects, returns
          empty, and may be removed by downtime. Completed cycles become the KPIs below.
        </p>
      </section>

      <section class="article-section panel controls-section" aria-labelledby="baseline-heading">
        <div class="section-heading">
          <div>
            <p class="section-kicker">2. Baseline controls and run button</p>
            <h2 id="baseline-heading">Run the synthetic truck-shovel baseline</h2>
          </div>
          <p>
            Adjust only the visible synthetic assumptions, then run the DES. Use the clone
            control to prepare the paired scraper-train comparison without leaving the article.
          </p>
        </div>
        <app-haulage-controls-panel />

        <details class="optional-visual">
          <summary>Cycle animation (optional visual aid)</summary>
          <p>
            This schematic is a progress aid, not simulated event evidence. The queue indicator
            is an animation preview; use the KPI and chart sections for completed-run outputs.
          </p>
          <app-haulage-sim-schematic />
        </details>
      </section>

      <section class="article-section panel" aria-labelledby="results-heading">
        <div class="section-heading">
          <div>
            <p class="section-kicker">3. Results interpretation</p>
            <h2 id="results-heading">Read queues, throughput, cycle time, and utilisation together</h2>
          </div>
          <p>
            After a run, the charts and cards show whether throughput improved at the cost of
            queueing, idle loader time, or an awkward fleet match.
          </p>
        </div>
        <div class="results-grid">
          <app-haulage-charts-panel />
          <app-haulage-metrics-panel />
        </div>
      </section>

      <section class="article-section panel" aria-labelledby="comparison-heading">
        <div class="section-heading">
          <div>
            <p class="section-kicker">4. Scenario comparison</p>
            <h2 id="comparison-heading">Compare the baseline with the scraper-train hypothesis</h2>
          </div>
          <p>
            Save one completed run as A, clone or switch the scenario, run again, and save the
            second result as B. The comparison stays directional until site data replaces the
            synthetic assumptions.
          </p>
        </div>
        <app-haulage-compare-bar />
      </section>

      <section class="article-section panel" aria-labelledby="limitations-heading">
        <p class="section-kicker">5. Limitations and export</p>
        <h2 id="limitations-heading">What this notebook does not claim</h2>
        <p>
          The demo is not an operational forecast, vendor benchmark, cost model, diesel model,
          water model, or material-suitability study. It has not been calibrated against dispatch,
          survey, reconciliation, fleet-management, or maintenance data.
        </p>
        <p>
          Use the JSON export in the comparison section to preserve a completed synthetic run.
          A real study would need dispatch timestamps, payloads, loader service times, dump
          delays, haul-road segments, downtime records, shift rules, and material checks.
        </p>
      </section>
    </article>
  `,
  styles: `
    .demo-nav {
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .haulage-notebook {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .haulage-notebook.sim-busy {
      opacity: 0.92;
      pointer-events: none;
    }

    .haulage-notebook.sim-busy :is(app-haulage-controls-panel) {
      pointer-events: auto;
    }

    .hero,
    .article-section {
      padding: 1rem 1.1rem;
    }

    .hero {
      background:
        linear-gradient(135deg, rgba(126, 184, 218, 0.12), transparent 58%),
        var(--gradient-panel);
    }

    .eyebrow,
    .section-kicker {
      margin: 0 0 0.35rem;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent);
    }

    .hero h1,
    .article-section h2 {
      margin: 0 0 0.55rem;
      color: var(--text);
      line-height: 1.18;
    }

    .hero h1 {
      max-width: 48rem;
      font-size: clamp(1.8rem, 4vw, 3rem);
    }

    .article-section h2 {
      font-size: 1.25rem;
    }

    .hero-copy,
    .article-section p {
      margin: 0 0 0.7rem;
      color: var(--muted);
      font-size: 0.94rem;
    }

    .hero-copy {
      max-width: 50rem;
      font-size: 1rem;
    }

    .hero-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .hero-cards > div {
      padding: 0.8rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.18);
    }

    .hero-cards p,
    .section-heading p,
    .optional-visual p {
      margin-bottom: 0;
    }

    .section-heading {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(14rem, 0.55fr);
      gap: 1rem;
      align-items: start;
      margin-bottom: 0.85rem;
    }

    .controls-section app-haulage-controls-panel {
      display: block;
      max-width: 42rem;
    }

    .optional-visual {
      margin-top: 0.9rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border);
      color: var(--muted);
      font-size: 0.88rem;
    }

    .optional-visual summary {
      cursor: pointer;
      color: var(--accent);
      font-weight: 600;
    }

    .optional-visual app-haulage-sim-schematic {
      display: block;
      margin-top: 0.75rem;
    }

    .results-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
      gap: 1rem;
      align-items: start;
    }

    @media (max-width: 900px) {
      .hero-cards,
      .section-heading,
      .results-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class HaulageDesShellComponent implements OnInit {
  protected readonly wb = inject(HaulageWorkbenchService);

  protected readonly studyOpen = signal(false);
  protected readonly presenterOpen = signal(false);

  ngOnInit(): void {
    void this.wb.init();
  }
}
