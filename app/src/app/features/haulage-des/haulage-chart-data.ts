import type { EChartsOption } from 'echarts';
import type { DesCycleRecord } from './engine/types';

const CHART_THEME = {
  text: '#8b8b95',
  line: '#7eb8da',
  accent: '#c45c00',
  grid: '#2a2a32',
};

export function buildQueueDepthSeries(cycles: DesCycleRecord[]): EChartsOption {
  const window = 12;
  const x: string[] = [];
  const y: number[] = [];
  for (let i = 0; i < cycles.length; i++) {
    const slice = cycles.slice(Math.max(0, i - window + 1), i + 1);
    const avgQ = slice.reduce((s, c) => s + c.queue_wait_min, 0) / slice.length;
    x.push(String(i + 1));
    y.push(round2(avgQ));
  }
  return {
    backgroundColor: 'transparent',
    grid: { left: 48, right: 16, top: 28, bottom: 32 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: x,
      name: 'Cycle #',
      nameTextStyle: { color: CHART_THEME.text },
      axisLabel: { color: CHART_THEME.text, interval: Math.max(0, Math.floor(x.length / 8) - 1) },
      axisLine: { lineStyle: { color: CHART_THEME.grid } },
    },
    yAxis: {
      type: 'value',
      name: 'Queue wait (min)',
      nameTextStyle: { color: CHART_THEME.text },
      axisLabel: { color: CHART_THEME.text },
      splitLine: { lineStyle: { color: CHART_THEME.grid } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: y,
        areaStyle: { color: 'rgba(126, 184, 218, 0.15)' },
        lineStyle: { color: CHART_THEME.line },
        itemStyle: { color: CHART_THEME.line },
      },
    ],
  };
}

export function buildThroughputByShift(
  cycles: DesCycleRecord[],
  shiftHours: number,
): EChartsOption {
  const byShift = new Map<number, number>();
  for (const c of cycles) {
    byShift.set(c.shift_index, (byShift.get(c.shift_index) ?? 0) + c.payload_t);
  }
  const keys = [...byShift.keys()].sort((a, b) => a - b);
  const tpd = keys.map((k) => {
    const t = byShift.get(k) ?? 0;
    return round1(t * (24 / shiftHours));
  });
  return {
    backgroundColor: 'transparent',
    grid: { left: 48, right: 16, top: 28, bottom: 32 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: keys.map((k) => `Shift ${k + 1}`),
      axisLabel: { color: CHART_THEME.text },
      axisLine: { lineStyle: { color: CHART_THEME.grid } },
    },
    yAxis: {
      type: 'value',
      name: 't/d (illustrative)',
      nameTextStyle: { color: CHART_THEME.text },
      axisLabel: { color: CHART_THEME.text },
      splitLine: { lineStyle: { color: CHART_THEME.grid } },
    },
    series: [
      {
        type: 'bar',
        data: tpd,
        itemStyle: { color: CHART_THEME.line },
      },
    ],
  };
}

export function buildCycleTimeHistogram(cycles: DesCycleRecord[]): EChartsOption {
  const times = cycles.map(
    (c) =>
      c.queue_wait_min +
      c.spotting_min +
      c.load_min +
      c.haul_min +
      c.dump_min +
      c.return_min,
  );
  const bins = histogram(times, 14);
  return {
    backgroundColor: 'transparent',
    grid: { left: 48, right: 16, top: 28, bottom: 32 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: bins.labels,
      name: 'Cycle time (min)',
      nameTextStyle: { color: CHART_THEME.text },
      axisLabel: { color: CHART_THEME.text, rotate: 30 },
      axisLine: { lineStyle: { color: CHART_THEME.grid } },
    },
    yAxis: {
      type: 'value',
      name: 'Cycles',
      nameTextStyle: { color: CHART_THEME.text },
      axisLabel: { color: CHART_THEME.text },
      splitLine: { lineStyle: { color: CHART_THEME.grid } },
    },
    series: [
      {
        type: 'bar',
        data: bins.counts,
        itemStyle: { color: CHART_THEME.accent },
      },
    ],
  };
}

function histogram(values: number[], binCount: number): { labels: string[]; counts: number[] } {
  if (values.length === 0) {
    return { labels: ['—'], counts: [0] };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / binCount || 1;
  const counts = Array(binCount).fill(0);
  const labels: string[] = [];
  for (let i = 0; i < binCount; i++) {
    const lo = min + i * width;
    labels.push(`${round1(lo)}`);
    for (const v of values) {
      if (v >= lo && (i === binCount - 1 || v < lo + width)) {
        counts[i]++;
      }
    }
  }
  return { labels, counts };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
