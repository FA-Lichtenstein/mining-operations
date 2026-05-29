export type SimEventKind =
  | 'join_loader_queue'
  | 'load_complete'
  | 'arrive_dump'
  | 'dump_complete'
  | 'return_complete'
  | 'breakdown_end';

export type SimEvent = {
  time: number;
  seq: number;
  kind: SimEventKind;
  haulUnitId: string;
};

export class EventQueue {
  private heap: SimEvent[] = [];
  private seq = 0;

  schedule(time: number, kind: SimEventKind, haulUnitId: string): void {
    this.heap.push({ time, kind, haulUnitId, seq: this.seq++ });
    this.bubbleUp(this.heap.length - 1);
  }

  peek(): SimEvent | undefined {
    return this.heap[0];
  }

  pop(): SimEvent | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }
    const top = this.heap[0]!;
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  get size(): number {
    return this.heap.length;
  }

  private less(a: SimEvent, b: SimEvent): boolean {
    if (a.time !== b.time) {
      return a.time < b.time;
    }
    if (a.seq !== b.seq) {
      return a.seq < b.seq;
    }
    return a.haulUnitId.localeCompare(b.haulUnitId) < 0;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.less(this.heap[i]!, this.heap[parent]!)) {
        break;
      }
      [this.heap[i], this.heap[parent]] = [this.heap[parent]!, this.heap[i]!];
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.less(this.heap[left]!, this.heap[smallest]!)) {
        smallest = left;
      }
      if (right < n && this.less(this.heap[right]!, this.heap[smallest]!)) {
        smallest = right;
      }
      if (smallest === i) {
        break;
      }
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest]!, this.heap[i]!];
      i = smallest;
    }
  }
}
