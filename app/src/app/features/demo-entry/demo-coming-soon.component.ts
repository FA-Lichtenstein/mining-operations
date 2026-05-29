import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DemoCatalogService } from '../../core/services/demo-catalog.service';
import { DemoCatalogEntry } from '../../core/models/demo-catalog';
import { NotebookLayoutComponent } from '../../shared/notebook-layout/notebook-layout.component';
import { WorkbenchLayoutComponent } from '../../shared/workbench-layout/workbench-layout.component';

@Component({
  selector: 'app-demo-coming-soon',
  standalone: true,
  imports: [RouterLink, NotebookLayoutComponent, WorkbenchLayoutComponent],
  template: `
    <nav class="demo-nav">
      <a routerLink="/">← Gallery</a>
    </nav>

    @if (demo(); as entry) {
      <header class="coming-header">
        <h1>{{ entry.title }}</h1>
        <p class="badge">Coming soon</p>
        <p>{{ entry.description }}</p>
        <div class="tags">
          @for (tag of entry.themeTags; track tag) {
            <span class="tag">{{ tag }}</span>
          }
        </div>
      </header>

      @if (entry.presentationMode === 'workbench') {
        <app-workbench-layout
          [title]="entry.title"
          subtitle="Layout preview — implementation planned in a future PR"
        >
          <p workbenchControls>Controls panel placeholder.</p>
          <p workbenchSimulation>Simulation panel placeholder.</p>
          <p workbenchCharts>Charts panel placeholder.</p>
          <p workbenchMetrics>Metrics panel placeholder.</p>
        </app-workbench-layout>
      } @else {
        <app-notebook-layout
          [title]="entry.title"
          subtitle="Layout preview — implementation planned in a future PR"
        >
          <p notebookSectionOne>Inputs section placeholder.</p>
          <p notebookSectionTwo>Analysis section placeholder.</p>
          <p notebookSectionThree>Outputs section placeholder.</p>
        </app-notebook-layout>
      }
    } @else {
      <h1>Demo not found</h1>
      <p>No catalog entry matches <code>{{ demoId() }}</code>.</p>
      <a class="btn" routerLink="/">Return to gallery</a>
    }
  `,
  styles: `
    .demo-nav {
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .coming-header h1 {
      margin: 0 0 0.35rem;
      font-size: 1.4rem;
      color: var(--accent);
    }

    .badge {
      display: inline-block;
      margin: 0 0 0.75rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
    }

    .coming-header > p:not(.badge) {
      color: var(--muted);
      max-width: 40rem;
    }

    .tags {
      margin: 0.75rem 0 1.25rem;
    }

    code {
      font-family: ui-monospace, Consolas, monospace;
      background: var(--bg-panel);
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
    }
  `,
})
export class DemoComingSoonComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(DemoCatalogService);

  protected readonly demoId = signal('');
  protected readonly demo = signal<DemoCatalogEntry | null>(null);

  ngOnInit(): void {
    this.catalog.load();
    const id = this.route.snapshot.paramMap.get('demoId') ?? '';
    this.demoId.set(id);

    const resolve = (): void => {
      const entry = this.catalog.getById(id);
      this.demo.set(entry ?? null);
    };

    if (this.catalog.loaded()) {
      resolve();
    } else {
      const check = setInterval(() => {
        if (this.catalog.loaded()) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    }
  }
}
