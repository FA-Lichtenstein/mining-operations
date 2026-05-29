import { Component } from '@angular/core';

@Component({
  selector: 'app-synthetic-data-disclaimer',
  standalone: true,
  template: `
    <aside class="disclaimer" role="note" aria-label="Synthetic data disclaimer">
      <p>
        <strong>Synthetic data.</strong>
        All mine sites, fleets, and KPIs in this portfolio are illustrative unless
        explicitly labelled otherwise. Outputs are for method demonstration — not
        operational advice or vendor benchmarks.
      </p>
    </aside>
  `,
  styles: `
    .disclaimer {
      margin-bottom: 1rem;
      padding: 0.85rem 1rem;
      border: 1px solid rgba(196, 92, 0, 0.35);
      border-radius: 8px;
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
