import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { HaulageWorkbenchService } from '../services/haulage-workbench.service';

@Component({
  selector: 'app-haulage-sim-schematic',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="schematic-wrap">
      <svg #svgRoot class="schematic" aria-label="Load haul dump schematic"></svg>
      <div class="queue-bar">
        <span>Animation queue preview</span>
        <div class="queue-track">
          <div class="queue-fill" [style.width.%]="queuePct()"></div>
        </div>
        <span class="queue-val">{{ wb.runProgressQueuePreview() | number: '1.1-1' }}</span>
      </div>
      <p class="phase-label">Phase: {{ phaseLabel() }}</p>
    </div>
  `,
  styles: `
    .schematic-wrap {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .schematic {
      width: 100%;
      height: 200px;
      display: block;
    }

    .queue-bar {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 0.5rem;
      align-items: center;
      font-size: 0.8rem;
      color: var(--muted);
    }

    .queue-track {
      height: 8px;
      background: var(--border);
      border-radius: 4px;
      overflow: hidden;
    }

    .queue-fill {
      height: 100%;
      background: var(--warn);
      transition: width 0.2s ease;
    }

    .queue-val {
      min-width: 3.5rem;
      text-align: right;
      color: var(--text);
    }

    .phase-label {
      margin: 0;
      font-size: 0.82rem;
      color: var(--accent);
    }
  `,
})
export class HaulageSimSchematicComponent implements AfterViewInit, OnDestroy {
  protected readonly wb = inject(HaulageWorkbenchService);
  private readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svgRoot');
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private haulUnit!: d3.Selection<SVGCircleElement, unknown, null, undefined>;
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      const phase = this.wb.simPhase();
      const pct = this.wb.progressPct();
      const cfg = this.wb.config();
      if (!this.svg || !cfg) {
        return;
      }
      this.drawZones(cfg.zones.load_zone, cfg.zones.dump_zone);
      this.moveHaulUnit(phase, pct);
    });
  }

  ngAfterViewInit(): void {
    const el = this.svgRef()?.nativeElement;
    if (!el) {
      return;
    }
    this.svg = d3.select(el);

    this.resizeObserver = new ResizeObserver(() => this.redraw());
    this.resizeObserver.observe(el.parentElement ?? el);
    this.redraw();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  protected queuePct(): number {
    const q = this.wb.runProgressQueuePreview();
    const max = Math.max(8, (this.wb.config()?.fleet.haul_unit_count ?? 10) * 0.5);
    return Math.min(100, (q / max) * 100);
  }

  protected phaseLabel(): string {
    const labels: Record<string, string> = {
      queue: 'Queue at loader',
      load: 'Load / spot',
      haul: 'Haul loaded',
      dump: 'Dump / eject',
      return: 'Return empty',
      idle: 'Idle / complete',
    };
    return labels[this.wb.simPhase()] ?? 'Idle';
  }

  private redraw(): void {
    const cfg = this.wb.config();
    if (!cfg) {
      return;
    }
    this.drawZones(cfg.zones.load_zone, cfg.zones.dump_zone);
    this.moveHaulUnit(this.wb.simPhase(), this.wb.progressPct());
  }

  private drawZones(loadZone: string, dumpZone: string): void {
    const el = this.svgRef()?.nativeElement;
    if (!el) {
      return;
    }
    const w = el.clientWidth || 400;
    const h = el.clientHeight || 200;
    this.svg.selectAll('*').remove();

    const pad = 24;
    const roadY = h / 2;
    const loadX = pad + 50;
    const dumpX = w - pad - 50;

    this.svg
      .append('rect')
      .attr('x', pad)
      .attr('y', roadY - 36)
      .attr('width', 90)
      .attr('height', 72)
      .attr('rx', 6)
      .attr('fill', '#1e2a22')
      .attr('stroke', '#4a7a96');

    this.svg
      .append('text')
      .attr('x', pad + 45)
      .attr('y', roadY - 42)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8b8b95')
      .attr('font-size', 10)
      .text('LOAD');

    this.svg
      .append('text')
      .attr('x', pad + 45)
      .attr('y', roadY + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ececee')
      .attr('font-size', 9)
      .text(truncate(loadZone, 14));

    this.svg
      .append('line')
      .attr('x1', loadX + 50)
      .attr('y1', roadY)
      .attr('x2', dumpX - 50)
      .attr('y2', roadY)
      .attr('stroke', '#4a4a55')
      .attr('stroke-width', 6)
      .attr('stroke-dasharray', '8 6');

    this.svg
      .append('text')
      .attr('x', (loadX + dumpX) / 2)
      .attr('y', roadY - 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8b8b95')
      .attr('font-size', 10)
      .text('HAUL ROAD');

    this.svg
      .append('rect')
      .attr('x', w - pad - 90)
      .attr('y', roadY - 36)
      .attr('width', 90)
      .attr('height', 72)
      .attr('rx', 6)
      .attr('fill', '#2a2218')
      .attr('stroke', '#c45c00');

    this.svg
      .append('text')
      .attr('x', dumpX)
      .attr('y', roadY - 42)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8b8b95')
      .attr('font-size', 10)
      .text('DUMP');

    this.svg
      .append('text')
      .attr('x', dumpX)
      .attr('y', roadY + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ececee')
      .attr('font-size', 9)
      .text(truncate(dumpZone, 14));

    this.haulUnit = this.svg
      .append('circle')
      .attr('r', 10)
      .attr('fill', '#7eb8da')
      .attr('stroke', '#ececee')
      .attr('stroke-width', 1.5);
  }

  private moveHaulUnit(phase: string, pct: number): void {
    const el = this.svgRef()?.nativeElement;
    if (!el || !this.haulUnit) {
      return;
    }
    const w = el.clientWidth || 400;
    const h = el.clientHeight || 200;
    const roadY = h / 2;
    const pad = 24;
    const loadX = pad + 50;
    const dumpX = w - pad - 50;
    const span = dumpX - loadX;

    let t = pct / 100;
    if (phase === 'queue' || phase === 'load') {
      t = 0.05 + t * 0.15;
    } else if (phase === 'haul') {
      t = 0.2 + t * 0.35;
    } else if (phase === 'dump') {
      t = 0.75 + t * 0.1;
    } else if (phase === 'return') {
      t = 0.85 - t * 0.35;
    } else if (phase === 'idle' && this.wb.lastRun()) {
      t = 0.5;
    }

    const x = loadX + span * Math.max(0, Math.min(1, t));
    this.haulUnit
      .transition()
      .duration(180)
      .attr('cx', x)
      .attr('cy', roadY);
  }
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}
