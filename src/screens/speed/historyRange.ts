import type { DemoSpeedRecord } from '../../services/speed/DemoSpeedTest';

export type HistoryRange = 'day' | 'week' | 'month';

const rangeMs: Record<HistoryRange, number> = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
};

export function filterDemoHistory(
  history: readonly DemoSpeedRecord[],
  range: HistoryRange,
  now: number,
): DemoSpeedRecord[] {
  const windowMs = rangeMs[range];
  return history.filter(record => now - record.completedAt <= windowMs);
}

export function speedBackAction(
  showingPlaceholder: boolean,
): 'speed' | 'previous' {
  return showingPlaceholder ? 'speed' : 'previous';
}
