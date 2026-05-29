import { Component, input } from '@angular/core';

@Component({
  selector: 'app-notebook-layout',
  standalone: true,
  template: `
    <section class="notebook" [attr.aria-label]="title() ?? 'Analysis notebook'">
      @if (title()) {
        <header class="notebook-header">
          <h2>{{ title() }}</h2>
          @if (subtitle()) {
            <p>{{ subtitle() }}</p>
          }
        </header>
      }

      <div class="notebook-stack">
        <div class="panel notebook-section">
          <h3 class="section-label">{{ sectionOneLabel() }}</h3>
          <div class="section-body">
            <ng-content select="[notebookSectionOne]" />
          </div>
        </div>

        <div class="panel notebook-section">
          <h3 class="section-label">{{ sectionTwoLabel() }}</h3>
          <div class="section-body">
            <ng-content select="[notebookSectionTwo]" />
          </div>
        </div>

        <div class="panel notebook-section">
          <h3 class="section-label">{{ sectionThreeLabel() }}</h3>
          <div class="section-body">
            <ng-content select="[notebookSectionThree]" />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .notebook {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .notebook-header h2 {
      margin: 0 0 0.25rem;
      font-size: 1.35rem;
      color: var(--accent);
    }

    .notebook-header p {
      margin: 0;
      color: var(--muted);
      font-size: 0.92rem;
    }

    .notebook-stack {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .section-label {
      margin: 0 0 0.5rem;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent);
    }

    .section-body {
      min-height: 5rem;
      color: var(--muted);
      font-size: 0.9rem;
    }

    .notebook-section {
      padding: 0.85rem 1rem;
    }
  `,
})
export class NotebookLayoutComponent {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly sectionOneLabel = input('Section 1 — Inputs');
  readonly sectionTwoLabel = input('Section 2 — Analysis');
  readonly sectionThreeLabel = input('Section 3 — Outputs');
}
