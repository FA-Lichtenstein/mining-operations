import { Injectable } from '@angular/core';
import type { HaulageDesRunRecord } from '../haulage-run.types';

const DB_NAME = 'mining-portfolio';
const DB_VERSION = 1;
const STORE = 'haulageDesRuns';

@Injectable({ providedIn: 'root' })
export class HaulageRunStoreService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  async listRuns(limit = 20): Promise<HaulageDesRunRecord[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const store = tx.objectStore(STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const rows = (req.result as HaulageDesRunRecord[]).sort(
          (a, b) => b.createdAt.localeCompare(a.createdAt),
        );
        resolve(rows.slice(0, limit));
      };
      req.onerror = () => reject(req.error);
    });
  }

  async putRun(record: HaulageDesRunRecord): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async deleteRun(runId: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(runId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private open(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) {
            db.createObjectStore(STORE, { keyPath: 'runId' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return this.dbPromise;
  }
}
