import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  clamp,
  progressRatio,
  progressPercent,
  hasProgressTarget,
  progressLabel,
  formatDate,
  daysUntil,
  dueDateMeta,
  exportFilename,
} from '@/modules/kanban/kanban.utils';

describe('kanban.utils numeric helpers', () => {
  it('clamp keeps values within bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });

  it('progressRatio clamps current/target into [0,1]', () => {
    expect(progressRatio({ current: 5, target: 10, unit: '' })).toBe(0.5);
    expect(progressRatio({ current: 20, target: 10, unit: '' })).toBe(1);
    expect(progressRatio({ current: 3, target: 0, unit: '' })).toBe(0);
  });

  it('progressPercent rounds to a whole number', () => {
    expect(progressPercent({ current: 1, target: 3, unit: '' })).toBe(33);
    expect(progressPercent({ current: 10, target: 10, unit: '' })).toBe(100);
  });

  it('hasProgressTarget is true only for a positive target', () => {
    expect(hasProgressTarget({ current: 1, target: 5, unit: '' })).toBe(true);
    expect(hasProgressTarget({ current: 1, target: 0, unit: '' })).toBe(false);
  });

  it('progressLabel omits an empty unit', () => {
    expect(progressLabel({ current: 10, target: 46, unit: 'Cafés' })).toBe('10/46 Cafés');
    expect(progressLabel({ current: 1, target: 2, unit: '' })).toBe('1/2');
  });
});

describe('kanban.utils date helpers', () => {
  it('formatDate renders a readable date and handles empty/invalid input', () => {
    expect(formatDate('2025-06-12')).toBe('12 Jun 2025');
    expect(formatDate('')).toBe('');
    expect(formatDate('not-a-date')).toBe('');
  });

  it('daysUntil returns null for unset/invalid dates', () => {
    expect(daysUntil('')).toBeNull();
    expect(daysUntil('nope')).toBeNull();
  });

  it('dueDateMeta classifies overdue / soon / normal', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-12T00:00:00Z'));

    expect(dueDateMeta('2025-06-10')?.tone).toBe('overdue');
    expect(dueDateMeta('2025-06-13')?.tone).toBe('soon');
    expect(dueDateMeta('2025-07-01')?.tone).toBe('normal');
    expect(dueDateMeta('')).toBeNull();

    vi.useRealTimers();
  });
});

describe('kanban.utils exportFilename', () => {
  afterEach(() => vi.useRealTimers());

  it('prefixes the date in yyyy-mm-dd', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-12T10:00:00Z'));
    expect(exportFilename()).toBe('kanban-2025-06-12.json');
  });
});
