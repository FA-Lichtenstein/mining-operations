import { Component, model } from '@angular/core';

@Component({
  selector: 'app-haulage-context-toolbar',
  standalone: true,
  template: `
    <div class="context-toolbar" role="toolbar" aria-label="Study and presenter tools">
      <button
        type="button"
        class="btn"
        [class.active]="studyOpen()"
        [attr.aria-pressed]="studyOpen()"
        (click)="toggleStudy()"
      >
        Background / Study
      </button>
      <button
        type="button"
        class="btn"
        [class.active]="presenterOpen()"
        [attr.aria-pressed]="presenterOpen()"
        (click)="togglePresenter()"
      >
        Presenter mode
      </button>
      <span class="toolbar-hint">
        Technical Services superintendent · Quantitative Planning Analyst · syn-pgm-bushveld-01
      </span>
    </div>
  `,
  styles: `
    .context-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.65rem;
    }

    .btn.active {
      border-color: var(--accent);
      background: rgba(126, 184, 218, 0.22);
    }

    .toolbar-hint {
      flex: 1 1 12rem;
      font-size: 0.78rem;
      color: var(--muted);
      text-align: right;
    }

    @media (max-width: 640px) {
      .toolbar-hint {
        flex-basis: 100%;
        text-align: left;
      }
    }
  `,
})
export class HaulageContextToolbarComponent {
  readonly studyOpen = model(false);
  readonly presenterOpen = model(false);

  protected toggleStudy(): void {
    const next = !this.studyOpen();
    this.studyOpen.set(next);
    if (next) {
      this.presenterOpen.set(false);
    }
  }

  protected togglePresenter(): void {
    const next = !this.presenterOpen();
    this.presenterOpen.set(next);
    if (next) {
      this.studyOpen.set(false);
    }
  }
}
