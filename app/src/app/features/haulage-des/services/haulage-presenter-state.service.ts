import { Injectable, signal } from '@angular/core';
import { HAULAGE_CHECKLIST_ITEM_IDS } from '../content/haulage-demo-checklist';

const STORAGE_KEY = 'haulage-des-presenter-checklist-v1';

@Injectable({ providedIn: 'root' })
export class HaulagePresenterStateService {
  private readonly checked = signal<ReadonlySet<string>>(this.load());

  readonly checkedIds = this.checked.asReadonly();

  isChecked(id: string): boolean {
    return this.checked().has(id);
  }

  toggle(id: string): void {
    const next = new Set(this.checked());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.checked.set(next);
    this.persist(next);
  }

  resetAll(): void {
    this.checked.set(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private browsing */
    }
  }

  checkedCount(): number {
    return this.checked().size;
  }

  totalCount(): number {
    return HAULAGE_CHECKLIST_ITEM_IDS.length;
  }

  private load(): Set<string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return new Set();
      }
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return new Set();
      }
      const valid = new Set(HAULAGE_CHECKLIST_ITEM_IDS);
      return new Set(parsed.filter((id): id is string => typeof id === 'string' && valid.has(id)));
    } catch {
      return new Set();
    }
  }

  private persist(set: Set<string>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch {
      /* quota / private mode */
    }
  }
}
