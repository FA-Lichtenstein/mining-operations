import { Component, inject, input, output } from '@angular/core';
import { HAULAGE_DEMO_CHECKLIST } from '../content/haulage-demo-checklist';
import { HaulagePresenterStateService } from '../services/haulage-presenter-state.service';

@Component({
  selector: 'app-haulage-presenter-panel',
  standalone: true,
  template: `
    @if (open()) {
      <aside
        class="presenter panel"
        role="region"
        aria-labelledby="haulage-presenter-heading"
      >
        <header class="presenter-header">
          <div>
            <h3 id="haulage-presenter-heading">Presenter mode</h3>
            <p class="presenter-lead">
              5-minute narrative walkthrough · tick rehearsal prompts locally
            </p>
            <p class="progress" aria-live="polite">
              {{ presenter.checkedCount() }} / {{ presenter.totalCount() }} complete
            </p>
          </div>
          <div class="header-actions">
            <button type="button" class="btn btn-ghost" (click)="presenter.resetAll()">
              Reset
            </button>
            <button type="button" class="btn btn-ghost" (click)="closed.emit()">Close</button>
          </div>
        </header>

        <div class="drawer-content">
          @for (section of checklist; track section.id) {
            <section class="check-section">
              <h4>
                <span class="time">{{ section.timeRange }}</span>
                {{ section.title }}
              </h4>
              @for (para of section.paragraphs; track para) {
                <p class="walkthrough-copy">{{ para }}</p>
              }
              <ul class="checklist">
                @for (item of section.items; track item.id) {
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        [checked]="presenter.isChecked(item.id)"
                        (change)="presenter.toggle(item.id)"
                      />
                      <span>{{ item.label }}</span>
                    </label>
                  </li>
                }
              </ul>
            </section>
          }

          <p class="presenter-note">
            Official roles only: Quantitative Planning Analyst and Technical Services superintendent.
            Mirrors <code>docs/projects/haulage-des/demo-checklist.md</code>.
          </p>
        </div>
      </aside>
    }
  `,
  styles: `
    .presenter {
      margin-bottom: 0.75rem;
      padding: 1rem 1.1rem;
    }

    .presenter-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }

    .drawer-content {
      max-height: min(62vh, 38rem);
      overflow-y: auto;
      padding-right: 0.25rem;
    }

    .presenter-header h3 {
      margin: 0 0 0.2rem;
      font-size: 1.05rem;
      color: var(--accent);
    }

    .presenter-lead,
    .progress {
      margin: 0;
      font-size: 0.82rem;
      color: var(--muted);
    }

    .progress {
      margin-top: 0.25rem;
      font-weight: 600;
      color: var(--accent);
    }

    .header-actions {
      display: flex;
      gap: 0.35rem;
      flex-shrink: 0;
    }

    .btn-ghost {
      background: transparent;
      border-color: var(--border);
      font-size: 0.82rem;
      padding: 0.3rem 0.6rem;
    }

    .check-section {
      margin-bottom: 0.85rem;
    }

    .check-section h4 {
      margin: 0 0 0.35rem;
      font-size: 0.88rem;
      color: var(--text);
    }

    .walkthrough-copy {
      margin: 0 0 0.45rem;
      font-size: 0.85rem;
      color: var(--muted);
      line-height: 1.5;
    }

    .time {
      display: inline-block;
      min-width: 5.5rem;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--accent);
      margin-right: 0.35rem;
    }

    .checklist {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .checklist li {
      margin-bottom: 0.35rem;
    }

    label {
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
      font-size: 0.85rem;
      color: var(--muted);
      cursor: pointer;
    }

    input[type='checkbox'] {
      margin-top: 0.2rem;
      accent-color: var(--accent);
      flex-shrink: 0;
    }

    label:has(input:checked) span {
      color: var(--text);
      text-decoration: line-through;
      opacity: 0.75;
    }

    .presenter-note {
      margin: 0.5rem 0 0;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border);
      font-size: 0.78rem;
      color: var(--muted);
    }

    code {
      font-size: 0.76rem;
      color: var(--accent);
    }
  `,
})
export class HaulagePresenterPanelComponent {
  readonly open = input(false);
  readonly closed = output<void>();

  protected readonly checklist = HAULAGE_DEMO_CHECKLIST;
  protected readonly presenter = inject(HaulagePresenterStateService);
}
