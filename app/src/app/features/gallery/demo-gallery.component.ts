import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoCatalogService } from '../../core/services/demo-catalog.service';
@Component({
  selector: 'app-demo-gallery',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="gallery">
      <header class="gallery-header">
        <h1>Mining operations portfolio</h1>
        <p>
          Interactive operations-research demos for mine planning, haulage, and
          decision support — built with Angular and browser-side compute.
        </p>
      </header>

      @if (catalog.error()) {
        <p class="error" role="alert">{{ catalog.error() }}</p>
      } @else if (!catalog.loaded()) {
        <p class="loading">Loading demo catalog…</p>
      } @else {
        <ul class="demo-grid">
          @for (demo of catalog.entries(); track demo.id) {
            <li class="panel demo-card">
              <div class="demo-card-head">
                <h2>{{ demo.title }}</h2>
                <span class="status" [class.live]="demo.status === 'live'">
                  {{ demo.status === 'live' ? 'Live' : 'Coming soon' }}
                </span>
              </div>

              <p class="demo-desc">{{ demo.description }}</p>

              <div class="demo-meta">
                @for (tag of demo.themeTags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
                <span class="mode">{{ demo.presentationMode }}</span>
              </div>

              @if (demo.status === 'live') {
                <a
                  class="btn btn-primary"
                  [routerLink]="demo.route"
                  [attr.data-testid]="demo.id === 'haulage-des' ? 'gallery-haulage-open' : null"
                >
                  Open demo
                </a>
              } @else {
                <span class="btn disabled" aria-disabled="true">Coming soon</span>
              }
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: `
    .gallery-header h1 {
      margin: 0 0 0.5rem;
      font-size: 1.75rem;
    }

    .gallery-header p {
      margin: 0 0 1.5rem;
      color: var(--muted);
      max-width: 40rem;
    }

    .demo-grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .demo-card {
      padding: 1rem 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .demo-card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .demo-card h2 {
      margin: 0;
      font-size: 1.05rem;
      line-height: 1.3;
    }

    .status {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--muted);
      white-space: nowrap;
    }

    .status.live {
      color: var(--accent);
    }

    .demo-desc {
      margin: 0;
      font-size: 0.88rem;
      color: var(--muted);
      flex: 1;
    }

    .demo-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem;
    }

    .mode {
      font-size: 0.72rem;
      color: var(--muted);
      margin-left: auto;
      text-transform: capitalize;
    }

    .loading,
    .error {
      color: var(--muted);
    }

    .error {
      color: #e8a090;
    }
  `,
})
export class DemoGalleryComponent implements OnInit {
  protected readonly catalog = inject(DemoCatalogService);

  ngOnInit(): void {
    this.catalog.load();
  }
}
