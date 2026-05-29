import { Component, input } from '@angular/core';
import {
  citationHref,
  HAULAGE_CITATIONS,
  type HaulageCitation,
} from '../content/citations';

@Component({
  selector: 'app-haulage-citation-chips',
  standalone: true,
  template: `
    @if (ids().length) {
      <div class="citation-row" role="list" aria-label="Planning sources">
        @for (c of resolved(); track c.id) {
          <a
            class="cite-chip"
            role="listitem"
            [href]="href(c)"
            target="_blank"
            rel="noopener noreferrer"
            [title]="c.detail"
          >
            {{ c.shortLabel }}
          </a>
        }
      </div>
    }
  `,
  styles: `
    .citation-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.5rem;
    }

    .cite-chip {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      border: 1px solid var(--accent-dim);
      background: rgba(126, 184, 218, 0.1);
      color: var(--accent);
      text-decoration: none;
    }

    .cite-chip:hover {
      background: rgba(126, 184, 218, 0.2);
      color: #a8d4f0;
    }
  `,
})
export class HaulageCitationChipsComponent {
  readonly ids = input<string[]>([]);

  protected resolved(): HaulageCitation[] {
    return this.ids()
      .map((id) => HAULAGE_CITATIONS[id])
      .filter((c): c is HaulageCitation => !!c);
  }

  protected href(c: HaulageCitation): string {
    return citationHref(c);
  }
}
