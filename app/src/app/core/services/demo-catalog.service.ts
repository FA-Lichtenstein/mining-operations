import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { DemoCatalogEntry } from '../models/demo-catalog';

@Injectable({ providedIn: 'root' })
export class DemoCatalogService {
  private readonly http = inject(HttpClient);

  readonly entries = signal<DemoCatalogEntry[]>([]);
  readonly loaded = signal(false);
  readonly error = signal<string | null>(null);

  load(): void {
    if (this.loaded()) {
      return;
    }

    this.http.get<DemoCatalogEntry[]>('/assets/catalog/demos.json').subscribe({
      next: (entries) => {
        this.entries.set(entries);
        this.loaded.set(true);
      },
      error: () => {
        this.error.set('Could not load demo catalog.');
        this.loaded.set(true);
      },
    });
  }

  getById(id: string): DemoCatalogEntry | undefined {
    return this.entries().find((entry) => entry.id === id);
  }
}
