import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="about">
      <h1>About this portfolio</h1>

      <p class="lead">
        Public showcase of operations-research applications in mine planning — discrete-event
        simulation, optimisation, and decision-support prototypes built for technical planning
        roles in South African mining contexts.
      </p>

      <h2>Positioning</h2>
      <p>
        Each demo is a self-contained Angular module with browser-side compute (Web Workers,
        local persistence) and synthetic seed data. The work extends a broader DES/ABS
        portfolio toward mining fleet KPIs: match factor, cycle time, queueing, and throughput
        trade-offs — complementary to general-purpose simulation sites such as
        <a href="https://integraldecision.com" target="_blank" rel="noopener noreferrer"
          >integraldecision.com</a
        >.
      </p>

      <h2>Role-based framing</h2>
      <p>
        Scenarios are narrated from official mine roles — for example, a Technical Services
        superintendent posing a haulage question and a Quantitative Planning Analyst preparing
        the analysis. No fictional character names appear in copy, seeds, or documentation.
      </p>

      <h2>Synthetic data policy</h2>
      <p>
        Demo sites such as <code>syn-pgm-bushveld-01</code> are fully synthetic. Fleet sizes,
        cycle parameters, and K-Tec scraper assumptions are illustrative — not vendor benchmarks
        or operational forecasts. See the footer disclaimer on every page.
      </p>

      <h2>Repository &amp; background</h2>
      <p>
        Source and planning artifacts live in the
        <a
          href="https://github.com/FA-Lichtenstein/mining-operations"
          target="_blank"
          rel="noopener noreferrer"
          >mining-operations</a
        >
        GitHub repository. Planning briefs under <code>planning/</code> document theme taxonomy
        (T1–T6), method references, and CV alignment for Ukwazi-style quantitative planning work.
      </p>

      <p>
        <a class="btn" routerLink="/">← Back to gallery</a>
      </p>
    </article>
  `,
  styles: `
    .about {
      max-width: 42rem;
    }

    h1 {
      margin: 0 0 0.75rem;
      font-size: 1.75rem;
      color: var(--accent);
    }

    h2 {
      font-size: 1.1rem;
      margin: 1.5rem 0 0.5rem;
      color: var(--text);
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.2rem;
    }

    .lead {
      font-size: 1.02rem;
      color: var(--muted);
    }

    p {
      margin: 0 0 0.85rem;
      font-size: 0.95rem;
    }

    code {
      font-family: ui-monospace, Consolas, monospace;
      font-size: 0.88em;
      background: var(--bg-panel);
      border: 1px solid var(--border);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
    }
  `,
})
export class AboutComponent {}
