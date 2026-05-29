import { Component } from '@angular/core';

@Component({
  selector: 'app-synthetic-data-disclaimer',
  standalone: true,
  template: `
    <footer class="disclaimer" role="contentinfo">
      <p>
        <strong>Synthetic data.</strong>
        All mine sites, fleets, and KPIs in this portfolio are illustrative unless
        explicitly labelled otherwise. Outputs are for method demonstration — not
        operational advice or vendor benchmarks.
      </p>
    </footer>
  `,
  styles: `
    .disclaimer {
      margin-top: auto;
      padding: 0.85rem 1rem;
      border-top: 1px solid var(--border);
      background: rgba(196, 92, 0, 0.08);
      font-size: 0.82rem;
      color: var(--muted);
    }

    .disclaimer strong {
      color: var(--warn);
    }

    .disclaimer p {
      margin: 0;
      max-width: 52rem;
    }
  `,
})
export class SyntheticDataDisclaimerComponent {}
