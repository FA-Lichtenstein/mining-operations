import { Component, input, output } from '@angular/core';
import { HAULAGE_STUDY_SECTIONS } from '../content/haulage-study-content';
import { HaulageCitationChipsComponent } from './haulage-citation-chips.component';

@Component({
  selector: 'app-haulage-study-drawer',
  standalone: true,
  imports: [HaulageCitationChipsComponent],
  template: `
    @if (open()) {
      <aside
        class="study-drawer panel"
        role="region"
        aria-labelledby="haulage-study-heading"
      >
        <header class="study-header">
          <div>
            <h3 id="haulage-study-heading">Background / Study</h3>
            <p class="study-lead">
              syn-pgm-bushveld-01 · aligned with project brief · role-based personas only
            </p>
          </div>
          <button type="button" class="btn btn-ghost" (click)="closed.emit()">Close</button>
        </header>

        @for (section of sections; track section.id) {
          <article class="study-section" [id]="'study-' + section.id">
            <h4>{{ section.title }}</h4>
            @for (para of section.paragraphs; track para) {
              <p>{{ para }}</p>
            }
            @if (section.listItems?.length) {
              <ul>
                @for (item of section.listItems; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            }
            @if (section.citationIds; as citeIds) {
              <app-haulage-citation-chips [ids]="citeIds" />
            }
          </article>
        }

        <footer class="study-footer">
          <p>
            Docs mirror:
            <code>docs/projects/haulage-des/narrative-redesign.md</code> and
            <code>docs/projects/haulage-des/demo-checklist.md</code>.
          </p>
        </footer>
      </aside>
    }
  `,
  styles: `
    .study-drawer {
      margin-bottom: 0.75rem;
      padding: 1rem 1.1rem;
      max-height: min(70vh, 42rem);
      overflow-y: auto;
    }

    .study-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      position: sticky;
      top: 0;
      background: var(--bg-panel);
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
      z-index: 1;
    }

    .study-header h3 {
      margin: 0 0 0.2rem;
      font-size: 1.05rem;
      color: var(--accent);
    }

    .study-lead {
      margin: 0;
      font-size: 0.82rem;
      color: var(--muted);
    }

    .btn-ghost {
      flex-shrink: 0;
      background: transparent;
      border-color: var(--border);
      font-size: 0.82rem;
      padding: 0.3rem 0.6rem;
    }

    .study-section {
      margin-bottom: 1rem;
    }

    .study-section h4 {
      margin: 0 0 0.35rem;
      font-size: 0.92rem;
      color: var(--text);
    }

    .study-section p,
    .study-section li {
      margin: 0 0 0.45rem;
      font-size: 0.88rem;
      color: var(--muted);
      line-height: 1.5;
    }

    .study-section ul {
      margin: 0.25rem 0 0.5rem;
      padding-left: 1.15rem;
    }

    .study-footer {
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border);
      font-size: 0.78rem;
      color: var(--muted);
    }

    .study-footer p {
      margin: 0;
    }

    code {
      font-size: 0.76rem;
      color: var(--accent);
    }
  `,
})
export class HaulageStudyDrawerComponent {
  readonly open = input(false);
  readonly closed = output<void>();

  protected readonly sections = HAULAGE_STUDY_SECTIONS;
}
